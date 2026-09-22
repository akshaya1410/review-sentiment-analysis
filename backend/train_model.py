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
from app.utils.config import DATASET_PATH, MODEL_PATH, VECTORIZER_PATH, RESULTS_PATH, MODELS_DIR

def run_pipeline():
    print("=" * 60)
    print("      MOVIE REVIEW SENTIMENT ANALYSIS - TRAINING PIPELINE      ")
    print("=" * 60)

    # 1. Load Dataset
    print(f"\n[1/6] Loading dataset from: {DATASET_PATH}")
    if not DATASET_PATH.exists():
        print(f"[ERROR] Dataset file not found at '{DATASET_PATH}'.")
        print("Please place 'IMDB_Dataset.csv' inside 'backend/data/' directory.")
        sys.exit(1)

    try:
        df = pd.read_csv(DATASET_PATH)
    except Exception as e:
        print(f"[ERROR] Failed to read CSV file: {e}")
        sys.exit(1)

    print(f"Initial raw row count: {len(df)}")

    # 2. Validate & Clean Dataset
    print("\n[2/6] Validating dataset...")
    # Check column names
    col_map = {col.lower().strip(): col for col in df.columns}
    if 'review' not in col_map or 'sentiment' not in col_map:
        print(f"[ERROR] Required columns 'review' and 'sentiment' not found in CSV. Found: {list(df.columns)}")
        sys.exit(1)

    rev_col = col_map['review']
    sent_col = col_map['sentiment']

    # Drop nulls
    initial_count = len(df)
    df = df.dropna(subset=[rev_col, sent_col]).copy()
    null_dropped = initial_count - len(df)
    if null_dropped > 0:
        print(f" - Dropped {null_dropped} rows with missing values.")

    # Drop duplicates
    dup_count = df.duplicated(subset=[rev_col]).sum()
    if dup_count > 0:
        df = df.drop_duplicates(subset=[rev_col]).copy()
        print(f" - Dropped {dup_count} duplicate review entries.")

    # Standardize target labels
    df[sent_col] = df[sent_col].astype(str).str.strip().str.lower()
    df = df[df[sent_col].isin(['positive', 'negative'])].copy()

    total_valid = len(df)
    pos_count = (df[sent_col] == 'positive').sum()
    neg_count = (df[sent_col] == 'negative').sum()

    print(f"Dataset Size after cleaning: {total_valid}")
    print(f" - Positive reviews: {pos_count}")
    print(f" - Negative reviews: {neg_count}")

    # 3. NLP Preprocessing
    print("\n[3/6] Preprocessing textual reviews with NLP pipeline (HTML removal, stopword filtering with negation preservation, lemmatization)...")
    start_time = time.time()
    
    # Process text
    df['cleaned_review'] = df[rev_col].apply(lambda text: clean_text(text, preserve_negations=True, lemmatize=True))
    
    # Filter empty cleaned strings
    df = df[df['cleaned_review'].str.strip() != ""].copy()
    print(f"Preprocessing completed in {time.time() - start_time:.2f} seconds.")

    # 4. Train/Test Split
    print("\n[4/6] Splitting data into 80% Training and 20% Testing sets (Stratified)...")
    X = df['cleaned_review']
    y = df[sent_col].map({'positive': 1, 'negative': 0}).values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print(f" - Train set size: {len(X_train)}")
    print(f" - Test set size:  {len(X_test)}")

    # 5. Feature Extraction using TF-IDF
    print("\n[5/6] Extracting TF-IDF Features...")
    """
    TF-IDF Vectorizer Parameters Explanation:
    - max_features=20000: Limits vocabulary to top 20k most informative terms/bigrams to reduce noise & dimensionality.
    - ngram_range=(1,2): Considers unigrams ('good') and bigrams ('not good') to capture context and negations.
    - min_df=2: Ignores rare tokens appearing in fewer than 2 documents (eliminates typos).
    - max_df=0.95: Excludes overly frequent terms present in >95% of documents.
    - sublinear_tf=True: Applies logarithmic scaling (1 + log(tf)) to prevent extremely frequent terms from overwhelming scores.
    """
    vectorizer = TfidfVectorizer(
        max_features=20000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95,
        sublinear_tf=True
    )

    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)
    print(f"TF-IDF matrix shape: {X_train_tfidf.shape}")

    # 6. Train & Benchmark Machine Learning Models
    print("\n[6/6] Training & Evaluating ML Classifiers...")

    # Define candidate models
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
        print(f"\nTraining {name}...")
        t0 = time.time()
        clf.fit(X_train_tfidf, y_train)
        train_duration = time.time() - t0

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
            "confusion_matrix": cm,
            "train_time_seconds": round(train_duration, 2)
        }

        print(f" - {name} Performance: Accuracy={acc*100:.2f}%, Precision={prec:.4f}, Recall={rec:.4f}, F1-Score={f1:.4f}")

        if f1 > best_f1:
            best_f1 = f1
            best_model_name = name
            best_fitted_model = clf

    # Set custom attribute on fitted model for identification
    best_fitted_model._model_name = best_model_name

    # Save artifacts
    print("\n" + "=" * 60)
    print("                     MODEL COMPARISON RESULTS                  ")
    print("=" * 60)
    for name, res in results.items():
        print(f" {name:<25}: Accuracy = {res['accuracy']*100:>6.2f}% | F1-Score = {res['f1_score']:.4f}")
    
    print("-" * 60)
    print(f" Best Performing Model Selected: {best_model_name}")

    # Prepare output dictionary
    output_data = {
        "best_model": best_model_name,
        "dataset_stats": {
            "total_reviews": total_valid,
            "positive_reviews": int(pos_count),
            "negative_reviews": int(neg_count)
        },
        "models": results
    }

    # Save to files
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    joblib.dump(best_fitted_model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    
    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=4)

    print(f"\nSaved best model to:        {MODEL_PATH}")
    print(f"Saved TF-IDF vectorizer to: {VECTORIZER_PATH}")
    print(f"Saved metrics benchmark to: {RESULTS_PATH}")
    print("=" * 60)
    print(" Training Pipeline Completed Successfully! ")
    print("=" * 60)

if __name__ == "__main__":
    run_pipeline()
