/** Money is always an integer number of so'm. 18500 -> "18 500 so'm". */
export function formatPrice(amount: number, unit = "so'm"): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${sign}${digits} ${unit}`;
}

/** Wall-clock parts in Asia/Tashkent, regardless of server/browser timezone. */
export function tashkentParts(date: Date | string) {
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
  const hour = g("hour") === "24" ? "00" : g("hour");
  return { day: g("day"), month: g("month"), year: g("year"), hour, minute: g("minute") };
}

/** "25.11.2026 13:25" */
export function formatTashkentTime(date: Date | string, _locale = "uz"): string {
  const p = tashkentParts(date);
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`;
}

/** "25.11.2026" */
export function formatTashkentDate(date: Date | string): string {
  const p = tashkentParts(date);
  return `${p.day}.${p.month}.${p.year}`;
}

/** "2026-11" key for grouping/filtering by month in Tashkent time. */
export function tashkentMonthKey(date: Date | string): string {
  const p = tashkentParts(date);
  return `${p.year}-${p.month}`;
}

/** "2026-11-25" for comparing with <input type="date"> values. */
export function tashkentDayKey(date: Date | string): string {
  const p = tashkentParts(date);
  return `${p.year}-${p.month}-${p.day}`;
}
