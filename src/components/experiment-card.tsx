import type { Experiment } from "@/lib/experiments";

export function ExperimentCard({ title, description, Demo }: Experiment) {
  return (
    <article className="rounded-[28px] border border-card-border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_-12px_rgba(0,0,0,0.06)]">
      <div className="flex aspect-[5/4] items-center justify-center rounded-2xl border border-stage-border bg-stage">
        {Demo && <Demo />}
      </div>
      <div className="px-1 pt-5 pb-1">
        <h2 className="text-[15px] font-medium text-[#222]">{title}</h2>
        <p className="mt-1.5 text-[15px] text-muted">{description}</p>
      </div>
    </article>
  );
}
