"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { DoorOpen } from "@/components/ui/DoorOpen";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { BottomSheet, useToast } from "@/components/ui/overlays";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ProductCard,
  Skeleton,
  StepIndicator,
} from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Showcase() {
  const t = useTranslations();
  const toast = useToast();
  const [sheet, setSheet] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-2xl font-extrabold">{t("brand.name")}</span>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("hero.title")}</h1>
        <p className="max-w-xl text-lg text-muted">{t("hero.subtitle")}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="accent" size="lg">{t("hero.ctaFind")}</Button>
          <Button variant="outline" size="lg">{t("hero.ctaBusiness")}</Button>
        </div>
      </section>

      <Card>
        <h2 className="mb-4 font-display text-xl font-bold">{t("steps.title")}</h2>
        <StepIndicator
          steps={[t("steps.scan"), t("steps.login"), t("steps.take"), t("steps.pay")]}
        />
      </Card>

      <Card className="flex flex-col items-center gap-4">
        <h2 className="font-display text-xl font-bold">{t("showcase.doorDemo")}</h2>
        <DoorOpen open={open} />
        <Button variant="accent" onClick={() => setOpen((o) => !o)}>
          {t("showcase.openDoor")}
        </Button>
      </Card>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ProductCard name="Coca-Cola 0.5L" price={9000} />
        <ProductCard name="Snickers" price={14000} />
        <ProductCard name="Red Bull 0.3L" price={30000} />
        <ProductCard name="Bounty" price={11000} soldOut soldOutLabel="—" />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="success">online</Badge>
        <Badge tone="warning">low stock</Badge>
        <Badge tone="danger">offline</Badge>
        <Button variant="outline" onClick={() => toast(t("showcase.toast"), "success")}>
          {t("showcase.toast")}
        </Button>
        <Button variant="outline" onClick={() => setSheet(true)}>
          {t("showcase.sheet")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </Card>
        <Card>
          <EmptyState title={t("empty.title")} text={t("empty.text")} />
        </Card>
      </div>

      <BottomSheet
        open={sheet}
        onClose={() => setSheet(false)}
        title={t("showcase.sheet")}
        closeLabel={t("common.close")}
      >
        <p className="text-muted">{t("showcase.sheetText")}</p>
      </BottomSheet>
    </main>
  );
}
