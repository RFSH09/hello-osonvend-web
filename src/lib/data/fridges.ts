import type { Fridge, FridgeStatus, FridgeType, StockItem } from "@/lib/api/types";
import { PRODUCTS } from "./products";

/**
 * The 25 real working fridges (admin panel, 25 Nov 2026). Keys are the IDs printed on the QR codes.
 * TODO: the admin has no addresses or coordinates yet. Add `address`, `lat` and `lng` per fridge
 * when they are available: fridges without lat/lng are listed but not shown on the map.
 * Client names are NOT public: they only show when config.showClientNames is true.
 */
const RAW: [id: string, name: string, type: FridgeType][] = [
  ["W0016188", "MKB Amaliyot", "bank"],
  ["W0019541", "Mobiuz 1", "telecom"],
  ["W0016187", "MKB Back office", "bank"],
  ["W0016186", "Knauf", "office"],
  ["W0016189", "MAAB", "university"],
  ["W0019553", "KPMG 8/Infinity", "office"],
  ["W0009013", "Mobiuz 2", "telecom"],
  ["W0008765", "Ucell Plaza", "telecom"],
  ["W0019547", "KPMG 9/Infinity", "office"],
  ["W0008444", "IT Park Ventures", "it_park"],
  ["W0008764", "Ucell Vaxidova 2", "telecom"],
  ["W0019557", "IT Park 6", "it_park"],
  ["W0019552", "AVO TECH", "office"],
  ["W0008766", "Ucell Dim Tower 4", "telecom"],
  ["W0016192", "Kapital Yashnaobod", "bank"],
  ["W0009016", "Ucell Vaxidova", "telecom"],
  ["W0009015", "Adliya vazirligi", "government"],
  ["W0019554", "7TECH/Qoratosh", "office"],
  ["W0019542", "ITPU", "university"],
  ["W0009014", "Ucell Dim Tower 3", "telecom"],
  ["W0008767", "Mobiuz Labzak", "telecom"],
  ["W0019543", "Sud Med Ekspertiza", "government"],
  ["W0019551", "UDEVS Anor Plaza", "office"],
  ["W0019559", "Veterinariya qo'mitasi", "government"],
  ["W0019560", "AVIS", "office"],
];

const counts = new Map<FridgeType, number>();
export const FRIDGES: Fridge[] = RAW.map(([id, name, type]) => {
  const typeIndex = (counts.get(type) ?? 0) + 1;
  counts.set(type, typeIndex);
  // All 25 are staff/students only. Status comes from the admin panel (all working).
  return { id, name, type, typeIndex, status: "available", access: "staff", public: true };
});

/** Order in which types are listed. */
export const FRIDGE_TYPES: FridgeType[] = ["bank", "telecom", "university", "it_park", "government", "office"];

/** Small deterministic PRNG so the same fridge always shows the same (mock) stock. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const STATUSES: FridgeStatus[] = ["available", "available", "available", "low"];

/**
 * A real key returns that fridge. Any other W+7-digit key returns a generated mock fridge in
 * development only; in production unknown keys return null ("Muzlatgich topilmadi").
 */
export function findFridge(id: string): Fridge | null {
  const known = FRIDGES.find((f) => f.id.toLowerCase() === id.toLowerCase());
  if (known) return known;
  if (process.env.NODE_ENV !== "development" || !/^W\d{7}$/i.test(id)) return null;
  const rnd = seeded(id.toUpperCase());
  return {
    id: id.toUpperCase(),
    name: `Hello ${id.toUpperCase()}`,
    type: "office",
    typeIndex: 0,
    status: STATUSES[Math.floor(rnd() * STATUSES.length)],
    access: "staff",
    public: false,
  };
}

/** TODO: real stock comes from the backend; this is deterministic mock data. */
export function stockFor(fridge: Fridge): StockItem[] {
  const rnd = seeded(fridge.id);
  const low = fridge.status === "low";
  return PRODUCTS.filter(() => rnd() > 0.35).map((p) => {
    const r = rnd();
    const qty = low ? (r < 0.4 ? 0 : r < 0.8 ? 1 + Math.floor(rnd() * 2) : 4) : r < 0.08 ? 0 : r < 0.2 ? 1 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 8);
    return { productId: p.id, qty };
  });
}

export function hasCoords(f: Fridge): f is Fridge & { lat: number; lng: number } {
  return typeof f.lat === "number" && typeof f.lng === "number";
}

/** Distance in km, or null when either fridge has no coordinates yet. */
export function distanceKm(a: Fridge, b: Fridge): number | null {
  if (!hasCoords(a) || !hasCoords(b)) return null;
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
