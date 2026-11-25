import { setRequestLocale } from "next-intl/server";
import { SettingsView } from "@/components/account/SettingsView";

export default async function Page({ params }: PageProps<"/[locale]/account/settings">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SettingsView />;
}
