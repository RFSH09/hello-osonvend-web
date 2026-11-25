"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, CheckCircle2, CreditCard, DoorOpen, Globe, Pause, Play, ScanLine, Smartphone } from "lucide-react";
import { HelloLogo } from "@/components/ui/HelloLogo";
import { useEffect, useRef, useState } from "react";
import { ProductVisual } from "@/components/art/ProductVisual";
import type { Product } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export type DemoStep = { title: string; desc: string; tag: string; bullets: string[] };
export type DemoLabels = {
  scanning: string;
  opened: string;
  phone: string;
  code: string;
  cardLinked: string;
  doorOpen: string;
  taken: string;
  closeHint: string;
  receiptTitle: string;
  total: string;
  wrong: string;
  fiscal: string;
  pause: string;
  play: string;
};

const ICONS = [ScanLine, Smartphone, DoorOpen, CreditCard];
const STEP_MS = 6500;

/** Interactive "how it works": step list + a phone that plays each step. Auto-advances, tap to jump. */
export function HowItWorks({
  steps,
  labels,
  basket,
  unit,
}: {
  steps: DemoStep[];
  labels: DemoLabels;
  basket: Product[];
  unit: string;
}) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(!reduce);
  const running = playing && inView && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [running, active, steps.length]);

  function pick(i: number) {
    setActive(i);
    setPlaying(false);
  }

  const step = steps[active];

  return (
    <div ref={wrap} className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      {/* ── Steps ── */}
      <div className="order-2 lg:order-1">
        {/* Phone: pills */}
        <div className="mb-4 grid grid-cols-4 gap-2 lg:hidden" role="tablist">
          {steps.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={active === i}
              aria-label={s.title}
              onClick={() => pick(i)}
              className={cn(
                "relative flex h-14 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-2xl font-display text-sm font-extrabold ring-1 transition-colors",
                active === i ? "bg-panel text-accent ring-panel" : "bg-surface text-muted ring-border",
              )}
            >
              {(() => {
                const Icon = ICONS[i];
                return <Icon size={20} aria-hidden />;
              })()}
              0{i + 1}
              {active === i && running && (
                <motion.span
                  key={`p-${active}`}
                  className="absolute bottom-0 left-0 h-1 bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="rounded-3xl bg-surface p-5 ring-1 ring-border lg:hidden" aria-live="polite">
          <StepDetail step={step} index={active} />
        </div>

        {/* Desktop: expanding list */}
        <ol className="hidden flex-col gap-3 lg:flex">
          {steps.map((s, i) => {
            const Icon = ICONS[i];
            const on = active === i;
            return (
              <li key={i}>
                <button
                  onClick={() => pick(i)}
                  aria-expanded={on}
                  className={cn(
                    "relative w-full overflow-hidden rounded-3xl p-5 text-left ring-1 transition-all duration-300",
                    on ? "bg-surface shadow-[0_20px_50px_-20px_rgba(51,56,75,0.35)] ring-accent/40" : "bg-transparent ring-border hover:bg-surface",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl transition-colors", on ? "bg-panel text-accent" : "bg-background text-muted")}>
                      <Icon size={24} aria-hidden />
                    </span>
                    <span className="font-display text-sm font-extrabold text-muted">0{i + 1}</span>
                    <span className="font-display text-xl font-bold">{s.title}</span>
                    <span className={cn("ml-auto hidden rounded-full px-3 py-1 text-xs font-bold xl:inline", on ? "bg-accent/15 text-accent-strong" : "bg-background text-muted")}>{s.tag}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-16 pt-3">
                          <StepDetail step={s} index={i} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {on && running && (
                    <motion.span
                      key={`bar-${active}`}
                      className="absolute bottom-0 left-0 h-1 bg-accent"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {!reduce && (
          <button
            onClick={() => setPlaying((p) => !p)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted ring-1 ring-border hover:bg-surface"
          >
            {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            {playing ? labels.pause : labels.play}
          </button>
        )}
      </div>

      {/* ── Phone ── */}
      <div className="order-1 mx-auto lg:order-2" aria-hidden>
        <div className="relative">
          <div className="absolute -inset-8 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative w-[250px] rounded-[44px] bg-[#16181d] p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/40 sm:w-[270px]">
            <div className="relative aspect-[9/19] overflow-hidden rounded-[36px] bg-white">
              <div className="absolute left-1/2 top-2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-[#16181d]" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  {active === 0 && <ScanScreen labels={labels} />}
                  {active === 1 && <LoginScreen labels={labels} />}
                  {active === 2 && <DoorScreen labels={labels} basket={basket} />}
                  {active === 3 && <ReceiptScreen labels={labels} basket={basket} unit={unit} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDetail({ step, index, compact }: { step: DemoStep; index: number; compact?: boolean }) {
  return (
    <div>
      {!compact && (
        <div className="mb-2 flex items-center gap-2">
          <span className="font-display text-sm font-extrabold text-accent-strong">0{index + 1}</span>
          <h3 className="font-display text-xl font-bold">{step.title}</h3>
          <span className="ml-auto rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent-strong">{step.tag}</span>
        </div>
      )}
      <p className="text-muted">{step.desc}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {step.bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-[15px]">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-strong">
              <Check size={13} strokeWidth={3} aria-hidden />
            </span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────── Phone screens ───────── */

const QR = [
  "1111111011101111111", "1000001010001000001", "1011101001101011101", "1011101110001011101", "1011101011101011101",
  "1000001001001000001", "1111111010101111111", "0000000011000000000", "1101011100111010110", "0110100011010101101",
  "1011011101101100011", "0100100110010110100", "1110011001101101011", "0000000010100110100", "1111111001011010011",
  "1000001011100101100", "1011101000111011011", "1011101101001100100", "1111111010110101101",
];

function QRCode({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 19 19" className={className} shapeRendering="crispEdges">
      <rect width="19" height="19" fill="#fff" />
      {QR.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#33384b" /> : null)))}
    </svg>
  );
}

function ScanScreen({ labels }: { labels: DemoLabels }) {
  return (
    <div className="relative size-full bg-gradient-to-b from-[#2b2f38] via-[#1d2026] to-[#111317]">
      {/* fridge glass behind */}
      <div className="absolute inset-x-6 top-10 bottom-24 rounded-xl bg-gradient-to-b from-white/10 to-white/0 ring-1 ring-white/10">
        <div className="absolute inset-x-3 top-[45%] h-px bg-white/10" />
        <div className="absolute inset-x-3 top-[65%] h-px bg-white/10" />
      </div>
      <div className="absolute left-1/2 top-[30%] w-[58%] -translate-x-1/2">
        <div className="relative aspect-square rounded-lg bg-white p-2">
          <QRCode className="size-full" />
          <motion.div
            className="absolute inset-x-1 h-0.5 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(58,220,147,0.8)]"
            initial={{ top: "6%" }}
            animate={{ top: ["6%", "92%", "6%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        {["left-[-10px] top-[-10px] border-l-4 border-t-4 rounded-tl-xl", "right-[-10px] top-[-10px] border-r-4 border-t-4 rounded-tr-xl", "left-[-10px] bottom-[-10px] border-l-4 border-b-4 rounded-bl-xl", "right-[-10px] bottom-[-10px] border-r-4 border-b-4 rounded-br-xl"].map((c) => (
          <span key={c} className={`absolute size-7 border-accent ${c}`} />
        ))}
      </div>
      <p className="absolute inset-x-0 top-[66%] text-center text-xs font-semibold text-white/70">{labels.scanning}</p>
      <motion.div
        className="absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl"
        initial={{ y: 120 }}
        animate={{ y: 0 }}
        transition={{ delay: 2.4, type: "spring", stiffness: 160, damping: 18 }}
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent/20 text-[#0f7a4d]"><Globe size={18} /></span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[11px] text-[#5d6275]">osonvend.uz/refrigerator/W0016188</span>
          <span className="block text-sm font-bold text-navy">{labels.opened}</span>
        </span>
      </motion.div>
    </div>
  );
}

function LoginScreen({ labels }: { labels: DemoLabels }) {
  const phone = "90 123 45 67";
  const code = "481 205";
  return (
    <div className="flex size-full flex-col bg-[#f5f7fa] px-4 pb-4 pt-12">
      <HelloLogo className="mb-6 h-7 w-auto self-start text-[#33384b]" />
      <p className="mb-1 text-[11px] font-semibold text-[#5d6275]">{labels.phone}</p>
      <div className="flex h-11 items-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-navy ring-2 ring-accent">
        <span className="text-[#5d6275]">+998</span>
        <span>
          {[...phone].map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }}>
              {ch}
            </motion.span>
          ))}
        </span>
      </div>
      <p className="mb-1 mt-4 text-[11px] font-semibold text-[#5d6275]">{labels.code}</p>
      <div className="grid grid-cols-6 gap-1.5">
        {[...code.replace(" ", "")].map((d, i) => (
          <motion.span
            key={i}
            className="flex h-10 items-center justify-center rounded-lg bg-white font-display text-lg font-extrabold text-navy ring-1 ring-[#e3e6ee]"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.6 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
          >
            {d}
          </motion.span>
        ))}
      </div>
      <motion.div
        className="mt-auto flex items-center gap-2 rounded-2xl bg-white p-3 shadow-lg ring-1 ring-[#e3e6ee]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8 }}
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-accent text-navy"><Check size={16} strokeWidth={3} /></span>
        <span className="text-xs font-bold text-navy">Payme · Click — {labels.cardLinked}</span>
      </motion.div>
    </div>
  );
}

function DoorScreen({ labels, basket }: { labels: DemoLabels; basket: Product[] }) {
  const [sec, setSec] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative flex size-full flex-col items-center bg-gradient-to-b from-[#3adc93] to-[#22b877] px-4 pb-5 pt-14 text-navy">
      <div className="relative mt-4 flex size-28 items-center justify-center">
        {[0, 1].map((r) => (
          <motion.span
            key={r}
            className="absolute inset-0 rounded-full bg-white/40"
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: r * 0.9, ease: "easeOut" }}
          />
        ))}
        <span className="relative flex size-24 items-center justify-center rounded-full bg-white shadow-xl">
          <DoorOpen size={44} />
        </span>
      </div>
      <p className="mt-5 font-display text-2xl font-extrabold">{labels.doorOpen}</p>
      <p className="font-display text-lg font-bold tabular-nums opacity-70">0:{String(sec).padStart(2, "0")}</p>
      <div className="mt-auto flex w-full flex-col gap-2">
        {basket.map((p, i) => (
          <motion.div
            key={p.id}
            className="flex items-center gap-2 rounded-xl bg-white/90 p-2 text-xs font-bold shadow"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4 + i * 0.9, type: "spring", stiffness: 200, damping: 16 }}
          >
            <span className="relative block size-9 overflow-hidden rounded-lg bg-white">
              <ProductVisual product={p} className="size-full" sizes="36px" />
            </span>
            <span className="min-w-0 flex-1 truncate">{p.name}</span>
            <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px]">{labels.taken}</span>
          </motion.div>
        ))}
        <p className="mt-1 text-center text-[11px] font-semibold opacity-75">{labels.closeHint}</p>
      </div>
    </div>
  );
}

function ReceiptScreen({ labels, basket, unit }: { labels: DemoLabels; basket: Product[]; unit: string }) {
  const total = basket.reduce((s, p) => s + p.price, 0);
  return (
    <div className="flex size-full flex-col bg-[#f5f7fa] px-4 pb-4 pt-12">
      <motion.div
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-navy"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
      >
        <CheckCircle2 size={34} />
      </motion.div>
      <p className="mt-3 text-center font-display text-lg font-extrabold text-navy">{labels.receiptTitle}</p>
      <div className="mt-4 rounded-2xl bg-white p-3 ring-1 ring-[#e3e6ee]">
        {basket.map((p, i) => (
          <motion.div
            key={p.id}
            className="flex items-center gap-2 py-1.5 text-xs"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.25 }}
          >
            <span className="relative block size-8 overflow-hidden rounded-md bg-white">
              <ProductVisual product={p} className="size-full" sizes="32px" />
            </span>
            <span className="min-w-0 flex-1 truncate font-semibold text-navy">{p.name}</span>
            <span className="font-bold text-navy">{formatPrice(p.price, unit)}</span>
          </motion.div>
        ))}
        <motion.div
          className="mt-2 flex items-center justify-between border-t border-dashed border-[#e3e6ee] pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="text-xs font-semibold text-[#5d6275]">{labels.total}</span>
          <span className="font-display text-base font-extrabold text-navy">{formatPrice(total, unit)}</span>
        </motion.div>
        <p className="mt-1 text-right text-[10px] text-[#5d6275]">Payme •••• 1234</p>
      </div>
      <motion.div className="mt-3 flex items-center gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}>
        <QRCode className="size-14 rounded-md ring-1 ring-[#e3e6ee]" />
        <span className="text-[10px] leading-snug text-[#5d6275]">{labels.fiscal}</span>
      </motion.div>
      <span className="mt-auto flex h-10 items-center justify-center rounded-full text-xs font-bold text-navy ring-1 ring-[#e3e6ee]">{labels.wrong}</span>
    </div>
  );
}
