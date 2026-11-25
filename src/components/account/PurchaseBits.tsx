"use client";

import { useTranslations } from "next-intl";
import { ProductVisual } from "@/components/art/ProductVisual";
import { Badge } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import type { Purchase } from "@/lib/account/types";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import { formatPrice, formatTashkentTime } from "@/lib/format";

const TONE = { paid: "success", canceled: "danger", nothing_taken: "neutral", processing: "warning" } as const;

export function PurchaseStatus({ status }: { status: Purchase["status"] }) {
  const t = useTranslations("account.purchases.status");
  return <Badge tone={TONE[status]}>{t(status)}</Badge>;
}

export function Thumbs({ purchase, max = 3 }: { purchase: Purchase; max?: number }) {
  const shown = purchase.items.slice(0, max);
  const more = purchase.items.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((i) => {
        const p = PRODUCT_BY_ID.get(i.productId);
        return p ? (
          <span key={i.productId} className="size-10 shrink-0 rounded-full bg-white p-1 ring-2 ring-surface">
            <ProductVisual product={p} className="size-full" sizes="40px" />
          </span>
        ) : null;
      })}
      {more > 0 && (
        <span className="flex size-10 items-center justify-center rounded-full bg-background text-xs font-bold ring-2 ring-surface">+{more}</span>
      )}
    </div>
  );
}

export function PurchaseRow({ purchase, locale }: { purchase: Purchase; locale: string }) {
  const t = useTranslations();
  return (
    <Link
      href={`/account/purchases/${purchase.id}`}
      className="flex min-h-[72px] items-center gap-3 rounded-card border border-border bg-surface p-3 transition-colors duration-200 hover:border-accent sm:gap-4 sm:p-4"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{purchase.fridgeName}</div>
        <div className="text-sm text-muted">{formatTashkentTime(purchase.createdAt, locale)}</div>
        <div className="mt-1.5 sm:hidden"><PurchaseStatus status={purchase.status} /></div>
      </div>
      <div className="hidden sm:block"><Thumbs purchase={purchase} /></div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-display font-bold tabular-nums">{formatPrice(purchase.total, t("common.unit"))}</span>
        <span className="hidden sm:block"><PurchaseStatus status={purchase.status} /></span>
        <span className="sm:hidden"><Thumbs purchase={purchase} max={2} /></span>
      </div>
    </Link>
  );
}
