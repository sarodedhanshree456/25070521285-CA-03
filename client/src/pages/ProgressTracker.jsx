import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  TrendingUp,
  Plus,
  Calendar,
  Scale,
  Activity,
  Award,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const ProgressTracker = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('month');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logging, setLogging] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    weightKg: user?.weightKg || 75,
    bodyFatPercentage: user?.bodyFatPercentage || 18,
    chestCm: '',
    waistCm: '',
    hipsCm: '',
    armsCm: '',
    thighsCm: '',
    notes: ''
  });

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/progress/history?filter=${filter}`);
      if (res.data.success) {
        setHistory(res.data.history || []);
      }
    } catch (err) {
      console.error('Failed to load progress history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [filter]);

  const handleLogProgress = async (e) => {
    e.preventDefault();
    try {
      setLogging(true);
      await api.post('/progress/log', {
        weightKg: Number(formData.weightKg),
        bodyFatPercentage: formData.bodyFatPercentage ? Number(formData.bodyFatPercentage) : undefined,
        chestCm: formData.chestCm ? Number(formData.chestCm) : undefined,
        waistCm: formData.waistCm ? Number(formData.waistCm) : undefined,
        hipsCm: formData.hipsCm ? Number(formData.hipsCm) : undefined,
        armsCm: formData.armsCm ? Number(formData.armsCm) : undefined,
        thighsCm: formData.thighsCm ? Number(formData.thighsCm) : undefined,
        notes: formData.notes
      });
      setShowLogModal(false);
      fetchProgress();
    } catch (err) {
      console.error('Failed to log progress:', err);
    } finally {
      setLogging(false);
    }
  };

  const currentWeight = history.length > 0 ? history[history.length - 1].weightKg : (user?.weightKg || 75);
  const initialWeight = history.length > 0 ? history[0].weightKg : currentWeight;
  const weightChange = (currentWeight - initialWeight).toFixed(1);

  // BMI calculation
  const heightM = (user?.heightCm || 175) / 100;
  const bmi = (currentWeight / (heightM * heightM)).toFixed(1);

  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-amber-400' };
    if (val < 25) return { label: 'Normal / Healthy', color: 'text-emerald-400' };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-rose-400' };
  };

  const bmiCat = getBmiCategory(bmi);

  // Chart data formatting
  const chartData = history.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: item.weightKg,
    fat: item.bodyFatPercentage
  }));

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              Somatic Transformation Metrics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Progress & Body Composition Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Track weight velocity, body fat percentages, and circumferences over time.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Log New Measurement
        </button>
      </div>

      {/* Metrics Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Current Weight</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{currentWeight}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-500">Updated from latest log</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Weight Delta</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black ${Number(weightChange) <= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
              {weightChange > 0 ? `+${weightChange}` : weightChange}
            </span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-500">Net change across recorded period</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Body Mass Index (BMI)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{bmi}</span>
            <span className={`text-xs font-bold ${bmiCat.color}`}>({bmiCat.label})</span>
          </div>
          <p className="text-[11px] text-slate-500">Height: {user?.heightCm || 175} cm</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Estimated Body Fat</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{formData.bodyFatPercentage || 18}</span>
            <span className="text-xs text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-emerald-400">Target Range: 12-16%</p>
        </div>
      </div>

      {/* Weight Progression Chart */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Weight Progression Trajectory</h2>
            <p className="text-xs text-slate-400">Visual trendline tracking your metabolic evolution</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {['week', 'month', 'year'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg font-semibold capitalize transition ${
                  filter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No progress logs recorded yet for this filter.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F8FAFC'
                  }}
                  formatter={(val) => [`${val} kg`, 'Body Weight']}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#06B6D4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Measurement History Table */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white">Historical Logs & Somatometrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-2">
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">WEIGHT</th>
                <th className="py-2.5 px-3">BODY FAT</th>
                <th className="py-2.5 px-3">CHEST</th>
                <th className="py-2.5 px-3">WAIST</th>
                <th className="py-2.5 px-3">HIPS</th>
                <th className="py-2.5 px-3">ARMS</th>
                <th className="py-2.5 px-3">NOTES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {history.map((item, idx) => (
                <tr key={item._id || idx} className="hover:bg-slate-800/20 transition">
                  <td className="py-3 px-3 font-semibold text-slate-300">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-3 font-bold text-cyan-400">{item.weightKg} kg</td>
                  <td className="py-3 px-3 text-slate-300">{item.bodyFatPercentage ? `${item.bodyFatPercentage}%` : '-'}</td>
                  <td className="py-3 px-3 text-slate-400">{item.chestCm ? `${item.chestCm} cm` : '-'}</td>
                  <td className="py-3 px-3 text-slate-400">{item.waistCm ? `${item.waistCm} cm` : '-'}</td>
                  <td className="py-3 px-3 text-slate-400">{item.hipsCm ? `${item.hipsCm} cm` : '-'}</td>
                  <td className="py-3 px-3 text-slate-400">{item.armsCm ? `${item.armsCm} cm` : '-'}</td>
                  <td className="py-3 px-3 text-slate-500 italic max-w-xs truncate">{item.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Measurement Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleLogProgress} className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Log Today's Body Metrics</h3>
              <button type="button" onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Body Weight (kg)*</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyFatPercentage}
                  onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.chestCm}
                  onChange={(e) => setFormData({ ...formData, chestCm: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.waistCm}
                  onChange={(e) => setFormData({ ...formData, waistCm: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.hipsCm}
                  onChange={(e) => setFormData({ ...formData, hipsCm: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Arms (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.armsCm}
                  onChange={(e) => setFormData({ ...formData, armsCm: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="text-slate-400 block mb-1">Notes / Weekly Reflection</label>
              <textarea
                rows="2"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Waist dropped 1cm, feeling leaner and energized..."
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={logging}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-xs font-bold"
              >
                {logging ? 'Saving...' : 'Save Measurement'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
