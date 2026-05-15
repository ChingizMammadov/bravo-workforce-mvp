"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ListChecks,
  Flame,
  AlertCircle,
  Clock,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Selector } from "@/components/selector";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateMissions } from "@/lib/ai-engine";
import { branches, Priority } from "@/lib/data";

const PRIORITY_META: Record<
  Priority,
  { variant: "danger" | "warning" | "info" | "success"; label: string; icon: typeof Flame }
> = {
  high: { variant: "danger", label: "High priority", icon: Flame },
  medium: { variant: "warning", label: "Medium priority", icon: AlertCircle },
  low: { variant: "info", label: "Low priority", icon: Clock },
  completed: { variant: "success", label: "Completed", icon: CheckCircle2 },
};

type Filter = "all" | Priority;

export default function MissionsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const missions = useMemo(() => generateMissions(16), []);

  const counts = {
    high: missions.filter((m) => m.priority === "high").length,
    medium: missions.filter((m) => m.priority === "medium").length,
    low: missions.filter((m) => m.priority === "low").length,
    completed: missions.filter((m) => m.priority === "completed").length,
  };

  const visible =
    filter === "all"
      ? missions
      : missions.filter((m) => m.priority === filter);

  return (
    <PageShell
      title="AI Daily Operational Missions"
      subtitle="Prioritized, department-specific actions ranked by urgency"
    >
      <SectionHeader
        eyebrow="Execution"
        aiTagged
        title="The work that matters most, right now"
        description="The AI ranks every operational action by spoilage urgency, inventory value and expiry proximity — so teams always know what to do next."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { k: "High priority", v: counts.high, tone: "text-accent-red", icon: Flame },
          { k: "Medium priority", v: counts.medium, tone: "text-accent-amber", icon: AlertCircle },
          { k: "Low priority", v: counts.low, tone: "text-accent-blue", icon: Clock },
          { k: "Completed today", v: counts.completed, tone: "text-accent-teal", icon: CheckCircle2 },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.k} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-fg/5">
                <Icon size={18} className={s.tone} />
              </span>
              <div>
                <p className="text-xl font-semibold text-fg">{s.v}</p>
                <p className="text-[11px] uppercase tracking-wider text-fg/45">
                  {s.k}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <Selector
          label="Filter"
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
          options={[
            { value: "all", label: "All missions" },
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
            { value: "completed", label: "Completed" },
          ]}
        />
      </div>

      <div className="mt-5 space-y-3">
        {visible.map((m, i) => {
          const meta = PRIORITY_META[m.priority];
          const Icon = meta.icon;
          const branch = branches.find((b) => b.id === m.branchId);
          const done = m.priority === "completed";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <Card
                className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-center ${
                  done ? "opacity-70" : ""
                }`}
              >
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                    m.priority === "high"
                      ? "bg-accent-red/15 text-accent-red"
                      : m.priority === "medium"
                      ? "bg-accent-amber/15 text-accent-amber"
                      : m.priority === "low"
                      ? "bg-accent-blue/15 text-accent-blue"
                      : "bg-accent-teal/15 text-accent-teal"
                  }`}
                >
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium text-fg ${
                      done ? "line-through decoration-fg/30" : ""
                    }`}
                  >
                    {m.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg/50">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} />
                      {branch?.name ?? m.branchId} · {m.category}
                    </span>
                    <span>{m.details}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge variant={meta.variant}>
                    <Icon size={10} /> {meta.label}
                  </Badge>
                  <span className="w-14 text-right text-xs font-semibold text-fg/60">
                    {m.dueIn}
                  </span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}
