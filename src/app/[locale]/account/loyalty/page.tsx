import { setRequestLocale } from "next-intl/server";
import { LoyaltyView } from "@/components/account/LoyaltyView";

export default async function Page({ params }: PageProps<"/[locale]/account/loyalty">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoyaltyView />;
}
