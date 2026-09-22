import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.main import app
from app.services.model_service import model_service

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "movie_model_status" in data or "model_status" in data

def test_predict_empty_validation():
    response = client.post("/api/predict", json={"review": "   "})
    assert response.status_code == 400

def test_predict_valid_if_model_loaded():
    if model_service.is_loaded("movie"):
        response = client.post("/api/predict", json={"review": "Wonderful cinematic masterpiece!", "domain": "movie"})
        assert response.status_code == 200
        data = response.json()
        assert "sentiment" in data
        assert "confidence" in data
        assert "cleaned_review" in data
