import { ChevronDown, Clock, Receipt, ScanLine, ShieldCheck, Tag, Users, UserX, Video, Wifi, Ruler, Wrench } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DemoVideo } from "@/components/media/DemoVideo";
import { Gallery } from "@/components/media/Gallery";
import { HeroVideo } from "@/components/media/HeroVideo";
import { StepVisual, type StepId } from "@/components/media/StepVisual";
import { CountUp, Reveal, Section, SectionHeading } from "@/components/site/bits";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Badge, Card, ProductCard } from "@/components/ui/primitives";
import { config } from "@/config";
import { PRODUCT_BY_ID, POPULAR_IDS } from "@/lib/data/products";
import { PHOTOS } from "@/lib/media";

const STEPS: StepId[] = ["s1", "s2", "s3", "s4"];
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
      {/* 1. Hero: real photo + phone clip */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-background">
        <div className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-accent/15 blur-3xl" />
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
              <li><BrandLogo brand="payme" className="h-9" /></li>
              <li><BrandLogo brand="click" className="h-9" /></li>
              {["24/7", t("hero.noCashier")].map((x) => (
                <li key={x} className="rounded-full border border-border bg-surface px-4 py-2">{x}</li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[440px] pb-10 pr-6 sm:pr-0">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] shadow-2xl">
              <Image
                src={PHOTOS.hallway}
                alt={t("media.alt.hallway")}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 440px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-1 w-[42%] min-w-[130px] sm:-right-8">
              <HeroVideo label={t("media.alt.heroVideo")} className="rotate-3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats (numbers from config; final value rendered on the server) */}
      <section className="bg-panel text-white">
        <ul className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-8 px-4 py-12 text-center sm:grid-cols-3 sm:px-6">
          <li><div className="font-display text-5xl font-extrabold text-accent"><CountUp to={config.stats.fridges} suffix="+" /></div><div className="mt-1 text-white/75">{t("stats.fridges")}</div></li>
          <li><div className="font-display text-5xl font-extrabold text-accent"><CountUp to={config.stats.orders} suffix="+" /></div><div className="mt-1 text-white/75">{t("stats.orders")}</div></li>
          <li><div className="whitespace-nowrap font-display text-3xl font-extrabold text-accent sm:text-4xl lg:text-5xl">{t("stats.since", { year: config.stats.since })}</div><div className="mt-1 text-white/75">{t("stats.sinceLabel")}</div></li>
        </ul>
      </section>

      {/* 3. How it works: real stills */}
      <Section tone="white">
        <SectionHeading title={t("steps.title")} subtitle={t("steps.subtitle")} center />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((id, i) => (
            <li key={id}>
              <Reveal delay={i * 0.06} className="flex flex-col gap-4">
                <div className="relative">
                  <StepVisual id={id} />
                  <span className="absolute -left-2 -top-2 flex size-12 items-center justify-center rounded-full bg-accent font-display text-xl font-extrabold text-navy shadow-lg ring-4 ring-surface">{i + 1}</span>
                </div>
                <h3 className="font-display text-xl font-bold">{t(`steps.items.${id}.t`)}</h3>
                <p className="text-muted">{t(`steps.items.${id}.d`)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* 4. Video */}
      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <SectionHeading title={t("media.video.title")} subtitle={t("media.video.text")} />
            <ul className="flex flex-col gap-2 text-lg font-medium">
              {(["b1", "b2", "b3"] as const).map((k) => (
                <li key={k} className="flex items-center gap-3"><span className="size-2.5 rounded-full bg-accent" aria-hidden />{t(`media.video.${k}`)}</li>
              ))}
            </ul>
          </div>
          <div className="mx-auto lg:mx-0">
            <DemoVideo label={t("media.alt.demoVideo")} playLabel={t("media.video.play")} />
          </div>
        </div>
      </Section>

      {/* 5. Why Hello */}
      <Section tone="white">
        <SectionHeading title={t("why.title")} subtitle={t("why.subtitle")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map(([k, Icon], i) => (
            <li key={k}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <Card className="flex h-full flex-col gap-3 bg-background p-6 shadow-none">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-strong"><Icon size={24} aria-hidden /></span>
                  <h3 className="font-display text-xl font-bold">{t(`why.items.${k}.t`)}</h3>
                  <p className="text-muted">{t(`why.items.${k}.d`)}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 6. Gallery */}
      <Section tone="light">
        <SectionHeading title={t("media.gallery.title")} subtitle={t("media.gallery.subtitle")} center />
        <Gallery />
      </Section>

      {/* 7. Popular */}
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

      {/* 8. For business */}
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

      {/* 9. FAQ */}
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
