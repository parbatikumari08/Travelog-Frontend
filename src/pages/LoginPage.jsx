import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import "./LoginPage.css";

const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  // Show demo credentials elegantly
  useEffect(() => {
    setShowDemo(true);
    const timer = setTimeout(() => setShowDemo(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Simulate loading state
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      const res = await api.post("/auth/login", formData);
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Login error:", err.response?.data);
      setError(err.response?.data?.msg || "Invalid credentials");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: "vini08@gmail.com",
      password: "Vini@123"
    });
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="login-background">
        <div className="gradient-orbit"></div>
        <div className="gradient-orbit orbit-2"></div>
        <div className="gradient-orbit orbit-3"></div>
        <div className="noise-overlay"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="login-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <div className="login-card">
          {/* Header with Logo - Changed icon */}
          <motion.div 
            className="login-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="logo-wrapper">
              <span className="logo-icon">📔</span> 
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Login to continue</p>
          </motion.div>

          {/* Demo Credentials Banner */}
          <AnimatePresence>
            {showDemo && (
              <motion.div 
                className="demo-banner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="demo-content">
                  <span className="demo-icon">🔐</span>
                  <div className="demo-text">
                    <strong>Demo Credentials</strong>
                    <p>vini08@gmail.com | Vini@123</p>
                  </div>
                  <button 
                    className="demo-fill-btn"
                    onClick={fillDemoCredentials}
                  >
                    Fill
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <span className="error-icon">⚠️</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Email Field */}
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                {formData.email && <span className="input-check">✓</span>}
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div 
              className="form-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                {formData.password && <span className="input-check">✓</span>}
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <motion.div 
            className="register-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>
              New to Travelog?{' '}
              <button onClick={() => navigate("/register")}>
                Create account
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="login-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <p>© 2026 Travelog. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default LoginPage;