import json
import os
import joblib
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
from app.utils.config import (
    MODEL_PATH, VECTORIZER_PATH,
    RESTAURANT_MODEL_PATH, RESTAURANT_VECTORIZER_PATH,
    RESULTS_PATH
)

class ModelService:
    def __init__(self):
        self.movie_model = None
        self.movie_vectorizer = None
        self.restaurant_model = None
        self.restaurant_vectorizer = None
        self.metrics: Optional[Dict[str, Any]] = None
        self.loaded = False

    def load_artifacts(self) -> bool:
        """Loads Movie and Restaurant trained models, vectorizers, and metrics."""
        success_movie = False
        success_restaurant = False

        # Load Movie Model
        if MODEL_PATH.exists() and VECTORIZER_PATH.exists():
            try:
                self.movie_model = joblib.load(MODEL_PATH)
                self.movie_vectorizer = joblib.load(VECTORIZER_PATH)
                success_movie = True
            except Exception as e:
                print(f"Error loading movie model: {e}")

        # Load Restaurant Model
        if RESTAURANT_MODEL_PATH.exists() and RESTAURANT_VECTORIZER_PATH.exists():
            try:
                self.restaurant_model = joblib.load(RESTAURANT_MODEL_PATH)
                self.restaurant_vectorizer = joblib.load(RESTAURANT_VECTORIZER_PATH)
                success_restaurant = True
            except Exception as e:
                print(f"Error loading restaurant model: {e}")

        if RESULTS_PATH.exists():
            try:
                with open(RESULTS_PATH, "r", encoding="utf-8") as f:
                    self.metrics = json.load(f)
            except Exception:
                self.metrics = {}

        self.loaded = success_movie or success_restaurant
        return self.loaded

    def is_loaded(self, domain: str = "movie") -> bool:
        if domain == "restaurant":
            return self.restaurant_model is not None and self.restaurant_vectorizer is not None
        return self.movie_model is not None and self.movie_vectorizer is not None

    def get_model_and_vectorizer(self, domain: str = "movie"):
        if domain == "restaurant":
            return self.restaurant_model, self.restaurant_vectorizer
        return self.movie_model, self.movie_vectorizer

    def get_metrics(self) -> Dict[str, Any]:
        if not self.metrics and RESULTS_PATH.exists():
            with open(RESULTS_PATH, "r", encoding="utf-8") as f:
                self.metrics = json.load(f)
        return self.metrics or {}

model_service = ModelService()
