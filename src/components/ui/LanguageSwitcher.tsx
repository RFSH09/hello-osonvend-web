"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const LABELS: Record<Locale, string> = {
  uz: "O'zbek",
  "uz-Cyrl": "Ўзбек",
  ru: "Русский",
  en: "English",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div role="group" aria-label={t("language")} className="flex flex-wrap gap-1">
      {routing.locales.map((l) => (
        <button
          key={l}
          lang={l === "uz-Cyrl" ? "uz-Cyrl" : l}
          aria-pressed={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
          className={cn(
            "min-h-11 rounded-full px-4 text-sm font-medium transition-colors duration-200",
            l === locale ? "bg-primary text-on-primary" : "hover:bg-border/50",
          )}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
