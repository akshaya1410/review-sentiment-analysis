from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import PredictRequest, PredictResponse, HistoryItem, HistoryCreate
from app.services.prediction import predict_single_review
from app.services.model_service import model_service
from app.database import get_db
from app.models import PredictionHistory

router = APIRouter(prefix="/api", tags=["Sentiment Analysis & History"])

@router.post(
    "/predict",
    response_model=PredictResponse,
    summary="Analyze sentiment of a single review (Movie or Restaurant)"
)
def predict_sentiment(payload: PredictRequest, db: Session = Depends(get_db)):
    raw_text = payload.review.strip()
    domain = (payload.domain or "movie").lower().strip()

    if not raw_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review text cannot be empty or blank space."
        )

    if len(raw_text) > 10000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Review text exceeds maximum allowed length of 10,000 characters."
        )

    if not model_service.is_loaded(domain=domain):
        raise HTTPException(
            status_code=status.HTTP_533_SERVICE_UNAVAILABLE if hasattr(status, 'HTTP_533_SERVICE_UNAVAILABLE') else 503,
            detail=f"Sentiment ML model for domain '{domain}' is not loaded. Please train models first."
        )

    try:
        res = predict_single_review(raw_text, domain=domain)
        
        # Save prediction to history automatically
        db_entry = PredictionHistory(
            domain=res["domain"],
            review=res["review"],
            cleaned_review=res["cleaned_review"],
            sentiment=res["sentiment"],
            confidence=res["confidence"],
            model_name=res["model"]
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)

        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Sentiment prediction failed: {str(e)}"
        )

@router.get(
    "/history",
    response_model=List[HistoryItem],
    summary="Get recent manual prediction history"
)
def get_prediction_history(domain: Optional[str] = None, limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(PredictionHistory)
    if domain:
        query = query.filter(PredictionHistory.domain == domain.lower().strip())
    history = query.order_by(PredictionHistory.id.desc()).limit(limit).all()
    return history

@router.post(
    "/history",
    response_model=HistoryItem,
    summary="Save a custom prediction history record"
)
def save_prediction_history(payload: HistoryCreate, db: Session = Depends(get_db)):
    db_entry = PredictionHistory(
        domain=payload.domain or "movie",
        review=payload.review,
        cleaned_review=payload.cleaned_review,
        sentiment=payload.sentiment,
        confidence=payload.confidence,
        model_name=payload.model_name
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete(
    "/history",
    summary="Clear prediction history"
)
def clear_prediction_history(domain: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PredictionHistory)
    if domain:
        query = query.filter(PredictionHistory.domain == domain.lower().strip())
    query.delete()
    db.commit()
    return {"message": "Prediction history cleared successfully."}
