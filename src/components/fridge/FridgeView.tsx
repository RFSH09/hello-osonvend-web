"use client";

import { MapPin, ShieldCheck, Video, Receipt as ReceiptIcon, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, Card, ProductCard } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import { settleOrder } from "@/lib/api";
import { recordPurchase } from "@/lib/account/api";
import type { Fridge, Order, StockItem } from "@/lib/api/types";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import { config } from "@/config";
import { distanceKm } from "@/lib/data/fridges";
import { flowReducer, initialFlow, UNLOCK_TIMEOUT_MS, type FlowState } from "@/lib/flow/machine";
import { FlowOverlay } from "./FlowOverlay";
import { StatusBadge } from "./StatusBadge";

const SAMPLE_ORDER = (fridgeId: string): Order => ({
  id: "dev-sample",
  fridgeId,
  status: "paid",
  method: "payme",
  createdAt: new Date().toISOString(),
  items: [
    { productId: "coca-cola", qty: 1, price: 9000 },
    { productId: "snickers", qty: 2, price: 14000 },
  ],
  total: 37000,
});

export function FridgeView({
  fridge,
  stock,
  nearest,
}: {
  fridge: Fridge;
  stock: StockItem[];
  nearest: Fridge[];
}) {
  const t = useTranslations();
  const { user, openLogin } = useAuth();
  const [flow, dispatch] = useReducer(flowReducer, initialFlow);
  const [devOpen, setDevOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const offline = fridge.status === "offline";

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  // unlocking: mock hardware answers after 1.8s; 10s safety timeout
  useEffect(() => {
    if (flow.name !== "unlocking") return;
    const ok = setTimeout(() => dispatch({ type: "UNLOCKED" }), 1800);
    const to = setTimeout(() => dispatch({ type: "UNLOCK_TIMEOUT" }), UNLOCK_TIMEOUT_MS);
    return () => {
      clearTimeout(ok);
      clearTimeout(to);
    };
  }, [flow.name]);

  // processing: mock AI + payment takes ~2.5s
  useEffect(() => {
    if (flow.name !== "processing") return;
    const id = setTimeout(async () => {
      try {
        const order = await settleOrder(fridge);
        if (user) void recordPurchase(order, fridge.name).catch(() => {});
        dispatch({ type: "PAID", order });
      } catch {
        dispatch({ type: "FAIL" });
      }
    }, 2500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.name, fridge]);

  const start = useCallback(() => dispatch({ type: "START" }), []);
  const onOpen = () => (user ? start() : openLogin(start));

  const items = stock
    .map((s) => ({ ...s, product: PRODUCT_BY_ID.get(s.productId)! }))
    .filter((s) => s.product)
    .sort((a, b) => Number(a.qty === 0) - Number(b.qty === 0));

  const force = (state: FlowState) => dispatch({ type: "FORCE", state });

  return (
    <>
      <div className="bg-panel text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={fridge.status} onDark />
            <span className="text-sm text-white/60">{fridge.id}</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{fridge.name}</h1>
          <p className="flex items-center gap-2 text-white/75"><MapPin size={18} aria-hidden />{fridge.address}</p>
        </div>
      </div>

      <div className="relative">
      <main className="mx-auto w-full max-w-[1200px] px-4 pb-10 pt-8 sm:px-6">
        {offline ? (
          <div className="flex flex-col gap-6">
            <Card className="border-brand-red/40 text-center">
              <h2 className="font-display text-xl font-bold">{t("fridge.offlineTitle")}</h2>
              <p className="mt-1 text-muted">{t("fridge.offlineText")}</p>
            </Card>
            <h2 className="font-display text-xl font-bold">{t("fridge.nearest")}</h2>
            <ul className="grid gap-3 sm:grid-cols-3">
              {nearest.map((f) => (
                <li key={f.id}>
                  <Link href={`/refrigerator/${f.id}`} className="block rounded-card border border-border bg-surface p-4 hover:border-accent">
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-sm text-muted">{t("fridge.km", { km: distanceKm(fridge, f).toFixed(1) })}</div>
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href={config.contact.telegram} external variant="outline" className="self-start">{t("common.support")}</ButtonLink>
          </div>
        ) : (
          <>
            <h2 className="mb-4 font-display text-2xl font-extrabold">{t("fridge.contents")}</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
              {items.map(({ product, qty }, idx) => (
                <li key={product.id}>
                  <ProductCard priority={idx < 4} product={product} qty={qty} soldOutLabel={t("stock.soldOut")} lowLabel={t("stock.low")} availableLabel={t("stock.available")} unit={t("common.unit")} />
                </li>
              ))}
            </ul>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [Wallet, "fridge.trust1"],
                [Video, "fridge.trust2"],
                [ReceiptIcon, "fridge.trust3"],
              ].map(([Icon, key]) => {
                const I = Icon as typeof Wallet;
                return (
                  <li key={key as string} className="flex min-h-11 items-center gap-3 rounded-2xl bg-surface p-4 font-medium">
                    <I size={22} className="shrink-0 text-accent-strong" aria-hidden />
                    {t(key as string)}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted"><ShieldCheck size={16} aria-hidden />{t("fridge.secure")}</p>
          </>
        )}
      </main>

      {!offline && flow.name === "idle" && (
        <div className="sticky inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md">
            <Button variant="accent" size="lg" className="w-full" onClick={onOpen}>{t("fridge.open")}</Button>
          </div>
        </div>
      )}

      </div>

      <FlowOverlay state={flow} onClosed={() => dispatch({ type: "DOOR_CLOSED" })} onReset={() => dispatch({ type: "RESET" })} />

      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-24 right-2 z-[70] flex max-w-[11rem] flex-col gap-1 rounded-xl bg-black/80 p-2 text-xs text-white">
          <button onClick={() => setDevOpen((o) => !o)} className="text-left font-bold">DEV · {flow.name}</button>
          {devOpen &&
            ([
              ["idle", initialFlow],
              ["unlocking", { name: "unlocking" }],
              ["door_open", { name: "door_open" }],
              ["processing", { name: "processing" }],
              ["receipt", { name: "receipt", order: SAMPLE_ORDER(fridge.id) }],
              ["nothing_taken", { name: "nothing_taken" }],
              ["error", { name: "error", reason: "unlock_timeout" }],
            ] as [string, FlowState][]).map(([label, st]) => (
            <button key={label} onClick={() => force(st)} className="rounded bg-white/15 px-2 py-1 text-left hover:bg-white/30">{label}</button>
          ))}
        </div>
      )}
    </>
  );
}
