"use client";

export type Mode = "disabled" | "enabled";

// "Disabled / Enabled" label switcher shown at the top of a card's stage.
export function ModeTabs({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="absolute top-[11px] flex gap-[18px] text-xs leading-[normal]">
      {(["disabled", "enabled"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={`cursor-pointer capitalize outline-none ${mode === m ? "text-foreground" : "text-[#a9a9a3]"}`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
