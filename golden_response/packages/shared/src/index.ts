export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
  code?: string;
};

export type Tier = "free" | "pro" | "enterprise";
export type InterviewType = "technical" | "dsa" | "system-design" | "behavioral" | "project";
export type InterviewRole = "frontend" | "backend" | "mern" | "devops" | "ai-ml" | "java" | "python";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type CompanyStyle = "google-like" | "amazon-like" | "startup" | "faang-pressure" | "beginner-friendly";
export type Persona = "strict" | "friendly-mentor" | "faang-pressure" | "rude-startup-cto" | "fast-hr-recruiter";
export type SessionStatus = "draft" | "active" | "completed" | "flagged";

export type ScoreBreakdown = {
  technical: number;
  communication: number;
  problemSolving: number;
};

export const PLAN_LIMITS = {
  free: {
    textInterviewsPerDay: 3,
    voiceEnabled: false,
    companyModes: false,
  },
  pro: {
    textInterviewsPerDay: Infinity,
    voiceEnabled: true,
    companyModes: true,
  },
  enterprise: {
    textInterviewsPerDay: Infinity,
    voiceEnabled: true,
    companyModes: true,
  },
} as const;

export const API_RESPONSE_EXAMPLE: ApiResponse<Record<string, never>> = {
  success: true,
  data: null,
  error: null,
};

export * from "./promptTemplates.js";
