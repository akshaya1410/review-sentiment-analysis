# Movie Review – Sentiment Analysis Using NLP

A full-stack Natural Language Processing (NLP) web application built with **FastAPI**, **React.js (Vite)**, **Scikit-Learn**, and **SQLite**. Trained on the benchmark **IMDB 50,000 Movie Reviews Dataset**, this system cleans raw, unstructured textual feedback and classifies reviews into **Positive** or **Negative** sentiments with confidence scores.

---

## 📌 Abstract

This project presents an NLP-based sentiment analysis system, "Movie Review," built using the IMDB Dataset of 50,000 highly polarized movie reviews. Being raw and unprocessed, the dataset contains HTML tags, mixed casing, special characters, and stopwords, necessitating a comprehensive text preprocessing pipeline (BeautifulSoup HTML removal, tokenization, lowercasing, stopword elimination with negation preservation, and WordNet lemmatization).

Features are extracted using **TF-IDF Vectorization** (20,000 n-gram features, unigrams & bigrams, sublinear TF scaling). Multiple supervised machine learning models (**Logistic Regression**, **Multinomial Naive Bayes**, and **Calibrated Linear SVM**) are trained and benchmarked on an 80/20 stratified split to automatically select the top-performing production model based on F1-score.

---

## ✨ Features

- **Live Single Review Predictor**: Instant sentiment prediction (Positive / Negative), confidence probability gauge, cleaned text display, and key sentiment tokens.
- **Interactive Demo Chips**: Pre-loaded test review samples for instant demonstration.
- **Analytics Dashboard**: Dataset metrics (50,000 split), interactive sentiment distribution pie chart, model benchmark bar chart (Accuracy, Precision, Recall, F1-Score), and Confusion Matrix grid.
- **Batch CSV Analysis**: Drag-and-drop CSV upload, batch predictions, filterable result table, and CSV prediction report download.
- **Prediction History**: SQLite persistence recording review text, sentiment classification, confidence, and timestamp with clear history controls.
- **Documentation & Educational Walkthrough**: Detailed breakdown of NLP pipeline steps, feature extraction parameters, ML model architectures, and limitations.

---

## 📐 System Architecture

### Training Architecture
```
IMDB Dataset (50k CSV)
       │
       ▼
Data Validation & Cleaning (Missing / Duplicates Dropped)
       │
       ▼
NLP Preprocessing (HTML Clean ➔ Lowercase ➔ Negation Stopword Filter ➔ Lemmatization)
       │
       ▼
80/20 Stratified Train-Test Split
       │
       ▼
TF-IDF Vectorization (20,000 n-grams, Sublinear TF)
       │
       ▼
Machine Learning Model Benchmark (Logistic Regression | Naive Bayes | Linear SVM)
       │
       ▼
Evaluation Metrics & Best Model Selection (Saved to .pkl & results.json)
```

### Runtime Inference Architecture
```
User (Browser UI)
       │
       ▼
React (Vite) Frontend
       │  (Axios REST API Requests)
       ▼
FastAPI Backend Server
       │
       ├──► Text Preprocessing Pipeline
       ├──► TF-IDF Vectorizer Transformation
       ├──► Trained Scikit-Learn Model Inference
       └──► SQLite Database (History Persistence)
       │
       ▼
JSON Prediction Response (Sentiment, Confidence Score, Cleaned Text)
```

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Recharts, Lucide Icons, Axios.
- **Backend**: Python 3.12, FastAPI, Uvicorn, Pydantic, SQLAlchemy (SQLite).
- **Machine Learning & NLP**: Scikit-Learn, NLTK, BeautifulSoup4, pandas, NumPy, joblib.
- **Optional Advanced Module**: PyTorch / Keras LSTM (`backend/lstm/`).

---

## 📂 Project Directory Structure

```
movie-review-sentiment/
│
├── frontend/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ReviewInput.jsx
│   │   │   ├── SentimentResult.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── SentimentChart.jsx
│   │   │   ├── ModelComparisonTable.jsx
│   │   │   ├── PredictionHistory.jsx
│   │   │   ├── FileUploader.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BatchAnalysis.jsx
│   │   │   └── About.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py              # Application entrypoint & CORS setup
│   │   ├── database.py          # SQLite database configuration
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── routes/              # API Endpoints (sentiment, batch, dashboard)
│   │   ├── services/            # Preprocessing & Model Prediction Services
│   │   └── utils/               # Path configurations
│   ├── models/                  # Saved ML Model Binaries (.pkl & .json)
│   ├── data/                    # IMDB_Dataset.csv dataset folder
│   ├── lstm/                    # Optional PyTorch/Keras LSTM implementation
│   ├── train_model.py           # Model training and benchmark script
│   ├── evaluate_model.py        # CLI evaluation script
│   ├── download_nltk_data.py    # Automated NLTK corpora downloader
│   ├── requirements.txt         # Python package dependencies
│   └── README.md
│
├── dataset/                     # Root dataset directory
│   └── IMDB_Dataset.csv
├── tests/                       # Pytest unit & integration test suite
├── screenshots/                 # UI Screenshots placeholder
├── README.md                    # Root Documentation
└── .gitignore
```

---

## 🚀 Windows Installation & Running Guide

### Step 1: Clone or Navigate to Project Root
Open Command Prompt (CMD) or PowerShell:
```cmd
cd movie-review-sentiment
```

---

### Step 2: Dataset Placement
Ensure `IMDB_Dataset.csv` is placed inside `backend/data/IMDB_Dataset.csv` or `dataset/IMDB_Dataset.csv`.

---

### Step 3: Backend Virtual Environment Setup & Model Training
Open terminal in `backend/`:

```cmd
cd backend

:: Create virtual environment
python -m venv venv

:: Activate virtual environment (CMD)
venv\Scripts\activate.bat

:: Or Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

:: Install Python dependencies
pip install -r requirements.txt

:: Download NLTK Corpora (stopwords, wordnet, punkt)
python download_nltk_data.py

:: Run Model Training & Benchmark Pipeline
python train_model.py
```

---

### Step 4: Start FastAPI Backend Server
In the activated backend terminal:
```cmd
uvicorn app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive OpenAPI / Swagger Documentation: `http://localhost:8000/docs`

---

### Step 5: Frontend React Setup & Startup
Open a **new separate terminal** in `frontend/`:

```cmd
cd frontend

:: Install Node packages
npm install

:: Start Vite Development Server
npm run dev
```
- Frontend Web App URL: `http://localhost:5173`

---

## 🧪 Testing

Run pytest suite in `backend/`:
```cmd
cd backend
venv\Scripts\pytest tests/
```

---

## 📡 API Endpoint Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | API status and model loaded status |
| `/api/health` | `GET` | Health check endpoint |
| `/api/predict` | `POST` | Predict sentiment for a single review |
| `/api/batch-predict` | `POST` | Upload CSV and return batch predictions |
| `/api/dashboard/stats` | `GET` | Dataset distribution & benchmark statistics |
| `/api/models` | `GET` | Model comparison metrics across all algorithms |
| `/api/history` | `GET` | Retrieve recent prediction history from SQLite |
| `/api/history` | `DELETE` | Clear prediction history database |

---

## ⚠️ Academic Disclaimer & Limitations

> **Academic Notice**: This system is intended for educational and demonstration purposes. Predictions are based on patterns learned from the training dataset and may not always reflect human interpretation. Contextual nuances such as sarcasm, complex double negatives, or implicit irony may occasionally yield false positives or false negatives.
