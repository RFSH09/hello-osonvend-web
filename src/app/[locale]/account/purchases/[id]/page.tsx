import { setRequestLocale } from "next-intl/server";
import { PurchaseDetail } from "@/components/account/PurchaseDetail";

export default async function Page({ params }: PageProps<"/[locale]/account/purchases/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <PurchaseDetail id={decodeURIComponent(id)} />;
}
