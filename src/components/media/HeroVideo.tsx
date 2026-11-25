"use client";

import { useEffect, useRef } from "react";
import { VIDEO } from "@/lib/media";
import { PhoneFrame } from "./PhoneFrame";

/**
 * Small muted looping clip in a phone frame. Autoplays only when the visitor has not asked for
 * reduced motion; otherwise the poster stays. Metadata-only preload keeps the page light.
 */
export function HeroVideo({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <PhoneFrame className={className}>
      <video
        ref={ref}
        className="size-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={VIDEO.poster}
        aria-label={label}
      >
        <source src={VIDEO.heroLoop} type="video/mp4" />
      </video>
    </PhoneFrame>
  );
}
