/**
 * Beta-only mock persistence (localStorage). The real app replaces src/lib/account/api.ts
 * with calls to the Django backend; nothing else reads this store directly.
 */
import { seedDb } from "./seed";
import type { AccountDB } from "./types";

const KEY = "hello.account.v1";
const SESSION = "hello.session";
const listeners = new Set<() => void>();
let version = 0;

export function sessionPhone(): string | null {
  try {
    const raw = localStorage.getItem(SESSION) ?? sessionStorage.getItem(SESSION);
    return raw ? (JSON.parse(raw).phone as string) : null;
  } catch {
    return null;
  }
}

export function readDb(): AccountDB {
  const phone = sessionPhone();
  if (!phone) throw new Error("not-authenticated");
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const db = JSON.parse(raw) as AccountDB;
      if (db.v === 1 && db.profile.phone === phone) return db;
    }
  } catch {}
  const fresh = seedDb(phone);
  writeDb(fresh, false);
  return fresh;
}

export function writeDb(db: AccountDB, notify = true) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    throw new Error("storage-unavailable");
  }
  if (notify) {
    version++;
    listeners.forEach((l) => l());
  }
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getVersion = () => version;
