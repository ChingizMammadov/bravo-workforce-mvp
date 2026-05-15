"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Gift } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, Select } from "@/components/ui/form";
import { calculateBonus, BonusResult, DEPARTMENTS } from "@/lib/calculators";
import { azn } from "@/lib/utils";

export default function BonusCalculatorPage() {
  const [form, setForm] = useState({
    department: "Meat",
    employees: 8,
    wasteReduction: 90,
    fifoScore: 92,
    taskCompletion: 90,
    salesImprovement: 85,
    crossRank: 2,
  });
  const [result, setResult] = useState<BonusResult | null>(null);

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const run = () => setResult(calculateBonus(form));

  return (
    <PageShell
      title="Bonus Calculator"
      subtitle="Department score → branch pool → per-employee bonus"
    >
      <SectionHeader
        eyebrow="Rewards"
        aiTagged
        title="What does this department earn?"
        description="Combine performance into a capped score, map it to a branch bonus pool, then add the cross-branch rank premium per employee."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
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
              <Field label="Employees">
                <NumberInput
                  value={form.employees}
                  onChange={(e) => set("employees", +e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Waste reduction %">
                <NumberInput
                  value={form.wasteReduction}
                  onChange={(e) => set("wasteReduction", +e.target.value)}
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
              <Field label="Task completion %">
                <NumberInput
                  value={form.taskCompletion}
                  onChange={(e) => set("taskCompletion", +e.target.value)}
                />
              </Field>
              <Field label="Sales improvement %">
                <NumberInput
                  value={form.salesImprovement}
                  onChange={(e) => set("salesImprovement", +e.target.value)}
                />
              </Field>
            </div>
            <Field label="Cross-branch rank">
              <Select
                value={form.crossRank}
                onChange={(e) => set("crossRank", +e.target.value)}
              >
                <option value={1}>#1</option>
                <option value={2}>#2</option>
                <option value={3}>#3</option>
                <option value={4}>#4 or lower</option>
              </Select>
            </Field>
            <Button onClick={run} className="w-full">
              <Calculator size={16} /> Calculate Bonus
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{form.department} department result</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Press “Calculate Bonus” to see <br /> the payout breakdown.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="rounded-xl border border-bg-border bg-bg-soft/60 p-4 dark:bg-bg-card/40">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-fg/45">
                      Department score
                    </p>
                    <Badge
                      variant={
                        result.departmentScore >= 90
                          ? "success"
                          : result.departmentScore >= 70
                          ? "warning"
                          : "danger"
                      }
                    >
                      {result.departmentScore} / 100
                    </Badge>
                  </div>
                  <Progress
                    value={result.departmentScore}
                    tone={
                      result.departmentScore >= 90
                        ? "success"
                        : result.departmentScore >= 70
                        ? "brand"
                        : "danger"
                    }
                    className="mt-3 h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Branch bonus pool" value={azn(result.bonusPool)} />
                  <Stat
                    label="Branch bonus / employee"
                    value={azn(result.branchBonusPerEmployee)}
                  />
                  <Stat
                    label="Cross-branch bonus"
                    value={azn(result.crossBranchBonus)}
                  />
                  <Stat
                    label="Total / employee"
                    value={azn(result.totalBonusPerEmployee)}
                    highlight
                  />
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-bg-border bg-grad-soft p-4 text-sm text-fg/75">
                  <Gift size={15} className="shrink-0 text-brand-300" />
                  Each of the {form.employees} employees earns{" "}
                  <strong className="text-fg">
                    {azn(result.totalBonusPerEmployee)}
                  </strong>{" "}
                  this period.
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-accent-teal/40 bg-accent-teal/10"
          : "border-bg-border bg-bg-soft/50 dark:bg-bg-card/30"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-fg/45">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          highlight ? "text-accent-teal" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
