import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "uz-Cyrl", "ru", "en"],
  defaultLocale: "uz",
});

export type Locale = (typeof routing.locales)[number];
