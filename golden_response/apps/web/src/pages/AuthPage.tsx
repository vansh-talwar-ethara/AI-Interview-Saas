import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const authPanelStyles = {
  input: "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400/70 focus:bg-white/10",
  button: "rounded-2xl px-5 py-3 font-medium transition",
};

function loadGoogleScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-oauth="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google sign-in")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleOauth = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in"));
    document.head.appendChild(script);
  });
}

export function AuthPage() {
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    let mounted = true;

    void loadGoogleScript()
      .then(() => {
        if (!mounted || !window.google || !googleButtonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response.credential) {
              return;
            }

            try {
              setError("");
              await loginWithGoogle(response.credential);
              navigate("/dashboard", { replace: true });
            } catch (authError) {
              setError(authError instanceof Error ? authError.message : "Google sign-in failed");
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          width: 360,
          text: "continue_with",
          shape: "rectangular",
        });
        setIsGoogleReady(true);
      })
      .catch((scriptError) => setError(scriptError instanceof Error ? scriptError.message : "Google sign-in unavailable"));

    return () => {
      mounted = false;
    };
  }, [googleClientId, loginWithGoogle, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "").trim();
    const displayName = String(formData.get("displayName") ?? "").trim();

    try {
      setError("");
      setIsSubmitting(true);

      if (mode === "register") {
        await register({ email, password, displayName: displayName || email.split("@")[0] });
      } else {
        await login({ email, password });
      }

      navigate("/dashboard", { replace: true });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const subtitle = useMemo(
    () => (mode === "register" ? "Create a workspace account" : "Sign in to continue your interview flow"),
    [mode]
  );

  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr] lg:items-stretch">
      <div className="glass rounded-[2rem] p-8">
        <div className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-100">
          {mode === "register" ? "Join IntervueX" : "Welcome back"}
        </div>
        <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
          {mode === "register" ? "Create your account and start practicing immediately." : "Sign in and pick up exactly where you left off."}
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-300">{subtitle}</p>

        <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-300">
          <div className="rounded-2xl bg-white/5 p-4">JWT sessions keep you signed in across refreshes.</div>
          <div className="rounded-2xl bg-orange-500/10 p-4 text-orange-100">Google OAuth works once you add `VITE_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`.</div>
          <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-100">Your display name appears in the navbar after login.</div>
        </div>
      </div>

      <div className="glass rounded-[2rem] p-8">
        <div className="mb-6 flex gap-2 rounded-full bg-white/5 p-1 text-sm text-slate-300">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-4 py-2 transition ${mode === "login" ? "bg-white text-slate-950" : "hover:bg-white/10"}`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-full px-4 py-2 transition ${mode === "register" ? "bg-white text-slate-950" : "hover:bg-white/10"}`}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <input className={authPanelStyles.input} name="displayName" placeholder="Display name" autoComplete="name" />
          )}
          <input className={authPanelStyles.input} name="email" type="email" placeholder="Email address" autoComplete="email" required />
          <input
            className={authPanelStyles.input}
            name="password"
            type="password"
            placeholder="Password"
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
          />

          {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${authPanelStyles.button} w-full bg-orange-500 text-slate-950 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isSubmitting ? "Please wait..." : mode === "register" ? "Create account" : "Log in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <span className="h-px flex-1 bg-white/10" />
          or
          <span className="h-px flex-1 bg-white/10" />
        </div>

        {googleClientId ? (
          <>
            <div ref={googleButtonRef} className="min-h-[48px]" />
            {!isGoogleReady && <p className="mt-3 text-sm text-slate-400">Loading Google sign-in...</p>}
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Add `VITE_GOOGLE_CLIENT_ID` to enable Google OAuth sign-in in the frontend.
          </div>
        )}
      </div>
    </section>
  );
}