"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-display text-2xl font-extrabold tracking-tight", light ? "text-white" : "text-foreground", className)}>
      Hello
      <span className="size-2.5 rounded-full bg-accent" aria-hidden />
    </span>
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
        tone === "navy" && "bg-navy text-white",
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

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Count-up number. `group` adds space thousands separators. */
export function CountUp({ to, suffix = "", group = true }: { to: number; suffix?: string; group?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const value = useMotionValue(0);
  const text = useTransform(value, (v) => {
    const n = String(Math.round(v));
    return (group ? n.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : n) + suffix;
  });
  useEffect(() => {
    if (!inView) return;
    const c = animate(value, to, { duration: 1.4, ease: "easeOut" });
    return () => c.stop();
  }, [inView, to, value]);
  return (
    <>
      <motion.span ref={ref}>{text}</motion.span>
    </>
  );
}
