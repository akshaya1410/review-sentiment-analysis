import React, { useEffect, useState } from 'react';
import { Database, ThumbsUp, ThumbsDown, Award, Target, RefreshCw } from 'lucide-react';
import CategorySelector from '../components/CategorySelector';
import StatsCard from '../components/StatsCard';
import { SentimentPieChart, ModelBenchmarkBarChart, ConfusionMatrixGrid } from '../components/SentimentChart';
import ModelComparisonTable from '../components/ModelComparisonTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getDashboardStats } from '../services/api';

export default function Dashboard() {
  const [selectedDomain, setSelectedDomain] = useState('movie');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async (domainToFetch = selectedDomain) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats(domainToFetch);
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to load dashboard statistics from backend API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedDomain);
  }, [selectedDomain]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dataset & Model Benchmark Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Live analytics from trained models for Movies and Restaurants</p>
        </div>
        <button
          onClick={() => fetchStats(selectedDomain)}
          className="glass-button bg-cinema-800 hover:bg-cinema-700 text-gray-300 text-xs px-4 py-2 border border-cinema-700"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
        </button>
      </div>

      {/* Domain Category Selector */}
      <div className="max-w-md mx-auto">
        <CategorySelector selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />
      </div>

      {isLoading && <LoadingSpinner message={`Fetching live ${selectedDomain} domain metrics...`} />}

      {error && <ErrorMessage message={error} onRetry={() => fetchStats(selectedDomain)} />}

      {!isLoading && stats && (
        <>
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title={`${selectedDomain.toUpperCase()} Dataset Size`}
              value={stats.total_dataset_reviews.toLocaleString()}
              subtext="Polarized Benchmark Reviews"
              icon={Database}
              color={selectedDomain === 'restaurant' ? 'amber' : 'indigo'}
            />
            <StatsCard
              title="Positive Reviews"
              value={stats.positive_dataset_reviews.toLocaleString()}
              subtext="50% Class Distribution"
              icon={ThumbsUp}
              color="emerald"
            />
            <StatsCard
              title="Negative Reviews"
              value={stats.negative_dataset_reviews.toLocaleString()}
              subtext="50% Class Distribution"
              icon={ThumbsDown}
              color="rose"
            />
            <StatsCard
              title="Best Model Architecture"
              value={stats.best_model}
              subtext="Selected by F1 Score"
              icon={Award}
              color="amber"
            />
            <StatsCard
              title="Best Accuracy"
              value={`${(stats.accuracy * 100).toFixed(2)}%`}
              subtext={`F1 Score: ${stats.f1_score.toFixed(4)}`}
              icon={Target}
              color="purple"
            />
          </div>

          {/* Visual Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SentimentPieChart
              positiveCount={stats.positive_dataset_reviews}
              negativeCount={stats.negative_dataset_reviews}
            />
            <ModelBenchmarkBarChart modelComparison={stats.model_comparison} />
          </div>

          {/* Confusion Matrix & Model Comparison Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ConfusionMatrixGrid cm={stats.confusion_matrix} modelName={stats.best_model} />
            </div>
            <div className="lg:col-span-2">
              <ModelComparisonTable models={stats.model_comparison} bestModel={stats.best_model} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
