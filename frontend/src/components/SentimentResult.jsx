import React from 'react';
import { Smile, Frown, Cpu, Layers, Tag, Film, Utensils } from 'lucide-react';

export default function SentimentResult({ result }) {
  if (!result) return null;

  const isPositive = result.sentiment.toLowerCase() === 'positive';
  const confidencePercent = Math.round(result.confidence * 100);
  const domain = (result.domain || 'movie').toLowerCase();

  return (
    <div className={`glass-panel p-6 shadow-2xl border-l-8 transition-all duration-500 ${
      isPositive ? 'border-l-emerald-500 bg-gradient-to-r from-emerald-950/20 to-cinema-800' : 'border-l-rose-500 bg-gradient-to-r from-rose-950/20 to-cinema-800'
    }`}>
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-cinema-700/60">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${
            isPositive ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'
          }`}>
            {isPositive ? <Smile className="w-10 h-10 animate-bounce" /> : <Frown className="w-10 h-10 animate-bounce" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                isPositive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                Predicted Sentiment
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold border flex items-center gap-1 capitalize ${
                domain === 'restaurant'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
              }`}>
                {domain === 'restaurant' ? <Utensils className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                {domain} Domain
              </span>
              <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> {result.model}
              </span>
            </div>
            <h3 className={`text-3xl font-extrabold tracking-tight mt-1 ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isPositive ? '😊 POSITIVE' : '😞 NEGATIVE'}
            </h3>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="w-full sm:w-48 bg-cinema-900/90 p-4 rounded-xl border border-cinema-700/80">
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-gray-400">Model Confidence</span>
            <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>{confidencePercent}%</span>
          </div>
          <div className="w-full h-3 bg-cinema-700 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isPositive ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-red-400'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5 text-center">Probability estimate of class assignment</p>
        </div>
      </div>

      {/* Review Content Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-cinema-900/60 p-4 rounded-xl border border-cinema-700/60">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Original Review Text
          </h4>
          <p className="text-sm text-gray-200 leading-relaxed italic bg-cinema-950/40 p-3 rounded-lg border border-cinema-800">
            "{result.review}"
          </p>
        </div>

        <div className="bg-cinema-900/60 p-4 rounded-xl border border-cinema-700/60">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>NLP Cleaned Text (Stemmed / Lemmatized)</span>
          </h4>
          <p className="text-sm font-mono text-indigo-200 leading-relaxed bg-cinema-950/40 p-3 rounded-lg border border-cinema-800">
            {result.cleaned_review || <span className="text-gray-500 italic">None</span>}
          </p>
        </div>
      </div>

      {/* Extracted Tokens */}
      {result.sentiment_tokens && result.sentiment_tokens.length > 0 && (
        <div className="mt-6 pt-4 border-t border-cinema-700/40">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-400" /> Key Extracted Tokens ({domain} domain)
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.sentiment_tokens.map((token, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20"
              >
                #{token}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
