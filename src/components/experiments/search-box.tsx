"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";

const WORDS = ["cosmetics", "keychains", "monsters"];
const CYCLE_MS = 3000;
const SWAP_S = 0.2; // fade out, then fade in
const EXPAND_S = 0.5;
const CLEAR_S = 0.2;
const CLEAR_SHIFT = 10;
const EASE = [0.4, 0, 0.2, 1] as const;

const PILL_W = 190;
const STAGE_PADDING = 16;

type Mode = "idle" | "editing" | "searched";

/** Placeholder text: "Search ‘word’" with a gradient sweeping across the quoted part. */
function Placeholder() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Cycle: the whole ‘word’ (quotes included) fades out, is swapped while hidden, then fades in.
  useEffect(() => {
    let swap: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % WORDS.length);
        setVisible(true);
      }, SWAP_S * 1000);
    }, CYCLE_MS);
    return () => {
      clearInterval(id);
      clearTimeout(swap);
    };
  }, []);

  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <span>Search</span>
      {/* opacity and the gradient clip live on the same element so the clip keeps working */}
      <motion.span
        className="sg-text"
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: SWAP_S, ease: "easeInOut" }}
      >
        ‘{WORDS[index]}’
      </motion.span>
    </span>
  );
}

export function SearchBox() {
  const [mode, setMode] = useState<Mode>("idle");
  const [value, setValue] = useState("");
  // Clearing: the old text swipes down and out while the placeholder slides down into place.
  const [ghost, setGhost] = useState<{ id: number; text: string } | null>(null);
  const [clearCount, setClearCount] = useState(0);
  const [stageW, setStageW] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    // offsetWidth of the stage frame (border included) so 16px padding matches the design
    const frame = el.parentElement ?? el;
    const update = () => setStageW(frame.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  const expanded = mode !== "idle";
  const editing = mode === "editing";
  const searched = mode === "searched";
  const width = expanded && stageW ? Math.max(stageW - STAGE_PADDING * 2, PILL_W) : PILL_W;

  function open() {
    if (mode === "editing") return;
    setMode("editing");
    input.current?.focus();
  }

  return (
    <div ref={stage} className="flex h-full w-full items-center justify-center">
      <motion.div
        onClick={open}
        initial={false}
        animate={{ width }}
        transition={{ duration: EXPAND_S, ease: EASE }}
        className={`relative box-border h-[42px] shrink-0 cursor-text overflow-hidden rounded-[35px] border-[0.5px] border-[#e4e4e4] shadow-[0_1px_1px_rgba(0,0,0,0.08)] transition-colors duration-150 ${
          expanded ? "bg-[#fdfdfb]" : "cursor-pointer bg-[#fdfdfb] hover:bg-[#f4f4ef]"
        }`}
      >
        {/* Search icon: only in the collapsed pill */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted"
        >
          <Search size={16} strokeWidth={1.5} />
        </motion.span>

        {/* Placeholder slides left into the caret position while the pill expands */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: expanded ? 2 : 24, opacity: value === "" && !searched ? 1 : 0 }}
          transition={{
            x: { duration: EXPAND_S, ease: EASE },
            opacity: { duration: 0.15 },
          }}
          className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm leading-[normal] text-muted"
        >
          <motion.div
            key={clearCount}
            initial={clearCount ? { y: -CLEAR_SHIFT, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: CLEAR_S, ease: "easeOut" }}
          >
            <Placeholder />
          </motion.div>
        </motion.div>

        {/* The real input. Invisible click target while collapsed. */}
        <motion.input
          ref={input}
          aria-label="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => mode === "idle" && setMode("editing")}
          onBlur={() => {
            if (value.trim() === "") {
              setValue("");
              setMode("idle");
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              setMode("searched");
              input.current?.blur();
            }
            if (e.key === "Escape") input.current?.blur();
          }}
          autoComplete="off"
          spellCheck={false}
          initial={false}
          animate={{ opacity: editing ? 1 : 0 }}
          transition={{ duration: editing ? 0.15 : mode === "idle" ? 0 : 0.15 }}
          style={expanded ? { left: 12, right: 37 } : { left: 0, right: 0 }}
          className={`absolute inset-y-0 bg-transparent text-sm text-foreground caret-[#2f2f2c] outline-none ${
            searched ? "pointer-events-none" : ""
          } ${expanded ? "" : "cursor-pointer"}`}
        />

        {/* Text that was just cleared, swiping down and out */}
        {ghost && (
          <motion.span
            key={ghost.id}
            aria-hidden
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: CLEAR_SHIFT, opacity: 0 }}
            transition={{ duration: CLEAR_S, ease: "easeIn" }}
            onAnimationComplete={() => setGhost(null)}
            className="pointer-events-none absolute inset-y-0 right-[37px] left-3 flex items-center overflow-hidden text-sm leading-[normal] whitespace-nowrap text-foreground"
          >
            {ghost.text}
          </motion.span>
        )}

        {/* Clear button */}
        <motion.button
          type="button"
          aria-label="Clear"
          tabIndex={editing && value ? 0 : -1}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            setGhost({ id: Date.now(), text: value });
            setClearCount((c) => c + 1);
            setValue("");
            input.current?.focus();
          }}
          initial={false}
          animate={{ opacity: editing && value ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className={`group absolute top-1/2 right-[13px] flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#e5e5e5] text-muted outline-none transition-colors hover:bg-[#dadada] hover:text-foreground ${
            editing && value ? "" : "pointer-events-none"
          }`}
        >
          <X size={12} strokeWidth={1.5} />
        </motion.button>

        {/* After-search state */}
        <motion.div
          initial={false}
          animate={{ opacity: searched ? 1 : 0 }}
          transition={searched ? { duration: 0.15, delay: 0.2 } : { duration: 0.15 }}
          className="pointer-events-none absolute inset-y-0 right-[13px] left-3 flex items-center gap-2 text-sm leading-[normal] text-foreground"
        >
          <span className="flex shrink-0 text-muted">
            <Search size={16} strokeWidth={1.5} />
          </span>
          <span className="min-w-0 overflow-hidden whitespace-nowrap">{value}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
