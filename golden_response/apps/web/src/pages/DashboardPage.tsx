import { useEffect, useState, Suspense, lazy } from "react";
import { api } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

const AnalyticsCharts = lazy(() => import("@/components/AnalyticsCharts"));

export function DashboardPage() {
  const interviewId = useAppStore((state) => state.activeInterviewId);
  const [analytics, setAnalytics] = useState<{ scoreBreakdown: { technical: number; communication: number; problemSolving: number }; behavioralMetrics: { fillerWords: number; wordsPerMinute: number; clarityScore: number; confidenceScore: number }; weakTopics: string[]; trendPoints: { label: string; score: number }[] } | null>(null);

  useEffect(() => {
    if (!interviewId) return;
    void api.get(`/analytics/${interviewId}`).then((response) => setAnalytics(response.data.data));
  }, [interviewId]);

  return (
    <section className="space-y-6">
      <div className="glass rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Feedback dashboard</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Structured post-interview analysis</h2>
        <p className="mt-3 max-w-3xl text-slate-300">
          The dashboard consumes backend-fetched analytics so trend charts, weak topics, and behavioral scores stay authoritative and can be reused across sessions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Technical", analytics?.scoreBreakdown.technical ?? 0],
          ["Communication", analytics?.scoreBreakdown.communication ?? 0],
          ["Problem solving", analytics?.scoreBreakdown.problemSolving ?? 0],
        ].map(([label, value]) => (
          <div key={label as string} className="glass rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-3 text-4xl font-semibold text-white">{value as number}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Filler words", analytics?.behavioralMetrics.fillerWords ?? 0],
          ["WPM", analytics?.behavioralMetrics.wordsPerMinute ?? 0],
          ["Clarity", analytics?.behavioralMetrics.clarityScore ?? 0],
          ["Confidence", analytics?.behavioralMetrics.confidenceScore ?? 0],
        ].map(([label, value]) => (
          <div key={label as string} className="glass rounded-[1.5rem] p-4">
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-2 text-2xl font-semibold text-white">{value as number}</div>
          </div>
        ))}
      </div>

      <Suspense fallback={<div className="glass rounded-[2rem] p-10 text-slate-300">Loading charts...</div>}>
        <AnalyticsCharts
          trend={analytics?.trendPoints ?? []}
          weakTopics={(analytics?.weakTopics ?? []).map((topic) => ({ topic, count: 1 }))}
        />
      </Suspense>

      <div className="glass rounded-[2rem] p-6">
        <h3 className="text-lg font-semibold text-white">Improvement roadmap</h3>
        <ul className="mt-4 space-y-3 text-slate-300">
          <li>1. Revisit security tradeoffs around token storage and browser attack surfaces.</li>
          <li>2. Practice explaining system design decisions with tighter structure and confidence.</li>
          <li>3. Add time complexity reasoning before jumping into implementation details.</li>
          <li>4. Reduce filler words by answering in shorter, well-formed chunks.</li>
        </ul>
      </div>
    </section>
  );
}
