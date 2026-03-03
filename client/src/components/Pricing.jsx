import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowRight,
  FaBolt,
  FaShieldAlt,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";
import Navbar from "./Navbar";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

// ─── Data ─────────────────────────────────────────────────────────────────────

const plans = [
  {
    id: "free",
    name: "Free",
    badge: "Default",
    badgeStyle: {
      bg: "rgba(255,255,255,0.06)",
      border: "rgba(255,255,255,0.1)",
      text: "#6b7280",
    },
    price: 0,
    credits: 100,
    tagline: "Perfect for beginners starting interview preparation.",
    color: "#6b7280",
    glow: "rgba(107,114,128,0.18)",
    bar: "linear-gradient(90deg, #374151, #6b7280)",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
    cta: "Current Plan",
    ctaDisabled: true,
    popular: false,
  },
  {
    id: "starter",
    name: "Starter Pack",
    badge: "Popular",
    badgeStyle: {
      bg: "rgba(59,130,246,0.12)",
      border: "rgba(59,130,246,0.4)",
      text: "#60a5fa",
    },
    price: 100,
    credits: 150,
    tagline: "Great for focused practice and skill improvement.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.28)",
    bar: "linear-gradient(90deg, #1d4ed8, #60a5fa)",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
    cta: "Proceed to Pay",
    ctaDisabled: false,
    popular: true,
  },
  {
    id: "pro",
    name: "Pro Pack",
    badge: "Best Value",
    badgeStyle: {
      bg: "rgba(167,139,250,0.12)",
      border: "rgba(167,139,250,0.4)",
      text: "#a78bfa",
    },
    price: 500,
    credits: 650,
    tagline: "Best value for serious job preparation.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.22)",
    bar: "linear-gradient(90deg, #7c3aed, #a78bfa)",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
    cta: "Select Plan",
    ctaDisabled: false,
    popular: false,
  },
];

const comparison = [
  { label: "AI Interview Credits", free: "100", starter: "150", pro: "650" },
  { label: "Voice Recognition", free: true, starter: true, pro: true },
  { label: "Performance Report", free: "Basic", starter: "Full", pro: "Full" },
  {
    label: "Interview History",
    free: "7 days",
    starter: "Unlimited",
    pro: "Unlimited",
  },
  {
    label: "Feedback Quality",
    free: "Basic",
    starter: "Detailed",
    pro: "Advanced",
  },
  { label: "Skill Analytics", free: false, starter: true, pro: true },
  { label: "Priority Processing", free: false, starter: false, pro: true },
  { label: "Skill Trend Analysis", free: false, starter: false, pro: true },
];

const trustBadges = [
  {
    icon: <FaShieldAlt />,
    label: "Secure Payment",
    sub: "256-bit SSL encryption",
  },
  { icon: <FaBolt />, label: "Instant Credits", sub: "Credited immediately" },
  {
    icon: <FaStar />,
    label: "Never Expire",
    sub: "Credits carry over forever",
  },
];

