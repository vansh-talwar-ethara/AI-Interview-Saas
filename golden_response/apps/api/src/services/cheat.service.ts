import { SessionFlagModel } from "../models/sessionFlag.model.js";

export async function recordSuspiciousSession(input: { interviewId: string; userId: string; type: string; details?: string }) {
  await SessionFlagModel.create(input);
}
