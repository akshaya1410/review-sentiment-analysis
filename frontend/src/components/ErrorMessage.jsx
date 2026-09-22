import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-300 text-sm">
      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-rose-200">Processing Error</p>
        <p className="mt-1 text-xs text-rose-300/90">{message || 'An unexpected error occurred. Please check backend connection.'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 text-xs font-semibold px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-rose-200 border border-rose-500/40 flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
