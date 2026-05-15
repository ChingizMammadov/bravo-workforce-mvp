"use client";

import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpoilageForecastChart } from "@/components/charts";
import { topRiskAlerts, executiveSnapshot } from "@/lib/ai-engine";
import { branches } from "@/lib/data";

export default function RiskPage() {
  const alerts = topRiskAlerts(12);
  const snap = executiveSnapshot();
  const critical = alerts.filter((a) => a.riskScore > 60).length;
  const avgRisk = Math.round(
    alerts.reduce((s, a) => s + a.riskScore, 0) / alerts.length
  );

  return (
    <PageShell
      title="AI Waste Risk Detection"
      subtitle="Predict spoilage before products expire — intervene early"
    >
      <SectionHeader
        eyebrow="Predictive"
        aiTagged
        title="Spoilage risk, surfaced before it costs you"
        description="The AI scores every department on expiry exposure, inventory age and rotation frequency, then ranks the warnings so teams act on the highest-impact risk first."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Departments scanned"
          value={`${snap.departmentCount}`}
          icon={ShieldAlert}
          tone="brand"
          index={0}
        />
        <StatCard
          label="Critical alerts"
          value={`${critical}`}
          delta={{ value: "needs action", positive: false }}
          icon={Flame}
          tone="danger"
          index={1}
        />
        <StatCard
          label="Avg risk score"
          value={`${avgRisk}`}
          icon={TrendingUp}
          tone="warning"
          index={2}
        />
        <StatCard
          label="Avg waste rate"
          value={`${snap.avgWaste}%`}
          delta={{ value: "-0.9% trending down", positive: true }}
          icon={AlertTriangle}
          tone="info"
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spoilage trajectory</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Actual spoilage vs. AI-predicted forecast (network-wide)
            </p>
          </CardHeader>
          <CardContent>
            <SpoilageForecastChart data={snap.spoilageTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { band: "Critical (>60)", n: alerts.filter((a) => a.riskScore > 60).length, tone: "danger" as const },
              { band: "Elevated (40–60)", n: alerts.filter((a) => a.riskScore > 40 && a.riskScore <= 60).length, tone: "warning" as const },
              { band: "Stable (<40)", n: alerts.filter((a) => a.riskScore <= 40).length, tone: "success" as const },
            ].map((r) => (
              <div key={r.band}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-fg/65">{r.band}</span>
                  <span className="font-semibold text-fg">{r.n}</span>
                </div>
                <Progress
                  value={(r.n / alerts.length) * 100}
                  tone={r.tone}
                />
              </div>
            ))}
            <div className="rounded-xl border border-bg-border/70 bg-grad-soft p-4">
              <p className="text-xs font-medium text-fg">AI summary</p>
              <p className="mt-1 text-[12px] leading-relaxed text-fg/65">
                {critical} departments require intervention within the next
                shift to avoid escalating spoilage cost.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-fg/80">
          Operational warning feed
        </h3>
        <div className="grid gap-3 lg:grid-cols-2">
          {alerts.map((a) => {
            const branch = branches.find((b) => b.id === a.branchId)!;
            const high = a.riskScore > 60;
            return (
              <Card key={a.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl ${
                        high
                          ? "bg-accent-red/15 text-accent-red"
                          : "bg-accent-amber/15 text-accent-amber"
                      }`}
                    >
                      <AlertTriangle size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-fg">
                        {a.category} · {branch.name}
                      </p>
                      <p className="text-xs text-fg/45">{branch.city}</p>
                    </div>
                  </div>
                  <Badge variant={high ? "danger" : "warning"}>
                    risk {a.riskScore}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg/70">
                  {a.message}
                </p>
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-bg-border/70 bg-bg-soft/50 p-3">
                  <Lightbulb size={14} className="mt-0.5 shrink-0 text-brand-300" />
                  <p className="text-[12px] leading-relaxed text-fg/65">
                    {a.recommendation}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
