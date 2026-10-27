import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import {
  Dumbbell,
  Activity,
  Utensils,
  Droplets,
  TrendingUp,
  BookOpen,
  Bot,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Zap,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginDemo } = useAuth();
  const themeContext = useTheme ? useTheme() : { theme: 'dark', toggleTheme: () => {} };
  const { theme, toggleTheme } = themeContext || { theme: 'dark', toggleTheme: () => {} };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoLogin = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    const res = await loginDemo();
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Fit<span className="text-emerald-400">Forge</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Fitness & Nutrition Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  Dashboard
                </Link>

                <Link
                  to="/diet-plan"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/diet-plan')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  Diet Plan
                </Link>

                <Link
                  to="/workouts"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/workouts')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Dumbbell className="w-4 h-4" />
                  Workouts
                </Link>

                <Link
                  to="/food-tracker"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/food-tracker')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  Food Tracker
                </Link>

                <Link
                  to="/progress"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/progress')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Progress
                </Link>

                <Link
                  to="/water"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/water')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Droplets className="w-4 h-4" />
                  Hydration
                </Link>

                <Link
                  to="/assistant"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/assistant')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  Assistant
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/exercises"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/exercises') ? 'text-emerald-400' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Exercise Library
                </Link>
              </>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Toggle Dark / Light theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-white leading-tight">{user?.name || 'Athlete'}</div>
                    <div className="text-[10px] text-emerald-400 font-medium leading-tight">
                      {user?.targetCalories ? `${user.targetCalories} kcal` : 'FitForge Member'}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#111827] border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-800">
                      <div className="text-sm font-bold text-white">{user?.name}</div>
                      <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" /> {user?.fitnessGoal?.replace('_', ' ') || 'Fitness Plan'}
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-400" />
                        Profile & Goals
                      </Link>
                      <Link
                        to="/exercises"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        Exercise Directory
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDemoLogin}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all shadow-sm"
                  title="Instant Evaluation Demo"
                >
                  <Zap className="w-3.5 h-3.5" />
                  1-Click Demo
                </button>

                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1322] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Activity className="w-4 h-4 text-emerald-400" /> Dashboard
              </Link>
              <Link
                to="/diet-plan"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Utensils className="w-4 h-4 text-emerald-400" /> Diet Plan
              </Link>
              <Link
                to="/workouts"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Dumbbell className="w-4 h-4 text-emerald-400" /> Workouts
              </Link>
              <Link
                to="/food-tracker"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Utensils className="w-4 h-4 text-emerald-400" /> Food Tracker
              </Link>
              <Link
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Progress
              </Link>
              <Link
                to="/water"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Droplets className="w-4 h-4 text-emerald-400" /> Hydration
              </Link>
              <Link
                to="/exercises"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" /> Exercise Library
              </Link>
              <Link
                to="/assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <Bot className="w-4 h-4 text-emerald-400" /> Assistant
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-slate-800/60"
              >
                <User className="w-4 h-4 text-emerald-400" /> Profile & Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="space-y-3 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 font-medium"
              >
                Home
              </Link>
              <Link
                to="/exercises"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm text-slate-300 font-medium"
              >
                Exercise Library
              </Link>
              <button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                <Zap className="w-4 h-4" /> Instant 1-Click Demo
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
