import React from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

function Step2Interview({ interviewData, onFinish }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 pr-20 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <FaMicrophone className="text-blue-400 text-3xl" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-5"
        style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#60a5fa" }}
      >
        <HiSparkles /> Step 2 of 3 · Live Interview
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl font-bold mb-4"
      >
        Interview in Progress
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-gray-400 mb-3"
      >
        Role: <span className="text-white font-medium">{interviewData?.role}</span> · Experience:{" "}
        <span className="text-white font-medium">{interviewData?.experience}</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 text-sm mb-10"
      >
        Step2Interview component — coming soon
      </motion.p>

      {/* Temp button to test navigation */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        onClick={() => onFinish({ ...interviewData, score: 8.5, feedback: "Great performance!" })}
        whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(59,130,246,0.4)" }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white"
        style={{ transition: "background 0.2s" }}
      >
        Finish Interview (Placeholder)
      </motion.button>
    </div>
  );
}

export default Step2Interview;