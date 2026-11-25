import { setRequestLocale } from "next-intl/server";
import { NewTicketView } from "@/components/account/NewTicketView";

export default async function Page({ params, searchParams }: PageProps<"/[locale]/account/support/new">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sp = await searchParams;
  const purchase = Array.isArray(sp.purchase) ? sp.purchase[0] : sp.purchase;
  return <NewTicketView purchaseId={purchase} />;
}
