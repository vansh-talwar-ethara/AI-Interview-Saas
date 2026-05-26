import { useEffect, useMemo, useState, Suspense } from "react";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useAppStore } from "@/store/useAppStore";
import { LazyMonacoEditor } from "@/components/LazyMonacoEditor";

const configFields = [
  { key: "interviewType", label: "Interview type", options: ["technical", "dsa", "system-design", "behavioral", "project"] },
  { key: "role", label: "Role", options: ["frontend", "backend", "mern", "devops", "ai-ml", "java", "python"] },
  { key: "difficulty", label: "Difficulty", options: ["beginner", "intermediate", "advanced"] },
  { key: "companyStyle", label: "Company style", options: ["google-like", "amazon-like", "startup", "faang-pressure", "beginner-friendly"] },
  { key: "persona", label: "Persona", options: ["strict", "friendly-mentor", "faang-pressure", "rude-startup-cto", "fast-hr-recruiter"] },
] as const;

export function StudioPage() {
  const store = useAppStore();
  const [editorValue, setEditorValue] = useState("function solve(input) {\n  return input;\n}");
  const [status, setStatus] = useState("Idle");
  const [voiceUnavailable, setVoiceUnavailable] = useState(true);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const config = useMemo(
    () => ({
      interviewType: store.interviewType,
      role: store.role,
      difficulty: store.difficulty,
      companyStyle: store.companyStyle,
      persona: store.persona,
    }),
    [store]
  );

  async function startInterview() {
    setStatus("Creating session...");
    const response = await api.post("/interviews", config);
    store.setActiveInterviewId(response.data.data.id ?? response.data.data._id ?? "");
    socket.emit("join-session", { sessionId: response.data.data._id ?? response.data.data.id });
    setStatus("Interview active");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
      <div className="glass rounded-[2rem] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Interview studio</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">AI interviewer control room</h2>
          </div>
          <button onClick={startInterview} className="rounded-full bg-orange-500 px-5 py-3 font-medium text-slate-950 transition hover:bg-orange-400">
            Start session
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {configFields.map((field) => (
            <label key={field.key as string} className="space-y-2 text-sm text-slate-300">
              <span>{field.label}</span>
              <select
                value={config[field.key]}
                onChange={(event) => store.setField(field.key, event.target.value as never)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-orange-400"
              >
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Behavioral telemetry</p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Filler words</span><strong>7</strong></div>
              <div className="flex justify-between"><span>Words per minute</span><strong>146</strong></div>
              <div className="flex justify-between"><span>Clarity</span><strong>82</strong></div>
              <div className="flex justify-between"><span>Confidence</span><strong>76</strong></div>
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Voice status</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-300">
              {voiceUnavailable ? "Microphone unavailable. Text mode is active with interrupt-aware streaming fallback." : "Voice pipeline active."}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live transcript</p>
          <textarea
            value={store.transcript}
            onChange={(event) => store.setTranscript(event.target.value)}
            placeholder="Type or paste the candidate response here while the voice pipeline is unavailable."
            className="mt-4 min-h-40 w-full rounded-2xl border border-white/10 bg-transparent p-4 text-slate-100 outline-none"
          />
          <div className="mt-4 flex items-center gap-3">
            <button onClick={() => setStatus("Transcript sent to AI evaluator")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
              Evaluate response
            </button>
            <span className="text-sm text-slate-400">{status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="glass rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Live coding</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Monaco editor, loaded on demand</h3>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10">
            <Suspense fallback={null}>
              <LazyMonacoEditor
                height="320px"
                defaultLanguage="typescript"
                theme="vs-dark"
                value={editorValue}
                onChange={(value: string | undefined) => setEditorValue(value ?? "")}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </Suspense>
          </div>
          <button className="mt-4 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950">Submit code</button>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Adaptive follow-up</p>
          <div className="mt-4 rounded-2xl bg-orange-500/10 p-4 text-sm text-orange-100">
            If the answer is shallow, the next question should probe security, tradeoffs, and implementation details instead of repeating the prompt.
          </div>
        </div>
      </div>
    </section>
  );
}
