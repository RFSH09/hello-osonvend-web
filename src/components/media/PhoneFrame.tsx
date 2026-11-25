import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Phone-shaped frame (464x848 media ratio). Never wider than ~360px. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative w-full max-w-[360px] rounded-[2.4rem] bg-panel p-2 shadow-2xl ring-1 ring-black/10", className)}>
      <div className="relative aspect-[464/848] overflow-hidden rounded-[1.9rem] bg-black">{children}</div>
      <span className="pointer-events-none absolute left-1/2 top-3.5 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/70" aria-hidden />
    </div>
  );
}
