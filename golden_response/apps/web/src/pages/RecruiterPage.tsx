import { useState } from "react";
import { api } from "@/lib/api";

export function RecruiterPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteResult, setInviteResult] = useState("");

  async function inviteCandidate() {
    const response = await api.post("/recruiter/invite", { email: inviteEmail });
    setInviteResult(response.data.data.inviteLink);
  }

  return (
    <section className="space-y-6">
      <div className="glass rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Enterprise dashboard</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Candidate management and shortlisting</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-[2rem] p-6">
          <h3 className="text-xl font-semibold text-white">Invite a candidate</h3>
          <div className="mt-4 flex gap-3">
            <input value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="candidate@company.com" className="flex-1 rounded-full border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none" />
            <button onClick={inviteCandidate} className="rounded-full bg-orange-500 px-5 py-3 font-medium text-slate-950">Send</button>
          </div>
          {inviteResult ? <p className="mt-4 break-all text-sm text-emerald-300">Session link: {inviteResult}</p> : null}
        </div>

        <div className="glass rounded-[2rem] p-6">
          <h3 className="text-xl font-semibold text-white">Auto-shortlist rules</h3>
          <ul className="mt-4 space-y-3 text-slate-300">
            <li>• Score threshold configurable per campaign.</li>
            <li>• Behavioral flags are surfaced, never auto-disqualify.</li>
            <li>• PDF report export can be added on the backend report job pipeline.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
