"use client";

import { motion } from "framer-motion";
import { ProductArt } from "./ProductArt";
import type { ProductKind } from "@/lib/api/types";

type Slot = { kind: ProductKind; color: string; accent: string };
const SHELVES: Slot[][] = [
  [
    { kind: "bottle", color: "#7F1D1D", accent: "#EF4444" },
    { kind: "bottle", color: "#F97316", accent: "#FDBA74" },
    { kind: "can", color: "#1F2937", accent: "#F59E0B" },
  ],
  [
    { kind: "can", color: "#93C5FD", accent: "#DC2626" },
    { kind: "bottle", color: "#34D399", accent: "#047857" },
    { kind: "bottle", color: "#F59E0B", accent: "#B45309" },
  ],
  [
    { kind: "pack", color: "#FDE047", accent: "#DC2626" },
    { kind: "pack", color: "#1D4ED8", accent: "#FDE047" },
    { kind: "bar", color: "#7C2D12", accent: "#38BDF8" },
  ],
  [
    { kind: "bar", color: "#1D4ED8", accent: "#F8FAFC" },
    { kind: "bar", color: "#B45309", accent: "#FCD34D" },
    { kind: "pack", color: "#A78BFA", accent: "#4C1D95" },
  ],
];

/** Hero illustration: tall glass-door fridge (navy body, green strip) + phone scanning a QR. */
export function FridgeIllustration({ className }: { className?: string }) {
  return (
    <div className={`relative mx-auto aspect-[5/7] w-full max-w-[420px] ${className ?? ""}`}>
      <div className="absolute inset-x-6 bottom-0 h-8 rounded-[50%] bg-navy/15 blur-xl" />
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 300 420" className="size-full drop-shadow-2xl" role="img" aria-label="Hello fridge">
          <rect x="30" y="8" width="240" height="396" rx="26" fill="#0F1E3D" />
          {/* top display */}
          <rect x="46" y="22" width="208" height="44" rx="14" fill="#16294F" />
          <text x="64" y="52" fontFamily="var(--font-manrope), sans-serif" fontWeight="800" fontSize="22" fill="#fff">Hello</text>
          <circle cx="132" cy="44" r="5" fill="#22C55E" />
          <rect x="190" y="38" width="50" height="12" rx="6" fill="#22C55E" opacity="0.9" />
          {/* glass door */}
          <rect x="46" y="76" width="208" height="296" rx="14" fill="#DCE6F5" />
          <rect x="46" y="76" width="208" height="296" rx="14" fill="url(#glass)" />
          <defs>
            <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#9FB6DA" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {SHELVES.map((row, r) => (
            <g key={r} transform={`translate(0 ${76 + r * 74})`}>
              {row.map((s, i) => (
                <foreignObject key={i} x={58 + i * 62} y={0} width="62" height="62">
                  <ProductArt product={s} className="size-full" />
                </foreignObject>
              ))}
              <rect x="52" y="64" width="196" height="5" rx="2.5" fill="#B7C5DC" />
            </g>
          ))}
          {/* green accent strip + handle */}
          <rect x="30" y="8" width="9" height="396" rx="4.5" fill="#22C55E" />
          <rect x="258" y="150" width="7" height="100" rx="3.5" fill="#22C55E" />
          <path d="M60 90c40 20 40 60 20 120" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* feet */}
          <rect x="56" y="404" width="26" height="10" rx="3" fill="#0A1429" />
          <rect x="218" y="404" width="26" height="10" rx="3" fill="#0A1429" />
        </svg>
      </motion.div>

      {/* phone scanning QR */}
      <motion.div
        className="absolute -bottom-2 -left-2 w-[34%] sm:-left-6"
        animate={{ y: [0, 10, 0], rotate: [-6, -3, -6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 120 220" className="drop-shadow-xl" aria-hidden>
          <rect x="4" y="4" width="112" height="212" rx="20" fill="#fff" stroke="#0F1E3D" strokeWidth="6" />
          <rect x="44" y="12" width="32" height="6" rx="3" fill="#0F1E3D" />
          <g transform="translate(26 54)">
            <rect width="68" height="68" rx="6" fill="#F5F7FA" />
            <rect x="6" y="6" width="18" height="18" fill="#0F1E3D" />
            <rect x="44" y="6" width="18" height="18" fill="#0F1E3D" />
            <rect x="6" y="44" width="18" height="18" fill="#0F1E3D" />
            <rect x="10" y="10" width="10" height="10" fill="#fff" />
            <rect x="48" y="10" width="10" height="10" fill="#fff" />
            <rect x="10" y="48" width="10" height="10" fill="#fff" />
            <rect x="30" y="8" width="8" height="8" fill="#0F1E3D" />
            <rect x="30" y="30" width="12" height="12" fill="#0F1E3D" />
            <rect x="48" y="40" width="8" height="8" fill="#0F1E3D" />
            <rect x="44" y="52" width="14" height="6" fill="#0F1E3D" />
            <rect x="28" y="50" width="8" height="8" fill="#0F1E3D" />
          </g>
          <rect x="22" y="86" width="76" height="3" fill="#22C55E" />
          <rect x="26" y="150" width="68" height="26" rx="13" fill="#22C55E" />
          <text x="60" y="168" textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F1E3D">SCAN</text>
        </svg>
      </motion.div>
    </div>
  );
}
