import React from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { AiOutlineCheck } from "react-icons/ai";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-black text-white">
      <Navbar />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <h1 className="text-5xl font-bold leading-tight">
              Master Interviews With AI
            </h1>

            <p className="mt-6 text-gray-400 text-lg">
              Practice real interview questions Get instant AI feedback Improve
              faster than ever
            </p>

            <button
              className="mt-8 px-8 py-4
bg-blue-600
hover:bg-blue-700
rounded-xl
font-semibold
transition"
            >
              Start Interview
            </button>

            <ul className="mt-10 space-y-4 text-gray-300">
              <li className="flex gap-3">
                <AiOutlineCheck className="text-blue-500 text-xl" />
                Real Interview Questions
              </li>

              <li className="flex gap-3">
                <AiOutlineCheck className="text-blue-500 text-xl" />
                AI Evaluation Reports
              </li>

              <li className="flex gap-3">
                <AiOutlineCheck className="text-blue-500 text-xl" />
                Track Your Progress
              </li>
            </ul>
          </motion.div>

          {/* RIGHT */}

          <motion.div variants={fadeInUp} initial="initial" animate="animate">
            <div
              className="bg-[#0a0a0a]
border border-[#222]
rounded-2xl
p-8
shadow-xl"
            >
              <h3 className="text-xl font-semibold">AI Feedback Preview</h3>

              <p className="mt-4 text-gray-400">
                Your answer demonstrates strong understanding of React concepts
                Try improving time complexity explanation
              </p>

              <div className="mt-6">
                <div className="text-sm text-gray-400">Score</div>

                <div className="text-3xl font-bold text-blue-500">8.5 / 10</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
