import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { ServerUrl } from "../App";
import {
  FaChartLine, FaBriefcase, FaClock, FaCheckCircle,
  FaTimesCircle, FaSearch, FaArrowRight,
  FaRegCalendarAlt, FaStar, FaPlay, FaFileAlt,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdOutlineAssignment } from "react-icons/md";
import { RiRobot2Fill } from "react-icons/ri";
import Navbar from "./Navbar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODE_LABELS = {
  technical: "Technical",
  hr: "HR / Behavioral",
  system_design: "System Design",
  dsa: "DSA",
};

const MODE_COLORS = {
  technical: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", text: "#60a5fa" },
  hr: { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.25)", text: "#c084fc" },
  system_design: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#fbbf24" },
  dsa: { bg: "rgba(20,184,166,0.1)", border: "rgba(20,184,166,0.25)", text: "#2dd4bf" },
};

const getScoreColor = (score) => {
  if (score >= 8) return { text: "#4ade80", glow: "rgba(74,222,128,0.3)" };
  if (score >= 6) return { text: "#60a5fa", glow: "rgba(96,165,250,0.3)" };
  if (score >= 4) return { text: "#fbbf24", glow: "rgba(251,191,36,0.3)" };
  return { text: "#f87171", glow: "rgba(248,113,113,0.3)" };
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
};

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 64 }) {
  const total = 10;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(score / total, 1));
  const offset = circumference * (1 - pct);
  const { text, glow } = getScoreColor(score);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{
          position: "absolute", inset: -3, borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={text} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px ${text})` }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "15px", fontWeight: 700, color: text, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "9px", color: "#4b5563", marginTop: "1px" }}>/10</span>
      </div>
    </div>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: "11px", color: "#6b7280" }}>{label}</span>
        <span style={{ fontSize: "11px", fontWeight: 600, color }}>{value}/10</span>
      </div>
      <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          style={{ height: "100%", borderRadius: "2px", background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

// ─── Interview Card ───────────────────────────────────────────────────────────

function InterviewCard({ interview, index }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const modeKey = interview.mode?.toLowerCase();
  const modeStyle = MODE_COLORS[modeKey] || MODE_COLORS.technical;
  const modeLabel = MODE_LABELS[modeKey] || interview.mode || "Interview";
  const isCompleted = interview.status === "Completed";
  const score = interview.finalScore || 0;
  const { text: scoreColor } = getScoreColor(score);

  const answeredQs = interview.questions?.filter((q) => q.answer && q.answer.trim()).length || 0;
  const totalQs = interview.questions?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
    >
      {/* ── Card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(8,12,24,0.85)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
      >
        {/* Top bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: index * 0.07 + 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 2,
            background: isCompleted
              ? "linear-gradient(90deg, #16a34a, #4ade80)"
              : "linear-gradient(90deg, #6b7280, #9ca3af)",
            transformOrigin: "left",
          }}
        />

        <div className="p-6">
          {/* ── Header row ── */}
          <div className="flex items-start gap-4">

            {/* Score ring */}
            <div className="flex flex-col items-center gap-1">
              <ScoreRing score={score} size={64} />
              <span style={{ fontSize: "10px", color: "#4b5563" }}>Score</span>
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="text-white font-bold text-base leading-tight">{interview.role || "Unknown Role"}</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: modeStyle.bg, border: `1px solid ${modeStyle.border}`, color: modeStyle.text }}
                >
                  {modeLabel}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"
                  style={{
                    background: isCompleted ? "rgba(34,197,94,0.08)" : "rgba(107,114,128,0.1)",
                    border: `1px solid ${isCompleted ? "rgba(34,197,94,0.25)" : "rgba(107,114,128,0.2)"}`,
                    color: isCompleted ? "#4ade80" : "#9ca3af",
                  }}
                >
                  {isCompleted ? <FaCheckCircle className="text-xs" /> : <FaTimesCircle className="text-xs" />}
                  {interview.status}
                </span>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <FaBriefcase style={{ color: "#4b5563", fontSize: "11px" }} />
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>Exp: {interview.experience || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MdOutlineAssignment style={{ color: "#4b5563", fontSize: "13px" }} />
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>{answeredQs}/{totalQs} answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaRegCalendarAlt style={{ color: "#4b5563", fontSize: "11px" }} />
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>{formatDate(interview.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaClock style={{ color: "#4b5563", fontSize: "11px" }} />
                  <span style={{ color: "#6b7280", fontSize: "12px" }}>{formatTime(interview.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Stats — right */}
            {isCompleted && (
              <div className="hidden lg:flex flex-col gap-2 w-36 flex-shrink-0">
                <StatBar label="Confidence" value={
                  +(interview.questions?.reduce((s, q) => s + (q.confidence || 0), 0) / (totalQs || 1)).toFixed(1)
                } color="#60a5fa" />
                <StatBar label="Communication" value={
                  +(interview.questions?.reduce((s, q) => s + (q.communication || 0), 0) / (totalQs || 1)).toFixed(1)
                } color="#c084fc" />
                <StatBar label="Correctness" value={
                  +(interview.questions?.reduce((s, q) => s + (q.correctness || 0), 0) / (totalQs || 1)).toFixed(1)
                } color="#4ade80" />
              </div>
            )}

            {/* Expand toggle */}
            {isCompleted && totalQs > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: expanded ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${expanded ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: expanded ? "#60a5fa" : "#6b7280",
                  cursor: "pointer", flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.22 }}>
                  <FaArrowRight style={{ fontSize: "12px" }} />
                </motion.span>
              </button>
            )}
          </div>

          {/* ── Action buttons row ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.4 }}
            className="flex items-center gap-2 mt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}
          >
            {isCompleted ? (
              /* Completed → See Full Report + expand toggle label */
              <>
                <button
                  onClick={() => navigate(`/interview-report/${interview._id}`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff", cursor: "pointer", border: "none",
                    boxShadow: "0 0 14px rgba(37,99,235,0.3)",
                    transition: "box-shadow 0.2s, transform 0.1s",
                    transform: "translateZ(0)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 22px rgba(37,99,235,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 14px rgba(37,99,235,0.3)"; }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97) translateZ(0)"; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = "translateZ(0)"; }}
                >
                  {/* shimmer */}
                  <motion.div
                    initial={{ x: "-100%" }} animate={{ x: "200%" }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", repeatDelay: 1.5 }}
                    style={{
                      position: "absolute", top: 0, bottom: 0, width: "35%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                      pointerEvents: "none",
                    }}
                  />
                  <FaFileAlt style={{ fontSize: "11px" }} />
                  See Full Report
                  <FaArrowRight style={{ fontSize: "10px" }} />
                </button>

                {totalQs > 0 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: expanded ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${expanded ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.08)"}`,
                      color: expanded ? "#60a5fa" : "#6b7280",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    <motion.span animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.22 }}
                      style={{ display: "inline-flex" }}>
                      <FaArrowRight style={{ fontSize: "10px" }} />
                    </motion.span>
                    {expanded ? "Hide Breakdown" : "View Breakdown"}
                  </button>
                )}
              </>
            ) : (
              /* Incomplete → Complete Interview button */
              <button
                onClick={() => navigate(`/interview-report/${interview._id}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold relative overflow-hidden"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#4ade80", cursor: "pointer",
                  transition: "all 0.2s", transform: "translateZ(0)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(34,197,94,0.18)";
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(34,197,94,0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(34,197,94,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97) translateZ(0)"; }}
                onMouseUp={(e) => { e.currentTarget.style.transform = "translateZ(0)"; }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  style={{ display: "inline-flex" }}
                >
                  <FaPlay style={{ fontSize: "10px" }} />
                </motion.div>
                Complete Interview
                <FaArrowRight style={{ fontSize: "10px" }} />
              </button>
            )}
          </motion.div>

          {/* ── Expanded: Q&A breakdown ── */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "20px 0" }} />
                <p style={{ color: "#6b7280", fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
                  Question-wise Breakdown
                </p>
                <div className="space-y-3">
                  {interview.questions.map((q, qi) => (
                    <motion.div
                      key={qi}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: qi * 0.06, duration: 0.35 }}
                      className="rounded-xl p-4"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Q number */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}
                        >
                          {qi + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ color: "#e5e7eb", fontSize: "13px", fontWeight: 500, marginBottom: "6px", lineHeight: 1.5 }}>
                            {q.question}
                          </p>
                          {q.answer && q.answer.trim() ? (
                            <p style={{ color: "#6b7280", fontSize: "12px", lineHeight: 1.6, marginBottom: "8px" }}>
                              <span style={{ color: "#4b5563" }}>Answer: </span>{q.answer}
                            </p>
                          ) : (
                            <p style={{ color: "#374151", fontSize: "12px", fontStyle: "italic", marginBottom: "8px" }}>No answer provided</p>
                          )}
                          {q.feedback && (
                            <div
                              className="flex items-start gap-2 px-3 py-2 rounded-lg"
                              style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}
                            >
                              <FaStar style={{ color: "#4ade80", fontSize: "11px", flexShrink: 0, marginTop: "2px" }} />
                              <p style={{ color: "#86efac", fontSize: "12px", lineHeight: 1.5 }}>{q.feedback}</p>
                            </div>
                          )}
                        </div>
                        {/* Per-Q score */}
                        {q.score !== undefined && (
                          <div className="text-center flex-shrink-0">
                            <div style={{ fontSize: "18px", fontWeight: 700, color: getScoreColor(q.score).text }}>{q.score}</div>
                            <div style={{ fontSize: "10px", color: "#4b5563" }}>/10</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── InterviewHistory ─────────────────────────────────────────────────────────

function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMode, setFilterMode] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const getInterviews = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true });
        setInterviews(result.data?.interview || result.data || []);
      } catch (err) {
        console.error("getInterviews Error", err);
      } finally {
        setLoading(false);
      }
    };
    getInterviews();
  }, []);

  // ── Filter + search ──
  const filtered = interviews.filter((iv) => {
    const matchSearch = !search.trim() ||
      (iv.role || "").toLowerCase().includes(search.toLowerCase()) ||
      (iv.mode || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || iv.status?.toLowerCase() === filterStatus.toLowerCase();
    const matchMode = filterMode === "all" || iv.mode?.toLowerCase() === filterMode.toLowerCase();
    return matchSearch && matchStatus && matchMode;
  });

  const completed = interviews.filter((iv) => iv.status === "Completed");
  const avgScore = completed.length
    ? (completed.reduce((s, iv) => s + (iv.finalScore || 0), 0) / completed.length).toFixed(1)
    : 0;

  // ─── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)" }}>
        <div className="max-w-5xl mx-auto px-6 py-16 pr-20">
          <div className="mb-10">
            <div className="h-8 w-56 rounded-xl mb-3" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-4 w-80 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-6 mb-4" style={{ background: "rgba(8,12,24,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="h-3 w-64 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="h-3 w-40 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)", position: "relative", overflow: "hidden" }}>
      <Navbar/>

      {/* Ambient orbs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.07 }} transition={{ duration: 2 }}
        style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#1d4ed8", filter: "blur(130px)", top: "-10%", left: "-5%", pointerEvents: "none" }}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.05 }} transition={{ duration: 2, delay: 0.3 }}
        style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#2563eb", filter: "blur(110px)", bottom: "0", right: "5%", pointerEvents: "none" }}
      />
      {/* Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.025 }} transition={{ duration: 2 }}
        style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="max-w-5xl mx-auto px-6 py-14 pr-20" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
              <HiSparkles className="text-blue-400 text-sm" />
            </motion.div>
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">Interview History</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Your{" "}
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Past Interviews
            </span>
          </h1>
          <p className="text-gray-500 text-sm">Track your progress and review detailed question-by-question feedback.</p>
        </motion.div>

        {/* ── Summary stats ── */}
        {interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: "Total Interviews", value: interviews.length, color: "#60a5fa", icon: <RiRobot2Fill /> },
              { label: "Completed", value: completed.length, color: "#4ade80", icon: <FaCheckCircle /> },
              { label: "Avg Score", value: `${avgScore}/10`, color: getScoreColor(parseFloat(avgScore)).text, icon: <FaStar /> },
              { label: "In Progress", value: interviews.length - completed.length, color: "#fbbf24", icon: <FaChartLine /> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.4 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(8,12,24,0.85)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <span style={{ color: "#6b7280", fontSize: "11px" }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: stat.color, fontVariantNumeric: "tabular-nums" }}>
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex items-center gap-3 mb-6 flex-wrap"
        >
          {/* Search */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", minWidth: "200px" }}
          >
            <FaSearch style={{ color: "#4b5563", fontSize: "12px", flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by role or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: "transparent", outline: "none", border: "none", color: "white", fontSize: "13px", width: "100%" }}
              className="placeholder-gray-700"
            />
          </div>

          {/* Status filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["all", "Completed", "Incompleted"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s === "all" ? "all" : s)}
                style={{
                  padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                  background: filterStatus === s || (filterStatus === "all" && s === "all") ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${filterStatus === s || (filterStatus === "all" && s === "all") ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                  color: filterStatus === s || (filterStatus === "all" && s === "all") ? "#60a5fa" : "#6b7280",
                  transition: "all 0.15s",
                }}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Mode filter */}
          <div style={{ display: "flex", gap: "6px" }}>
            {["all", "technical", "hr", "system_design", "dsa"].map((m) => {
              const c = MODE_COLORS[m] || { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", text: "#6b7280" };
              const active = filterMode === m;
              return (
                <button
                  key={m}
                  onClick={() => setFilterMode(m)}
                  style={{
                    padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: 500, cursor: "pointer",
                    background: active ? c.bg : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? c.border : "rgba(255,255,255,0.08)"}`,
                    color: active ? c.text : "#6b7280",
                    transition: "all 0.15s",
                  }}
                >
                  {m === "all" ? "All Modes" : MODE_LABELS[m]}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        {interviews.length > 0 && (
          <p style={{ color: "#4b5563", fontSize: "12px", marginBottom: "16px" }}>
            Showing <span style={{ color: "#9ca3af" }}>{filtered.length}</span> of <span style={{ color: "#9ca3af" }}>{interviews.length}</span> interviews
          </p>
        )}

        {/* ── Interview cards ── */}
        <AnimatePresence>
          {filtered.length > 0 ? (
            <div className="space-y-4">
              {filtered.map((iv, i) => (
                <InterviewCard key={iv._id} interview={iv} index={i} />
              ))}
            </div>
          ) : !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}
              >
                <RiRobot2Fill className="text-blue-400 text-2xl" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {interviews.length === 0 ? "No interviews yet" : "No results found"}
              </h3>
              <p className="text-gray-600 text-sm mb-6 max-w-xs">
                {interviews.length === 0
                  ? "Start your first AI interview to see your history here."
                  : "Try adjusting your search or filter."}
              </p>
              {interviews.length === 0 && (
                <button
                  onClick={() => navigate("/interview")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    boxShadow: "0 0 20px rgba(37,99,235,0.3)",
                  }}
                >
                  Start Interview <FaArrowRight className="text-xs" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default InterviewHistory;