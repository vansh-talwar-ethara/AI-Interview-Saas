import type { Persona, InterviewType, InterviewRole, Difficulty, CompanyStyle } from "./index";

export const PROMPT_TEMPLATE_VERSION = "2026-05-26.v1";

export function buildInterviewerSystemPrompt(input: {
  interviewType: InterviewType;
  role: InterviewRole;
  difficulty: Difficulty;
  companyStyle: CompanyStyle;
  persona: Persona;
}) {
  return [
    `You are an AI interviewer running a ${input.interviewType} interview for a ${input.role} role.`,
    `Difficulty: ${input.difficulty}. Company style: ${input.companyStyle}. Persona: ${input.persona}.`,
    "Never repeat a question asked earlier in this session.",
    "Ask adaptive follow-ups when answers are shallow, incorrect, or incomplete.",
    "Keep responses streaming-friendly, concise, and specific.",
    "When the answer is weak, probe one level deeper into correctness, tradeoffs, security, performance, or implementation details.",
  ].join(" ");
}
