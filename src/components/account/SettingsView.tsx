"use client";

import { Loader2, LogOut, Monitor, Smartphone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { LOCALE_LABELS } from "@/components/site/Header";
import { BottomSheet, useToast } from "@/components/ui/overlays";
import { Badge, Button, Card } from "@/components/ui/primitives";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import * as api from "@/lib/account/api";
import { cn } from "@/lib/cn";
import { formatTashkentTime } from "@/lib/format";
import { useAsync } from "./hooks";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-accent" : "bg-border")}
    >
      <span className={cn("absolute top-1 size-6 rounded-full bg-white shadow transition-all duration-200", checked ? "left-7" : "left-1")} />
    </button>
  );
}

export function SettingsView() {
  const t = useTranslations("account.settings");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { logout } = useAuth();
  const res = useAsync(() => api.getSettings());
  const [dark, setDark] = useState(false);
  const [del, setDel] = useState(false);
  const [busy, setBusy] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the theme attribute set outside React
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);

  function setTheme(d: boolean) {
    // eslint-disable-next-line react-hooks/immutability -- the theme lives on <html>, outside React
    document.documentElement.dataset.theme = d ? "dark" : "light";
    try {
      localStorage.setItem("theme", d ? "dark" : "light");
    } catch {}
    setDark(d);
  }
  async function requestDelete() {
    setBusy(true);
    try {
      await api.requestDeletion();
      toast(t("deleteRequested"), "success");
      setDel(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title={t("title")} />
      {res.status === "loading" && <ListSkeleton rows={4} height="h-28" />}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && (
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-4 p-5">
            <h2 className="font-display text-lg font-bold">{t("language")}</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label={t("language")}>
              {routing.locales.map((l) => (
                <button
                  key={l}
                  lang={l}
                  aria-pressed={l === locale}
                  onClick={() => router.replace(pathname, { locale: l })}
                  className={cn("min-h-11 rounded-full border px-5 font-semibold", l === locale ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background")}
                >
                  {LOCALE_LABELS[l].full}
                </button>
              ))}
            </div>
            <h2 className="mt-2 font-display text-lg font-bold">{t("theme")}</h2>
            <div className="flex gap-2" role="group" aria-label={t("theme")}>
              {[[false, t("light")], [true, t("dark")]].map(([d, label]) => (
                <button key={String(label)} aria-pressed={dark === d} onClick={() => setTheme(d as boolean)}
                  className={cn("min-h-11 rounded-full border px-5 font-semibold", dark === d ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background")}>
                  {label as string}
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col gap-4 p-5">
            <h2 className="font-display text-lg font-bold">{t("notifications")}</h2>
            {([["sms", "SMS"], ["telegram", "Telegram"]] as const).map(([k, label]) => (
              <div key={k} className="flex min-h-11 items-center justify-between gap-3">
                <span className="font-medium">{label}</span>
                <Toggle label={label} checked={res.data.settings[k]} onChange={(v) => api.saveSettings({ [k]: v })} />
              </div>
            ))}
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <h2 className="font-display text-lg font-bold">{t("devices")}</h2>
            <ul className="flex flex-col divide-y divide-border">
              {res.data.devices.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  {d.name.includes("Windows") ? <Monitor size={22} aria-hidden /> : <Smartphone size={22} aria-hidden />}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{d.name} {d.current && <Badge tone="success" className="ml-1 px-2 py-0.5 text-sm">{t("thisDevice")}</Badge>}</div>
                    <div className="text-sm text-muted">{t("lastActive")}: {formatTashkentTime(d.lastActive, locale)}</div>
                  </div>
                  {!d.current && <Button variant="outline" onClick={() => api.signOutDevice(d.id)}>{t("signOut")}</Button>}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex flex-col gap-3 p-5">
            <Button variant="outline" onClick={logout}><LogOut size={18} aria-hidden />{t("logout")}</Button>
            <Button variant="ghost" className="text-brand-red" disabled={res.data.deleteRequested} onClick={() => setDel(true)}>
              {res.data.deleteRequested ? t("deleteRequested") : t("deleteBtn")}
            </Button>
          </Card>
        </div>
      )}

      <BottomSheet open={del} onClose={() => setDel(false)} title={t("deleteTitle")} closeLabel={tc("close")}>
        <p className="mb-5 text-muted">{t("deleteText")}</p>
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button variant="danger" onClick={requestDelete} disabled={busy}>{busy && <Loader2 size={16} className="animate-spin" aria-hidden />}{t("deleteConfirm")}</Button>
          <Button variant="outline" onClick={() => setDel(false)}>{t("cancel")}</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
