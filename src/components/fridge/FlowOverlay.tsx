"use client";

import { AlertTriangle, Ban, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { DoorOpen } from "@/components/ui/DoorOpen";
import { Button } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { config } from "@/config";
import { DOOR_REMINDER_SEC, type FlowState } from "@/lib/flow/machine";
import { Receipt } from "./Receipt";

function mmss(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function DoorTimer({ closeLabel, reminder, onClosed }: { closeLabel: string; reminder: string; onClosed: () => void }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <div className="font-display text-6xl font-extrabold tabular-nums" aria-live="off">{mmss(sec)}</div>
      {sec >= DOOR_REMINDER_SEC && <p role="alert" className="rounded-full bg-navy px-5 py-2 font-semibold text-white">{reminder}</p>}
      <Button variant="primary" size="lg" onClick={onClosed}>{closeLabel}</Button>
    </>
  );
}

/** Full-screen screens for every non-idle state of the unlock flow. */
export function FlowOverlay({
  state,
  onClosed,
  onReset,
}: {
  state: FlowState;
  onClosed: () => void;
  onReset: () => void;
}) {
  const t = useTranslations();
  if (state.name === "idle") return null;

  const shell = (bg: string, children: React.ReactNode) => (
    <div role="dialog" aria-modal="true" className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-y-auto px-6 text-center ${bg}`}>
      {children}
    </div>
  );

  switch (state.name) {
    case "unlocking":
      return shell("bg-navy text-white", (
        <>
          <Loader2 size={56} className="animate-spin text-accent" aria-hidden />
          <h1 className="font-display text-3xl font-extrabold">{t("flow.unlocking")}</h1>
          <p className="text-white/70">{t("flow.unlockingText")}</p>
        </>
      ));
    case "door_open":
      return shell("bg-accent text-navy", (
        <>
          <DoorOpen open />
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">{t("flow.doorOpen")}</h1>
          <p className="text-lg font-medium">{t("flow.doorOpenText")}</p>
          <DoorTimer closeLabel={t("flow.doorClosed")} reminder={t("flow.closeReminder")} onClosed={onClosed} />
        </>
      ));
    case "processing":
      return shell("bg-navy text-white", (
        <>
          <Loader2 size={56} className="animate-spin text-accent" aria-hidden />
          <h1 className="font-display text-3xl font-extrabold">{t("flow.processing")}</h1>
          <p className="text-white/70">{t("flow.processingText")}</p>
        </>
      ));
    case "receipt":
      return shell("bg-background !justify-start !text-left", <Receipt order={state.order} onDone={onReset} />);
    case "nothing_taken":
      return shell("bg-background", (
        <>
          <Ban size={56} className="text-muted" aria-hidden />
          <h1 className="font-display text-3xl font-extrabold">{t("flow.nothingTitle")}</h1>
          <p className="text-lg text-muted">{t("flow.nothingText")}</p>
          <Button variant="accent" size="lg" onClick={onReset}>{t("flow.done")}</Button>
        </>
      ));
    case "error":
      return shell("bg-background", (
        <>
          <AlertTriangle size={56} className="text-brand-red" aria-hidden />
          <h1 className="font-display text-3xl font-extrabold">{t("flow.errorTitle")}</h1>
          <p className="max-w-sm text-lg text-muted">{t(state.reason === "unlock_timeout" ? "flow.errorTimeout" : "flow.errorText")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="accent" onClick={onReset}>{t("common.retry")}</Button>
            <ButtonLink href={config.contact.telegram} external variant="outline">{t("common.support")}</ButtonLink>
          </div>
        </>
      ));
  }
}
