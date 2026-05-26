import { create } from "zustand";
import { api } from "@/lib/api";

const SESSION_KEY = "intervuex_auth_session";
const ACCESS_TOKEN_KEY = "intervuex_access_token";
const REFRESH_TOKEN_KEY = "intervuex_refresh_token";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  tier: string;
};

type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

type Credentials = {
  email: string;
  password: string;
};

type RegisterCredentials = Credentials & {
  displayName: string;
};

type AuthState = {
  user: AuthUser | null;
  accessToken: string;
  refreshToken: string;
  isHydrated: boolean;
  hydrate: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  register: (credentials: RegisterCredentials) => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
};

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
}

async function postAuth<T>(path: string, payload: unknown) {
  const response = await api.post<{ success: boolean; data: T; error: string | null }>(path, payload);
  return response.data.data;
}

const initialSession = readStoredSession();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialSession?.user ?? null,
  accessToken: initialSession?.accessToken ?? "",
  refreshToken: initialSession?.refreshToken ?? "",
  isHydrated: false,
  hydrate: () => {
    const session = readStoredSession();
    set({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? "",
      refreshToken: session?.refreshToken ?? "",
      isHydrated: true,
    });
  },
  setSession: (session) => {
    persistSession(session);
    set({
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      isHydrated: true,
    });
  },
  clearSession: () => {
    persistSession(null);
    set({ user: null, accessToken: "", refreshToken: "", isHydrated: true });
  },
  register: async (credentials) => {
    const session = await postAuth<AuthSession>("/auth/register", credentials);
    if (!session) {
      throw new Error("Registration failed");
    }

    persistSession(session);
    set({ user: session.user, accessToken: session.accessToken, refreshToken: session.refreshToken, isHydrated: true });
  },
  login: async (credentials) => {
    const session = await postAuth<AuthSession>("/auth/login", credentials);
    if (!session) {
      throw new Error("Login failed");
    }

    persistSession(session);
    set({ user: session.user, accessToken: session.accessToken, refreshToken: session.refreshToken, isHydrated: true });
  },
  loginWithGoogle: async (credential) => {
    const session = await postAuth<AuthSession>("/auth/oauth/google", { credential });
    if (!session) {
      throw new Error("Google sign-in failed");
    }

    persistSession(session);
    set({ user: session.user, accessToken: session.accessToken, refreshToken: session.refreshToken, isHydrated: true });
  },
  logout: async () => {
    try {
      if (typeof window !== "undefined") {
        const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          await api.post("/auth/logout", { refreshToken });
        }
      }
    } finally {
      persistSession(null);
      set({ user: null, accessToken: "", refreshToken: "", isHydrated: true });
    }
  },
}));