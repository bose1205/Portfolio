"use client";

import { useState } from "react";
import { motion } from "motion/react";

export function Toggle() {
  const [on, setOn] = useState(false);
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className="relative h-8 w-14 cursor-pointer rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-black/30"
      style={{ justifyContent: on ? "flex-end" : "flex-start", display: "flex" }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{ backgroundColor: on ? "#111111" : "#e4e4df" }}
        transition={{ duration: 0.25 }}
      />
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        whileTap={{ width: 28 }}
        className="relative h-6 w-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
      />
    </button>
  );
}
