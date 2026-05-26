import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireTier } from "../middleware/plan.middleware.js";

export const recruiterRouter = Router();

recruiterRouter.post(
  "/recruiter/tests",
  requireAuth,
  requireTier("enterprise"),
  asyncHandler(async (req, res) => {
    return res.status(201).json(success({ testId: "test_placeholder", questionPool: req.body.questionPool ?? [], timeLimitMinutes: req.body.timeLimitMinutes ?? 30 }));
  })
);

recruiterRouter.post(
  "/recruiter/invite",
  requireAuth,
  requireTier("enterprise"),
  asyncHandler(async (req, res) => {
    return res.json(success({ inviteLink: `https://app.intervuex.local/session/${Date.now()}`, candidateEmail: req.body.email ?? "" }));
  })
);
