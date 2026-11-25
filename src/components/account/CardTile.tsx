"use client";

import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/cn";
import type { SavedCard } from "@/lib/account/types";

/** Realistic card tile. Shows masked data only (the provider stores the real card). */
export function CardTile({ card, className }: { card: SavedCard; className?: string }) {
  const t = useTranslations("account.cards");
  return (
    <div
      className={cn(
        "relative flex aspect-[1.6/1] w-full max-w-[340px] flex-col justify-between overflow-hidden rounded-3xl p-5 text-white shadow-lg",
        card.provider === "payme" ? "bg-gradient-to-br from-[#0E7490] via-[#164E63] to-navy" : "bg-gradient-to-br from-[#2563EB] via-[#1E3A8A] to-navy",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10" aria-hidden />
      <div className="relative flex items-start justify-between">
        <BrandLogo brand={card.provider} onDark />
        {card.isDefault && (
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-navy">{t("defaultBadge")}</span>
        )}
      </div>
      <div className="relative">
        <div className="whitespace-nowrap font-display text-lg font-bold tracking-wider tabular-nums sm:text-xl">
          {card.bin} •••• •••• {card.last4}
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-white/80">
          <span>{t("expires")}</span>
          <span className="font-semibold tabular-nums text-white">{card.expiry}</span>
        </div>
      </div>
    </div>
  );
}
