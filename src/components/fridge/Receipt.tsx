"use client";

import { Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FiscalQR } from "@/components/art/FiscalQR";
import { ProductArt } from "@/components/art/ProductArt";
import { Button, Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { config } from "@/config";
import type { Order } from "@/lib/api/types";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import { formatPrice, formatTashkentTime } from "@/lib/format";

export function Receipt({ order, onDone }: { order: Order; onDone: () => void }) {
  const t = useTranslations();
  const locale = useLocale();
  const unit = t("common.unit");

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-6">
      <h1 className="text-center font-display text-3xl font-extrabold">{t("receipt.title")}</h1>
      <Card className="flex flex-col gap-4 p-5 print:shadow-none">
        <ul className="flex flex-col divide-y divide-border">
          {order.items.map((i) => {
            const p = PRODUCT_BY_ID.get(i.productId)!;
            return (
              <li key={i.productId} className="flex items-center gap-3 py-3 first:pt-0">
                <div className="size-12 shrink-0 rounded-xl bg-background p-1"><ProductArt product={p} className="size-full" /></div>
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted">{t("receipt.qty", { n: i.qty })}</div>
                </div>
                <div className="font-display font-bold tabular-nums">{formatPrice(i.price * i.qty, unit)}</div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t-2 border-dashed border-border pt-4 text-xl">
          <span className="font-semibold">{t("receipt.total")}</span>
          <span className="font-display font-extrabold tabular-nums">{formatPrice(order.total, unit)}</span>
        </div>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-muted">{t("receipt.method")}</dt>
          <dd className="text-right font-semibold capitalize">{order.method}</dd>
          <dt className="text-muted">{t("receipt.time")}</dt>
          <dd className="text-right font-semibold">{formatTashkentTime(order.createdAt, locale)}</dd>
        </dl>
        <div className="flex items-center gap-4 rounded-2xl bg-background p-3">
          <FiscalQR seed={order.id} size={96} />
          <div className="text-sm">
            <div className="font-semibold">{t("receipt.fiscal")}</div>
            <div className="text-muted">{t("receipt.fiscalText")}</div>
          </div>
        </div>
      </Card>

      <Button variant="outline" onClick={() => window.print()}>
        <Download size={18} aria-hidden /> {t("receipt.download")}
      </Button>
      <div className="rounded-2xl border border-border p-4 text-center">
        <p className="font-semibold">{t("receipt.wrong")}</p>
        <p className="mb-3 text-sm text-muted">{t("receipt.wrongText")}</p>
        <ButtonLink href={config.contact.telegram} external variant="outline">{t("receipt.report")}</ButtonLink>
      </div>
      <Button variant="accent" size="lg" onClick={onDone}>{t("flow.done")}</Button>
    </div>
  );
}
