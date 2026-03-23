import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const growthColors = {
  'Very High': 'badge-green',
  'High': 'badge-blue',
  'Medium': 'badge-amber',
  'Low': 'badge-red',
};

const IndustryManagement = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', growthLevel: 'Medium', image: '' });
  const [search, setSearch] = useState('');

  useEffect(() => { fetchIndustries(); }, []);

  const fetchIndustries = async () => {
    try {
      const { data } = await api.get('/industries');
      setIndustries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', growthLevel: 'Medium', image: '' });
    setModalOpen(true);
  };

  const openEdit = (ind) => {
    setEditing(ind);
    setForm({ name: ind.name, description: ind.description, growthLevel: ind.growthLevel, image: ind.image });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/industries/${editing._id}`, form);
      else await api.post('/industries', form);
      fetchIndustries();
      setModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving industry');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this industry?')) return;
    try { await api.delete(`/industries/${id}`); fetchIndustries(); }
    catch { alert('Error deleting'); }
  };

  const filtered = industries.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Industries</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{industries.length} industry verticals indexed</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white text-sm font-semibold rounded-lg transition-colors">
          <PlusIcon className="w-4 h-4 stroke-[2.5px]" /> Add Industry
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        className="input max-w-sm"
        placeholder="Search industries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card h-72" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((ind, idx) => (
              <motion.div
                key={ind._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04 }}
                className="card overflow-hidden hover:shadow-2xl hover:scale-[1.02] group"
              >
                {/* Image */}
                {ind.image ? (
                  <img src={ind.image} alt={ind.name} className="industry-img" />
                ) : (
                  <div className="industry-img bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{ind.name}</h3>
                    <span className={`badge flex-shrink-0 ${growthColors[ind.growthLevel] || 'badge-blue'}`}>
                      {ind.growthLevel}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-5">{ind.description}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(ind)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      <PencilIcon className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ind._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <TrashIcon className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="col-span-3 text-center text-slate-500 py-16">No industries match your search.</p>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="modal-box"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{editing ? 'Edit Industry' : 'New Industry'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Name</label>
                  <input required className="input" placeholder="e.g. Artificial Intelligence" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea required rows={3} className="input resize-none" placeholder="Brief description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Growth Level</label>
                    <select className="input" value={form.growthLevel} onChange={(e) => setForm({ ...form, growthLevel: e.target.value })}>
                      {['Low', 'Medium', 'High', 'Very High'].map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Image URL</label>
                    <input required className="input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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

export default IndustryManagement;
