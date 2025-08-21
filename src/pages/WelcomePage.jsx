import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css"; // your existing CSS

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
    }, 5000); // change interval if you want faster switch
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="welcome-page">
      {/* Background Image with AnimatePresence */}
      <AnimatePresence>
        <motion.div
          key={currentImage}
          className="welcome-bg"
          style={{ backgroundImage: `url(${images[currentImage]})` }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.25, opacity: 0 }} // slightly faster zoom-out
          transition={{ duration: 1.5 }} // faster transition
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="welcome-overlay" />

      {/* Centered Content */}
      <div className="welcome-content">
        <motion.h1
          className="welcome-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Welcome to Travelog
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Capture and share your travel memories
        </motion.p>

        <motion.button
          className="welcome-button"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120, delay: 2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
        >
          Get Started
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomePage;
