import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const StudentInternships = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get('/internships');
        setInternships(res.data);
      } catch (error) {
        console.error('Error fetching internships', error);
      }
    };
    fetchInternships();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Available Internships</h1>
      
      {internships.length === 0 ? (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1a1d24] rounded-xl border border-slate-200 dark:border-white/[0.05]">
          No data available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((internship) => (
            <motion.div
              key={internship._id}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-[#1a1d24] p-5 rounded-xl border border-slate-200 dark:border-white/[0.05] cursor-pointer"
              onClick={() => setSelectedInternship(internship)}
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{internship.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{internship.company || 'N/A'} • {internship.industry?.name || 'Unknown'}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {internship.requiredSkills?.map(skill => (
                  <span key={skill._id} className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                    {skill.name}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{internship.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedInternship && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelectedInternship(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#10131a] rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-white/[0.1]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{selectedInternship.title}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{selectedInternship.company || 'N/A'} • {selectedInternship.industry?.name || 'Unknown'}</p>
              
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.requiredSkills?.map(skill => (
                    <span key={skill._id} className="text-xs px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Description:</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{selectedInternship.description}</p>
              </div>

              <a
                href={selectedInternship.applyUrl || 'https://unstop.com/internship?quickApply=true&usertype=students&domain=2&oppstatus=open'}
                target="_blank"
                rel="noreferrer"
                className="block w-full text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors mb-3"
              >
                Apply Now
              </a>
              <button
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm font-medium transition-colors"
                onClick={() => setSelectedInternship(null)}
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

export default StudentInternships;
