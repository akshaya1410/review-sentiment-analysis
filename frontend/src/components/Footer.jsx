import React from 'react';
import { Film, Github, BookOpen, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cinema-700/60 bg-cinema-900/90 py-10 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-base">Movie Review NLP System</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              End-to-End Natural Language Processing & Sentiment Classification project trained on the IMDB 50,000 Movie Reviews Dataset using TF-IDF and Machine Learning algorithms.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">NLP Pipeline Components</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• HTML Tag Removal (BeautifulSoup)</li>
              <li>• Negation-Preserving Stopword Filtering</li>
              <li>• WordNet Lemmatization</li>
              <li>• Sublinear TF-IDF Feature Extraction</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3 text-xs tracking-wider uppercase">ML Models Evaluated</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>• Logistic Regression (Scikit-Learn)</li>
              <li>• Multinomial Naive Bayes</li>
              <li>• Calibrated Linear SVM</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-cinema-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} Movie Review Sentiment Analysis. Built for academic demonstration.</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">FastAPI + React + Scikit-Learn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
