import re
import html
from bs4 import BeautifulSoup
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Lazy loading of NLTK resources to prevent startup block if missing
_STOP_WORDS = None
_LEMMATIZER = None

NEGATION_WORDS = {
    'not', 'no', 'never', 'neither', 'nor', 'none',
    'cannot', "n't", 'hate', 'love', 'amazing', 'terrible',
    'bad', 'good', 'worst', 'best', 'awful', 'horrible'
}

def get_stopwords():
    global _STOP_WORDS
    if _STOP_WORDS is None:
        try:
            sw = set(stopwords.words('english'))
        except Exception:
            nltk.download('stopwords', quiet=True)
            sw = set(stopwords.words('english'))
        # Exclude critical sentiment and negation words from stopwords
        _STOP_WORDS = sw - NEGATION_WORDS
    return _STOP_WORDS

def get_lemmatizer():
    global _LEMMATIZER
    if _LEMMATIZER is None:
        try:
            _LEMMATIZER = WordNetLemmatizer()
        except Exception:
            nltk.download('wordnet', quiet=True)
            nltk.download('omw-1.4', quiet=True)
            _LEMMATIZER = WordNetLemmatizer()
    return _LEMMATIZER

def clean_text(text: str, preserve_negations: bool = True, lemmatize: bool = True) -> str:
    """
    Comprehensive NLP preprocessing pipeline:
    1. Removes HTML tags using BeautifulSoup.
    2. Decodes HTML entities.
    3. Removes URLs.
    4. Converts to lowercase.
    5. Removes special characters and punctuation (preserving words & spaces).
    6. Tokenizes.
    7. Removes stopwords (with negation preservation option).
    8. Lemmatizes tokens.
    """
    if not isinstance(text, str) or not text.strip():
        return ""

    # Step 1: Remove HTML tags
    try:
        soup = BeautifulSoup(text, "html.parser")
        clean_str = soup.get_text(separator=" ")
    except Exception:
        clean_str = re.sub(r'<[^>]+>', ' ', text)

    # Step 2: Unescape HTML entities
    clean_str = html.unescape(clean_str)

    # Step 3: Remove URLs
    clean_str = re.sub(r'https?://\S+|www\.\S+', '', clean_str)

    # Step 4: Lowercasing
    clean_str = clean_str.lower()

    # Step 5: Special characters & punctuation removal (keep alphabetic and spaces)
    clean_str = re.sub(r'[^a-z\s]', ' ', clean_str)

    # Step 6: Tokenization
    tokens = clean_str.split()

    # Step 7: Stopwords removal
    if preserve_negations:
        sw = get_stopwords()
        tokens = [word for word in tokens if word not in sw]
    
    # Step 8: Lemmatization
    if lemmatize:
        lem = get_lemmatizer()
        tokens = [lem.lemmatize(word) for word in tokens]

    return " ".join(tokens)
