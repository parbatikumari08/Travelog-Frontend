// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "./Navbar.css"; // new CSS file

export default function Navbar({ user, setUser, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

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
        <Link to="/dashboard" className="navbar-logo">
          Travelog
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
            Dashboard
          </Link>
          <Link to="/profile" className={isActive("/profile") ? "active" : ""}>
            Profile
          </Link>

          <button onClick={toggleDarkMode} className="toggle-btn">
            {darkMode ? "Light Mode" : "Dark Mode"}
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
    </nav>
  );
}
