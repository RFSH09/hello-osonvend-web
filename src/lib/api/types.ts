export type Category = "drinks" | "snacks" | "chocolate";
export type ProductKind = "bottle" | "can" | "pack" | "bar";

export type Product = {
  id: string;
  name: string;
  category: Category;
  kind: ProductKind;
  price: number; // so'm, integer
  color: string; // main colour
  accent: string; // label / stripe colour
  popular?: boolean;
};

export type FridgeStatus = "available" | "low" | "offline";
export type District =
  | "yunusobod"
  | "mirzoUlugbek"
  | "chilonzor"
  | "shayxontohur"
  | "mirobod"
  | "yakkasaroy"
  | "olmazor"
  | "sergeli";

export type Fridge = {
  id: string;
  name: string;
  address: string;
  district: District;
  lat: number;
  lng: number;
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
