// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "./Navbar.css";

export default function Navbar({ user, setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on welcome/login/register
  if (["/", "/login", "/register"].includes(location.pathname)) return null;

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch {}
  };

  const isActive = (p) => location.pathname === p;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          Travelog
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✖" : "☰"}
        </button>

        {/* Desktop menu */}
        <div className="navbar-links desktop-only">
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            Profile
          </Link>

          <button onClick={toggleDarkMode} className="toggle-btn">
            {darkMode ? "Light" : "Dark"}
          </button>

          {user && (
            <div className="user-info">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className={isActive("/dashboard") ? "active" : ""}
          >
            Dashboard
          </Link>

          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={isActive("/profile") ? "active" : ""}
          >
            Profile
          </Link>

          <button
            onClick={() => {
              toggleDarkMode();
              setMenuOpen(false);
            }}
            className="toggle-btn mobile-btn"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {user && (
            <>
              <span className="mobile-user">{user.name}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="logout-btn mobile-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
