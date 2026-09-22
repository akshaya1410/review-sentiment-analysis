import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from app.schemas import BatchPredictResponse, BatchPredictItem
from app.services.prediction import predict_batch_reviews
from app.services.model_service import model_service

router = APIRouter(prefix="/api", tags=["Batch Analysis"])

@router.post(
    "/batch-predict",
    response_model=BatchPredictResponse,
    summary="Batch predict sentiments from uploaded CSV file"
)
async def batch_predict_csv(
    file: UploadFile = File(...),
    domain: Optional[str] = Form("movie")
):
    selected_domain = (domain or "movie").lower().strip()
    if not model_service.is_loaded(domain=selected_domain):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Sentiment ML model for domain '{selected_domain}' is not loaded."
        )

    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Please upload a valid CSV file (.csv)."
        )

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read CSV file: {str(e)}"
        )

    column_map = {col.lower().strip(): col for col in df.columns}
    if 'review' not in column_map:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="CSV file missing required 'review' column. Found columns: " + ", ".join(df.columns)
        )

    review_col = column_map['review']
    raw_reviews = df[review_col].dropna().astype(str).tolist()

    if not raw_reviews:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded CSV file contains no non-empty review rows."
        )

    if len(raw_reviews) > 2000:
        raw_reviews = raw_reviews[:2000]

    raw_results = predict_batch_reviews(raw_reviews, domain=selected_domain)

    items = []
    pos_count = 0
    neg_count = 0

    for res in raw_results:
        s = res.get("sentiment", "Negative")
        if s == "Positive":
            pos_count += 1
        elif s == "Negative":
            neg_count += 1

        items.append(
            BatchPredictItem(
                domain=selected_domain,
                review=res.get("review", ""),
                sentiment=s,
                confidence=res.get("confidence", 0.5),
                cleaned_review=res.get("cleaned_review", "")
            )
        )

    return BatchPredictResponse(
        domain=selected_domain,
        total_count=len(items),
        positive_count=pos_count,
        negative_count=neg_count,
        predictions=items
    )
