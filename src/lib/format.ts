/** Money is always an integer number of so'm. 18500 -> "18 500 so'm". */
export function formatPrice(amount: number, unit = "so'm"): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${digits} ${unit}`;
}

/** Display timestamps in Asia/Tashkent regardless of server/browser timezone: "25.11.2026 13:25". */
export function formatTashkentTime(date: Date | string, _locale = "uz"): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(typeof date === "string" ? new Date(date) : date);
  const g = (t: string) => parts.find((x) => x.type === t)?.value ?? "";
  return `${g("day")}.${g("month")}.${g("year")} ${g("hour")}:${g("minute")}`;
}
