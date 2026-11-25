import { getTranslations, setRequestLocale } from "next-intl/server";
import { LocationsView } from "@/components/site/LocationsView";
import { listPublicFridges } from "@/lib/api";

export default async function LocationsPage({ params }: PageProps<"/[locale]/locations">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("locationsPage");
  const fridges = await listPublicFridges();
  return (
    <main>
      <section className="bg-background">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t("title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{t("subtitle")}</p>
        </div>
      </section>
      <div className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <LocationsView fridges={fridges} />
        </div>
      </div>
    </main>
  );
}
