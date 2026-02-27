import React, { useEffect, useRef } from "react";
import LandingNavbar from "../components/LandingNavbar";
import { motion, useInView } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaMicrophone, FaClock, FaFileAlt, FaChartBar, FaDownload, FaBrain, FaComments, FaShieldAlt, FaCoins } from "react-icons/fa";
import Footer from "./Footer";

// ─── Animation Variants ────────────────────────────────────────────────────────

const pageReveal = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const heroVariant = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3,
    },
  },
};

const heroSubVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 },
  },
};

const heroBtnVariant = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.75 },
  },
};

const sectionTitleVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 },
  },
};

const containerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 1.05 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 70, scale: 0.94, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const footerVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, delay: 1.6 } },
};

const scrollFadeUp = {
  hidden: { opacity: 0, y: 50, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const scrollContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const scrollCard = {
  hidden: { opacity: 0, y: 50, scale: 0.95, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Floating Orbs ─────────────────────────────────────────────────────────────

const orbs = [
  { w: 520, h: 520, top: "-10%", left: "-8%", color: "#1d4ed8", blur: 120, delay: 0 },
  { w: 380, h: 380, top: "55%", right: "-5%", color: "#2563eb", blur: 100, delay: 0.3 },
  { w: 260, h: 260, top: "30%", left: "50%", color: "#3b82f6", blur: 80, delay: 0.6 },
];

function FloatingOrb({ w, h, top, left, right, color, blur, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 0.12, scale: 1 }}
      transition={{ duration: 2.2, ease: "easeOut", delay }}
      style={{
        position: "absolute",
        width: w,
        height: h,
        top,
        left,
        right,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Scroll Section Wrapper ────────────────────────────────────────────────────

function ScrollSection({ children, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={scrollContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) navigate("/");
  }, []);

  const steps = [
    {
      icon: <FaUserTie className="text-white text-xl" />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "Choose your job role and experience level. InterviewEdge automatically adjusts difficulty to match your skill level.",
    },
    {
      icon: <FaMicrophone className="text-white text-xl" />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Answer questions using your voice. AI generates intelligent follow-up questions based on your responses.",
    },
    {
      icon: <FaClock className="text-white text-xl" />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Experience real interview pressure with time-limited questions and instant AI evaluation.",
    },
  ];

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageReveal}
        className="min-h-screen flex flex-col bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white overflow-hidden"
        style={{ position: "relative" }}
      >
        {/* Ambient orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {orbs.map((orb, i) => (
            <FloatingOrb key={i} {...orb} />
          ))}
        </div>

        {/* Subtle grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />

        <LandingNavbar />

        <div className="flex-1 py-20" style={{ position: "relative", zIndex: 1 }}>
          <div className="max-w-[1400px] mx-auto px-8">

            {/* ── Hero ── */}
            <div className="text-center max-w-3xl mx-auto mb-24">
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={heroVariant}
                className="text-5xl font-bold leading-tight"
              >
                Welcome To{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #60a5fa, #3b82f6, #2563eb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  InterviewEdge
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={heroSubVariant}
                className="mt-6 text-gray-400 text-lg"
              >
                Practice real interviews · Get AI feedback · Improve faster than ever
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={heroBtnVariant}
                className="mt-8 flex justify-center"
              >
                <motion.button
                  onClick={() => navigate("/auth")}
                  whileHover={{ scale: 1.06, boxShadow: "0 0 32px rgba(59,130,246,0.45)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold flex items-center gap-2"
                >
                  Start Interview
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </motion.button>
              </motion.div>
            </div>

            {/* ── How It Works ── */}
            <div className="mt-16">
              <motion.h2
                initial="hidden"
                animate="visible"
                variants={sectionTitleVariant}
                className="text-3xl font-semibold text-center mb-14"
              >
                How InterviewEdge Works
              </motion.h2>

              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-10"
                style={{ perspective: "1000px" }}
              >
                {steps.map(({ icon, step, title, desc }, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariant}
                    whileHover={{ rotateX: 5, rotateY: -5, scale: 1.04, borderColor: "rgba(59,130,246,0.45)" }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl p-10 text-center cursor-pointer transition-colors"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Icon badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 16,
                        delay: 1.1 + i * 0.18,
                      }}
                      className="absolute -top-7 left-1/2 -translate-x-1/2 bg-blue-600 p-4 rounded-xl shadow-lg"
                    >
                      {icon}
                    </motion.div>

                    <p className="text-blue-500 text-sm mt-8">{step}</p>
                    <h3 className="text-xl font-semibold mt-2">{title}</h3>
                    <p className="text-gray-400 mt-4 leading-relaxed">{desc}</p>

                    {/* Subtle shimmer line on load */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0.7 }}
                      animate={{ scaleX: 0, opacity: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + i * 0.18 }}
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                        transformOrigin: "left",
                        borderRadius: "0 0 1rem 1rem",
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* ── Advanced AI Capabilities ── */}
            <div className="mt-32">
              <ScrollSection>
                <motion.h2
                  variants={scrollFadeUp}
                  className="text-3xl font-semibold text-center mb-14"
                >
                  Advanced AI{" "}
                  <span style={{ background: "linear-gradient(90deg, #60a5fa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Capabilities
                  </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: <FaBrain className="text-blue-400 text-2xl" />,
                      title: "AI Answer Evaluation",
                      desc: "Scores communication, technical accuracy and confidence.",
                      accent: "#3b82f6",
                    },
                    {
                      icon: <FaFileAlt className="text-blue-400 text-2xl" />,
                      title: "Resume Based Interview",
                      desc: "Project-specific questions based on your uploaded resume.",
                      accent: "#2563eb",
                    },
                    {
                      icon: <FaDownload className="text-blue-400 text-2xl" />,
                      title: "Downloadable PDF Report",
                      desc: "Detailed strengths, weaknesses and improvement insights.",
                      accent: "#1d4ed8",
                    },
                    {
                      icon: <FaChartBar className="text-blue-400 text-2xl" />,
                      title: "History & Analytics",
                      desc: "Track progress with performance graphs and topic analysis.",
                      accent: "#3b82f6",
                    },
                  ].map(({ icon, title, desc, accent }, i) => (
                    <motion.div
                      key={i}
                      variants={scrollCard}
                      whileHover={{ scale: 1.03, borderColor: "rgba(59,130,246,0.5)", boxShadow: "0 0 30px rgba(59,130,246,0.1)" }}
                      transition={{ type: "spring", stiffness: 220, damping: 20 }}
                      className="flex items-center gap-6 bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-7 cursor-pointer"
                    >
                      {/* Icon box */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
                      >
                        {icon}
                      </motion.div>

                      <div>
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{desc}</p>
                      </div>

                      {/* Animated dot */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: i * 0.4 }}
                        className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"
                      />
                    </motion.div>
                  ))}
                </div>
              </ScrollSection>
            </div>

            {/* ── Multiple Interview Modes ── */}
            <div className="mt-32">
              <ScrollSection>
                <motion.h2
                  variants={scrollFadeUp}
                  className="text-3xl font-semibold text-center mb-14"
                >
                  Multiple Interview{" "}
                  <span style={{ background: "linear-gradient(90deg, #60a5fa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    Modes
                  </span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {[
                    {
                      icon: <FaComments className="text-blue-400 text-2xl" />,
                      title: "HR Interview Mode",
                      desc: "Behavioral and communication based evaluation.",
                      tag: "Behavioral",
                    },
                    {
                      icon: <FaBrain className="text-blue-400 text-2xl" />,
                      title: "Technical Mode",
                      desc: "Deep technical questioning based on selected role.",
                      tag: "Technical",
                    },
                    {
                      icon: <FaShieldAlt className="text-blue-400 text-2xl" />,
                      title: "Confidence Detection",
                      desc: "Basic tone and voice analysis insights.",
                      tag: "Voice AI",
                    },
                    {
                      icon: <FaCoins className="text-blue-400 text-2xl" />,
                      title: "Credits System",
                      desc: "Unlock premium interview sessions easily.",
                      tag: "Premium",
                    },
                  ].map(({ icon, title, desc, tag }, i) => (
                    <motion.div
                      key={i}
                      variants={scrollCard}
                      whileHover={{ scale: 1.03, borderColor: "rgba(59,130,246,0.5)", boxShadow: "0 0 30px rgba(59,130,246,0.1)" }}
                      transition={{ type: "spring", stiffness: 220, damping: 20 }}
                      className="flex items-center gap-6 bg-[#0a0a0a] border border-[#1e1e1e] rounded-2xl p-7 cursor-pointer"
                    >
                      {/* Icon box */}
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}
                      >
                        {icon}
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">{desc}</p>
                      </div>

                      {/* Tag badge */}
                      <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                        className="ml-auto flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full"
                        style={{ background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.25)" }}
                      >
                        {tag}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </ScrollSection>
            </div>

          </div>
        </div>

        <Footer/>
      </motion.div>
    </>
  );
}

export default Dashboard;
