import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const SkillGapAnalysis = () => {
  const location = useLocation();
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(location.state?.selectedIndustry || null);
  const [skills, setSkills] = useState([]);
  const [internships, setInternships] = useState([]);
  const [knownSkills, setKnownSkills] = useState([]);
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/industries').then((r) => setIndustries(r.data)).catch(console.error);
    if (selectedIndustry) loadSkills(selectedIndustry._id);
  }, [selectedIndustry]);

  const loadSkills = async (industryId) => {
    setLoading(true);
    setResult(null);
    setKnownSkills([]);
    try {
      const [r1, r2] = await Promise.all([api.get('/skills'), api.get('/internships')]);
      setSkills(r1.data.filter((s) => s.mappedIndustries.some((i) => i._id === industryId)));
      setInternships(r2.data.filter((i) => i.industry?._id === industryId));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleIndustryChange = (id) => {
    const ind = industries.find((i) => i._id === id);
    setSelectedIndustry(ind || null);
  };

  const toggleSkill = (id) => {
    setKnownSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(async () => {
      const matched = skills.filter((s) => knownSkills.includes(s._id));
      const missing = skills.filter((s) => !knownSkills.includes(s._id));
      const percentage = skills.length > 0 ? Math.round((matched.length / skills.length) * 100) : 0;
      setResult({ matched, missing, percentage });
      setAnalyzing(false);
      try {
        await api.post('/analytics/report', {
          industryId: selectedIndustry._id,
          knownSkills,
          missingSkills: missing.map((m) => m._id),
          readinessPercentage: percentage,
        });
      } catch (err) { console.error('Report save failed:', err); }
    }, 1200);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Skill Gap Analysis Report', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Industry: ${result.matched ? selectedIndustry.name : ''}`, 14, 26);
    doc.text(`Readiness: ${result.percentage}%   |   Date: ${new Date().toLocaleDateString()}`, 14, 32);
    doc.setTextColor(0);
    doc.autoTable({
      head: [['Skill', 'Status']],
      body: [
        ...result.matched.map((s) => [s.name, '✓ Matched']),
        ...result.missing.map((s) => [s.name, '✗ Missing']),
      ],
      startY: 38,
      theme: 'striped',
    });
    if (internships.length > 0) {
      doc.autoTable({
        head: [['Recommended Internship', 'Duration']],
        body: internships.slice(0, 5).map((i) => [i.title, i.duration]),
        startY: doc.lastAutoTable.finalY + 12,
      });
    }
    doc.save(`Gap_Report_${selectedIndustry?.name?.replace(/\s/g, '_')}.pdf`);
  };

  const readinessColor = result
    ? result.percentage >= 70 ? '#10b981'
      : result.percentage >= 40 ? '#f59e0b'
        : '#ef4444'
    : '#6366f1';

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Skill Gap Analysis</h2>
        <p className="text-slate-400 text-sm mt-1">Compare your current skills against industry requirements</p>
      </div>

      {/* Industry Selector */}
      <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Select Industry</label>
          <select
            className="input"
            value={selectedIndustry?._id || ''}
            onChange={(e) => handleIndustryChange(e.target.value)}
          >
            <option value="">Choose an industry…</option>
            {industries.map((ind) => <option key={ind._id} value={ind._id}>{ind.name}</option>)}
          </select>
        </div>
        {selectedIndustry && (
          <div className="flex items-center gap-3 flex-shrink-0">
            <img src={selectedIndustry.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="text-sm font-semibold text-white">{selectedIndustry.name}</p>
              <p className="text-xs text-slate-500">{selectedIndustry.growthLevel} growth</p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedIndustry ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="card py-20 flex flex-col items-center justify-center text-center"
          >
            <ChartIcon className="w-10 h-10 text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">Select an industry to get started</p>
            <p className="text-slate-600 text-sm mt-1">You'll see relevant skills to self-assess</p>
          </motion.div>
        ) : analyzing ? (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="card py-20 flex flex-col items-center justify-center text-center"
          >
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
            <p className="text-slate-300 font-semibold">Analyzing your profile…</p>
            <p className="text-slate-500 text-sm mt-1">Comparing against {skills.length} skills in {selectedIndustry.name}</p>
          </motion.div>
        ) : !result ? (
          <motion.div key="selector" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Select Skills You Know</h3>
                <p className="text-slate-400 text-xs mt-0.5">{knownSkills.length} of {skills.length} selected</p>
              </div>
              {knownSkills.length > 0 && (
                <button
                  onClick={() => setKnownSkills([])}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-16 card rounded-xl" />)}
              </div>
            ) : skills.length === 0 ? (
              <div className="card py-12 text-center text-slate-500">No skills mapped to this industry yet.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {skills.map((skill) => {
                    const selected = knownSkills.includes(skill._id);
                    return (
                      <motion.button
                        key={skill._id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleSkill(skill._id)}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${selected
                            ? 'border-indigo-500/60 bg-indigo-500/10 text-white'
                            : 'border-white/8 bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-300'
                          }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${selected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'}`}>
                          {selected && <CheckCircleIcon className="w-4 h-4 text-white -m-0.5" />}
                        </div>
                        <span className="text-xs font-semibold leading-tight">{skill.name}</span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <p className="text-slate-500 text-sm">{knownSkills.length === 0 ? 'Select at least one skill to continue' : `${knownSkills.length} skill${knownSkills.length > 1 ? 's' : ''} selected`}</p>
                  <button
                    onClick={handleAnalyze}
                    disabled={knownSkills.length === 0}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Analyze Gap
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Score Card */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">Readiness Score</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold" style={{ color: readinessColor }}>{result.percentage}%</span>
                    <span className="text-slate-500 text-sm font-medium">for {selectedIndustry.name}</span>
                  </div>
                  <div className="progress-bar-bg">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentage}%` }}
                      style={{ background: `linear-gradient(90deg, ${readinessColor}99, ${readinessColor})` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {result.percentage >= 70
                      ? 'Strong profile — you meet most requirements.'
                      : result.percentage >= 40
                        ? 'Moderate — a few key skills to develop.'
                        : 'Early stage — significant upskilling recommended.'}
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button
                    onClick={exportPDF}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 text-sm font-semibold text-slate-300 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" /> Export PDF
                  </button>
                  <button
                    onClick={() => { setResult(null); setKnownSkills([]); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-400 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ArrowPathIcon className="w-4 h-4" /> Re-analyze
                  </button>
                </div>
              </div>
            </div>

            {/* Skills breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Matched Skills ({result.matched.length})</h4>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {result.matched.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4 text-center">None selected</p>
                  ) : result.matched.map((s) => (
                    <div key={s._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300 font-medium">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <XCircleIcon className="w-5 h-5 text-red-400" />
                  <h4 className="text-sm font-bold text-white">Missing Skills ({result.missing.length})</h4>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {result.missing.length === 0 ? (
                    <p className="text-emerald-400 text-sm py-4 text-center font-medium">🎉 No gaps — fully industry-ready!</p>
                  ) : result.missing.map((s) => (
                    <div key={s._id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300 font-medium">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Internships */}
            {internships.length > 0 && (
              <div className="card p-5">
                <h4 className="text-sm font-bold text-white mb-4">Recommended Internships in {selectedIndustry.name}</h4>
                <div className="space-y-3">
                  {internships.slice(0, 4).map((intern) => (
                    <div key={intern._id} className="flex items-start justify-between gap-4 px-4 py-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-white">{intern.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{intern.duration}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {intern.requiredSkills.slice(0, 3).map((s) => (
                          <span key={s._id} className={`skill-chip ${result.missing.some((m) => m._id === s._id) ? 'border-red-500/20 text-red-400' : 'border-emerald-500/20 text-emerald-400'}`}>
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Fallback Chart Icon inline
const ChartIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M9 17V9m4 8V5m4 12v-4" />
  </svg>
);

export default SkillGapAnalysis;
