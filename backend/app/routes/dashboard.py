import json
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from app.schemas import DashboardStatsResponse, ModelComparisonResponse
from app.services.model_service import model_service

router = APIRouter(prefix="/api", tags=["Dashboard & Model Benchmark"])

@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
    summary="Get overall dataset and model evaluation statistics"
)
def get_dashboard_stats(domain: Optional[str] = Query("movie")):
    metrics = model_service.get_metrics()
    selected_domain = (domain or "movie").lower().strip()

    if selected_domain == "restaurant":
        domain_data = metrics.get("restaurant_domain", {})
        best_model_name = domain_data.get("best_model", "Logistic Regression")
        models_data = domain_data.get("models", {})
        dataset_info = domain_data.get("dataset_stats", {
            "total_reviews": 1000,
            "positive_reviews": 500,
            "negative_reviews": 500
        })
    else:
        best_model_name = metrics.get("best_model", "Linear SVM")
        models_data = metrics.get("models", {})
        dataset_info = metrics.get("dataset_stats", {
            "total_reviews": 50000,
            "positive_reviews": 25000,
            "negative_reviews": 25000
        })

    best_metrics = models_data.get(best_model_name, {
        "accuracy": 0.90,
        "precision": 0.90,
        "recall": 0.90,
        "f1_score": 0.90,
        "confusion_matrix": [[0,0],[0,0]]
    })

    return DashboardStatsResponse(
        domain=selected_domain,
        total_dataset_reviews=dataset_info.get("total_reviews", 50000),
        positive_dataset_reviews=dataset_info.get("positive_reviews", 25000),
        negative_dataset_reviews=dataset_info.get("negative_reviews", 25000),
        best_model=best_model_name,
        accuracy=best_metrics.get("accuracy", 0.0),
        precision=best_metrics.get("precision", 0.0),
        recall=best_metrics.get("recall", 0.0),
        f1_score=best_metrics.get("f1_score", 0.0),
        confusion_matrix=best_metrics.get("confusion_matrix", [[0,0],[0,0]]),
        model_comparison=models_data
    )

@router.get(
    "/models",
    response_model=ModelComparisonResponse,
    summary="Get model benchmark comparison details"
)
def get_model_comparison(domain: Optional[str] = Query("movie")):
    metrics = model_service.get_metrics()
    selected_domain = (domain or "movie").lower().strip()

    if selected_domain == "restaurant":
        domain_data = metrics.get("restaurant_domain", {})
        return ModelComparisonResponse(
            best_model=domain_data.get("best_model", "Logistic Regression"),
            models=domain_data.get("models", {})
        )

    return ModelComparisonResponse(
        best_model=metrics.get("best_model", "Linear SVM"),
        models=metrics.get("models", {})
    )
