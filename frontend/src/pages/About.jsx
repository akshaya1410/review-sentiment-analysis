import React from 'react';
import { Info, Layers, Cpu, Database, ShieldAlert, BookOpen, Utensils, Film } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 text-center bg-gradient-to-b from-indigo-950/40 via-cinema-900 to-cinema-900 border-indigo-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-4 border border-indigo-500/30">
          <BookOpen className="w-3.5 h-3.5" /> Multi-Domain NLP Architecture & Documentation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Multi-Domain Sentiment Analysis Platform
        </h1>
        <p className="mt-3 text-sm text-gray-300 max-w-2xl mx-auto">
          Unified NLP system supporting dual domain classification: <strong>🎬 Movie Reviews</strong> (IMDB 50,000 dataset) and <strong>🍽️ Restaurant Reviews</strong> (1,000 Food & Dining dataset).
        </p>
      </div>

      {/* Dual Domain Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Movie Domain Spec */}
        <div className="glass-panel p-6 border-indigo-500/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" />
            <span>🎬 Movie Review Domain Spec</span>
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Dataset</span>
              <span className="font-mono font-bold text-white">IMDB 50,000 Movie Reviews</span>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Class Split</span>
              <span className="font-mono font-bold text-emerald-400">25,000 Pos / 25,000 Neg</span>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Production Model</span>
              <span className="font-mono font-bold text-indigo-300">Linear SVM (Calibrated)</span>
            </li>
            <li className="flex items-center justify-between py-1">
              <span className="text-gray-400">Test Accuracy</span>
              <span className="font-mono font-bold text-purple-300">90.09% (0.9018 F1-Score)</span>
            </li>
          </ul>
        </div>

        {/* Restaurant Domain Spec */}
        <div className="glass-panel p-6 border-amber-500/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-amber-400" />
            <span>🍽️ Restaurant Review Domain Spec</span>
          </h3>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Dataset</span>
              <span className="font-mono font-bold text-white">1,000 Restaurant Feedback Reviews</span>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Class Split</span>
              <span className="font-mono font-bold text-emerald-400">500 Pos / 500 Neg</span>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-cinema-700/60">
              <span className="text-gray-400">Production Model</span>
              <span className="font-mono font-bold text-amber-300">Logistic Regression</span>
            </li>
            <li className="flex items-center justify-between py-1">
              <span className="text-gray-400">Target Attributes</span>
              <span className="font-mono font-bold text-amber-200">Food, Service, Hygiene, Price</span>
            </li>
          </ul>
        </div>

      </div>

      {/* NLP Pipeline Architecture */}
      <div className="glass-panel p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          <span>NLP Preprocessing & Feature Extraction</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-cinema-900/80 border border-cinema-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 1</span>
            <h4 className="text-sm font-bold text-white mt-1">HTML & Noise Cleaning</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              BeautifulSoup tag stripping, unescaping HTML entities, and regex URL removal.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-900/80 border border-cinema-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 2</span>
            <h4 className="text-sm font-bold text-white mt-1">Negation Preservation</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Filters NLTK stopwords while explicitly preserving sentiment negations (`not`, `never`, `hate`, `love`).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-900/80 border border-cinema-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 3</span>
            <h4 className="text-sm font-bold text-white mt-1">WordNet Lemmatization</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Converts inflected words to dictionary root lemmas (`delicious` → `delicious`, `disappointed` → `disappoint`).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cinema-900/80 border border-cinema-700/60">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 4</span>
            <h4 className="text-sm font-bold text-white mt-1">TF-IDF Vectorization</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Converts text into unigram and bigram n-gram feature matrices with sublinear TF scaling.
            </p>
          </div>
        </div>
      </div>

      {/* Project Disclaimer & Limitations */}
      <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
        <div className="text-xs">
          <h4 className="font-bold text-amber-200 text-sm mb-1">Academic Project Notice & System Limitations</h4>
          <p className="text-amber-300/90 leading-relaxed">
            “This system is intended for educational and demonstration purposes. Predictions are based on patterns learned from the training dataset and may not always reflect human interpretation.”
          </p>
        </div>
      </div>

    </div>
  );
}
