"use client";

import { Loader2, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/primitives";
import { useRouter } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import type { Provider } from "@/lib/account/types";

/**
 * MOCK of the payment provider's hosted card-linking page.
 * We never collect card numbers ourselves: in production the user is redirected to Payme/Click,
 * the provider stores the card, and redirects back with a result.
 */
export function ProviderTest({ provider }: { provider: Provider }) {
  const t = useTranslations("account.provider");
  const router = useRouter();
  const { user, ready, openLogin } = useAuth();
  const [busy, setBusy] = useState(false);
  const name = provider === "payme" ? "Payme" : "Click";

  async function success() {
    setBusy(true);
    try {
      await api.completeCardLink(provider);
      try {
        sessionStorage.setItem("hello.flash", "cardAdded");
      } catch {}
      router.replace("/account/cards");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background">
      <div className="bg-brand-amber px-4 py-2 text-center text-sm font-extrabold tracking-wide text-navy">{t("testBanner")}</div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-5 px-5 py-8">
        <div className="relative rounded-3xl border-2 border-dashed border-brand-amber bg-surface p-6 shadow-lg">
          <span className="absolute -top-3 right-4 rounded-full bg-brand-amber px-3 py-0.5 text-sm font-extrabold text-navy">TEST</span>
          <div className="mb-4"><BrandLogo brand={provider} className="scale-125 origin-left" /></div>
          <h1 className="font-display text-2xl font-extrabold">{t("title", { provider: name })}</h1>
          <p className="mt-2 text-muted">{t("text", { provider: name })}</p>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-background p-4 font-display font-bold tabular-nums tracking-wider">
            <Lock size={18} className="text-muted" aria-hidden />
            {t("sample")}
          </div>
          <p className="mt-3 text-sm text-muted">{t("noInput")}</p>
        </div>

        {ready && !user ? (
          <Button variant="accent" size="lg" onClick={() => openLogin()}>{t("needLogin")}</Button>
        ) : (
          <Button variant="accent" size="lg" onClick={success} disabled={busy}>
            {busy && <Loader2 className="animate-spin" size={18} aria-hidden />}{t("success")}
          </Button>
        )}
        <Button variant="outline" onClick={() => router.replace("/account/cards")}>{t("cancel")}</Button>
      </div>
    </main>
  );
}
