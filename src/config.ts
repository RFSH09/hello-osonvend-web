/** Beta config flags. Flip these when the open items are confirmed. */
export const config = {
  /** Open item: is the fridge "free for the location"? Hides the claim when false. */
  freeForLocation: false,
  /** Open item: permission to show client names/logos. Hidden by default. */
  showPartnerLogos: false,
  /**
   * Photos showing a client (Mikrokreditbank, Kapitalbank, Tashkent Perfect University).
   * Keep false until each client has given written permission. Only fridge-hallway shows when false.
   */
  showClientPhotos: false,
  /** Open item: client names are not public yet. When false, fridges show a generic label by type. */
  showClientNames: false,
  /** Public numbers shown on the home page (no revenue on the public site). */
  stats: { fridges: 25, orders: 170000, since: 2024 },
  /** Loyalty: "every Nth purchase is discounted". Flip `enabled` to hide the whole section. */
  loyalty: { enabled: true, every: 10, discountPercent: 10 },
  /** Keep false (neutral text badges) until the OFFICIAL logo files replace the placeholders in /public/brands/. */
  brandLogos: { payme: false, click: false },
  contact: {
    phone: "+998 94 403 16 11",
    phoneHref: "tel:+998944031611",
    instagram: "https://instagram.com/hello_vending",
    telegram: "https://t.me/Hello_vending_bot",
    whatsapp: "https://wa.me/998944031611",
  },
} as const;
