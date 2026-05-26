import { Schema, model } from "mongoose";

const resumeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    rawText: { type: String, default: "" },
    extractedSkills: [{ type: String }],
    projectNames: [{ type: String }],
    technologies: [{ type: String }],
    experienceMonths: { type: Number, default: 0 },
    sourceFileName: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ResumeModel = model("Resume", resumeSchema);
