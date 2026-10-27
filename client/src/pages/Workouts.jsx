import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Dumbbell,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  History
} from 'lucide-react';

export const Workouts = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState('Push/Pull/Legs');

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const [planRes, histRes] = await Promise.allSettled([
        api.get('/workouts/current'),
        api.get('/workouts/history')
      ]);

      if (planRes.status === 'fulfilled' && planRes.value.data.success) {
        setWorkoutPlan(planRes.value.data.plan);
        setSelectedSplit(planRes.value.data.plan.splitType || 'Push/Pull/Legs');
      }

      if (histRes.status === 'fulfilled' && histRes.value.data.success) {
        setWorkoutHistory(histRes.value.data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load workout data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const handleGenerateSplit = async (split) => {
    try {
      setGenerating(true);
      const res = await api.post('/workouts/generate', { splitType: split });
      if (res.data.success) {
        setWorkoutPlan(res.data.plan);
        setSelectedSplit(split);
      }
    } catch (err) {
      console.error('Failed to generate split:', err);
    } finally {
      setGenerating(false);
    }
  };

  const splits = [
    { id: 'Push/Pull/Legs', name: 'Push / Pull / Legs (PPL)', desc: 'Chest, back, legs split with maximum recovery' },
    { id: 'Upper/Lower', name: 'Upper / Lower (4-Day)', desc: 'Compound strength alternating upper and lower' },
    { id: 'Full Body', name: 'Full Body (3-Day)', desc: 'Full body stimulation 3 days per week' },
    { id: 'Home Calisthenics', name: 'Home Calisthenics', desc: 'Zero gym equipment progressive bodyweight movements' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              Hypertrophy & Progressive Overload
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            {workoutPlan?.title || 'Push / Pull / Legs Hypertrophy Split'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {workoutPlan?.description || 'Scientifically formulated training split targeting muscle synergy and optimal recovery.'}
          </p>
        </div>

        <Link
          to={`/workouts/${workoutPlan?.schedule?.[0]?._id || 'session'}`}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Dumbbell className="w-4 h-4" /> Start Workout Now
        </Link>
      </div>

      {/* Split Selector Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Workout Split</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {splits.map((s) => (
            <button
              key={s.id}
              onClick={() => handleGenerateSplit(s.id)}
              disabled={generating}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedSplit === s.id
                  ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{s.name}</span>
                {selectedSplit === s.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Routine Days Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(workoutPlan?.schedule || []).map((day, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-3xl border border-slate-700/80 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  Day {idx + 1}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {day.exercises?.length || 0} exercises
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{day.dayName}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" /> Focus: {day.focus}
              </p>

              {/* Exercises List */}
              <div className="mt-4 space-y-2">
                {(day.exercises || []).map((ex, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{ex.name}</div>
                      <div className="text-[10px] text-slate-400">{ex.targetMuscle} • {ex.restSeconds}s rest</div>
                    </div>
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg">
                      {ex.sets} × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={`/workouts/${day._id || idx}`}
              className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              Start This Session <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Past Workout Sessions History */}
      {workoutHistory.length > 0 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Recent Completed Sessions</h2>
          </div>

          <div className="space-y-2">
            {workoutHistory.slice(0, 5).map((session, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{session.routineName}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {new Date(session.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-cyan-400">{session.durationMinutes} mins</div>
                    <div className="text-[10px] text-slate-500">Duration</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-amber-400">{session.caloriesBurned} kcal</div>
                    <div className="text-[10px] text-slate-500">Burned</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
