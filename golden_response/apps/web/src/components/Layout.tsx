import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";

const links = [
  { to: "/", label: "Home" },
  { to: "/studio", label: "Interview Studio" },
  { to: "/dashboard", label: "Feedback" },
  { to: "/recruiter", label: "Recruiter" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="app-shell text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="glass sticky top-4 z-20 mb-6 flex items-center justify-between rounded-3xl px-5 py-4">
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold tracking-wide text-white">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-500/90 text-slate-950 shadow-glow">IX</span>
            IntervueX
          </Link>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    clsx(
                      "rounded-full px-4 py-2 text-sm transition",
                      isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/8 hover:text-white"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            {user ? (
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
                <div className="hidden sm:block">
                  <div className="font-medium text-white">{user.displayName || user.email}</div>
                  <div className="text-xs text-slate-400">{user.tier} plan</div>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-orange-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-100"
              >
                Log in
              </Link>
            )}
          </div>
        </header>
        <main className="grid flex-1 gap-6">{children}</main>
      </div>
    </div>
  );
}
