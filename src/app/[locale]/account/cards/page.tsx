import { setRequestLocale } from "next-intl/server";
import { CardsView } from "@/components/account/CardsView";

export default async function Page({ params }: PageProps<"/[locale]/account/cards">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CardsView />;
}
