import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const adminNavItems = [
  { label: 'Dashboard', path: '/admin', icon: HomeIcon, exact: true },
  { label: 'Industries', path: '/admin/industries', icon: BriefcaseIcon },
  { label: 'Skills', path: '/admin/skills', icon: AcademicCapIcon },
  { label: 'Internships', path: '/admin/internships', icon: PuzzlePieceIcon },
];

const userNavItems = [
  { label: 'Discovery', path: '/user', icon: HomeIcon, exact: true },
  { label: 'Skill Gap Analysis', path: '/user/skill-gap', icon: ChartBarIcon },
];

const DashboardLayout = ({ role }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

  if (!userInfo) {
    navigate('/login');
    return null;
  }

  if (userInfo.role !== role) {
    navigate(userInfo.role === 'admin' ? '/admin' : '/user');
    return null;
  }

  const navItems = role === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full w-64 bg-[#10131a] border-r border-white/[0.07]">
      {/* Brand */}
      <div className="p-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">IED</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">IED Platform</p>
            <p className="text-[10px] text-slate-500 capitalize">{role} workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 py-2">
          {role === 'admin' ? 'Management' : 'Explore'}
        </p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={`nav-item ${isActive(item) ? 'active' : ''}`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.07]">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {userInfo.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">{userInfo.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{userInfo.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-item w-full text-red-400 hover:text-red-300"
          style={{ background: 'none' }}
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0f14]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between px-6 h-14 border-b border-white/[0.07] bg-[#10131a] flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
          </button>

          {/* Page title from nav */}
          <p className="text-sm font-semibold text-slate-300">
            {navItems.find((item) => isActive(item))?.label || 'Dashboard'}
          </p>

          <div className="flex items-center gap-3">
            <span className="badge badge-blue hidden sm:inline-flex">{role}</span>
            <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
              {userInfo.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="p-6 lg:p-8 max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
