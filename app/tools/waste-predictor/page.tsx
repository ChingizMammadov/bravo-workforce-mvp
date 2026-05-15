"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, TrendingDown, Lightbulb } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput, Select } from "@/components/ui/form";
import {
  predictWasteRisk,
  WasteRiskResult,
  DEPARTMENTS,
} from "@/lib/calculators";
import { azn } from "@/lib/utils";

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function WastePredictorPage() {
  const [form, setForm] = useState({
    department: "Meat",
    productName: "Chicken breast",
    quantity: 120,
    expiryDate: todayPlus(3),
    avgDailySales: 25,
    unitCost: 12,
  });
  const [result, setResult] = useState<WasteRiskResult | null>(null);

  const set = (k: string, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  const run = () => setResult(predictWasteRisk(form));

  const toneFor = (lvl: string) =>
    lvl === "High" ? "danger" : lvl === "Medium" ? "warning" : "success";

  return (
    <PageShell
      title="Waste Risk Predictor"
      subtitle="Predict how much inventory will expire before it sells"
    >
      <SectionHeader
        eyebrow="Prediction"
        aiTagged
        title="Will this stock sell in time?"
        description="Project expected sell-through against the expiry window to surface unsold quantity, waste risk and the AZN loss it represents."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
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
            <Field label="Product name">
              <TextInput
                value={form.productName}
                onChange={(e) => set("productName", e.target.value)}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity">
                <NumberInput
                  value={form.quantity}
                  onChange={(e) => set("quantity", +e.target.value)}
                />
              </Field>
              <Field label="Unit cost (AZN)">
                <NumberInput
                  value={form.unitCost}
                  onChange={(e) => set("unitCost", +e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Expiry date">
                <TextInput
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => set("expiryDate", e.target.value)}
                />
              </Field>
              <Field label="Avg daily sales">
                <NumberInput
                  value={form.avgDailySales}
                  onChange={(e) => set("avgDailySales", +e.target.value)}
                />
              </Field>
            </div>
            <Button onClick={run} className="w-full">
              <Trash2 size={16} /> Predict Waste Risk
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Enter the details and press <br /> “Predict Waste Risk”.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between rounded-xl border border-bg-border bg-bg-soft/60 p-4 dark:bg-bg-card/40">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-fg/45">
                      Waste risk
                    </p>
                    <p className="mt-1 text-4xl font-semibold text-fg">
                      {result.wasteRiskPercent}%
                    </p>
                  </div>
                  <Badge variant={toneFor(result.riskLevel)}>
                    {result.riskLevel} risk
                  </Badge>
                </div>
                <Progress
                  value={result.wasteRiskPercent}
                  tone={
                    result.riskLevel === "High"
                      ? "danger"
                      : result.riskLevel === "Medium"
                      ? "warning"
                      : "success"
                  }
                  className="h-2"
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric label="Days to expiry" value={`${result.daysToExpiry}`} />
                  <Metric label="Expected sold" value={`${result.expectedSold}`} />
                  <Metric
                    label="Expected unsold"
                    value={`${result.expectedUnsold}`}
                  />
                  <Metric
                    label="Estimated loss"
                    value={azn(result.estimatedLoss)}
                    tone="danger"
                  />
                </div>

                <div className="flex items-start gap-2 rounded-xl border border-bg-border bg-grad-soft p-4">
                  <Lightbulb size={15} className="mt-0.5 shrink-0 text-brand-300" />
                  <div>
                    <p className="text-xs font-medium text-fg">
                      Recommended action
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-fg/70">
                      {result.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger";
}) {
  return (
    <div className="rounded-xl border border-bg-border bg-bg-soft/50 p-3 dark:bg-bg-card/30">
      <p className="text-[11px] uppercase tracking-wider text-fg/45">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          tone === "danger" ? "text-accent-red" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
