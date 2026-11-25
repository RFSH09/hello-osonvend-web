import type { District, Fridge, FridgeStatus, StockItem } from "@/lib/api/types";
import { PRODUCTS } from "./products";

/** Appendix B: generic mock fridges, one offline. */
export const FRIDGES: Fridge[] = [
  { id: "W0016188", name: "Office Tower — Yunusobod", address: "Yunusobod, 4-kvartal", district: "yunusobod", lat: 41.3646, lng: 69.2877, status: "available", access: "staff", public: true },
  { id: "W0016189", name: "University Campus — Mirzo Ulug'bek", address: "Mirzo Ulug'bek tumani", district: "mirzoUlugbek", lat: 41.3392, lng: 69.3345, status: "available", access: "public", public: true },
  { id: "W0016190", name: "Business Center — Chilonzor", address: "Chilonzor, 9-kvartal", district: "chilonzor", lat: 41.2754, lng: 69.2047, status: "low", access: "staff", public: true },
  { id: "W0016191", name: "Medical Clinic — Shayxontohur", address: "Shayxontohur tumani", district: "shayxontohur", lat: 41.3265, lng: 69.2362, status: "available", access: "public", public: true },
  { id: "W0016192", name: "IT Park — Mirobod", address: "Mirobod tumani", district: "mirobod", lat: 41.2995, lng: 69.2793, status: "available", access: "staff", public: true },
  { id: "W0016193", name: "Trade Hub — Yakkasaroy", address: "Yakkasaroy tumani", district: "yakkasaroy", lat: 41.2891, lng: 69.2542, status: "offline", access: "staff", public: true },
  { id: "W0016194", name: "Tech Office — Olmazor", address: "Olmazor tumani", district: "olmazor", lat: 41.3548, lng: 69.2431, status: "available", access: "staff", public: true },
  { id: "W0016195", name: "Factory Office — Sergeli", address: "Sergeli tumani", district: "sergeli", lat: 41.2271, lng: 69.2195, status: "low", access: "staff", public: true },
  { id: "W0016196", name: "Co-working — Yunusobod", address: "Yunusobod, 11-kvartal", district: "yunusobod", lat: 41.3723, lng: 69.2956, status: "available", access: "public", public: true },
  { id: "W0016197", name: "Private Office (hidden)", address: "Toshkent", district: "mirobod", lat: 41.3, lng: 69.27, status: "available", access: "staff", public: false },
];

/** Small deterministic PRNG so the same fridge always shows the same stock. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const DISTRICTS: District[] = ["yunusobod", "mirzoUlugbek", "chilonzor", "shayxontohur", "mirobod", "yakkasaroy", "olmazor", "sergeli"];
const STATUSES: FridgeStatus[] = ["available", "available", "available", "low"];

/** Known fridges come from the list; any other W+7 digit id gets a generated mock fridge. */
export function findFridge(id: string): Fridge | null {
  const known = FRIDGES.find((f) => f.id.toLowerCase() === id.toLowerCase());
  if (known) return known;
  if (!/^W\d{7}$/i.test(id)) return null;
  const rnd = seeded(id.toUpperCase());
  const district = DISTRICTS[Math.floor(rnd() * DISTRICTS.length)];
  return {
    id: id.toUpperCase(),
    name: `Hello ${id.toUpperCase()}`,
    address: "Toshkent",
    district,
    lat: 41.3 + (rnd() - 0.5) * 0.12,
    lng: 69.26 + (rnd() - 0.5) * 0.15,
    status: STATUSES[Math.floor(rnd() * STATUSES.length)],
    access: "staff",
    public: false,
  };
}

export function stockFor(fridge: Fridge): StockItem[] {
  const rnd = seeded(fridge.id);
  const low = fridge.status === "low";
  return PRODUCTS.filter(() => rnd() > 0.35).map((p) => {
    const r = rnd();
    const qty = low ? (r < 0.4 ? 0 : r < 0.8 ? 1 + Math.floor(rnd() * 2) : 4) : r < 0.08 ? 0 : r < 0.2 ? 1 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 8);
    return { productId: p.id, qty };
  });
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
