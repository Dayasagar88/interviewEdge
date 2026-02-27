import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

function Step3Report({ report }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 pr-20 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, delay: 0.3 }}
        >
          <FaCheckCircle className="text-green-400 text-3xl" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-5"
        style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80" }}
      >
        <HiSparkles /> Step 3 of 3 · Your Report
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl font-bold mb-4"
      >
        Interview{" "}
        <span style={{ background: "linear-gradient(90deg, #4ade80, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Complete!
        </span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gray-400 mb-3"
      >
        Role: <span className="text-white font-medium">{report?.role}</span> · Score:{" "}
        <span className="text-green-400 font-bold">{report?.score} / 10</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 text-sm mb-10"
      >
        Step3Report component — coming soon
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex gap-3"
      >
        <motion.button
          onClick={() => navigate("/home")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transition: "color 0.2s" }}
        >
          Back to Home
        </motion.button>

        <motion.button
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white"
          style={{ transition: "background 0.2s" }}
        >
          New Interview
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Step3Report;