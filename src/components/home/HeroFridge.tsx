"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, ScanLine } from "lucide-react";
import { ProductVisual } from "@/components/art/ProductVisual";
import { FridgeModel } from "./FridgeModel";
import type { Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";

type Chip = { product: Product; className: string; delay: number; drift: number };

/**
 * Hero visual: the real fridge (background removed) floating on the brand panel,
 * with a pulsing green halo, a light sweep over the glass and product cards popping out.
 */
export function HeroFridge({
  products,
  unit,
  alt,
  doorOpenLabel,
  scanLabel,
}: {
  products: Product[];
  unit: string;
  alt: string;
  doorOpenLabel: string;
  scanLabel: string;
}) {
  const reduce = useReducedMotion();
  const chips: Chip[] = [
    { product: products[0], className: "left-0 top-[14%] sm:-left-6", delay: 0.55, drift: -8 },
    { product: products[1], className: "right-0 top-[40%] sm:-right-4", delay: 0.7, drift: 8 },
    { product: products[2], className: "max-sm:hidden left-2 bottom-[16%] sm:-left-2", delay: 0.85, drift: -6 },
  ].filter((c) => c.product) as Chip[];

  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[440px] sm:h-[580px]">
      {/* Halo */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/35 blur-[80px] sm:size-[380px]"
        animate={reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Floor shadow */}
      <motion.div
        aria-hidden
        className="absolute bottom-2 left-1/2 h-6 w-48 -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl"
        animate={reduce ? undefined : { scaleX: [1, 0.9, 1], opacity: [0.6, 0.45, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fridge */}
      <motion.div
        className="absolute inset-x-0 bottom-6 top-2 mx-auto flex justify-center"
        initial={reduce ? false : { y: 30, rotate: -2 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.1 }}
      >
        <motion.div
          className="relative size-full"
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <div role="img" aria-label={alt} className="h-full"><FridgeModel className="mx-auto h-full w-auto max-w-full [&>div]:mx-auto [&>div]:h-full [&>div]:w-auto" /></div>
        </motion.div>
      </motion.div>

      {/* Product chips */}
      {chips.map(({ product, className, delay, drift }) => (
        <motion.div
          key={product.id}
          className={`absolute ${className} z-10`}
          initial={reduce ? false : { scale: 0.4, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14, delay }}
        >
          <motion.div
            className="flex items-center gap-2 rounded-2xl bg-white p-2 pr-3 text-navy shadow-[0_12px_30px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/5"
            animate={reduce ? undefined : { y: [0, drift, 0] }}
            transition={{ duration: 4 + delay * 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="relative block size-11 overflow-hidden rounded-xl bg-white sm:size-12">
              <ProductVisual product={product} className="size-full" sizes="48px" />
            </span>
            <span className="leading-tight">
              <span className="block max-w-[96px] truncate text-[11px] font-semibold text-[#5d6275] sm:text-xs">{product.name}</span>
              <span className="block font-display text-sm font-extrabold">{formatPrice(product.price, unit)}</span>
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* Status pills */}
      <motion.span
        className="absolute right-1 top-[8%] z-10 inline-flex items-center gap-1.5 rounded-full bg-panel/90 px-3 py-1.5 text-xs font-bold text-accent ring-1 ring-white/15 backdrop-blur sm:right-0 sm:text-sm"
        initial={reduce ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.4 }}
      >
        <ScanLine size={14} aria-hidden /> {scanLabel}
      </motion.span>
      <motion.span
        className="absolute bottom-[4%] right-[6%] z-10 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-navy shadow-xl"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      >
        <span className="relative flex size-5 items-center justify-center rounded-full bg-accent">
          {!reduce && <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />}
          <Check size={13} strokeWidth={3} className="relative" aria-hidden />
        </span>
        {doorOpenLabel}
      </motion.span>
    </div>
  );
}
