import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Timer({ timeLeft, totalTime }) {
  const size = 96;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, timeLeft / totalTime);
  const offset = circumference * (1 - percentage);

  // Color shifts: green → yellow → red as time runs out
  const getColor = () => {
    if (percentage > 0.5) return "#3b82f6";   // blue — plenty of time
    if (percentage > 0.25) return "#f59e0b";  // amber — running low
    return "#ef4444";                          // red — urgent
  };

  const getGlow = () => {
    if (percentage > 0.5) return "rgba(59,130,246,0.4)";
    if (percentage > 0.25) return "rgba(245,158,11,0.4)";
    return "rgba(239,68,68,0.4)";
  };

  const color = getColor();
  const isUrgent = percentage <= 0.25;

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: "relative", width: size, height: size }}>
        {/* Outer glow ring */}
        <motion.div
          animate={{ opacity: isUrgent ? [0.4, 0.9, 0.4] : 0.3 }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${getGlow()} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset, stroke: color }}
            transition={{ strokeDashoffset: { duration: 1, ease: "linear" }, stroke: { duration: 0.5 } }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <motion.span
            animate={isUrgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: color,
              lineHeight: 1,
              transition: "color 0.5s",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {Math.ceil(timeLeft)}
          </motion.span>
          <span style={{ fontSize: "10px", color: "#4b5563", marginTop: "2px", letterSpacing: "0.05em" }}>sec</span>
        </div>
      </div>
    </div>
  );
}

export default Timer;