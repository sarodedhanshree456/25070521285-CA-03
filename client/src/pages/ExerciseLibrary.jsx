import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Dumbbell,
  Search,
  Filter,
  Sparkles,
  Info,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const res = await api.get('/exercises');
        if (res.data.success) {
          setExercises(res.data.exercises || []);
        }
      } catch (err) {
        console.error('Failed to load exercises:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const muscles = [
    { id: 'all', label: 'All Muscles' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'legs', label: 'Legs / Quads' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'arms', label: 'Arms / Biceps / Triceps' },
    { id: 'core', label: 'Core / Abs' }
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesMuscle = selectedMuscle === 'all' || ex.targetMuscle?.toLowerCase() === selectedMuscle.toLowerCase();
    const matchesSearch = ex.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.targetMuscle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.equipment?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              Biomechanics & Hypertrophy Index
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Movement & Exercise Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Standardized execution standards, anatomical muscle recruitment, and progressive overload mechanics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search exercises, muscles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Muscle Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {muscles.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMuscle(m.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedMuscle === m.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : filteredExercises.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-2">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No exercises found</h3>
          <p className="text-xs text-slate-500">Try refining your search keyword or clearing the muscle category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => (
            <div
              key={ex._id}
              onClick={() => setSelectedExercise(ex)}
              className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    {ex.targetMuscle}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 capitalize">
                    {ex.difficulty || 'Intermediate'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                  {ex.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {ex.instructions?.[0] || ex.description || 'Compound barbell movement targeting primary prime movers with progressive load.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-4">
                <span>Equipment: <strong className="text-slate-300 capitalize">{ex.equipment || 'Barbell'}</strong></span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition">
                  Guide <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movement Technique & Form Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                  {selectedExercise.targetMuscle}
                </span>
                <span className="text-xs text-slate-400 capitalize">• {selectedExercise.equipment || 'Equipment'}</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{selectedExercise.name}</h2>
            </div>

            {/* Anatomical Targets */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Primary Muscle</span>
                <strong className="text-white capitalize">{selectedExercise.targetMuscle}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Secondary Synergists</span>
                <strong className="text-slate-300 capitalize">
                  {selectedExercise.secondaryMuscles?.join(', ') || 'Synergists'}
                </strong>
              </div>
            </div>

            {/* Execution Steps */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Biomechanical Execution Steps
              </h3>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
                {selectedExercise.instructions && selectedExercise.instructions.length > 0 ? (
                  selectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed py-1">{step}</li>
                  ))
                ) : (
                  <>
                    <li className="leading-relaxed py-1">Set up with proper joint alignment and secure your footing.</li>
                    <li className="leading-relaxed py-1">Inhale and brace your core, establishing intra-abdominal pressure.</li>
                    <li className="leading-relaxed py-1">Execute the eccentric phase under strict 2-3 second control.</li>
                    <li className="leading-relaxed py-1">Drive through full range of motion without locking out prematurely.</li>
                  </>
                )}
              </ol>
            </div>

            {/* Coaching Tips */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-cyan-400 block">Pro Coaching Cue:</span>
              <p>
                Focus on progressive overload by logging repetitions and weights weekly. Ensure the eccentric phase is always controlled to maximize mechanical tension.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;
