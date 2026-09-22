import React from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingSpinner({ message = 'Analyzing sentiment...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <Sparkles className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-gray-300 animate-pulse">{message}</p>
    </div>
  );
}
