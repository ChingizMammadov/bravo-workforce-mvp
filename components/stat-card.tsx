"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "brand",
  index = 0,
}: {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean };
  icon: LucideIcon;
  tone?: "brand" | "success" | "danger" | "warning" | "info";
  index?: number;
}) {
  const TONES = {
    brand: "from-brand-500/30 to-accent-pink/10 text-brand-200",
    success: "from-accent-teal/30 to-accent-blue/10 text-accent-teal",
    danger: "from-accent-red/30 to-accent-pink/10 text-accent-red",
    warning: "from-accent-amber/30 to-accent-pink/10 text-accent-amber",
    info: "from-accent-blue/30 to-brand-500/10 text-accent-blue",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="relative overflow-hidden p-5">
        <div className={cn("absolute inset-0 opacity-60 bg-gradient-to-br", TONES[tone])} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-fg/60">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-fg">{value}</p>
            {delta && (
              <p
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-xs",
                  delta.positive ? "text-accent-teal" : "text-accent-red"
                )}
              >
                {delta.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {delta.value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              "bg-fg/10 border border-fg/10 backdrop-blur"
            )}
          >
            <Icon size={18} className="text-fg" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
