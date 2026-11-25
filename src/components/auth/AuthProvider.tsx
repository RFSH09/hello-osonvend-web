"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { LoginSheet } from "./LoginSheet";

type User = { phone: string }; // 9 national digits
type Ctx = {
  user: User | null;
  ready: boolean;
  logout: () => void;
  /** Opens the login sheet; `onSuccess` runs after a successful sign-in. */
  openLogin: (onSuccess?: () => void) => void;
};

const AuthCtx = createContext<Ctx | null>(null);
const KEY = "hello.session";

export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [after, setAfter] = useState<(() => void) | undefined>();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const openLogin = useCallback((onSuccess?: () => void) => {
    setAfter(() => onSuccess);
    setOpen(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    } catch {}
  }, []);

  function onLoggedIn(phone: string, remember: boolean) {
    const u = { phone };
    setUser(u);
    try {
      (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(u));
    } catch {}
    setOpen(false);
    const cb = after;
    setAfter(undefined);
    cb?.();
  }

  return (
    <AuthCtx.Provider value={{ user, ready, logout, openLogin }}>
      {children}
      <LoginSheet open={open} onClose={() => setOpen(false)} onLoggedIn={onLoggedIn} />
    </AuthCtx.Provider>
  );
}
