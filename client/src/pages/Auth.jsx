import React from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { RiRobot2Fill } from "react-icons/ri";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

// ─── Floating Orbs ─────────────────────────────────────────────────────────────

function FloatingOrb({ size, top, left, right, bottom, color, blur, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2.4, ease: "easeOut", delay }}
      style={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        opacity: 0.2,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let User = res.user;
      let name = User.displayName;
      let email = User.email;

      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data.user));
      navigate("/home");
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black overflow-hidden"
        style={{ position: "relative" }}
      >
        {/* Ambient orbs */}
        <FloatingOrb size={420} top="5%" left="5%" color="#2563eb" blur={140} delay={0.1} />
        <FloatingOrb size={380} bottom="5%" right="5%" color="#7c3aed" blur={130} delay={0.35} />
        <FloatingOrb size={200} top="45%" left="45%" color="#3b82f6" blur={80} delay={0.6} />

        {/* Subtle grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.025 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            pointerEvents: "none",
          }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-[420px] text-center shadow-2xl"
          style={{ zIndex: 1 }}
        >
          {/* Subtle top shimmer border */}
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, transparent, #3b82f6, #7c3aed, transparent)",
              borderRadius: "1.5rem 1.5rem 0 0",
              transformOrigin: "left",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 16,
              delay: 0.65,
            }}
            className="flex justify-center mb-4"
          >
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-500 p-3 rounded-xl shadow-lg shadow-blue-500/30"
            >
              <RiRobot2Fill className="text-2xl text-white" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.78 }}
            className="text-3xl font-bold text-white"
          >
            InterviewEdge
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="text-gray-400 mt-2 text-sm"
          >
            AI powered mock interviews · Improve your skills faster
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.0 }}
            className="mt-8 mb-6 flex items-center gap-3"
          >
            <div className="h-[1px] bg-gray-700 w-full" />
            <span className="text-gray-500 text-sm whitespace-nowrap">Sign In</span>
            <div className="h-[1px] bg-gray-700 w-full" />
          </motion.div>

          {/* Google Button */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 1.12 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 28px rgba(59,130,246,0.3)",
              }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-950 transition p-3 rounded-xl text-white font-medium shadow-lg cursor-pointer border border-white/5"
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </motion.button>
          </motion.div>

          {/* Bottom text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-gray-500 text-xs mt-6"
          >
            Secure AI Interviews · Personalized Feedback
          </motion.p>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Auth;
