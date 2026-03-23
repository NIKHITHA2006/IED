import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StudentSkills = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/skills');
        setSkills(res.data);
      } catch (error) {
        console.error('Error fetching skills', error);
      }
    };
    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    const industryName = skill.industry?.name || 'General';
    if (!acc[industryName]) acc[industryName] = [];
    acc[industryName].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Skills Repository</h1>
      <div className="space-y-8">
        {Object.entries(groupedSkills).map(([industry, industrySkills]) => (
          <div key={industry}>
            <h2 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-4">{industry}</h2>
            <div className="flex flex-wrap gap-3">
              {industrySkills.map(skill => (
                <div key={skill._id} className="bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/[0.05] px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSkills;
