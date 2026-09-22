import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.services.chatbot import generate_restaurant_response, detect_aspects

client = TestClient(app)

def test_detect_aspects():
    text = "The pizza was delicious but the waiter was slow and rude."
    aspects = detect_aspects(text)
    assert "food_quality" in aspects
    assert "service" in aspects

def test_generate_positive_response():
    res = generate_restaurant_response(
        review_text="The burger was mouth-watering and service was fantastic!",
        sentiment="Positive",
        confidence=0.98,
        customer_name="Akshaya"
    )
    assert res["sentiment"] == "Positive"
    assert "Akshaya" in res["response"]
    assert res["voucher_code"] is not None
    assert "LOYALTY" in res["voucher_code"]

def test_generate_negative_response():
    res = generate_restaurant_response(
        review_text="Cold pasta and dirty tables. Worst experience ever!",
        sentiment="Negative",
        confidence=0.95,
        customer_name="Guest"
    )
    assert res["sentiment"] == "Negative"
    assert "apologize" in res["response"].lower() or "sorry" in res["response"].lower()
    assert res["voucher_code"] is not None
    assert "APOLOGY" in res["voucher_code"]

def test_chatbot_api_endpoint():
    payload = {
        "review": "Extremely delicious curry and excellent service!",
        "customer_name": "Priya",
        "domain": "restaurant"
    }
    response = client.post("/api/chatbot/respond", json=payload)
    assert response.status_code in [200, 503]
    if response.status_code == 200:
        data = response.json()
        assert "response" in data
        assert "detected_aspects" in data
        assert data["sentiment"] in ["Positive", "Negative"]
