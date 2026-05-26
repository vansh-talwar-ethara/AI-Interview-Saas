import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.4fr,0.9fr] lg:items-center">
      <div className="space-y-6">
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-200">
          AI interview simulator
        </div>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white md:text-6xl">
          Practice technical interviews with a system that listens, adapts, and pushes back.
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">
          Voice, text, live coding, behavioral analysis, resume-specific prompts, and recruiter workflows all run through one interview engine.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/studio" className="rounded-full bg-orange-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-orange-400">
            Start a mock interview
          </Link>
          <Link to="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
            View feedback dashboard
          </Link>
        </div>
      </div>
      <div className="glass grid-panel rounded-[2rem] p-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Session preview</p>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl bg-white/5 p-4">Question: Explain how you would secure JWTs in a browser app.</div>
            <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-100">Follow-up: What changes when the token is stored in localStorage versus an httpOnly cookie?</div>
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-100">Behavioral signal: speaking pace and confidence scored inline.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
