import { MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Section, SectionHeading } from "@/components/site/bits";
import { Card } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { config } from "@/config";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { isPhotoVisible, PHOTOS } from "@/lib/media";

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  return (
    <main>
      <section className="bg-background">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{t("aboutPage.title")}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{t("aboutPage.lead")}</p>
        </div>
      </section>

      <Section tone="white">
        <div className={`mb-10 grid gap-4 ${isPhotoVisible("university") ? "sm:grid-cols-2" : "max-w-md"}`}>
          <PhotoSlot src={PHOTOS.hallway} alt={t("media.alt.hallway")} className="aspect-[4/5] w-full" sizes="(max-width: 640px) 100vw, 560px" />
          {isPhotoVisible("university") && (
            <PhotoSlot src={PHOTOS.university} alt={t("media.alt.university")} className="aspect-[4/5] w-full" sizes="(max-width: 640px) 100vw, 560px" />
          )}
        </div>
        <Card className="max-w-3xl bg-background p-6">
          <h2 className="font-display text-xl font-bold">{t("aboutPage.aiTitle")}</h2>
          <p className="mt-2 text-muted">{t("aboutPage.aiText")}</p>
        </Card>
      </Section>

      <Section tone="light">
        <SectionHeading title={t("aboutPage.roadmapTitle")} />
        <ol className="grid gap-4 md:grid-cols-4">
          {(["r1", "r2", "r3", "r4"] as const).map((k, i) => (
            <li key={k} className="relative rounded-card border border-border bg-surface p-5">
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-accent font-display font-extrabold text-navy">{i + 1}</span>
              <h3 className="font-display text-lg font-bold">{t(`aboutPage.roadmap.${k}.t`)}</h3>
              <p className="mt-1 text-muted">{t(`aboutPage.roadmap.${k}.d`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy">
        <SectionHeading title={t("aboutPage.contactTitle")} light />
        <div className="flex flex-col gap-3 text-lg">
          <p className="flex gap-2"><MapPin className="mt-1 shrink-0 text-accent" aria-hidden />{t("footer.address")}</p>
          <a href={config.contact.phoneHref} className="flex min-h-11 items-center gap-2"><Phone className="text-accent" aria-hidden />{config.contact.phone}</a>
          <div className="mt-2 flex flex-wrap gap-3">
            <ButtonLink href={config.contact.telegram} external variant="accent">Telegram</ButtonLink>
            <ButtonLink href={config.contact.whatsapp} external variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">WhatsApp</ButtonLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
