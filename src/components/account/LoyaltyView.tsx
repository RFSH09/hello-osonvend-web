"use client";

import { Gift } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, EmptyState } from "@/components/ui/primitives";
import * as api from "@/lib/account/api";
import { config } from "@/config";
import { useAsync } from "./hooks";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

/** "Every Nth purchase is discounted" progress. Rules live in src/config.ts. */
export function Loyalty({ paidCount, compact }: { paidCount: number; compact?: boolean }) {
  const t = useTranslations("account.loyalty");
  const { every, discountPercent } = config.loyalty;
  const inCycle = paidCount % every;
  const left = every - inCycle;
  const ready = left === 1;
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent/15 text-accent-strong"><Gift size={22} aria-hidden /></span>
        <div>
          <h2 className="font-display text-lg font-bold">{t("title", { every })}</h2>
          {!compact && <p className="text-sm text-muted">{t("rule", { every, percent: discountPercent })}</p>}
        </div>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={every}
        aria-valuenow={inCycle}
        className="h-3 overflow-hidden rounded-full bg-border"
      >
        <div className="h-full rounded-full bg-accent transition-all duration-200" style={{ width: `${(inCycle / every) * 100}%` }} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold tabular-nums">{t("progress", { n: inCycle, total: every })}</span>
        <span className="text-muted">{ready ? t("ready", { percent: discountPercent }) : t("left", { n: left })}</span>
      </div>
    </Card>
  );
}

export function LoyaltyView() {
  const t = useTranslations("account");
  const res = useAsync(() => api.listPurchases());
  return (
    <div>
      <PageHeader title={t("menu.loyalty")} />
      {!config.loyalty.enabled ? (
        <Card><EmptyState title={t("loyalty.disabled")} icon={<Gift size={40} aria-hidden />} /></Card>
      ) : res.status === "loading" ? (
        <ListSkeleton rows={1} height="h-40" />
      ) : res.status === "error" ? (
        <ErrorState onRetry={res.retry} />
      ) : (
        <div className="max-w-xl"><Loyalty paidCount={res.data.filter((p) => p.status === "paid").length} /></div>
      )}
    </div>
  );
}
