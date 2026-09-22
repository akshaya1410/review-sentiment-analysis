# Backend Service - Movie Review Sentiment Analysis

FastAPI backend service powering the Movie Review Sentiment Analysis system.

## Setup Instructions (Windows)

1. Open PowerShell or Command Prompt in the `backend/` directory:
   ```cmd
   cd backend
   ```

2. Create and activate Python virtual environment:
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install required Python packages:
   ```cmd
   pip install -r requirements.txt
   ```

4. Download required NLTK resources:
   ```cmd
   python download_nltk_data.py
   ```

5. Train & Evaluate ML Models (Dataset must be located at `backend/data/IMDB_Dataset.csv`):
   ```cmd
   python train_model.py
   ```

6. Start FastAPI Backend Server:
   ```cmd
   uvicorn app.main:app --reload --port 8000
   ```

7. Interactive OpenAPI / Swagger Documentation:
   - Open browser at `http://localhost:8000/docs`
