"use client";

import { useEffect, useRef, useState } from "react";

// Names and roles are placeholders (only Emily Carter appears in the Figma file).
const PEOPLE = [
  { name: "Daniel Brooks", role: "Frontend Engineer", src: "/people/p1.png" },
  { name: "Sofia Alvarez", role: "Brand Designer", src: "/people/p2.png" },
  { name: "Emily Carter", role: "Product Designer", src: "/people/p3.png" },
  { name: "Marcus Lee", role: "Motion Designer", src: "/people/p4.png" },
  { name: "Priya Nair", role: "UX Researcher", src: "/people/p5.png" },
  { name: "Jonas Weber", role: "Art Director", src: "/people/p6.png" },
];

const LIFT_MS = 400;
const LIFT_EASE = "cubic-bezier(0.25, 1, 0.5, 1)"; // fast start, soft settle
const DESATURATE_MS = 300;

export function AvatarGroup() {
  const [active, setActive] = useState<number | null>(null);
  const [tip, setTip] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Tooltip pops in (no fade) once the lift has finished.
  function enter(i: number) {
    clearTimeout(timer.current);
    setTip(null);
    setActive(i);
    timer.current = setTimeout(() => setTip(i), LIFT_MS);
  }

  function leave() {
    clearTimeout(timer.current);
    setTip(null);
    setActive(null);
  }

  return (
    <div className="flex items-center" onMouseLeave={leave}>
      {PEOPLE.map((p, i) => {
        const hovered = active === i;
        const dimmed = active !== null && !hovered;
        return (
          // Static hit area so the lifted avatar can't flicker at its bottom edge.
          <span
            key={p.name}
            tabIndex={0}
            aria-label={`${p.name}, ${p.role}`}
            onMouseEnter={() => enter(i)}
            onFocus={() => enter(i)}
            onBlur={leave}
            className={`relative size-6 shrink-0 cursor-pointer rounded-full outline-none ${i < PEOPLE.length - 1 ? "mr-[-4px]" : ""}`}
            style={{ zIndex: hovered ? 10 : undefined }}
          >
            <span
              className="block size-6 rounded-full border-[1.5px] border-stage bg-cover bg-center"
              style={{
                backgroundImage: `url(${p.src})`,
                backgroundClip: "border-box",
                transform: `translateY(${hovered ? -3 : 0}px)`,
                filter: dimmed ? "grayscale(1)" : "grayscale(0)",
                transition: `transform ${LIFT_MS}ms ${LIFT_EASE}, filter ${DESATURATE_MS}ms ease`,
              }}
            />
            {tip === i && (
              <span className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 flex -translate-x-1/2 flex-col items-center">
                <span className="flex w-max flex-col justify-center gap-1 rounded-lg bg-[#1c1c1a] px-3 py-2 leading-[normal] font-medium">
                  <span className="text-xs text-[#fdfdfb]">{p.name}</span>
                  <span className="text-[8px] text-[#d3d3c9] uppercase">{p.role}</span>
                </span>
                <svg width="7" height="4" viewBox="0 0 7 4" fill="none" className="block">
                  <path d="M3.47209 4L0 0H7L3.47209 4Z" fill="#1C1C1A" />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
