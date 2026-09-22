import sys
from pathlib import Path
import pytest

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.model_service import model_service
from app.services.prediction import predict_single_review

def test_prediction_logic():
    # Ensure artifacts can load or mock load
    if model_service.load_artifacts():
        pos_rev = "This movie was absolutely fantastic, brilliant acting and superb plot."
        res_pos = predict_single_review(pos_rev)
        assert res_pos["sentiment"] in ["Positive", "Negative"]
        assert 0.5 <= res_pos["confidence"] <= 1.0
        assert res_pos["cleaned_review"] != ""

        neg_rev = "Terrible film, completely boring, worst experience ever."
        res_neg = predict_single_review(neg_rev)
        assert res_neg["sentiment"] in ["Positive", "Negative"]
