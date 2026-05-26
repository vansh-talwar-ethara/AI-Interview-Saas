import React from "react";

const MonacoEditor = React.lazy(() => import("@monaco-editor/react"));

export function LazyMonacoEditor(props: any) {
  return (
    <React.Suspense
      fallback={<div className="grid h-80 place-items-center rounded-2xl border border-white/10 bg-slate-950/70 text-slate-400">Loading code editor...</div>}
    >
      <MonacoEditor {...props} />
    </React.Suspense>
  );
}
