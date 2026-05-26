import { create } from "zustand";
import type { CompanyStyle, Difficulty, InterviewRole, InterviewType, Persona } from "@intervuex/shared";

type AppState = {
  interviewType: InterviewType;
  role: InterviewRole;
  difficulty: Difficulty;
  companyStyle: CompanyStyle;
  persona: Persona;
  activeInterviewId: string;
  transcript: string;
  setField: <K extends keyof Pick<AppState, "interviewType" | "role" | "difficulty" | "companyStyle" | "persona">>(key: K, value: AppState[K]) => void;
  setActiveInterviewId: (id: string) => void;
  setTranscript: (value: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  interviewType: "technical",
  role: "mern",
  difficulty: "intermediate",
  companyStyle: "startup",
  persona: "friendly-mentor",
  activeInterviewId: "",
  transcript: "",
  setField: (key, value) => set({ [key]: value } as Partial<AppState>),
  setActiveInterviewId: (id) => set({ activeInterviewId: id }),
  setTranscript: (value) => set({ transcript: value }),
}));
