import { Briefcase, Building2, Clock, Coins, Factory, GraduationCap, Hospital, Ruler, Weight, Wifi, Wrench } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal, Section, SectionHeading } from "@/components/site/bits";
import { LeadForm } from "@/components/site/LeadForm";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { Card } from "@/components/ui/primitives";
import Image from "next/image";
import { PHOTOS } from "@/lib/media";
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
      <section className="relative overflow-hidden bg-panel text-white" id="lead">
        {/* background: client photo only with permission (config.showClientPhotos), else the hallway photo */}
        <Image
          src={config.showClientPhotos ? PHOTOS.lobby : PHOTOS.hallway}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-panel/70" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-[1200px] items-start gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_520px] lg:gap-12 lg:py-20">
          <div className="flex flex-col gap-5 lg:pt-6">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{t("title")}</h1>
            <p className="max-w-xl text-lg text-white/75 sm:text-xl">{t("subtitle")}</p>
            {config.freeForLocation && (
              <p className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-5 py-2 font-bold text-navy"><Coins size={18} aria-hidden />{t("free")}</p>
            )}
            <ul className="hidden gap-3 text-white/85 lg:grid">
              {(["b1", "b3", "b4"] as const).map((k) => (
                <li key={k} className="flex items-center gap-3"><span className="size-2 rounded-full bg-accent" aria-hidden />{t(`benefits.${k}.t`)}</li>
              ))}
            </ul>
          </div>
          <div className="text-foreground">
            <LeadForm compact />
          </div>
        </div>
      </section>

      <Section tone="white">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <PhotoSlot src={PHOTOS.hallway} alt={t("photoAlt")} className="mx-auto aspect-[3/4] w-full max-w-[420px] lg:max-w-none lg:aspect-[4/5]" />
          <div>
            <SectionHeading title={t("benefitsTitle")} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {BENEFITS.map(([Icon, k], i) => (
                <li key={k} className={i === 4 ? "sm:col-span-2" : ""}>
                  <Reveal delay={(i % 2) * 0.05} className="h-full">
                    <Card className="flex h-full gap-3 p-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-strong"><Icon size={22} aria-hidden /></span>
                      <div>
                        <h3 className="font-display font-bold">{t(`benefits.${k}.t`)}</h3>
                        <p className="text-sm text-muted">{t(`benefits.${k}.d`)}</p>
                      </div>
                    </Card>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading title={t("idealTitle")} />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {IDEAL.map(([Icon, k]) => (
            <li key={k} className="flex flex-col items-center gap-3 rounded-card bg-surface p-5 text-center font-semibold">
              <Icon size={32} className="text-accent-strong" aria-hidden />
              {t(`ideal.${k}`)}
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
