import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const images = [
  "/images/bg1.png",
  "/images/bg2.png",
  "/images/bg3.png",
  "/images/bg4.png",
  "/images/bg5.png"
];

const WelcomePage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-page">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImage}
          className="welcome-bg"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Main Content */}
      <div className="welcome-content">
        <motion.div
          className="content-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* WELCOME TO with decorative elements */}
          <motion.div
            className="greeting-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="decorative-line left" />
            <span className="welcome-greeting">WELCOME TO</span>
            <div className="decorative-line right" />
          </motion.div>

          {/* Travelog with background card */}
          <motion.div
            className="title-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="welcome-title">Travelog</h1>
          </motion.div>

          {/* Subtitle with background card */}
          <motion.div
            className="subtitle-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="decorative-dot" />
            <p className="welcome-subtitle">
              Capture and share your travel memories
            </p>
            <div className="decorative-dot" />
          </motion.div>

          {/* Button with decorative elements */}
          <motion.div
            className="button-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="decorative-rule">
              <span className="rule-symbol">◈</span>
              <span className="rule-symbol">◈</span>
              <span className="rule-symbol">◈</span>
            </div>
            <button 
              className="welcome-button"
              onClick={() => navigate("/login")}
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="image-progress">
        {images.map((_, index) => (
          <button
            key={index}
            className={`progress-dot ${index === currentImage ? 'active' : ''}`}
            onClick={() => setCurrentImage(index)}
            aria-label={`View image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;