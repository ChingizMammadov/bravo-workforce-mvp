"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Star,
  Users,
  Gift,
  Building2,
  Lock,
  Target,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Selector } from "@/components/selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  leaderboardFor,
  departmentBonusFor,
  employeeBonuses,
  GOAL_TARGET,
} from "@/lib/ai-engine";
import { employees, DepartmentCategory } from "@/lib/data";
import { cn, currency } from "@/lib/utils";

const CATEGORIES: DepartmentCategory[] = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
];

const TIER_META = {
  Gold: { variant: "warning" as const, ring: "ring-accent-amber/40", icon: Crown },
  Silver: { variant: "info" as const, ring: "ring-fg/30", icon: Medal },
  Bronze: { variant: "danger" as const, ring: "ring-accent-amber/20", icon: Award },
  Pending: { variant: "ghost" as const, ring: "ring-fg/10", icon: Star },
};

export default function LeaderboardPage() {
  const [category, setCategory] = useState<DepartmentCategory>("Meat");
  const rows = useMemo(() => leaderboardFor(category), [category]);
  const [branchId, setBranchId] = useState(rows[0].branchId);

  // keep selected branch valid when category changes
  const activeBranchId = rows.some((r) => r.branchId === branchId)
    ? branchId
    : rows[0].branchId;

  const bonusByBranch = useMemo(
    () =>
      Object.fromEntries(
        rows.map((r) => [r.branchId, departmentBonusFor(r.branchId, category)])
      ),
    [rows, category]
  );

  const activeBonus = bonusByBranch[activeBranchId];
  const activeBranchName = rows.find(
    (r) => r.branchId === activeBranchId
  )?.branchName;

  const shares = useMemo(
    () => employeeBonuses(activeBranchId, category),
    [activeBranchId, category]
  );
  const shareOf = (id: string) =>
    shares.find((s) => s.employeeId === id)?.share ?? 0;

  const branchEmployees = employees
    .filter(
      (e) => e.branchId === activeBranchId && e.departmentCategory === category
    )
    .sort((a, b) => b.performance - a.performance);

  const podium = rows.slice(0, 3);
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean);

  return (
    <PageShell
      title="Cross-Branch Department Competition"
      subtitle="Same-category departments compete enterprise-wide"
    >
      <SectionHeader
        eyebrow="Competition & rewards"
        aiTagged
        title="Hit the goal, unlock the bonus"
        description="A department's bonus pool unlocks only when it reaches its AI productivity goal — then scales with how far it beats target and its cross-branch rank. Pools are split across the team by individual performance."
      />

      <Selector
        label="Department"
        value={category}
        onChange={(v) => setCategory(v as DepartmentCategory)}
        options={CATEGORIES.map((c) => ({ value: c, label: c }))}
      />

      {/* Podium */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {podiumOrder.map((r) => {
          const isFirst = r.rank === 1;
          const b = bonusByBranch[r.branchId];
          return (
            <motion.div
              key={r.branchId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: r.rank * 0.05 }}
            >
              <Card
                glow={isFirst}
                className={cn(
                  "relative overflow-hidden p-6 text-center",
                  isFirst && "sm:-mt-3 border-accent-amber/30"
                )}
              >
                {isFirst && (
                  <div className="absolute inset-0 bg-gradient-to-b from-accent-amber/15 to-transparent" />
                )}
                <div className="relative">
                  <div
                    className={cn(
                      "mx-auto grid h-12 w-12 place-items-center rounded-2xl",
                      isFirst ? "bg-grad-brand shadow-glow" : "bg-fg/10"
                    )}
                  >
                    {isFirst ? (
                      <Crown size={22} className="text-white" />
                    ) : (
                      <Medal size={20} className="text-fg/80" />
                    )}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-wider text-fg/45">
                    Rank #{r.rank} · ×{b.crossBranchMultiplier}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-fg">
                    {r.branchName}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-fg">
                    {r.productivity}
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-fg/45">
                    productivity score
                  </p>
                  {b.goalMet ? (
                    <Badge variant="success" className="mt-3">
                      <Gift size={10} /> {currency(b.totalPool)} pool
                    </Badge>
                  ) : (
                    <Badge variant="ghost" className="mt-3">
                      <Lock size={10} /> Goal not met
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Full leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{category} league table</CardTitle>
            <Badge variant="brand">
              <Trophy size={10} /> {rows.length} branches
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.map((r) => {
              const active = r.branchId === activeBranchId;
              const b = bonusByBranch[r.branchId];
              return (
                <button
                  key={r.branchId}
                  onClick={() => setBranchId(r.branchId)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all",
                    active
                      ? "border-brand-500/40 bg-grad-soft"
                      : "border-bg-border/70 bg-bg-soft/40 hover:border-fg/20"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-semibold",
                      r.rank === 1
                        ? "bg-accent-amber/20 text-accent-amber"
                        : "bg-fg/8 text-fg/60"
                    )}
                  >
                    {r.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">
                      {r.branchName}
                    </p>
                    <p className="text-xs text-fg/45">
                      FIFO {r.fifo}% · waste {r.wasteRate}%
                    </p>
                  </div>
                  <div className="hidden w-24 shrink-0 sm:block">
                    <Progress
                      value={r.productivity}
                      tone={
                        r.productivity >= 85
                          ? "success"
                          : r.productivity >= 70
                          ? "brand"
                          : "warning"
                      }
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-fg">
                    {r.productivity}
                  </span>
                  <span
                    className={cn(
                      "w-24 shrink-0 text-right text-sm font-semibold",
                      b.goalMet ? "text-accent-teal" : "text-fg/35"
                    )}
                  >
                    {b.goalMet ? currency(b.totalPool) : "— locked"}
                  </span>
                </button>
              );
            })}
            <p className="pt-1 text-[11px] text-fg/40">
              Right column = unlocked department bonus pool. Goal threshold:
              productivity ≥ {GOAL_TARGET}.
            </p>
          </CardContent>
        </Card>

        {/* Bonus breakdown for the active branch */}
        <Card>
          <CardHeader>
            <CardTitle>Bonus breakdown</CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              {activeBranchName} · {category}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-fg/65">
                  <Target size={13} /> Goal progress
                </span>
                <span className="font-semibold text-fg">
                  {activeBonus.score} / {GOAL_TARGET}
                </span>
              </div>
              <Progress
                value={(activeBonus.score / GOAL_TARGET) * 100}
                tone={activeBonus.goalMet ? "success" : "danger"}
              />
            </div>

            {activeBonus.goalMet ? (
              <div className="space-y-2.5 rounded-xl border border-accent-teal/25 bg-grad-soft p-4 text-sm">
                <Line
                  k="In-branch base pool"
                  v={currency(activeBonus.basePool)}
                />
                <Line
                  k={`Cross-branch (rank #${activeBonus.rank})`}
                  v={`× ${activeBonus.crossBranchMultiplier}`}
                />
                <div className="flex items-center justify-between border-t border-fg/10 pt-2.5">
                  <span className="font-medium text-fg">
                    Total unlocked pool
                  </span>
                  <span className="text-lg font-semibold text-accent-teal">
                    {currency(activeBonus.totalPool)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-xl border border-bg-border/70 bg-bg-soft/50 p-4">
                <Lock size={15} className="mt-0.5 shrink-0 text-fg/45" />
                <p className="text-[12px] leading-relaxed text-fg/60">
                  Bonus locked — this department is{" "}
                  {GOAL_TARGET - activeBonus.score} points below its AI
                  productivity goal. No payout until the goal is reached.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-bg-border/70 bg-bg-soft/40 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-fg/45">
                How it works
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-fg/60">
                Pool = ($1,000 + $80 × points above {GOAL_TARGET}) × cross-branch
                rank multiplier, then split across the team by individual
                performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee awarding for selected branch */}
      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users size={16} className="text-brand-300" />
              {category} team — {activeBranchName}
            </CardTitle>
            <p className="mt-1 text-sm text-fg/55">
              Individual performance, reward tier & bonus earned · select a
              branch above to switch teams
            </p>
          </div>
          {activeBonus.goalMet ? (
            <Badge variant="success">
              <Gift size={10} /> {currency(activeBonus.totalPool)} shared across{" "}
              {branchEmployees.length}
            </Badge>
          ) : (
            <Badge variant="ghost">
              <Lock size={10} /> Goal not met — no bonus
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branchEmployees.map((e, i) => {
              const meta = TIER_META[e.rewardStatus];
              const TierIcon = meta.icon;
              const bonus = shareOf(e.id);
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-xl border border-bg-border/70 bg-bg-soft/40 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-full bg-grad-brand text-sm font-semibold text-white ring-2",
                        meta.ring
                      )}
                    >
                      {e.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")}
                    </div>
                    <Badge variant={meta.variant}>
                      <TierIcon size={10} /> {e.rewardStatus}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm font-medium text-fg">
                    {e.name}
                  </p>
                  <p className="text-xs text-fg/45">
                    {e.completedMissions} missions completed
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Progress
                      value={e.performance}
                      tone={
                        e.performance >= 90
                          ? "success"
                          : e.performance >= 80
                          ? "brand"
                          : e.performance >= 70
                          ? "warning"
                          : "danger"
                      }
                    />
                    <span className="shrink-0 text-xs font-semibold text-fg/70">
                      {e.performance}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-bg-border/60 pt-3">
                    <span className="text-[11px] uppercase tracking-wider text-fg/45">
                      Bonus earned
                    </span>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        bonus > 0 ? "text-accent-teal" : "text-fg/35"
                      )}
                    >
                      {bonus > 0 ? currency(bonus) : "$0"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-fg/60">{k}</span>
      <span className="font-medium text-fg">{v}</span>
    </div>
  );
}
