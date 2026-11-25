"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button, Card, Skeleton } from "@/components/ui/primitives";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 print:hidden">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = useTranslations("account.states");
  return (
    <Card role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertTriangle size={40} className="text-brand-red" aria-hidden />
      <h2 className="font-display text-xl font-bold">{t("errorTitle")}</h2>
      <p className="max-w-sm text-muted">{t("errorText")}</p>
      <Button variant="outline" onClick={onRetry}>{t("retry")}</Button>
    </Card>
  );
}

export function ListSkeleton({ rows = 4, height = "h-20" }: { rows?: number; height?: string }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`${height} w-full rounded-card`} />
      ))}
    </div>
  );
}
