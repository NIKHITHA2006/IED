import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const growthColors = {
  'Very High': 'badge-green',
  'High': 'badge-blue',
  'Medium': 'badge-amber',
  'Low': 'badge-red',
};

const UserDashboard = () => {
  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/industries'), api.get('/skills'), api.get('/internships')])
      .then(([r1, r2, r3]) => {
        setIndustries(r1.data);
        setSkills(r2.data);
        setInternships(r3.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div className="h-40 card rounded-2xl" />
      <div className="grid grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => <div key={i} className="h-60 card" />)}
      </div>
    </div>
  );

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  return (
    <div className="space-y-10 fade-in">
      {/* Welcome Banner */}
      <div className="card p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Welcome back</p>
          <h2 className="text-3xl font-bold text-white mb-1">{userInfo.name || 'Student'}</h2>
          <p className="text-slate-400 text-sm max-w-md">
            Explore industry verticals, identify your skill gaps, and discover internship opportunities aligned with your goals.
          </p>
        </div>
        <Link
          to="/user/skill-gap"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
        >
          <ChartBarIcon className="w-4 h-4" /> Start Gap Analysis
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Industries', value: industries.length },
          { label: 'Skills Tracked', value: skills.length },
          { label: 'Internships', value: internships.length },
        ].map((s, i) => (
          <div key={i} className="card p-5 text-center">
            <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Industry Grid */}
      <section>
        <div className="section-header">
          <div>
            <h3 className="text-xl font-bold text-white">Industry Verticals</h3>
            <p className="text-sm text-slate-500 mt-0.5">Explore industry domains and their skill requirements</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="card overflow-hidden hover:shadow-2xl hover:scale-[1.02] group"
            >
              {ind.image && (
                <img src={ind.image} alt={ind.name} className="industry-img" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-white text-base leading-tight">{ind.name}</h4>
                  <span className={`badge flex-shrink-0 ${growthColors[ind.growthLevel] || 'badge-blue'}`}>
                    {ind.growthLevel}
                  </span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">{ind.description}</p>
                <Link
                  to="/user/skill-gap"
                  state={{ selectedIndustry: ind }}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  Analyze My Gap <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Skills + Internships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skills */}
        <section>
          <div className="section-header">
            <div>
              <h3 className="text-xl font-bold text-white">In-Demand Skills</h3>
              <p className="text-sm text-slate-500 mt-0.5">Skills with high market demand</p>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="divide-y divide-white/[0.05]">
              {skills.slice(0, 8).map((skill, i) => (
                <div key={skill._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-indigo-900/60 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-400 text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-300 flex-1">{skill.name}</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.mappedIndustries.slice(0, 2).map((ind) => (
                      <span key={ind._id} className="skill-chip">{ind.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internships */}
        <section>
          <div className="section-header">
            <div>
              <h3 className="text-xl font-bold text-white">Open Internships</h3>
              <p className="text-sm text-slate-500 mt-0.5">Available placement opportunities</p>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="divide-y divide-white/[0.05]">
              {internships.slice(0, 6).map((intern) => (
                <div key={intern._id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-semibold text-white leading-tight">{intern.title}</h4>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium flex-shrink-0 mt-0.5">
                      <ClockIcon className="w-3 h-3" />{intern.duration}
                    </span>
                  </div>
                  {intern.industry?.name && (
                    <span className="badge badge-blue mb-2">{intern.industry.name}</span>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {intern.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s._id} className="skill-chip">{s.name}</span>
                    ))}
                    {intern.requiredSkills.length > 4 && (
                      <span className="text-[10px] text-slate-600 font-medium">+{intern.requiredSkills.length - 4}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
