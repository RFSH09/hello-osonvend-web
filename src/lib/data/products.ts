import type { Category, Product, ProductKind } from "@/lib/api/types";

type Row = [id: string, name: string, price: number, kind: ProductKind, color: string, accent: string, popular?: boolean];

const drinks: Row[] = [
  ["bonaqua", "Bonaqua", 5000, "bottle", "#7DD3FC", "#0369A1"],
  ["coca-cola", "Coca-Cola 0.5L", 9000, "bottle", "#7F1D1D", "#EF4444", true],
  ["fanta", "Fanta 0.5L", 9000, "bottle", "#F97316", "#FDBA74", true],
  ["fuse-tea", "Fuse Tea", 9000, "bottle", "#F59E0B", "#B45309", true],
  ["gorilla", "Gorilla 0.45L", 14000, "can", "#1F2937", "#F59E0B", true],
  ["18plus", "\"18+\"", 14000, "can", "#111827", "#A855F7"],
  ["chortoq", "Chortoq", 14000, "bottle", "#34D399", "#047857"],
  ["moxito", "Moxito", 14000, "bottle", "#86EFAC", "#15803D"],
  ["montella", "Montella", 14000, "bottle", "#60A5FA", "#1D4ED8"],
  ["chernogolovka", "Chernogolovka", 14000, "bottle", "#FDE68A", "#CA8A04"],
  ["sochnaya-dolina", "Sochnaya Dolina 1L", 15000, "bottle", "#FB7185", "#9F1239"],
  ["pulpy-orange", "Pulpy Orange", 15000, "bottle", "#FB923C", "#C2410C"],
  ["viko", "VIKO", 20000, "can", "#0EA5E9", "#0C4A6E"],
  ["adrenaline", "Adrenaline", 20000, "can", "#DC2626", "#FEF08A"],
  ["red-bull-025", "Red Bull 0.25L", 22000, "can", "#93C5FD", "#DC2626"],
  ["red-bull-03", "Red Bull 0.3L", 30000, "can", "#BFDBFE", "#1E3A8A"],
];
const snacks: Row[] = [
  ["super-kontik", "Super kontik", 10000, "pack", "#FACC15", "#B91C1C"],
  ["qurt", "Qurt", 12000, "pack", "#F5F5F4", "#78716C"],
  ["tuc", "Tuc", 14000, "pack", "#1D4ED8", "#FDE047"],
  ["bruni", "Bruni", 16000, "pack", "#A78BFA", "#4C1D95"],
  ["lays", "Lays", 17000, "pack", "#FDE047", "#DC2626", true],
  ["keshyu", "Keshyu", 18000, "pack", "#D6A06A", "#78350F"],
  ["hazel", "Hazel", 18000, "pack", "#92400E", "#FDE68A"],
  ["minikruosan", "Minikruosan", 21000, "pack", "#FDBA74", "#9A3412"],
];
const chocolate: Row[] = [
  ["bounty", "Bounty", 11000, "bar", "#1D4ED8", "#F8FAFC", true],
  ["kitkat", "KitKat", 14000, "bar", "#DC2626", "#F8FAFC"],
  ["twix", "Twix", 14000, "bar", "#B45309", "#FCD34D", true],
  ["snickers", "Snickers", 14000, "bar", "#7C2D12", "#38BDF8", true],
];

function build(rows: Row[], category: Category): Product[] {
  return rows.map(([id, name, price, kind, color, accent, popular]) => ({
    id, name, price, kind, color, accent, category, popular,
  }));
}

export const PRODUCTS: Product[] = [
  ...build(drinks, "drinks"),
  ...build(snacks, "snacks"),
  ...build(chocolate, "chocolate"),
];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
export const CATEGORIES: Category[] = ["drinks", "snacks", "chocolate"];

/** Popular carousel: the 7 from the brief + Lays. */
export const POPULAR_IDS = ["coca-cola", "snickers", "gorilla", "fanta", "fuse-tea", "bounty", "twix", "lays"];
