import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { evaluateCodeSubmission } from "../services/coding.service.js";

export const codingRouter = Router();

codingRouter.post(
  "/coding/submissions",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const evaluation = await evaluateCodeSubmission({ sourceCode: req.body.sourceCode ?? "", language: req.body.language ?? "javascript" });
    return res.json(success({ ...evaluation, userId: req.user!.userId }));
  })
);
