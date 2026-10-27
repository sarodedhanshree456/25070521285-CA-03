import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Activity,
  Utensils,
  Dumbbell,
  TrendingUp,
  Droplets,
  BookOpen,
  Bot,
  User,
  Flame,
  Award
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Diet Plan', path: '/diet-plan', icon: Utensils },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Food Tracker', path: '/food-tracker', icon: Utensils },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Hydration', path: '/water', icon: Droplets },
    { name: 'Exercise Library', path: '/exercises', icon: BookOpen },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Profile & Settings', path: '/profile', icon: User }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#080D1A] border-r border-slate-800/80 p-4 shrink-0 min-h-[calc(100vh-5rem)]">
      {/* Navigation items */}
      <div className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400 border border-emerald-500/25 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Daily Goal & Streak Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/20 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            7-Day Streak
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full">
            Active
          </span>
        </div>
        <div className="text-xs text-slate-300 mb-1">
          Target: <strong className="text-white font-semibold">{user?.targetCalories || 1930} kcal</strong>
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Award className="w-3 h-3 text-emerald-400" />
          {user?.fitnessGoal?.replace('_', ' ')?.toUpperCase() || 'FAT LOSS'}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
