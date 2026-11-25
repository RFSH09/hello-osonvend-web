"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { EmptyState, ProductCard } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { CATEGORIES, PRODUCTS } from "@/lib/data/products";

export function ProductsGrid() {
  const t = useTranslations();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const list = PRODUCTS.filter(
    (p) => (cat === "all" || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={t("nav.products")}>
          {["all", ...CATEGORIES].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-5 font-semibold transition-colors duration-200",
                cat === c ? "border-navy bg-navy text-white" : "border-border bg-surface hover:bg-background",
              )}
            >
              {c === "all" ? t("common.all") : t(`categories.${c}`)}
            </button>
          ))}
        </div>
        <label className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 sm:w-72">
          <Search size={18} className="text-muted" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("productsPage.search")}
            aria-label={t("productsPage.search")}
            className="w-full bg-transparent outline-none"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <EmptyState title={t("productsPage.empty")} text={t("empty.text")} />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {list.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} soldOutLabel={t("stock.soldOut")} lowLabel={t("stock.low")} unit={t("common.unit")} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
