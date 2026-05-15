"use client";

import { useMemo, useState } from "react";
import { Activity, Gauge, TrendingUp, Boxes } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Selector } from "@/components/selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RankedBars, TrendArea } from "@/components/charts";
import { branches, departments, DepartmentCategory } from "@/lib/data";
import { productivityScore } from "@/lib/ai-engine";

const CATEGORIES: DepartmentCategory[] = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
];

const FACTORS = [
  { key: "Waste reduction", weight: 0.3, tone: "success" as const },
  { key: "FIFO compliance", weight: 0.25, tone: "brand" as const },
  { key: "Inventory turnover", weight: 0.2, tone: "brand" as const },
  { key: "Task efficiency", weight: 0.15, tone: "warning" as const },
  { key: "Sales growth", weight: 0.1, tone: "success" as const },
];

export default function ProductivityPage() {
  const [category, setCategory] = useState<DepartmentCategory>("Meat");

  const inCategory = useMemo(
    () => departments.filter((d) => d.category === category),
    [category]
  );

  const barData = inCategory
    .map((d) => ({
      label: branches.find((b) => b.id === d.branchId)!.name,
      value: productivityScore(d),
    }))
    .sort((a, b) => b.value - a.value);

  const top = [...inCategory].sort(
    (a, b) => productivityScore(b) - productivityScore(a)
  )[0];
  const topBranch = branches.find((b) => b.id === top.branchId)!;

  const components = [
    { ...FACTORS[0], raw: Math.max(0, 100 - top.wasteRate * 5) },
    { ...FACTORS[1], raw: top.fifo },
    { ...FACTORS[2], raw: top.turnover },
    { ...FACTORS[3], raw: top.taskEfficiency },
    { ...FACTORS[4], raw: Math.min(100, top.salesGrowth * 5) },
  ];

  const networkAvg = Math.round(
    departments.reduce((s, d) => s + productivityScore(d), 0) /
      departments.length
  );
  const catAvg = Math.round(
    inCategory.reduce((s, d) => s + productivityScore(d), 0) / inCategory.length
  );

  return (
    <PageShell
      title="Department Productivity Intelligence"
      subtitle="One weighted score for objective operational evaluation"
    >
      <SectionHeader
        eyebrow="Measurement"
        aiTagged
        title="Productivity, made objective"
        description="A single composite score combines waste reduction, FIFO, turnover, task efficiency and sales growth — turning fuzzy 'efficiency' into a number managers can act on."
      />

      <Selector
        label="Department"
        value={category}
        onChange={(v) => setCategory(v as DepartmentCategory)}
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Network avg score"
          value={`${networkAvg}`}
          icon={Activity}
          tone="brand"
          index={0}
        />
        <StatCard
          label={`${category} avg score`}
          value={`${catAvg}`}
          delta={{
            value: `${catAvg >= networkAvg ? "+" : ""}${catAvg - networkAvg} vs network`,
            positive: catAvg >= networkAvg,
          }}
          icon={Gauge}
          tone="success"
          index={1}
        />
        <StatCard
          label="Top branch"
          value={topBranch.name}
          icon={TrendingUp}
          tone="info"
          index={2}
        />
        <StatCard
          label="Departments compared"
          value={`${inCategory.length}`}
          icon={Boxes}
          tone="warning"
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{category} productivity by branch</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Composite score, color-coded by performance band
            </p>
          </CardHeader>
          <CardContent>
            <RankedBars data={barData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>7-day trend · top performer</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              {category} · {topBranch.name}
            </p>
          </CardHeader>
          <CardContent>
            <TrendArea data={top.trend} height={236} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Score breakdown · {topBranch.name}</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              How the {productivityScore(top)} composite score is built
            </p>
          </div>
          <code className="rounded-lg border border-bg-border/70 bg-bg-soft/60 px-3 py-1.5 text-[11px] text-fg/55">
            0.3·Waste + 0.25·FIFO + 0.2·Turnover + 0.15·Task + 0.1·Sales
          </code>
        </CardHeader>
        <CardContent className="space-y-5">
          {components.map((c) => (
            <div key={c.key}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-fg/70">
                  {c.key}{" "}
                  <span className="text-fg/40">
                    · weight {Math.round(c.weight * 100)}%
                  </span>
                </span>
                <span className="font-semibold text-fg">
                  {Math.round(c.raw)} →{" "}
                  <span className="text-brand-300">
                    +{(c.raw * c.weight).toFixed(1)}
                  </span>
                </span>
              </div>
              <Progress value={c.raw} tone={c.tone} className="h-2" />
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-bg-border/60 pt-4">
            <span className="text-sm font-medium text-fg/70">
              Composite productivity score
            </span>
            <span className="text-2xl font-semibold text-fg">
              {productivityScore(top)}
            </span>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
