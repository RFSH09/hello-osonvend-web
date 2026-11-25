import { setRequestLocale } from "next-intl/server";
import { OverviewView } from "@/components/account/OverviewView";

export default async function Page({ params }: PageProps<"/[locale]/account">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OverviewView />;
}
