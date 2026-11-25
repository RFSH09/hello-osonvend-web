import type { Order } from "@/lib/api/types";

export type Provider = "payme" | "click";

export type Profile = {
  phone: string; // 9 national digits
  name: string;
  email: string;
  birthday: string; // yyyy-mm-dd or ""
};

/** Only provider-side masked data is kept. Never a full card number. */
export type SavedCard = {
  id: string;
  provider: Provider;
  last4: string;
  bin: string; // first 4 digits (8600 Uzcard / 9860 Humo)
  expiry: string; // MM/YY
  isDefault: boolean;
};

export type Purchase = Order & {
  fridgeName: string;
  cardLast4?: string;
};

export type TicketStatus = "open" | "checking" | "resolved";
export type TicketReason = "wrongItem" | "notCharged" | "overcharged" | "doorIssue" | "other";
export type Ticket = {
  id: string;
  orderId?: string;
  reason: TicketReason;
  comment: string;
  photoName?: string;
  status: TicketStatus;
  createdAt: string;
  timeline: { status: TicketStatus; at: string }[];
};

export type Device = { id: string; name: string; lastActive: string; current: boolean };
export type Settings = { sms: boolean; telegram: boolean };

export type AccountDB = {
  v: 1;
  profile: Profile;
  cards: SavedCard[];
  purchases: Purchase[];
  tickets: Ticket[];
  devices: Device[];
  settings: Settings;
  deleteRequested: boolean;
};
