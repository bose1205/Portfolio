"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const input = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      animate={{ width: open ? 200 : 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="flex h-10 items-center overflow-hidden rounded-full border border-card-border bg-white shadow-sm"
    >
      <button
        aria-label="Search"
        onClick={() => {
          setOpen(true);
          input.current?.focus();
        }}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-muted"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5 14 14" />
        </svg>
      </button>
      <input
        ref={input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => !value && setOpen(false)}
        placeholder="Search"
        tabIndex={open ? 0 : -1}
        className="w-36 bg-transparent pr-3 text-sm outline-none placeholder:text-muted"
      />
    </motion.div>
  );
}
