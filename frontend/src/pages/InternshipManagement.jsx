import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const InternshipManagement = () => {
  const [internships, setInternships] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', industry: '', requiredSkills: [], duration: '', description: '', applyUrl: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([api.get('/internships'), api.get('/industries'), api.get('/skills')]);
      setInternships(r1.data);
      setIndustries(r2.data);
      setSkills(r3.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', industry: '', requiredSkills: [], duration: '', description: '', applyUrl: '' });
    setModalOpen(true);
  };

  const openEdit = (intern) => {
    setEditing(intern);
    setForm({
      title: intern.title,
      industry: intern.industry?._id || '',
      requiredSkills: intern.requiredSkills.map((s) => s._id),
      duration: intern.duration,
      description: intern.description,
      applyUrl: intern.applyUrl || ''
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/internships/${editing._id}`, form);
      else await api.post('/internships', form);
      fetchData();
      setModalOpen(false);
    } catch (err) { alert('Error saving internship'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship?')) return;
    await api.delete(`/internships/${id}`);
    fetchData();
  };

  const toggleSkill = (id) => {
    setForm((f) => ({
      ...f,
      requiredSkills: f.requiredSkills.includes(id)
        ? f.requiredSkills.filter((s) => s !== id)
        : [...f.requiredSkills, id],
    }));
  };

  const filtered = internships.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Internships</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{internships.length} active placement listings</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white text-sm font-semibold rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4 stroke-[2.5px]" /> Add Listing
        </button>
      </div>

      {/* Search */}
      <input type="text" className="input max-w-sm" placeholder="Search internships..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-pulse">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-56 card" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence>
            {filtered.map((intern, idx) => (
              <motion.div
                key={intern._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="card p-6 hover:shadow-2xl hover:scale-[1.01] group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{intern.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      {intern.industry?.name && (
                        <span className="badge badge-blue">{intern.industry.name}</span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {intern.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => openEdit(intern)} className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(intern._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">{intern.description}</p>

                {intern.requiredSkills.length > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {intern.requiredSkills.map((s) => (
                        <span key={s._id} className="skill-chip">{s.name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-slate-500 py-16">No internships found.</p>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="modal-box max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{editing ? 'Edit Internship' : 'New Internship'}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Title</label>
                    <input required className="input" placeholder="e.g. ML Research Intern" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Duration</label>
                    <input required className="input" placeholder="e.g. 3 Months" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Industry</label>
                  <select required className="input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
                    <option value="">Select industry…</option>
                    {industries.map((ind) => <option key={ind._id} value={ind._id}>{ind.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} className="input resize-none" placeholder="Brief role description…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Apply URL (Optional)</label>
                  <input className="input" placeholder="e.g. https://unstop.com/..." value={form.applyUrl} onChange={(e) => setForm({ ...form, applyUrl: e.target.value })} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Required Skills</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto w-full">
                    {skills.map((s) => (
                      <label key={s._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-xs ${form.requiredSkills.includes(s._id) ? 'border-indigo-500/50 bg-indigo-500/10 text-slate-200' : 'border-white/8 text-slate-500 dark:text-slate-400 hover:bg-white/5'}`}>
                        <input type="checkbox" className="accent-indigo-500" checked={form.requiredSkills.includes(s._id)} onChange={() => toggleSkill(s._id)} />
                        <span className="truncate font-medium">{s.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 text-sm font-semibold border border-slate-200 dark:border-white/10 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white rounded-lg transition-colors">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternshipManagement;
