import type { NextFunction, Request, Response } from "express";
import { logger } from "../config/logger.js";

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, data: null, error: "NOT_FOUND: Route does not exist" });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = error instanceof Error ? error.message : "Unexpected server error";
  logger.error({ error }, message);
  res.status(500).json({ success: false, data: null, error: `INTERNAL_ERROR: ${message}` });
}
