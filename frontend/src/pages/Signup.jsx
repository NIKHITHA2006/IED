import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const passwordsMatch = form.password && form.confirm && form.password === form.confirm;
  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: '#f59e0b', width: '50%' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: 'Strong', color: '#10b981', width: '100%' };
    return { label: 'Moderate', color: '#6366f1', width: '75%' };
  })();

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'user',          // students always register as 'user'
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0f14] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">IED Platform</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Create an account</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Start exploring industry insights and skill gap analysis</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={set('name')}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  className="input pl-10 pr-10"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={set('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="progress-bar-bg">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: passwordStrength.width }}
                      style={{ background: passwordStrength.color }}
                    />
                  </div>
                  <p className="text-[11px] mt-1 font-medium" style={{ color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  className={`input pl-10 pr-10 transition-colors ${form.confirm && !passwordsMatch ? 'border-red-500/50 focus:ring-red-500/30' : ''
                    } ${passwordsMatch ? 'border-emerald-500/50' : ''}`}
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={set('confirm')}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {passwordsMatch && (
                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {form.confirm && !passwordsMatch && (
                <p className="text-[11px] text-red-400 mt-1 font-medium">Passwords do not match</p>
              )}
            </div>

            {/* Terms note */}
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              By creating an account you agree to use this platform for academic and exploration purposes.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
