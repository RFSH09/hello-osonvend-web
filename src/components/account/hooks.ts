"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getVersion, readDb, sessionPhone, subscribe } from "@/lib/account/store";

export function useStoreVersion() {
  return useSyncExternalStore(subscribe, getVersion, () => 0);
}

export type Async<T> =
  | { status: "loading"; data: undefined }
  | { status: "error"; data: undefined; retry: () => void }
  | { status: "ok"; data: T; retry: () => void };

/** Loads data via an async account API call; reloads when the mock store changes. */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): Async<T> {
  const version = useStoreVersion();
  const [state, setState] = useState<{ status: "loading" | "error" | "ok"; data?: T }>({ status: "loading" });
  const [nonce, setNonce] = useState(0);
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let alive = true;
    fnRef.current()
      .then((data) => alive && setState({ status: "ok", data }))
      .catch(() => alive && setState((s) => (s.status === "ok" ? s : { status: "error" })));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, nonce, ...deps]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setNonce((n) => n + 1);
  }, []);

  if (state.status === "loading") return { status: "loading", data: undefined };
  if (state.status === "error") return { status: "error", data: undefined, retry };
  return { status: "ok", data: state.data as T, retry };
}

function nameSnapshot(): string {
  try {
    return sessionPhone() ? readDb().profile.name : "";
  } catch {
    return "";
  }
}

/** Profile name for the header avatar (empty when logged out). Re-reads when the mock store changes. */
export function useProfileName(): string {
  return useSyncExternalStore(subscribe, nameSnapshot, () => "");
}
