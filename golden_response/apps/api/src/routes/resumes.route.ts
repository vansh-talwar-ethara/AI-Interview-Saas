import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { deriveResumeInsights, extractResumeText } from "../services/resume.service.js";
import { ResumeModel } from "../models/resume.model.js";

const upload = multer({ storage: multer.memoryStorage() });

export const resumesRouter = Router();

resumesRouter.post(
  "/resumes/upload",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, data: null, error: "VALIDATION_ERROR: Resume file is required" });
    }

    const rawText = await extractResumeText(file.buffer, file.originalname);
    const insights = deriveResumeInsights(rawText);
    const resume = await ResumeModel.create({ userId: req.user!.userId, rawText, sourceFileName: file.originalname, ...insights });
    return res.status(201).json(success(resume));
  })
);
