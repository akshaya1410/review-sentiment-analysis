import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart3, Grid } from 'lucide-react';

export function SentimentPieChart({ positiveCount = 25000, negativeCount = 25000 }) {
  const data = [
    { name: 'Positive Reviews', value: positiveCount, color: '#10B981' },
    { name: 'Negative Reviews', value: negativeCount, color: '#EF4444' },
  ];

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4">
        <PieIcon className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">IMDB Dataset Sentiment Distribution</h3>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1F2937" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#FFF' }}
              formatter={(value) => [value.toLocaleString() + ' reviews', 'Count']}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ModelBenchmarkBarChart({ modelComparison }) {
  if (!modelComparison || Object.keys(modelComparison).length === 0) return null;

  const data = Object.entries(modelComparison).map(([name, metrics]) => ({
    name,
    Accuracy: +(metrics.accuracy * 100).toFixed(1),
    'F1 Score': +(metrics.f1_score * 100).toFixed(1),
    Precision: +(metrics.precision * 100).toFixed(1),
    Recall: +(metrics.recall * 100).toFixed(1),
  }));

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white">Machine Learning Model Comparison (%)</h3>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
            <YAxis domain={[70, 100]} stroke="#9CA3AF" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#FFF' }}
              formatter={(value) => [`${value}%`, 'Score']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="Accuracy" fill="#6366F1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="F1 Score" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Precision" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ConfusionMatrixGrid({ cm, modelName = "Best Model" }) {
  if (!cm || cm.length < 2) return null;
  const tn = cm[0][0];
  const fp = cm[0][1];
  const fn = cm[1][0];
  const tp = cm[1][1];

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center gap-2 mb-4">
        <Grid className="w-5 h-5 text-indigo-400" />
        <div>
          <h3 className="text-base font-bold text-white">Confusion Matrix Visualization</h3>
          <p className="text-xs text-gray-400">{modelName} - Test Evaluation Set</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto my-2 text-center font-mono">
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
          <p className="text-[10px] uppercase font-sans text-emerald-400 font-bold">True Negative (TN)</p>
          <p className="text-2xl font-extrabold text-white mt-1">{tn?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Correctly Negative</p>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
          <p className="text-[10px] uppercase font-sans text-rose-400 font-bold">False Positive (FP)</p>
          <p className="text-2xl font-extrabold text-white mt-1">{fp?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Type I Error</p>
        </div>

        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl">
          <p className="text-[10px] uppercase font-sans text-rose-400 font-bold">False Negative (FN)</p>
          <p className="text-2xl font-extrabold text-white mt-1">{fn?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Type II Error</p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
          <p className="text-[10px] uppercase font-sans text-emerald-400 font-bold">True Positive (TP)</p>
          <p className="text-2xl font-extrabold text-white mt-1">{tp?.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400 mt-1">Correctly Positive</p>
        </div>
      </div>
    </div>
  );
}
