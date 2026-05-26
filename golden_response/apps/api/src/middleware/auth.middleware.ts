import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export type AuthenticatedRequest = Request & { user?: { userId: string; tier: string } };

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, data: null, error: "AUTH_REQUIRED: Missing access token" });
  }

  try {
    req.user = verifyAccessToken<{ userId: string; tier: string }>(header.slice(7));
    return next();
  } catch {
    return res.status(401).json({ success: false, data: null, error: "AUTH_INVALID: Token is invalid or expired" });
  }
}
