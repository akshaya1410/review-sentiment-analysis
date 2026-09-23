import nltk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base
from app.services.model_service import model_service
from app.routes import sentiment, batch, dashboard, chatbot

# 1. Auto-download NLTK corpora during server boot
def init_nltk():
    resources = ['stopwords', 'wordnet', 'punkt', 'omw-1.4']
    for r in resources:
        try:
            nltk.download(r, quiet=True)
        except Exception as e:
            print(f"[WARNING] NLTK download failed for {r}: {e}")

init_nltk()

# 2. Ensure database schema is created
Base.metadata.create_all(bind=engine)

# 3. Database Migration Failsafe: Add 'domain' column to existing SQLite databases if missing
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE prediction_history ADD COLUMN domain VARCHAR(30) DEFAULT 'movie'"))
        conn.commit()
        print("[INFO] Database Migration: Added 'domain' column to prediction_history table.")
except Exception:
    pass

app = FastAPI(
    title="Multi-Domain Sentiment Analysis & AI Chatbot API",
    description="NLP-powered FastAPI service using TF-IDF, Scikit-Learn models, and AI Restaurant Response Chatbot.",
    version="2.2.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Load ML model artifacts & verify NLTK during backend application startup."""
    init_nltk()
    success = model_service.load_artifacts()
    if success:
        print("[INFO] Sentiment analysis models and vectorizers loaded successfully.")
    else:
        print("[WARNING] Could not load model artifacts. Ensure model training has been executed.")

# Include Endpoint Routers
app.include_router(sentiment.router)
app.include_router(batch.router)
app.include_router(dashboard.router)
app.include_router(chatbot.router)

@app.get("/", summary="API Root Status")
def root_status():
    return {
        "status": "online",
        "app": "Multi-Domain Sentiment Analysis & AI Chatbot API",
        "version": "2.2.0",
        "docs": "/docs",
        "movie_model_loaded": model_service.is_loaded(domain="movie"),
        "restaurant_model_loaded": model_service.is_loaded(domain="restaurant")
    }

@app.get("/api/health", summary="Health Check Endpoint")
def health_check():
    movie_loaded = model_service.is_loaded(domain="movie")
    restaurant_loaded = model_service.is_loaded(domain="restaurant")
    return {
        "status": "healthy" if (movie_loaded or restaurant_loaded) else "degraded",
        "movie_model_status": "loaded" if movie_loaded else "missing",
        "restaurant_model_status": "loaded" if restaurant_loaded else "missing",
    }
