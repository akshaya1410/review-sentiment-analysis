import re
import random
from typing import Dict, Any, List
from app.services.prediction import predict_single_review

ASPECT_KEYWORDS = {
    "food_quality": ["food", "dish", "taste", "delicious", "flavor", "cooked", "steak", "pizza", "burger", "pasta", "sushi", "salmon", "salad", "tacos", "cold", "bland", "raw", "overcooked", "burnt", "stale", "tasty"],
    "service": ["service", "staff", "waiter", "waitress", "server", "manager", "polite", "friendly", "attentive", "rude", "slow", "ignored", "waited", "waiting", "host", "help"],
    "ambience": ["atmosphere", "ambiance", "music", "lighting", "seating", "table", "cozy", "noisy", "loud", "decor", "environment", "cleanliness", "view"],
    "price_value": ["price", "cost", "expensive", "cheap", "overpriced", "worth", "value", "bill", "money", "charged", "portion"],
    "hygiene": ["clean", "hygiene", "dirty", "stain", "hair", "cockroach", "smell", "sanitized", "washroom"]
}

POSITIVE_GREETINGS = [
    "Thank you so much for your wonderful review!",
    "We are thrilled to hear about your great experience with us!",
    "Thank you for dining with us and sharing your kind words!",
    "We are delighted that you enjoyed your meal with us!"
]

NEGATIVE_GREETINGS = [
    "Thank you for bringing this to our attention.",
    "We sincerely apologize for your disappointing experience.",
    "We are truly sorry that your visit did not meet your expectations.",
    "We apologize for failing to deliver the high-standard experience you deserved."
]

def detect_aspects(text: str) -> List[str]:
    """Detects dining aspects mentioned in the customer review."""
    text_lower = text.lower()
    detected = []
    for aspect, keywords in ASPECT_KEYWORDS.items():
        if any(re.search(rf'\b{re.escape(kw)}\b', text_lower) for kw in keywords):
            detected.append(aspect)
    return detected if detected else ["general_experience"]

def generate_restaurant_response(
    review_text: str,
    sentiment: str,
    confidence: float,
    customer_name: str = "Valued Guest",
    aspects: List[str] = None
) -> Dict[str, Any]:
    """
    Generates an automated, professional, empathetic restaurant manager response tailored to customer review.
    """
    if aspects is None:
        aspects = detect_aspects(review_text)

    name = customer_name.strip() if customer_name and customer_name.strip() else "Valued Guest"
    is_positive = sentiment.lower() == "positive"
    voucher_code = None

    if is_positive:
        greeting = random.choice(POSITIVE_GREETINGS)
        
        # Build tailored body based on detected aspects
        aspect_notes = []
        if "food_quality" in aspects:
            aspect_notes.append("Our culinary team is overjoyed to know you loved the taste and quality of your meal!")
        if "service" in aspects:
            aspect_notes.append("We will certainly pass along your praise to our service staff for making your visit memorable.")
        if "ambience" in aspects:
            aspect_notes.append("We are glad you enjoyed the ambiance and comfortable environment of our restaurant.")
        if "price_value" in aspects:
            aspect_notes.append("Providing generous, high-value meals to our guests is always our top priority.")

        body = " ".join(aspect_notes) if aspect_notes else "We take great pride in delivering memorable dining experiences to every guest."
        
        voucher_code = f"LOYALTY-{random.randint(1000, 9999)}"
        closing = f"As a token of our appreciation, please use coupon code '{voucher_code}' for 15% OFF on your next visit! We look forward to welcoming you back soon."

        full_response = f"Dear {name},\n\n{greeting} {body}\n\n{closing}\n\nWarm regards,\nRestaurant Operations Team"

        return {
            "sentiment": "Positive",
            "confidence": confidence,
            "detected_aspects": aspects,
            "response": full_response,
            "action_recommended": "Send Thank-You & Loyalty Coupon",
            "voucher_code": voucher_code
        }

    else:
        greeting = random.choice(NEGATIVE_GREETINGS)
        
        # Build tailored apology body based on detected complaints
        apology_notes = []
        if "food_quality" in aspects:
            apology_notes.append("We deeply regret that the food quality, temperature, or flavor did not meet our high standards.")
        if "service" in aspects:
            apology_notes.append("Please accept our sincere apologies for the delay or unsatisfactory service from our team. We are retraining our service staff to ensure this never happens again.")
        if "hygiene" in aspects:
            apology_notes.append("We take cleanliness and food hygiene with utmost seriousness and have initiated an immediate review with our kitchen staff.")
        if "price_value" in aspects:
            apology_notes.append("We strive to offer great value, and we regret that your experience did not feel worth the price.")

        body = " ".join(apology_notes) if apology_notes else "We take full responsibility for failing to provide the quality experience you expected."
        
        voucher_code = f"APOLOGY-CARE-{random.randint(1000, 9999)}"
        closing = f"We would love the opportunity to make things right. Please accept a complimentary 20% discount voucher ({voucher_code}) for your next meal, or contact our manager directly at manager@restaurant.com."

        full_response = f"Dear {name},\n\n{greeting} {body}\n\n{closing}\n\nSincerely,\nGeneral Manager, Restaurant Guest Relations"

        return {
            "sentiment": "Negative",
            "confidence": confidence,
            "detected_aspects": aspects,
            "response": full_response,
            "action_recommended": "Send Apology & Manager Discount Voucher",
            "voucher_code": voucher_code
        }
