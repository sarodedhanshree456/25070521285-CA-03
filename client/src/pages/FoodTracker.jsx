import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import MacroBar from '../components/MacroBar';
import {
  Utensils,
  Search,
  Plus,
  Trash2,
  Flame,
  Calendar,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const FoodTracker = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [logs, setLogs] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeMealType, setActiveMealType] = useState('breakfast');
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Selected food log form
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [logging, setLogging] = useState(false);

  // Custom food modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: '',
    category: 'grain',
    servingSize: 100,
    servingUnit: 'g',
    calories: 150,
    protein: 5,
    carbs: 25,
    fat: 2
  });

  const fetchLogs = async (date) => {
    try {
      setLoading(true);
      const res = await api.get(`/food/logs?date=${date}`);
      if (res.data.success) {
        setLogs(res.data.logs || []);
        setTotals(res.data.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 });
      }
    } catch (err) {
      console.error('Failed to load food logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      const res = await api.get(`/food/search?query=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setSearchResults(res.data.foods || []);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleOpenAddFood = (mealType) => {
    setActiveMealType(mealType);
    setShowSearchModal(true);
    handleSearch('');
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setQuantity(1);
  };

  const handleLogFood = async () => {
    if (!selectedFood) return;
    try {
      setLogging(true);
      const payload = {
        foodId: selectedFood._id,
        foodName: selectedFood.name,
        mealType: activeMealType,
        servingSize: selectedFood.servingSize,
        servingUnit: selectedFood.servingUnit,
        quantity: Number(quantity),
        calories: Math.round(selectedFood.calories * quantity),
        protein: Math.round(selectedFood.protein * quantity),
        carbs: Math.round(selectedFood.carbs * quantity),
        fat: Math.round(selectedFood.fat * quantity),
        date: selectedDate
      };

      await api.post('/food/log', payload);
      setShowSearchModal(false);
      setSelectedFood(null);
      fetchLogs(selectedDate);
    } catch (err) {
      console.error('Failed to log food:', err);
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (id) => {
    try {
      await api.delete(`/food/log/${id}`);
      fetchLogs(selectedDate);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleCreateCustom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/food/custom', customForm);
      setShowCustomModal(false);
      handleSearch(customForm.name);
    } catch (err) {
      console.error('Custom food creation failed:', err);
    }
  };

  const targetCalories = user?.targetCalories || 1930;
  const targetProtein = user?.targetProtein || 145;
  const targetCarbs = user?.targetCarbs || 195;
  const targetFat = user?.targetFat || 55;

  const mealCategories = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Nutritional Biomarkers & Calories
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Daily Food & Nutrition Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Log your daily nutrition across Indian & global whole foods with precision macro analysis.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-slate-100 text-xs font-bold focus:outline-none"
          />
        </div>
      </div>

      {/* Daily Macro Targets Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Daily Macro Intake</h2>
            <p className="text-xs text-slate-400">Target calculated using Mifflin-St Jeor metabolic model</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-white">{totals.calories}</span>
            <span className="text-xs text-slate-400 font-semibold">/ {targetCalories} kcal</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MacroBar
            label="Protein"
            current={totals.protein}
            target={targetProtein}
            unit="g"
            color="emerald"
          />
          <MacroBar
            label="Carbs"
            current={totals.carbs}
            target={targetCarbs}
            unit="g"
            color="cyan"
          />
          <MacroBar
            label="Fats"
            current={totals.fat}
            target={targetFat}
            unit="g"
            color="amber"
          />
        </div>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealCategories.map((type) => {
          const mealLogs = logs.filter(l => l.mealType === type);
          const mealCalories = mealLogs.reduce((acc, l) => acc + (l.calories || 0), 0);
          const mealProtein = mealLogs.reduce((acc, l) => acc + (l.protein || 0), 0);

          return (
            <div key={type} className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-base font-bold text-white capitalize">{type}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-200">{mealCalories} kcal</span>
                    <span className="text-[10px] text-slate-400 ml-2">({mealProtein}g P)</span>
                  </div>
                </div>

                {/* Logged items */}
                <div className="divide-y divide-slate-800/40 mt-2">
                  {mealLogs.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center italic">No items logged yet</p>
                  ) : (
                    mealLogs.map((log) => (
                      <div key={log._id} className="py-2.5 flex items-center justify-between group">
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{log.foodName}</p>
                          <p className="text-[11px] text-slate-400">
                            {log.quantity}x {log.servingSize}{log.servingUnit} • {log.calories} kcal ({log.protein}g P, {log.carbs}g C, {log.fat}g F)
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteLog(log._id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={() => handleOpenAddFood(type)}
                className="w-full py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition mt-3"
              >
                <Plus className="w-4 h-4" /> Add Food to {type}
              </button>
            </div>
          );
        })}
      </div>

      {/* Search & Log Food Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white capitalize">Add to {activeMealType}</h3>
                <p className="text-xs text-slate-400">Search 28+ verified Indian & global foods</p>
              </div>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Paneer, Chicken, Dal, Roti, Oats..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Filter or Search Results */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {searchResults.map((f) => (
                <div
                  key={f._id}
                  onClick={() => handleSelectFood(f)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    selectedFood?._id === f._id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{f.name}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{f.calories} kcal</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                    <span>{f.servingSize}{f.servingUnit}</span>
                    <span>P: {f.protein}g</span>
                    <span>C: {f.carbs}g</span>
                    <span>F: {f.fat}g</span>
                  </div>
                </div>
              ))}
            </div>

            {/* If food selected, choose quantity and confirm */}
            {selectedFood && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Serving Multiplier:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-center font-bold text-xs text-white"
                    />
                    <span className="text-xs text-slate-400">servings</span>
                  </div>
                </div>
                <div className="text-xs text-slate-300 flex justify-between">
                  <span>Total: <strong className="text-emerald-400">{Math.round(selectedFood.calories * quantity)} kcal</strong></span>
                  <span>Protein: <strong className="text-white">{Math.round(selectedFood.protein * quantity)}g</strong></span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowCustomModal(true)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold"
              >
                + Custom Food
              </button>
              <button
                onClick={handleLogFood}
                disabled={!selectedFood || logging}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition"
              >
                {logging ? 'Logging...' : 'Confirm & Log Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Food Creation Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <form onSubmit={handleCreateCustom} className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-700 relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Custom Food Item</h3>
              <button type="button" onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa, Besan Chilla..."
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Serving Size</label>
                  <input
                    type="number"
                    value={customForm.servingSize}
                    onChange={(e) => setCustomForm({ ...customForm, servingSize: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit (g / ml / pcs)</label>
                  <input
                    type="text"
                    value={customForm.servingUnit}
                    onChange={(e) => setCustomForm({ ...customForm, servingUnit: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Calories</label>
                  <input
                    type="number"
                    value={customForm.calories}
                    onChange={(e) => setCustomForm({ ...customForm, calories: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={customForm.protein}
                    onChange={(e) => setCustomForm({ ...customForm, protein: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={customForm.carbs}
                    onChange={(e) => setCustomForm({ ...customForm, carbs: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={customForm.fat}
                    onChange={(e) => setCustomForm({ ...customForm, fat: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                Save Food
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FoodTracker;
