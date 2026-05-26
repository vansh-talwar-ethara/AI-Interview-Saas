import { Schema, model, Types } from "mongoose";
import type { CompanyStyle, Difficulty, InterviewRole, InterviewType, Persona, SessionStatus } from "@intervuex/shared";

const interviewSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    interviewType: { type: String, enum: ["technical", "dsa", "system-design", "behavioral", "project"], required: true },
    role: { type: String, enum: ["frontend", "backend", "mern", "devops", "ai-ml", "java", "python"], required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    companyStyle: { type: String, enum: ["google-like", "amazon-like", "startup", "faang-pressure", "beginner-friendly"], required: true },
    persona: { type: String, enum: ["strict", "friendly-mentor", "faang-pressure", "rude-startup-cto", "fast-hr-recruiter"], required: true },
    status: { type: String, enum: ["draft", "active", "completed", "flagged"], default: "draft", index: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    companySpecificMode: { type: Boolean, default: false },
    questionIds: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    suspiciousFlags: [{ type: String }],
  },
  { timestamps: true }
);

export type InterviewDocument = {
  userId: Types.ObjectId;
  interviewType: InterviewType;
  role: InterviewRole;
  difficulty: Difficulty;
  companyStyle: CompanyStyle;
  persona: Persona;
  status: SessionStatus;
  startedAt?: Date;
  endedAt?: Date;
  companySpecificMode: boolean;
  questionIds: Types.ObjectId[];
  suspiciousFlags: string[];
};

export const InterviewModel = model("Interview", interviewSchema);
