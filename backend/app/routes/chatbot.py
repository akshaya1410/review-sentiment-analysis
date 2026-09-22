from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List
from app.services.prediction import predict_single_review
from app.services.chatbot import generate_restaurant_response, detect_aspects
from app.services.model_service import model_service

router = APIRouter(prefix="/api/chatbot", tags=["AI Restaurant Chatbot Assistant"])

class ChatbotRequest(BaseModel):
    review: str = Field(..., example="The pizza was delicious and service was fast!", min_length=2)
    customer_name: Optional[str] = Field("Valued Guest", example="John")
    domain: Optional[str] = Field("restaurant", example="restaurant")

class ChatbotResponse(BaseModel):
    domain: str
    sentiment: str
    confidence: float
    detected_aspects: List[str]
    response: str
    action_recommended: str
    voucher_code: Optional[str] = None
    review: str
    customer_name: str

@router.post(
    "/respond",
    response_model=ChatbotResponse,
    summary="Generate automated AI restaurant manager reply to customer review",
    description="Analyzes customer review sentiment, extracts dining aspects (food, service, hygiene, price), and generates an executive manager response."
)
def respond_to_review(payload: ChatbotRequest):
    review_text = payload.review.strip()
    domain = (payload.domain or "restaurant").lower().strip()

    if not review_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review text cannot be empty."
        )

    if not model_service.is_loaded(domain=domain):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Sentiment ML model for domain '{domain}' is not loaded."
        )

    try:
        # Step 1: Predict sentiment using ML model
        pred = predict_single_review(review_text, domain=domain)
        sentiment = pred["sentiment"]
        confidence = pred["confidence"]

        # Step 2: Extract aspects
        aspects = detect_aspects(review_text)

        # Step 3: Generate response
        bot_res = generate_restaurant_response(
            review_text=review_text,
            sentiment=sentiment,
            confidence=confidence,
            customer_name=payload.customer_name or "Valued Guest",
            aspects=aspects
        )

        return ChatbotResponse(
            domain=domain,
            sentiment=sentiment,
            confidence=confidence,
            detected_aspects=bot_res["detected_aspects"],
            response=bot_res["response"],
            action_recommended=bot_res["action_recommended"],
            voucher_code=bot_res.get("voucher_code"),
            review=review_text,
            customer_name=payload.customer_name or "Valued Guest"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate chatbot response: {str(e)}"
        )
