import React from 'react';

export default function StatsCard({ title, value, subtext, icon: Icon, color = 'indigo' }) {
  const colorMap = {
    indigo: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    rose: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    amber: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
  };

  const selectedColor = colorMap[color] || colorMap.indigo;

  return (
    <div className="glass-panel p-5 relative overflow-hidden group hover:border-cinema-600 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1 tracking-tight">{value}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-1 font-medium">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br border ${selectedColor} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
