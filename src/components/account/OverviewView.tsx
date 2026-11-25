"use client";

import { LifeBuoy, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Card, EmptyState } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import { config } from "@/config";
import { formatPrice, tashkentMonthKey } from "@/lib/format";
import { useAsync } from "./hooks";
import { CardTile } from "./CardTile";
import { PurchaseRow } from "./PurchaseBits";
import { ErrorState, ListSkeleton } from "./states";
import { Loyalty } from "./LoyaltyView";

export function OverviewView() {
  const t = useTranslations();
  const locale = useLocale();
  const res = useAsync(async () => {
    const [profile, cards, purchases] = await Promise.all([api.getProfile(), api.listCards(), api.listPurchases()]);
    return { profile, cards, purchases };
  });

  if (res.status === "loading")
    return (
      <div aria-busy="true"><ListSkeleton rows={1} height="h-24" /><div className="mt-4 grid gap-4 sm:grid-cols-2"><ListSkeleton rows={1} height="h-40" /><ListSkeleton rows={1} height="h-40" /></div><div className="mt-4"><ListSkeleton rows={3} /></div></div>
    );
  if (res.status === "error") return <ErrorState onRetry={res.retry} />;

  const { profile, cards, purchases } = res.data;
  const first = profile.name.split(" ")[0];
  const nowKey = tashkentMonthKey(new Date());
  const spent = purchases.filter((p) => p.status === "paid" && tashkentMonthKey(p.createdAt) === nowKey).reduce((s, p) => s + p.total, 0);
  const def = cards.find((c) => c.isDefault);
  const paidCount = purchases.filter((p) => p.status === "paid").length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">
        {first ? t("account.hello", { name: first }) : t("account.helloNoName")}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{t("account.overview.defaultCard")}</h2>
            <Link href="/account/cards" className="min-h-11 content-center text-sm font-semibold text-accent-strong">{t("account.overview.manage")}</Link>
          </div>
          {def ? <CardTile card={def} className="max-w-none" /> : <EmptyState title={t("account.overview.noCard")} text={t("account.cards.emptyText")} />}
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <div className="text-muted">{t("account.overview.spent")}</div>
            <div className="mt-1 font-display text-3xl font-extrabold tabular-nums">{formatPrice(spent, t("common.unit"))}</div>
          </Card>
          {config.loyalty.enabled && <Loyalty paidCount={paidCount} compact />}
          <div className="grid grid-cols-2 gap-3">
            <ButtonLink href="/locations" variant="accent" className="px-3 text-center"><MapPin size={18} aria-hidden />{t("account.overview.quickFind")}</ButtonLink>
            <ButtonLink href="/account/support" variant="outline" className="px-3"><LifeBuoy size={18} aria-hidden />{t("account.overview.quickHelp")}</ButtonLink>
          </div>
        </div>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{t("account.overview.last")}</h2>
          <Link href="/account/purchases" className="min-h-11 content-center text-sm font-semibold text-accent-strong">{t("account.overview.all")}</Link>
        </div>
        {purchases.length === 0 ? (
          <Card><EmptyState title={t("account.purchases.empty")} text={t("account.purchases.emptyText")} /></Card>
        ) : (
          <div className="flex flex-col gap-3">
            {purchases.slice(0, 3).map((p) => <PurchaseRow key={p.id} purchase={p} locale={locale} />)}
          </div>
        )}
      </section>
    </div>
  );
}