// ─── PlanCard ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, index, handlePayment }) {
  const [hov, setHov] = useState(false);

  const ctaBg = plan.ctaDisabled
    ? "rgba(255,255,255,0.04)"
    : plan.popular
      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
      : `${plan.color}16`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      {/* Hover glow */}
      <motion.div
        animate={{ opacity: hov ? 1 : plan.popular ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          inset: -2,
          borderRadius: "22px",
          background: `radial-gradient(ellipse at 50% 0%, ${plan.glow}, transparent 65%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Card body */}
      <motion.div
        animate={{
          y: hov ? -6 : 0,
          borderColor: hov
            ? `${plan.color}55`
            : plan.popular
              ? `${plan.color}40`
              : "rgba(255,255,255,0.07)",
        }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        style={{
          position: "relative",
          zIndex: 1,
          background: plan.popular
            ? "rgba(8,12,30,0.97)"
            : "rgba(8,12,24,0.85)",
          border: `1px solid ${plan.popular ? `${plan.color}40` : "rgba(255,255,255,0.07)"}`,
          borderRadius: "20px",
          padding: "28px 26px",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: plan.popular ? `0 8px 50px ${plan.glow}` : "none",
        }}
      >
        {/* Accent bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.9,
            delay: index * 0.1 + 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{
            height: 2,
            background: plan.bar,
            borderRadius: 2,
            marginBottom: "22px",
            transformOrigin: "left",
          }}
        />

        {/* Name + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "18px",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff" }}>
            {plan.name}
          </h3>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              padding: "4px 11px",
              borderRadius: "20px",
              flexShrink: 0,
              background: plan.badgeStyle.bg,
              border: `1px solid ${plan.badgeStyle.border}`,
              color: plan.badgeStyle.text,
            }}
          >
            {plan.badge}
          </span>
        </div>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "2px",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: plan.color,
              lineHeight: 1,
              marginBottom: "8px",
            }}
          >
            ₹
          </span>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.1 + 0.4,
              type: "spring",
              stiffness: 160,
            }}
            style={{
              fontSize: "50px",
              fontWeight: 800,
              color: plan.color,
              lineHeight: 1,
            }}
          >
            {plan.price}
          </motion.span>
        </div>

        {/* Credits chip */}
        <div style={{ marginBottom: "18px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "20px",
              background: `${plan.color}14`,
              border: `1px solid ${plan.color}28`,
              color: plan.color,
            }}
          >
            {plan.credits} Credits
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "13px",
            color: "#6b7280",
            lineHeight: 1.65,
            marginBottom: "20px",
          }}
        >
          {plan.tagline}
        </p>

        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.05)",
            marginBottom: "20px",
          }}
        />

        {/* Features */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            flex: 1,
          }}
        >
          {plan.features.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: index * 0.1 + 0.42 + i * 0.06,
                duration: 0.3,
              }}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <FaCheckCircle
                style={{ color: plan.color, fontSize: "13px", flexShrink: 0 }}
              />
              <span style={{ fontSize: "13px", color: "#d1d5db" }}>{f}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA button */}
        <button
          onClick={() => handlePayment(plan)}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: "14px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: plan.ctaDisabled ? "default" : "pointer",
            position: "relative",
            overflow: "hidden",
            background: ctaBg,
            color: plan.ctaDisabled
              ? "#374151"
              : plan.popular
                ? "#fff"
                : plan.color,
            border: `1px solid ${plan.ctaDisabled ? "rgba(255,255,255,0.06)" : plan.color + "35"}`,
            boxShadow:
              !plan.ctaDisabled && plan.popular
                ? `0 0 24px ${plan.glow}`
                : "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (plan.ctaDisabled) return;
            e.currentTarget.style.boxShadow = `0 0 32px ${plan.glow}`;
            if (!plan.popular)
              e.currentTarget.style.background = `${plan.color}26`;
          }}
          onMouseLeave={(e) => {
            if (plan.ctaDisabled) return;
            e.currentTarget.style.boxShadow = plan.popular
              ? `0 0 24px ${plan.glow}`
              : "none";
            if (!plan.popular) e.currentTarget.style.background = ctaBg;
          }}
          onMouseDown={(e) => {
            if (!plan.ctaDisabled)
              e.currentTarget.style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {/* Shimmer */}
          {!plan.ctaDisabled && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                repeat: Infinity,
                duration: 2.6,
                ease: "easeInOut",
                repeatDelay: 2.5,
              }}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "40%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                pointerEvents: "none",
              }}
            />
          )}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
            }}
          >
            {plan.ctaDisabled ? (
              plan.cta
            ) : (
              <>
                {plan.cta} <FaArrowRight style={{ fontSize: "10px" }} />
              </>
            )}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Table cell ───────────────────────────────────────────────────────────────

function Cell({ value, color }) {
  if (value === true)
    return (
      <FaCheckCircle
        style={{ color, fontSize: "14px", display: "block", margin: "0 auto" }}
      />
    );
  if (value === false)
    return (
      <FaTimes
        style={{
          color: "#2d3748",
          fontSize: "13px",
          display: "block",
          margin: "0 auto",
        }}
      />
    );
  return (
    <span
      style={{
        fontSize: "12px",
        fontWeight: 600,
        color,
        display: "block",
        textAlign: "center",
      }}
    >
      {value}
    </span>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showTable, setShowTable] = useState(false);

  const handlePayment = async (plan) => {
    if (plan.ctaDisabled) return;
    try {
      const amountMap = { starter: 100, pro: 500 };
      const result = await axios.post(
        ServerUrl + "/api/payment/order",
        {
          planId: plan.id,
          amount: amountMap[plan.id] ?? 0,
          credits: plan.credits,
        },
        { withCredentials: true },
      );

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.amount,
        currency: "INR",
        name: "InterviewEdge.AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        order_id: result.data.id,
        theme: { color: "#2563eb" },
        handler: async (response) => {
          const verify = await axios.post(
            ServerUrl + "/api/payment/verify",
            response,
            { withCredentials: true },
          );
          dispatch(setUserData(verify.data.user));
          alert("Payment successful! Your credits have been added.");
          navigate("/home");
        },
      });

      rzp.open();
    } catch (error) {
      console.error("Payment order error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #020617 70%, #000 100%)",
        position: "relative",
        overflow: "hidden",
        color: "#fff",
      }}
    >
      <Navbar />

      {/* Ambient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.09 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "#1d4ed8",
          filter: "blur(140px)",
          top: "-18%",
          left: "-10%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#7c3aed",
          filter: "blur(120px)",
          bottom: "5%",
          right: "-2%",
          pointerEvents: "none",
        }}
      />

      {/* Grid texture */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.025 }}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "56px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <HiSparkles style={{ color: "#60a5fa", fontSize: "14px" }} />
            </motion.div>
            <span
              style={{
                color: "#60a5fa",
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Pricing Plans
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(32px,5vw,50px)",
              fontWeight: 800,
              marginBottom: "14px",
              lineHeight: 1.1,
            }}
          >
            Choose Your{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Plan
            </span>
          </h1>
          <p
            style={{ color: "#6b7280", fontSize: "15px", marginBottom: "22px" }}
          >
            Flexible pricing to match your interview preparation goals.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "50px",
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <RiRobot2Fill style={{ color: "#60a5fa", fontSize: "13px" }} />
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              1 credit = 1 AI interview question · No hidden charges
            </span>
          </motion.div>
        </motion.div>

        {/* Plan cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "20px",
            marginBottom: "56px",
          }}
        >
          {plans.map((p, i) => (
            <PlanCard
              key={p.id}
              plan={p}
              index={i}
              handlePayment={handlePayment}
            />
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          {trustBadges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 + i * 0.08 }}
              style={{ display: "flex", alignItems: "center", gap: "12px" }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.22)",
                  color: "#60a5fa",
                  fontSize: "13px",
                }}
              >
                {b.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#d1d5db",
                    marginBottom: "2px",
                  }}
                >
                  {b.label}
                </p>
                <p style={{ fontSize: "11px", color: "#4b5563" }}>{b.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compare toggle */}
        <div style={{ textAlign: "center", marginBottom: "14px" }}>
          <button
            onClick={() => setShowTable((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              color: "#6b7280",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "10px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#60a5fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            <motion.span
              animate={{ rotate: showTable ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "inline-flex" }}
            >
              <FaArrowRight style={{ fontSize: "11px" }} />
            </motion.span>
            {showTable ? "Hide" : "Compare"} all features
          </button>
        </div>

        {/* Comparison table */}
        <AnimatePresence>
          {showTable && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden", marginBottom: "28px" }}
            >
              <div
                style={{
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "rgba(8,12,24,0.85)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div style={{ padding: "16px" }} />
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      style={{ padding: "16px", textAlign: "center" }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: p.color,
                        }}
                      >
                        {p.name}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#4b5563",
                          marginTop: "2px",
                        }}
                      >
                        ₹{p.price}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {comparison.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr",
                      borderBottom:
                        i < comparison.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      background:
                        i % 2 === 1 ? "rgba(255,255,255,0.012)" : "transparent",
                    }}
                  >
                    <div style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                        {row.label}
                      </span>
                    </div>
                    <div
                      style={{
                        padding: "13px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cell value={row.free} color={plans[0].color} />
                    </div>
                    <div
                      style={{
                        padding: "13px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(59,130,246,0.03)",
                      }}
                    >
                      <Cell value={row.starter} color={plans[1].color} />
                    </div>
                    <div
                      style={{
                        padding: "13px 16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Cell value={row.pro} color={plans[2].color} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{
            borderRadius: "18px",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.13)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: "rgba(59,130,246,0.1)",
              border: "1px solid rgba(59,130,246,0.22)",
            }}
          >
            <RiRobot2Fill style={{ color: "#60a5fa", fontSize: "15px" }} />
          </div>
          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.65 }}>
            <span style={{ color: "#9ca3af", fontWeight: 600 }}>
              How credits work:{" "}
            </span>
            Each AI interview question uses 1 credit. Credits never expire and
            carry over forever. Payments processed securely via Razorpay.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
