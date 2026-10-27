import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFitnessData } from '../hooks/useFitnessData';
import api from '../services/api';
import WaterGlass from '../components/WaterGlass';
import MacroBar from '../components/MacroBar';
import StatCard from '../components/StatCard';
import {
  Flame,
  Activity,
  Utensils,
  Dumbbell,
  Droplets,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  Plus
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

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    todayMeals,
    water,
    workoutPlan,
    progressSummary,
    weeklyFoodSummary,
    loading,
    refreshData
  } = useFitnessData();

  const handleAddWater = async (amountMl) => {
    try {
      await api.post('/water/add', { amountMl });
      refreshData();
    } catch (err) {
      console.error('Failed to log water:', err);
    }
  };

  const caloriesConsumed = todayMeals?.totals?.calories || 0;
  const targetCalories = user?.targetCalories || 1930;
  const caloriesLeft = Math.max(0, targetCalories - caloriesConsumed);

  const proteinConsumed = todayMeals?.totals?.protein || 0;
  const targetProtein = user?.targetProtein || 145;

  const carbsConsumed = todayMeals?.totals?.carbs || 0;
  const targetCarbs = user?.targetCarbs || 195;

  const fatConsumed = todayMeals?.totals?.fat || 0;
  const targetFat = user?.targetFat || 55;

  // Today's scheduled workout
  const dayIndex = new Date().getDay(); // 0 is Sunday
  const todayWorkout = workoutPlan?.schedule?.[dayIndex % (workoutPlan?.schedule?.length || 1)];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-[#0C1527] to-slate-900/90 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Active Protocol
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
              Hello, <span className="text-gradient-emerald">{user?.name?.split(' ')[0] || 'Athlete'}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Your Mifflin-St Jeor plan is dialed in for{' '}
              <strong className="text-white capitalize font-semibold">{user?.fitnessGoal?.replace('_', ' ')}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/food-tracker"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Log Meal
            </Link>
            <Link
              to="/workouts"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" /> Train Today
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Calories In"
          value={caloriesConsumed}
          unit={`/ ${targetCalories} kcal`}
          subtitle={`${caloriesLeft} kcal remaining`}
          icon={Flame}
          color="amber"
          trend={`${Math.round((caloriesConsumed / targetCalories) * 100)}%`}
        />
        <StatCard
          title="Daily Protein"
          value={proteinConsumed}
          unit={`/ ${targetProtein}g`}
          subtitle="Muscle preservation"
          icon={Utensils}
          color="emerald"
          trend={`${Math.round((proteinConsumed / targetProtein) * 100)}%`}
        />
        <StatCard
          title="Current Weight"
          value={progressSummary?.currentWeight || user?.weightKg || 72}
          unit="kg"
          subtitle={`Goal: ${user?.targetWeightKg || 68} kg`}
          icon={TrendingUp}
          color="cyan"
          trend={`${progressSummary?.percentAchieved || 70}% reached`}
        />
        <StatCard
          title="Water Intake"
          value={water?.amountMl || 0}
          unit={`/ ${water?.goalMl || 2500} ml`}
          subtitle="Hydration guard"
          icon={Droplets}
          color="cyan"
          trend={`${water?.percentage || 0}%`}
        />
      </div>

      {/* Main Interactive Row: Macros & Water Tumbler & Today's Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Macro Breakdown Card */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-700/80 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white">Daily Macronutrients</h2>
            </div>
            <Link to="/diet-plan" className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1">
              Diet Plan <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            <MacroBar
              label="Calories Budget"
              current={caloriesConsumed}
              target={targetCalories}
              unit=" kcal"
              color="amber"
            />
            <MacroBar
              label="Protein (Growth & Repair)"
              current={proteinConsumed}
              target={targetProtein}
              unit="g"
              color="emerald"
            />
            <MacroBar
              label="Carbohydrates (Energy)"
              current={carbsConsumed}
              target={targetCarbs}
              unit="g"
              color="cyan"
            />
            <MacroBar
              label="Fats (Hormone Health)"
              current={fatConsumed}
              target={targetFat}
              unit="g"
              color="rose"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Logged Today: <strong className="text-white">{todayMeals?.logs?.length || 0} items</strong></span>
            <Link to="/food-tracker" className="text-emerald-400 font-semibold hover:underline">
              Add Item +
            </Link>
          </div>
        </div>

        {/* Center: Interactive Water Tumbler */}
        <div className="lg:col-span-3">
          <WaterGlass
            amountMl={water?.amountMl || 0}
            goalMl={water?.goalMl || 2500}
            onAddWater={handleAddWater}
          />
        </div>

        {/* Right: Today's Scheduled Routine */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white">Today's Routine</h2>
              </div>
              <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                {workoutPlan?.splitType || 'PPL Split'}
              </span>
            </div>

            <div className="text-base font-extrabold text-white">
              {todayWorkout?.dayName || 'Scheduled Session'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Focus: {todayWorkout?.focus || 'Compound movements'}
            </div>

            {/* Checklist of exercises */}
            <div className="mt-4 space-y-2">
              {(todayWorkout?.exercises || []).slice(0, 4).map((ex, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-200 font-medium truncate max-w-[180px]">{ex.name}</span>
                  <span className="text-slate-400 text-[11px] font-mono shrink-0">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to={`/workouts/${todayWorkout?._id || 'session'}`}
            className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
          >
            Start Active Workout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Bottom Chart: 7-Day Calorie History */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-white">7-Day Calorie Consumption Curve</h2>
            <p className="text-xs text-slate-400">Comparing daily consumed calories with your Mifflin-St Jeor target</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Consumed
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" /> Target ({targetCalories} kcal)
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          {weeklyFoodSummary && weeklyFoodSummary.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyFoodSummary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="calories" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Log daily meals to populate weekly calorie curve
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
