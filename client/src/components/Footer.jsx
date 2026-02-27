import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RiRobot2Fill } from "react-icons/ri";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaArrowRight,
  FaBolt,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

// ─── Data ──────────────────────────────────────────────────────────────────────

const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Documentation", "Help Center", "Contact", "Status"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Licenses"],
};

const socials = [
  { icon: <FaTwitter />, label: "Twitter", href: "#" },
  { icon: <FaLinkedin />, label: "LinkedIn", href: "#" },
  { icon: <FaGithub />, label: "GitHub", href: "#" },
  { icon: <FaInstagram />, label: "Instagram", href: "#" },
];

const stats = [
  { value: "50K+", label: "Interviews Done" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "200+", label: "Job Roles" },
];

// ─── Variants ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
  }),
};

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      ref={ref}
      className="relative text-white overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020617 0%, #000000 100%)",
        borderTop: "1px solid #0f172a",
      }}
    >
      {/* ── Top glow line ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, #1d4ed8 30%, #3b82f6 50%, #1d4ed8 70%, transparent 100%)",
          transformOrigin: "left",
        }}
      />

      {/* ── Ambient orbs ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.07 } : {}}
        transition={{ duration: 2 }}
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "#1d4ed8",
          filter: "blur(120px)",
          top: "-20%",
          left: "-5%",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : {}}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "#2563eb",
          filter: "blur(100px)",
          bottom: "-10%",
          right: "5%",
          pointerEvents: "none",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-8 pt-20 pb-8" style={{ zIndex: 1 }}>

        {/* ── Stats bar ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-3 gap-4 mb-20 p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              className="text-center"
            >
              <div
                className="text-3xl font-bold"
                style={{
                  background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {value}
              </div>
              <div className="text-gray-500 text-sm mt-1">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand col */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-4"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/20"
              >
                <RiRobot2Fill className="text-xl text-white" />
              </motion.div>
              <span className="text-xl font-bold tracking-tight">InterviewEdge</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              AI-powered mock interviews that adapt to your skill level, giving you the edge you need to land your dream job.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">Stay Updated</p>
              <div className="flex gap-2">
                <div
                  className="flex items-center gap-2 flex-1 px-4 py-2.5 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <HiOutlineMail className="text-gray-500 flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent outline-none text-gray-300 placeholder-gray-600 w-full text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: "0 0 20px rgba(59,130,246,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                </motion.button>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map(({ icon, label, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2, borderColor: "rgba(59,130,246,0.6)" }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links cols */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(links).map(([category, items], ci) => (
              <motion.div
                key={category}
                custom={ci + 1}
                variants={fadeUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
              >
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 font-medium">
                  {category}
                </p>
                <ul className="space-y-2.5">
                  {items.map((item, ii) => (
                    <li key={ii}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 4, color: "#60a5fa" }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 text-sm hover:text-white transition-colors inline-block"
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)",
            transformOrigin: "left",
            marginBottom: "1.5rem",
          }}
        />

        {/* ── Bottom bar ── */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} InterviewEdge. All rights reserved.
          </p>

          {/* Center badge */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="flex items-center gap-2 text-xs text-gray-600"
          >
            <FaBolt className="text-blue-500 text-xs" />
            <span>Powered by AI · Built for your success</span>
          </motion.div>

          <p className="text-gray-600 text-xs">
            Made with ♥ for job seekers
          </p>
        </motion.div>

      </div>
    </footer>
  );
}

export default Footer;