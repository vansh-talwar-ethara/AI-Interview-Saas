import { buildInterviewerSystemPrompt, PROMPT_TEMPLATE_VERSION, type CompanyStyle, type Difficulty, type InterviewRole, type InterviewType, type Persona } from "@intervuex/shared";

const fallbackQuestions = [
  "Walk me through the tradeoffs in your implementation.",
  "What could fail under load and how would you handle it?",
  "How would you improve the security or reliability of this approach?",
];

export function buildInterviewPrompt(input: {
  interviewType: InterviewType;
  role: InterviewRole;
  difficulty: Difficulty;
  companyStyle: CompanyStyle;
  persona: Persona;
}) {
  return {
    templateVersion: PROMPT_TEMPLATE_VERSION,
    systemPrompt: buildInterviewerSystemPrompt(input),
  };
}

export async function streamAiResponse(prompt: string) {
  return { text: `[stream:${prompt.slice(0, 60)}]` };
}

export function nextFallbackQuestion(usedQuestions: string[]) {
  return fallbackQuestions.find((question) => !usedQuestions.includes(question)) ?? "Tell me more about the strongest technical tradeoff in your answer.";
}
