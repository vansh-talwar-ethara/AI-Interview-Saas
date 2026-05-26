import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";
import { PLAN_LIMITS } from "@intervuex/shared";

export function requireTier(minTier: "pro" | "enterprise") {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const tier = req.user?.tier ?? "free";
    if (minTier === "enterprise" && tier !== "enterprise") {
      return res.status(403).json({ success: false, data: null, error: "PLAN_REQUIRED: Enterprise plan required" });
    }
    if (minTier === "pro" && tier === "free") {
      return res.status(403).json({ success: false, data: null, error: "PLAN_REQUIRED: Pro plan required" });
    }
    return next();
  };
}

export function canUseVoice(tier: string) {
  return tier !== "free" || PLAN_LIMITS.free.voiceEnabled;
}
