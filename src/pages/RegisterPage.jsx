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
      const res = await api.post("/auth/register", formData, {
        withCredentials: true, // ✅ same as login
      });
      setUser(res.data); // update user in App state
      navigate("/dashboard"); // redirect to dashboard
    } catch (err) {
      console.error("Register error:", err.response?.data);
      setError(err.response?.data?.msg || "Registration failed"); // ✅ use msg
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          width: "350px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Register</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            required
          />
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4f46e5",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
              marginTop: "0.5rem",
            }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#555" }}>
          Already a user?{" "}
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
