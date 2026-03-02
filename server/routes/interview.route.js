import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  analyzeResume,
  finishInterview,
  generateQuestion,
  getInterviewHistory,
  getInterviewReport,
  submitAnswer,
} from "../controllers/interview.controller.js";

const InterviewRouter = express.Router();

InterviewRouter.post(
  "/resume-analysis",
  isAuth,
  upload.single("resume"),
  analyzeResume,
);
InterviewRouter.post("/generate-questions", isAuth, generateQuestion);
InterviewRouter.post("/submit-answers", isAuth, submitAnswer);
InterviewRouter.post("/finish-interview", isAuth, finishInterview);

InterviewRouter.get("/get-interview", isAuth, getInterviewHistory);
InterviewRouter.get("/interview-report/:id", isAuth, getInterviewReport);

export default InterviewRouter;
