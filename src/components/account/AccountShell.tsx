"use client";

import { CreditCard, Gift, Home, LifeBuoy, Receipt, Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, Card, Skeleton } from "@/components/ui/primitives";
import { Link, usePathname } from "@/i18n/navigation";
import { config } from "@/config";
import { cn } from "@/lib/cn";

const SIDE = [
  { key: "overview", href: "/account", Icon: Home },
  { key: "purchases", href: "/account/purchases", Icon: Receipt },
  { key: "cards", href: "/account/cards", Icon: CreditCard },
  { key: "tickets", href: "/account/support", Icon: LifeBuoy },
  { key: "loyalty", href: "/account/loyalty", Icon: Gift },
  { key: "settings", href: "/account/settings", Icon: Settings },
  { key: "profile", href: "/account/profile", Icon: User },
] as const;

const TABS = [
  { key: "overview", href: "/account", Icon: Home },
  { key: "purchases", href: "/account/purchases", Icon: Receipt },
  { key: "cards", href: "/account/cards", Icon: CreditCard },
  { key: "profile", href: "/account/profile", Icon: User },
] as const;

function isActive(path: string, href: string) {
  return href === "/account" ? path === "/account" : path.startsWith(href);
}

/** Protected shell: asks for login if needed (staying on the same URL, so the user returns here). */
export function AccountShell({ children }: { children: ReactNode }) {
  const t = useTranslations("account");
  const { user, ready, openLogin } = useAuth();
  const path = usePathname();

  useEffect(() => {
    if (ready && !user) openLogin();
  }, [ready, user, openLogin]);

  if (!ready)
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6" aria-busy="true">
        <Skeleton className="mb-6 h-10 w-56" />
        <Skeleton className="h-64 w-full rounded-card" />
      </div>
    );

  if (!user)
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 py-16 text-center">
        <User size={56} className="text-muted" aria-hidden />
        <h1 className="font-display text-3xl font-extrabold">{t("needLogin.title")}</h1>
        <p className="text-lg text-muted">{t("needLogin.text")}</p>
        <Button variant="accent" size="lg" onClick={() => openLogin()}>{t("needLogin.button")}</Button>
      </main>
    );

  return (
    <div className="bg-background">
      <div className="mx-auto w-full max-w-[1200px] gap-8 px-4 py-6 pb-28 sm:px-6 md:grid md:grid-cols-[220px_1fr] md:py-10 md:pb-12">
        <aside className="hidden print:hidden md:block">
          <Card className="sticky top-24 p-2">
            <nav aria-label={t("menu.account")} className="flex flex-col gap-1">
              {SIDE.filter((i) => i.key !== "loyalty" || config.loyalty.enabled).map(({ key, href, Icon }) => (
                <Link
                  key={key}
                  href={href}
                  aria-current={isActive(path, href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 font-semibold transition-colors duration-200",
                    isActive(path, href) ? "bg-navy text-white" : "hover:bg-background",
                  )}
                >
                  <Icon size={20} aria-hidden />
                  {t(`menu.${key}`)}
                </Link>
              ))}
            </nav>
          </Card>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>

      <nav
        aria-label={t("menu.account")}
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] print:hidden md:hidden"
      >
        {TABS.map(({ key, href, Icon }) => (
          <Link
            key={key}
            href={href}
            aria-current={isActive(path, href) ? "page" : undefined}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1 text-sm font-semibold",
              isActive(path, href) ? "text-accent-strong" : "text-muted",
            )}
          >
            <Icon size={22} aria-hidden />
            {t(`menu.${key === "overview" ? "home" : key}`)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
