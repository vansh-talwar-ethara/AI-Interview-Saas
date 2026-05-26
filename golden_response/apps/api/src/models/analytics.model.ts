import { Schema, model } from "mongoose";

const analyticsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    interviewId: { type: Schema.Types.ObjectId, ref: "Interview", index: true, required: true },
    scoreBreakdown: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
    },
    behavioralMetrics: {
      fillerWords: { type: Number, default: 0 },
      wordsPerMinute: { type: Number, default: 0 },
      clarityScore: { type: Number, default: 0 },
      confidenceScore: { type: Number, default: 0 },
    },
    weakTopics: [{ type: String }],
    trendPoints: [{ label: String, score: Number }],
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AnalyticsModel = model("Analytics", analyticsSchema);
