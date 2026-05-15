"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NumberInput } from "@/components/ui/form";
import { simulateRoi, RoiResult } from "@/lib/calculators";
import { azn } from "@/lib/utils";

export default function RoiSimulatorPage() {
  const [form, setForm] = useState({
    monthlyWasteQuantity: 12000,
    avgProductCost: 15,
    wasteReductionPercent: 10,
    employeeBonusCost: 4000,
    employees: 20,
  });
  const [result, setResult] = useState<RoiResult | null>(null);

  const set = (k: string, v: number) => setForm((f) => ({ ...f, [k]: v }));
  const run = () => setResult(simulateRoi(form));

  return (
    <PageShell
      title="What-If ROI Simulator"
      subtitle="Model the financial value of the platform"
    >
      <SectionHeader
        eyebrow="Business case"
        aiTagged
        title="Is the bonus spend worth it?"
        description="Compare current waste cost against projected savings and the bonus investment to get a clear net benefit and ROI."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assumptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Monthly waste quantity" hint="units / kg per month">
              <NumberInput
                value={form.monthlyWasteQuantity}
                onChange={(e) =>
                  set("monthlyWasteQuantity", +e.target.value)
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Avg product cost">
                <NumberInput
                  value={form.avgProductCost}
                  onChange={(e) => set("avgProductCost", +e.target.value)}
                />
              </Field>
              <Field label="Waste reduction %">
                <NumberInput
                  value={form.wasteReductionPercent}
                  onChange={(e) =>
                    set("wasteReductionPercent", +e.target.value)
                  }
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Bonus cost (AZN)" hint="total monthly">
                <NumberInput
                  value={form.employeeBonusCost}
                  onChange={(e) =>
                    set("employeeBonusCost", +e.target.value)
                  }
                />
              </Field>
              <Field label="Employees">
                <NumberInput
                  value={form.employees}
                  onChange={(e) => set("employees", +e.target.value)}
                />
              </Field>
            </div>
            <Button onClick={run} className="w-full">
              <LineChart size={16} /> Simulate Impact
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Projected impact (monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Press “Simulate Impact” to model <br /> the business case.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between rounded-xl border border-accent-teal/30 bg-accent-teal/10 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-fg/45">
                      Return on investment
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-accent-teal">
                      {result.roiPercent}%
                    </p>
                  </div>
                  <Badge variant={result.roiPercent >= 0 ? "success" : "danger"}>
                    <TrendingUp size={10} />{" "}
                    {azn(result.netBenefit)} net
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Stat
                    label="Current waste cost"
                    value={azn(result.currentWasteCost)}
                    tone="danger"
                  />
                  <Stat
                    label="Expected savings"
                    value={azn(result.expectedSavings)}
                    tone="good"
                  />
                  <Stat
                    label="Employee bonus cost"
                    value={azn(result.employeeBonusCost)}
                  />
                  <Stat
                    label="Bonus / employee"
                    value={azn(result.bonusPerEmployee)}
                  />
                </div>

                <div className="rounded-xl border border-bg-border bg-grad-soft p-4 text-sm text-fg/75">
                  Spending{" "}
                  <strong className="text-fg">
                    {azn(result.employeeBonusCost)}
                  </strong>{" "}
                  on bonuses returns{" "}
                  <strong className="text-fg">
                    {azn(result.expectedSavings)}
                  </strong>{" "}
                  in avoided waste — a net benefit of{" "}
                  <strong className="text-accent-teal">
                    {azn(result.netBenefit)}
                  </strong>
                  .
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
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "good" | "danger";
}) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-soft/50 p-4 dark:bg-bg-card/30">
      <p className="text-[11px] uppercase tracking-wider text-fg/45">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          tone === "good"
            ? "text-accent-teal"
            : tone === "danger"
            ? "text-accent-red"
            : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
