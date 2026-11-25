"use client";

import { ArrowLeft, FileDown, Flag, SearchX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FiscalQR } from "@/components/art/FiscalQR";
import { ProductVisual } from "@/components/art/ProductVisual";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Button, Card, EmptyState } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import { formatPrice, formatTashkentTime } from "@/lib/format";
import { useAsync } from "./hooks";
import { PurchaseStatus } from "./PurchaseBits";
import { ErrorState, ListSkeleton } from "./states";

export function PurchaseDetail({ id }: { id: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const unit = t("common.unit");
  const res = useAsync(() => api.getPurchase(id), [id]);

  return (
    <div className="mx-auto max-w-xl">
      <Link href="/account/purchases" className="mb-4 inline-flex min-h-11 items-center gap-2 font-semibold text-muted hover:text-foreground print:hidden">
        <ArrowLeft size={18} aria-hidden />{t("account.purchase.back")}
      </Link>

      {res.status === "loading" && <ListSkeleton rows={3} height="h-40" />}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && !res.data && (
        <Card><EmptyState icon={<SearchX size={48} aria-hidden />} title={t("account.purchase.notFound")} /></Card>
      )}
      {res.status === "ok" && res.data && (() => {
        const p = res.data;
        return (
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-5 p-6 print:border-0 print:shadow-none">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-extrabold">{t("receipt.title")} · {p.id}</h1>
                  <p className="text-muted">{p.fridgeName}</p>
                </div>
                <PurchaseStatus status={p.status} />
              </div>

              {p.items.length === 0 ? (
                <p className="rounded-xl bg-background p-4 text-muted">{t("flow.nothingText")}</p>
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {p.items.map((i) => {
                    const pr = PRODUCT_BY_ID.get(i.productId)!;
                    return (
                      <li key={i.productId} className="flex items-center gap-3 py-3 first:pt-0">
                        <div className="size-16 shrink-0 rounded-xl bg-white p-1 ring-1 ring-border"><ProductVisual product={pr} className="size-full" sizes="64px" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold">{pr.name}</div>
                          <div className="text-sm text-muted">{t("receipt.qty", { n: i.qty })} × {formatPrice(i.price, unit)}</div>
                        </div>
                        <div className="font-display font-bold tabular-nums">{formatPrice(i.price * i.qty, unit)}</div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <div className="flex items-center justify-between border-t-2 border-dashed border-border pt-4 text-xl">
                <span className="font-semibold">{t("receipt.total")}</span>
                <span className="font-display font-extrabold tabular-nums">{formatPrice(p.total, unit)}</span>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted">{t("account.purchase.card")}</dt>
                <dd className="text-right font-semibold capitalize">{p.method}{p.cardLast4 ? ` •••• ${p.cardLast4}` : ""}</dd>
                <dt className="text-muted">{t("account.purchase.fridge")}</dt>
                <dd className="text-right font-semibold">{p.fridgeName}</dd>
                <dt className="text-muted">{t("receipt.time")}</dt>
                <dd className="text-right font-semibold">{formatTashkentTime(p.createdAt, locale)}</dd>
              </dl>

              <div className="flex items-center gap-4 rounded-2xl bg-background p-3">
                <FiscalQR seed={p.id} size={96} />
                <div className="text-sm">
                  <div className="font-semibold">{t("receipt.fiscal")}</div>
                  <div className="text-muted">{t("receipt.fiscalText")}</div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col gap-3 print:hidden sm:flex-row">
              <Button variant="outline" className="flex-1" onClick={() => window.print()}><FileDown size={18} aria-hidden />{t("account.purchase.downloadPdf")}</Button>
              <ButtonLink href={`/account/support/new?purchase=${p.id}`} variant="outline" className="flex-1"><Flag size={18} aria-hidden />{t("receipt.wrong")}</ButtonLink>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
