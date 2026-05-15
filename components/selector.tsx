"use client";

import { cn } from "@/lib/utils";

export function Selector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && (
        <span className="mr-1 text-xs uppercase tracking-wider text-fg/45">
          {label}
        </span>
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "rounded-xl border px-3.5 py-2 text-sm transition-all",
              active
                ? "border-brand-500/40 bg-grad-soft text-fg shadow-soft"
                : "border-bg-border/80 bg-bg-card/50 text-fg/60 hover:text-fg hover:border-fg/20"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
