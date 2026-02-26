import React from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { RiRobot2Fill } from "react-icons/ri";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let User = res.user;
      let name = User.displayName;
      let email = User.email;

      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data.user));
      navigate("/home")
    } catch (error) {
      console.log("Error : ", error); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-600 blur-[150px] opacity-20 top-20 left-20" />
      <div className="absolute w-[400px] h-[400px] bg-purple-600 blur-[150px] opacity-20 bottom-20 right-20" />

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl w-[420px] text-center shadow-2xl"
      >
        {/* Logo */}

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-4"
        >
          <div className="bg-blue-500 p-3 rounded-xl">
            <RiRobot2Fill className="text-2xl text-white" />
          </div>
        </motion.div>

        {/* Title */}

        <h1 className="text-3xl font-bold text-white">InterviewEdge</h1>

        <p className="text-gray-400 mt-2 text-sm">
          AI powered mock interviews Improve your skills faster
        </p>

        {/* Divider */}

        <div className="mt-8 mb-6 flex items-center gap-3">
          <div className="h-[1px] bg-gray-700 w-full" />
          <span className="text-gray-500 text-sm">Sign In</span>
          <div className="h-[1px] bg-gray-700 w-full" />
        </div>

        {/* Google Button */}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-950 transition p-3 rounded-xl text-white font-medium shadow-lg cursor-pointer"
        >
          <FcGoogle />
          Continue with Google
        </motion.button>

        {/* Bottom Text */}

        <p className="text-gray-500 text-xs mt-6">
          Secure AI Interviews Personalized Feedback
        </p>
      </motion.div>
    </div>
  );
}

export default Auth;
