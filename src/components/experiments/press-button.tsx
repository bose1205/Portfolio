"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type State = "idle" | "loading" | "done";

export function PressButton() {
  const [state, setState] = useState<State>("idle");

  function click() {
    if (state !== "idle") return;
    setState("loading");
    setTimeout(() => setState("done"), 1200);
    setTimeout(() => setState("idle"), 2400);
  }

  return (
    <motion.button
      onClick={click}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="relative flex h-10 min-w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black px-5 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-black/30"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={state}
          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2 }}
        >
          {state === "idle" ? "Save" : state === "loading" ? "Saving…" : "Saved ✓"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
