import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const SkillManagement = () => {
  const [skills, setSkills] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', icon: 'SparklesIcon', mappedIndustries: [] });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([api.get('/skills'), api.get('/industries')]);
      setSkills(r1.data);
      setIndustries(r2.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', icon: 'SparklesIcon', mappedIndustries: [] });
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({ name: skill.name, icon: skill.icon, mappedIndustries: skill.mappedIndustries.map((i) => i._id) });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/skills/${editing._id}`, form);
      else await api.post('/skills', form);
      fetchData();
      setModalOpen(false);
    } catch (err) { alert('Error saving skill'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await api.delete(`/skills/${id}`);
    fetchData();
  };

  const toggleIndustry = (id) => {
    setForm((f) => ({
      ...f,
      mappedIndustries: f.mappedIndustries.includes(id)
        ? f.mappedIndustries.filter((i) => i !== id)
        : [...f.mappedIndustries, id],
    }));
  };

  const filtered = skills.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills</h2>
          <p className="text-slate-400 text-sm mt-1">{skills.length} skills in global repository</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4 stroke-[2.5px]" /> Add Skill
        </button>
      </div>

      {/* Search */}
      <input type="text" className="input max-w-sm" placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Icon Key</th>
                <th>Mapped Industries</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-slate-500">No skills found.</td></tr>
              ) : filtered.map((skill, idx) => (
                <motion.tr key={skill._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}>
                  <td>
                    <span className="font-semibold text-slate-200">{skill.name}</span>
                  </td>
                  <td>
                    <code className="text-xs text-indigo-400 bg-indigo-950/50 px-2 py-1 rounded font-mono">{skill.icon}</code>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      {skill.mappedIndustries.map((ind) => (
                        <span key={ind._id} className="skill-chip">{ind.name}</span>
                      ))}
                      {skill.mappedIndustries.length === 0 && <span className="text-slate-600 text-xs">None</span>}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(skill._id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              className="modal-box max-w-xl"
            >
              <h3 className="text-lg font-bold text-white mb-6">{editing ? 'Edit Skill' : 'New Skill'}</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Skill Name</label>
                    <input required className="input" placeholder="e.g. Machine Learning" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Icon Key</label>
                    <input required className="input" placeholder="SparklesIcon" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Map to Industries</label>
                  <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1">
                    {industries.map((ind) => (
                      <label key={ind._id} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${form.mappedIndustries.includes(ind._id) ? 'border-indigo-500/50 bg-indigo-500/10 text-slate-200' : 'border-white/8 bg-white/3 text-slate-400 hover:bg-white/5'}`}>
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded text-indigo-500 accent-indigo-500"
                          checked={form.mappedIndustries.includes(ind._id)}
                          onChange={() => toggleIndustry(ind._id)}
                        />
                        <span className="text-xs font-medium truncate">{ind.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 text-sm font-semibold border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillManagement;
