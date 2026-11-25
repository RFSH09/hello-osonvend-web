"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Card } from "@/components/ui/primitives";
import { submitLead } from "@/lib/api";
import { formatNational, isCompletePhone, nationalDigits } from "@/lib/phone";

const TYPES = ["office", "university", "clinic", "center", "factory", "other"] as const;
const field = "min-h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:border-accent";

export function LeadForm() {
  const t = useTranslations("biz.form");
  const tt = useTranslations("biz.types");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isCompletePhone(phone)) return setErr(t("phoneInvalid"));
    setErr(null);
    setState("busy");
    const f = new FormData(e.currentTarget);
    try {
      await submitLead({
        company: String(f.get("company")),
        contact: String(f.get("contact")),
        phone: `+998${phone}`,
        type: String(f.get("type")),
        address: String(f.get("address")),
        people: String(f.get("people")),
        comment: String(f.get("comment")),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return (
      <Card className="flex flex-col items-center gap-3 py-12 text-center" role="status">
        <CheckCircle2 size={56} className="text-accent" aria-hidden />
        <h3 className="font-display text-2xl font-bold">{t("success")}</h3>
        <p className="text-muted">{t("successText")}</p>
      </Card>
    );

  return (
    <Card className="p-6 sm:p-8">
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
        <label className="flex flex-col gap-1.5 font-medium">{t("company")}
          <input name="company" required autoComplete="organization" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">{t("contact")}
          <input name="contact" required autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">{t("phone")}
          <div className="flex min-h-12 items-center rounded-xl border border-border bg-background px-4 focus-within:border-accent">
            <span className="pr-2 font-semibold text-muted">+998</span>
            <input inputMode="numeric" autoComplete="tel-national" placeholder="90 123 45 67" value={formatNational(phone)}
              onChange={(e) => setPhone(nationalDigits(e.target.value))} className="w-full bg-transparent py-3 outline-none" />
          </div>
        </label>
        <label className="flex flex-col gap-1.5 font-medium">{t("type")}
          <select name="type" className={field}>
            {TYPES.map((k) => <option key={k} value={k}>{tt(k)}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 font-medium">{t("address")}
          <input name="address" required autoComplete="street-address" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 font-medium">{t("people")}
          <input name="people" type="number" min={1} inputMode="numeric" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 font-medium sm:col-span-2">{t("comment")}
          <textarea name="comment" rows={3} className={`${field} py-3`} />
        </label>
        {(err || state === "error") && <p role="alert" className="font-medium text-brand-red sm:col-span-2">{err ?? t("error")}</p>}
        <Button type="submit" variant="accent" size="lg" disabled={state === "busy"} className="sm:col-span-2">
          {state === "busy" && <Loader2 className="animate-spin" size={18} aria-hidden />} {t("submit")}
        </Button>
      </form>
    </Card>
  );
}
