"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Flame, AlertCircle, Clock } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput, Select } from "@/components/ui/form";
import {
  recommendTasks,
  TaskItem,
  RiskLevel,
  DEPARTMENTS,
} from "@/lib/calculators";

const LEVELS: RiskLevel[] = ["Low", "Medium", "High"];

const PRIO = {
  HIGH: { variant: "danger" as const, icon: Flame },
  MEDIUM: { variant: "warning" as const, icon: AlertCircle },
  LOW: { variant: "info" as const, icon: Clock },
};

export default function TaskEnginePage() {
  const [form, setForm] = useState({
    department: "Bakery",
    wasteRisk: "High" as RiskLevel,
    fifoScore: "Low" as RiskLevel,
    daysToExpiry: 1,
    productType: "bread",
  });
  const [tasks, setTasks] = useState<TaskItem[] | null>(null);

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const run = () => setTasks(recommendTasks(form));

  return (
    <PageShell
      title="Task Recommendation Engine"
      subtitle="Turn analytics into prioritized employee actions"
    >
      <SectionHeader
        eyebrow="Execution"
        aiTagged
        title="From signals to a shift checklist"
        description="Risk, FIFO band, expiry window and department type combine into 4–6 prioritized operational missions."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Department">
              <Select
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Waste risk">
                <Select
                  value={form.wasteRisk}
                  onChange={(e) => set("wasteRisk", e.target.value)}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="FIFO score">
                <Select
                  value={form.fifoScore}
                  onChange={(e) => set("fifoScore", e.target.value)}
                >
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Days to expiry">
                <NumberInput
                  value={form.daysToExpiry}
                  onChange={(e) => set("daysToExpiry", +e.target.value)}
                />
              </Field>
              <Field label="Product type">
                <TextInput
                  value={form.productType}
                  onChange={(e) => set("productType", e.target.value)}
                />
              </Field>
            </div>
            <Button onClick={run} className="w-full">
              <ClipboardList size={16} /> Generate Tasks
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recommended missions</CardTitle>
          </CardHeader>
          <CardContent>
            {!tasks ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Press “Generate Tasks” to build <br /> the action list.
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((t, i) => {
                  const meta = PRIO[t.priority];
                  const Icon = meta.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-xl border border-bg-border bg-bg-soft/50 p-4 dark:bg-bg-card/30"
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          t.priority === "HIGH"
                            ? "bg-accent-red/15 text-accent-red"
                            : t.priority === "MEDIUM"
                            ? "bg-accent-amber/15 text-accent-amber"
                            : "bg-accent-blue/15 text-accent-blue"
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <p className="flex-1 text-sm text-fg/85">{t.text}</p>
                      <Badge variant={meta.variant}>{t.priority}</Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
