import { ChevronDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { StepArt, type StepKind } from "@/components/art/StepArt";
import { Section, SectionHeading } from "@/components/site/bits";
import { ButtonLink } from "@/components/ui/ButtonLink";

const STEPS: [string, StepKind][] = [["s1", "scan"], ["s2", "login"], ["s3", "take"], ["s4", "pay"]];

export default async function HowPage({ params }: PageProps<"/[locale]/how-it-works">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <main>
      <section className="bg-background">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t("howPage.title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{t("howPage.subtitle")}</p>
        </div>
      </section>

      <Section tone="white">
        <ol className="flex flex-col gap-12">
          {STEPS.map(([k, kind], i) => (
            <li key={k} className={`grid items-center gap-6 md:grid-cols-2 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <StepArt kind={kind} className="mx-auto w-full max-w-sm" />
              <div>
                <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-navy font-display text-lg font-extrabold text-white">{i + 1}</span>
                <h2 className="font-display text-2xl font-bold">{t(`steps.items.${k}.t`)}</h2>
                <p className="mt-2 text-lg text-muted">{t(`howPage.detail.${k}`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="light">
        <SectionHeading title={t("howPage.whatIfTitle")} center />
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {(["q1", "q2", "q3"] as const).map((k) => (
            <details key={k} className="group rounded-card border border-border bg-surface px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {t(`howPage.whatIf.${k}.q`)}
                <ChevronDown className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 text-muted">{t(`howPage.whatIf.${k}.a`)}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink href="/locations" variant="accent" size="lg">{t("hero.ctaFind")}</ButtonLink>
        </div>
      </Section>
    </main>
  );
}
