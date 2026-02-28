import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserTie,
  FaMicrophone,
  FaChartLine,
  FaArrowRight,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaSpinner,
  FaFileAlt,
  FaCode,
  FaBriefcase,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdWork, MdTimer } from "react-icons/md";
import { ServerUrl } from "../App";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

// ─── Variants ─────────────────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: <FaUserTie />,
    label: "Choose Role & Experience",
    desc: "Tailored questions for your level",
  },
  {
    icon: <FaMicrophone />,
    label: "Smart Voice Interview",
    desc: "Answer naturally with your mic",
  },
  {
    icon: <FaChartLine />,
    label: "Performance Analytics",
    desc: "Detailed scores and insights",
  },
];

const interviewTypes = [
  { value: "technical", label: "Technical Interview" },
  { value: "hr", label: "HR / Behavioral" },
  { value: "system_design", label: "System Design" },
  { value: "dsa", label: "Data Structures & Algorithms" },
];

// ─── Floating Input ───────────────────────────────────────────────────────────

function FloatingInput({ icon, placeholder, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 16px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${focused ? "rgba(59,130,246,0.55)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.07)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      <span
        style={{
          color: focused ? "#60a5fa" : "#4b5563",
          transition: "color 0.2s",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "transparent",
          outline: "none",
          color: "white",
          fontSize: "14px",
          width: "100%",
          border: "none",
        }}
        className="placeholder-gray-600"
      />
    </div>
  );
}

// ─── Step1SetUp ───────────────────────────────────────────────────────────────

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [interviewType, setInterviewType] = useState("Technical Interview");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const fileRef = useRef(null);

  const canStart = role.trim() && experience.trim();
  const selectedType = interviewTypes.find((t) => t.value === interviewType);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setResumeFile(file);
      setResumeAnalysis(null);
    }
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setResumeAnalysis(null);
  };

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/resume-analysis",
        formData,
        { withCredentials: true },
      );
      setResumeAnalysis(result.data);
      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
    } catch (error) {
      console.log("Upload resume error:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartInterview = async () => {
    if (!canStart || loading) return;
    setLoading(true);
    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/generate-questions",
        { role, experience, mode: interviewType, projects, skills, resumeText },
        { withCredentials: true },
      );
      if (userData)
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      onStart(result.data);
    } catch (error) {
      console.log(
        "Start interview error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 pr-20">
      {/*
        KEY FIX: items-start so the left column stays pinned at the top
        and does NOT recentre itself when the right column grows.
      */}
      <div className="grid lg:grid-cols-2 gap-14 items-start">
        {/* ── LEFT — sticky so it never moves on scroll ── */}
        <div style={{ position: "sticky", top: "96px" }}>
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-7"
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
              Step 1 of 3 · Interview Setup
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-4xl lg:text-5xl font-bold leading-tight mb-5"
            >
              Start Your{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Interview
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm"
            >
              Practice real interview scenarios powered by AI. Improve
              communication, technical skills, and confidence.
            </motion.p>

            <div className="space-y-3">
              {features.map(({ icon, label, desc }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.4 + i * 0.13,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-400 flex-shrink-0"
                    style={{
                      background: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium">{label}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                  </div>
                  <motion.div
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.2,
                      delay: i * 0.5,
                    }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT — Form card ── */}
        <motion.div
          initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{
              background: "rgba(8,12,24,0.85)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Top shimmer line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.35,
              }}
              style={{
                height: 2,
                background: "linear-gradient(90deg, #2563eb, #60a5fa, #2563eb)",
                borderRadius: 2,
                marginBottom: "1.75rem",
                transformOrigin: "left",
              }}
            />

            <h2 className="text-xl font-bold text-white mb-1">
              Interview Setup
            </h2>
            <p className="text-gray-500 text-sm mb-7">
              Configure your session to get started
            </p>

            <div className="space-y-5">
              {/* Job Role */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block font-medium">
                  Job Role
                </label>
                <FloatingInput
                  icon={<MdWork size={16} />}
                  placeholder="e.g. Frontend Developer, Data Scientist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </motion.div>

              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block font-medium">
                  Experience Level
                </label>
                <FloatingInput
                  icon={<MdTimer size={16} />}
                  placeholder="e.g. Fresher, 2 years, 5+ years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </motion.div>

              {/* Interview Type */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block font-medium">
                  Interview Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => setSelectOpen(!selectOpen)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${selectOpen ? "rgba(59,130,246,0.55)" : "rgba(255,255,255,0.08)"}`,
                      color: "#e5e7eb",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <span>{selectedType?.label}</span>
                    <motion.span
                      animate={{ rotate: selectOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: "#6b7280", fontSize: "11px" }}
                    >
                      ▾
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {selectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden shadow-2xl z-50"
                        style={{
                          background: "#090f1a",
                          border: "1px solid rgba(255,255,255,0.09)",
                        }}
                      >
                        {interviewTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setInterviewType(type.value);
                              setSelectOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-blue-500/10 transition-colors"
                            style={{
                              color:
                                type.value === interviewType
                                  ? "#60a5fa"
                                  : "#9ca3af",
                            }}
                          >
                            {type.label}
                            {type.value === interviewType && (
                              <FaCheckCircle className="text-blue-400 text-xs" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Resume upload */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block font-medium">
                  Resume{" "}
                  <span className="normal-case text-gray-600">
                    (Optional · PDF)
                  </span>
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: `1.5px dashed ${dragging ? "rgba(59,130,246,0.65)" : resumeFile ? "rgba(34,197,94,0.45)" : "rgba(255,255,255,0.08)"}`,
                    background: dragging
                      ? "rgba(59,130,246,0.05)"
                      : resumeFile
                        ? "rgba(34,197,94,0.03)"
                        : "rgba(255,255,255,0.02)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <AnimatePresence mode="wait">
                    {resumeFile ? (
                      /* ── File uploaded ── */
                      <motion.div
                        key="uploaded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="p-5"
                      >
                        {/* File info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "rgba(34,197,94,0.1)",
                              border: "1px solid rgba(34,197,94,0.2)",
                            }}
                          >
                            <FaFileAlt className="text-green-400 text-sm" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-green-400 text-sm font-medium truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-gray-600 text-xs mt-0.5">
                              {(resumeFile.size / 1024).toFixed(1)} KB · PDF
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setResumeFile(null);
                              setResumeAnalysis(null);
                            }}
                            className="text-gray-600 hover:text-red-400 text-xs px-2 py-1 rounded-lg flex-shrink-0 transition-colors"
                            style={{ background: "rgba(255,255,255,0.04)" }}
                          >
                            ✕ Remove
                          </button>
                        </div>

                        {/* Analyze btn → Results (no layout shift: both same height structure) */}
                        <AnimatePresence mode="wait">
                          {!resumeAnalysis ? (
                            <motion.button
                              key="analyze-btn"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              onClick={handleUploadResume}
                              disabled={analyzing}
                              className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 relative overflow-hidden"
                              style={{
                                background: "rgba(59,130,246,0.12)",
                                border: "1px solid rgba(59,130,246,0.28)",
                                color: "#60a5fa",
                                cursor: analyzing ? "not-allowed" : "pointer",
                              }}
                            >
                              {analyzing ? (
                                <>
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 0.8,
                                      ease: "linear",
                                    }}
                                    style={{ display: "inline-flex" }}
                                  >
                                    <FaSpinner />
                                  </motion.span>
                                  Analyzing Resume...
                                </>
                              ) : (
                                <>
                                  <HiSparkles />
                                  Analyze Resume
                                  <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "200%" }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2.2,
                                      ease: "easeInOut",
                                      repeatDelay: 1.2,
                                    }}
                                    style={{
                                      position: "absolute",
                                      top: 0,
                                      bottom: 0,
                                      width: "35%",
                                      background:
                                        "linear-gradient(90deg, transparent, rgba(96,165,250,0.1), transparent)",
                                      pointerEvents: "none",
                                    }}
                                  />
                                </>
                              )}
                            </motion.button>
                          ) : (
                            /* ── Results panel ── */
                            <motion.div
                              key="results"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="rounded-xl p-4"
                              style={{
                                background: "rgba(59,130,246,0.05)",
                                border: "1px solid rgba(59,130,246,0.14)",
                              }}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 2,
                                    }}
                                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                  />
                                  <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">
                                    Analysis Result
                                  </span>
                                </div>
                                <button
                                  onClick={handleUploadResume}
                                  className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
                                >
                                  Re-analyze
                                </button>
                              </div>

                              {/* Projects */}
                              {resumeAnalysis.projects?.length > 0 && (
                                <div className="mb-3">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <FaBriefcase className="text-gray-600 text-xs" />
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                                      Projects
                                    </span>
                                  </div>
                                  <ul className="space-y-1">
                                    {resumeAnalysis.projects.map((p, i) => (
                                      <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                        className="flex items-center gap-2 text-gray-300 text-xs"
                                      >
                                        <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                                        {p}
                                      </motion.li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {resumeAnalysis.projects?.length > 0 &&
                                resumeAnalysis.skills?.length > 0 && (
                                  <div
                                    style={{
                                      height: 1,
                                      background: "rgba(255,255,255,0.05)",
                                      margin: "8px 0",
                                    }}
                                  />
                                )}

                              {/* Skills */}
                              {resumeAnalysis.skills?.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <FaCode className="text-gray-600 text-xs" />
                                    <span className="text-gray-500 text-xs uppercase tracking-wider">
                                      Skills
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {resumeAnalysis.skills.map((skill, i) => (
                                      <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                          delay: i * 0.05,
                                          type: "spring",
                                          stiffness: 280,
                                        }}
                                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                                        style={{
                                          background: "rgba(59,130,246,0.1)",
                                          border:
                                            "1px solid rgba(59,130,246,0.2)",
                                          color: "#93c5fd",
                                        }}
                                      >
                                        {skill}
                                      </motion.span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ) : (
                      /* ── Empty drop zone ── */
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={() => fileRef.current?.click()}
                        className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer"
                      >
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2.2,
                            ease: "easeInOut",
                          }}
                        >
                          <FaCloudUploadAlt className="text-blue-400 text-3xl" />
                        </motion.div>
                        <p className="text-gray-400 text-sm">
                          Drop your resume or{" "}
                          <span className="text-blue-400">browse</span>
                        </p>
                        <p className="text-gray-600 text-xs">PDF up to 5MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Start Interview CTA ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="pt-1"
              >
                <button
                  onClick={handleStartInterview}
                  disabled={!canStart || loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-sm relative overflow-hidden"
                  style={{
                    background: canStart
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : "rgba(255,255,255,0.05)",
                    color: canStart ? "#fff" : "#4b5563",
                    cursor: !canStart || loading ? "not-allowed" : "pointer",
                    transition: "background 0.3s, color 0.3s, box-shadow 0.2s",
                    /* GPU-composite the button to prevent subpixel jitter */
                    transform: "translateZ(0)",
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    if (canStart && !loading)
                      e.currentTarget.style.boxShadow =
                        "0 0 28px rgba(59,130,246,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => {
                    if (canStart && !loading)
                      e.currentTarget.style.transform =
                        "scale(0.985) translateZ(0)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateZ(0)";
                  }}
                >
                  {/* Shimmer — only when idle + active */}
                  {canStart && !loading && (
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 2.5,
                        ease: "easeInOut",
                        repeatDelay: 1.5,
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        width: "40%",
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                        pointerEvents: "none",
                      }}
                    />
                  )}

                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: "linear",
                        }}
                        style={{ display: "inline-flex" }}
                      >
                        <FaSpinner className="text-sm" />
                      </motion.span>
                      Preparing Interview...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>

                {/*
                  Fixed-height container for the helper text.
                  This prevents the button from jumping when text appears/disappears.
                */}
                <div
                  style={{
                    height: "20px",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  {!canStart && (
                    <p className="text-gray-600 text-xs">
                      Fill in role and experience to continue
                    </p>
                  )}
                  {canStart && loading && (
                    <p className="text-gray-600 text-xs">
                      Preparing your interview...
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step1SetUp;
