import React, { useState, useRef, useEffect } from "react";
import { FaCoins, FaUserAstronaut } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Navbar() {
  const [showCoins, setShowCoins] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // refs
  const coinsRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCoins(false);
      setShowMenu(false);
      navigate("/");
    } catch (error) {
      console.log("Logout error : ", error);
    }
  };

  // click outside logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        coinsRef.current &&
        !coinsRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowCoins(false);
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b border-[#111]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <RiRobot2Fill className="text-white text-xl" />
          </div>

          <div>
            <h1 className="text-white font-semibold">InterviewEdge</h1>

            <p className="text-gray-400 text-xs">AI Interview Platform</p>
          </div>
        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-4 relative">
          {/* COINS */}

          <div
            ref={coinsRef}
            onClick={() => {
              setShowCoins(!showCoins);
              setShowMenu(false);
            }}
            className="cursor-pointer flex items-center gap-2
            bg-[#0a0a0a]
            border border-[#222]
            px-4 py-2
            rounded-lg
            text-gray-200"
          >
            <FaCoins className="text-yellow-500" />

            {userData?.credits}
          </div>

          {/* COINS POPUP */}

          <AnimatePresence>
            {showCoins && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-16 top-14
                bg-[#0a0a0a]
                border border-[#222]
                rounded-xl
                p-5
                w-[240px]
                shadow-2xl"
              >
                <p className="text-gray-300 text-sm">
                  Need more credits to continue interviews?
                </p>

                <button
                  className="mt-4 w-full py-2
                  bg-blue-600
                  hover:bg-blue-700
                  rounded-lg
                  text-white font-medium"
                >
                  Buy more credits
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AVATAR */}

          <div
            ref={menuRef}
            onClick={() => {
              setShowMenu(!showMenu);
              setShowCoins(false);
            }}
            className="cursor-pointer w-9 h-9 rounded-full
            bg-blue-600
            flex items-center justify-center
            text-white font-semibold"
          >
            {userData ? (
              userData?.name.slice(0, 1).toUpperCase()
            ) : (
              <FaUserAstronaut size={16} />
            )}
          </div>

          {/* PROFILE MENU */}

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-14
                bg-[#0a0a0a]
                border border-[#222]
                rounded-xl
                p-4
                w-[220px]
                shadow-2xl"
              >
                <p className="text-blue-400 font-semibold">{userData?.name}</p>

                <div className="mt-3 space-y-3">
                  <button className="block text-gray-300 hover:text-white">
                    Interview History
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block text-red-400 hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
