import sys
from pathlib import Path

# Add parent dir to sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.services.preprocessing import clean_text

def test_clean_text_basic():
    raw = "I REALLY loved this movie!!! <br /> It was amazing."
    cleaned = clean_text(raw)
    assert "really" in cleaned
    assert "loved" in cleaned or "love" in cleaned
    assert "movie" in cleaned
    assert "amazing" in cleaned
    assert "<br />" not in cleaned

def test_negation_preservation():
    raw = "This movie was not good at all and I hate it."
    cleaned = clean_text(raw)
    assert "not" in cleaned
    assert "hate" in cleaned

def test_url_and_special_chars():
    raw = "Check out https://imdb.com for more info!!! Best film ever 10/10."
    cleaned = clean_text(raw)
    assert "https" not in cleaned
    assert "best" in cleaned
