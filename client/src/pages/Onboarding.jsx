import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  Scale,
  Flame,
  Utensils,
  Dumbbell,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Droplet,
  ShieldAlert
} from 'lucide-react';

export const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [age, setAge] = useState(user?.age || 24);
  const [sex, setSex] = useState(user?.sex || 'male');
  const [heightCm, setHeightCm] = useState(user?.heightCm || 175);
  const [weightKg, setWeightKg] = useState(user?.weightKg || 72);
  const [targetWeightKg, setTargetWeightKg] = useState(user?.targetWeightKg || 68);

  const [fitnessGoal, setFitnessGoal] = useState(user?.fitnessGoal || 'weight_loss');
  const [activityLevel, setActivityLevel] = useState(user?.activityLevel || 'moderate');

  const [dietaryPreference, setDietaryPreference] = useState(user?.dietaryPreference || 'vegetarian');
  const [allergies, setAllergies] = useState(user?.allergies || []);

  const [workoutSplit, setWorkoutSplit] = useState('Push/Pull/Legs');

  // Real-time Mifflin-St Jeor metabolic calculation
  const bmr = sex === 'male'
    ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5)
    : Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);

  const activityMultiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  }[activityLevel] || 1.55;

  const tdee = Math.round(bmr * activityMultiplier);

  let targetCalories = tdee;
  if (fitnessGoal === 'weight_loss') targetCalories = Math.max(1200, tdee - 500);
  if (fitnessGoal === 'muscle_gain') targetCalories = tdee + 350;
  if (fitnessGoal === 'endurance') targetCalories = tdee + 150;

  const targetProtein = Math.round(weightKg * (fitnessGoal === 'weight_loss' ? 2.2 : 2.0));
  const targetFat = Math.round((targetCalories * 0.25) / 9);
  const targetCarbs = Math.round(Math.max(0, targetCalories - (targetProtein * 4 + targetFat * 9)) / 4);
  const waterTargetMl = Math.max(2000, Math.round(weightKg * 35));

  const toggleAllergy = (item) => {
    setAllergies((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleFinish = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/user/onboarding', {
        age,
        sex,
        heightCm,
        weightKg,
        targetWeightKg,
        fitnessGoal,
        activityLevel,
        dietaryPreference,
        allergies,
        workoutSplit
      });

      if (res.data.success && res.data.user) {
        updateUser(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-3xl mx-auto">
      
      {/* Step Indicator Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Step {step} of 5
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Personalize Your FitForge Routine
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Calibrating Mifflin-St Jeor metabolic expenditure and dietary schedules
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Body Metrics */}
      {step === 1 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Basic Body Measurements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Biological Sex</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSex('male')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    sex === 'male' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setSex('female')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    sex === 'female' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Age: {age} years</label>
              <input
                type="range"
                min="15"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Height: {heightCm} cm</label>
              <input
                type="range"
                min="130"
                max="215"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Current Weight: {weightKg} kg</label>
              <input
                type="range"
                min="40"
                max="150"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Target Weight Goal: {targetWeightKg} kg</label>
              <input
                type="range"
                min="40"
                max="150"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              Next: Fitness Goals <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Goals & Activity */}
      {step === 2 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Fitness Goal & Activity Multiplier
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-3">Primary Objective</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'weight_loss', label: 'Fat Loss & Cutting', desc: '500 kcal deficit, high protein to preserve muscle' },
                { id: 'muscle_gain', label: 'Lean Muscle Hypertrophy', desc: '350 kcal surplus, progressive overload focus' },
                { id: 'maintenance', label: 'Body Recomposition & Tone', desc: 'Maintain equilibrium calories while building strength' },
                { id: 'endurance', label: 'Athletic Conditioning', desc: 'Fuel high cardiovascular expenditure and stamina' }
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFitnessGoal(g.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    fitnessGoal === g.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                      : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{g.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Weekly Physical Activity</label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="sedentary">Sedentary (Desk work, minimal exercise - 1.2x)</option>
              <option value="light">Light Activity (1-3 workouts per week - 1.375x)</option>
              <option value="moderate">Moderate Activity (3-5 intense workouts per week - 1.55x)</option>
              <option value="active">Very Active (6-7 intense training sessions - 1.725x)</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              Next: Diet Preference <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Diet & Allergies */}
      {step === 3 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-teal-400" />
            Diet Style & Allergen Exclusions
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-3">Dietary Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'vegetarian', label: 'Vegetarian' },
                { id: 'eggetarian', label: 'Eggetarian' },
                { id: 'vegan', label: '100% Vegan' },
                { id: 'non_vegetarian', label: 'Non-Vegetarian' }
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDietaryPreference(d.id)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                    dietaryPreference === d.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-700 text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-3">Allergen Exclusions (Tick all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {['dairy', 'gluten', 'nuts', 'eggs', 'soy'].map((a) => {
                const checked = allergies.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergy(a)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      checked
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              Next: Review BMR & Macros <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Live Metabolic Preview */}
      {step === 4 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" /> Clinical Formulation Output
            </div>
            <h2 className="text-xl font-extrabold text-white">Your Mifflin-St Jeor Nutritional Blueprint</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Basal BMR</span>
              <div className="text-2xl font-black text-white font-mono mt-1">{bmr}</div>
              <span className="text-[10px] text-slate-500">kcal at complete rest</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total TDEE</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">{tdee}</div>
              <span className="text-[10px] text-slate-500">daily burn with exercise</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Target Calories</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{targetCalories}</div>
              <span className="text-[10px] text-emerald-300">daily caloric intake</span>
            </div>
          </div>

          {/* Macro Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Macronutrient Distribution</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{targetProtein}g</div>
                <div className="text-[10px] text-slate-400">Protein (4 kcal/g)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-cyan-400 font-mono">{targetCarbs}g</div>
                <div className="text-[10px] text-slate-400">Carbs (4 kcal/g)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-amber-400 font-mono">{targetFat}g</div>
                <div className="text-[10px] text-slate-400">Healthy Fats (9 kcal/g)</div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3">
            <Droplet className="w-5 h-5 text-cyan-400 fill-cyan-400 shrink-0" />
            <div className="text-xs text-slate-300">
              Prescribed daily hydration: <strong className="text-cyan-400 font-bold">{waterTargetMl} ml</strong> (calculated at ~35ml per kg of bodyweight).
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              Next: Training Split <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Workout Split & Finalize */}
      {step === 5 && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            Select Your Preferred Workout Split
          </h2>

          <div className="space-y-3">
            {[
              {
                id: 'Push/Pull/Legs',
                title: 'Push / Pull / Legs (PPL)',
                desc: 'Chest/Shoulders/Triceps on Push, Back/Rear Delts/Biceps on Pull, and Quads/Hamstrings on Legs. Gold standard for muscle symmetry.'
              },
              {
                id: 'Upper/Lower',
                title: 'Upper / Lower (4-Day)',
                desc: 'Heavy compound strength days alternating between upper body and lower body with ample recovery.'
              },
              {
                id: 'Full Body',
                title: 'Full Body (3-Day)',
                desc: 'Efficient 3-day weekly sessions hitting all major muscle groups per workout.'
              },
              {
                id: 'Home Calisthenics',
                title: 'Home Calisthenics (Zero Equipment)',
                desc: 'Progressive bodyweight movements (push-ups, squats, dips, core holds) requiring zero gym gear.'
              }
            ].map((split) => (
              <button
                key={split.id}
                type="button"
                onClick={() => setWorkoutSplit(split.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all ${
                  workoutSplit === split.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-white shadow-sm'
                    : 'border-slate-700 bg-slate-900/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-sm font-bold text-white">{split.title}</div>
                <div className="text-xs text-slate-400 mt-1">{split.desc}</div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleFinish}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/25 active:scale-95"
            >
              {loading ? 'Building Platform...' : 'Generate My Plans & Launch'} <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
