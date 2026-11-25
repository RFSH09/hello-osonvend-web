import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Footer } from "@/components/site/Footer";
import { FooterGate } from "@/components/site/FooterGate";
import { Header } from "@/components/site/Header";
import { ThemeInit } from "@/components/site/ThemeInit";
import { ToastProvider } from "@/components/ui/overlays";
import { routing } from "@/i18n/routing";
import { asset } from "@/lib/asset";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  preload: false, // keep the hero image first; fonts swap in right after
});
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  preload: false, // keep the hero image first; fonts swap in right after
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    icons: { icon: [{ url: asset("/brand/app-icon-32.png"), sizes: "32x32", type: "image/png" }, { url: asset("/brand/app-icon-192.png"), sizes: "192x192", type: "image/png" }], apple: asset("/brand/app-icon-192.png") },
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])) },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} data-theme="light" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-dvh">
        <ThemeInit />
        <NextIntlClientProvider>
          <ToastProvider>
            <AuthProvider>
              <Header />
              {children}
              <FooterGate>
                <Footer />
              </FooterGate>
            </AuthProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
