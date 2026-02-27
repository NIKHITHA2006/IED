import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import {
  BriefcaseIcon,
  AcademicCapIcon,
  PuzzlePieceIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2 text-xs font-medium text-slate-300">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

const KpiCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card p-5 stat-card"
  >
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
    </div>
    <p className="text-3xl font-bold text-white">{value ?? '–'}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [skillGap, setSkillGap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/analytics/stats'), api.get('/analytics/skill-gap')])
      .then(([r1, r2]) => { setStats(r1.data); setSkillGap(r2.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const exportPDF = () => {
    if (!stats) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('IED Analytics Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
    doc.autoTable({
      head: [['Metric', 'Count']],
      body: [
        ['Industries', stats.kpis.totalIndustries],
        ['Skills', stats.kpis.totalSkills],
        ['Internships', stats.kpis.totalInternships],
        ['Reports', stats.kpis.totalReports],
      ],
      startY: 32,
      theme: 'striped',
    });
    doc.save('IED_Analytics.pdf');
  };

  const exportExcel = () => {
    if (!stats) return;
    const ws = XLSX.utils.json_to_sheet([
      { Metric: 'Industries', Count: stats.kpis.totalIndustries },
      { Metric: 'Skills', Count: stats.kpis.totalSkills },
      { Metric: 'Internships', Count: stats.kpis.totalInternships },
      { Metric: 'Reports', Count: stats.kpis.totalReports },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KPIs');
    XLSX.writeFile(wb, 'IED_Analytics.xlsx');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 card rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => <div key={i} className="h-72 card rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Platform-wide metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4 text-red-400" /> PDF
          </button>
          <button
            onClick={exportExcel}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
          >
            <ArrowDownTrayIcon className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Industries" value={stats.kpis.totalIndustries} icon={BriefcaseIcon} color="#6366f1" delay={0} />
        <KpiCard title="Skills" value={stats.kpis.totalSkills} icon={AcademicCapIcon} color="#8b5cf6" delay={0.07} />
        <KpiCard title="Internships" value={stats.kpis.totalInternships} icon={PuzzlePieceIcon} color="#06b6d4" delay={0.14} />
        <KpiCard title="Gap Reports" value={stats.kpis.totalReports} icon={ClipboardDocumentListIcon} color="#10b981" delay={0.21} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-6">Skill Market Demand</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.barChartData} margin={{ bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={50} />
              <YAxis stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="demand" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-6">Internship Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={stats.pieChartData} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={4} stroke="none">
                {stats.pieChartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }} className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-6">Industry Growth Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stats.lineChartData} margin={{ bottom: 16 }}>
              <defs>
                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={50} />
              <YAxis stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="growth" stroke="#6366f1" strokeWidth={2} fill="url(#growthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.49 }} className="card p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Critical Skill Gaps</h3>
          <p className="text-xs text-slate-500 mb-6">Most frequently missing skills across reports</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={skillGap} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
