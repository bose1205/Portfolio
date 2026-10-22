"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Check, LoaderCircle, Upload } from "lucide-react";
import { ModeTabs, type Mode } from "./mode-tabs";

type Phase = "idle" | "pressed" | "loading" | "success";
// How the label swaps for the transition currently in flight.
type Kind = "fade" | "instant" | "up" | "down";

const PRESS_MS = 300;
const LOADING_MS = 2500;
const SUCCESS_MS = 1500;

const label = {
  idle: { icon: <Upload size={16} strokeWidth={1.5} />, text: "Upload" },
  loading: { icon: null, text: "Uploading..." },
  success: { icon: <Check size={16} strokeWidth={1.5} />, text: "Uploaded" },
} as const;

const SWIPE = 12;
const SWIPE_MS = 0.45;
const SWIPE_EASE = [0.4, 0, 0.2, 1] as const;
const hidden = (y: number) => ({ y, opacity: 0, filter: "blur(3px)" });
const shown = { y: 0, opacity: 1, filter: "blur(0px)" };

const content: Variants = {
  initial: (k: Kind) => (k === "up" ? hidden(SWIPE) : k === "down" ? hidden(-SWIPE) : shown),
  animate: (k: Kind) => ({ ...shown, transition: k === "up" || k === "down" ? { duration: SWIPE_MS, ease: SWIPE_EASE } : { duration: 0 } }),
  exit: (k: Kind) =>
    k === "up"
      ? { ...hidden(-SWIPE), transition: { duration: SWIPE_MS, ease: SWIPE_EASE } }
      : k === "down"
        ? { ...hidden(SWIPE), transition: { duration: SWIPE_MS, ease: SWIPE_EASE } }
        : { opacity: 0, transition: { duration: 0.1 } },
};

function Shimmer() {
  // Blurred glow from Figma (node 60:357), clipped by the button.
  return (
    <motion.svg
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeIn" }}
      className="pointer-events-none absolute"
      style={{ left: -28, top: -60, filter: "blur(18.5px)" }}
      width="208.5"
      height="103"
      viewBox="0 0 208.5 103"
      overflow="visible"
    >
      <path
        d="M42 66L45 56L37 37L160 42L171.5 58L160 62.5L142 58L127 66L105 58L90.5 62.5L82 58L68 66L53 62.5L42 66Z"
        fill="#ECECD3"
      />
    </motion.svg>
  );
}

export function UploadButton() {
  const [mode, setMode] = useState<Mode>("enabled");
  const [phase, setPhase] = useState<Phase>("idle");
  const [kind, setKind] = useState<Kind>("fade");
  const [hovered, setHovered] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const disabled = mode === "disabled";
  const idle = phase === "idle";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  function go(next: Phase, k: Kind) {
    setKind(k);
    setPhase(next);
  }

  function changeMode(next: Mode) {
    clearTimers();
    setKind("instant");
    setPhase("idle");
    setMode(next);
  }

  function click() {
    if (!idle || disabled) return;
    go("pressed", "fade");
    timers.current = [
      setTimeout(() => go("loading", "instant"), PRESS_MS),
      setTimeout(() => go("success", "up"), PRESS_MS + LOADING_MS),
      setTimeout(() => go("idle", "down"), PRESS_MS + LOADING_MS + SUCCESS_MS),
    ];
  }

  const current = phase === "pressed" ? null : label[phase];

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <ModeTabs mode={mode} onChange={changeMode} />
      <div className="relative">
        <motion.button
          disabled={disabled}
          onClick={click}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          animate={{ y: hovered && idle && !disabled ? -1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`relative flex h-[49px] w-[154px] items-center justify-center overflow-hidden rounded-[35px] pr-7 pl-6 text-sm font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
            disabled ? "cursor-default bg-[#bfbfbf]" : "cursor-pointer bg-[#1c1c1a]"
          }`}
        >
          <AnimatePresence>{hovered && idle && !disabled && <Shimmer key="shimmer" />}</AnimatePresence>
          <AnimatePresence initial={false} custom={kind} mode="popLayout">
            {current && (
              <motion.span
                key={phase}
                custom={kind}
                variants={content}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative flex items-center gap-2"
              >
                {phase === "loading" ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                    className="flex"
                  >
                    <LoaderCircle size={16} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  current.icon
                )}
                {current.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <p className="absolute top-full left-1/2 mt-2 -translate-x-1/2 text-xs leading-[normal] whitespace-nowrap text-muted">
          PDF | Max size: 1MB
        </p>
      </div>
    </div>
  );
}
