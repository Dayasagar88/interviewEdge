import React, { useState, useEffect } from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const navLinks = ["Features", "Modes", "Pricing", "About"];

function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        background: scrolled
          ? "rgba(2, 6, 23, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ── Logo ── */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
          whileHover="hover"
          initial="rest"
        >
          <motion.div
            variants={{
              rest: { rotate: 0, scale: 1 },
              hover: { rotate: [0, -12, 12, 0], scale: 1.1 },
            }}
            transition={{ duration: 0.5 }}
            className="relative bg-blue-600 p-2 rounded-lg shadow-lg"
            style={{ boxShadow: "0 0 16px rgba(37,99,235,0.4)" }}
          >
            <RiRobot2Fill className="text-white text-xl" />
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "0.5rem",
                border: "1px solid rgba(59,130,246,0.5)",
                pointerEvents: "none",
              }}
            />
          </motion.div>

          <div>
            <motion.h1
              variants={{ rest: { x: 0 }, hover: { x: 2 } }}
              transition={{ duration: 0.2 }}
              className="text-white font-semibold text-lg leading-tight"
            >
              InterviewEdge
            </motion.h1>
            <p className="text-gray-500 text-xs tracking-wide">AI Interview Platform</p>
          </div>
        </motion.div>

        {/* ── Nav Links (desktop) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <motion.button
              key={link}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setActiveLink(link)}
              className="relative px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ color: activeLink === link ? "#fff" : "#9ca3af" }}
              whileHover={{ color: "#ffffff" }}
            >
              {link}
              {/* Hover underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute",
                  bottom: 4,
                  left: "16px",
                  right: "16px",
                  height: 1,
                  background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
                  transformOrigin: "left",
                  borderRadius: 2,
                }}
              />
            </motion.button>
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-gray-400"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            AI Online
          </motion.div>

          {/* CTA button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => navigate("/auth")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(59,130,246,0.45)" }}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm font-medium overflow-hidden"
            style={{ transition: "background 0.2s" }}
          >
            {/* Shimmer sweep */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1.5 }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "40%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                pointerEvents: "none",
              }}
            />
            Get Started
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            >
              <FaArrowRight className="text-xs" />
            </motion.span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export default LandingNavbar;