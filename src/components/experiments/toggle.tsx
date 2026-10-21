"use client";

import { useState } from "react";

type Variant = "pill" | "rect";

// Geometry and colours from Figma "Microanimations-UI" (node 26:201).
const SHAPE = {
  pill: { track: "h-4 rounded-full", thumb: "h-3 w-4 rounded-full", travel: 12, offsetY: 0 },
  rect: { track: "h-[14px] rounded-[4px]", thumb: "h-2.5 w-3 rounded-[2px]", travel: 16, offsetY: -1 },
} as const;

// Only transform + opacity are animated so everything stays on the compositor.
// Ease-out (fast start, soft landing).
const DURATION = 250;
const EASE = "cubic-bezier(0.33, 1, 0.68, 1)";

function ToggleSwitch({
  variant,
  checked,
  disabled,
  onChange,
}: {
  variant: Variant;
  checked: boolean;
  disabled: boolean;
  onChange: (next: boolean) => void;
}) {
  const s = SHAPE[variant];
  const on = checked && !disabled;
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="flex size-10 cursor-pointer items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#2454ff]/40 disabled:cursor-default"
    >
      <span
        className={`flex w-8 items-center px-0.5 ${s.track}`}
        style={{
          backgroundColor: disabled ? "#ebebeb" : on ? "#2454ff" : "#e0e0e0",
          transform: `translateY(${s.offsetY}px)`,
          // colour changes instantly; only the thumb animates
          transition: "none",
        }}
      >
        <span
          className={`relative ${s.thumb}`}
          style={{
            backgroundColor: disabled ? "#cacaca" : "#ffffff",
            transform: `translate3d(${on ? s.travel : 0}px, 0, 0)`,
            transition: `transform ${DURATION}ms ${EASE}`,
            willChange: "transform",
          }}
        >
          {/* Shadow flips side as the thumb crosses over; cross-faded with opacity instead of animating box-shadow. */}
          <span
            className="absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow: "1px 0 2px rgba(0,0,0,0.08)",
              opacity: disabled || on ? 0 : 1,
              transition: `opacity ${DURATION}ms ${EASE}`,
            }}
          />
          <span
            className="absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow: "-1px 0 2px rgba(0,0,0,0.08)",
              opacity: !disabled && on ? 1 : 0,
              transition: `opacity ${DURATION}ms ${EASE}`,
            }}
          />
        </span>
      </span>
    </button>
  );
}

export function Toggle() {
  const [mode, setMode] = useState<"disabled" | "enabled">("enabled");
  const [checked, setChecked] = useState<Record<Variant, boolean>>({ pill: false, rect: false });
  const disabled = mode === "disabled";

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-[23px]">
      <div className="absolute top-[11px] flex gap-[18px] text-xs leading-[normal]">
        {(["disabled", "enabled"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`cursor-pointer capitalize outline-none ${mode === m ? "text-foreground" : "text-[#a9a9a3]"}`}
          >
            {m}
          </button>
        ))}
      </div>
      {(["pill", "rect"] as const).map((v) => (
        <ToggleSwitch
          key={v}
          variant={v}
          checked={checked[v]}
          disabled={disabled}
          onChange={(next) => setChecked((c) => ({ ...c, [v]: next }))}
        />
      ))}
    </div>
  );
}
