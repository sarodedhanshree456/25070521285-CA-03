import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import WaterGlass from '../components/WaterGlass';
import {
  Droplets,
  Plus,
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const WaterTracker = () => {
  const { user } = useAuth();
  const [todayWater, setTodayWater] = useState({ amountMl: 0, goalMl: 3000, percentage: 0, logs: [] });
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [customAmount, setCustomAmount] = useState(250);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);

  const fetchWater = async () => {
    try {
      setLoading(true);
      const [todayRes, weeklyRes] = await Promise.allSettled([
        api.get('/water/today'),
        api.get('/water/weekly')
      ]);

      if (todayRes.status === 'fulfilled' && todayRes.value.data.success) {
        setTodayWater(todayRes.value.data.water || { amountMl: 0, goalMl: 3000, percentage: 0, logs: [] });
      }

      if (weeklyRes.status === 'fulfilled' && weeklyRes.value.data.success) {
        setWeeklyHistory(weeklyRes.value.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load water data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWater();
  }, []);

  const handleAddWater = async (amount) => {
    try {
      setLogging(true);
      const res = await api.post('/water/add', { amountMl: Number(amount) });
      if (res.data.success) {
        setTodayWater(res.data.water);
      }
      fetchWater();
    } catch (err) {
      console.error('Failed to add water:', err);
    } finally {
      setLogging(false);
    }
  };

  const handleResetWater = async () => {
    if (!window.confirm('Reset today’s water intake back to 0 ml?')) return;
    try {
      const res = await api.post('/water/reset');
      if (res.data.success) {
        setTodayWater(res.data.water);
      }
    } catch (err) {
      console.error('Failed to reset water:', err);
    }
  };

  const presets = [
    { label: 'Small Cup', amount: 150 },
    { label: 'Glass', amount: 250 },
    { label: 'Bottle', amount: 500 },
    { label: 'Sports Flask', amount: 750 }
  ];

  const chartData = weeklyHistory.map(item => ({
    day: item.day || new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
    intake: item.amountMl || 0,
    goal: item.goalMl || 3000
  }));

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              Cellular Hydration & Electrolytes
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Hydration & Water Intake Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Maintain optimal metabolic rate, cellular osmosis, and muscular performance.
          </p>
        </div>

        <button
          onClick={handleResetWater}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Today
        </button>
      </div>

      {/* Main Hydration Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Animated Glass & Stats */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
          <WaterGlass
            current={todayWater.amountMl || 0}
            target={todayWater.goalMl || 3000}
            onAddWater={handleAddWater}
          />

          <div className="space-y-1">
            <div className="text-3xl font-black text-white font-mono">
              {todayWater.amountMl || 0} <span className="text-base text-slate-400 font-sans font-normal">/ {todayWater.goalMl || 3000} ml</span>
            </div>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
              {todayWater.percentage || Math.round(((todayWater.amountMl || 0) / (todayWater.goalMl || 3000)) * 100)}% of daily target reached
            </p>
          </div>
        </div>

        {/* Quick Log Presets & Custom Input */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Quick Log Hydration</h3>
            <p className="text-xs text-slate-400 mb-6">Select a standard portion or enter exact milliliters below.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {presets.map((p) => (
                <button
                  key={p.amount}
                  onClick={() => handleAddWater(p.amount)}
                  disabled={logging}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-left transition group"
                >
                  <div className="text-xs text-slate-400 group-hover:text-cyan-400 font-medium">{p.label}</div>
                  <div className="text-lg font-extrabold text-white mt-1">+{p.amount} ml</div>
                </button>
              ))}
            </div>

            {/* Custom Milliliters Input */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-medium">Custom Amount (ml)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleAddWater(customAmount)}
                  disabled={logging}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-cyan-500/20"
                >
                  + Log
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              Drinking 500ml upon waking stimulates your resting metabolic rate by 24-30% for 60-90 minutes and flushes metabolic byproducts.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Hydration Consistency Chart */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">7-Day Hydration Consistency</h3>
            <p className="text-xs text-slate-400">Daily intake vs your 3,000 ml target</p>
          </div>
          <Droplets className="w-5 h-5 text-cyan-400" />
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#F8FAFC'
                }}
                formatter={(val) => [`${val} ml`, 'Water Intake']}
              />
              <Bar dataKey="intake" fill="#06B6D4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
