import { setRequestLocale } from "next-intl/server";
import { PurchaseDetail } from "@/components/account/PurchaseDetail";

// Static export: the mock history has P1001..P1025 (see src/lib/account/seed.ts).
export function generateStaticParams() {
  return Array.from({ length: 25 }, (_, i) => ({ id: `P${1001 + i}` }));
}

export default async function Page({ params }: PageProps<"/[locale]/account/purchases/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <PurchaseDetail id={decodeURIComponent(id)} />;
}
