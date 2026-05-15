// Pure, deterministic calculation engine for the AI Toolkit.
// Every function takes plain inputs and returns a typed result — no UI,
// no side effects — so the logic is easy to reason about and reuse.

export type RiskLevel = "Low" | "Medium" | "High";
export type Priority = "HIGH" | "MEDIUM" | "LOW";

export const DEPARTMENTS = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
] as const;
export type Department = (typeof DEPARTMENTS)[number];

// ---------------------------------------------------------------------------
// 1. Waste Risk Predictor
// ---------------------------------------------------------------------------

export interface WasteRiskInput {
  department: string;
  productName: string;
  quantity: number;
  expiryDate: string; // YYYY-MM-DD
  avgDailySales: number;
  unitCost: number;
}

export interface WasteRiskResult {
  daysToExpiry: number;
  expectedSold: number;
  expectedUnsold: number;
  wasteRiskPercent: number;
  estimatedLoss: number;
  riskLevel: RiskLevel;
  recommendation: string;
}

export function predictWasteRisk(i: WasteRiskInput): WasteRiskResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(i.expiryDate + "T00:00:00");
  const daysToExpiry = Math.max(
    0,
    Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000)
  );

  const expectedSold = Math.round(i.avgDailySales * daysToExpiry);
  const expectedUnsold = Math.max(i.quantity - expectedSold, 0);
  const wasteRiskPercent =
    i.quantity > 0 ? (expectedUnsold / i.quantity) * 100 : 0;
  const estimatedLoss = Math.round(expectedUnsold * i.unitCost);

  const riskLevel: RiskLevel =
    wasteRiskPercent <= 30 ? "Low" : wasteRiskPercent <= 60 ? "Medium" : "High";

  const recommendation =
    riskLevel === "High"
      ? "Apply discount labels now and prioritize shelf rotation for this SKU."
      : riskLevel === "Medium"
      ? "Schedule a freshness check and move stock to a high-traffic display."
      : "On track — maintain standard rotation and monitor daily.";

  return {
    daysToExpiry,
    expectedSold,
    expectedUnsold,
    wasteRiskPercent: Math.round(wasteRiskPercent * 10) / 10,
    estimatedLoss,
    riskLevel,
    recommendation,
  };
}

// ---------------------------------------------------------------------------
// 2. AI Goal Generator
// ---------------------------------------------------------------------------

export type GoalPeriod = "Daily" | "Weekly" | "Monthly";

export interface GoalInput {
  department: string;
  wasteRate: number;
  fifoScore: number;
  salesGrowth: number;
  taskCompletion: number;
  period: GoalPeriod;
}

export function generateAiGoals(i: GoalInput): string[] {
  const goals: string[] = [];
  const span = i.period.toLowerCase();

  if (i.wasteRate > 10) {
    const target = Math.max(4, Math.round(i.wasteRate - 3));
    goals.push(
      `Reduce waste from ${i.wasteRate}% to ${target}% this ${span}.`
    );
  }
  if (i.fifoScore < 85) {
    const target = Math.min(95, i.fifoScore + 12);
    goals.push(
      `Increase FIFO compliance from ${i.fifoScore}% to ${target}%.`
    );
  }
  if (i.salesGrowth < 5) {
    goals.push(
      `Improve same-${span === "monthly" ? "month" : "day"} sell-through by 12%.`
    );
  }
  if (i.taskCompletion < 80) {
    goals.push(
      `Raise task completion from ${i.taskCompletion}% to 90% this ${span}.`
    );
  }

  // Always-on operational discipline goals so the set is 4–6 strong items.
  const baseline = [
    "Complete expiry checks before 11:00 daily.",
    "Rotate high-risk products every 3 hours.",
    "Reduce unsold inventory by 10%.",
    "Clear AI mission queue before shift handover.",
  ];
  for (const g of baseline) {
    if (goals.length >= 6) break;
    if (goals.length < 4 || goals.length < 5) goals.push(g);
  }

  return goals.slice(0, 6);
}

// ---------------------------------------------------------------------------
// 3. Bonus Calculator
// ---------------------------------------------------------------------------

export interface BonusInput {
  department: string;
  employees: number;
  wasteReduction: number;
  fifoScore: number;
  taskCompletion: number;
  salesImprovement: number;
  crossRank: number; // 1, 2, 3, or 4+ (any number >= 4)
}

export interface BonusResult {
  departmentScore: number;
  bonusPool: number;
  branchBonusPerEmployee: number;
  crossBranchBonus: number;
  totalBonusPerEmployee: number;
}

