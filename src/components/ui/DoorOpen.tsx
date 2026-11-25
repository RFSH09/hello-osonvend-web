"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/** The signature "door open" animation: a fridge door swings open revealing green light. */
export function DoorOpen({ open }: { open: boolean }) {
  return (
    <div className="relative mx-auto h-56 w-40" style={{ perspective: 800 }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-2xl bg-accent"
        animate={{ opacity: open ? 1 : 0.15, scale: open ? 1 : 0.96 }}
        transition={{ duration: 0.25 }}
      >
        <Check size={56} className="text-navy" aria-hidden />
      </motion.div>
      <motion.div
        className="absolute inset-0 origin-left rounded-2xl border-4 border-navy bg-navy"
        animate={{ rotateY: open ? -105 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="absolute right-3 top-1/2 h-16 w-1.5 -translate-y-1/2 rounded-full bg-accent" />
      </motion.div>
    </div>
  );
}
