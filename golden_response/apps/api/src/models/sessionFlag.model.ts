import { Schema, model } from "mongoose";

const sessionFlagSchema = new Schema(
  {
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    type: { type: String, required: true },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SessionFlagModel = model("SessionFlag", sessionFlagSchema);
