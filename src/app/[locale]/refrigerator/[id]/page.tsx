import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FridgeView } from "@/components/fridge/FridgeView";
import { getFridge, getStock, nearestFridges } from "@/lib/api";
import { FRIDGES } from "@/lib/data/fridges";

// Static export (GitHub Pages): pre-render the 25 real fridges.
export function generateStaticParams() {
  return FRIDGES.map((f) => ({ id: f.id }));
}

export default async function FridgePage({ params }: PageProps<"/[locale]/refrigerator/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const fridge = await getFridge(decodeURIComponent(id));
  if (!fridge) notFound();
  const [stock, nearest] = await Promise.all([getStock(fridge), nearestFridges(fridge)]);
  return <FridgeView fridge={fridge} stock={stock} nearest={nearest} />;
}
