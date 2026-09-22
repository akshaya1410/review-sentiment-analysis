import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import ReviewInput from '../components/ReviewInput';
import SentimentResult from '../components/SentimentResult';
import PredictionHistory from '../components/PredictionHistory';
import ErrorMessage from '../components/ErrorMessage';
import { predictSentiment, getHistory, clearHistory } from '../services/api';

export default function Home({ onNavigate }) {
  const [selectedDomain, setSelectedDomain] = useState('movie');
  const [reviewText, setReviewText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistoryData = async () => {
    try {
      const data = await getHistory();
      setHistory(data || []);
    } catch (err) {
      console.warn('Could not fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleAnalyze = async () => {
    if (!reviewText.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await predictSentiment(reviewText, selectedDomain);
      setResult(res);
      fetchHistoryData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.detail || 'Unable to analyze the review. Please ensure backend server is running.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Hero Header Section */}
      <div className="relative text-center py-12 px-4 rounded-3xl overflow-hidden glass-panel border-indigo-500/20 bg-gradient-to-b from-indigo-950/40 via-cinema-900 to-cinema-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multi-Domain Sentiment Analysis Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Analyze sentiment for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">movies & restaurant reviews.</span>
        </h1>
        
        <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Select your category category below to run domain-specific NLP preprocessing pipelines and trained Machine Learning models.
        </p>
      </div>

      {/* Input Section */}
      <ReviewInput
        reviewText={reviewText}
        setReviewText={setReviewText}
        selectedDomain={selectedDomain}
        setSelectedDomain={setSelectedDomain}
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
      />

      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={handleAnalyze} />}

      {/* Result Section */}
      {result && <SentimentResult result={result} />}

      {/* Recent History */}
      <PredictionHistory history={history} onClearHistory={handleClearHistory} />

    </div>
  );
}
