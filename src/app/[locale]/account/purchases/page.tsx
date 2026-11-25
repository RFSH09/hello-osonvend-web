import { setRequestLocale } from "next-intl/server";
import { PurchasesView } from "@/components/account/PurchasesView";

export default async function Page({ params }: PageProps<"/[locale]/account/purchases">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PurchasesView />;
}
