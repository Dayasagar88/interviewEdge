import React, { useState, useRef, useEffect } from "react";
import { FaCoins, FaUserAstronaut, FaHistory, FaSignOutAlt, FaArrowRight } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Navbar() {
  const [showCoins, setShowCoins] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const coinsRef = useRef(null);
  const menuRef = useRef(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      setShowCoins(false);
      setShowMenu(false);
      navigate("/");
    } catch (error) {
      console.log("Logout error : ", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        coinsRef.current && !coinsRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setShowCoins(false);
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = userData?.name?.slice(0, 1).toUpperCase();

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        background: scrolled ? "rgba(2, 6, 23, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* ── Logo ── */}
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
          whileHover="hover"
          initial="rest"
        >
          <motion.div
            variants={{
              rest: { rotate: 0, scale: 1 },
              hover: { rotate: [0, -12, 12, 0], scale: 1.1 },
            }}
            transition={{ duration: 0.5 }}
            className="relative bg-blue-600 p-2 rounded-lg"
            style={{ boxShadow: "0 0 16px rgba(37,99,235,0.35)" }}
          >
            <RiRobot2Fill className="text-white text-xl" />
            <motion.div
              animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "0.5rem",
                border: "1px solid rgba(59,130,246,0.5)",
                pointerEvents: "none",
              }}
            />
          </motion.div>

          <div>
            <motion.h1
              variants={{ rest: { x: 0 }, hover: { x: 2 } }}
              transition={{ duration: 0.2 }}
              className="text-white font-semibold text-lg leading-tight"
            >
              InterviewEdge
            </motion.h1>
            <p className="text-gray-500 text-xs tracking-wide">AI Interview Platform</p>
          </div>
        </motion.div>

        {/* ── Right ── */}
        <div className="flex items-center gap-3 relative">

          {/* ── Credits pill ── */}
          <div ref={coinsRef} className="relative">
            <motion.button
              onClick={() => { setShowCoins(!showCoins); setShowMenu(false); }}
              whileHover={{ scale: 1.05, borderColor: "rgba(234,179,8,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-200 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "border-color 0.2s",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 2 }}
              >
                <FaCoins className="text-yellow-400" />
              </motion.div>
              <span className="font-medium">{userData?.credits ?? 0}</span>
              <span className="text-gray-600 text-xs hidden sm:inline">credits</span>
            </motion.button>

            {/* Credits popup */}
            <AnimatePresence>
              {showCoins && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl p-5 shadow-2xl"
                  style={{
                    background: "#090f1a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    top: "100%",
                  }}
                >
                  {/* Top accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: 1,
                      background: "linear-gradient(90deg, transparent, rgba(234,179,8,0.4), transparent)",
                      borderRadius: "1rem 1rem 0 0",
                    }}
                  />

                  <div className="flex items-center gap-2 mb-3">
                    <FaCoins className="text-yellow-400" />
                    <p className="text-white font-semibold text-sm">Your Credits</p>
                  </div>

                  {/* Credit bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Available</span>
                      <span className="text-yellow-400 font-medium">{userData?.credits ?? 0} left</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((userData?.credits ?? 0) / 20) * 100, 100)}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ background: "linear-gradient(90deg, #ca8a04, #eab308)" }}
                      />
                    </div>
                  </div>

                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                    Need more credits to continue your interview sessions?
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(234,179,8,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #ca8a04, #eab308)",
                      color: "#000",
                    }}
                  >
                    <HiSparkles />
                    Buy More Credits
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Avatar ── */}
          <div ref={menuRef} className="relative">
            <motion.button
              onClick={() => { setShowMenu(!showMenu); setShowCoins(false); }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer"
              style={{ boxShadow: "0 0 14px rgba(37,99,235,0.4)" }}
            >
              {userData ? initials : <FaUserAstronaut size={15} />}

              {/* Online dot */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#020617]"
              />
            </motion.button>

            {/* Profile menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-3 w-56 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    background: "#090f1a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    top: "100%",
                  }}
                >
                  {/* Top accent */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: 1,
                      background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                    }}
                  />

                  {/* User info */}
                  <div className="px-4 pt-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ boxShadow: "0 0 12px rgba(37,99,235,0.35)" }}
                      >
                        {initials ?? <FaUserAstronaut size={14} />}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate">{userData?.name}</p>
                        <p className="text-gray-500 text-xs truncate">{userData?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "0 16px" }} />

                  {/* Menu items */}
                  <div className="p-2">
                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(59,130,246,0.08)" }}
                      transition={{ duration: 0.15 }}
                      onClick={() => { navigate("/history"); setShowMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      <FaHistory className="text-blue-400 text-xs" />
                      Interview History
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 4, backgroundColor: "rgba(239,68,68,0.08)" }}
                      transition={{ duration: 0.15 }}
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      <FaSignOutAlt className="text-xs" />
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;