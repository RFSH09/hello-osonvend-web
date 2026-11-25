import { setRequestLocale } from "next-intl/server";
import { SupportView } from "@/components/account/SupportView";

export default async function Page({ params }: PageProps<"/[locale]/account/support">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SupportView />;
}
