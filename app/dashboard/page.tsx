"use client";

import {
  Activity,
  PiggyBank,
  Repeat,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpoilageForecastChart, RankedBars } from "@/components/charts";
import {
  executiveSnapshot,
  topRiskAlerts,
  productivityScore,
} from "@/lib/ai-engine";
import { branches, departments } from "@/lib/data";
import { currency } from "@/lib/utils";

export default function DashboardPage() {
  const snap = executiveSnapshot();
  const alerts = topRiskAlerts(5);

  const branchScores = branches
    .map((b) => {
      const deps = departments.filter((d) => d.branchId === b.id);
      const avg = Math.round(
        deps.reduce((s, d) => s + productivityScore(d), 0) / deps.length
      );
      return { label: b.name, value: avg };
    })
    .sort((a, b) => b.value - a.value);

  return (
    <PageShell
      title="Executive Waste Intelligence"
      subtitle="Enterprise-wide operational visibility across all branches"
    >
      <SectionHeader
        eyebrow="Live overview"
        aiTagged
        title="Operational command center"
        description="The AI layer is continuously scanning spoilage, FIFO and productivity signals across every frontline department."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Avg productivity"
          value={`${snap.avgProductivity}`}
          delta={{ value: "+3.2 vs last week", positive: true }}
          icon={Activity}
          tone="brand"
          index={0}
        />
        <StatCard
          label="Avg FIFO compliance"
          value={`${snap.avgFifo}%`}
          delta={{ value: "+1.8% improving", positive: true }}
          icon={Repeat}
          tone="success"
          index={1}
        />
        <StatCard
          label="Avg waste rate"
          value={`${snap.avgWaste}%`}
          delta={{ value: "-0.9% reduced", positive: true }}
          icon={TrendingDown}
          tone="warning"
          index={2}
        />
        <StatCard
          label="Projected savings"
          value={currency(snap.projectedSavings)}
          delta={{ value: "AI-optimized", positive: true }}
          icon={PiggyBank}
          tone="info"
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Spoilage trend vs. AI forecast</CardTitle>
              <p className="mt-1 text-sm text-fg/55">
                14-day actual spoilage against the predicted trajectory
              </p>
            </div>
            <Badge variant="brand">14 days</Badge>
          </CardHeader>
          <CardContent>
            <SpoilageForecastChart data={snap.spoilageTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI risk feed</CardTitle>
            <Link
              href="/risk"
              className="inline-flex items-center gap-1 text-xs text-brand-300 hover:text-brand-200"
            >
              View all <ArrowRight size={12} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-bg-border/70 bg-bg-soft/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={a.riskScore > 60 ? "danger" : "warning"}
                  >
                    <AlertTriangle size={10} /> {a.category}
                  </Badge>
                  <span className="text-xs font-semibold text-fg/70">
                    risk {a.riskScore}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-fg/70">
                  {a.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Branch productivity ranking</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Composite productivity score by branch (all departments)
            </p>
          </CardHeader>
          <CardContent>
            <RankedBars data={branchScores} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Branches monitored" value={`${snap.branchCount}`} />
            <Row
              label="Departments tracked"
              value={`${snap.departmentCount}`}
            />
            <Row
              label="High-risk departments"
              value={`${snap.highRiskDepartments}`}
              tone="danger"
            />
            <Row
              label="Top branch"
              value={branchScores[0]?.label ?? "—"}
              tone="success"
            />
            <div className="rounded-xl border border-bg-border/70 bg-grad-soft p-4">
              <p className="text-xs font-medium text-fg">
                AI recommendation
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-fg/65">
                Prioritize rotation cycles in {snap.highRiskDepartments}{" "}
                high-risk departments to protect{" "}
                {currency(Math.round(snap.projectedSavings * 0.08))} of
                at-risk inventory this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

function Row({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger";
}) {
  const color =
    tone === "success"
      ? "text-accent-teal"
      : tone === "danger"
      ? "text-accent-red"
      : "text-fg";
  return (
    <div className="flex items-center justify-between border-b border-bg-border/50 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-fg/55">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
    </div>
  );
}
