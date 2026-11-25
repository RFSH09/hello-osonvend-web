import Image from "next/image";
import { useTranslations } from "next-intl";
import { VIDEO } from "@/lib/media";

export type StepId = "s1" | "s2" | "s3" | "s4";

/** Clean new-design mockup of the phone login screen (step 2 has no real still). */
function LoginMockup() {
  return (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-accent/25 to-accent/5 p-6" aria-hidden>
      <div className="w-[62%] max-w-[200px] rounded-[1.6rem] bg-panel p-1.5 shadow-xl">
        <div className="flex aspect-[9/17] flex-col gap-2 rounded-[1.25rem] bg-white p-3">
          <span className="mx-auto mt-1 h-1 w-8 rounded-full bg-border" />
          <div className="mt-2 font-display text-[11px] font-extrabold text-navy">+998</div>
          <div className="h-7 rounded-lg border border-border bg-background px-2 text-[10px] font-bold leading-7 tabular-nums text-navy">90 123 45 67</div>
          <div className="mt-1 flex justify-between gap-1">
            {["4", "8", "1", "", "", ""].map((d, i) => (
              <span key={i} className={`flex h-6 flex-1 items-center justify-center rounded-md border text-[10px] font-extrabold ${i === 3 ? "border-accent" : "border-border"} bg-background text-navy`}>{d}</span>
            ))}
          </div>
          <div className="mt-auto flex h-8 items-center justify-center rounded-full bg-accent text-[10px] font-extrabold text-navy">SMS</div>
        </div>
      </div>
    </div>
  );
}

const IMG = { s1: VIDEO.stills.scan, s3: VIDEO.stills.take, s4: VIDEO.stills.ai } as const;
const ALT = { s1: "scan", s3: "take", s4: "ai" } as const;

/** Real still for steps 1/3/4, UI mockup for step 2. Plain JPG stills (464x848) served via next/image. */
export function StepVisual({ id, className }: { id: StepId; className?: string }) {
  const t = useTranslations("media");
  return (
    <div className={`relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-background shadow-lg ${className ?? ""}`}>
      {id === "s2" ? (
        <LoginMockup />
      ) : (
        <Image
          src={IMG[id]}
          alt={t(`alt.${ALT[id]}`)}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
          className="object-cover"
        />
      )}
      {id === "s4" && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 text-left font-semibold text-white">{t("caption.ai")}</span>
      )}
    </div>
  );
}
