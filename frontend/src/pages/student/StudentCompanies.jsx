import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const StudentCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/companies');
        setCompanies(res.data);
      } catch (error) {
        console.error('Error fetching companies', error);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Company Requirements</h1>
      {companies.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a1d24] rounded-xl border border-slate-200 dark:border-white/[0.05]">
          No data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <motion.div
              key={company._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-[#1a1d24] p-5 rounded-xl border border-slate-200 dark:border-white/[0.05] cursor-pointer block"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-center gap-4 mb-4">
                {company.logo ? (
                  <img src={company.logo} alt={company.companyName} className="w-12 h-12 rounded-lg object-cover bg-white" />
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-900 dark:text-white font-bold">
                    {company.companyName.charAt(0)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{company.companyName}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{company.industry?.name || 'General'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedCompany(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#10131a] rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-white/[0.1]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{selectedCompany.companyName} Requirements</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedCompany.description || 'No description available.'}</p>
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany.requiredSkills?.map(skill => (
                    <span key={skill._id} className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-medium"
                onClick={() => setSelectedCompany(null)}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCompanies;
