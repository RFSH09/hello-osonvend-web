"use client";

import { Check, ChevronDown, Globe, LogOut, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/primitives";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Logo } from "./bits";

export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  uz: { short: "UZ", full: "O'zbek" },
  "uz-Cyrl": { short: "ЎЗ", full: "Ўзбек" },
  ru: { short: "RU", full: "Русский" },
  en: { short: "EN", full: "English" },
};

export function LangDropdown({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language")}
        className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold hover:bg-border/50"
      >
        <Globe size={18} aria-hidden />
        {LOCALE_LABELS[locale].short}
        <ChevronDown size={14} aria-hidden className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <ul role="listbox" className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-xl">
          {routing.locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                lang={l}
                onClick={() => {
                  setOpen(false);
                  router.replace(pathname, { locale: l });
                }}
                className="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-medium hover:bg-background"
              >
                {LOCALE_LABELS[l].full}
                {l === locale && <Check size={16} className="text-accent-strong" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const NAV = [
  ["how", "/how-it-works"],
  ["products", "/products"],
  ["locations", "/locations"],
  ["business", "/business"],
] as const;

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { user, logout, openLogin } = useAuth();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);

  const authBtn = user ? (
    <Button variant="outline" onClick={logout} className="min-h-11">
      <LogOut size={16} aria-hidden /> {t("logout")}
    </Button>
  ) : (
    <Button variant="primary" onClick={() => openLogin()}>
      {t("login")}
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Hello"><Logo /></Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map(([key, href]) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex min-h-11 items-center rounded-full px-4 font-medium transition-colors duration-200 hover:bg-border/50",
                pathname.startsWith(href) && "text-accent-strong",
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LangDropdown />
          <div className="hidden sm:block">{authBtn}</div>
          <button
            className="flex size-11 items-center justify-center rounded-full hover:bg-border/50 lg:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-label={t("menu")}
          >
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {[["home", "/"], ...NAV, ["about", "/about"]].map(([key, href]) => (
              <Link key={key} href={href as never} className="flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold hover:bg-background">
                {t(key as never)}
              </Link>
            ))}
            <div className="mt-2 sm:hidden">{authBtn}</div>
          </nav>
        </div>
      )}
    </header>
  );
}
