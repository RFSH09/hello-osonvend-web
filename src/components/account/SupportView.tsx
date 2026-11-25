"use client";

import { Check, LifeBuoy, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/i18n/navigation";
import * as api from "@/lib/account/api";
import type { Ticket, TicketStatus } from "@/lib/account/types";
import { config } from "@/config";
import { cn } from "@/lib/cn";
import { formatTashkentTime } from "@/lib/format";
import { useAsync } from "./hooks";
import { ErrorState, ListSkeleton, PageHeader } from "./states";

const STEPS: TicketStatus[] = ["open", "checking", "resolved"];
const TONE = { open: "warning", checking: "warning", resolved: "success" } as const;

function Timeline({ ticket, locale }: { ticket: Ticket; locale: string }) {
  const t = useTranslations("account.support.timeline");
  const current = STEPS.indexOf(ticket.status);
  return (
    <ol className="mt-4 flex flex-col gap-0">
      {STEPS.map((s, i) => {
        const done = i <= current;
        const at = ticket.timeline.find((x) => x.status === s)?.at;
        return (
          <li key={s} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn("flex size-7 items-center justify-center rounded-full text-xs font-bold", done ? "bg-accent text-navy" : "bg-border text-muted", i === current && "ring-4 ring-accent/30")}>
                {done ? <Check size={14} aria-hidden /> : i + 1}
              </span>
              {i < STEPS.length - 1 && <span className={cn("my-1 h-6 w-0.5", i < current ? "bg-accent" : "bg-border")} />}
            </div>
            <div className="pb-3">
              <div className={cn("font-semibold", !done && "text-muted")}>{t(s)}</div>
              {at && <div className="text-sm text-muted">{formatTashkentTime(at, locale)}</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function SupportView() {
  const t = useTranslations("account.support");
  const locale = useLocale();
  const res = useAsync(() => api.listTickets());

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("reply24")}
        actions={<ButtonLink href="/account/support/new" variant="accent"><Plus size={18} aria-hidden />{t("newTicket")}</ButtonLink>}
      />
      {res.status === "loading" && <ListSkeleton rows={2} height="h-56" />}
      {res.status === "error" && <ErrorState onRetry={res.retry} />}
      {res.status === "ok" && res.data.length === 0 && (
        <Card>
          <EmptyState
            icon={<LifeBuoy size={48} aria-hidden />}
            title={t("empty")}
            text={t("emptyText")}
            action={<ButtonLink href="/account/support/new" variant="accent">{t("newTicket")}</ButtonLink>}
          />
        </Card>
      )}
      {res.status === "ok" && res.data.length > 0 && (
        <ul className="flex flex-col gap-4">
          {res.data.map((tk) => (
            <li key={tk.id}>
              <Card className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-lg font-bold">{t("ticketN", { id: tk.id })}</h2>
                    <p className="text-sm text-muted">{t(`reasons.${tk.reason}`)}{tk.orderId && <> · <Link href={`/account/purchases/${tk.orderId}`} className="font-semibold text-accent-strong underline">{tk.orderId}</Link></>}</p>
                  </div>
                  <Badge tone={TONE[tk.status]}>{t(`status.${tk.status}`)}</Badge>
                </div>
                {tk.comment && <p className="mt-3 rounded-xl bg-background p-3 text-sm">{tk.comment}</p>}
                <Timeline ticket={tk} locale={locale} />
              </Card>
            </li>
          ))}
        </ul>
      )}
      <Card className="mt-6 flex flex-col items-start gap-3 p-5">
        <h2 className="font-display text-lg font-bold">{t("contactTitle")}</h2>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={config.contact.telegram} external variant="outline">Telegram</ButtonLink>
          <ButtonLink href={config.contact.whatsapp} external variant="outline">WhatsApp</ButtonLink>
          <ButtonLink href={config.contact.phoneHref} external variant="outline">{config.contact.phone}</ButtonLink>
        </div>
      </Card>
      <span className="hidden"><Button>{""}</Button></span>
    </div>
  );
}
