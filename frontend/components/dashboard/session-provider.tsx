"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { User } from "@/lib/types";

type SessionContextValue = {
  token: string;
  user: User | null;
  ready: boolean;
  setSession: (next: { token: string; user: User }) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const TOKEN_KEY = "rateshield-token";
const USER_KEY = "rateshield-user";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem(TOKEN_KEY) ?? "";
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  });
  const [ready, setReady] = useState(typeof window !== "undefined");

  useEffect(() => {
    if (!ready) {
      const timeoutId = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [ready]);

  function setSession(next: { token: string; user: User }) {
    localStorage.setItem(TOKEN_KEY, next.token);
    localStorage.setItem(USER_KEY, JSON.stringify(next.user));
    setToken(next.token);
    setUser(next.user);
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken("");
    setUser(null);
  }

  return (
    <SessionContext.Provider value={{ token, user, ready, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return value;
}
