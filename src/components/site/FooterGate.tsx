"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** Hides the marketing footer inside the account area and on provider test pages. */
export function FooterGate({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/account") || path.startsWith("/provider-test")) return null;
  return <>{children}</>;
}
