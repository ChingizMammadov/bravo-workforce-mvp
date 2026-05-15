"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const baseControl =
  "w-full rounded-xl border border-bg-border bg-bg-soft px-3.5 py-2.5 text-sm text-fg " +
  "placeholder:text-fg/35 outline-none transition-colors " +
  "focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 " +
  "dark:bg-bg-card/60";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-fg/55">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-fg/40">{hint}</span>}
    </label>
  );
}

export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(baseControl, className)} {...props} />
));
TextInput.displayName = "TextInput";

export const NumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="number"
    inputMode="decimal"
    className={cn(baseControl, className)}
    {...props}
  />
));
NumberInput.displayName = "NumberInput";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(baseControl, "appearance-none", className)} {...props}>
      {children}
    </select>
  );
}
