import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, Heart, Sparkles, Scale, Droplet } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#070B14] border-t border-slate-800/80 text-slate-400 mt-auto">
      {/* Trust & Scientific Methodology Ribbon */}
      <div className="border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs sm:text-sm">Mifflin-St Jeor Equation</div>
              <div className="text-[11px] text-slate-400">Clinically validated BMR & TDEE calculation</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs sm:text-sm">7-Day Indian Meal Plans</div>
              <div className="text-[11px] text-slate-400">Authentic roti, dal, paneer & macro swaps</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs sm:text-sm">Hypertrophy Split Routines</div>
              <div className="text-[11px] text-slate-400">Push/Pull/Legs, Upper/Lower & Calisthenics</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-semibold text-xs sm:text-sm">Hydration & Rest Guard</div>
              <div className="text-[11px] text-slate-400">Interactive countdown timer & water log</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                Fit<span className="text-emerald-400">Forge</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your comprehensive full-stack fitness and nutrition platform built with React 18, Node.js, Express, and MongoDB. Transforming body composition through evidence-based nutrition and progressive overload.
            </p>
            <div className="text-[11px] text-slate-500">
              Evaluation Credentials: <code className="text-emerald-400 bg-slate-800/80 px-1.5 py-0.5 rounded">demo@fitforge.com</code> / <code className="text-emerald-400 bg-slate-800/80 px-1.5 py-0.5 rounded">password123</code>
            </div>
          </div>

          {/* Core Modules */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Platform Modules</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Daily Dashboard</Link></li>
              <li><Link to="/diet-plan" className="hover:text-emerald-400 transition-colors">7-Day Diet Plans</Link></li>
              <li><Link to="/workouts" className="hover:text-emerald-400 transition-colors">Workout Splits</Link></li>
              <li><Link to="/food-tracker" className="hover:text-emerald-400 transition-colors">Food Database (28+ items)</Link></li>
              <li><Link to="/water" className="hover:text-emerald-400 transition-colors">Hydration Tracker</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Resources</div>
            <ul className="space-y-2 text-xs">
              <li><Link to="/exercises" className="hover:text-emerald-400 transition-colors">Exercise Directory</Link></li>
              <li><Link to="/assistant" className="hover:text-emerald-400 transition-colors">Fitness AI Assistant</Link></li>
              <li><Link to="/progress" className="hover:text-emerald-400 transition-colors">Progress Measurements</Link></li>
              <li><Link to="/onboarding" className="hover:text-emerald-400 transition-colors">Mifflin-St Jeor Wizard</Link></li>
            </ul>
          </div>

          {/* Health Disclaimer */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Notice & Disclaimer</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              FitForge provides metabolic estimates and exercise guidance for educational and wellness tracking purposes. Always consult a qualified physician or certified dietitian before commencing high-intensity training or caloric restrictions.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} FitForge Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            Forged with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for peak human performance
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
