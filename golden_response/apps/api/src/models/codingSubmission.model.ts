import { Schema, model } from "mongoose";

const codingSubmissionSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    language: { type: String, required: true },
    sourceCode: { type: String, required: true },
    judge0Result: { type: Object, default: {} },
    aiEvaluation: { type: Object, default: {} },
  },
  { timestamps: true }
);

export const CodingSubmissionModel = model("CodingSubmission", codingSubmissionSchema);
