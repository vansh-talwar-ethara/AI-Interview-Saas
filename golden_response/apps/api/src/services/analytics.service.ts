import { AnalyticsModel } from "../models/analytics.model.js";

export async function getSessionAnalytics(interviewId: string) {
  const analytics = await AnalyticsModel.findOne({ interviewId }).lean();
  return analytics ?? {
    scoreBreakdown: { technical: 0, communication: 0, problemSolving: 0 },
    behavioralMetrics: { fillerWords: 0, wordsPerMinute: 0, clarityScore: 0, confidenceScore: 0 },
    weakTopics: [],
    trendPoints: [],
    flagged: false,
  };
}
