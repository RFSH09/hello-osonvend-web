import { MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link } from "@/i18n/navigation";
import { config } from "@/config";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Logo } from "./bits";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "./icons";

export function Footer() {
  const t = useTranslations();
  const links = [
    ["nav.how", "/how-it-works"],
    ["nav.products", "/products"],
    ["nav.locations", "/locations"],
    ["nav.business", "/business"],
    ["nav.about", "/about"],
  ] as const;
  const socials = [
    { href: config.contact.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: config.contact.telegram, label: "Telegram", Icon: TelegramIcon },
    { href: config.contact.whatsapp, label: "WhatsApp", Icon: WhatsAppIcon },
  ];

  return (
    <footer className="bg-panel text-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1.3fr]">
        <div className="flex flex-col gap-4">
          <Logo light />
          <p className="max-w-xs text-white/70">{t("footer.text")}</p>
          <p className="font-display font-bold text-accent">{t("brand.tagline")}</p>
          <div className="flex items-center gap-2" aria-label={t("hero.payVia")}>
            <BrandLogo brand="payme" onDark />
            <BrandLogo brand="click" onDark />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 gap-y-0 md:flex md:flex-col md:gap-1">
          <h3 className="col-span-2 mb-2 font-display font-bold">{t("footer.pages")}</h3>
          {links.map(([key, href]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center text-white/80 hover:text-white">
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h3 className="mb-1 font-display font-bold">{t("footer.contact")}</h3>
          <p className="flex gap-2 text-white/80"><MapPin size={18} className="mt-0.5 shrink-0" aria-hidden />{t("footer.address")}</p>
          <a href={config.contact.phoneHref} className="flex min-h-11 items-center gap-2 text-white/80 hover:text-white">
            <Phone size={18} aria-hidden />{config.contact.phone}
          </a>
          <div className="flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 hover:bg-accent hover:text-navy">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-sm text-white/60 sm:px-6">
          <div className="flex flex-col gap-1">
            <span>© 2024–2026 OOO &quot;OSONVEND&quot;. {t("footer.rights")}</span>
            <span className="flex flex-wrap gap-x-4">
              <Link href="/privacy" className="flex min-h-11 items-center underline hover:text-white">{t("footer.privacy")}</Link>
              <Link href="/terms" className="flex min-h-11 items-center underline hover:text-white">{t("footer.terms")}</Link>
            </span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
