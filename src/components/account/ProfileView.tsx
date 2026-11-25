"use client";

import { ChevronRight, Gift, LifeBuoy, Loader2, LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BottomSheet, useToast } from "@/components/ui/overlays";
import { Button, Card, Skeleton } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import type { Profile } from "@/lib/account/types";
import { config } from "@/config";
import { formatNational, isCompletePhone, nationalDigits, toDisplayPhone } from "@/lib/phone";
import { useAsync } from "./hooks";
import { ErrorState, PageHeader } from "./states";

const field = "min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent";

export function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "H";
}

function ChangePhoneBody({ onClose }: { onClose: () => void }) {
  const t = useTranslations("account.profile");
  const toast = useToast();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [digits, setDigits] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setErr(null);
    try {
      await api.changePhone(digits, code);
      toast(t("phoneChanged"), "success");
      onClose();
    } catch {
      setErr(t("wrongCode"));
    } finally {
      setBusy(false);
    }
  }

  return step === "phone" ? (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!isCompletePhone(digits)) return setErr(t("phoneInvalid"));
        setErr(null);
        setStep("code");
      }}
    >
      <label className="flex flex-col gap-2 font-medium">
        {t("newPhone")}
        <div className="flex min-h-12 items-center rounded-xl border border-border bg-background px-4 focus-within:border-accent">
          <span className="pr-2 font-semibold text-muted">+998</span>
          <input inputMode="numeric" autoFocus placeholder="90 123 45 67" value={formatNational(digits)} onChange={(e) => setDigits(nationalDigits(e.target.value))} className="w-full bg-transparent py-3 outline-none" />
        </div>
      </label>
      {err && <p role="alert" className="text-sm font-medium text-brand-red">{err}</p>}
      <Button type="submit" variant="accent" size="lg">{t("sendCode")}</Button>
    </form>
  ) : (
    <div className="flex flex-col gap-4">
      <p className="text-muted">{t("codeText", { phone: toDisplayPhone(digits) })}</p>
      <input
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={6}
        aria-label={t("code")}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className={`${field} text-center font-display text-2xl font-bold tracking-[0.5em]`}
      />
      {err && <p role="alert" className="text-sm font-medium text-brand-red">{err}</p>}
      <Button variant="accent" size="lg" disabled={code.length !== 6 || busy} onClick={confirm}>
        {busy && <Loader2 className="animate-spin" size={18} aria-hidden />}{t("confirm")}
      </Button>
    </div>
  );
}

function ChangePhone({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("account.profile");
  const tc = useTranslations("common");
  return (
    <BottomSheet open={open} onClose={onClose} title={t("changeTitle")} closeLabel={tc("close")}>
      <ChangePhoneBody onClose={onClose} />
    </BottomSheet>
  );
}

function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations("account");
  const tc = useTranslations("common");
  const toast = useToast();
  const { logout } = useAuth();
  const [form, setForm] = useState({ name: profile.name, email: profile.email, birthday: profile.birthday });
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api.saveProfile(form);
      toast(t("profile.saved"), "success");
    } catch {
      toast(t("states.errorTitle"), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title={t("menu.profile")} />
      {(
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form onSubmit={save}>
            <Card className="flex flex-col gap-5 p-6">
              <div className="flex items-center gap-4">
                <span aria-hidden className="flex size-16 items-center justify-center rounded-full bg-navy font-display text-2xl font-extrabold text-white">{initials(form.name)}</span>
                <div>
                  <div className="font-display text-xl font-bold">{form.name || t("profile.noName")}</div>
                  <div className="text-muted">{toDisplayPhone(profile.phone)}</div>
                </div>
              </div>
              <label className="flex flex-col gap-1.5 font-medium">{t("profile.name")}
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" className={field} />
              </label>
              <div className="flex flex-col gap-1.5 font-medium">
                {t("profile.phone")}
                <div className="flex flex-wrap items-center gap-3">
                  <input readOnly value={toDisplayPhone(profile.phone)} aria-label={t("profile.phone")} className={`${field} max-w-xs bg-border/40`} />
                  <Button type="button" variant="outline" onClick={() => setSheet(true)}>{t("profile.changePhone")}</Button>
                </div>
                <span className="text-sm font-normal text-muted">{t("profile.phoneNote")}</span>
              </div>
              <label className="flex flex-col gap-1.5 font-medium">{t("profile.email")} <span className="text-sm font-normal text-muted">({t("profile.optional")})</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" className={field} />
              </label>
              <label className="flex flex-col gap-1.5 font-medium">{t("profile.birthday")} <span className="text-sm font-normal text-muted">({t("profile.optional")})</span>
                <input type="date" value={form.birthday} onChange={(e) => setForm({ ...form, birthday: e.target.value })} className={field} />
              </label>
              <Button type="submit" variant="accent" size="lg" disabled={busy}>
                {busy && <Loader2 className="animate-spin" size={18} aria-hidden />}{t("profile.save")}
              </Button>
            </Card>
          </form>

          <Card className="h-fit p-2 md:hidden">
            <ul className="flex flex-col">
              {[
                { href: "/account/support", label: t("menu.tickets"), Icon: LifeBuoy },
                ...(config.loyalty.enabled ? [{ href: "/account/loyalty", label: t("menu.loyalty"), Icon: Gift }] : []),
                { href: "/account/settings", label: t("menu.settings"), Icon: Settings },
              ].map(({ href, label, Icon }) => (
                <li key={href}>
                  <Link href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold hover:bg-background"><Icon size={20} aria-hidden />{label}<ChevronRight size={18} className="ml-auto text-muted" aria-hidden /></Link>
                </li>
              ))}
              <li>
                <button onClick={logout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 font-semibold text-brand-red hover:bg-background"><LogOut size={20} aria-hidden />{t("menu.logout")}</button>
              </li>
            </ul>
          </Card>
        </div>
      )}
      <ChangePhone open={sheet} onClose={() => setSheet(false)} />
      <span className="sr-only">{tc("loading")}</span>
    </div>
  );
}

export function ProfileView() {
  const res = useAsync(() => api.getProfile());
  if (res.status === "error") return <ErrorState onRetry={res.retry} />;
  if (res.status === "loading")
    return (
      <div>
        <PageHeader title="" />
        <div className="flex flex-col gap-3"><Skeleton className="h-24 w-full rounded-card" /><Skeleton className="h-72 w-full rounded-card" /></div>
      </div>
    );
  return <ProfileForm profile={res.data} />;
}
