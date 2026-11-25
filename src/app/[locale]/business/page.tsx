import { Building2, Clock, Hospital, GraduationCap, Factory, Briefcase, Ruler, Wrench, Wifi, Weight, Coins } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, Section, SectionHeading } from "@/components/site/bits";
import { LeadForm } from "@/components/site/LeadForm";
import { Card } from "@/components/ui/primitives";
import { config } from "@/config";

const BENEFITS = [
  [Ruler, "b1"], [Weight, "b2"], [Wrench, "b3"], [Wifi, "b4"], [Clock, "b5"],
] as const;
const IDEAL = [
  [Briefcase, "i1"], [GraduationCap, "i2"], [Hospital, "i3"], [Building2, "i4"], [Factory, "i5"],
] as const;

export default async function BusinessPage({ params }: PageProps<"/[locale]/business">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("biz");

  return (
    <main>
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight sm:text-6xl">{t("title")}</h1>
          <p className="mt-5 max-w-2xl text-xl text-white/75">{t("subtitle")}</p>
          {config.freeForLocation && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-bold text-navy"><Coins size={18} aria-hidden />{t("free")}</p>
          )}
        </div>
      </section>

      <Section tone="white">
        <SectionHeading title={t("benefitsTitle")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(([Icon, k], i) => (
            <li key={k}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent-strong"><Icon size={24} aria-hidden /></span>
                  <h3 className="font-display text-xl font-bold">{t(`benefits.${k}.t`)}</h3>
                  <p className="text-muted">{t(`benefits.${k}.d`)}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <SectionHeading title={t("idealTitle")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {IDEAL.map(([Icon, k]) => (
            <li key={k} className="flex flex-col items-center gap-3 rounded-card bg-surface p-6 text-center font-semibold">
              <Icon size={32} className="text-accent-strong" aria-hidden />
              {t(`ideal.${k}`)}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="white" id="lead">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={t("formTitle")} subtitle={t("formText")} center />
          <LeadForm />
        </div>
      </Section>
    </main>
  );
}
