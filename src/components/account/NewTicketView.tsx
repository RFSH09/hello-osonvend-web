"use client";

import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/overlays";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button, Card } from "@/components/ui/primitives";
import { useRouter } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import type { TicketReason } from "@/lib/account/types";
import { formatPrice, formatTashkentTime } from "@/lib/format";
import { useFridgeLabel } from "@/lib/fridge-label";
import { useAsync } from "./hooks";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

const REASONS: TicketReason[] = ["wrongItem", "notCharged", "overcharged", "doorIssue", "other"];
const field = "min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent";

export function NewTicketView({ purchaseId }: { purchaseId?: string }) {
  const t = useTranslations("account.support");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const toast = useToast();
  const { byId } = useFridgeLabel();
  const res = useAsync(() => api.listPurchases());
  const [order, setOrder] = useState(purchaseId ?? "");
  const [reason, setReason] = useState<TicketReason>("wrongItem");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) return;
    const url = URL.createObjectURL(photo);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- object URL is a browser resource tied to this effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const tk = await api.createTicket({ orderId: order || undefined, reason, comment, photoName: photo?.name });
      setDone(tk.id);
    } catch {
      toast(t("failed"), "error");
    } finally {
      setBusy(false);
    }
  }

  if (done)
    return (
      <Card className="mx-auto flex max-w-md flex-col items-center gap-3 py-12 text-center" role="status">
        <CheckCircle2 size={56} className="text-accent" aria-hidden />
        <h1 className="font-display text-2xl font-bold">{t("created")}</h1>
        <p className="text-muted">{t("createdText", { id: done })}</p>
        <ButtonLink href="/account/support" variant="accent">{t("backToList")}</ButtonLink>
      </Card>
    );

  return (
    <div className="max-w-2xl">
      <PageHeader title={t("newTicket")} subtitle={t("reply24")} />
      {res.status === "loading" && <ListSkeleton rows={2} height="h-40" />}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && (
        <form onSubmit={submit}>
          <Card className="flex flex-col gap-5 p-6">
            <label className="flex flex-col gap-1.5 font-medium">{t("purchase")}
              <select value={order} onChange={(e) => setOrder(e.target.value)} className={field}>
                <option value="">{t("noPurchase")}</option>
                {res.data.filter((p) => p.status !== "processing").slice(0, 15).map((p) => (
                  <option key={p.id} value={p.id}>{formatTashkentTime(p.createdAt, locale)} · {byId(p.fridgeId, p.fridgeName)} · {formatPrice(p.total, tc("unit"))}</option>
                ))}
              </select>
            </label>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 font-medium">{t("reason")}</legend>
              {REASONS.map((r) => (
                <label key={r} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border px-4 has-[:checked]:border-accent has-[:checked]:bg-accent/10">
                  <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="size-5 accent-[#3ADC93]" />
                  {t(`reasons.${r}`)}
                </label>
              ))}
            </fieldset>
            <label className="flex flex-col gap-1.5 font-medium">{t("comment")}
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className={`${field} py-3`} />
            </label>
            <div className="flex flex-col gap-2">
              <span className="font-medium">{t("photo")}</span>
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-border p-4 text-center text-muted hover:border-accent">
                {photo && preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="max-h-40 rounded-xl" />
                ) : (
                  <><ImagePlus size={28} aria-hidden /><span>{t("photoHint")}</span></>
                )}
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <Button type="submit" variant="accent" size="lg" disabled={busy}>
              {busy && <Loader2 className="animate-spin" size={18} aria-hidden />}{t("submit")}
            </Button>
            <button type="button" onClick={() => router.back()} className="min-h-11 font-semibold text-muted">{tc("close")}</button>
          </Card>
        </form>
      )}
    </div>
  );
}
