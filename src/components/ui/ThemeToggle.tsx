"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const t = useTranslations("common");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with the theme attribute set outside React
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  function toggle() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(!dark);
  }

  return (
    <button
      onClick={toggle}
      aria-label={t("theme")}
      className="flex size-11 items-center justify-center rounded-full hover:bg-border/50"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
