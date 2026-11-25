import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/primitives";

export default async function Page({ params }: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const k = "privacy";
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Badge tone="warning" className="mb-4">{t("draft")}</Badge>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{t(`${k}.title`)}</h1>
        <p className="mt-3 text-muted">{t("updated")}</p>
        <div className="mt-8 flex flex-col gap-6">
          {(["s1", "s2", "s3", "s4"] as const).map((s) => (
            <section key={s}>
              <h2 className="font-display text-xl font-bold">{t(`${k}.${s}.t`)}</h2>
              <p className="mt-2 text-muted">{t(`${k}.${s}.d`)}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
