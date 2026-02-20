import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import api from "./api";
import "./App.css";

// Pages
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

// Components
import Navbar from "./components/Navbar";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem("darkMode") === "true";
  });

  const loadMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
  }, []);

  // Apply dark / light classes globally and persist
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    document.body.classList.toggle("light", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <Router>
      {/* Render Navbar only if user is logged in */}
      {user && (
        <Navbar
          user={user}
          setUser={setUser}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)} // ✅ fixed prop name
        />
      )}

      <Routes>
  <Route path="/" element={<WelcomePage />} />
  <Route
    path="/login"
    element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />}
  />
  <Route
    path="/register"
    element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />}
  />
  <Route
    path="/dashboard"
    element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />}
  />
  <Route
    path="/profile"
    element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />}
  />
  <Route path="*" element={<Navigate to="/" />} />
</Routes>

    </Router>
  );
};

export default App;
