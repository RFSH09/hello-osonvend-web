"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ProductVisual } from "@/components/art/ProductVisual";
import { HelloLogo } from "@/components/ui/HelloLogo";
import { PRODUCT_BY_ID } from "@/lib/data/products";

/** Shelves, top to bottom — like a real stocked Hello fridge. */
const SHELVES: { ids: string[]; tall?: boolean }[] = [
  { ids: ["lays", "bruni", "keshyu", "hazel"] },
  { ids: ["snickers", "twix", "bounty", "kitkat", "tuc"] },
  { ids: ["gorilla", "18plus", "adrenaline", "red-bull-025", "montella"], tall: true },
  { ids: ["coca-cola", "fanta", "fuse-tea", "pulpy-orange", "coca-cola"], tall: true },
  { ids: ["bonaqua", "chortoq", "lactel", "sochnaya-dolina", "viko"], tall: true },
];

/** Small QR sticker pattern (decorative). */
const QR = ["1111111011101111111","1000001010001000001","1011101001101011101","1011101110001011101","1011101011101011101","1000001001001000001","1111111010101111111","0000000011000000000","1101011100111010110","0110100011010101101","1011011101101100011","0100100110010110100","1110011001101101011","0000000010100110100","1111111001011010011","1000001011100101100","1011101000111011011","1011101101001100100","1111111010110101101"];

const LOOP = 8; // seconds per open/close cycle

/** The Hello fridge drawn in code (always sharp), with real product photos on the shelves. */
export function FridgeModel({ className, animated = true }: { className?: string; animated?: boolean }) {
  const reduce = useReducedMotion();
  const play = animated && !reduce;
  const cola = PRODUCT_BY_ID.get("coca-cola")!;

  return (
    <div className={`relative [perspective:1400px] ${className ?? ""}`}>
      <div className="relative flex aspect-[0.44] w-full">
        {/* Side panel (brand side) */}
        <div className="relative w-[17%] shrink-0 rounded-l-[18px] bg-gradient-to-b from-[#2f323b] to-[#23262d] shadow-[inset_-6px_0_12px_rgba(0,0,0,0.35)]">
          <div className="absolute inset-x-0 top-[14%] flex flex-col items-center gap-2">
            <svg viewBox="0 0 40 52" className="w-[58%]" aria-hidden>
              <circle cx="20" cy="5" r="4.5" fill="#3ADC93" />
              <circle cx="20" cy="24" r="10" fill="none" stroke="#fff" strokeWidth="4.5" />
              <path d="M6 38 Q20 50 34 38" fill="none" stroke="#3ADC93" strokeWidth="4.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-[22%] flex flex-col items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-[38%] rounded-full bg-white/80 ring-2 ring-white/20" />
            ))}
          </div>
        </div>

        {/* Front */}
        <div className="relative flex flex-1 flex-col rounded-r-[18px] bg-[#2a2d35] p-[5%] pb-0 shadow-[0_40px_60px_-20px_rgba(0,0,0,0.6)]">
          {/* Lit header box */}
          <div className="relative mb-[5%] flex h-[11%] items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-b from-[#3a3e48] to-[#1d1f25] ring-1 ring-white/10">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
            <HelloLogo className="relative h-[62%] w-auto text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]" />
          </div>

          {/* Interior (visible through / behind the door) */}
          <div className="relative flex-1 overflow-hidden rounded-[6px] bg-gradient-to-b from-[#f4f7f9] to-[#e2e8ee]">
            <div aria-hidden className="absolute inset-y-0 right-[4%] w-[3px] rounded-full bg-white shadow-[0_0_14px_4px_rgba(255,255,255,0.95)]" />
            <div className="absolute inset-0 flex flex-col justify-between px-[4%] pb-[3%] pt-[7%]">
              {SHELVES.map((row, r) => (
                <div key={r} className="relative">
                  <div className="flex items-end justify-between">
                    {row.ids.map((id, i) => {
                      const p = PRODUCT_BY_ID.get(id);
                      if (!p) return null;
                      return (
                        <span key={`${id}-${i}`} className={`relative block flex-1 ${row.tall ? "aspect-[1/1.45] -mx-[3%]" : "aspect-square -mx-[1%]"}`}>
                          <ProductVisual product={p} className="size-full" sizes="72px" />
                        </span>
                      );
                    })}
                  </div>
                  <div className="mt-[2px] h-[3px] rounded-full bg-gradient-to-b from-[#c9d0d8] to-[#9aa3ae]" />
                </div>
              ))}
            </div>
          </div>

          {/* Door: silver frame + glass, swings open */}
          <motion.div
            aria-hidden
            className="absolute bottom-[14%] left-[3%] right-[3%] top-[17%] rounded-[8px] border-[5px] border-[#b8bfc9] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),0_6px_18px_rgba(0,0,0,0.25)] [transform-origin:left_center] [transform-style:preserve-3d]"
            animate={play ? { rotateY: [0, 0, -38, -38, 0, 0] } : undefined}
            transition={play ? { duration: LOOP, times: [0, 0.3, 0.4, 0.7, 0.8, 1], repeat: Infinity, ease: "easeInOut" } : undefined}
          >
            <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-white/25 via-white/5 to-white/20">
              <div className="absolute -left-1/4 top-0 h-full w-1/3 -skew-x-12 bg-white/25 blur-[2px]" />
            </div>
            {/* QR sticker */}
            <span className="absolute left-[5%] top-[2.5%] block w-[20%] rounded-[3px] bg-white p-[2%] shadow">
              <svg viewBox="0 0 19 19" className="block w-full" shapeRendering="crispEdges">
                {QR.flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#33384b" /> : null)))}
              </svg>
            </span>
            {/* Handle */}
            <span className="absolute right-[3%] top-[38%] h-[24%] w-[3px] rounded-full bg-gradient-to-b from-[#e5e9ee] to-[#8e96a2]" />
          </motion.div>

          {/* A Coca-Cola is taken while the door is open */}
          {play && (
            <motion.span
              aria-hidden
              className="absolute left-[10%] top-[55%] z-10 block w-[20%]"
              animate={{ x: ["0%", "0%", "0%", "140%", "140%", "140%"], y: ["0%", "0%", "-20%", "-60%", "-60%", "-60%"], opacity: [0, 0, 1, 1, 0, 0], scale: [1, 1, 1.15, 1.3, 1.3, 1] }}
              transition={{ duration: LOOP, times: [0, 0.38, 0.45, 0.6, 0.72, 1], repeat: Infinity, ease: "easeOut" }}
            >
              <span className="relative block aspect-square rounded-xl bg-white p-[8%] shadow-[0_10px_24px_-6px_rgba(0,0,0,0.5)]">
                <ProductVisual product={cola} className="size-full" sizes="64px" />
              </span>
            </motion.span>
          )}

          {/* Vent grille */}
          <div className="mt-[4%] flex h-[10%] flex-col justify-center gap-[10%] rounded-b-[14px] bg-[#16181d] px-[10%]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-[8%] rounded-full bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.06)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
