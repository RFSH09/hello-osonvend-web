import { useTranslations } from "next-intl";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { PHOTOS } from "@/lib/media";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-[1200px] items-center gap-8 px-6 py-16 md:grid-cols-2">
      <div className="flex flex-col items-start gap-4">
        <span className="font-display text-7xl font-extrabold text-accent">404</span>
        <h1 className="font-display text-4xl font-extrabold">{t("title")}</h1>
        <p className="text-lg text-muted">{t("text")}</p>
        <ButtonLink href="/" variant="accent" size="lg">{t("home")}</ButtonLink>
      </div>
      <PhotoSlot src={PHOTOS.hallway} alt={t("photoAlt")} className="mx-auto aspect-[3/4] w-full max-w-[300px]" sizes="300px" />
    </main>
  );
}
