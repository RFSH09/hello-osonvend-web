import { setRequestLocale } from "next-intl/server";
import { Showcase } from "./showcase";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Showcase />;
}
