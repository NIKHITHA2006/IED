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

const App = () => {
  return (
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
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<DashboardLayout role="user" />}>
          <Route index element={<UserDashboard />} />
          <Route path="skill-gap" element={<SkillGapAnalysis />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
