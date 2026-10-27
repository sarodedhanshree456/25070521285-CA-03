import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import RestTimer from '../components/RestTimer';
import {
  Dumbbell,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Flame,
  Award,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';

export const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [currentDay, setCurrentDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [notes, setNotes] = useState('');
  const [finished, setFinished] = useState(false);

  // Active rest timer modal state
  const [restSeconds, setRestSeconds] = useState(90);
  const [showRestTimer, setShowRestTimer] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const res = await api.get('/workouts/current');
        if (res.data.success && res.data.plan) {
          const workoutPlan = res.data.plan;
          setPlan(workoutPlan);

          // Find day by id or index or first day
          const day = workoutPlan.schedule?.find(d => d._id === id || String(d.day) === id) || workoutPlan.schedule?.[0];
          setCurrentDay(day);

          // Initialize exercise tracker state
          if (day && day.exercises) {
            const initialExercises = day.exercises.map(ex => ({
              exerciseId: ex.exercise?._id || ex._id,
              name: ex.exercise?.name || ex.name || 'Exercise',
              targetSets: ex.sets || 3,
              targetReps: ex.reps || 10,
              restSeconds: ex.restSeconds || 90,
              sets: Array.from({ length: ex.sets || 3 }, (_, idx) => ({
                setNumber: idx + 1,
                reps: ex.reps || 10,
                weightKg: 20,
                completed: false
              }))
            }));
            setExercises(initialExercises);
          }
        }
      } catch (err) {
        console.error('Error fetching workout details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Workout duration timer
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !finished) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, finished]);

  const formatDuration = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exIdx, setIdx) => {
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    targetSet.completed = !targetSet.completed;
    setExercises(updated);

    // Auto-trigger rest timer if completed
    if (targetSet.completed) {
      setRestSeconds(updated[exIdx].restSeconds || 90);
      setShowRestTimer(true);
    }
  };

  const handleUpdateSet = (exIdx, setIdx, field, value) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx][field] = Number(value) || 0;
    setExercises(updated);
  };

  const handleAddSet = (exIdx) => {
    const updated = [...exercises];
    const prevSet = updated[exIdx].sets[updated[exIdx].sets.length - 1];
    updated[exIdx].sets.push({
      setNumber: updated[exIdx].sets.length + 1,
      reps: prevSet ? prevSet.reps : 10,
      weightKg: prevSet ? prevSet.weightKg : 20,
      completed: false
    });
    setExercises(updated);
  };

  const handleFinishWorkout = async () => {
    try {
      setSaving(true);
      const payload = {
        planId: plan?._id,
        dayIndex: currentDay?.day || 1,
        dayTitle: currentDay?.title || 'Workout Session',
        durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
        notes,
        exercises: exercises.map(ex => ({
          exerciseId: ex.exerciseId,
          exerciseName: ex.name,
          sets: ex.sets
        }))
      };

      await api.post('/workouts/log', payload);
      setFinished(true);
      setIsTimerRunning(false);
    } catch (err) {
      console.error('Failed to log workout session:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">Loading training session...</p>
      </div>
    );
  }

  const completedSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
  const totalSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/workouts"
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                {plan?.splitType || 'Hypertrophy'}
              </span>
              <span className="text-xs text-slate-400">Day {currentDay?.day || 1}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {currentDay?.title || 'Training Routine'}
            </h1>
          </div>
        </div>

        {/* Stopwatch & Rest Timer Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl shadow-inner">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-lg font-bold text-slate-100">
              {formatDuration(elapsedSeconds)}
            </span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-2 text-xs text-slate-400 hover:text-cyan-400 transition"
              title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => setShowRestTimer(true)}
            className="px-4 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
          >
            Rest Timer
          </button>
        </div>
      </div>

      {/* Progress Bar Banner */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:flex-1">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-400 font-medium">Session Progress</span>
            <span className="text-cyan-400 font-bold">{completedSetsCount} / {totalSetsCount} Sets ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {!finished ? (
          <button
            onClick={handleFinishWorkout}
            disabled={saving || completedSetsCount === 0}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {saving ? 'Saving...' : 'Finish & Log Workout'}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl">
            <CheckCircle2 className="w-5 h-5" /> Session Completed & Saved!
          </div>
        )}
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {exercises.map((ex, exIdx) => (
          <div key={ex.exerciseId || exIdx} className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-sm">
                  {exIdx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">{ex.name}</h3>
                  <p className="text-xs text-slate-400">Target: {ex.targetSets} sets × {ex.targetReps} reps • Rest: {ex.restSeconds}s</p>
                </div>
              </div>

              <button
                onClick={() => handleAddSet(exIdx)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Set
              </button>
            </div>

            {/* Set Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800/60 pb-2">
                    <th className="py-2 px-3 font-semibold w-16">SET</th>
                    <th className="py-2 px-3 font-semibold">WEIGHT (KG)</th>
                    <th className="py-2 px-3 font-semibold">REPS</th>
                    <th className="py-2 px-3 font-semibold text-center w-24">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {ex.sets.map((set, setIdx) => (
                    <tr
                      key={setIdx}
                      className={`transition-colors ${set.completed ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30'}`}
                    >
                      <td className="py-2.5 px-3 font-bold text-slate-300">
                        {set.setNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={set.weightKg}
                          onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weightKg', e.target.value)}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min="1"
                          value={set.reps}
                          onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                          className="w-20 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                        />
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleSet(exIdx, setIdx)}
                          className={`p-1.5 rounded-lg border transition ${
                            set.completed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                          }`}
                        >
                          {set.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Session Notes */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Session Notes & Observations
        </label>
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Felt great on bench press today, increased 2.5kg on last set..."
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* Integrated Rest Timer Modal */}
      {showRestTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-slate-700 relative text-center">
            <button
              onClick={() => setShowRestTimer(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Inter-Set Rest Timer</h3>
            <RestTimer initialSeconds={restSeconds} onComplete={() => setShowRestTimer(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
