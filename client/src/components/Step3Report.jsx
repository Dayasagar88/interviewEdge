import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaDownload,
  FaTrophy,
  FaRedo,
  FaStar,
  FaLightbulb,
  FaChartBar,
  FaHistory,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdOutlineAssignment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getScoreGrade = (score) => {
  if (score >= 9)
    return {
      label: "Outstanding",
      color: "#a78bfa",
      glow: "rgba(167,139,250,0.35)",
    };
  if (score >= 8)
    return {
      label: "Excellent",
      color: "#4ade80",
      glow: "rgba(74,222,128,0.35)",
    };
  if (score >= 7)
    return { label: "Good", color: "#60a5fa", glow: "rgba(96,165,250,0.35)" };
  if (score >= 5)
    return {
      label: "Average",
      color: "#fbbf24",
      glow: "rgba(251,191,36,0.35)",
    };
  if (score >= 3)
    return {
      label: "Needs Work",
      color: "#f97316",
      glow: "rgba(249,115,22,0.35)",
    };
  return { label: "Poor", color: "#f87171", glow: "rgba(248,113,113,0.35)" };
};

const MODE_MAP = {
  technical: "Technical",
  hr: "HR / Behavioral",
  system_design: "System Design",
  dsa: "DSA",
};

const formatDate = () =>
  new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 120, delay = 0 }) {
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(score / 10, 1)));
  const { color, glow } = getScoreGrade(score);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        style={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`${color}18`}
          strokeWidth={strokeWidth + 4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: delay + 0.6,
            type: "spring",
            stiffness: 200,
          }}
          style={{
            fontSize: size >= 120 ? "28px" : "18px",
            fontWeight: 800,
            color,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>
          /10
        </span>
      </div>
    </div>
  );
}

// ─── Horizontal Bar ───────────────────────────────────────────────────────────

