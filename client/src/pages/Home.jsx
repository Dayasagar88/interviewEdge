import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import { motion, useInView } from "framer-motion";
import { AiOutlineCheck } from "react-icons/ai";
import { FaArrowRight, FaMicrophone, FaBrain, FaChartLine } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.2 } },
};

// ─── Floating Orbs ─────────────────────────────────────────────────────────────

function Orb({ size, top, left, right, bottom, color, blur, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.4, ease: "easeOut", delay }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        top, left, right, bottom,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        opacity: 0.1,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.18, ease: "easeInOut" }}
          className="w-1.5 h-1.5 rounded-full bg-blue-400"
        />
      ))}
    </div>
  );
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score = 8.5, max = 10 }) {
  const pct = score / max;
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
        <motion.circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl font-bold text-white leading-none"
        >
          {score}
        </motion.div>
        <div className="text-gray-500 text-xs">/ {max}</div>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function Home() {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, { once: true, margin: "-60px" });

  const checks = [
    { icon: <FaMicrophone className="text-blue-400 text-xs" />, label: "Real Interview Questions" },
    { icon: <FaBrain className="text-blue-400 text-xs" />, label: "AI Evaluation Reports" },
    { icon: <FaChartLine className="text-blue-400 text-xs" />, label: "Track Your Progress" },
  ];

  const feedbackItems = [
    { label: "Technical Accuracy", score: 90, color: "#3b82f6" },
    { label: "Communication", score: 75, color: "#60a5fa" },
    { label: "Confidence", score: 82, color: "#2563eb" },
  ];

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)",
        position: "relative",
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Orb size={500} top="-5%" left="-5%" color="#1d4ed8" blur={130} delay={0} />
        <Orb size={350} bottom="5%" right="-5%" color="#2563eb" blur={110} delay={0.3} />
        <Orb size={220} top="40%" left="42%" color="#3b82f6" blur={80} delay={0.5} />
      </div>

      {/* Grid texture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ duration: 2, delay: 0.4 }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Navbar />

      <section className="py-24" style={{ position: "relative", zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">

          {/* ── LEFT ── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
              style={{
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                color: "#60a5fa",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              >
                <HiSparkles />
              </motion.div>
              AI-Powered Interview Practice
            </motion.div>

            {/* Heading */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-bold leading-tight"
            >
              Master Interviews
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                With AI
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 text-gray-400 text-lg leading-relaxed max-w-md"
            >
              Practice real interview questions, get instant AI feedback, and improve faster than ever before.
            </motion.p>

            {/* CTA */}
            <motion.div custom={3} variants={fadeUp} className="mt-8">
              <motion.button
                onClick={() => navigate("/interview")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 32px rgba(59,130,246,0.45)" }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold overflow-hidden"
                style={{ transition: "background 0.2s" }}
              >
                {/* Shimmer */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", repeatDelay: 1.5 }}
                  style={{
                    position: "absolute", top: 0, bottom: 0, width: "40%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                    pointerEvents: "none",
                  }}
                />
                Start Interview
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                >
                  <FaArrowRight className="text-sm" />
                </motion.span>
              </motion.button>
            </motion.div>

            {/* Check list */}
            <motion.ul
              custom={4}
              variants={fadeUp}
              className="mt-10 space-y-3"
            >
              {checks.map(({ icon, label }, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
                  >
                    {icon}
                  </div>
                  {label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* ── RIGHT — Feedback Card ── */}
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
            animate={cardInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div
              className="rounded-2xl p-7 shadow-2xl"
              style={{
                background: "rgba(10,10,10,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(10px)",
              }}
            >
              {/* Top accent */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={cardInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, #2563eb, #60a5fa, #2563eb)",
                  borderRadius: 2,
                  marginBottom: "1.5rem",
                  transformOrigin: "left",
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Feedback Preview</h3>
                  <p className="text-gray-500 text-xs mt-0.5">React Developer · Mid-level</p>
                </div>
                <ScoreRing score={8.5} max={10} />
              </div>

              {/* AI message bubble */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={cardInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="rounded-xl p-4 mb-5"
                style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <HiSparkles className="text-white text-xs" />
                  </div>
                  <span className="text-blue-400 text-xs font-medium">AI Evaluator</span>
                  <TypingDots />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your answer demonstrates strong understanding of React concepts. Try improving your time complexity explanation for a perfect score.
                </p>
              </motion.div>

              {/* Skill bars */}
              <div className="space-y-3">
                {feedbackItems.map(({ label, score, color }, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-400">{label}</span>
                      <span style={{ color }}>{score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={cardInView ? { width: `${score}%` } : {}}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 + i * 0.15 }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom tag */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={cardInView ? { opacity: 1 } : {}}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="mt-5 flex items-center gap-2 text-xs text-gray-600"
              >
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="w-1.5 h-1.5 rounded-full bg-green-400"
                />
                Analysis complete · Generated in 1.2s
              </motion.div>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

export default Home;