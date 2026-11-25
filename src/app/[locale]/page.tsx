import { Clock, Receipt, ScanLine, ShieldCheck, Tag, Users, Video, Wifi, Ruler, Wrench, ChevronDown, UserX } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FridgeIllustration } from "@/components/art/FridgeIllustration";
import { StepArt, type StepKind } from "@/components/art/StepArt";
import { CountUp, Reveal, Section, SectionHeading } from "@/components/site/bits";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge, Card, ProductCard } from "@/components/ui/primitives";
import { PRODUCT_BY_ID, POPULAR_IDS } from "@/lib/data/products";

const STEP_KEYS: [string, StepKind][] = [["s1", "scan"], ["s2", "login"], ["s3", "take"], ["s4", "pay"]];
const WHY = [
  ["w1", Clock], ["w2", Users], ["w3", UserX], ["w4", Tag], ["w5", Video], ["w6", Receipt],
] as const;
const FAQ = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main>
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-background">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div className="flex flex-col gap-6">
            <Badge tone="success" className="self-start"><ScanLine size={16} aria-hidden />{t("hero.badge")}</Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">{t("hero.title")}</h1>
            <p className="max-w-lg text-lg text-muted sm:text-xl">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/locations" variant="accent" size="lg">{t("hero.ctaFind")}</ButtonLink>
              <ButtonLink href="/business" variant="outline" size="lg">{t("hero.ctaBusiness")}</ButtonLink>
            </div>
            <ul className="flex flex-wrap items-center gap-2 pt-2 text-sm font-semibold">
              <li className="text-muted">{t("hero.payVia")}</li>
              {["Payme", "Click", "24/7", t("hero.noCashier")].map((x) => (
                <li key={x} className="rounded-full border border-border bg-surface px-4 py-2">{x}</li>
              ))}
            </ul>
          </div>
          <FridgeIllustration />
        </div>
      </section>

      {/* 2. Stats */}
      <section className="bg-navy text-white">
        <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
          <li><div className="font-display text-5xl font-extrabold text-accent"><CountUp to={25} suffix="+" /></div><div className="mt-1 text-white/75">{t("stats.fridges")}</div></li>
          <li><div className="font-display text-5xl font-extrabold text-accent"><CountUp to={166000} suffix="+" /></div><div className="mt-1 text-white/75">{t("stats.orders")}</div></li>
          <li><div className="font-display text-5xl font-extrabold text-accent"><CountUp to={2024} group={false} /></div><div className="mt-1 text-white/75">{t("stats.sinceLabel")}</div></li>
        </ul>
      </section>

      {/* 3. How it works */}
      <Section tone="white">
        <SectionHeading title={t("steps.title")} subtitle={t("steps.subtitle")} center />
        <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-[12%] right-[12%] top-[100px] hidden border-t-2 border-dashed border-accent/60 lg:block" aria-hidden />
          {STEP_KEYS.map(([k, kind], i) => (
            <li key={k}>
              <Reveal delay={i * 0.08} className="relative flex flex-col items-center gap-4 text-center">
                <StepArt kind={kind} className="w-full max-w-[220px]" />
                <span className="-mt-2 flex size-12 items-center justify-center rounded-full bg-navy font-display text-xl font-extrabold text-white ring-4 ring-surface">{i + 1}</span>
                <h3 className="font-display text-xl font-bold">{t(`steps.items.${k}.t`)}</h3>
                <p className="text-muted">{t(`steps.items.${k}.d`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Why Hello */}
      <Section tone="light">
        <SectionHeading title={t("why.title")} subtitle={t("why.subtitle")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(([k, Icon], i) => (
            <li key={k}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent-strong"><Icon size={24} aria-hidden /></span>
                  <h3 className="font-display text-xl font-bold">{t(`why.items.${k}.t`)}</h3>
                  <p className="text-muted">{t(`why.items.${k}.d`)}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 5. Popular */}
      <Section tone="white">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading title={t("popular.title")} subtitle={t("popular.subtitle")} />
          <ButtonLink href="/products" variant="outline" className="mb-10">{t("popular.all")}</ButtonLink>
        </div>
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
          {POPULAR_IDS.map((id) => (
            <li key={id} className="w-44 shrink-0 snap-start sm:w-52">
              <ProductCard product={PRODUCT_BY_ID.get(id)!} soldOutLabel={t("stock.soldOut")} lowLabel={t("stock.low")} unit={t("common.unit")} />
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. For business */}
      <Section tone="navy">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading title={t("bizHome.title")} subtitle={t("bizHome.text")} light />
            <ButtonLink href="/business" variant="accent" size="lg">{t("bizHome.cta")}</ButtonLink>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[[Ruler, "m1"], [Wrench, "m2"], [Wifi, "m3"]].map(([I, k]) => {
              const Icon = I as typeof Ruler;
              return (
                <li key={k as string} className="flex items-center gap-4 rounded-card bg-white/10 p-5">
                  <Icon size={28} className="shrink-0 text-accent" aria-hidden />
                  <div>
                    <div className="font-display text-2xl font-extrabold">{t(`bizHome.${k}v`)}</div>
                    <div className="text-white/70">{t(`bizHome.${k}l`)}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* 7. FAQ */}
      <Section tone="light">
        <SectionHeading title={t("faq.title")} center />
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {FAQ.map((k) => (
            <details key={k} className="group rounded-card border border-border bg-surface px-5">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {t(`faq.items.${k}.q`)}
                <ChevronDown className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
              </summary>
              <p className="pb-5 text-muted">{t(`faq.items.${k}.a`)}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted"><ShieldCheck size={16} aria-hidden />{t("fridge.secure")}</p>
      </Section>
    </main>
  );
}
