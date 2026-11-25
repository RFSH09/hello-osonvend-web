/** Money is always an integer number of so'm. 18500 -> "18 500 so'm". */
export function formatPrice(amount: number, unit = "so'm"): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${digits} ${unit}`;
}

/** Display timestamps in Asia/Tashkent regardless of server/browser timezone. */
export function formatTashkentTime(
  date: Date | string,
  locale = "uz",
  opts: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
): string {
  const lang = locale === "uz-Cyrl" ? "uz-Cyrl-UZ" : locale;
  return new Intl.DateTimeFormat(lang, { ...opts, timeZone: "Asia/Tashkent" }).format(
    typeof date === "string" ? new Date(date) : date,
  );
}
