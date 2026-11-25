import { FRIDGES } from "@/lib/data/fridges";
import { PRODUCTS } from "@/lib/data/products";
import type { AccountDB, Purchase } from "./types";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Mock user: 2 cards (Payme + Click), ~25 purchases over 3 months, 1 open ticket. */
export function seedDb(phone: string, now = Date.now()): AccountDB {
  const rnd = rng(20241125);
  const fridges = FRIDGES.filter((f) => f.public && f.status !== "offline").slice(0, 5);
  const DAY = 86_400_000;

  const cards = [
    { id: "c-payme", provider: "payme" as const, last4: "1234", bin: "8600", expiry: "09/28", isDefault: true },
    { id: "c-click", provider: "click" as const, last4: "4821", bin: "9860", expiry: "03/27", isDefault: false },
  ];

  const purchases: Purchase[] = Array.from({ length: 25 }, (_, i) => {
    const fridge = fridges[Math.floor(rnd() * fridges.length)];
    const n = 1 + Math.floor(rnd() * 3);
    const items = Array.from({ length: n }, () => {
      const p = PRODUCTS[Math.floor(rnd() * PRODUCTS.length)];
      return { productId: p.id, qty: 1 + (rnd() > 0.85 ? 1 : 0), price: p.price };
    }).filter((it, idx, arr) => arr.findIndex((x) => x.productId === it.productId) === idx);
    const daysAgo = i * 3.4 + rnd() * 2 + (i === 0 ? 0.02 : 0);
    const d = new Date(now - daysAgo * DAY);
    d.setUTCHours(4 + Math.floor(rnd() * 10), Math.floor(rnd() * 60), 0, 0); // ~09:00-19:00 Tashkent
    const method = rnd() > 0.35 ? "payme" : "click";
    let status: Purchase["status"] = "paid";
    if (i === 0) status = "processing";
    else if (i === 7) status = "canceled";
    else if (i === 13) status = "nothing_taken";
    const kept = status === "nothing_taken" ? [] : items;
    return {
      id: `P${1000 + (25 - i)}`,
      fridgeId: fridge.id,
      fridgeName: fridge.name,
      status,
      method,
      cardLast4: method === "payme" ? "1234" : "4821",
      createdAt: d.toISOString(),
      items: kept,
      total: kept.reduce((s, it) => s + it.price * it.qty, 0),
    } as Purchase;
  }).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const t1 = new Date(now - 2 * DAY).toISOString();
  const t2 = new Date(now - 2 * DAY + 3_600_000).toISOString();
  const target = purchases.find((p) => p.status === "paid" && p.items.length > 0)!;

  return {
    v: 1,
    profile: { phone, name: "Aziz Karimov", email: "", birthday: "" },
    cards,
    purchases,
    tickets: [
      {
        id: "T-2041",
        orderId: target.id,
        reason: "wrongItem",
        comment: "Menga bir dona ortiqcha mahsulot hisoblangan ko'rinadi.",
        status: "checking",
        createdAt: t1,
        timeline: [
          { status: "open", at: t1 },
          { status: "checking", at: t2 },
        ],
      },
    ],
    devices: [
      { id: "d-this", name: "Chrome · Windows", lastActive: new Date(now).toISOString(), current: true },
      { id: "d-and", name: "Android · Chrome", lastActive: new Date(now - 3 * DAY).toISOString(), current: false },
      { id: "d-ios", name: "iPhone · Safari", lastActive: new Date(now - 12 * DAY).toISOString(), current: false },
    ],
    settings: { sms: true, telegram: false },
    deleteRequested: false,
  };
}
