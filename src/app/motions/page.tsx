import type { Metadata } from "next";
import { ExperimentCard } from "@/components/experiment-card";
import { experiments } from "@/lib/experiments";

export const metadata: Metadata = {
  title: "Motions — Anurag Bose",
  description: "A collection of micro-animations and UI experiments.",
};

export default function MotionsPage() {
  return (
    <main className="mx-auto w-full max-w-[1512px] px-10 pt-20 pb-24">
      <h1 className="mb-10 text-center text-[28px] leading-[34px] font-medium text-foreground">Experiments</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {experiments.map((e) => (
          <ExperimentCard key={e.id} {...e} />
        ))}
      </div>
    </main>
  );
}
