"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Goal, Sparkles, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, Select } from "@/components/ui/form";
import {
  generateAiGoals,
  GoalPeriod,
  DEPARTMENTS,
} from "@/lib/calculators";

export default function GoalGeneratorPage() {
  const [form, setForm] = useState({
    department: "Meat",
    wasteRate: 12,
    fifoScore: 76,
    salesGrowth: 3,
    taskCompletion: 70,
    period: "Weekly" as GoalPeriod,
  });
  const [goals, setGoals] = useState<string[] | null>(null);

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const run = () => setGoals(generateAiGoals(form));

  return (
    <PageShell
      title="AI Goal Generator"
      subtitle="Convert raw performance data into operational goals"
    >
      <SectionHeader
        eyebrow="Adaptive goals"
        aiTagged
        title="Goals employees can actually act on"
        description="Feed in the department's current metrics and the AI returns 4–6 specific, period-based goals — not vague targets."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current performance</CardTitle>
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
              <Field label="Waste rate %">
                <NumberInput
                  value={form.wasteRate}
                  onChange={(e) => set("wasteRate", +e.target.value)}
                />
              </Field>
              <Field label="FIFO score %">
                <NumberInput
                  value={form.fifoScore}
                  onChange={(e) => set("fifoScore", +e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sales growth %">
                <NumberInput
                  value={form.salesGrowth}
                  onChange={(e) => set("salesGrowth", +e.target.value)}
                />
              </Field>
              <Field label="Task completion %">
                <NumberInput
                  value={form.taskCompletion}
                  onChange={(e) => set("taskCompletion", +e.target.value)}
                />
              </Field>
            </div>
            <Field label="Period">
              <Select
                value={form.period}
                onChange={(e) => set("period", e.target.value)}
              >
                {["Daily", "Weekly", "Monthly"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </Field>
            <Button onClick={run} className="w-full">
              <Goal size={16} /> Generate AI Goals
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI goals — {form.department} department</CardTitle>
            {goals && (
              <Badge variant="brand">
                <Sparkles size={10} /> {form.period}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {!goals ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Press “Generate AI Goals” to build <br /> this department’s plan.
              </div>
            ) : (
              <ol className="space-y-3">
                {goals.map((g, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-bg-border bg-bg-soft/50 p-4 dark:bg-bg-card/30"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-grad-soft text-xs font-semibold text-brand-300">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-fg/85">{g}</p>
                    <CheckCircle2
                      size={16}
                      className="ml-auto mt-0.5 shrink-0 text-fg/20"
                    />
                  </motion.li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
