import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ChatbotPage from './pages/ChatbotPage';
import Dashboard from './pages/Dashboard';
import BatchAnalysis from './pages/BatchAnalysis';
import About from './pages/About';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'chatbot':
        return <ChatbotPage />;
      case 'dashboard':
        return <Dashboard />;
      case 'batch':
        return <BatchAnalysis />;
      case 'about':
        return <About />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cinema-900 text-gray-100 selection:bg-indigo-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActivePage()}
      </main>

      <Footer />
    </div>
  );
}
