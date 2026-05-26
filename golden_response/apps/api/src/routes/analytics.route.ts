import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { getSessionAnalytics } from "../services/analytics.service.js";

export const analyticsRouter = Router();

analyticsRouter.get(
  "/analytics/:interviewId",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const analytics = await getSessionAnalytics(String(req.params.interviewId));
    return res.json(success(analytics));
  })
);
