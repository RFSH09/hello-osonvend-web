"use client";

import { useEffect } from "react";

/** Applies the saved theme after hydration. Light is the default, so only dark visitors see a brief switch. */
export function ThemeInit() {
  useEffect(() => {
    try {
      document.documentElement.dataset.theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {}
  }, []);
  return null;
}
