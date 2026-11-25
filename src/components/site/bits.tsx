"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Real Hello wordmark. `light` = for dark backgrounds (white logo). ~36px tall. */
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Image
      src={light ? "/brand/hello-logo-white.png" : "/brand/hello-logo-dark.png"}
      alt="Hello"
      width={72}
      height={36}
      priority
      className={cn("h-9 w-auto self-start", className)}
    />
  );
}

/** Full-width section band with a centered 1200px container. */
export function Section({
  tone = "white",
  className,
  children,
  id,
}: {
  tone?: "white" | "light" | "navy";
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-16 sm:py-24",
        tone === "white" && "bg-surface",
        tone === "light" && "bg-background",
        tone === "navy" && "bg-panel text-white",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  subtitle,
  light,
  center,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl sm:mb-14", center && "mx-auto text-center")}>
      <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className={cn("mt-3 text-lg", light ? "text-white/70" : "text-muted")}>{subtitle}</p>}
    </div>
  );
}

/** Short fade-up, once, early. Content is always fully visible (opacity never drops); motion is skipped for reduced-motion users. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ y: 14 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Count-up number. The final value is rendered on the server (never "0+").
 * When scrolled into view it replays a short roll-up from ~60% of the value.
 */
export function CountUp({ to, suffix = "", group = true }: { to: number; suffix?: string; group?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => {
    const n = String(Math.round(v));
    return (group ? n.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : n) + suffix;
  });
  useEffect(() => {
    if (!inView || reduce) return;
    value.set(to * 0.6);
    const c = animate(value, to, { duration: 1.1, ease: "easeOut" });
    return () => c.stop();
  }, [inView, reduce, to, value]);
  return <motion.span ref={ref}>{text}</motion.span>;
}
