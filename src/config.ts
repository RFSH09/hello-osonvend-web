/** Beta config flags. Flip these when the open items are confirmed. */
export const config = {
  /** Open item: is the fridge "free for the location"? Hides the claim when false. */
  freeForLocation: false,
  /** Open item: permission to show client names/logos. Hidden by default. */
  showPartnerLogos: false,
  /** Loyalty program (account area, later). */
  loyalty: false,
  contact: {
    phone: "+998 94 403 16 11",
    phoneHref: "tel:+998944031611",
    instagram: "https://instagram.com/hello_vending",
    telegram: "https://t.me/Hello_vending_bot",
    whatsapp: "https://wa.me/998944031611",
  },
} as const;
