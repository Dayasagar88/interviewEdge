import React, { useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import { motion } from "framer-motion";
import { FaRobot, FaChartLine, FaHistory, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white">
      <LandingNavbar />

      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold">Welcome To InterviewEdge</h1>

            <p className="mt-6 text-gray-400 text-lg">
              Practice real interviews Get AI feedback Improve faster than ever
            </p>

            <button
              onClick={() => navigate("/auth")}
              className="mt-8 px-8 py-4
bg-blue-600
hover:bg-blue-700
rounded-xl
font-semibold
flex items-center gap-2 mx-auto"
            >
              Start Interview
              <FaArrowRight />
            </button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {/* CARD 1 */}

            <motion.div
              whileHover={{
                rotateX: 6,
                rotateY: -6,
                scale: 1.03,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#0a0a0a]
border border-[#222]
rounded-2xl
p-6
cursor-pointer"
            >
              <FaRobot className="text-blue-500 text-3xl mb-4" />

              <h3 className="text-xl font-semibold">AI Interviews</h3>

              <p className="text-gray-400 mt-2">
                Practice real technical interviews with AI.
              </p>
            </motion.div>

            {/* CARD 2 */}

            <motion.div
              whileHover={{
                rotateX: 6,
                rotateY: -6,
                scale: 1.03,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#0a0a0a]
border border-[#222]
rounded-2xl
p-6
cursor-pointer"
            >
              <FaChartLine className="text-green-500 text-3xl mb-4" />

              <h3 className="text-xl font-semibold">Performance Tracking</h3>

              <p className="text-gray-400 mt-2">
                Track your interview progress.
              </p>
            </motion.div>

            {/* CARD 3 */}

            <motion.div
              whileHover={{
                rotateX: 6,
                rotateY: -6,
                scale: 1.03,
              }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-[#0a0a0a]
border border-[#222]
rounded-2xl
p-6
cursor-pointer"
            >
              <FaHistory className="text-purple-500 text-3xl mb-4" />

              <h3 className="text-xl font-semibold">Interview History</h3>

              <p className="text-gray-400 mt-2">
                View previous interviews anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 py-6 border-t border-[#111]">
        AI Powered Interviews • Instant Feedback • Real Questions
      </div>
    </div>
  );
}

export default Dashboard;
