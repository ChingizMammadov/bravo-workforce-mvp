"use client";

import { Repeat, Clock, ShieldCheck, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { branches, departments, DepartmentCategory } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORIES: DepartmentCategory[] = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
];

function cellTone(v: number) {
  if (v >= 92) return "bg-accent-teal/20 text-accent-teal border-accent-teal/30";
  if (v >= 82) return "bg-brand-500/20 text-brand-200 border-brand-500/30";
  if (v >= 74) return "bg-accent-amber/15 text-accent-amber border-accent-amber/30";
  return "bg-accent-red/15 text-accent-red border-accent-red/30";
}

export default function FifoPage() {
  const avgFifo = Math.round(
    departments.reduce((s, d) => s + d.fifo, 0) / departments.length
  );
  const compliant = departments.filter((d) => d.fifo >= 90).length;
  const violations = departments.filter((d) => d.fifo < 80);
  const worst = [...departments].sort((a, b) => a.fifo - b.fifo).slice(0, 6);

  return (
    <PageShell
      title="FIFO Compliance Intelligence"
      subtitle="Monitor rotation order and eliminate expiry waste"
    >
      <SectionHeader
        eyebrow="Inventory flow"
        aiTagged
        title="First in, first out — verified continuously"
        description="FIFO violations are one of the largest causes of supermarket waste. The AI tracks inventory aging and rotation order to catch repeated violations before products expire."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Avg FIFO compliance"
          value={`${avgFifo}%`}
          delta={{ value: "+1.8% improving", positive: true }}
          icon={Repeat}
          tone="success"
          index={0}
        />
        <StatCard
          label="Compliant depts (≥90%)"
          value={`${compliant}/${departments.length}`}
          icon={ShieldCheck}
          tone="brand"
          index={1}
        />
        <StatCard
          label="Violation departments"
          value={`${violations.length}`}
          delta={{ value: "below 80%", positive: false }}
          icon={AlertTriangle}
          tone="danger"
          index={2}
        />
        <StatCard
          label="Avg rotation delay"
          value="11 min"
          delta={{ value: "-3 min faster", positive: true }}
          icon={Clock}
          tone="info"
          index={3}
        />
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>FIFO compliance matrix</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Compliance % by branch and department — darker red needs
              immediate rotation
            </p>
          </div>
          <code className="hidden rounded-lg border border-bg-border/70 bg-bg-soft/60 px-3 py-1.5 text-[11px] text-fg/55 md:block">
            FIFO = correctly rotated ÷ total checked × 100
          </code>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1.5 text-sm">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-fg/45">
                    Branch
                  </th>
                  {CATEGORIES.map((c) => (
                    <th
                      key={c}
                      className="px-2 py-2 text-center text-xs uppercase tracking-wider text-fg/45"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {branches.map((b) => (
                  <tr key={b.id}>
                    <td className="whitespace-nowrap px-3 py-2 text-fg/75">
                      {b.name}
                    </td>
                    {CATEGORIES.map((c) => {
                      const d = departments.find(
                        (x) => x.branchId === b.id && x.category === c
                      )!;
                      return (
                        <td key={c} className="px-1 py-1">
                          <div
                            className={cn(
                              "grid h-11 place-items-center rounded-lg border text-sm font-semibold",
                              cellTone(d.fifo)
                            )}
                          >
                            {d.fifo}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-fg/80">
          AI rotation alerts — lowest compliance
        </h3>
        <div className="grid gap-3 lg:grid-cols-2">
          {worst.map((d) => {
            const branch = branches.find((b) => b.id === d.branchId)!;
            return (
              <Card key={d.id} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-fg">
                      {d.category} · {branch.name}
                    </p>
                    <p className="text-xs text-fg/45">
                      {branch.city} · waste {d.wasteRate}%
                    </p>
                  </div>
                  <Badge variant={d.fifo < 76 ? "danger" : "warning"}>
                    <AlertTriangle size={10} /> FIFO {d.fifo}%
                  </Badge>
                </div>
                <Progress
                  value={d.fifo}
                  tone={d.fifo < 76 ? "danger" : "warning"}
                  className="mt-4"
                />
                <p className="mt-3 text-[12px] leading-relaxed text-fg/65">
                  🚨 HIGH PRIORITY — Rotate aging {d.category.toLowerCase()}{" "}
                  inventory within {d.fifo < 76 ? "2 hours" : "next shift"} to
                  prevent spoilage and recover compliance to target (92%).
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
