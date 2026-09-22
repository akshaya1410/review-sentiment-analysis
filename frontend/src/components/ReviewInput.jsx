import React from 'react';
import { Sparkles, Trash2, MessageSquare, ThumbsUp, ThumbsDown, Film, Utensils } from 'lucide-react';
import CategorySelector from './CategorySelector';

const SAMPLE_REVIEWS = {
  movie: [
    {
      type: 'positive',
      label: 'Positive Movie Sample',
      text: "I absolutely loved this movie. The acting was excellent and the story was amazing from start to finish."
    },
    {
      type: 'negative',
      label: 'Negative Movie Sample',
      text: "I hated this movie. The story was boring, characters were uninteresting, and the acting was terrible."
    }
  ],
  restaurant: [
    {
      type: 'positive',
      label: 'Positive Restaurant Sample',
      text: "The food here was absolutely delicious! The pasta was cooked to perfection and the staff was extremely polite and attentive."
    },
    {
      type: 'negative',
      label: 'Negative Restaurant Sample',
      text: "Terrible experience. The burger was cold, bland, and completely tasteless. The waiter was rude and lazy."
    }
  ]
};

export default function ReviewInput({
  reviewText,
  setReviewText,
  selectedDomain,
  setSelectedDomain,
  onAnalyze,
  isLoading
}) {
  const samples = SAMPLE_REVIEWS[selectedDomain] || SAMPLE_REVIEWS.movie;

  return (
    <div className="glass-panel p-6 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Domain Category Switcher */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
          Select Sentiment Analysis Category
        </label>
        <CategorySelector selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          {selectedDomain === 'restaurant' ? (
            <Utensils className="w-5 h-5 text-amber-400" />
          ) : (
            <Film className="w-5 h-5 text-indigo-400" />
          )}
          <h2 className="text-lg font-bold text-white capitalize">
            {selectedDomain} Review Input
          </h2>
        </div>
        {reviewText && (
          <button
            onClick={() => setReviewText('')}
            className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Text
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder={
            selectedDomain === 'restaurant'
              ? "Write a restaurant review... (e.g., 'The pizza was fresh and delicious, but service was slow...')"
              : "Write a movie review... (e.g., 'The screenplay was a masterpiece with incredible depth...')"
          }
          rows={5}
          className="w-full bg-cinema-900/90 border border-cinema-700/80 rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm leading-relaxed resize-y transition"
          maxLength={10000}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500 font-mono">
          {reviewText.length} / 10,000
        </div>
      </div>

      {/* Quick Test Samples Chips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">
          Try quick demo sample ({selectedDomain} domain):
        </p>
        <div className="flex flex-wrap gap-2">
          {samples.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setReviewText(sample.text)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 ${
                sample.type === 'positive'
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}
            >
              {sample.type === 'positive' ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !reviewText.trim()}
          className={`glass-button text-white font-semibold shadow-lg px-8 py-3 text-sm w-full sm:w-auto ${
            selectedDomain === 'restaurant'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-600/30'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-600/30'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              <span>Analyzing {selectedDomain} Review...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze {selectedDomain === 'restaurant' ? 'Restaurant' : 'Movie'} Sentiment</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
