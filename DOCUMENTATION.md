# Project Documentation Report

## 🎓 Multi-Domain Sentiment Analysis & AI Restaurant Chatbot Platform

---

### 📋 Executive Abstract

This project presents a **Multi-Domain Natural Language Processing (NLP) and Machine Learning System** designed for automated sentiment classification and intelligent customer engagement. Built upon two distinct benchmark datasets — the **IMDB 50,000 Movie Reviews Dataset** and an authentic **1,000 Restaurant Feedback Reviews Dataset** — the application cleans raw, noisy textual inputs through a custom NLP preprocessing pipeline (HTML tag stripping, lowercasing, URL removal, stopword elimination with negation preservation, and WordNet lemmatization).

Textual features are extracted using **Sublinear TF-IDF Vectorization** (20,000 n-gram features for unigrams and bigrams). Multiple supervised machine learning algorithms — **Logistic Regression**, **Multinomial Naive Bayes**, and **Calibrated Linear SVM** — are evaluated on an 80/20 stratified train-test split. The top-performing models (**Linear SVM** at **90.09% accuracy** for movies and **Logistic Regression** for restaurants) are deployed via a **FastAPI REST Backend**.

Furthermore, the platform incorporates an **AI Restaurant Review Response Chatbot ("RestoBot AI")**. When a customer submits dining feedback, RestoBot AI extracts key dining aspects (`Food Quality`, `Service Speed`, `Hygiene`, `Price Value`, `Ambience`) and generates an instant, executive manager response — issuing loyalty discount vouchers (`LOYALTY-XXXX`) for positive feedback or apology compensation vouchers (`APOLOGY-CARE-XXXX`) for negative complaints. The system is delivered via a modern, cinema-dark **React.js (Vite)** dashboard.

---

## 1. Project Objectives & Scope

1. **Dual Domain Sentiment Analysis**: Provide a unified interface allowing users to switch seamlessly between **🎬 Movie Reviews** and **🍽️ Restaurant Reviews**.
2. **Custom NLP Preprocessing**: Remove noise (HTML tags, punctuation, stopwords) while strictly preserving critical sentiment negations (`not`, `no`, `never`, `hate`, `love`).
3. **Feature Extraction**: Transform text into numerical feature vectors using Sublinear TF-IDF unigram and bigram representation.
4. **Machine Learning Benchmarking**: Benchmark multiple classifiers and select the best model based on F1-Score.
5. **AI Restaurant Chatbot**: Automatically detect customer dining aspects and generate personalized, polite restaurant manager replies with reward vouchers.
6. **Batch CSV Processing**: Support bulk dataset prediction and CSV report generation.
7. **SQLite History Logging**: Persist manual prediction records with domain, sentiment, confidence, and timestamp.

---

## 2. Dataset Specifications

### 🎬 Movie Reviews Dataset (IMDB)
- **Source**: Internet Movie Database (IMDB)
- **Total Records**: 50,000 highly polarized reviews
- **Class Balance**: 25,000 Positive / 25,000 Negative (50/50 split)
- **Train/Test Split**: 80% Training (39,665 samples) / 20% Testing (9,917 samples)

### 🍽️ Restaurant Reviews Dataset
- **Source**: Authenticated Restaurant Customer Feedback Dataset
- **Total Records**: 1,000 dining reviews
- **Class Balance**: 500 Positive / 500 Negative (50/50 split)
- **Attributes Covered**: Food Quality, Wait Times, Staff Behavior, Hygiene, Price

---

## 3. NLP Preprocessing Pipeline

The NLP pipeline follows a 5-stage sequential transformation:

```
Raw Input Text ➔ HTML Removal ➔ Lowercasing & Cleaning ➔ Stopword Filter (Preserving Negations) ➔ WordNet Lemmatization
```

1. **HTML Tag Stripping**: Uses `BeautifulSoup` to remove `<br />`, `<div>`, and unescape HTML entities.
2. **Regex URL & Special Character Removal**: Removes `http://`, `https://`, and non-alphabetic characters.
3. **Negation-Preserving Stopword Removal**: Standard NLTK English stopwords are filtered, but critical negation and sentiment terms (`not`, `no`, `never`, `neither`, `hate`, `love`, `amazing`, `terrible`, `bad`, `good`) are explicitly retained.
4. **WordNet Lemmatization**: Inflected tokens are reduced to dictionary root lemmas (e.g., `loved` ➔ `love`, `disappointed` ➔ `disappoint`).

---

## 4. Machine Learning Benchmark & Performance

### 🎬 Movie Domain Benchmark (9,917 Test Reviews)

| Model Classifier | Accuracy | Precision | Recall | F1-Score | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Linear SVM (Calibrated)** | **90.09%** | **0.8969** | **0.9068** | **0.9018** | **Selected Production Model** |
| **Logistic Regression** | 89.96% | 0.8928 | 0.9090 | 0.9008 | Evaluated Benchmark |
| **Multinomial Naive Bayes** | 87.81% | 0.8707 | 0.8891 | 0.8798 | Evaluated Benchmark |

---

## 5. AI Restaurant Review Response Chatbot ("RestoBot AI")

RestoBot AI automates customer relationship management for dining establishments.

### Aspect Extraction Categories:
- `🍔 Food Quality`: `food`, `taste`, `delicious`, `flavor`, `steak`, `pizza`, `cold`, `bland`, `burnt`
- `⏱️ Service`: `service`, `staff`, `waiter`, `server`, `polite`, `rude`, `slow`, `waited`
- `🧹 Hygiene`: `clean`, `hygiene`, `dirty`, `stain`, `hair`, `sanitized`
- `💰 Price & Value`: `price`, `expensive`, `cheap`, `overpriced`, `worth`, `value`, `bill`
- `✨ Ambience`: `atmosphere`, `music`, `lighting`, `seating`, `cozy`, `noisy`

### Dynamic Manager Response Strategy:
- **For Positive Customer Reviews**:
  - Expresses warm gratitude.
  - Acknowledges specific praised dining aspects.
  - Generates a **15% Loyalty Discount Voucher** (`LOYALTY-XXXX`).
- **For Negative Customer Reviews**:
  - Expresses a sincere executive apology.
  - Takes responsibility for highlighted complaints.
  - Generates a **20% Apology Compensation Voucher** (`APOLOGY-CARE-XXXX`).
  - Provides direct General Manager email contact details.

---

## 6. How to Run the Project (Windows & VSCode)

### 1. Extract ZIP File
Extract `movie-review-sentiment.zip` to your project directory.

### 2. Run Backend Terminal
```cmd
cd backend
venv\Scripts\activate.bat
pip install -r requirements.txt
python download_nltk_data.py
python train_model.py
python train_restaurant_model.py
uvicorn app.main:app --reload --port 8000
```

### 3. Run Frontend Terminal
```cmd
cd frontend
cmd /c npm run dev
```
Open `http://localhost:5173` in your browser.
