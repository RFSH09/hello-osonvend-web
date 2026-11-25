import { ChevronDown, CreditCard, DoorOpen, ScanLine, Smartphone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoVideo } from "@/components/media/DemoVideo";
import { Section, SectionHeading } from "@/components/site/bits";
import { ButtonLink } from "@/components/ui/ButtonLink";

const STEPS = [
  ["s1", ScanLine],
  ["s2", Smartphone],
  ["s3", DoorOpen],
  ["s4", CreditCard],
] as const;

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
        <ol className="flex flex-col gap-14">
          {STEPS.map(([id, Icon], i) => (
            <li key={id} className={`grid items-center gap-6 md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="relative mx-auto flex aspect-[4/3] w-full max-w-[420px] items-center justify-center overflow-hidden rounded-[28px] bg-panel">
                <div aria-hidden className="absolute -right-10 -top-10 size-48 rounded-full bg-accent/25 blur-3xl" />
                <span className="absolute left-6 top-5 font-display text-6xl font-extrabold text-white/10">0{i + 1}</span>
                <span className="relative flex size-28 items-center justify-center rounded-[28px] bg-white/10 text-accent ring-1 ring-white/15">
                  <Icon size={56} strokeWidth={1.75} aria-hidden />
                </span>
              </div>
              <div>
                <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-accent font-display text-xl font-extrabold text-navy">{i + 1}</span>
                <h2 className="font-display text-2xl font-bold">{t(`steps.items.${id}.t`)}</h2>
                <p className="mt-2 text-lg text-muted">{t(`howPage.detail.${id}`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <SectionHeading title={t("media.video.title")} subtitle={t("media.video.text")} />
          </div>
          <div className="mx-auto w-full max-w-[250px] lg:mx-0">
            <DemoVideo label={t("media.alt.demoVideo")} playLabel={t("media.video.play")} />
          </div>
        </div>
      </Section>

      <Section tone="white">
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
