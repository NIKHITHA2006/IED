import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import IndustryManagement from './pages/IndustryManagement';
import SkillManagement from './pages/SkillManagement';
import InternshipManagement from './pages/InternshipManagement';
import UserDashboard from './pages/UserDashboard';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import DashboardLayout from './layouts/DashboardLayout';
import StudentInternships from './pages/student/StudentInternships';
import StudentSkills from './pages/student/StudentSkills';
import StudentCompanies from './pages/student/StudentCompanies';
import CompanyRequirementsManagement from './pages/admin/CompanyRequirementsManagement';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="industries" element={<IndustryManagement />} />
          <Route path="skills" element={<SkillManagement />} />
          <Route path="internships" element={<InternshipManagement />} />
          <Route path="companies" element={<CompanyRequirementsManagement />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<DashboardLayout role="user" />}>
          <Route index element={<UserDashboard />} />
          <Route path="skill-gap" element={<SkillGapAnalysis />} />
          <Route path="internships" element={<StudentInternships />} />
          <Route path="skills" element={<StudentSkills />} />
          <Route path="companies" element={<StudentCompanies />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;
