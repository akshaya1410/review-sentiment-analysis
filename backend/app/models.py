from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    domain = Column(String(30), default="movie", nullable=False)
    review = Column(String, nullable=False)
    cleaned_review = Column(String, nullable=True)
    sentiment = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    model_name = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
