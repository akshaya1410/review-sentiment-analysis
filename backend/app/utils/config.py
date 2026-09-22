import os
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
APP_DIR = BASE_DIR / "app"
MODELS_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"

# File Paths - Movie Domain
DATASET_PATH = DATA_DIR / "IMDB_Dataset.csv"
MODEL_PATH = MODELS_DIR / "sentiment_model.pkl"
VECTORIZER_PATH = MODELS_DIR / "tfidf_vectorizer.pkl"

# File Paths - Restaurant Domain
RESTAURANT_DATASET_PATH = DATA_DIR / "Restaurant_Reviews.csv"
RESTAURANT_MODEL_PATH = MODELS_DIR / "restaurant_sentiment_model.pkl"
RESTAURANT_VECTORIZER_PATH = MODELS_DIR / "restaurant_tfidf_vectorizer.pkl"

RESULTS_PATH = MODELS_DIR / "model_results.json"
DATABASE_PATH = BASE_DIR / "prediction_history.db"
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

# Ensure directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)
