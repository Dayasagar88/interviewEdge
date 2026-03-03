import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaArrowRight,
  FaCheckCircle,
  FaForward,
  FaSpinner,
  FaLightbulb,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { RiRobot2Fill } from "react-icons/ri";
import { MdOutlineNavigateNext } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import Timer from "./Timer";

import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import { ServerUrl } from "../App";

// ─── API ───────────────────────────────────────────────────────────────────────
const BASE = "http://localhost:8000/api/interview";

// ─── Phase constants ───────────────────────────────────────────────────────────
const PHASE = {
  INTRO: "intro", // AI intro speech
  AI_SPEAKING: "speaking", // AI reading the question
  ANSWERING: "answering", // user is answering
  SUBMITTING: "submitting", // awaiting API response
  FEEDBACK: "feedback", // showing feedback, Next btn enabled
  FINISHING: "finishing", // awaiting finish-interview API
};

// ─── Step2Interview ────────────────────────────────────────────────────────────
function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const { userData } = useSelector((s) => s.user);
  const token = userData?.token;

  console.log(interviewData);

  // ── Core state ──
  const [phase, setPhase] = useState(PHASE.INTRO);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isMicOn, setIsMicOn] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [voiceGender, setVoiceGender] = useState("female");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [questionVisible, setQuestionVisible] = useState(false);

  // ── Refs ──
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null); // when answering started, for timeTaken
  const autoSubmittedRef = useRef(false); // prevent double auto-submit

  const currentQuestion = questions[currentIndex];
  const totalTime = currentQuestion?.timeLimit || 60;
  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const isLastQuestion = currentIndex === questions.length - 1;

  // ─── Load voices ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const female = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female"),
      );
      if (female) {
        setSelectedVoice(female);
        setVoiceGender("female");
        return;
      }
      const male = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male"),
      );
      if (male) {
        setSelectedVoice(male);
        setVoiceGender("male");
        return;
      }
      setSelectedVoice(voices[0]);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ─── Speak helper ──────────────────────────────────────────────────────────
  const speakText = useCallback(
    (text) =>
      new Promise((resolve) => {
        if (!window.speechSynthesis) {
          resolve();
          return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(
          text.replace(/,/g, ", ...").replace(/\./g, ". ..."),
        );
        utterance.voice = selectedVoice;
        utterance.rate = 0.92;
        utterance.pitch = 1.05;
        utterance.volume = 1;
        utterance.onstart = () => {
          videoRef.current?.play();
          setSubtitle(text);
        };
        utterance.onend = () => {
          videoRef.current?.pause();
          if (videoRef.current) videoRef.current.currentTime = 0;
          setTimeout(() => {
            setSubtitle("");
            resolve();
          }, 300);
        };
        window.speechSynthesis.speak(utterance);
      }),
    [selectedVoice],
  );

  

  // ─── API: submit answer ────────────────────────────────────────────────────
  const callSubmitAnswer = useCallback(
    async (ans, timeTaken) => {
      try {
        const res = await axios.post(
          `${ServerUrl}/api/interview/submit-answers`,
          { interviewId, questionIndex: currentIndex, answer: ans, timeTaken },
          { withCredentials: true },
        );

        console.log("Submit answer:", res.data);
        speakText(res.data.feedback || "Answer recorded.");

        return res.data.feedback || "Answer recorded.";
      } catch (err) {
        console.error("Error submitting answer:", err);
        return "Answer recorded.";
      }
    },
    [interviewId, currentIndex],
  );

  // ─── API: finish interview ─────────────────────────────────────────────────
  const callFinishInterview = useCallback(async () => {
    setPhase(PHASE.FINISHING);

    try {
      const res = await axios.post(
        `${ServerUrl}/api/interview/finish-interview`,
        { interviewId },
        { withCredentials: true },
      );

      console.log("Finish Data:", res.data);

      onFinish(res.data);
    } catch (err) {
      console.error("Finish interview error:", err);
    }
  }, [interviewId, onFinish]);

  // ─── Submit answer (shared by button, skip, auto) ─────────────────────────
  const submitAnswer = useCallback(
    async (ans = answer) => {
      if (phase === PHASE.SUBMITTING || phase === PHASE.FEEDBACK) return;
      setPhase(PHASE.SUBMITTING);

      // Stop mic + timer
      recognitionRef.current?.stop();
      setIsMicOn(false);
      clearInterval(timerRef.current);

      const timeTaken = startTimeRef.current
        ? Math.round((Date.now() - startTimeRef.current) / 1000)
        : totalTime;

      const fb = await callSubmitAnswer(ans, timeTaken);
      setFeedback(fb);
      setPhase(PHASE.FEEDBACK);
    },
    [phase, answer, totalTime, callSubmitAnswer],
  );

  // ─── Timer countdown ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== PHASE.ANSWERING) return;
    clearInterval(timerRef.current);
    autoSubmittedRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!autoSubmittedRef.current) {
            autoSubmittedRef.current = true;
            // Auto-submit when timer hits 0
            submitAnswer(answer);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ─── Question flow ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedVoice) return;

    const run = async () => {
      if (phase === PHASE.INTRO) {
        await speakText(
          `Hello ${userName}, welcome to your interview for the role of ${interviewData.role}. Let's get started!`,
        );
        await speakText(
          "I will ask you a few questions. Just answer naturally. Let's begin!",
        );
        // Kick off first question
        setPhase(PHASE.AI_SPEAKING);
        setCurrentIndex(0);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoice]);

  useEffect(() => {
    if (phase !== PHASE.AI_SPEAKING) return;
    setQuestionVisible(false);
    setFeedback("");
    setAnswer("");
    setTimeLeft(currentQuestion?.timeLimit || 60);

    const run = async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (currentIndex === questions.length - 1) {
        await speakText("Alright, this one might be a bit tricky!");
      }
      await speakText(currentQuestion.question);
      // Show question text only AFTER AI finishes speaking
      setQuestionVisible(true);
      setPhase(PHASE.ANSWERING);
      startTimeRef.current = Date.now();
      startListening();
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentIndex]);

  // ─── Next question ─────────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      await callFinishInterview();
    } else {
      setPhase(PHASE.AI_SPEAKING);
      setCurrentIndex((i) => i + 1);
    }
  }, [isLastQuestion, callFinishInterview]);

  // ─── Skip ──────────────────────────────────────────────────────────────────
  const handleSkip = () => submitAnswer("");

  // ─── Voice recognition ─────────────────────────────────────────────────────
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window))
      return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let t = "";
      for (let i = 0; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      setAnswer(t);
    };
    rec.start();
    recognitionRef.current = rec;
    setIsMicOn(true);
  };

  const toggleMic = () => {
    if (isMicOn) {
      recognitionRef.current?.stop();
      setIsMicOn(false);
    } else {
      startListening();
    }
  };

  // ─── Derived flags ─────────────────────────────────────────────────────────
  const isAISpeaking = phase === PHASE.INTRO || phase === PHASE.AI_SPEAKING;
  const isAnswering = phase === PHASE.ANSWERING;
  const isSubmitting = phase === PHASE.SUBMITTING;
  const isFeedback = phase === PHASE.FEEDBACK;
  const isFinishing = phase === PHASE.FINISHING;

  const canSubmit = isAnswering && answer.trim().length > 0;
  const canSkip = isAnswering;
  const canNext = isFeedback;

  const progress = (currentIndex / questions.length) * 100;

  // ─── UI ────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen text-white"
      style={{ background: "transparent" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-10 pr-20">
        {/* ── Progress bar — fixed height, no shift ── */}
        <div style={{ height: "48px", marginBottom: "28px" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              >
                <HiSparkles className="text-blue-400 text-sm" />
              </motion.div>
              <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">
                Step 2 of 3 · Live Interview
              </span>
            </div>
            <span className="text-gray-500 text-xs">
              Question{" "}
              <span className="text-white font-semibold">
                {currentIndex + 1}
              </span>{" "}
              /{" "}
              <span className="text-white font-semibold">
                {questions.length}
              </span>
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #2563eb, #60a5fa)" }}
            />
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-start">
          {/* ════ LEFT PANEL ════ */}
          <div
            className="flex flex-col gap-4"
            style={{ position: "sticky", top: "20px" }}
          >
            {/* AI video */}
            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(8,12,24,0.9)",
              }}
            >
              <video
                ref={videoRef}
                src={videoSource}
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Speaking badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  height: "28px",
                }}
              >
                <AnimatePresence>
                  {isAISpeaking && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{
                        background: "rgba(0,0,0,0.75)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(59,130,246,0.3)",
                      }}
                    >
                      <div
                        className="flex gap-0.5 items-end"
                        style={{ height: "12px" }}
                      >
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: ["3px", "11px", "3px"] }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.55,
                              delay: i * 0.1,
                              ease: "easeInOut",
                            }}
                            style={{
                              width: "3px",
                              background: "#60a5fa",
                              borderRadius: "2px",
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-blue-400 text-xs font-medium">
                        Speaking
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Intro overlay */}
              <AnimatePresence>
                {phase === PHASE.INTRO && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background: "rgba(2,6,23,0.72)",
                      backdropFilter: "blur(3px)",
                    }}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mx-auto mb-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center"
                        style={{ boxShadow: "0 0 20px rgba(37,99,235,0.5)" }}
                      >
                        <RiRobot2Fill className="text-white text-lg" />
                      </motion.div>
                      <p className="text-gray-300 text-sm font-medium">
                        Introducing...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI subtitle — fixed height */}
            <div style={{ minHeight: "52px" }}>
              <AnimatePresence mode="wait">
                {subtitle ? (
                  <motion.div
                    key="sub"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(59,130,246,0.07)",
                      border: "1px solid rgba(59,130,246,0.16)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5"
                      />
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                        {subtitle}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl px-4 py-3 text-center"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <p className="text-gray-700 text-xs">
                      {isAnswering
                        ? "Your turn to answer"
                        : "AI is preparing..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status card — fixed layout */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(8,12,24,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-gray-600 text-xs uppercase tracking-widest mb-4 font-medium">
                Interview Status
              </p>

              <div className="flex justify-center mb-5">
                <Timer timeLeft={timeLeft ?? totalTime} totalTime={totalTime} />
              </div>

              <div
                style={{
                  height: 1,
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: "14px",
                }}
              />

              <div className="grid grid-cols-2 gap-2 text-center">
                <div
                  className="rounded-xl py-2.5"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.15)",
                  }}
                >
                  <div
                    className="text-xl font-bold"
                    style={{
                      color: "#60a5fa",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {currentIndex + 1}
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5">Current Q</div>
                </div>
                <div
                  className="rounded-xl py-2.5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="text-xl font-bold text-white"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {questions.length}
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5">Total Q</div>
                </div>
              </div>
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div style={{ height: "52px", flexShrink: 0 }}>
              <h1
                className="text-2xl font-bold mb-0.5"
                style={{
                  background: "linear-gradient(90deg, #60a5fa, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AI Smart Interview
              </h1>
              <p className="text-gray-500 text-sm">
                {interviewData.role} ·{" "}
                <span className="text-gray-400">
                  {interviewData.experience}
                </span>{" "}
                ·{" "}
                <span className="text-gray-400">
                  {{
                    hr: "HR / Behavioral",
                    technical: "Technical",
                    system_design: "System Design",
                    dsa: "DSA",
                  }[interviewData.mode] || ""}
                </span>
              </p>
            </div>

            {/* ── Question card — fixed min-height ── */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "rgba(8,12,24,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                minHeight: "130px",
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: 2,
                  background: "linear-gradient(90deg, #2563eb, #60a5fa)",
                  borderRadius: 2,
                  marginBottom: "14px",
                  transformOrigin: "left",
                }}
              />
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    color: "#60a5fa",
                  }}
                >
                  Question {currentIndex + 1} of {questions.length}
                </span>
                {currentQuestion?.difficulty && (
                  <span
                    className="text-xs px-2.5 py-1 rounded-full capitalize"
                    style={{
                      background:
                        currentQuestion.difficulty === "hard"
                          ? "rgba(239,68,68,0.08)"
                          : "rgba(34,197,94,0.08)",
                      border: `1px solid ${currentQuestion.difficulty === "hard" ? "rgba(239,68,68,0.22)" : "rgba(34,197,94,0.22)"}`,
                      color:
                        currentQuestion.difficulty === "hard"
                          ? "#f87171"
                          : "#4ade80",
                    }}
                  >
                    {currentQuestion.difficulty}
                  </span>
                )}
              </div>

              {/* Question text — shows only after AI speaks */}
              {questionVisible ? (
                <motion.p
                  key={`q-${currentIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-white text-base leading-relaxed"
                >
                  {currentQuestion?.question}
                </motion.p>
              ) : (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <FaSpinner className="text-blue-400 text-xs" />
                  </motion.div>
                  <p className="text-gray-500 text-sm">
                    AI is asking the question...
                  </p>
                </div>
              )}
            </div>

            {/* ── Answer textarea — fixed height ── */}
            <div
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "rgba(8,12,24,0.85)",
                border: "1px solid rgba(255,255,255,0.07)",
                height: "180px",
              }}
            >
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!isAnswering}
                placeholder={
                  isAISpeaking
                    ? "Wait for AI to finish..."
                    : isFeedback
                      ? "Feedback received. Click Next to continue."
                      : "Type your answer or use the mic..."
                }
                style={{
                  flex: 1,
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  lineHeight: "1.75",
                  padding: "16px 20px",
                  resize: "none",
                  width: "100%",
                  opacity: isAnswering ? 1 : 0.4,
                }}
                className="placeholder-gray-700"
              />

              {/* Listening wave — inside textarea, fixed height */}
              <div
                style={{
                  height: "28px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: "20px",
                  paddingBottom: "8px",
                }}
              >
                {isMicOn && isAnswering && (
                  <div className="flex items-center gap-2">
                    <div
                      className="flex gap-0.5 items-end"
                      style={{ height: "12px" }}
                    >
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["2px", "9px", "2px"] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.7,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                          style={{
                            width: "3px",
                            background: "#3b82f6",
                            borderRadius: "2px",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-blue-500 text-xs">Listening...</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Feedback div — fixed height ── */}
            <div style={{ minHeight: "72px" }}>
              <AnimatePresence mode="wait">
                {isSubmitting && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl px-5 py-4 flex items-center gap-3"
                    style={{
                      background: "rgba(59,130,246,0.05)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner className="text-blue-400 text-sm" />
                    </motion.div>
                    <p className="text-gray-400 text-sm">
                      Evaluating your answer...
                    </p>
                  </motion.div>
                )}

                {isFeedback && feedback && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl px-5 py-4"
                    style={{
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.25)",
                        }}
                      >
                        <FaLightbulb className="text-green-400 text-xs" />
                      </div>
                      <div>
                        <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-1">
                          AI Feedback
                        </p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {feedback}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {phase === PHASE.FINISHING && (
                  <motion.div
                    key="finishing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl px-5 py-4 flex items-center gap-3"
                    style={{
                      background: "rgba(59,130,246,0.05)",
                      border: "1px solid rgba(59,130,246,0.15)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    >
                      <FaSpinner className="text-blue-400 text-sm" />
                    </motion.div>
                    <p className="text-gray-400 text-sm">
                      Generating your report...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Action bar — fixed height, no layout shift ── */}
            <div
              style={{
                height: "52px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Mic */}
              <button
                onClick={toggleMic}
                disabled={!isAnswering}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                  overflow: "hidden",
                  background: isMicOn
                    ? "rgba(59,130,246,0.12)"
                    : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isMicOn ? "rgba(59,130,246,0.3)" : "rgba(239,68,68,0.28)"}`,
                  opacity: isAnswering ? 1 : 0.35,
                  cursor: isAnswering ? "pointer" : "not-allowed",
                  transform: "translateZ(0)",
                }}
              >
                {isMicOn && isAnswering && (
                  <motion.div
                    animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0, 0.35] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "12px",
                      border: "1px solid rgba(59,130,246,0.35)",
                    }}
                  />
                )}
                {isMicOn ? (
                  <FaMicrophone className="text-blue-400" />
                ) : (
                  <FaMicrophoneSlash className="text-red-400" />
                )}
              </button>

              {/* Skip */}
              <button
                onClick={handleSkip}
                disabled={!canSkip}
                style={{
                  height: "48px",
                  padding: "0 18px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                  fontSize: "13px",
                  fontWeight: 600,
                  background: canSkip
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${canSkip ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)"}`,
                  color: canSkip ? "#9ca3af" : "#374151",
                  cursor: canSkip ? "pointer" : "not-allowed",
                  transform: "translateZ(0)",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (canSkip)
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (canSkip)
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseDown={(e) => {
                  if (canSkip)
                    e.currentTarget.style.transform =
                      "scale(0.97) translateZ(0)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateZ(0)";
                }}
              >
                <FaForward className="text-xs" />
                Skip
              </button>

              {/* Submit Answer */}
              <button
                onClick={() => submitAnswer(answer)}
                disabled={!canSubmit}
                style={{
                  flex: 1,
                  height: "48px",
                  borderRadius: "12px",
                  // display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  background: canSubmit
                    ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                    : "rgba(255,255,255,0.04)",
                  color: canSubmit ? "#fff" : "#374151",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  position: "relative",
                  overflow: "hidden",
                  transform: "translateZ(0)",
                  transition: "background 0.3s, color 0.3s",
                  display: isFeedback ? "none" : "flex",
                }}
                onMouseEnter={(e) => {
                  if (canSubmit)
                    e.currentTarget.style.boxShadow =
                      "0 0 24px rgba(59,130,246,0.38)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                onMouseDown={(e) => {
                  if (canSubmit)
                    e.currentTarget.style.transform =
                      "scale(0.985) translateZ(0)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "translateZ(0)";
                }}
              >
                {canSubmit && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                      repeatDelay: 1.5,
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
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                      style={{ display: "inline-flex" }}
                    >
                      <FaSpinner className="text-sm" />
                    </motion.span>
                    Evaluating...
                  </>
                ) : (
                  <>
                    Submit Answer <FaArrowRight className="text-xs" />
                  </>
                )}
              </button>

              {/* Next Question / Generate Report */}
              {isFeedback && (
                <button
                  onClick={handleNext}
                  disabled={isFinishing}
                  style={{
                    flex: 1,
                    height: "48px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: isLastQuestion
                      ? "linear-gradient(135deg, #16a34a, #15803d)"
                      : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    cursor: isFinishing ? "not-allowed" : "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transform: "translateZ(0)",
                    opacity: isFinishing ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isFinishing)
                      e.currentTarget.style.boxShadow = isLastQuestion
                        ? "0 0 24px rgba(22,163,74,0.4)"
                        : "0 0 24px rgba(59,130,246,0.38)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onMouseDown={(e) => {
                    if (!isFinishing)
                      e.currentTarget.style.transform =
                        "scale(0.985) translateZ(0)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "translateZ(0)";
                  }}
                >
                  {/* Shimmer */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                      repeatDelay: 1.5,
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
                  {isFinishing ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: "linear",
                        }}
                        style={{ display: "inline-flex" }}
                      >
                        <FaSpinner className="text-sm" />
                      </motion.span>
                      Generating...
                    </>
                  ) : isLastQuestion ? (
                    <>
                      Submit & Generate Report{" "}
                      <FaCheckCircle className="text-xs" />
                    </>
                  ) : (
                    <>
                      Next Question{" "}
                      <MdOutlineNavigateNext className="text-base" />
                    </>
                  )}
                </button>
              )}
            </div>

            {/* ── Status hint — fixed height ── */}
            <div style={{ height: "18px", textAlign: "center" }}>
              <p className="text-gray-700 text-xs">
                {phase === PHASE.INTRO && "AI is introducing the interview..."}
                {phase === PHASE.AI_SPEAKING &&
                  "AI is reading your question..."}
                {phase === PHASE.ANSWERING &&
                  "Answer verbally or type · Click Skip to move on"}
                {phase === PHASE.SUBMITTING &&
                  "Sending your answer for evaluation..."}
                {phase === PHASE.FEEDBACK &&
                  (isLastQuestion
                    ? "Click 'Submit & Generate Report' to finish"
                    : "Click 'Next Question' to continue")}
                {phase === PHASE.FINISHING &&
                  "Please wait while we generate your report..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
