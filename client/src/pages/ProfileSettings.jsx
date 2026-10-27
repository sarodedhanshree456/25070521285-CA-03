import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  User,
  Settings,
  Scale,
  Flame,
  Activity,
  Lock,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export const ProfileSettings = () => {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 26,
    gender: user?.gender || 'male',
    heightCm: user?.heightCm || 178,
    weightKg: user?.weightKg || 74,
    activityLevel: user?.activityLevel || 'moderately_active',
    goal: user?.goal || 'muscle_gain',
    dietPreference: user?.dietPreference || 'vegetarian'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || 26,
        gender: user.gender || 'male',
        heightCm: user.heightCm || 178,
        weightKg: user.weightKg || 74,
        activityLevel: user.activityLevel || 'moderately_active',
        goal: user.goal || 'muscle_gain',
        dietPreference: user.dietPreference || 'vegetarian'
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileSuccess(false);

      const res = await api.put('/user/profile', {
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        heightCm: Number(formData.heightCm),
        weightKg: Number(formData.weightKg),
        activityLevel: formData.activityLevel,
        goal: formData.goal,
        dietPreference: formData.dietPreference
      });

      if (res.data.success) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (res.data.success) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/account');
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
            Biometric Calibration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
          Profile & Metabolic Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Recalibrate your Mifflin-St Jeor metabolic parameters, fitness targets, and account credentials.
        </p>
      </div>

      {/* Somatometric Settings Form */}
      <form onSubmit={handleProfileSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-cyan-400" /> Biometric & Body Composition Stats
            </h2>
            <p className="text-xs text-slate-400">Updating these recalculates your BMR, TDEE, and daily macro ratios automatically.</p>
          </div>
          {profileSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Updated!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Email Address (Read Only)</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Age (Years)</label>
            <input
              type="number"
              min="14"
              max="100"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Biological Sex</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Height (cm)</label>
            <input
              type="number"
              min="100"
              max="250"
              value={formData.heightCm}
              onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Current Body Weight (kg)</label>
            <input
              type="number"
              min="30"
              max="250"
              step="0.5"
              value={formData.weightKg}
              onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Activity Multiplier</label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="sedentary">Sedentary (Desk Job, little exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 workout days/wk)</option>
              <option value="moderately_active">Moderately Active (3-5 workout days/wk)</option>
              <option value="very_active">Very Active (6-7 intensive sessions/wk)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Metabolic Fitness Goal</label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="fat_loss">Fat Loss (-400 kcal deficit)</option>
              <option value="maintenance">Maintenance (Energy equilibrium)</option>
              <option value="muscle_gain">Lean Hypertrophy / Muscle Gain (+300 kcal surplus)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-slate-400 block mb-1 font-semibold">Dietary Paradigm</label>
            <select
              value={formData.dietPreference}
              onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            >
              <option value="vegetarian">Vegetarian (Lacto-Ovo, Paneer, Lentils, Curd)</option>
              <option value="vegan">Pure Plant-Based (Vegan, Tofu, Legumes)</option>
              <option value="non_veg">Omnivore / High-Protein (Chicken, Fish, Eggs)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20"
          >
            {savingProfile ? 'Recalibrating...' : 'Recalibrate & Save Metrics'}
          </button>
        </div>
      </form>

      {/* Password Security Form */}
      <form onSubmit={handlePasswordSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" /> Account Security & Password
          </h2>
          <p className="text-xs text-slate-400">Keep your account safe with a strong cryptographic password.</p>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            Password updated successfully!
          </div>
        )}

        <div className="space-y-4 text-xs max-w-md">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Current Password</label>
            <input
              type="password"
              required
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">New Password (min 6 characters)</label>
            <input
              type="password"
              required
              minLength="6"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Confirm New Password</label>
            <input
              type="password"
              required
              minLength="6"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingPassword}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-rose-950/50 bg-rose-950/10 space-y-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </div>
        <p className="text-xs text-slate-400">
          Permanently delete your FitForge account and all associated workout logs, meal entries, and body progress history. This action cannot be reversed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete My FitForge Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-sm w-full p-6 rounded-3xl border border-slate-700 relative text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Permanently Delete Account?</h3>
            <p className="text-xs text-slate-400">
              Are you sure? All of your saved workouts, nutrition plans, and progress entries will be permanently erased from MongoDB.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
