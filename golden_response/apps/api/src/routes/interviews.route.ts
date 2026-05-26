import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { createInterviewSession, generateNextQuestion } from "../services/interview.service.js";

const freeAiLimit = rateLimit({
  windowMs: 60_000,
  max: (req) => ((req as AuthenticatedRequest).user?.tier === "free" ? 10 : 1000),
  standardHeaders: true,
  legacyHeaders: false,
});

export const interviewsRouter = Router();

interviewsRouter.post(
  "/interviews",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const interview = await createInterviewSession({
      userId: req.user!.userId,
      interviewType: req.body.interviewType,
      role: req.body.role,
      difficulty: req.body.difficulty,
      companyStyle: req.body.companyStyle,
      persona: req.body.persona,
    });
    return res.status(201).json(success(interview));
  })
);

interviewsRouter.post(
  "/interviews/:interviewId/questions/next",
  requireAuth,
  freeAiLimit,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = await generateNextQuestion(String(req.params.interviewId), (req.body.usedQuestions ?? []) as string[], req.body);
    return res.json(success(result));
  })
);
