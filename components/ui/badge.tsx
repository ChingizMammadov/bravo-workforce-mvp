import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ghost";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-fg/10 text-fg/80 border-fg/10",
  brand: "bg-brand-500/20 text-brand-200 border-brand-500/30",
  success: "bg-accent-teal/15 text-accent-teal border-accent-teal/30",
  warning: "bg-accent-amber/15 text-accent-amber border-accent-amber/30",
  danger: "bg-accent-red/15 text-accent-red border-accent-red/30",
  info: "bg-accent-blue/15 text-accent-blue border-accent-blue/30",
  ghost: "bg-transparent text-fg/60 border-fg/10",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5",
        "text-[11px] font-medium uppercase tracking-wide",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
