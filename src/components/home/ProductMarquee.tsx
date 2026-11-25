"use client";

import { useReducedMotion } from "framer-motion";
import { ProductVisual } from "@/components/art/ProductVisual";
import type { Product } from "@/lib/api/types";

/** Endless row of real products (pauses on hover, static with reduced motion). */
export function ProductMarquee({ products, label }: { products: Product[]; label: string }) {
  const reduce = useReducedMotion();
  const row = [...products, ...products];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-panel py-5" aria-label={label}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-panel to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-panel to-transparent" />
      <ul
        className={`flex w-max gap-4 ${reduce ? "" : "animate-marquee hover:[animation-play-state:paused]"}`}
      >
        {row.map((p, i) => (
          <li
            key={`${p.id}-${i}`}
            aria-hidden={i >= products.length}
            className="flex shrink-0 items-center gap-3 rounded-2xl bg-white/[0.06] py-2 pl-2 pr-4 ring-1 ring-white/10"
          >
            <span className="relative block size-12 overflow-hidden rounded-xl bg-white">
              <ProductVisual product={p} className="size-full p-1" sizes="48px" />
            </span>
            <span className="whitespace-nowrap text-sm font-semibold text-white/85">{p.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
