import nltk

def download_required_nltk_data():
    """Download NLTK resources required for text preprocessing."""
    resources = [
        'stopwords',
        'punkt',
        'wordnet',
        'omw-1.4'
    ]
    
    print("Downloading NLTK resources...")
    for resource in resources:
        try:
            nltk.download(resource, quiet=True)
            print(f"Successfully downloaded/verified NLTK resource: {resource}")
        except Exception as e:
            print(f"Error downloading NLTK resource '{resource}': {e}")
            
    print("NLTK data download completed.")

if __name__ == "__main__":
    download_required_nltk_data()
