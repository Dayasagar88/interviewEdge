import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function LandingNavbar() {
    const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-[#111]"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}

        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <RiRobot2Fill className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-white font-semibold text-lg">InterviewEdge</h1>

            <p className="text-gray-400 text-xs">AI Interview Platform</p>
          </div>
        </div>

        {/* BUTTON */}

        <button
        onClick={()=>navigate("/auth")}
          className="px-6 py-2
bg-blue-600
hover:bg-blue-700
rounded-lg
text-white font-medium
transition"
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
}

export default LandingNavbar;
