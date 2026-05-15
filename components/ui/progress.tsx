import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  tone = "brand",
}: {
  value: number;
  className?: string;
  tone?: "brand" | "success" | "danger" | "warning";
}) {
  const v = Math.max(0, Math.min(100, value));
  const TONES = {
    brand: "bg-grad-brand",
    success: "bg-accent-teal",
    danger: "bg-accent-red",
    warning: "bg-accent-amber",
  };
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-fg/10 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all", TONES[tone])}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
