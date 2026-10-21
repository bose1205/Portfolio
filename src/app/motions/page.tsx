import type { Metadata } from "next";
import { ExperimentCard } from "@/components/experiment-card";
import { experiments } from "@/lib/experiments";

export const metadata: Metadata = {
  title: "Motions — Anurag Bose",
  description: "A collection of micro-animations and UI experiments.",
};

export default function MotionsPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-4 pt-32 pb-24 sm:px-8">
      <h1 className="mb-14 text-center text-4xl font-medium tracking-tight">Experiments</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {experiments.map((e) => (
          <ExperimentCard key={e.id} {...e} />
        ))}
      </div>
    </main>
  );
}
