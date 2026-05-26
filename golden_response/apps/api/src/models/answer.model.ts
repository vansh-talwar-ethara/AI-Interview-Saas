import { Schema, model } from "mongoose";

const answerSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true, required: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question", index: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    responseText: { type: String, default: "" },
    transcript: { type: String, default: "" },
    evaluation: { type: Object, default: {} },
    followUpHistory: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    scores: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const AnswerModel = model("Answer", answerSchema);
