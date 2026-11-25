import {
  ArrowRight, Check, ChevronDown, Clock, CreditCard, DoorOpen, Receipt, Ruler, ScanLine,
  ShieldCheck, Smartphone, Tag, Users, UserX, Video, Wifi, Wrench,
} from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductVisual } from "@/components/art/ProductVisual";
import { DemoVideo } from "@/components/media/DemoVideo";
import { CountUp, Reveal } from "@/components/site/bits";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ProductCard } from "@/components/ui/primitives";
import { Link } from "@/i18n/navigation";
import { config } from "@/config";
import { formatPrice } from "@/lib/format";
import { PRODUCT_BY_ID, POPULAR_IDS } from "@/lib/data/products";
import { PHOTOS } from "@/lib/media";

const STEPS = [
  ["s1", ScanLine],
  ["s2", Smartphone],
  ["s3", DoorOpen],
  ["s4", CreditCard],
] as const;
const WHY = [
  ["w1", Clock], ["w2", Users], ["w3", UserX], ["w4", Tag], ["w5", Video], ["w6", Receipt],
] as const;
const FAQ = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

/** Section wrapper: tighter on phones, roomy on desktop. */
function Band({ tone, id, children }: { tone: "white" | "light" | "dark"; id?: string; children: React.ReactNode }) {
  const bg = tone === "white" ? "bg-surface" : tone === "light" ? "bg-background" : "bg-panel text-white";
  return (
    <section id={id} className={`${bg} py-14 sm:py-20 lg:py-24`}>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-6">{children}</div>
    </section>
  );
}

