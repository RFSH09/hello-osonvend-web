"use client";

import { Check, ChevronDown, CreditCard, Globe, LifeBuoy, LogOut, Menu, Receipt, Settings, User, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useProfileName } from "@/components/account/hooks";
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

function useDropdown() {
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
  return { open, setOpen, ref };
}

export function LangDropdown({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const { open, setOpen, ref } = useDropdown();

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

const ACCOUNT_LINKS = [
  ["profile", "/account/profile", User],
  ["purchases", "/account/purchases", Receipt],
  ["cards", "/account/cards", CreditCard],
  ["tickets", "/account/support", LifeBuoy],
  ["settings", "/account/settings", Settings],
] as const;

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "H";
}

function AvatarMenu({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("account");
  const name = useProfileName();
  const { logout } = useAuth();
  const { open, setOpen, ref } = useDropdown();
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("menu.account")}
        className="flex size-11 items-center justify-center rounded-full bg-navy font-display text-sm font-extrabold text-white ring-2 ring-transparent hover:ring-accent"
      >
        {initials(name)}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-xl">
          {name && <div className="px-3 py-2 text-sm font-bold text-muted">{name}</div>}
          {ACCOUNT_LINKS.map(([key, href, Icon]) => (
            <Link key={key} role="menuitem" href={href} onClick={() => { setOpen(false); onNavigate?.(); }} className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium hover:bg-background">
              <Icon size={18} aria-hidden />{t(`menu.${key}`)}
            </Link>
          ))}
          <button role="menuitem" onClick={() => { setOpen(false); logout(); }} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 font-medium text-brand-red hover:bg-background">
            <LogOut size={18} aria-hidden />{t("menu.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

export function Header(): ReactNode {
  const t = useTranslations("nav");
  const ta = useTranslations("account");
  const pathname = usePathname();
  const { user, logout, openLogin } = useAuth();
  // the mobile menu is open only for the page it was opened on, so navigating closes it
  const [menuAt, setMenuAt] = useState<string | null>(null);
  const menu = menuAt === pathname;
  const setMenu = (open: boolean | ((o: boolean) => boolean)) =>
    setMenuAt((cur) => ((typeof open === "function" ? open(cur === pathname) : open) ? pathname : null));

  if (pathname.startsWith("/provider-test")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
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
          {user ? (
            <AvatarMenu />
          ) : (
            <Button variant="primary" className="hidden sm:inline-flex" onClick={() => openLogin()}>
              {t("login")}
            </Button>
          )}
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
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {[["home", "/"], ...NAV, ["about", "/about"]].map(([key, href]) => (
              <Link key={key} href={href} className="flex min-h-12 items-center rounded-xl px-3 text-lg font-semibold hover:bg-background">
                {t(key as never)}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-2">
              {user ? (
                <>
                  {ACCOUNT_LINKS.map(([key, href, Icon]) => (
                    <Link key={key} href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-semibold hover:bg-background">
                      <Icon size={20} aria-hidden />{ta(`menu.${key}`)}
                    </Link>
                  ))}
                  <button onClick={logout} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 font-semibold text-brand-red hover:bg-background">
                    <LogOut size={20} aria-hidden />{ta("menu.logout")}
                  </button>
                </>
              ) : (
                <Button variant="primary" className="w-full" onClick={() => { setMenu(false); openLogin(); }}>
                  {t("login")}
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
