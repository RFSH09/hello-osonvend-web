"use client";

import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function FridgeNotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <SearchX size={64} className="text-muted" aria-hidden />
      <h1 className="font-display text-3xl font-extrabold">{t("fridgeTitle")}</h1>
      <p className="text-lg text-muted">{t("fridgeText")}</p>
      <ButtonLink href="/locations" variant="accent" size="lg">{t("fridgeCta")}</ButtonLink>
    </main>
  );
}
