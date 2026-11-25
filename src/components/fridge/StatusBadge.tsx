import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/primitives";
import type { FridgeStatus } from "@/lib/api/types";

const TONE = { available: "success", low: "warning", offline: "danger" } as const;

export function StatusBadge({ status, onDark }: { status: FridgeStatus; onDark?: boolean }) {
  const t = useTranslations("status");
  return (
    <Badge tone={TONE[status]} className={onDark ? "bg-white" : undefined}>
      <span className="size-2 rounded-full bg-current" aria-hidden />
      {t(status)}
    </Badge>
  );
}
