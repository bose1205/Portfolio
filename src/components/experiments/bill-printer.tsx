"use client";

import { useEffect } from "react";
import { useAnimate } from "motion/react";

const BILL_W = 227;
const BILL_H = 276;
const PRINT_S = 2.4;
const HOLD_MS = 2600;
const PRINT_EASE = [0.37, 0, 0.2, 1] as const;

// Full design is 263x296; scaled to sit inside the card stage.
const SCALE = 0.78;

/** Receipt sliding out of a printer slot, on a loop (Figma node 155:1955). */
export function BillPrinter() {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    (async () => {
      while (!cancelled) {
        // Reset: bill fully inside the machine, behind the slot line.
        await animate("[data-bill]", { y: -BILL_H, opacity: 1 }, { duration: 0 });
        await animate("[data-shadow]", { opacity: 1 }, { duration: 0 });

        // Print: the bill slides out; the slot shadow eases off as the bill clears the opening.
        await Promise.all([
          animate("[data-bill]", { y: 0 }, { duration: PRINT_S, ease: PRINT_EASE }),
          animate("[data-shadow]", { opacity: [1, 1, 0] }, { duration: PRINT_S, times: [0, 0.6, 1], ease: "linear" }),
        ]);
        if (cancelled) return;
        await sleep(HOLD_MS);
        if (cancelled) return;

        // Tear off: drop away and fade, then print the next one.
        await animate("[data-bill]", { y: 24, opacity: 0 }, { duration: 0.5, ease: "easeIn" });
        await sleep(500);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [animate]);

  return (
    <div ref={scope} className="relative h-[296px] w-[263px] shrink-0" style={{ transform: `scale(${SCALE})` }}>
      {/* Machine slot */}
      <div className="absolute top-0 left-0 h-9 w-[263px] overflow-clip rounded-lg bg-gradient-to-b from-[#ccccc6] via-[#e1e1d2] to-[#cdcdc6]">
        <div className="absolute top-1/2 left-1/2 h-8 w-[259px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gradient-to-b from-[#cfcfc5] via-[#d7d7c4] to-[#cfcfc5]" />
        <div
          className="absolute top-1/2 left-1/2 h-5 w-[247px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-cover"
          style={{ backgroundImage: "url(/bill/slot-texture.png)" }}
        />
        <div className="absolute top-1/2 left-1/2 h-4 w-[239px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#141412]" />
      </div>

      {/* Window the bill slides through: its top edge is the slot's centre line */}
      <div className="absolute top-5 left-[18px] overflow-hidden" style={{ width: BILL_W, height: BILL_H }}>
        <div
          data-bill
          className="absolute inset-0 bg-white"
          style={{ transform: `translateY(${-BILL_H}px)` }}
        >
          <p className="absolute inset-x-0 top-4 text-center font-mono text-[10px] leading-[normal] text-[#6d6d66]">
            PLEASE VISIT US AGAIN!
          </p>

          <p className="absolute top-[52px] left-3 text-base leading-[normal] font-semibold text-black">Total</p>
          <p className="absolute top-[52px] right-3 leading-[normal] font-semibold text-black">
            <span className="text-base">$25.</span>
            <span className="text-[11px] font-normal">00</span>
          </p>

          {[
            ["Cheeseburger (x1)", "$9.00", 79],
            ["Latte (x3)", "$15.00", 99],
            ["Caramel extra (x1)", "$1.00", 119],
          ].map(([item, price, top]) => (
            <div
              key={item}
              className="absolute right-3 left-3 flex justify-between text-xs leading-[normal] text-[#6d6d66]"
              style={{ top: top as number }}
            >
              <span>{item}</span>
              <span>{price}</span>
            </div>
          ))}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" src="/bill/line.svg" className="absolute top-[150px] left-3 block w-[203px]" />

          <p className="absolute top-[166px] left-3 w-[203px] text-[10px] leading-[normal] text-[#b2b2a9]">
            This receipt is a record of The Brewing Co. being of service to you as our delighted customer.
          </p>

          {/* Barcodes (two crops of the same image, as in Figma) */}
          <div className="absolute bottom-3 left-3 h-[35px] w-[115px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src="/bill/barcode.png"
              className="absolute max-w-none"
              style={{ height: "386.36%", left: "-8.62%", top: "-143.18%", width: "117.24%" }}
            />
          </div>
          <div className="absolute bottom-3 left-[124px] h-[35px] w-[91px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              src="/bill/barcode.png"
              className="absolute max-w-none"
              style={{ height: "386.36%", left: "-10.89%", top: "-143.18%", width: "148.16%" }}
            />
          </div>
        </div>

        {/* Shadow cast by the slot's lower lip onto the bill as it comes out */}
        <div
          data-shadow
          className="pointer-events-none absolute inset-x-0 top-0 h-[22px]"
          style={{ background: "linear-gradient(to bottom, rgba(20,20,18,0.3), rgba(20,20,18,0))" }}
        />
      </div>
    </div>
  );
}
