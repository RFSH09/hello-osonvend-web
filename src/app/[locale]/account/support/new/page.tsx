import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { NewTicketRoute } from "@/components/account/NewTicketRoute";

export default async function Page({ params }: PageProps<"/[locale]/account/support/new">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <NewTicketRoute />
    </Suspense>
  );
}
