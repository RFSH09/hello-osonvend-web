import { setRequestLocale } from "next-intl/server";
import { ProfileView } from "@/components/account/ProfileView";

export default async function Page({ params }: PageProps<"/[locale]/account/profile">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileView />;
}
