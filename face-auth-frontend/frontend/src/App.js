// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/UserAuthPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";

import './index.css';
import DashboardPage from "./pages/dashboard";

import AdminRegisterPage from "./pages/AdminRegisterPage";
import AdminAuth from "./pages/AdminAuth";
import AdminLoginPage from "./pages/AdminLoginPage";
import EmailVerification from "./pages/EmailVerification";
import UserAuthPage from './pages/UserAuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<UserAuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminAuth />} /> {/* 👈 updated path */}
        <Route path="/admin/register" element={<AdminRegisterPage />} /> {/* 👈 updated path */}
        <Route path="/admin/login" element={<AdminLoginPage />} /> {/* 👈 updated path */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* 👈 updated path */}
        <Route path="/admin/verifyEmail" element={<EmailVerification />} /> {/* 👈 updated path */}
        <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </Router>
  );
}

export default App;
