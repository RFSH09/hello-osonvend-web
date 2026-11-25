/**
 * API boundary. The UI only talks to these functions.
 * Beta runs on the mock below; swap the bodies for fetch() calls to the Django
 * backend (same signatures) when the real endpoints are confirmed.
 */
import { distanceKm, findFridge, FRIDGES, stockFor } from "@/lib/data/fridges";
import { PRODUCT_BY_ID } from "@/lib/data/products";
import type { Fridge, Order, PartnerLead, StockItem } from "./types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getFridge(id: string): Promise<Fridge | null> {
  return findFridge(id);
}

export async function getStock(fridge: Fridge): Promise<StockItem[]> {
  return stockFor(fridge);
}

export async function listPublicFridges(): Promise<Fridge[]> {
  return FRIDGES.filter((f) => f.public);
}

export async function nearestFridges(from: Fridge, limit = 3): Promise<Fridge[]> {
  return FRIDGES.filter((f) => f.public && f.status !== "offline" && f.id !== from.id)
    .sort((a, b) => distanceKm(from, a) - distanceKm(from, b))
    .slice(0, limit);
}

/** Mock: any phone is accepted; any 6-digit code is accepted. */
export async function requestOtp(_phone: string): Promise<void> {
  await wait(500);
}
export async function verifyOtp(_phone: string, code: string): Promise<boolean> {
  await wait(500);
  return /^\d{6}$/.test(code);
}

/** Mock: build a plausible paid order from the fridge stock. */
export async function settleOrder(fridge: Fridge): Promise<Order> {
  await wait(300);
  const stock = stockFor(fridge).filter((s) => s.qty > 0);
  const picks = stock.slice(0, 2 + (fridge.id.length % 2));
  const items = picks.map((s) => ({
    productId: s.productId,
    qty: 1,
    price: PRODUCT_BY_ID.get(s.productId)!.price,
  }));
  return {
    id: `${Date.now()}`,
    fridgeId: fridge.id,
    status: "paid",
    method: Date.now() % 2 ? "payme" : "click",
    createdAt: new Date().toISOString(),
    items,
    total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
  };
}

export async function submitLead(lead: PartnerLead): Promise<void> {
  await wait(700);
  // Mock only: real implementation POSTs to the Django lead endpoint.
  console.info("[mock] partner lead", lead);
}
