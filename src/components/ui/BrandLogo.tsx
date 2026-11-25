import { config } from "@/config";
import { cn } from "@/lib/cn";

export type Brand = "payme" | "click";
const NAME: Record<Brand, string> = { payme: "Payme", click: "Click" };

/** Real SVG logo from /public/brands when available (config.brandLogos), else a neutral text badge. */
export function BrandLogo({ brand, className, onDark }: { brand: Brand; className?: string; onDark?: boolean }) {
  if (config.brandLogos[brand]) {
    return (
      <span className={cn("inline-flex items-center", onDark && "rounded-full bg-white px-3 py-1")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/brands/${brand}.svg`} alt={NAME[brand]} className={cn("h-6 w-auto", className)} />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-sm font-bold",
        onDark ? "bg-white text-navy" : "border border-border bg-surface text-foreground",
        className,
      )}
    >
      {NAME[brand]}
    </span>
  );
}
