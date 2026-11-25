"use client";

import { CreditCard, Loader2, Plus, ShieldCheck, Star, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { BottomSheet, useToast } from "@/components/ui/overlays";
import { Button, Card, EmptyState } from "@/components/ui/primitives";
import { useRouter } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import type { SavedCard } from "@/lib/account/types";
import { useAsync } from "./hooks";
import { CardTile } from "./CardTile";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

export function CardsView() {
  const t = useTranslations("account.cards");
  const tc = useTranslations("common");
  const toast = useToast();
  const router = useRouter();
  const res = useAsync(() => api.listCards());
  const [pick, setPick] = useState(false);
  const [removing, setRemoving] = useState<SavedCard | null>(null);
  const [busy, setBusy] = useState(false);

  // flash message left by the provider test page after a successful link
  useEffect(() => {
    try {
      if (sessionStorage.getItem("hello.flash") === "cardAdded") {
        sessionStorage.removeItem("hello.flash");
        toast(t("added"), "success");
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function makeDefault(c: SavedCard) {
    await api.setDefaultCard(c.id);
    toast(t("defaultSet"), "success");
  }
  async function confirmRemove() {
    if (!removing) return;
    setBusy(true);
    try {
      await api.removeCard(removing.id);
      toast(t("removed"), "success");
      setRemoving(null);
    } catch {
      toast(t("failed"), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        actions={<Button variant="accent" onClick={() => setPick(true)}><Plus size={18} aria-hidden />{t("add")}</Button>}
      />

      {res.status === "loading" && <div className="grid gap-4 sm:grid-cols-2"><ListSkeleton rows={1} height="h-48" /><ListSkeleton rows={1} height="h-48" /></div>}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && res.data.length === 0 && (
        <Card>
          <EmptyState
            icon={<CreditCard size={56} aria-hidden />}
            title={t("empty")}
            text={t("emptyText")}
            action={<Button variant="accent" onClick={() => setPick(true)}><Plus size={18} aria-hidden />{t("add")}</Button>}
          />
        </Card>
      )}
      {res.status === "ok" && res.data.length > 0 && (
        <ul className="grid gap-6 sm:grid-cols-2">
          {res.data.map((c) => (
            <li key={c.id} className="flex flex-col gap-3">
              <CardTile card={c} />
              <div className="flex flex-wrap gap-2">
                {!c.isDefault && (
                  <Button variant="outline" onClick={() => makeDefault(c)}><Star size={16} aria-hidden />{t("setDefault")}</Button>
                )}
                <Button variant="ghost" className="text-brand-red" onClick={() => setRemoving(c)}><Trash2 size={16} aria-hidden />{t("remove")}</Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 flex items-start gap-2 text-sm text-muted"><ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden />{t("note")}</p>

      {/* choose provider -> provider's hosted linking page (mocked) */}
      <BottomSheet open={pick} onClose={() => setPick(false)} title={t("chooseProvider")} closeLabel={tc("close")}>
        <p className="mb-4 text-muted">{t("chooseText")}</p>
        <div className="grid gap-3">
          {(["payme", "click"] as const).map((p) => (
            <button
              key={p}
              onClick={() => router.push(`/provider-test/${p}`)}
              className="flex min-h-16 items-center justify-between rounded-2xl border border-border bg-background px-5 hover:border-accent"
            >
              <BrandLogo brand={p} className="scale-125 origin-left" />
              <span className="font-semibold text-accent-strong">{t("continue")} →</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={!!removing} onClose={() => setRemoving(null)} title={t("removeTitle")} closeLabel={tc("close")}>
        <p className="mb-5 text-muted">{t("removeText", { last4: removing?.last4 ?? "" })}</p>
        <div className="flex flex-col gap-2 sm:flex-row-reverse">
          <Button variant="danger" onClick={confirmRemove} disabled={busy}>
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden />}{t("removeConfirm")}
          </Button>
          <Button variant="outline" onClick={() => setRemoving(null)}>{t("cancel")}</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
