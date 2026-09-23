import re
import html
from bs4 import BeautifulSoup
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Lazy loading of NLTK resources to prevent startup block if missing
_STOP_WORDS = None
_LEMMATIZER = None

NEGATION_WORDS = {
    'not', 'no', 'never', 'neither', 'nor', 'none',
    'cannot', "n't", 'hate', 'love', 'amazing', 'terrible',
    'bad', 'good', 'worst', 'best', 'awful', 'horrible'
}

def ensure_nltk_resource(resource_name: str, download_name: str):
    """Failsafe check for NLTK corpora availability."""
    try:
        nltk.data.find(resource_name)
    except LookupError:
        print(f"[INFO] NLTK resource '{resource_name}' missing. Auto-downloading '{download_name}'...")
        nltk.download(download_name, quiet=True)

def get_stopwords():
    global _STOP_WORDS
    if _STOP_WORDS is None:
        ensure_nltk_resource('corpora/stopwords', 'stopwords')
        try:
            sw = set(stopwords.words('english'))
        except Exception:
            nltk.download('stopwords', quiet=True)
            sw = set(stopwords.words('english'))
        _STOP_WORDS = sw - NEGATION_WORDS
    return _STOP_WORDS

def get_lemmatizer():
    global _LEMMATIZER
    if _LEMMATIZER is None:
        ensure_nltk_resource('corpora/wordnet', 'wordnet')
        ensure_nltk_resource('corpora/omw-1.4', 'omw-1.4')
        try:
            lem = WordNetLemmatizer()
            lem.lemmatize('test') # Test execution to ensure corpora is accessible
            _LEMMATIZER = lem
        except Exception as e:
            print(f"[WARNING] WordNet initialization error: {e}. Downloading wordnet & omw-1.4...")
            nltk.download('wordnet', quiet=True)
            nltk.download('omw-1.4', quiet=True)
            _LEMMATIZER = WordNetLemmatizer()
    return _LEMMATIZER

def clean_text(text: str, preserve_negations: bool = True, lemmatize: bool = True) -> str:
    """
    Comprehensive NLP preprocessing pipeline with robust error handling for cloud deployments.
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

    # Step 5: Special characters & punctuation removal
    clean_str = re.sub(r'[^a-z\s]', ' ', clean_str)

    # Step 6: Tokenization
    tokens = clean_str.split()

    # Step 7: Stopwords removal with negation preservation
    if preserve_negations:
        try:
            sw = get_stopwords()
            tokens = [word for word in tokens if word not in sw]
        except Exception as e:
            print(f"[WARNING] Stopword filtering skipped due to NLTK error: {e}")

    # Step 8: Lemmatization
    if lemmatize:
        try:
            lem = get_lemmatizer()
            tokens = [lem.lemmatize(word) for word in tokens]
        except Exception as e:
            print(f"[WARNING] Lemmatization fallback activated due to NLTK error: {e}")
            try:
                nltk.download('wordnet', quiet=True)
                nltk.download('omw-1.4', quiet=True)
                lem = WordNetLemmatizer()
                tokens = [lem.lemmatize(word) for word in tokens]
            except Exception:
                pass  # Use raw tokens if NLTK corpora fails completely

    return " ".join(tokens)
