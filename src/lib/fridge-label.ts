"use client";

import { useTranslations } from "next-intl";
import { config } from "@/config";
import type { Fridge } from "@/lib/api/types";
import { findFridge } from "@/lib/data/fridges";

type Labelable = Pick<Fridge, "name" | "type" | "typeIndex">;

/**
 * Public label for a fridge. Client names are not public yet, so unless config.showClientNames is true
 * it shows a generic label by type, numbered when the type repeats: "Bank ofisi", "Bank ofisi 2", ...
 */
export function useFridgeLabel() {
  const t = useTranslations("fridgeTypes");
  const label = (f: Labelable) => {
    if (config.showClientNames) return f.name;
    return f.typeIndex > 1 ? `${t(f.type)} ${f.typeIndex}` : t(f.type);
  };
  /** Label for a fridge id (purchase history); falls back to the stored name for unknown ids. */
  const byId = (id: string, fallback = id) => {
    const f = findFridge(id);
    return f ? label(f) : fallback;
  };
  return { label, byId, typeName: (type: Fridge["type"]) => t(type) };
}
