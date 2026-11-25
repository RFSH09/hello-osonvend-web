"use client";

import { Receipt, Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button, Card, EmptyState } from "@/components/ui/primitives";
import * as api from "@/lib/account/api";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import { tashkentDayKey, tashkentMonthKey } from "@/lib/format";
import { useAsync } from "./hooks";
import { PurchaseRow } from "./PurchaseBits";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

const field = "min-h-11 rounded-xl border border-border bg-surface px-3 outline-none focus:border-accent";

export function PurchasesView() {
  const t = useTranslations("account.purchases");
  const locale = useLocale();
  const months = useTranslations()
    .raw("months") as string[];
  const res = useAsync(() => api.listPurchases());
  const [q, setQ] = useState("");
  const [fridge, setFridge] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fridges = useMemo(
    () => (res.status === "ok" ? Array.from(new Map(res.data.map((p) => [p.fridgeId, p.fridgeName])).entries()) : []),
    [res],
  );

  const groups = useMemo(() => {
    if (res.status !== "ok") return [];
    const needle = q.trim().toLowerCase();
    const list = res.data.filter((p) => {
      if (fridge && p.fridgeId !== fridge) return false;
      const day = tashkentDayKey(p.createdAt);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (needle) {
        const hay = [p.fridgeName, p.id, ...p.items.map((i) => PRODUCT_BY_ID.get(i.productId)?.name ?? "")].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const map = new Map<string, typeof list>();
    for (const p of list) {
      const k = tashkentMonthKey(p.createdAt);
      map.set(k, [...(map.get(k) ?? []), p]);
    }
    return Array.from(map.entries());
  }, [res, q, fridge, from, to]);

  const filtered = !!(q || fridge || from || to);

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_auto_auto]">
        <label className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-3 sm:col-span-2 lg:col-span-1">
          <Search size={18} className="text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="w-full bg-transparent outline-none" />
        </label>
        <select value={fridge} onChange={(e) => setFridge(e.target.value)} aria-label={t("fridge")} className={field}>
          <option value="">{t("allFridges")}</option>
          {fridges.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-muted">{t("from")}
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${field} text-foreground`} />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">{t("to")}
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${field} text-foreground`} />
        </label>
      </div>

      {res.status === "loading" && <ListSkeleton rows={5} height="h-[76px]" />}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && groups.length === 0 && (
        <Card>
          <EmptyState
            icon={<Receipt size={48} aria-hidden />}
            title={filtered ? t("noResults") : t("empty")}
            text={filtered ? undefined : t("emptyText")}
            action={filtered ? <Button variant="outline" onClick={() => { setQ(""); setFridge(""); setFrom(""); setTo(""); }}>{t("reset")}</Button> : undefined}
          />
        </Card>
      )}
      {res.status === "ok" &&
        groups.map(([key, list]) => {
          const [y, m] = key.split("-");
          return (
            <section key={key} className="mb-8">
              <h2 className="mb-3 font-display text-lg font-bold text-muted">{months[Number(m) - 1]} {y}</h2>
              <div className="flex flex-col gap-3">{list.map((p) => <PurchaseRow key={p.id} purchase={p} locale={locale} />)}</div>
            </section>
          );
        })}
    </div>
  );
}
