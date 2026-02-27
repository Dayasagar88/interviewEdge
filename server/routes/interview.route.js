import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interview.controller.js";

const InterviewRouter = express.Router();

InterviewRouter.post(
  "/resume-analysis",
  isAuth,
  upload.single("resume"),
  analyzeResume,
);

export default InterviewRouter;