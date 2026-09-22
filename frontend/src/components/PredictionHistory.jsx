import React from 'react';
import { History, Trash2, Smile, Frown, Clock, Film, Utensils } from 'lucide-react';

export default function PredictionHistory({ history = [], onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel p-6 text-center text-gray-400">
        <History className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
        <p className="text-sm font-medium">No recent prediction history recorded yet.</p>
        <p className="text-xs text-gray-500 mt-1">Manual review predictions will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Recent Prediction History</h3>
        </div>
        {onClearHistory && (
          <button
            onClick={onClearHistory}
            className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear History
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {history.map((item) => {
          const isPos = item.sentiment.toLowerCase() === 'positive';
          const domain = (item.domain || 'movie').toLowerCase();
          const timeFormatted = item.created_at
            ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just now';

          return (
            <div
              key={item.id || Math.random()}
              className="p-3.5 rounded-xl bg-cinema-900/60 border border-cinema-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-cinema-600 transition"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-lg shrink-0 ${
                  isPos ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isPos ? <Smile className="w-4 h-4" /> : <Frown className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize flex items-center gap-1 ${
                      domain === 'restaurant'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {domain === 'restaurant' ? <Utensils className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                      {domain}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 truncate italic">"{item.review}"</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-mono">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>{timeFormatted}</span>
                    <span>•</span>
                    <span>{item.model_name || 'Trained Model'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  isPos ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {item.sentiment}
                </span>
                <span className="text-xs font-mono font-semibold text-indigo-300 bg-cinema-800 px-2 py-1 rounded-lg border border-cinema-700">
                  {Math.round(item.confidence * 100)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
