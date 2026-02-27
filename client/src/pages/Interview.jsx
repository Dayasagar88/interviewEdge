import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";
import { FaUserTie, FaMicrophone, FaChartLine } from "react-icons/fa";

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Setup", sub: "Role & Config", icon: <FaUserTie /> },
  { id: 2, label: "Interview", sub: "AI Session", icon: <FaMicrophone /> },
  { id: 3, label: "Report", sub: "Your Results", icon: <FaChartLine /> },
];

// ─── Vertical Step Indicator ──────────────────────────────────────────────────

function StepIndicator({ currentStep }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-0"
      style={{ userSelect: "none" }}
    >
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.id;
        const isDone = currentStep > step.id;

        return (
          <div key={step.id} className="flex flex-col items-center">
            {/* Step node */}
            <motion.div
              animate={{
                scale: isActive ? 1.1 : 1,
                boxShadow: isActive
                  ? "0 0 18px rgba(59,130,246,0.55)"
                  : isDone
                  ? "0 0 8px rgba(34,197,94,0.3)"
                  : "none",
              }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center gap-3 cursor-default"
            >
              {/* Circle */}
              <motion.div
                animate={{
                  background: isActive
                    ? "linear-gradient(135deg, #2563eb, #3b82f6)"
                    : isDone
                    ? "#16a34a"
                    : "rgba(255,255,255,0.06)",
                  borderColor: isActive
                    ? "rgba(59,130,246,0.6)"
                    : isDone
                    ? "rgba(34,197,94,0.4)"
                    : "rgba(255,255,255,0.1)",
                }}
                transition={{ duration: 0.3 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm border"
                style={{ color: isActive || isDone ? "#fff" : "#4b5563" }}
              >
                {isDone ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-xs"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span className="text-xs">{step.icon}</span>
                )}
              </motion.div>

              {/* Label tooltip on active */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-12 flex flex-col items-end"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <span className="text-white text-xs font-semibold">{step.label}</span>
                    <span className="text-gray-500 text-xs">{step.sub}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="w-px h-8 my-1" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  animate={{ height: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                  style={{ background: "linear-gradient(180deg, #16a34a, #22c55e)" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Page transition ──────────────────────────────────────────────────────────

const contentVariants = {
  enter: { opacity: 0, y: 24, filter: "blur(8px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -24, filter: "blur(8px)", transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Interview ────────────────────────────────────────────────────────────────

function Interview() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  return (
    <div
      className="min-h-screen text-white overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)", position: "relative" }}
    >
      {/* Ambient orbs */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.08 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute", width: 500, height: 500,
          borderRadius: "50%", background: "#1d4ed8",
          filter: "blur(130px)", top: "-10%", left: "-5%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.06 }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          position: "absolute", width: 380, height: 380,
          borderRadius: "50%", background: "#2563eb",
          filter: "blur(110px)", bottom: "-5%", right: "5%",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.025 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Navbar */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <Navbar />
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Content area */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Step1SetUp
                onStart={(data) => {
                  setInterviewData(data);
                  setStep(2);
                }}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Step2Interview
                interviewData={interviewData}
                onFinish={(report) => {
                  setInterviewData(report);
                  setStep(3);
                }}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Step3Report report={interviewData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Interview;