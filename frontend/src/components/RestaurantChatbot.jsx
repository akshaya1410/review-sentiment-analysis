import React, { useState } from 'react';
import {
  Bot, User, Sparkles, Send, Copy, Check, RefreshCw, Gift, ShieldAlert, Utensils, MessageSquare, Award
} from 'lucide-react';
import { sendChatbotReview } from '../services/api';

const DEMO_SCENARIOS = [
  {
    label: '🟢 Positive Dining Experience',
    name: 'Akshaya',
    text: 'The food was absolutely delicious! The pasta was cooked to perfection and the staff was extremely polite and attentive.'
  },
  {
    label: '🔴 Negative Food & Service Complaint',
    name: 'Rahul',
    text: 'Terrible experience. The burger was cold, bland, and completely tasteless. The waiter was rude and we waited 45 minutes.'
  }
];

export default function RestaurantChatbot() {
  const [customerName, setCustomerName] = useState('Valued Guest');
  const [reviewText, setReviewText] = useState('');
  const [chatResult, setChatResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateResponse = async (overrideText = null, overrideName = null) => {
    const textToSubmit = overrideText !== null ? overrideText : reviewText;
    const nameToSubmit = overrideName !== null ? overrideName : customerName;

    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    setChatResult(null);
    setCopied(false);

    try {
      const data = await sendChatbotReview(textToSubmit, nameToSubmit, 'restaurant');
      setChatResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to connect to AI Chatbot. Ensure backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (chatResult && chatResult.response) {
      navigator.clipboard.writeText(chatResult.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 text-center bg-gradient-to-b from-amber-950/30 via-cinema-900 to-cinema-900 border-amber-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3 border border-amber-500/30">
          <Bot className="w-4 h-4" /> AI Restaurant Assistant ("RestoBot AI")
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Automated Customer Review & Management Reply AI
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto">
          When a customer leaves food feedback, RestoBot AI analyzes sentiment, detects dining aspects (Food, Service, Hygiene, Price), and generates an instant, executive manager response.
        </p>
      </div>

      {/* Input Panel */}
      <div className="glass-panel p-6 shadow-2xl space-y-4 border-amber-500/20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-400" /> Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-cinema-900 border border-cinema-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Customer Review Text
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type customer dining review here... (e.g. 'The salmon was fantastic, but we waited 40 minutes for our drinks.')"
              rows={3}
              className="w-full bg-cinema-900 border border-cinema-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
            />
          </div>
        </div>

        {/* Demo Scenario Chips */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 mb-2">Try quick demo customer scenario:</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_SCENARIOS.map((sc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomerName(sc.name);
                  setReviewText(sc.text);
                  handleGenerateResponse(sc.text, sc.name);
                }}
                className="text-xs px-3 py-1.5 rounded-lg border bg-cinema-800 hover:bg-cinema-700 text-amber-300 border-cinema-700 transition"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleGenerateResponse()}
            disabled={isLoading || !reviewText.trim()}
            className="glass-button bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs px-6 py-2.5 shadow-lg shadow-amber-600/30"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>RestoBot AI is generating reply...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Manager Response</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Conversation Stream & Output Card */}
      {chatResult && (
        <div className="space-y-6">
          
          {/* Conversation Stream */}
          <div className="glass-panel p-6 space-y-6 border-cinema-700">
            
            {/* Customer Message Bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-cinema-700 text-gray-200 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 bg-cinema-900/90 p-4 rounded-2xl rounded-tl-none border border-cinema-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">{chatResult.customer_name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">Customer Review</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed italic">"{chatResult.review}"</p>
              </div>
            </div>

            {/* AI Assistant Message Bubble */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shrink-0 shadow-lg shadow-amber-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 bg-cinema-950/80 p-5 rounded-2xl rounded-tl-none border border-amber-500/30 space-y-4">
                
                {/* Sentiment & Aspect Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cinema-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      chatResult.sentiment.toLowerCase() === 'positive'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {chatResult.sentiment.toUpperCase()} ({Math.round(chatResult.confidence * 100)}% Confidence)
                    </span>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {chatResult.action_recommended}
                    </span>
                  </div>

                  {/* Detected Aspect Tags */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {chatResult.detected_aspects.map((asp, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-cinema-800 text-gray-300 border border-cinema-700">
                        #{asp.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Generated Response Content */}
                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Generated Restaurant Manager Reply
                  </h4>
                  <p className="text-xs text-amber-100/90 whitespace-pre-line leading-relaxed font-sans bg-cinema-900/60 p-4 rounded-xl border border-cinema-800">
                    {chatResult.response}
                  </p>
                </div>

                {/* Voucher Code Box */}
                {chatResult.voucher_code && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span className="text-gray-300">Generated Customer Reward Voucher:</span>
                    </div>
                    <span className="font-mono font-bold text-amber-300 px-3 py-1 bg-cinema-900 rounded border border-amber-500/40">
                      {chatResult.voucher_code}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={handleCopy}
                    className="glass-button bg-cinema-800 hover:bg-cinema-700 text-xs px-4 py-2 text-gray-200 border border-cinema-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Response!' : 'Copy AI Response'}</span>
                  </button>

                  <button
                    onClick={() => handleGenerateResponse()}
                    className="glass-button bg-cinema-800 hover:bg-cinema-700 text-xs px-4 py-2 text-gray-300 border border-cinema-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Regenerate Reply</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
