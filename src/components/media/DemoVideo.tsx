"use client";

import { Play } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { VIDEO } from "@/lib/media";
import { PhoneFrame } from "./PhoneFrame";

/** The 33 s clean demo in a phone frame: poster + play button, native controls, lazy-loaded. */
export function DemoVideo({ label, playLabel }: { label: string; playLabel: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const near = useInView(wrap, { once: true, margin: "300px" });
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    void video.current?.play();
  }

  return (
    <div ref={wrap} className="w-full max-w-[360px]">
      <PhoneFrame>
        {near ? (
          <video
            ref={video}
            className="size-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={VIDEO.poster}
            aria-label={label}
            onPlay={() => setStarted(true)}
            onPause={() => setStarted(false)}
          >
            <source src={VIDEO.demo} type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={VIDEO.poster} alt={label} className="size-full object-cover" loading="lazy" width={464} height={848} />
        )}
        {!started && (
          <button
            onClick={play}
            aria-label={playLabel}
            className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-navy shadow-xl transition-transform duration-200 hover:scale-105"
          >
            <Play size={34} fill="currentColor" aria-hidden />
          </button>
        )}
      </PhoneFrame>
    </div>
  );
}
