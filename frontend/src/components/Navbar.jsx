import React, { useEffect, useState } from 'react';
import { Film, LayoutDashboard, FileSpreadsheet, Info, Sparkles, Bot } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function Navbar({ activeTab, setActiveTab }) {
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const health = await checkHealth();
        setBackendStatus(health.status === 'healthy' ? 'online' : 'degraded');
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'home', label: 'Analyzer', icon: Sparkles },
    { id: 'chatbot', label: 'AI Assistant', icon: Bot },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batch', label: 'Batch CSV', icon: FileSpreadsheet },
    { id: 'about', label: 'About NLP', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cinema-900/90 backdrop-blur-xl border-b border-cinema-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">SentimentAI</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold border border-indigo-500/30">
                  Multi-Domain
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">Movie & Restaurant NLP System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? item.id === 'chatbot'
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-cinema-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Backend Health Badge */}
          <div className="flex items-center gap-2">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
              backendStatus === 'online'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : backendStatus === 'degraded'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : backendStatus === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'
              }`} />
              <span className="capitalize">{backendStatus === 'online' ? 'API Connected' : backendStatus === 'degraded' ? 'Models Ready' : 'API Offline'}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
