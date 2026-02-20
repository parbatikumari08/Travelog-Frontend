// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import "./RegisterPage.css";

const RegisterPage = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  useEffect(() => {
    let strength = 0;
    const password = formData.password;
    
    if (password.length > 6) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(Math.min(strength, 4));
  }, [formData.password]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const res = await api.post("/auth/register", formData, {
        withCredentials: true,
      });
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err.response?.data);
      setError(err.response?.data?.msg || "Registration failed");
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const texts = ["Weak", "Fair", "Good", "Strong"];
    return texts[passwordStrength];
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#f56565", "#ed8936", "#ecc94b", "#48bb78"];
    return colors[passwordStrength];
  };

  return (
    <div className="register-container">
      {/* Animated Background */}
      <div className="register-background">
        <div className="gradient-orbit"></div>
        <div className="gradient-orbit orbit-2"></div>
        <div className="gradient-orbit orbit-3"></div>
        <div className="noise-overlay"></div>
      </div>

      {/* Main Content */}
      <motion.div 
        className="register-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="register-card">
          {/* Header */}
          <motion.div 
            className="register-header"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="logo-wrapper">
              <span className="logo-icon">📔</span>
            </div>
            <h1 className="register-title">Create Account</h1>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>⚠️</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`input-wrapper ${focusedField === 'name' ? 'focused' : ''}`}>
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <div className={`input-wrapper ${focusedField === 'email' ? 'focused' : ''}`}>
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
              </div>
            </motion.div>

            {/* Password Field with Hide/Show Toggle */}
            <motion.div 
              className="form-group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className={`input-wrapper ${focusedField === 'password' ? 'focused' : ''}`}>
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <button 
                  type="button"
                  className="password-toggle-text"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {/* Simple Password Strength */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i}
                        className="strength-bar"
                        style={{
                          backgroundColor: i < passwordStrength ? getPasswordStrengthColor() : '#e2e8f0'
                        }}
                      />
                    ))}
                  </div>
                  <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Compact Password Hint */}
            {formData.password && passwordStrength < 2 && (
              <motion.div 
                className="password-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Use 8+ chars, uppercase & number
              </motion.div>
            )}

            {/* Submit Button - Dark Gray */}
            <motion.button
              type="submit"
              className={`register-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="btn-arrow">→</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div 
            className="login-link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>
              Already have an account?{' '}
              <button onClick={() => navigate("/login")}>
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div 
        className="register-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>© 2026 Travelog. All rights reserved.</p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;