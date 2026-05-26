import { Schema, model, Types } from "mongoose";

const questionSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true, required: true },
    text: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    followUpOf: { type: Schema.Types.ObjectId, ref: "Question", default: null },
    askedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const QuestionModel = model("Question", questionSchema);