export function calculateBonus(i: BonusInput): BonusResult {
  const raw =
    0.3 * i.wasteReduction +
    0.25 * i.fifoScore +
    0.2 * i.taskCompletion +
    0.15 * i.salesImprovement +
    10;
  const departmentScore = Math.min(100, Math.round(raw));

  const bonusPool =
    departmentScore >= 90
      ? 1200
      : departmentScore >= 80
      ? 800
      : departmentScore >= 70
      ? 400
      : 0;

  const branchBonusPerEmployee =
    i.employees > 0 ? Math.floor(bonusPool / i.employees) : 0;

  const crossBranchBonus =
    i.crossRank === 1 ? 100 : i.crossRank === 2 ? 75 : i.crossRank === 3 ? 50 : 0;

  return {
    departmentScore,
    bonusPool,
    branchBonusPerEmployee,
    crossBranchBonus,
    totalBonusPerEmployee: branchBonusPerEmployee + crossBranchBonus,
  };
}

// ---------------------------------------------------------------------------
// 4. Task Recommendation Engine
// ---------------------------------------------------------------------------

export interface TaskInput {
  department: string;
  wasteRisk: RiskLevel;
  fifoScore: RiskLevel; // Low / Medium / High compliance band
  daysToExpiry: number;
  productType: string;
}

export interface TaskItem {
  priority: Priority;
  text: string;
}

export function recommendTasks(i: TaskInput): TaskItem[] {
  const out: TaskItem[] = [];
  const p = i.productType || "product";

  if (i.wasteRisk === "High") {
    out.push({
      priority: "HIGH",
      text: `Apply discount labels to high-risk ${p} and pull near-expiry stock.`,
    });
    out.push({
      priority: "HIGH",
      text: `Move older ${p} batches to the front shelf immediately.`,
    });
  }
  if (i.fifoScore === "Low") {
    out.push({
      priority: "HIGH",
      text: "Complete a full shelf rotation cycle within 1 hour.",
    });
  }
  if (i.daysToExpiry <= 1) {
    out.push({
      priority: "HIGH",
      text: `Take immediate expiry action on ${p} — discount or remove before close.`,
    });
  }
  if (i.department === "Bakery") {
    out.push({
      priority: "MEDIUM",
      text: "Drive same-day sell-through — refresh displays before peak hours.",
    });
  }
  if (i.department === "Meat" || i.department === "Fish") {
    out.push({
      priority: "MEDIUM",
      text: "Run a cold-chain temperature check and log quality on rear coolers.",
    });
  }

  // Fill to 4–6 with sensible operational follow-ups.
  const filler: TaskItem[] = [
    { priority: "MEDIUM", text: "Re-face the section to planogram and clear gaps." },
    { priority: "MEDIUM", text: `Recheck unsold ${p} inventory before shift handover.` },
    { priority: "LOW", text: "Report damaged packaging and update inventory counts." },
  ];
  for (const f of filler) {
    if (out.length >= 6) break;
    if (out.length < 4 || out.length < 5) out.push(f);
  }

  const order: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return out.slice(0, 6).sort((a, b) => order[a.priority] - order[b.priority]);
}

// ---------------------------------------------------------------------------
// 5. Cross-Branch Ranking Simulator
// ---------------------------------------------------------------------------

export interface BranchPerf {
  branchName: string;
  wasteReduction: number;
  fifoScore: number;
  taskCompletion: number;
  salesImprovement: number;
}

export interface RankedBranch extends BranchPerf {
  rank: number;
  score: number;
  qualifies: boolean; // top 3 → cross-branch bonus
}

export function rankBranches(rows: BranchPerf[]): RankedBranch[] {
  return rows
    .map((r) => ({
      ...r,
      score: Math.round(
        0.3 * r.wasteReduction +
          0.3 * r.fifoScore +
          0.25 * r.taskCompletion +
          0.15 * r.salesImprovement
      ),
      rank: 0,
      qualifies: false,
    }))
    .sort((a, b) => b.score - a.score)
    .map((r, idx) => ({ ...r, rank: idx + 1, qualifies: idx < 3 }));
}

// ---------------------------------------------------------------------------
// 6. What-If ROI Simulator
// ---------------------------------------------------------------------------

export interface RoiInput {
  monthlyWasteQuantity: number;
  avgProductCost: number;
  wasteReductionPercent: number;
  employeeBonusCost: number; // total monthly bonus cost
  employees: number;
}

export interface RoiResult {
  currentWasteCost: number;
  expectedSavings: number;
  employeeBonusCost: number;
  bonusPerEmployee: number;
  netBenefit: number;
  roiPercent: number;
}

export function simulateRoi(i: RoiInput): RoiResult {
  const currentWasteCost = Math.round(
    i.monthlyWasteQuantity * i.avgProductCost
  );
  const expectedSavings = Math.round(
    currentWasteCost * (i.wasteReductionPercent / 100)
  );
  const netBenefit = expectedSavings - i.employeeBonusCost;
  const roiPercent =
    i.employeeBonusCost > 0
      ? Math.round((netBenefit / i.employeeBonusCost) * 100)
      : 0;
  return {
    currentWasteCost,
    expectedSavings,
    employeeBonusCost: i.employeeBonusCost,
    bonusPerEmployee:
      i.employees > 0 ? Math.round(i.employeeBonusCost / i.employees) : 0,
    netBenefit,
    roiPercent,
  };
}
