"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/api/types";
import { ProductArt } from "./ProductArt";

// Tiny neutral blur placeholder (light grey).
const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmNWY3ZmEiLz48L3N2Zz4=";

const warned = new Set<string>();

/**
 * Real product photo from /public/products/<slug>.webp (800x800, white or transparent bg).
 * Falls back to the drawn SVG if the file is missing and logs the slug in dev.
 */
export function ProductVisual({
  product,
  className,
  sizes = "(max-width: 640px) 45vw, 220px",
  priority,
}: {
  product: Pick<Product, "slug" | "kind" | "color" | "accent" | "name">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return <ProductArt product={product} className={className} />;
  return (
    <span className={cn("relative block", className)}>
      <Image
        src={`/products/${product.slug}.webp`}
        alt={product.name}
        width={800}
        height={800}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={BLUR}
        priority={priority}
        className="size-full object-contain mix-blend-multiply"
        onError={() => {
          if (process.env.NODE_ENV === "development" && !warned.has(product.slug)) {
            warned.add(product.slug);
            console.warn(`[products] missing photo: /public/products/${product.slug}.webp`);
          }
          setFailed(true);
        }}
      />
    </span>
  );
}
