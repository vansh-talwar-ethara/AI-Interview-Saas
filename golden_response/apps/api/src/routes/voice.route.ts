import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import { requireAuth, type AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { canUseVoice } from "../middleware/plan.middleware.js";
import { synthesizeSpeech, transcribeAudio } from "../services/voice.service.js";

export const voiceRouter = Router();

voiceRouter.post(
  "/voice/transcribe",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    if (!canUseVoice(req.user?.tier ?? "free")) {
      return res.status(403).json({ success: false, data: null, error: "PLAN_REQUIRED: Voice is not available on the free tier" });
    }
    const transcript = await transcribeAudio(Buffer.from(req.body.audioBase64 ?? "", "base64"));
    return res.json(success(transcript));
  })
);

voiceRouter.post(
  "/voice/tts",
  requireAuth,
  asyncHandler(async (req: AuthenticatedRequest, res) => {
    const result = await synthesizeSpeech(req.body.text ?? "");
    return res.json(success(result));
  })
);
