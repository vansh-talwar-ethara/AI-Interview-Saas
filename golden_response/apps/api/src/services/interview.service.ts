import { Types } from "mongoose";
import { InterviewModel } from "../models/interview.model.js";
import { QuestionModel } from "../models/question.model.js";
import { buildInterviewPrompt, nextFallbackQuestion } from "./ai.service.js";

export async function createInterviewSession(payload: {
  userId: string;
  interviewType: "technical" | "dsa" | "system-design" | "behavioral" | "project";
  role: "frontend" | "backend" | "mern" | "devops" | "ai-ml" | "java" | "python";
  difficulty: "beginner" | "intermediate" | "advanced";
  companyStyle: "google-like" | "amazon-like" | "startup" | "faang-pressure" | "beginner-friendly";
  persona: "strict" | "friendly-mentor" | "faang-pressure" | "rude-startup-cto" | "fast-hr-recruiter";
}) {
  const interview = await InterviewModel.create({ ...payload, userId: new Types.ObjectId(payload.userId), status: "active", startedAt: new Date(), questionIds: [] });
  return interview;
}

export async function generateNextQuestion(interviewId: string, usedQuestions: string[], context: Parameters<typeof buildInterviewPrompt>[0]) {
  const prompt = buildInterviewPrompt(context);
  const questionText = nextFallbackQuestion(usedQuestions);
  const question = await QuestionModel.create({ interviewId: new Types.ObjectId(interviewId), text: questionText, type: context.interviewType, difficulty: context.difficulty });
  return { prompt, question };
}
