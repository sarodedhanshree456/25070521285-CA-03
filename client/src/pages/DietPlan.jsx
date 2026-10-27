import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Utensils,
  RotateCcw,
  ShoppingCart,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
  X,
  Info,
  Clock,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const DietPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [swapTarget, setSwapTarget] = useState(null); // { day, mealType }
  const [groceryModalOpen, setGroceryModalOpen] = useState(false);
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const fetchDietPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/diet/plan');
      if (res.data.success && res.data.plan) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load diet plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      const res = await api.post('/diet/generate', {
        dietaryPreference: user?.dietaryPreference,
        dailyCalorieTarget: user?.targetCalories
      });
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      setError('Failed to regenerate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGrocery = async () => {
    try {
      const res = await api.get('/diet/grocery-list');
      if (res.data.success) {
        setGroceryList(res.data.groceries);
        setGroceryModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to get grocery list:', err);
    }
  };

  const handleSwapMeal = async (newMeal) => {
    if (!swapTarget) return;
    try {
      const res = await api.post('/diet/swap', {
        day: swapTarget.day,
        mealType: swapTarget.mealType,
        newMeal
      });
      if (res.data.success) {
        setPlan(res.data.plan);
        setSwapModalOpen(false);
        setSwapTarget(null);
      }
    } catch (err) {
      console.error('Failed to swap meal:', err);
    }
  };

  const currentDayData = plan?.days?.find((d) => d.day.toLowerCase() === selectedDay.toLowerCase()) || plan?.days?.[0];

  const alternativeMeals = [
    { name: 'Moong Dal Chilla (2 pcs) with Mint Chutney', servingSize: '2 chillas (160g)', calories: 310, protein: 16, carbs: 44, fat: 6, isVeg: true },
    { name: 'Paneer Stuffed Besan Chilla', servingSize: '2 chillas (150g)', calories: 380, protein: 22, carbs: 36, fat: 14, isVeg: true },
    { name: 'Soya Chunks Bhurji with 2 Rotis', servingSize: '1 plate', calories: 490, protein: 32, carbs: 55, fat: 12, isVeg: true },
    { name: 'Rajma Masala with Brown Rice & Salad', servingSize: '1 plate', calories: 520, protein: 20, carbs: 78, fat: 11, isVeg: true },
    { name: 'Palak Paneer with 2 Whole Wheat Rotis', servingSize: '1 plate', calories: 480, protein: 24, carbs: 42, fat: 16, isVeg: true },
    { name: 'Yellow Dal Tadka with Steamed Rice', servingSize: '1 plate', calories: 460, protein: 18, carbs: 68, fat: 10, isVeg: true },
    { name: 'Sprouted Moong Salad with Lemon & Herbs', servingSize: '1 bowl', calories: 160, protein: 10, carbs: 28, fat: 1.5, isVeg: true },
    { name: 'Greek Curd with Blueberries & Chia Seeds', servingSize: '150g', calories: 180, protein: 14, carbs: 18, fat: 4, isVeg: true }
  ];

  const mealSections = [
    { type: 'breakfast', title: 'Breakfast', time: '8:30 AM', color: 'border-emerald-500/30' },
    { type: 'lunch', title: 'Lunch', time: '1:30 PM', color: 'border-cyan-500/30' },
    { type: 'dinner', title: 'Dinner', time: '8:00 PM', color: 'border-indigo-500/30' },
    { type: 'snacks', title: 'Snacks & Pre/Post Workout', time: '5:00 PM', color: 'border-amber-500/30' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Deterministic 7-Day Protocol
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            {plan?.name || 'Personalized Indian Nutrition Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Mifflin-St Jeor target: <strong className="text-emerald-400 font-semibold">{plan?.dailyCalorieTarget || 1930} kcal/day</strong> ({user?.dietaryPreference?.replace('_', ' ')})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenGrocery}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" /> Grocery List
          </button>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Regenerate Plan
          </button>
        </div>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDay.toLowerCase() === day.toLowerCase()
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Daily Nutrition Totals Ribbon */}
      {currentDayData && (
        <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Day Calories</span>
            <div className="text-xl font-bold text-white font-mono mt-0.5">{currentDayData.totalCalories} kcal</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Total Protein</span>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{currentDayData.totalProtein}g</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-cyan-400">Total Carbs</span>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-0.5">{currentDayData.totalCarbs}g</div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400">Total Fat</span>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">{currentDayData.totalFat}g</div>
          </div>
        </div>
      )}

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealSections.map((sec) => {
          const meals = currentDayData?.meals?.[sec.type] || [];
          return (
            <div
              key={sec.type}
              className={`glass-card p-6 rounded-3xl border ${sec.color} space-y-4 relative flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white">{sec.title}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {sec.time}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSwapTarget({ day: selectedDay, mealType: sec.type });
                      setSwapModalOpen(true);
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Swap Meal
                  </button>
                </div>

                {meals.map((food, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-bold text-white text-sm">{food.name}</div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                        {food.calories} kcal
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium">
                      Serving: {food.servingSize}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono pt-2 border-t border-slate-800 text-slate-400">
                      <span>P: <strong className="text-emerald-400 font-semibold">{food.protein}g</strong></span>
                      <span>C: <strong className="text-cyan-400 font-semibold">{food.carbs}g</strong></span>
                      <span>F: <strong className="text-amber-400 font-semibold">{food.fat}g</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SWAP MODAL */}
      {swapModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-card p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Choose Alternative for {swapTarget?.day} ({swapTarget?.mealType?.toUpperCase()})
              </h3>
              <button onClick={() => setSwapModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
              {alternativeMeals.map((alt, i) => (
                <div
                  key={i}
                  onClick={() => handleSwapMeal(alt)}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">{alt.name}</div>
                    <div className="text-[11px] text-slate-400">{alt.servingSize}</div>
                    <div className="text-[11px] font-mono text-slate-400 flex gap-3">
                      <span>P: {alt.protein}g</span>
                      <span>C: {alt.carbs}g</span>
                      <span>F: {alt.fat}g</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
                    {alt.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GROCERY CHECKLIST MODAL */}
      {groceryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Weekly Grocery Checklist</h3>
              </div>
              <button onClick={() => setGroceryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Aggregated from your active 7-day Indian meal plan. Tap items to mark them as purchased:
            </p>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {groceryList.map((item, idx) => {
                const isChecked = !!checkedItems[item.name];
                return (
                  <div
                    key={idx}
                    onClick={() => setCheckedItems({ ...checkedItems, [item.name]: !isChecked })}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-slate-900/40 border-slate-800 text-slate-500 line-through'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      ~{item.count} servings
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlan;
