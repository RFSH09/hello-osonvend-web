"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { GALLERY_ORDER, isPhotoVisible, PHOTOS, type PhotoKey } from "@/lib/media";

/** "Hello in real life": photo grid with a lightbox. Client photos stay hidden until config.showClientPhotos. */
export function Gallery() {
  const t = useTranslations("media");
  const tc = useTranslations("common");
  const keys = GALLERY_ORDER.filter(isPhotoVisible);
  const [open, setOpen] = useState<number | null>(null);

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + keys.length) % keys.length)), [keys.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const single = keys.length === 1;

  return (
    <>
      <ul className={cn("grid gap-4", single ? "mx-auto max-w-sm" : "grid-cols-2 lg:grid-cols-4")}>
        {keys.map((k, i) => (
          <li key={k}>
            <button
              onClick={() => setOpen(i)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-3xl shadow-lg"
              aria-label={`${t(`alt.${k}`)} — ${tc("zoom")}`}
            >
              <Image
                src={PHOTOS[k]}
                alt={t(`alt.${k}`)}
                fill
                sizes={single ? "384px" : "(max-width: 1024px) 50vw, 280px"}
                placeholder="blur"
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left font-semibold text-white">
                {t(`caption.${k}`)}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div role="dialog" aria-modal="true" aria-label={t("gallery.title")} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4" onClick={() => setOpen(null)}>
          <button onClick={() => setOpen(null)} aria-label={tc("close")} className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30">
            <X size={22} />
          </button>
          {keys.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label={tc("prev")} className="absolute left-3 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30">
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label={tc("next")} className="absolute right-3 flex size-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30">
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <figure className="relative max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image src={PHOTOS[keys[open]]} alt={t(`alt.${keys[open]}`)} sizes="90vw" className="max-h-[85vh] w-auto rounded-2xl object-contain" placeholder="blur" />
            <figcaption className="mt-3 text-center font-medium text-white">{t(`caption.${keys[open]}`)}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

export type { PhotoKey };
