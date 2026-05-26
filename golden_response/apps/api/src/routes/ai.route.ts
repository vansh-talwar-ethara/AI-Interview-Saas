import { Router } from "express";
import rateLimit from "express-rate-limit";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { streamAiResponse } from "../services/ai.service.js";

const aiRateLimit = rateLimit({
  windowMs: 60_000,
  max: (req) => ((req as AuthenticatedRequest).user?.tier === "free" ? 10 : 1000),
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiRouter = Router();

aiRouter.post(
  "/ai/generate",
  requireAuth,
  aiRateLimit,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const response = await streamAiResponse(req.body.prompt ?? "");
    return res.json(success(response));
  })
);
