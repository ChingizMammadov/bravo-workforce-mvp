import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-grad-brand text-white shadow-glow hover:opacity-95 active:opacity-90",
  secondary:
    "bg-fg/10 text-fg hover:bg-fg/15 border border-fg/10",
  ghost: "text-fg/80 hover:bg-fg/5",
  outline:
    "border border-fg/20 text-fg hover:bg-fg/10 hover:border-fg/30",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400/40",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
