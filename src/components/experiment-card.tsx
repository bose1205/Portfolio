import type { Experiment } from "@/lib/experiments";

export function ExperimentCard({ title, description, Demo }: Experiment) {
  return (
    <article className="flex flex-col gap-4 overflow-clip rounded-3xl border border-card-border bg-card px-3 pt-3 pb-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
      <div className="flex h-[250px] items-center justify-center rounded-2xl border border-stage-border bg-stage">
        {Demo && <Demo />}
      </div>
      <div className="flex flex-col gap-1.5 px-2 text-sm leading-[normal]">
        <h2 className="font-medium text-foreground">{title}</h2>
        <p className="text-muted">{description}</p>
      </div>
    </article>
  );
}
