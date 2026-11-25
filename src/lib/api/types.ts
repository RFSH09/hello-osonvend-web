export type Category = "drinks" | "snacks" | "chocolate" | "food";

/** Text in the 4 site languages. */
export type LocalizedText = { uz: string; "uz-Cyrl": string; ru: string; en: string };
export type ProductKind = "bottle" | "can" | "pack" | "bar";

export type Product = {
  id: string;
  /** Photo file: /public/products/<slug>.webp */
  slug: string;
  name: string;
  /** Size / flavour line under the name, e.g. "500ml", "Olma". */
  subtitle: LocalizedText;
  category: Category;
  kind: ProductKind;
  price: number; // so'm, integer
  color: string; // main colour
  accent: string; // label / stripe colour
  popular?: boolean;
  /** 0 = best seller. */
  popularRank?: number;
};

export type FridgeStatus = "available" | "low" | "offline";
export type FridgeType = "bank" | "telecom" | "university" | "it_park" | "government" | "office";

export type Fridge = {
  /** The real key printed on the QR code, e.g. W0016188. */
  id: string;
  /** Real client name. Public only when config.showClientNames is true. */
  name: string;
  type: FridgeType;
  /** 1-based position among fridges of the same type (used for "Bank ofisi 2"). */
  typeIndex: number;
  /** TODO: the admin panel has no addresses/coordinates yet; fill these in when available. */
  address?: string;
  lat?: number;
  lng?: number;
  status: FridgeStatus;
  access: "public" | "staff";
  public: boolean;
};

export type StockItem = { productId: string; qty: number };

export type OrderItem = { productId: string; qty: number; price: number };
export type Order = {
  id: string;
  fridgeId: string;
  status: "processing" | "paid" | "canceled" | "nothing_taken";
  method: "payme" | "click";
  createdAt: string; // ISO UTC
  items: OrderItem[];
  total: number;
};

export type PartnerLead = {
  company: string;
  contact: string;
  phone: string;
  type: string;
  address: string;
  people: string;
  comment: string;
};
