from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PredictRequest(BaseModel):
    review: str = Field(..., example="This movie was fantastic and I loved it.", min_length=2)
    domain: Optional[str] = Field("movie", example="movie")

class PredictResponse(BaseModel):
    domain: str = Field(..., example="movie")
    sentiment: str = Field(..., example="Positive")
    confidence: float = Field(..., example=0.96)
    review: str
    cleaned_review: str
    model: str
    sentiment_tokens: Optional[List[str]] = []

class BatchPredictItem(BaseModel):
    domain: Optional[str] = "movie"
    review: str
    sentiment: str
    confidence: float
    cleaned_review: Optional[str] = ""

class BatchPredictResponse(BaseModel):
    domain: str
    total_count: int
    positive_count: int
    negative_count: int
    predictions: List[BatchPredictItem]

class ModelMetricsItem(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]

class ModelComparisonResponse(BaseModel):
    best_model: str
    models: Dict[str, ModelMetricsItem]

class DashboardStatsResponse(BaseModel):
    domain: str
    total_dataset_reviews: int
    positive_dataset_reviews: int
    negative_dataset_reviews: int
    best_model: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    model_comparison: Dict[str, ModelMetricsItem]

class HistoryCreate(BaseModel):
    domain: Optional[str] = "movie"
    review: str
    cleaned_review: str
    sentiment: str
    confidence: float
    model_name: Optional[str] = None

class HistoryItem(BaseModel):
    id: int
    domain: Optional[str] = "movie"
    review: str
    cleaned_review: Optional[str]
    sentiment: str
    confidence: float
    model_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
