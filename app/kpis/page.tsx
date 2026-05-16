"use client";

import { useMemo, useState } from "react";
import { Sparkles, Target, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Selector } from "@/components/selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendArea } from "@/components/charts";
import { branches, departments, DepartmentCategory } from "@/lib/data";
import { generateKpis, productivityScore } from "@/lib/ai-engine";

const CATEGORIES: DepartmentCategory[] = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
];

const STATUS_META = {
  "on-track": { variant: "success" as const, icon: CheckCircle2, label: "On track" },
  "at-risk": { variant: "warning" as const, icon: AlertCircle, label: "At risk" },
  "off-track": { variant: "danger" as const, icon: XCircle, label: "Off track" },
};

export default function KpisPage() {
  const [branchId, setBranchId] = useState(branches[0].id);
  const [category, setCategory] = useState<DepartmentCategory>("Meat");

  const dept = useMemo(
    () =>
      departments.find(
        (d) => d.branchId === branchId && d.category === category
      )!,
    [branchId, category]
  );

  const kpis = useMemo(() => generateKpis(dept), [dept]);
  const score = productivityScore(dept);
  const onTrack = kpis.filter((k) => k.status === "on-track").length;

  return (
    <PageShell
      title="AI Dynamic KPI Engine"
      subtitle="Adaptive department goals generated from live operational signals"
    >
      <SectionHeader
        eyebrow="Core innovation"
        aiTagged
        title="Goals that adapt to operational reality"
        description="Instead of static, manually-assigned targets, the AI analyzes spoilage, inventory movement and FIFO behavior to generate measurable, department-specific KPIs."
      />

      <div className="space-y-3">
        <Selector
          label="Branch"
          value={branchId}
          onChange={setBranchId}
          options={branches.map((b) => ({ value: b.id, label: b.name }))}
        />
        <Selector
          label="Department"
          value={category}
          onChange={(v) => setCategory(v as DepartmentCategory)}
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1" glow>
          <CardHeader>
            <Badge variant="brand" className="w-fit">
              <Sparkles size={10} /> AI generated
            </Badge>
            <CardTitle className="mt-3 text-xl">
              {category} · {branches.find((b) => b.id === branchId)!.name}
            </CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Department productivity score
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-semibold text-fg">{score}</span>
              <span className="mb-1 text-sm text-fg/45">/ 100</span>
            </div>
            <Progress
              value={score}
              tone={score >= 80 ? "success" : score >= 65 ? "brand" : "warning"}
              className="mt-4 h-2"
            />
            <div className="mt-4 flex items-center justify-between text-xs text-fg/55">
              <span>{onTrack} of {kpis.length} KPIs on track</span>
              <span>FIFO {dept.fifo}% · Waste {dept.wasteRate}%</span>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-wider text-fg/45">
                7-day productivity trend
              </p>
              <TrendArea data={dept.trend} height={150} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:col-span-2">
          {kpis.map((k, i) => {
            const meta = STATUS_META[k.status];
            const Icon = meta.icon;
            return (
              <motion.div
                key={k.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-grad-soft text-brand-200">
                      <Target size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium text-fg">
                          {k.text}
                        </p>
                        <Badge variant={meta.variant}>
                          <Icon size={10} /> {meta.label}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <Progress
                          value={k.current}
                          tone={
                            k.status === "on-track"
                              ? "success"
                              : k.status === "at-risk"
                              ? "warning"
                              : "danger"
                          }
                        />
                        <span className="shrink-0 text-xs text-fg/55">
                          {k.current}
                          {k.unit} / {k.target}
                          {k.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
