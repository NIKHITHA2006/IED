import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const CompanyRequirementsManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [skills, setSkills] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    requiredSkills: [],
    description: '',
    logo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [compRes, indRes, skillRes] = await Promise.all([
        axios.get('https://ied-oqka.onrender.com/api/companies'),
        axios.get('https://ied-oqka.onrender.com/api/industries'),
        axios.get('https://ied-oqka.onrender.com/api/skills')
      ]);
      setCompanies(compRes.data);
      setIndustries(indRes.data);
      setSkills(skillRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (skillId) => {
    setFormData((prev) => {
      const newSkills = prev.requiredSkills.includes(skillId)
        ? prev.requiredSkills.filter(id => id !== skillId)
        : [...prev.requiredSkills, skillId];
      return { ...prev, requiredSkills: newSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await axios.put(`https://ied-oqka.onrender.com/api/companies/${editingCompany._id}`, formData);
      } else {
        await axios.post('https://ied-oqka.onrender.com/api/companies', formData);
      }
      setEditingCompany(null);
      setFormData({ companyName: '', industry: '', requiredSkills: [], description: '', logo: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving company', error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      companyName: company.companyName,
      industry: company.industry?._id || '',
      requiredSkills: company.requiredSkills?.map(s => s._id) || [],
      description: company.description || '',
      logo: company.logo || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await axios.delete(`https://ied-oqka.onrender.com/api/companies/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting company', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Company Requirements Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 border border-slate-200 dark:border-white/[0.05] rounded-xl p-5 bg-white dark:bg-[#10131a]">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {editingCompany ? 'Edit Company' : 'Add New Company'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.1] rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Logo URL (optional)</label>
              <input
                type="text"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.1] rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Industry</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                required
                className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.1] rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select an Industry</option>
                {industries.map(ind => (
                  <option key={ind._id} value={ind._id}>{ind.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.1] rounded-lg p-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-2">Required Skills</label>
              <div className="max-h-40 overflow-y-auto space-y-1 bg-white dark:bg-[#1a1d24] p-2 rounded-lg border border-slate-200 dark:border-white/[0.1]">
                {skills.filter(s => s.industry?._id === formData.industry || formData.industry === '').map(skill => (
                  <label key={skill._id} className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.requiredSkills.includes(skill._id)}
                      onChange={() => handleSkillChange(skill._id)}
                      className="rounded bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/[0.1] text-indigo-500 focus:ring-0 checked:bg-indigo-500"
                    />
                    <span className="text-xs">{skill.name}</span>
                  </label>
                ))}
                {skills.length === 0 && <span className="text-xs text-slate-500">No skills available</span>}
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white py-2 rounded-lg font-medium transition-colors"
              >
                {editingCompany ? 'Update' : 'Create'}
              </button>
              {editingCompany && (
                <button
                  type="button"
                  onClick={() => { setEditingCompany(null); setFormData({ companyName: '', industry: '', requiredSkills: [], description: '', logo: '' }); }}
                  className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {companies.map(company => (
            <motion.div
              key={company._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.05] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {company.logo ? (
                  <img src={company.logo} alt="Logo" className="w-12 h-12 rounded bg-white object-contain" />
                ) : (
                  <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-900 dark:text-white uppercase">
                    {company.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-slate-900 dark:text-white font-semibold">{company.companyName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{company.industry?.name}</p>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(company)}
                  className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
          {companies.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-500 bg-white dark:bg-[#1a1d24] rounded-xl border border-slate-200 dark:border-white/[0.05]">
              No company requirements found. Create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyRequirementsManagement;
