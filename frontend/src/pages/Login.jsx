import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(data.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') { setEmail('admin@ied.com'); setPassword('admin123'); }
    else { setEmail('student@ied.com'); setPassword('user123'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d0f14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <LockClosedIcon className="w-5 h-5 text-slate-900 dark:text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">IED Platform</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to access your dashboard</p>
        </div>

        {/* Demo credential quick-fill */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="flex-1 text-xs font-semibold py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            Fill Admin Demo
          </button>
          <button
            type="button"
            onClick={() => fillDemo('user')}
            className="flex-1 text-xs font-semibold py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
          >
            Fill Student Demo
          </button>
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

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-slate-900 dark:text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Credentials note */}
        <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-center text-slate-500">
          <div className="card px-4 py-3">
            <span className="block font-semibold text-indigo-400 mb-1">Admin Access</span>
            <span>admin@ied.com</span><br />
            <span>admin123</span>
          </div>
          <div className="card px-4 py-3">
            <span className="block font-semibold text-indigo-400 mb-1">Student Access</span>
            <span>student@ied.com</span><br />
            <span>user123</span>
          </div>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
