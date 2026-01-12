// frontend/src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

const RegisterPage = ({ setUser }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", formData);
      setUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  const containerStyle = {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  };

  const inputStyle = {
    padding: "0.75rem",
    marginBottom: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  };

  const btnStyle = {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    marginTop: "0.5rem",
  };

  return (
    <div style={containerStyle}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={cardStyle}
      >
        <h2 style={{ marginBottom: "1rem" }}>Register</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={inputStyle}
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={inputStyle}
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

          <button type="submit" style={btnStyle}>
            Register
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
          Already registered?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              fontWeight: "bold",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
