"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BottomSheet } from "@/components/ui/overlays";
import { Button } from "@/components/ui/primitives";
import { requestOtp, verifyOtp } from "@/lib/api";
import { cn } from "@/lib/cn";
import { formatNational, isCompletePhone, nationalDigits, toDisplayPhone } from "@/lib/phone";

const RESEND_SEC = 30;

export function LoginSheet({
  open,
  onClose,
  onLoggedIn,
}: {
  open: boolean;
  onClose: () => void;
  onLoggedIn: (phone: string, remember: boolean) => void;
}) {
  const t = useTranslations();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [digits, setDigits] = useState("");
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  // reset every time the sheet opens
  useEffect(() => {
    if (open) {
      setStep("phone");
      setCode("");
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // WebOTP: auto-read the SMS code on supporting browsers
  useEffect(() => {
    if (step !== "code" || !open || !("OTPCredential" in window)) return;
    const ac = new AbortController();
    (navigator.credentials as CredentialsContainer & { get: (o: unknown) => Promise<{ code?: string } | null> })
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      .then((c) => c?.code && setCode(c.code.replace(/\D/g, "").slice(0, 6)))
      .catch(() => {});
    return () => ac.abort();
  }, [step, open]);

  useEffect(() => {
    if (step === "code" && code.length === 6) void submitCode(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function sendCode() {
    if (!isCompletePhone(digits)) return setError(t("login.invalid"));
    setBusy(true);
    setError(null);
    try {
      await requestOtp(digits);
      setStep("code");
      setTimer(RESEND_SEC);
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch {
      setError(t("login.sendFailed"));
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(c: string) {
    setBusy(true);
    setError(null);
    try {
      if (await verifyOtp(digits, c)) onLoggedIn(digits, remember);
      else {
        setError(t("login.wrongCode"));
        setCode("");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={step === "phone" ? t("login.title") : t("login.codeTitle")} closeLabel={t("common.close")}>
      {step === "phone" ? (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void sendCode();
          }}
        >
          <p className="text-muted">{t("login.text")}</p>
          <label className="flex flex-col gap-2 font-medium">
            {t("login.phone")}
            <div className="flex min-h-14 items-center rounded-2xl border border-border bg-background px-4 focus-within:border-accent">
              <span className="pr-2 font-semibold text-muted">+998</span>
              <input
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                placeholder="90 123 45 67"
                value={formatNational(digits)}
                onChange={(e) => setDigits(nationalDigits(e.target.value))}
                className="w-full bg-transparent py-3 text-lg font-semibold tabular-nums outline-none"
              />
            </div>
          </label>
          <label className="flex min-h-11 items-center gap-3">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-5 accent-[#22C55E]" />
            {t("login.remember")}
          </label>
          {error && <p role="alert" className="text-sm font-medium text-brand-red">{error}</p>}
          <Button type="submit" variant="accent" size="lg" disabled={busy}>
            {busy && <Loader2 className="animate-spin" size={18} aria-hidden />} {t("login.send")}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-muted">{t("login.codeText", { phone: toDisplayPhone(digits) })}</p>
          <div className="relative" onClick={() => codeRef.current?.focus()}>
            <input
              ref={codeRef}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              aria-label={t("login.codeTitle")}
              maxLength={6}
              className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
            />
            <div className="flex justify-between gap-2" aria-hidden>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-14 w-full max-w-[3.5rem] items-center justify-center rounded-xl border-2 bg-background font-display text-2xl font-bold",
                    i === code.length ? "border-accent" : "border-border",
                  )}
                >
                  {code[i] ?? ""}
                </div>
              ))}
            </div>
          </div>
          {error && <p role="alert" className="text-sm font-medium text-brand-red">{error}</p>}
          {busy && <Loader2 className="mx-auto animate-spin text-muted" aria-label={t("common.loading")} />}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button onClick={() => setStep("phone")} className="min-h-11 font-medium text-muted underline">
              {t("login.change")}
            </button>
            <button
              disabled={timer > 0}
              onClick={() => {
                setTimer(RESEND_SEC);
                void requestOtp(digits);
              }}
              className="min-h-11 font-semibold text-accent-strong disabled:text-muted"
            >
              {timer > 0 ? t("login.resendIn", { s: timer }) : t("login.resend")}
            </button>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
