/** Account API (mock). Same async signatures the Django-backed version will have. */
import type { Order } from "@/lib/api/types";
import { readDb, writeDb } from "./store";
import type { Profile, Provider, SavedCard, Settings, Ticket, TicketReason } from "./types";

const wait = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export async function getProfile() {
  await wait(200);
  return readDb().profile;
}
export async function saveProfile(patch: Partial<Profile>) {
  await wait();
  const db = readDb();
  db.profile = { ...db.profile, ...patch, phone: db.profile.phone };
  writeDb(db);
  return db.profile;
}
export async function changePhone(newPhone: string, code: string) {
  await wait();
  if (!/^\d{6}$/.test(code)) throw new Error("wrong-code");
  const db = readDb();
  db.profile.phone = newPhone;
  // the session follows the new number
  for (const s of [localStorage, sessionStorage]) {
    if (s.getItem("hello.session")) s.setItem("hello.session", JSON.stringify({ phone: newPhone }));
  }
  writeDb(db);
}

export async function listCards() {
  await wait();
  return readDb().cards;
}
/** Called by the (mock) provider page after the user finished linking on the provider's side. */
export async function completeCardLink(provider: Provider) {
  await wait(500);
  const db = readDb();
  const card: SavedCard = {
    id: `c-${Date.now()}`,
    provider,
    last4: String(1000 + Math.floor(Math.random() * 8999)),
    bin: provider === "payme" ? "8600" : "9860",
    expiry: "12/29",
    isDefault: db.cards.length === 0,
  };
  db.cards.push(card);
  writeDb(db);
  return card;
}
export async function setDefaultCard(id: string) {
  await wait(250);
  const db = readDb();
  db.cards = db.cards.map((c) => ({ ...c, isDefault: c.id === id }));
  writeDb(db);
}
export async function removeCard(id: string) {
  await wait(300);
  const db = readDb();
  const wasDefault = db.cards.find((c) => c.id === id)?.isDefault;
  db.cards = db.cards.filter((c) => c.id !== id);
  if (wasDefault && db.cards[0]) db.cards[0].isDefault = true;
  writeDb(db);
}

export async function listPurchases() {
  await wait();
  return readDb().purchases;
}
export async function getPurchase(id: string) {
  await wait(250);
  return readDb().purchases.find((p) => p.id === id) ?? null;
}
/** A purchase made in the fridge flow shows up in history right away. */
export async function recordPurchase(order: Order, fridgeName: string) {
  const db = readDb();
  const card = db.cards.find((c) => c.isDefault);
  db.purchases.unshift({ ...order, id: `P${order.id.slice(-6)}`, fridgeName, cardLast4: card?.last4 });
  writeDb(db);
}

export async function listTickets() {
  await wait();
  return readDb().tickets;
}
export async function createTicket(input: { orderId?: string; reason: TicketReason; comment: string; photoName?: string }) {
  await wait(500);
  const db = readDb();
  const now = new Date().toISOString();
  const t: Ticket = {
    id: `T-${2042 + db.tickets.length}`,
    ...input,
    status: "open",
    createdAt: now,
    timeline: [{ status: "open", at: now }],
  };
  db.tickets.unshift(t);
  writeDb(db);
  return t;
}

export async function getSettings() {
  await wait(200);
  const db = readDb();
  return { settings: db.settings, devices: db.devices, deleteRequested: db.deleteRequested };
}
export async function saveSettings(patch: Partial<Settings>) {
  const db = readDb();
  db.settings = { ...db.settings, ...patch };
  writeDb(db);
}
export async function signOutDevice(id: string) {
  await wait(250);
  const db = readDb();
  db.devices = db.devices.filter((d) => d.id !== id);
  writeDb(db);
}
export async function requestDeletion() {
  await wait(500);
  const db = readDb();
  db.deleteRequested = true;
  writeDb(db);
}
