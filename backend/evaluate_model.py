import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).resolve().parent))

from app.services.model_service import model_service
from app.services.prediction import predict_single_review

def evaluate():
    print("Loading model artifacts...")
    success = model_service.load_artifacts()
    if not success:
        print("Error: Could not load trained model artifacts. Please run 'python train_model.py' first.")
        sys.exit(1)

    print(f"Loaded Best Model: {model_service.get_metrics().get('best_model', 'N/A')}")
    print("\nEnter custom movie reviews to test predictions (type 'exit' or 'quit' to stop):\n")

    sample_reviews = [
        "I absolutely loved this movie. The acting was excellent and the story was amazing.",
        "I hated this movie. The story was boring and the acting was terrible.",
        "This film was disappointing and extremely slow."
    ]

    print("--- Running Default Benchmark Samples ---")
    for sample in sample_reviews:
        res = predict_single_review(sample)
        print(f"Input Review: \"{sample}\"")
        print(f"Prediction:   {res['sentiment']} (Confidence: {res['confidence']*100:.2f}%)")
        print(f"Cleaned Text: \"{res['cleaned_review']}\"\n")

    while True:
        try:
            user_input = input("Test Review > ").strip()
            if not user_input or user_input.lower() in ['exit', 'quit']:
                break
            res = predict_single_review(user_input)
            print(f" -> Sentiment: {res['sentiment']} ({res['confidence']*100:.2f}% confidence)")
            print(f" -> Cleaned:   \"{res['cleaned_review']}\"\n")
        except KeyboardInterrupt:
            break

if __name__ == "__main__":
    evaluate()