function Heading({ kicker, title, subtitle, light }: { kicker?: string; title: string; subtitle?: string; light?: boolean }) {
  return (
    <div className="mb-8 max-w-2xl sm:mb-12">
      {kicker && (
        <p className={`mb-3 text-sm font-bold uppercase tracking-[0.14em] ${light ? "text-accent" : "text-accent-strong"}`}>{kicker}</p>
      )}
      <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h2>
      {subtitle && <p className={`mt-3 text-base sm:text-lg ${light ? "text-white/70" : "text-muted"}`}>{subtitle}</p>}
    </div>
  );
}

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  // "Skanerlang. Oling. Keting." → last sentence in green
  const parts = t("hero.title").split(/(?<=\.)\s+/);
  const last = parts.pop();
  const cola = PRODUCT_BY_ID.get("coca-cola")!;
  const snickers = PRODUCT_BY_ID.get("snickers")!;

  return (
    <main>
      {/* ───────── 1. HERO (dark, brand colours) ───────── */}
      <section className="relative overflow-hidden bg-panel text-white">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-1/3 size-[420px] rounded-full bg-accent/20 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-[380px] rounded-full bg-accent/10 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-[1200px] items-center gap-10 px-5 pb-14 pt-8 sm:px-6 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-accent ring-1 ring-white/10">
              <ScanLine size={16} aria-hidden /> {t("hero.badge")}
            </span>
            <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              {parts.join(" ")} <span className="text-accent">{last}</span>
            </h1>
            <p className="max-w-xl text-base text-white/75 sm:text-xl">{t("hero.subtitle")}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/locations" variant="accent" size="lg" className="w-full sm:w-auto">
                {t("hero.ctaFind")} <ArrowRight size={20} aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/business"
                variant="ghost"
                size="lg"
                className="w-full border border-white/20 text-white hover:bg-white/10 sm:w-auto"
              >
                {t("hero.ctaBusiness")}
              </ButtonLink>
            </div>

            {/* Numbers live inside the hero (no separate band on phones) */}
            <dl className="mt-2 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-4 ring-1 ring-white/10">
              <div className="px-3 text-center">
                <dt className="sr-only">{t("stats.fridges")}</dt>
                <dd className="font-display text-2xl font-extrabold text-accent sm:text-3xl"><CountUp to={config.stats.fridges} suffix="+" /></dd>
                <dd className="text-xs text-white/65 sm:text-sm">{t("stats.fridges")}</dd>
              </div>
              <div className="px-3 text-center">
                <dt className="sr-only">{t("stats.orders")}</dt>
                <dd className="font-display text-2xl font-extrabold text-accent sm:text-3xl"><CountUp to={config.stats.orders} suffix="+" /></dd>
                <dd className="text-xs text-white/65 sm:text-sm">{t("stats.orders")}</dd>
              </div>
              <div className="px-3 text-center">
                <dt className="sr-only">24/7</dt>
                <dd className="font-display text-2xl font-extrabold text-accent sm:text-3xl">24/7</dd>
                <dd className="text-xs text-white/65 sm:text-sm">{t("hero.noCashier")}</dd>
              </div>
            </dl>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>{t("hero.payVia")}</span>
              <BrandLogo brand="payme" onDark />
              <BrandLogo brand="click" onDark />
            </div>
          </div>

          {/* Visual: real fridge photo (shown at ≤ its native size) + crisp product chips */}
          <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <Image
                src={PHOTOS.hallway}
                alt={t("media.alt.hallway")}
                fill
                priority
                quality={90}
                sizes="(max-width: 640px) 340px, 400px"
                placeholder="blur"
                className="object-cover object-[50%_35%]"
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-navy shadow-lg">
                <span className="flex size-5 items-center justify-center rounded-full bg-accent"><Check size={14} strokeWidth={3} aria-hidden /></span>
                {t("hero.noCashier")} · 24/7
              </span>
            </div>

            {[
              { p: cola, pos: "-left-4 top-8 sm:-left-12" },
              { p: snickers, pos: "-right-3 top-1/2 sm:-right-10" },
            ].map(({ p, pos }) => (
              <div
                key={p.id}
                className={`absolute ${pos} flex items-center gap-2 rounded-2xl bg-white p-2 pr-3 text-navy shadow-xl ring-1 ring-black/5`}
              >
                <span className="relative block size-12 overflow-hidden rounded-xl bg-white">
                  <ProductVisual product={p} className="size-full" sizes="48px" />
                </span>
                <span className="leading-tight">
                  <span className="block text-xs font-semibold text-muted">{p.name}</span>
                  <span className="block font-display text-sm font-extrabold">{formatPrice(p.price, t("common.unit"))}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 2. HOW IT WORKS (swipe on phones) ───────── */}
      <Band tone="white" id="how">
        <Heading kicker="Scan · Take · Go" title={t("steps.title")} subtitle={t("steps.subtitle")} />
        <ol className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {STEPS.map(([id, Icon], i) => (
            <li key={id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Reveal delay={i * 0.05} className="h-full">
                <div className="flex h-full flex-col gap-4 rounded-3xl bg-background p-6 ring-1 ring-border">
                  <div className="flex items-center justify-between">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-panel text-accent">
                      <Icon size={28} aria-hidden />
                    </span>
                    <span className="font-display text-5xl font-extrabold text-border">0{i + 1}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{t(`steps.items.${id}.t`)}</h3>
                  <p className="text-muted">{t(`steps.items.${id}.d`)}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Band>

      {/* ───────── 3. POPULAR PRODUCTS ───────── */}
      <Band tone="light">
        <div className="flex items-end justify-between gap-4">
          <Heading title={t("popular.title")} subtitle={t("popular.subtitle")} />
          <Link href="/products" className="mb-8 hidden shrink-0 items-center gap-1 font-semibold text-accent-strong hover:underline sm:mb-12 sm:inline-flex">
            {t("popular.all")} <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
        <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:gap-4 sm:px-6">
          {POPULAR_IDS.map((id) => (
            <li key={id} className="w-[44%] shrink-0 snap-start sm:w-52">
              <ProductCard product={PRODUCT_BY_ID.get(id)!} soldOutLabel={t("stock.soldOut")} lowLabel={t("stock.low")} unit={t("common.unit")} />
            </li>
          ))}
        </ul>
        <ButtonLink href="/products" variant="outline" className="mt-6 w-full sm:hidden">
          {t("popular.all")} <ArrowRight size={18} aria-hidden />
        </ButtonLink>
      </Band>

      {/* ───────── 4. WHY HELLO + VIDEO ───────── */}
      <Band tone="white">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Heading title={t("why.title")} subtitle={t("why.subtitle")} />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-8">
              {WHY.map(([k, Icon]) => (
                <li key={k} className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent-strong">
                    <Icon size={22} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold sm:text-lg">{t(`why.items.${k}.t`)}</h3>
                    <p className="mt-1 text-sm text-muted sm:text-base">{t(`why.items.${k}.d`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Video is 464×848 — keep it small so it stays sharp */}
          <div className="mx-auto w-full max-w-[250px] lg:mx-0">
            <DemoVideo label={t("media.alt.demoVideo")} playLabel={t("media.video.play")} />
            <p className="mt-3 text-center text-sm text-muted">{t("media.video.text")}</p>
          </div>
        </div>
      </Band>

      {/* ───────── 5. FOR BUSINESS ───────── */}
      <Band tone="dark">
        <div className="relative overflow-hidden rounded-[28px] bg-white/5 p-6 ring-1 ring-white/10 sm:p-10 lg:p-14">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-accent/20 blur-[90px]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <Heading kicker={t("nav.business")} title={t("bizHome.title")} subtitle={t("bizHome.text")} light />
              <ButtonLink href="/business" variant="accent" size="lg" className="w-full sm:w-auto">
                {t("bizHome.cta")} <ArrowRight size={20} aria-hidden />
              </ButtonLink>
            </div>
            <ul className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {[[Ruler, "m1"], [Wrench, "m2"], [Wifi, "m3"]].map(([I, k]) => {
                const Icon = I as typeof Ruler;
                return (
                  <li key={k as string} className="flex flex-col items-start gap-2 rounded-2xl bg-white/5 p-3 ring-1 sm:p-4 ring-white/10 lg:flex-row lg:items-center lg:gap-4 lg:p-5">
                    <Icon size={24} className="shrink-0 text-accent" aria-hidden />
                    <div>
                      <div className="whitespace-nowrap font-display text-base font-extrabold sm:text-2xl">{t(`bizHome.${k}v`)}</div>
                      <div className="text-xs text-white/65 sm:text-sm">{t(`bizHome.${k}l`)}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Band>

      {/* ───────── 6. FAQ ───────── */}
      <Band tone="light">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Heading title={t("faq.title")} />
          <div className="flex flex-col gap-3">
            {FAQ.map((k) => (
              <details key={k} className="group rounded-2xl bg-surface px-5 ring-1 ring-border">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display font-bold sm:text-lg [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.${k}.q`)}
                  <ChevronDown className="shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden />
                </summary>
                <p className="pb-5 text-muted">{t(`faq.items.${k}.a`)}</p>
              </details>
            ))}
            <p className="mt-4 flex items-center gap-2 text-sm text-muted"><ShieldCheck size={16} aria-hidden />{t("fridge.secure")}</p>
          </div>
        </div>
      </Band>
    </main>
  );
}
