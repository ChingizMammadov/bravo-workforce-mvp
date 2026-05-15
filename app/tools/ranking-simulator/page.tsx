"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Trophy, Plus, X } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, NumberInput, TextInput, Select } from "@/components/ui/form";
import {
  rankBranches,
  BranchPerf,
  RankedBranch,
  DEPARTMENTS,
} from "@/lib/calculators";
import { cn } from "@/lib/utils";

const SEED: BranchPerf[] = [
  { branchName: "Bravo Ganjlik", wasteReduction: 92, fifoScore: 95, taskCompletion: 93, salesImprovement: 88 },
  { branchName: "Bravo 20 Yanvar", wasteReduction: 88, fifoScore: 91, taskCompletion: 90, salesImprovement: 84 },
  { branchName: "Bravo Koroghlu", wasteReduction: 85, fifoScore: 88, taskCompletion: 86, salesImprovement: 80 },
  { branchName: "Bravo Nizami", wasteReduction: 78, fifoScore: 82, taskCompletion: 79, salesImprovement: 72 },
];

export default function RankingSimulatorPage() {
  const [department, setDepartment] = useState("Meat");
  const [rows, setRows] = useState<BranchPerf[]>(SEED);
  const [ranked, setRanked] = useState<RankedBranch[] | null>(null);

  const update = (idx: number, key: keyof BranchPerf, value: string | number) =>
    setRows((r) =>
      r.map((row, i) => (i === idx ? { ...row, [key]: value } : row))
    );

  const addRow = () =>
    setRows((r) => [
      ...r,
      {
        branchName: `Bravo Branch ${r.length + 1}`,
        wasteReduction: 80,
        fifoScore: 80,
        taskCompletion: 80,
        salesImprovement: 75,
      },
    ]);

  const removeRow = (idx: number) =>
    setRows((r) => (r.length > 2 ? r.filter((_, i) => i !== idx) : r));

  const run = () => setRanked(rankBranches(rows));

  return (
    <PageShell
      title="Cross-Branch Ranking Simulator"
      subtitle="Rank the same department across branches"
    >
      <SectionHeader
        eyebrow="Competition"
        aiTagged
        title="Fair head-to-head benchmarking"
        description="Score each branch's department on the same weighted formula, then rank them — the top 3 qualify for the cross-branch bonus."
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="w-44">
          <Select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d} department
              </option>
            ))}
          </Select>
        </div>
        <Button variant="secondary" size="sm" onClick={addRow}>
          <Plus size={14} /> Add branch
        </Button>
        <Button size="sm" onClick={run}>
          <BarChart3 size={14} /> Recalculate Rankings
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branch performance inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-bg-border bg-bg-soft/50 p-3 dark:bg-bg-card/30"
              >
                <div className="mb-2 flex items-center gap-2">
                  <TextInput
                    value={row.branchName}
                    onChange={(e) =>
                      update(idx, "branchName", e.target.value)
                    }
                    className="flex-1"
                  />
                  <button
                    onClick={() => removeRow(idx)}
                    aria-label="Remove branch"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-fg/45 hover:bg-fg/5 hover:text-accent-red"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      ["wasteReduction", "Waste↓"],
                      ["fifoScore", "FIFO"],
                      ["taskCompletion", "Task"],
                      ["salesImprovement", "Sales"],
                    ] as const
                  ).map(([key, label]) => (
                    <Field key={key} label={label}>
                      <NumberInput
                        value={row[key] as number}
                        onChange={(e) =>
                          update(idx, key, +e.target.value)
                        }
                        className="px-2 py-1.5 text-center"
                      />
                    </Field>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{department} league</CardTitle>
            {ranked && (
              <Badge variant="brand">
                <Trophy size={10} /> top 3 qualify
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {!ranked ? (
              <div className="grid h-64 place-items-center text-center text-sm text-fg/45">
                Press “Recalculate Rankings” <br /> to build the table.
              </div>
            ) : (
              <div className="space-y-2">
                {ranked.map((r) => (
                  <motion.div
                    key={r.branchName + r.rank}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: r.rank * 0.04 }}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3",
                      r.qualifies
                        ? "border-accent-teal/30 bg-accent-teal/5"
                        : "border-bg-border bg-bg-soft/50 dark:bg-bg-card/30"
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
                    <span className="flex-1 truncate text-sm font-medium text-fg">
                      {r.branchName}
                      <span className="ml-2 text-xs font-normal text-fg/45">
                        {department}
                      </span>
                    </span>
                    {r.qualifies && (
                      <Badge variant="success">bonus</Badge>
                    )}
                    <span className="w-10 text-right text-base font-semibold text-fg">
                      {r.score}
                    </span>
                  </motion.div>
                ))}
                <p className="pt-1 text-[11px] text-fg/40">
                  Score = 0.30·Waste↓ + 0.30·FIFO + 0.25·Task + 0.15·Sales
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
