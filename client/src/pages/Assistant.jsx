import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Info,
  Dumbbell,
  Utensils,
  Flame,
  Zap,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const Assistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! I am your FitForge AI Fitness & Nutrition Assistant. How can I help optimize your training, macros, or recovery today?`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickPrompts = [
    'How much protein do I need for muscle hypertrophy?',
    'What are the best high-protein vegetarian Indian foods?',
    'How does the Mifflin-St Jeor equation calculate BMR?',
    'How should I warm up before heavy bench press?',
    'What should I eat post-workout for optimal recovery?'
  ];

  const handleSend = async (messageToSend) => {
    const query = messageToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/ask', { message: query });
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: res.data.reply || 'Here is evidence-based advice based on exercise science principles.',
        category: res.data.category,
        suggestions: res.data.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'I encountered an error connecting to the knowledge engine. Please check your network or rephrase your question.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      {/* Header Banner */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-slate-700/80 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">FitForge AI Assistant</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Evidence-Based
              </span>
            </div>
            <p className="text-xs text-slate-400">Trained on exercise physiology, metabolic nutrition, and progressive overload principles</p>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="glass-card flex-1 p-4 sm:p-6 rounded-3xl border border-slate-800 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-800 text-cyan-400 border border-slate-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 mt-2 space-y-1.5">
                  <span className="text-[11px] font-bold text-cyan-400 block">Related Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <span className={`text-[10px] block mt-1 ${msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-500'} text-right`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Consulting exercise science database...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-shrink-0">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="glass-card p-2 sm:p-3 rounded-2xl border border-slate-800 flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          placeholder="Ask anything about workouts, nutrition, macros, or supplements..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 text-slate-950 font-bold transition flex items-center gap-1.5 text-xs"
        >
          <span className="hidden sm:inline">Ask AI</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Assistant;
