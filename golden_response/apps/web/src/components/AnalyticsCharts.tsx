import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";

export type AnalyticsPoint = { label: string; score: number };
export type WeakTopicPoint = { topic: string; count: number };

export default function AnalyticsCharts({ trend, weakTopics }: { trend: AnalyticsPoint[]; weakTopics: WeakTopicPoint[] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="glass rounded-3xl p-5">
        <h3 className="mb-4 text-lg font-semibold">Score trend</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="glass rounded-3xl p-5">
        <h3 className="mb-4 text-lg font-semibold">Weak topics</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weakTopics}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="topic" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#34d399" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
