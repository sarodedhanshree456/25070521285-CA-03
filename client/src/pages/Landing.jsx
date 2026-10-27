import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Dumbbell,
  Scale,
  Utensils,
  Droplet,
  TrendingUp,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Flame,
  ChevronDown,
  ShieldCheck,
  Award,
  Users
} from 'lucide-react';
import { calculateBMR, calculateTDEE } from '../utils/macroCalculator.js';

export const Landing = () => {
  const { isAuthenticated, loginDemo } = useAuth();
  const navigate = useNavigate();

  // Interactive Teaser Calculator State
  const [calcSex, setCalcSex] = useState('male');
  const [calcAge, setCalcAge] = useState(24);
  const [calcWeight, setCalcWeight] = useState(72);
  const [calcHeight, setCalcHeight] = useState(175);
  const [calcActivity, setCalcActivity] = useState('moderate');
  const [faqOpen, setFaqOpen] = useState(null);

  const teaserBMR = calcSex === 'male'
    ? Math.round(10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5)
    : Math.round(10 * calcWeight + 6.25 * calcHeight - 5 * calcAge - 161);

  const activityMult = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725
  }[calcActivity] || 1.55;

  const teaserTDEE = Math.round(teaserBMR * activityMult);
  const teaserDeficit = Math.max(1200, teaserTDEE - 500);

  const handleDemoClick = async () => {
    const res = await loginDemo();
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  const faqs = [
    {
      q: 'How does FitForge calculate my daily caloric requirement?',
      a: 'FitForge employs the clinically validated Mifflin-St Jeor formula, widely recognized in clinical sports dietetics as the most accurate non-laboratory method to calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).'
    },
    {
      q: 'Are the diet plans suitable for Indian vegetarian diets?',
      a: 'Yes! FitForge has an extensive seeded library of 28+ authentic Indian foods including whole wheat roti, basmati rice, dal tadka, paneer, soya chunks, chana masala, rajma, curd, and poha with exact macro profiles.'
    },
    {
      q: 'What training splits are supported?',
      a: 'FitForge automatically generates Push/Pull/Legs (PPL), Upper/Lower (4-day), Full Body (3-day), and Home Calisthenics (bodyweight) routines with set-by-set weight tracking and interactive rest timers.'
    },
    {
      q: 'Can I test the platform immediately for college evaluation?',
      a: 'Yes! Click "1-Click Evaluation Demo" anywhere in the app to instantly sign in with pre-populated meals, water intake, workout schedules, and weight milestones.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-32 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Evidence-Based Full-Stack Fitness Platform
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.1] max-w-4xl mx-auto">
            Transform Your Body. <br />
            <span className="text-gradient-emerald">Build Your Best Self.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Clinically accurate Mifflin-St Jeor metabolic tracking, authentic 7-day Indian meal planning, hypertrophy workout splits, and interactive rest timers — unified in one sleek web platform.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Start Free Today <ArrowRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleDemoClick}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-emerald-400" /> 1-Click Demo Login
                </button>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 sm:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 sm:p-6 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">MSJ</div>
              <div className="text-xs text-slate-400 mt-1">Clinical Metabolic Formula</div>
            </div>
            <div className="glass-card p-4 sm:p-6 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">28+</div>
              <div className="text-xs text-slate-400 mt-1">Authentic Indian Foods</div>
            </div>
            <div className="glass-card p-4 sm:p-6 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">4 Splits</div>
              <div className="text-xs text-slate-400 mt-1">PPL, Upper/Lower, Calisthenics</div>
            </div>
            <div className="glass-card p-4 sm:p-6 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">100%</div>
              <div className="text-xs text-slate-400 mt-1">Privacy & MongoDB Persisted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Teaser Calculator */}
      <section className="py-16 bg-[#0E1526]/60 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Live Mifflin-St Jeor <span className="text-emerald-400">Calorie Teaser</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Test your estimated basal metabolic rate and daily calorie targets right now without signing up!
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Biological Sex</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcSex('male')}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        calcSex === 'male'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcSex('female')}
                      className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                        calcSex === 'female'
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age ({calcAge} yrs)</label>
                  <input
                    type="range"
                    min="15"
                    max="75"
                    value={calcAge}
                    onChange={(e) => setCalcAge(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Weight ({calcWeight} kg)</label>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Height ({calcHeight} cm)</label>
                  <input
                    type="range"
                    min="130"
                    max="210"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Weekly Activity Level</label>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="sedentary">Sedentary (Desk job, little to no exercise)</option>
                  <option value="light">Lightly Active (1-3 workouts per week)</option>
                  <option value="moderate">Moderately Active (3-5 workouts per week)</option>
                  <option value="active">Very Active (6-7 intense training sessions)</option>
                </select>
              </div>
            </div>

            {/* Output Visual Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#0A1020] p-6 rounded-2xl border border-emerald-500/30 text-center space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your Basal Metabolic Rate (BMR)</span>
                <div className="text-3xl font-black text-white font-mono mt-0.5">{teaserBMR} <span className="text-sm font-normal text-slate-400">kcal/day</span></div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Daily Expenditure (TDEE)</span>
                <div className="text-3xl font-black text-cyan-400 font-mono mt-0.5">{teaserTDEE} <span className="text-sm font-normal text-slate-400">kcal/day</span></div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Recommended Fat Loss Target</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">{teaserDeficit} <span className="text-sm font-normal text-slate-400">kcal/day</span></div>
                <p className="text-[11px] text-slate-400 mt-1">Safe 500 kcal deficit ~0.5kg weekly healthy loss</p>
              </div>

              <Link
                to="/signup"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                Build Full 7-Day Plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-['Plus_Jakarta_Sans']">
              Engineered for Real-World Results
            </h2>
            <p className="text-base text-slate-400 mt-4 leading-relaxed">
              Every feature of FitForge connects directly to your metabolic profile and weekly routine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">7-Day Indian Meal Calendars</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Enjoy authentic roti, dal tadka, paneer, oats, and chole with single-click meal swaps and automatic weekly grocery list generation.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Hypertrophy Split Routines</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Choose between Push/Pull/Legs, Upper/Lower, Full Body, and Home Calisthenics with set-by-set weight tracking and rest countdowns.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Hydration Guard</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Track fluid levels in a visual tumbler with one-click +150ml, +250ml, +500ml quick logging calculated from your body weight.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Milestone & Measurement Curves</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Visualize body fat reduction, weight trends, and chest/waist/hip measurements with smooth analytical charts powered by Recharts.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Fitness AI Knowledge Assistant</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Instant answers regarding high-protein Indian alternatives, Mifflin-St Jeor metabolic formulas, fat loss plateaus, and training principles.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6 sm:p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Private Local MongoDB Storage</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Your health data is stored in your local MongoDB instance with secure password salting, JWT tokens, and instant 1-click college demo evaluation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-16 bg-[#0E1526]/40 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 transition-transform duration-300 ${
                      faqOpen === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {faqOpen === index && (
                  <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-card p-10 sm:p-14 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-[#0A1020] shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-black text-white font-['Plus_Jakarta_Sans']">
              Ready to Forge Your Best Physique?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Join thousands who track real clinical nutrition, master progressive overload, and reach their fitness milestones.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                Create Account
              </Link>
              <button
                onClick={handleDemoClick}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
              >
                1-Click Demo Evaluation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
