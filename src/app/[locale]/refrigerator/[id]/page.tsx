import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { FridgeView } from "@/components/fridge/FridgeView";
import { getFridge, getStock, nearestFridges } from "@/lib/api";

export default async function FridgePage({ params }: PageProps<"/[locale]/refrigerator/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const fridge = await getFridge(decodeURIComponent(id));
  if (!fridge) notFound();
  const [stock, nearest] = await Promise.all([getStock(fridge), nearestFridges(fridge)]);
  return <FridgeView fridge={fridge} stock={stock} nearest={nearest} />;
}
