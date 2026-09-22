import React from 'react';
import { Award, CheckCircle, Cpu } from 'lucide-react';

export default function ModelComparisonTable({ models = {}, bestModel = '' }) {
  if (!models || Object.keys(models).length === 0) {
    return (
      <div className="glass-panel p-6 text-center text-gray-400">
        <p>No model benchmark data available. Please train models first.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Machine Learning Model Comparison</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">Evaluated on 20% stratified test set (10,000 reviews)</p>
        </div>
        {bestModel && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>Selected Model: {bestModel}</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-cinema-700/60 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-cinema-900/60">
              <th className="py-3.5 px-4 rounded-l-xl">Model Architecture</th>
              <th className="py-3.5 px-4 text-center">Accuracy</th>
              <th className="py-3.5 px-4 text-center">Precision</th>
              <th className="py-3.5 px-4 text-center">Recall</th>
              <th className="py-3.5 px-4 text-center">F1 Score</th>
              <th className="py-3.5 px-4 text-right rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cinema-700/40 text-sm">
            {Object.entries(models).map(([name, metrics]) => {
              const isBest = name === bestModel;
              return (
                <tr
                  key={name}
                  className={`transition ${
                    isBest ? 'bg-indigo-500/10 hover:bg-indigo-500/15' : 'hover:bg-cinema-800/40'
                  }`}
                >
                  <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                    {isBest && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    <span>{name}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-indigo-300">
                    {(metrics.accuracy * 100).toFixed(2)}%
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-gray-300">
                    {metrics.precision.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono text-gray-300">
                    {metrics.recall.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">
                    {metrics.f1_score.toFixed(4)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {isBest ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Production Model
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cinema-700/60 text-gray-400">
                        Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
