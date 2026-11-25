import type { Category, LocalizedText, Product, ProductKind } from "@/lib/api/types";

/**
 * Product catalogue — mirrors the live price list on https://osonvend.uz/ (30 items, 25 Nov 2026).
 * Photos: /public/products/<slug>.webp (800x800, downloaded from osonvend.uz).
 * Later this comes from the Django API (getProducts), so prices are edited in the admin panel.
 */
type Row = [
  id: string,
  slug: string,
  name: string,
  subtitle: string | LocalizedText,
  price: number,
  kind: ProductKind,
  color: string,
  accent: string,
];

const t = (uz: string, uzCyrl: string, ru: string, en: string): LocalizedText => ({ uz, "uz-Cyrl": uzCyrl, ru, en });

const drinks: Row[] = [
  ["coca-cola", "coca-cola-05", "Coca-Cola 0.5L", "500ml", 9000, "bottle", "#7F1D1D", "#EF4444"],
  ["fanta", "fanta-05", "Fanta 0.5L", "500ml", 9000, "bottle", "#F97316", "#FDBA74"],
  ["fuse-tea", "fuse-tea-05", "Fuse Tea 0.5L", "500ml", 9000, "bottle", "#F59E0B", "#B45309"],
  ["bonaqua", "bonaqua-05", "Bonaqua 0.5L", "500ml", 5000, "bottle", "#7DD3FC", "#0369A1"],
  ["gorilla", "gorilla-045", "Gorilla 0.45L", t("Energetik", "Энергетик", "Энергетик", "Energy drink"), 14000, "can", "#1F2937", "#84CC16"],
  ["18plus", "18plus-045", "18+ 0.45L", t("Energetik", "Энергетик", "Энергетик", "Energy drink"), 14000, "can", "#111827", "#EF4444"],
  ["chortoq", "chortoq-05", "Chortoq 0.5L", t("Mineral suv", "Минерал сув", "Минеральная вода", "Mineral water"), 14000, "bottle", "#34D399", "#047857"],
  ["moxito", "moxito-05", "Moxito 0.5L", t("Alkogolsiz", "Алкоголсиз", "Безалкогольный", "Non-alcoholic"), 14000, "can", "#86EFAC", "#15803D"],
  ["montella", "montella-anor-05", "Montella 0.5L", t("Anor", "Анор", "Гранат", "Pomegranate"), 14000, "can", "#F472B6", "#9D174D"],
  ["chernogolovka", "chernogolovka-dyushes-05", "Chernogolovka 0.5L", t("Dyushes", "Дюшес", "Дюшес", "Pear soda"), 14000, "bottle", "#FDE68A", "#CA8A04"],
  ["sochnaya-dolina", "sochnaya-dolina-olma-1l", "Sochnaya Dolina 1L", t("Olma", "Олма", "Яблоко", "Apple"), 15000, "bottle", "#86EFAC", "#166534"],
  ["pulpy-orange", "pulpy-orange-05", "Pulpy Orange 0.5L", "500ml", 15000, "bottle", "#FB923C", "#C2410C"],
  ["viko", "viko-olma-1l", "VIKO 1L", t("Olma", "Олма", "Яблоко", "Apple"), 20000, "bottle", "#111827", "#84CC16"],
  ["adrenaline", "adrenaline-05", "Adrenaline 0.5L", t("Energetik", "Энергетик", "Энергетик", "Energy drink"), 20000, "can", "#111827", "#FACC15"],
  ["red-bull-025", "redbull-025-sf", "Red Bull 0.25L", t("Shakarsiz", "Шакарсиз", "Без сахара", "Sugar free"), 22000, "can", "#93C5FD", "#DC2626"],
  ["red-bull-03", "redbull-03", "Red Bull 0.3L", "330ml", 30000, "can", "#BFDBFE", "#1E3A8A"],
];
const snacks: Row[] = [
  ["super-kontik", "super-kontik-100", "Super kontik", "100g", 10000, "pack", "#FACC15", "#B91C1C"],
  ["qurt", "qurt-45", "Qurt", "45g · Bisyor", 12000, "pack", "#F97316", "#FFFFFF"],
  ["tuc", "tuc-25", "Tuc", "Original 25g", 14000, "pack", "#FACC15", "#1D4ED8"],
  ["bruni", "bruni-choco", "Bruni", "Choco", 16000, "pack", "#D4A017", "#5B3A1A"],
  ["lays", "lays-70", "Lay's", "70g", 17000, "pack", "#FDE047", "#DC2626"],
  ["keshyu", "keshyu-40", "Keshyu", "40g · Bisyor", 18000, "pack", "#F5F5F4", "#D6A06A"],
  ["hazel", "hazel-255", "Hazel", "255g", 18000, "pack", "#16A34A", "#92400E"],
  ["minikruosan", "minikruosan-105", "Minikruosan 7 Days", "105g", 21000, "pack", "#DC2626", "#FDBA74"],
];
const chocolate: Row[] = [
  ["bounty", "bounty-57", "Bounty", "57g", 11000, "bar", "#1D4ED8", "#F8FAFC"],
  ["kitkat", "kitkat-duo-64", "KitKat", "Duo 64g", 14000, "bar", "#DC2626", "#F8FAFC"],
  ["twix", "twix-xtra-75", "Twix", "Xtra 75g", 14000, "bar", "#B45309", "#FCD34D"],
  ["snickers", "snickers-super-80", "Snickers", "Super 80g", 14000, "bar", "#7C2D12", "#38BDF8"],
];
const food: Row[] = [
  ["sandwich", "sandwich", "Sendvich", "200g", 17000, "pack", "#F59E0B", "#FFFFFF"],
  ["lactel", "lactel-1l", "Lactel 1L", t("Sut 2%", "Сут 2%", "Молоко 2%", "Milk 2%"), 21000, "bottle", "#E0F2FE", "#16A34A"],
];

/** Best sellers (real sales, Oct 2026) — order of the home carousel. */
export const POPULAR_IDS = ["coca-cola", "snickers", "gorilla", "fanta", "fuse-tea", "18plus", "bounty", "twix", "chortoq", "keshyu"];

function build(rows: Row[], category: Category): Product[] {
  return rows.map(([id, slug, name, subtitle, price, kind, color, accent]) => ({
    id,
    slug,
    name,
    subtitle: typeof subtitle === "string" ? t(subtitle, subtitle, subtitle, subtitle) : subtitle,
    price,
    kind,
    color,
    accent,
    category,
    popular: POPULAR_IDS.includes(id),
    popularRank: POPULAR_IDS.includes(id) ? POPULAR_IDS.indexOf(id) : undefined,
  }));
}

export const PRODUCTS: Product[] = [
  ...build(drinks, "drinks"),
  ...build(chocolate, "chocolate"),
  ...build(snacks, "snacks"),
  ...build(food, "food"),
];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
export const CATEGORIES: Category[] = ["drinks", "chocolate", "snacks", "food"];

/** Photo filenames (without .webp) in /public/products/. */
export const PHOTO_SLUG: Record<string, string> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.slug]));
