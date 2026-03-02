import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ServerUrl } from "../App";
import Step3Report from "./Step3Report";
import { RiRobot2Fill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import Navbar from "./Navbar";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ w, h, radius = "10px", delay = 0 }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay }}
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: "rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}
    />
  );
}

function LoadingState() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#1d4ed8",
          filter: "blur(130px)",
          top: "-10%",
          left: "-5%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "#2563eb",
          filter: "blur(110px)",
          bottom: "0",
          right: "5%",
          pointerEvents: "none",
        }}
      />
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        className="max-w-4xl mx-auto px-6 py-12 pr-20"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <Skeleton w="160px" h="14px" delay={0} />
            <Skeleton w="260px" h="32px" delay={0.05} />
          </div>
          <div className="flex gap-3">
            <Skeleton w="80px" h="40px" radius="12px" delay={0.1} />
            <Skeleton w="120px" h="40px" radius="12px" delay={0.15} />
            <Skeleton w="140px" h="40px" radius="12px" delay={0.2} />
          </div>
        </div>

        {/* Hero card skeleton */}
        <div
          className="rounded-2xl p-8 mb-6"
          style={{
            background: "rgba(8,12,24,0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Skeleton w="100%" h="2px" radius="2px" delay={0} />
          <div className="flex items-center gap-8 mt-6">
            <Skeleton w="130px" h="130px" radius="50%" delay={0.1} />
            <div className="flex-1 space-y-3">
              <Skeleton w="180px" h="28px" delay={0.15} />
              <Skeleton w="260px" h="16px" delay={0.2} />
              <div className="flex gap-2">
                <Skeleton w="100px" h="30px" radius="8px" delay={0.25} />
                <Skeleton w="120px" h="30px" radius="8px" delay={0.3} />
                <Skeleton w="110px" h="30px" radius="8px" delay={0.35} />
              </div>
            </div>
            <Skeleton w="200px" h="200px" radius="50%" delay={0.2} />
          </div>
        </div>

        {/* 3 metric cards skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-5 flex flex-col items-center gap-3"
              style={{
                background: "rgba(8,12,24,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Skeleton w="80px" h="80px" radius="50%" delay={0.1 * i} />
              <Skeleton w="90px" h="14px" delay={0.1 * i + 0.05} />
              <Skeleton w="100%" h="8px" radius="4px" delay={0.1 * i + 0.1} />
            </div>
          ))}
        </div>

        {/* Bars card skeleton */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(8,12,24,0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <Skeleton w="180px" h="20px" delay={0} />
          <div className="space-y-4 mt-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton w="100px" h="13px" delay={0.05 * i} />
                  <Skeleton w="40px" h="13px" delay={0.05 * i} />
                </div>
                <Skeleton
                  w="100%"
                  h="8px"
                  radius="4px"
                  delay={0.05 * i + 0.05}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Q cards skeleton */}
        <Skeleton w="200px" h="20px" delay={0} />
        <div className="space-y-3 mt-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{
                background: "rgba(8,12,24,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <Skeleton w="40px" h="40px" radius="12px" delay={0.07 * i} />
              <div className="flex-1 space-y-2">
                <Skeleton w="100%" h="13px" delay={0.07 * i + 0.03} />
                <Skeleton w="70%" h="13px" delay={0.07 * i + 0.06} />
              </div>
              <Skeleton w="14px" h="14px" radius="4px" delay={0.07 * i} />
            </div>
          ))}
        </div>

        {/* Loading label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center mt-12 gap-4"
        >
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
              boxShadow: "0 0 20px rgba(37,99,235,0.3)",
            }}
          >
            <RiRobot2Fill className="text-blue-400 text-xl" />
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <HiSparkles className="text-blue-400 text-sm" />
            </motion.div>
            <span className="text-gray-500 text-sm font-medium">
              Loading your interview report...
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="w-1.5 h-1.5 rounded-full bg-blue-500"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div
      className="min-h-screen text-white flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "#dc2626",
          filter: "blur(120px)",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-sm px-6"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <RiRobot2Fill className="text-red-400 text-2xl" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Failed to Load Report
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Something went wrong while fetching your interview report. Please try
          again.
        </p>
        <button
          onClick={onRetry}
          style={{
            padding: "10px 24px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 600,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            cursor: "pointer",
            border: "none",
            boxShadow: "0 0 16px rgba(37,99,235,0.35)",
          }}
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}

// ─── InterviewReport ──────────────────────────────────────────────────────────

function InterviewReport({fromHistory}) {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [error, setError] = useState(false);

  const fetchReport = async () => {
    setError(false);
    setReport(null);
    try {
      const result = await axios.get(
        ServerUrl + "/api/interview/interview-report/" + id,
        { withCredentials: true },
      );
      console.log(result.data)
      setReport(result.data);
    } catch (err) {
      console.error("fetchReport Error:", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (error) return <ErrorState onRetry={fetchReport} />;
  if (!report) return <LoadingState />;
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />
      {/* Ambient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#1d4ed8",
          filter: "blur(130px)",
          top: "-10%",
          left: "-5%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "#2563eb",
          filter: "blur(110px)",
          bottom: "0",
          right: "5%",
          pointerEvents: "none",
        }}
      />
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Step3Report report={report} fromHistory/>
      </div>
    </div>
  );
}

export default InterviewReport;
