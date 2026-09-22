import sys
import os
import json
import time
import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent))

from app.services.preprocessing import clean_text
from app.utils.config import MODELS_DIR, RESULTS_PATH

DATASET_PATH = Path(__file__).resolve().parent / "data" / "Restaurant_Reviews.csv"
MODEL_PATH = MODELS_DIR / "restaurant_sentiment_model.pkl"
VECTORIZER_PATH = MODELS_DIR / "restaurant_tfidf_vectorizer.pkl"

def run_restaurant_pipeline():
    print("=" * 60)
    print("   RESTAURANT REVIEW SENTIMENT ANALYSIS - TRAINING PIPELINE   ")
    print("=" * 60)

    # 1. Load Dataset
    print(f"\n[1/6] Loading restaurant dataset from: {DATASET_PATH}")
    if not DATASET_PATH.exists():
        print(f"[ERROR] Restaurant dataset not found at '{DATASET_PATH}'.")
        sys.exit(1)

    df = pd.read_csv(DATASET_PATH)
    print(f"Initial raw row count: {len(df)}")

    # 2. Validate Dataset
    df = df.dropna(subset=['review', 'sentiment']).copy()
    df['sentiment'] = df['sentiment'].astype(str).str.strip().str.lower()
    df = df[df['sentiment'].isin(['positive', 'negative'])].copy()

    total_valid = len(df)
    pos_count = (df['sentiment'] == 'positive').sum()
    neg_count = (df['sentiment'] == 'negative').sum()

    print(f"Dataset Size after validation: {total_valid}")
    print(f" - Positive reviews: {pos_count}")
    print(f" - Negative reviews: {neg_count}")

    # 3. Preprocessing
    print("\n[3/6] Preprocessing textual restaurant reviews...")
    t0 = time.time()
    df['cleaned_review'] = df['review'].apply(lambda text: clean_text(text, preserve_negations=True, lemmatize=True))
    df = df[df['cleaned_review'].str.strip() != ""].copy()
    print(f"Preprocessing completed in {time.time() - t0:.2f} seconds.")

    # 4. Train/Test Split
    X = df['cleaned_review']
    y = df['sentiment'].map({'positive': 1, 'negative': 0}).values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f" - Train set size: {len(X_train)}")
    print(f" - Test set size:  {len(X_test)}")

    # 5. Feature Extraction
    print("\n[5/6] Extracting TF-IDF Features for Restaurant Domain...")
    vectorizer = TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        min_df=1,
        max_df=0.95,
        sublinear_tf=True
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # 6. Train Classifiers
    print("\n[6/6] Training & Evaluating Restaurant Sentiment Classifiers...")
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, C=1.0, random_state=42),
        "Multinomial Naive Bayes": MultinomialNB(alpha=1.0),
        "Linear SVM": CalibratedClassifierCV(LinearSVC(C=1.0, max_iter=2000, random_state=42), cv=3)
    }

    results = {}
    best_model_name = None
    best_f1 = -1.0
    best_fitted_model = None

    for name, clf in models.items():
        clf.fit(X_train_tfidf, y_train)
        y_pred = clf.predict(X_test_tfidf)

        acc = float(accuracy_score(y_test, y_pred))
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
        cm = confusion_matrix(y_test, y_pred).tolist()

        acc, prec, rec, f1 = round(acc, 4), round(float(prec), 4), round(float(rec), 4), round(float(f1), 4)

        results[name] = {
            "accuracy": acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "confusion_matrix": cm
        }

        print(f" - {name}: Accuracy={acc*100:.2f}%, F1-Score={f1:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_fitted_model = clf

    best_fitted_model._model_name = best_model_name

    # Save artifacts
    joblib.dump(best_fitted_model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    # Update results JSON
    if RESULTS_PATH.exists():
        with open(RESULTS_PATH, "r", encoding="utf-8") as f:
            all_metrics = json.load(f)
    else:
        all_metrics = {}

    all_metrics["restaurant_domain"] = {
        "best_model": best_model_name,
        "dataset_stats": {
            "total_reviews": total_valid,
            "positive_reviews": int(pos_count),
            "negative_reviews": int(neg_count)
        },
        "models": results
    }

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_metrics, f, indent=4)

    print("\n" + "=" * 60)
    print(f" Best Restaurant Model Selected: {best_model_name}")
    print(f" Saved model to:      {MODEL_PATH}")
    print(f" Saved vectorizer to: {VECTORIZER_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    run_restaurant_pipeline()
