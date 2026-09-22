import React, { useState } from 'react';
import { Download, FileSpreadsheet, Smile, Frown, Filter, Search } from 'lucide-react';
import CategorySelector from '../components/CategorySelector';
import FileUploader from '../components/FileUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatsCard from '../components/StatsCard';
import { uploadBatch } from '../services/api';

export default function BatchAnalysis() {
  const [selectedDomain, setSelectedDomain] = useState('movie');
  const [batchData, setBatchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await uploadBatch(file, selectedDomain);
      setBatchData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to process CSV file batch. Ensure column "review" exists.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!batchData || !batchData.predictions) return;

    const headers = ['domain', 'review', 'sentiment', 'confidence', 'cleaned_review'];
    const csvRows = [headers.join(',')];

    batchData.predictions.forEach((row) => {
      const escapedReview = `"${(row.review || '').replace(/"/g, '""')}"`;
      const escapedCleaned = `"${(row.cleaned_review || '').replace(/"/g, '""')}"`;
      csvRows.push([selectedDomain, escapedReview, row.sentiment, row.confidence, escapedCleaned].join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedDomain}_sentiment_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPredictions = batchData?.predictions?.filter((item) => {
    const matchesFilter =
      filter === 'all' || item.sentiment.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      !searchQuery || item.review.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
          <span>Batch Sentiment Classification via CSV</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Upload bulk reviews in CSV format for automated multi-domain sentiment prediction.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
          Target Batch Category
        </label>
        <CategorySelector selectedDomain={selectedDomain} setSelectedDomain={setSelectedDomain} />
      </div>

      <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />

      {error && <ErrorMessage message={error} />}

      {isLoading && <LoadingSpinner message={`Pre-processing ${selectedDomain} reviews and computing predictions...`} />}

      {batchData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Total Reviews Evaluated"
              value={batchData.total_count.toLocaleString()}
              subtext={`${selectedDomain.toUpperCase()} Batch Complete`}
              icon={FileSpreadsheet}
              color={selectedDomain === 'restaurant' ? 'amber' : 'indigo'}
            />
            <StatsCard
              title="Positive Sentiments"
              value={batchData.positive_count.toLocaleString()}
              subtext={`${((batchData.positive_count / batchData.total_count) * 100).toFixed(1)}% of batch`}
              icon={Smile}
              color="emerald"
            />
            <StatsCard
              title="Negative Sentiments"
              value={batchData.negative_count.toLocaleString()}
              subtext={`${((batchData.negative_count / batchData.total_count) * 100).toFixed(1)}% of batch`}
              icon={Frown}
              color="rose"
            />
          </div>

          <div className="glass-panel p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reviews..."
                    className="w-full bg-cinema-900 border border-cinema-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-cinema-900 p-1 rounded-xl border border-cinema-700 text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      filter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All ({batchData.total_count})
                  </button>
                  <button
                    onClick={() => setFilter('positive')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      filter === 'positive' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Positive ({batchData.positive_count})
                  </button>
                  <button
                    onClick={() => setFilter('negative')}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      filter === 'negative' ? 'bg-rose-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Negative ({batchData.negative_count})
                  </button>
                </div>
              </div>

              <button
                onClick={handleDownloadCSV}
                className="glass-button bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-600/30 text-xs px-4 py-2 w-full sm:w-auto"
              >
                <Download className="w-4 h-4" /> Download Predictions CSV
              </button>
            </div>

            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-cinema-700/60 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-cinema-900/80 sticky top-0 z-10">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Review Snippet</th>
                    <th className="py-3 px-4 text-center">Sentiment</th>
                    <th className="py-3 px-4 text-center">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-700/40 text-xs">
                  {filteredPredictions.map((row, idx) => {
                    const isPos = row.sentiment.toLowerCase() === 'positive';
                    return (
                      <tr key={idx} className="hover:bg-cinema-800/50 transition">
                        <td className="py-3 px-4 font-mono text-gray-500">{idx + 1}</td>
                        <td className="py-3 px-4 text-gray-200 max-w-md truncate">"{row.review}"</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full font-bold ${
                              isPos
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {row.sentiment}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-indigo-300 font-semibold">
                          {(row.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
