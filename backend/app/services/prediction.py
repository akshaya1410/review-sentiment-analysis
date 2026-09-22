import numpy as np
from typing import Dict, Any, List
from app.services.preprocessing import clean_text
from app.services.model_service import model_service

def predict_single_review(review_text: str, domain: str = "movie") -> Dict[str, Any]:
    """
    Preprocesses a raw review and predicts its sentiment using the domain-specific ML model.
    """
    domain = domain.lower().strip()
    if domain not in ["movie", "restaurant"]:
        domain = "movie"

    model, vectorizer = model_service.get_model_and_vectorizer(domain)
    if model is None or vectorizer is None:
        raise RuntimeError(f"ML Model or Vectorizer for domain '{domain}' is not loaded. Please train models first.")

    cleaned = clean_text(review_text)
    if not cleaned.strip():
        return {
            "domain": domain,
            "sentiment": "Neutral",
            "confidence": 0.5000,
            "review": review_text,
            "cleaned_review": "",
            "model": getattr(model, "_model_name", "Trained Model"),
            "sentiment_tokens": []
        }

    # Vectorize
    vec = vectorizer.transform([cleaned])

    # Predict class and confidence
    prediction_raw = model.predict(vec)[0]
    sentiment = "Positive" if str(prediction_raw).lower() in ["positive", "1", "pos"] else "Negative"

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(vec)[0]
        class_idx = 1 if sentiment == "Positive" else 0
        if len(probabilities) == 2:
            confidence = float(probabilities[class_idx])
        else:
            confidence = float(np.max(probabilities))
    elif hasattr(model, "decision_function"):
        df_val = float(model.decision_function(vec)[0])
        prob_pos = 1.0 / (1.0 + np.exp(-df_val))
        confidence = float(prob_pos if sentiment == "Positive" else (1.0 - prob_pos))
    else:
        confidence = 0.85

    confidence = max(0.5000, min(0.9999, round(confidence, 4)))

    model_name = getattr(model, "_model_name", type(model).__name__)
    metrics = model_service.get_metrics()
    if domain == "restaurant" and "restaurant_domain" in metrics:
        model_name = metrics["restaurant_domain"].get("best_model", model_name)
    elif "best_model" in metrics:
        model_name = metrics.get("best_model", model_name)

    tokens = cleaned.split()
    sentiment_words = [t for t in tokens if len(t) > 2][:10]

    return {
        "domain": domain,
        "sentiment": sentiment,
        "confidence": round(confidence, 4),
        "review": review_text,
        "cleaned_review": cleaned,
        "model": model_name,
        "sentiment_tokens": sentiment_words
    }

def predict_batch_reviews(reviews: List[str], domain: str = "movie") -> List[Dict[str, Any]]:
    """Predict sentiment for a batch of review strings."""
    results = []
    for r in reviews:
        try:
            res = predict_single_review(r, domain=domain)
            results.append(res)
        except Exception as e:
            results.append({
                "domain": domain,
                "sentiment": "Error",
                "confidence": 0.0,
                "review": str(r),
                "cleaned_review": "",
                "model": "N/A",
                "error": str(e)
            })
    return results
