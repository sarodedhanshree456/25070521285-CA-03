import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Dumbbell, Mail, Lock, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // If token is present, we are on reset mode
  const isResetMode = !!token;

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setLoading(false);
      setStatusMessage(res.data.message || 'Password reset link generated.');
      if (res.data.resetUrl) {
        setResetUrl(res.data.resetUrl);
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.message || 'Failed to request password reset');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
      setLoading(false);
      setStatusMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.response?.data?.message || 'Invalid or expired reset token');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
            {isResetMode ? 'Create New Password' : 'Reset Your Password'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isResetMode
              ? 'Enter your new credentials below'
              : 'Enter your registered email to receive a secure recovery token'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {resetUrl && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-slate-300 space-y-1">
            <div className="font-semibold text-emerald-400">Development Mode Reset Link:</div>
            <a href={resetUrl} className="text-cyan-400 underline break-all hover:text-cyan-300">
              {resetUrl}
            </a>
          </div>
        )}

        {!isResetMode ? (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@fitforge.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Sending...' : 'Generate Reset Token'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-md hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : 'Update Password & Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-xs text-slate-400 hover:text-emerald-400">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