function HBar({ label, value, color, delay = 0 }) {
  return (
    <div>
      {label ? (
        <div className="flex items-center justify-between mb-1.5">
          <span style={{ fontSize: "13px", color: "#d1d5db", fontWeight: 500 }}>
            {label}
          </span>
          <span style={{ fontSize: "13px", fontWeight: 700, color }}>
            {value}
            <span style={{ color: "#4b5563", fontWeight: 400 }}>/10</span>
          </span>
        </div>
      ) : null}
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
          style={{
            height: "100%",
            borderRadius: "4px",
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 10px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Radar Chart ─────────────────────────────────────────────────────────────

function RadarChart({ confidence, communication, correctness }) {
  const cx = 100,
    cy = 100,
    R = 70,
    N = 3;
  const labels = ["Confidence", "Communication", "Correctness"];
  const values = [confidence, communication, correctness];
  const colors = ["#60a5fa", "#c084fc", "#4ade80"];
  const angleOf = (i) => (Math.PI * 2 * i) / N - Math.PI / 2;
  const pt = (i, s) => ({
    x: cx + R * s * Math.cos(angleOf(i)),
    y: cy + R * s * Math.sin(angleOf(i)),
  });
  const polyPoints = values
    .map((v, i) => {
      const p = pt(i, v / 10);
      return `${p.x},${p.y}`;
    })
    .join(" ");
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {[2, 4, 6, 8, 10].map((lvl) =>
        Array.from({ length: N }).map((_, i) => {
          const a = pt(i, lvl / 10),
            b = pt((i + 1) % N, lvl / 10);
          return (
            <line
              key={`g-${lvl}-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        }),
      )}
      {Array.from({ length: N }).map((_, i) => {
        const p = pt(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}
      <motion.polygon
        points={polyPoints}
        fill="rgba(59,130,246,0.15)"
        stroke="#3b82f6"
        strokeWidth="1.5"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          filter: "drop-shadow(0 0 6px rgba(59,130,246,0.4))",
        }}
      />
      {values.map((v, i) => {
        const p = pt(i, v / 10);
        return (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={colors[i]}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.8 + i * 0.1,
              type: "spring",
              stiffness: 260,
            }}
            style={{ filter: `drop-shadow(0 0 4px ${colors[i]})` }}
          />
        );
      })}
      {labels.map((lbl, i) => {
        const p = pt(i, 1.28);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={colors[i]}
            fontSize="10"
            fontWeight="600"
          >
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const { color } = getScoreGrade(q.score || 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.05 * index,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(8,12,24,0.85)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base"
          style={{
            background: `${color}18`,
            border: `1px solid ${color}30`,
            color,
          }}
        >
          {q.score ?? 0}
        </div>
        <p className="flex-1 text-gray-200 text-sm font-medium text-left line-clamp-2 leading-relaxed">
          {q.question}
        </p>
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "#4b5563", fontSize: "12px", flexShrink: 0 }}
        >
          <FaArrowRight />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              className="px-5 py-4 space-y-3"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Confidence",
                    val: q.confidence || 0,
                    color: "#60a5fa",
                  },
                  {
                    label: "Communication",
                    val: q.communication || 0,
                    color: "#c084fc",
                  },
                  {
                    label: "Correctness",
                    val: q.correctness || 0,
                    color: "#4ade80",
                  },
                ].map(({ label, val, color: c }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3 text-center"
                    style={{ background: `${c}0d`, border: `1px solid ${c}22` }}
                  >
                    <div
                      style={{ fontSize: "18px", fontWeight: 700, color: c }}
                    >
                      {val}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#4b5563",
                        marginTop: "2px",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              {q.answer?.trim() ? (
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#4b5563",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Your Answer
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      lineHeight: 1.6,
                    }}
                  >
                    {q.answer}
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: "12px",
                    color: "#374151",
                    fontStyle: "italic",
                  }}
                >
                  No answer provided
                </p>
              )}
              {q.feedback && (
                <div
                  className="flex items-start gap-2 rounded-xl p-3"
                  style={{
                    background: "rgba(74,222,128,0.05)",
                    border: "1px solid rgba(74,222,128,0.18)",
                  }}
                >
                  <FaLightbulb
                    style={{
                      color: "#4ade80",
                      fontSize: "12px",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#86efac",
                      lineHeight: 1.5,
                    }}
                  >
                    {q.feedback}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Step3Report ──────────────────────────────────────────────────────────────

function Step3Report({ report, fromHistory = false }) {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const {
    finalScore = 0,
    avgConfidence = 0,
    avgCommunication = 0,
    avgCorrectness = 0,
    QuestionWiseScore = [],
  } = report || {};

  console.log(report)
  const grade = getScoreGrade(finalScore);
  const answeredCount = QuestionWiseScore.filter((q) =>
    q.answer?.trim(),
  ).length;

  console.log(answeredCount)
  const modeLabel = MODE_MAP[report?.mode?.toLowerCase()] || report?.mode || "";

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"),
        import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"),
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: "#020617",
        useCORS: true,
        logging: false,
      });
      const pdf = new jsPDF.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const W = pdf.internal.pageSize.getWidth(),
        H = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * W) / canvas.width;
      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, -y, W, imgH);
        y += H;
      }
      pdf.save(
        `InterviewEdge_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
    } catch {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const DownloadBtn = () => (
    <button
      onClick={handleDownload}
      disabled={downloading}
      style={{
        padding: "10px 18px",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 600,
        background: downloading
          ? "rgba(34,197,94,0.08)"
          : "linear-gradient(135deg, #16a34a, #15803d)",
        border: "1px solid rgba(34,197,94,0.3)",
        color: "#fff",
        cursor: downloading ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: downloading ? "none" : "0 0 14px rgba(22,163,74,0.28)",
        opacity: downloading ? 0.7 : 1,
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!downloading)
          e.currentTarget.style.boxShadow = "0 0 22px rgba(22,163,74,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = downloading
          ? "none"
          : "0 0 14px rgba(22,163,74,0.28)";
      }}
    >
      {downloading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          <FaDownload style={{ fontSize: "11px" }} />
        </motion.span>
      ) : (
        <FaDownload style={{ fontSize: "11px" }} />
      )}
      {downloading ? "Generating..." : "Download PDF"}
    </button>
  );

  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "transparent" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-12 pr-20">
        {/* ══════════════════════════════════════════════════════
            HEADER — switches based on fromHistory prop
        ══════════════════════════════════════════════════════ */}

        {fromHistory ? (
          /* ─────────────────────────────────────────────────
             HISTORY VIEW — role name, back arrow, badges
          ───────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-8"
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={() => navigate("/interview-history")}
                className="flex items-center gap-1.5"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#6b7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#60a5fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                }}
              >
                <FaHistory style={{ fontSize: "11px" }} /> Interview History
              </button>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4.5 9L7.5 6L4.5 3"
                  stroke="#374151"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ fontSize: "12px", color: "#4b5563" }}>Report</span>
            </div>

            {/* Main header row */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              {/* Left: back btn + title info */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/interview-history")}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    color: "#6b7280",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
                    e.currentTarget.style.color = "#60a5fa";
                    e.currentTarget.style.background = "rgba(59,130,246,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.09)";
                    e.currentTarget.style.color = "#6b7280";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M9 11L5 7L9 3"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 3,
                        ease: "linear",
                      }}
                    >
                      <HiSparkles className="text-blue-400 text-xs" />
                    </motion.div>
                    <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">
                      Interview Report
                    </span>
                  </div>

                  {/* Role + badges */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h1
                      className="text-2xl font-bold"
                      style={{ lineHeight: 1.2 }}
                    >
                      {report?.role || "Interview"}{" "}
                      <span
                        style={{
                          background:
                            "linear-gradient(90deg, #60a5fa, #3b82f6)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Report
                      </span>
                    </h1>
                    {modeLabel && (
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: "rgba(59,130,246,0.1)",
                          border: "1px solid rgba(59,130,246,0.25)",
                          color: "#60a5fa",
                        }}
                      >
                        {modeLabel}
                      </span>
                    )}
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{
                        background: `${grade.color}14`,
                        border: `1px solid ${grade.color}32`,
                        color: grade.color,
                      }}
                    >
                      {grade.label}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-bold"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: grade.color,
                      }}
                    >
                      {finalScore}/10
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {report?.experience && (
                      <span style={{ fontSize: "12px", color: "#4b5563" }}>
                        Exp:{" "}
                        <span style={{ color: "#6b7280" }}>
                          {report.experience}
                        </span>
                      </span>
                    )}
                    <span style={{ fontSize: "12px", color: "#4b5563" }}>
                      {answeredCount}/{QuestionWiseScore.length} answered
                    </span>
                    {report?.createdAt && (
                      <span style={{ fontSize: "12px", color: "#4b5563" }}>
                        {new Date(report.createdAt).toLocaleDateString(
                          "en-US",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate("/interview")}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.28)",
                    color: "#60a5fa",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59,130,246,0.1)";
                  }}
                >
                  <FaRedo style={{ fontSize: "10px" }} /> New Interview
                </button>
                <DownloadBtn />
              </div>
            </div>

            {/* Blue accent divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(59,130,246,0.45), rgba(59,130,246,0.06), transparent)",
                marginTop: "22px",
                transformOrigin: "left",
              }}
            />
          </motion.div>
        ) : (
          /* ─────────────────────────────────────────────────
             POST-INTERVIEW — "Step 3 · Interview Complete!"
          ───────────────────────────────────────────────── */
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                  <HiSparkles className="text-green-400 text-sm" />
                </motion.div>
                <span className="text-green-400 text-xs font-semibold uppercase tracking-widest">
                  Step 3 of 3 · Interview Report
                </span>
              </div>
              <h1 className="text-3xl font-bold">
                Interview{" "}
                <span
                  style={{
                    background: "linear-gradient(90deg, #4ade80, #22c55e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Complete!
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/home")}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#9ca3af",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#9ca3af";
                }}
              >
                Home
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#60a5fa",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FaRedo style={{ fontSize: "11px" }} /> New Interview
              </button>
              <DownloadBtn />
            </div>
          </motion.div>
        )}

        {/* ══ PRINTABLE REPORT BODY ══════════════════════════ */}
        <div ref={reportRef}>
          {/* Hero score card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl p-8 mb-6 relative overflow-hidden"
            style={{
              background: "rgba(8,12,24,0.9)",
              border: `1px solid ${grade.color}30`,
              backdropFilter: "blur(20px)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                background: `radial-gradient(ellipse at 30% 50%, ${grade.color}, transparent 60%)`,
                pointerEvents: "none",
              }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: 2,
                background: `linear-gradient(90deg, ${grade.color}, ${grade.color}44)`,
                borderRadius: 2,
                marginBottom: "24px",
                transformOrigin: "left",
              }}
            />
            <div className="flex items-center gap-8 flex-wrap">
              <ScoreRing score={finalScore} size={130} delay={0.3} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FaTrophy style={{ color: grade.color, fontSize: "18px" }} />
                  <span
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      color: grade.color,
                    }}
                  >
                    {grade.label}
                  </span>
                </div>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  You answered{" "}
                  <span style={{ color: "#fff", fontWeight: 600 }}>
                    {answeredCount}
                  </span>{" "}
                  of{" "}
                  <span style={{ color: "#fff", fontWeight: 600 }}>
                    {QuestionWiseScore.length}
                  </span>{" "}
                  questions · {formatDate()}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {
                      label: "Confidence",
                      val: avgConfidence,
                      color: "#60a5fa",
                    },
                    {
                      label: "Communication",
                      val: avgCommunication,
                      color: "#c084fc",
                    },
                    {
                      label: "Correctness",
                      val: avgCorrectness,
                      color: "#4ade80",
                    },
                  ].map(({ label, val, color: c }) => (
                    <div
                      key={label}
                      className="px-3 py-1.5 rounded-lg flex items-center gap-2"
                      style={{
                        background: `${c}12`,
                        border: `1px solid ${c}28`,
                      }}
                    >
                      <span
                        style={{ fontSize: "13px", fontWeight: 700, color: c }}
                      >
                        {val}
                      </span>
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <RadarChart
                confidence={avgConfidence}
                communication={avgCommunication}
                correctness={avgCorrectness}
              />
            </div>
          </motion.div>

          {/* 3 metric rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {[
              { label: "Confidence", score: avgConfidence, color: "#60a5fa" },
              {
                label: "Communication",
                score: avgCommunication,
                color: "#c084fc",
              },
              { label: "Correctness", score: avgCorrectness, color: "#4ade80" },
            ].map(({ label, score, color: c }, i) => (
              <div
                key={label}
                className="rounded-2xl p-5 flex flex-col items-center gap-3"
                style={{
                  background: "rgba(8,12,24,0.85)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <ScoreRing score={score} size={80} delay={0.3 + i * 0.12} />
                <div className="text-center">
                  <p style={{ fontSize: "13px", fontWeight: 600, color: c }}>
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#4b5563",
                      marginTop: "2px",
                    }}
                  >
                    {score >= 8
                      ? "Excellent"
                      : score >= 6
                        ? "Good"
                        : score >= 4
                          ? "Average"
                          : "Needs Work"}
                  </p>
                </div>
                <HBar value={score} color={c} delay={0.5 + i * 0.1} />
              </div>
            ))}
          </motion.div>

          {/* Performance bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl p-6 mb-6"
            style={{
              background: "rgba(8,12,24,0.85)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <FaChartBar className="text-blue-400 text-sm" />
              <span className="text-white font-semibold text-base">
                Performance Overview
              </span>
            </div>
            <div className="space-y-4">
              <HBar
                label="Confidence"
                value={avgConfidence}
                color="#60a5fa"
                delay={0.4}
              />
              <HBar
                label="Communication"
                value={avgCommunication}
                color="#c084fc"
                delay={0.5}
              />
              <HBar
                label="Correctness"
                value={avgCorrectness}
                color="#4ade80"
                delay={0.6}
              />
              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                  margin: "8px 0",
                }}
              />
              <HBar
                label="Overall Score"
                value={finalScore}
                color={grade.color}
                delay={0.7}
              />
            </div>
          </motion.div>

          {/* Q&A Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MdOutlineAssignment className="text-blue-400 text-base" />
              <span className="text-white font-semibold text-base">
                Question-wise Breakdown
              </span>
              <span className="ml-auto text-gray-600 text-xs">
                {QuestionWiseScore.length} questions
              </span>
            </div>
            <div className="space-y-3">
              {QuestionWiseScore.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 rounded-2xl px-6 py-4 flex items-center gap-3"
            style={{
              background: "rgba(59,130,246,0.05)",
              border: "1px solid rgba(59,130,246,0.12)",
            }}
          >
            <FaStar
              style={{ color: "#60a5fa", fontSize: "14px", flexShrink: 0 }}
            />
            <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.5 }}>
              Generated by{" "}
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>
                InterviewEdge AI
              </span>{" "}
              · Keep practicing to improve your score. Each interview makes you
              stronger.
            </p>
          </motion.div>
        </div>

        {/* Bottom action row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex gap-3 mt-8 justify-center"
        >
          <button
            onClick={() => navigate("/interview-history")}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9ca3af",
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            {fromHistory ? "← Back to History" : "View History"}
          </button>
          <button
            onClick={() =>
              fromHistory ? navigate("/interview") : window.location.reload()
            }
            style={{
              padding: "12px 28px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 0 20px rgba(37,99,235,0.35)",
              border: "none",
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(37,99,235,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(37,99,235,0.35)";
            }}
          >
            <FaRedo style={{ fontSize: "12px" }} />{" "}
            {fromHistory ? "New Interview" : "Practice Again"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Step3Report;
