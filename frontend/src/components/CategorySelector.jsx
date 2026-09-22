import React from 'react';
import { Film, Utensils } from 'lucide-react';

export default function CategorySelector({ selectedDomain, setSelectedDomain }) {
  return (
    <div className="flex items-center justify-center gap-2 p-1.5 bg-cinema-800/90 rounded-2xl border border-cinema-700/80 max-w-md mx-auto shadow-lg">
      <button
        type="button"
        onClick={() => setSelectedDomain('movie')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
          selectedDomain === 'movie'
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
            : 'text-gray-400 hover:text-gray-200 hover:bg-cinema-700/50'
        }`}
      >
        <Film className={`w-4 h-4 ${selectedDomain === 'movie' ? 'text-white' : 'text-gray-400'}`} />
        <span>🎬 Movie Review</span>
      </button>

      <button
        type="button"
        onClick={() => setSelectedDomain('restaurant')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 ${
          selectedDomain === 'restaurant'
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 ring-1 ring-amber-400'
            : 'text-gray-400 hover:text-gray-200 hover:bg-cinema-700/50'
        }`}
      >
        <Utensils className={`w-4 h-4 ${selectedDomain === 'restaurant' ? 'text-white' : 'text-gray-400'}`} />
        <span>🍽️ Restaurant Review</span>
      </button>
    </div>
  );
}
