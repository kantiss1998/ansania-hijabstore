import type { ReactNode } from 'react';

export function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display font-bold text-xs uppercase tracking-[0.12em] text-dark mt-8 mb-2 first:mt-0">
        {title}
      </h3>
      <div className="text-sm text-gray-500 font-body leading-relaxed">{children}</div>
    </div>
  );
}

export function InfoSteps({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  return (
    <div className="space-y-6 mt-4">
      {steps.map((step, i) => (
        <div key={step.title} className="flex gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-dark font-display text-xs font-black text-white">
            {i + 1}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-dark mb-1">{step.title}</h3>
            <p className="text-sm text-gray-500 font-body leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
