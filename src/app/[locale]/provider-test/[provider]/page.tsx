import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProviderTest } from "@/components/account/ProviderTest";

export default async function Page({ params }: PageProps<"/[locale]/provider-test/[provider]">) {
  const { locale, provider } = await params;
  setRequestLocale(locale);
  if (provider !== "payme" && provider !== "click") notFound();
  return <ProviderTest provider={provider} />;
}
