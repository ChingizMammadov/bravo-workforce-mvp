// Rule-based simulation of the AI operational intelligence layer.
// Produces KPIs, missions, risk alerts, and productivity scores.

import {
  branches,
  departments,
  employees,
  inventory,
  Department,
  DepartmentCategory,
  InventoryItem,
  Priority,
} from "./data";

export interface AiKPI {
  id: string;
  departmentId: string;
  text: string;
  target: number;       // percentage target
  current: number;      // current value
  unit: "%" | "min" | "hr";
  status: "on-track" | "at-risk" | "off-track";
}

export interface RiskAlert {
  id: string;
  branchId: string;
  category: DepartmentCategory;
  message: string;
  riskScore: number; // 0-100
  delta: number;     // % change vs yesterday
  recommendation: string;
}

export interface Mission {
  id: string;
  branchId: string;
  category: DepartmentCategory;
  title: string;
  details: string;
  priority: Priority;
  dueIn: string;
}

const TEMPLATES: Record<DepartmentCategory, (d: Department) => string[]> = {
  Meat: (d) => [
    `Reduce expired meat quantity by 15% this week`,
    `Achieve 92% FIFO compliance (currently ${d.fifo}%)`,
    `Complete shelf rotation every 3 hours`,
    `Reduce unsold inventory by 10%`,
  ],
  Fish: (d) => [
    `Maintain cold-chain compliance above 95%`,
    `Cut spoilage rate below 6% (currently ${d.wasteRate}%)`,
    `Complete morning freshness check by 9 AM`,
  ],
  Bakery: () => [
    `Reduce end-of-day bread waste by 20%`,
    `Increase same-day sell-through by 12%`,
    `Keep shelf replenishment delay below 10 minutes`,
  ],
  Dairy: () => [
    `Remove near-expiry products within 1 hour of AI alert`,
    `Achieve 90% freshness compliance`,
    `Complete expiry checks before 11 AM daily`,
  ],
  Vegetables: () => [
    `Cut visual-defect rate below 5%`,
    `Rotate leafy greens twice per shift`,
    `Reduce same-day discard by 18%`,
  ],
  Shelf: (d) => [
    `Maintain shelf availability above 96% (currently ${d.turnover}%)`,
    `Replenish gaps within 8 minutes of detection`,
    `Reach 100% planogram compliance`,
  ],
  Inventory: () => [
    `Process incoming pallets within 45 minutes`,
    `Keep backroom-to-shelf age below 6 hours`,
    `Reduce mis-located stock to under 2%`,
  ],
};

export function generateKpis(d: Department): AiKPI[] {
  return TEMPLATES[d.category](d).map((text, i) => {
    const target = 90 + (i % 3) * 2;
    const current = Math.max(50, Math.min(99, d.productivity + (i - 1) * 3));
    const status: AiKPI["status"] =
      current >= target ? "on-track" : current >= target - 5 ? "at-risk" : "off-track";
    return {
      id: `${d.id}-kpi-${i}`,
      departmentId: d.id,
      text,
      target,
      current,
      unit: "%",
      status,
    };
  });
}

export function topRiskAlerts(limit = 8): RiskAlert[] {
  return departments
    .map<RiskAlert>((d) => {
      const riskScore = Math.round(
        d.wasteRate * 4 + (100 - d.fifo) * 0.6 + (100 - d.productivity) * 0.5
      );
      const delta = Math.round(((100 - d.fifo) - 10) / 2);
      const branch = branches.find((b) => b.id === d.branchId)!;
      return {
        id: `${d.id}-risk`,
        branchId: d.branchId,
        category: d.category,
        message:
          riskScore > 60
            ? `${d.category} spoilage risk spiking at ${branch.name} — delayed shelf rotation detected`
            : `${d.category} flow drifting at ${branch.name} — FIFO compliance trending down`,
        riskScore,
        delta,
        recommendation:
          riskScore > 70
            ? `Trigger rotation cycle within 60 minutes and apply discount labels to high-risk SKUs`
            : `Schedule freshness audit before next shift handover`,
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, limit);
}

const URGENCY_BY_EXPIRY: Record<DepartmentCategory, string[]> = {
  Meat: ["Rotate chicken inventory before 2 PM", "Apply discount labels to high-risk beef SKUs"],
  Fish: ["Move salmon trays to display ice and reprice", "Trigger cold-chain audit on rear cooler"],
  Bakery: ["Discount day-old sourdough by 35%", "Refill croissant display before lunch rush"],
  Dairy: ["Pull near-expiry yogurt from front shelf", "Restock cold display with fresh milk"],
  Vegetables: ["Re-trim leafy greens display", "Move tomatoes from back to front of bin"],
  Shelf: ["Replenish cereal aisle gaps", "Re-face pasta section to planogram"],
  Inventory: ["Process pallet A in receiving bay", "Move backroom rack B to floor"],
};

export function generateMissions(limit = 12): Mission[] {
  const sorted = [...inventory].sort(
    (a, b) => b.expiryRisk + b.spoilageProbability - (a.expiryRisk + a.spoilageProbability)
  );
  const out: Mission[] = [];
  for (const item of sorted) {
    if (out.length >= limit) break;
    const composite = item.expiryRisk + item.spoilageProbability;
    const priority: Priority =
      composite > 150 ? "high" : composite > 110 ? "medium" : "low";
    const tip =
      URGENCY_BY_EXPIRY[item.departmentCategory][
        item.id.length % URGENCY_BY_EXPIRY[item.departmentCategory].length
      ];
    out.push({
      id: `${item.id}-mission`,
      branchId: item.branchId,
      category: item.departmentCategory,
      title: tip,
      details: `${item.name} • age ${item.inventoryAge}h • spoilage ${item.spoilageProbability}%`,
      priority,
      dueIn:
        priority === "high"
          ? `${1 + (item.inventoryAge % 2)}h`
          : priority === "medium"
          ? `${3 + (item.inventoryAge % 4)}h`
          : "EOD",
    });
  }
  // Add a couple of completed examples for realism
  out.push({
    id: "completed-1",
    branchId: "br-04",
    category: "Bakery",
    title: "Bakery shelf optimization completed",
    details: "Croissant + baguette displays re-faced",
    priority: "completed",
    dueIn: "Done",
  });
  return out;
}

// Productivity = 0.3 Waste Reduction + 0.25 FIFO + 0.2 Inventory Turnover
//              + 0.15 Task Efficiency + 0.1 Sales Growth
export function productivityScore(d: Department) {
  const wasteReduction = Math.max(0, 100 - d.wasteRate * 5);
  return Math.round(
    0.3 * wasteReduction +
      0.25 * d.fifo +
      0.2 * d.turnover +
      0.15 * d.taskEfficiency +
      0.1 * Math.min(100, d.salesGrowth * 5)
  );
}

export interface LeaderboardRow {
  rank: number;
  branchId: string;
  branchName: string;
  category: DepartmentCategory;
  productivity: number;
  fifo: number;
  wasteRate: number;
}

export function leaderboardFor(category: DepartmentCategory): LeaderboardRow[] {
  return departments
    .filter((d) => d.category === category)
    .map((d) => ({
      branchId: d.branchId,
      branchName: branches.find((b) => b.id === d.branchId)!.name,
      category: d.category,
      productivity: productivityScore(d),
      fifo: d.fifo,
      wasteRate: d.wasteRate,
      rank: 0,
    }))
    .sort((a, b) => b.productivity - a.productivity)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function executiveSnapshot() {
  const avgProductivity = Math.round(
    departments.reduce((s, d) => s + productivityScore(d), 0) / departments.length
  );
  const avgFifo = Math.round(
    departments.reduce((s, d) => s + d.fifo, 0) / departments.length
  );
  const avgWaste = +(
    departments.reduce((s, d) => s + d.wasteRate, 0) / departments.length
  ).toFixed(1);
  const highRiskDepartments = departments.filter((d) => d.wasteRate > 12).length;
  const projectedSavings = Math.round(
    departments.reduce((s, d) => s + (100 - d.wasteRate) * 380, 0)
  );

  // Build 14-day trend for spoilage
  const spoilageTrend = Array.from({ length: 14 }).map((_, i) => ({
    day: `D${i + 1}`,
    spoilage: +(
      avgWaste +
      Math.sin(i / 2) * 1.4 +
      (i > 9 ? -1.5 : 0)
    ).toFixed(2),
    forecast: +(
      avgWaste +
      Math.cos(i / 2.2) * 1.1 +
      (i > 7 ? -1.8 : 0.4)
    ).toFixed(2),
  }));

  return {
    avgProductivity,
    avgFifo,
    avgWaste,
    highRiskDepartments,
    projectedSavings,
    spoilageTrend,
    branchCount: branches.length,
    departmentCount: departments.length,
  };
}

export const sample = (d: Department | undefined) => d ?? departments[0];

export function findInventoryAt(branchId: string, category: DepartmentCategory): InventoryItem[] {
  return inventory.filter((i) => i.branchId === branchId && i.departmentCategory === category);
}

// ---------------------------------------------------------------------------
// Goal-driven bonus engine
//
// 1. Each department has an AI productivity goal (GOAL_TARGET). The in-branch
//    bonus pool only unlocks when the department meets that goal, and scales
//    with how far it beats the target.
// 2. Cross-branch competition then applies a premium multiplier based on the
//    department's rank within its category leaderboard.
// 3. The unlocked pool is split across the team weighted by each employee's
//    individual performance.
// ---------------------------------------------------------------------------

export const GOAL_TARGET = 72; // AI-set productivity goal threshold
const BASE_BONUS = 1000; // base pool at exactly hitting target
const PER_POINT = 80; // extra $ per productivity point above target

const CROSS_BRANCH_MULTIPLIER = (rank: number) =>
  rank === 1 ? 1.6 : rank === 2 ? 1.4 : rank === 3 ? 1.2 : 1.0;

export interface DepartmentBonus {
  branchId: string;
  category: DepartmentCategory;
  score: number;
  goalTarget: number;
  goalMet: boolean;
  rank: number;
  crossBranchMultiplier: number;
  basePool: number; // in-branch pool before cross-branch premium
  totalPool: number; // final unlocked pool (0 when goal not met)
}

export function departmentBonus(d: Department): DepartmentBonus {
  const score = productivityScore(d);
  const goalMet = score >= GOAL_TARGET;
  const rank =
    leaderboardFor(d.category).find((r) => r.branchId === d.branchId)?.rank ?? 0;
  const crossBranchMultiplier = CROSS_BRANCH_MULTIPLIER(rank);
  const basePool = goalMet
    ? Math.round(BASE_BONUS + (score - GOAL_TARGET) * PER_POINT)
    : 0;
  const totalPool = Math.round(basePool * crossBranchMultiplier);
  return {
    branchId: d.branchId,
    category: d.category,
    score,
    goalTarget: GOAL_TARGET,
    goalMet,
    rank,
    crossBranchMultiplier,
    basePool,
    totalPool,
  };
}

export function departmentBonusFor(
  branchId: string,
  category: DepartmentCategory
): DepartmentBonus {
  const d = departments.find(
    (x) => x.branchId === branchId && x.category === category
  )!;
  return departmentBonus(d);
}

export interface EmployeeBonus {
  employeeId: string;
  share: number; // this employee's slice of the unlocked pool
}

/** Splits the unlocked department pool across the team by performance weight. */
export function employeeBonuses(
  branchId: string,
  category: DepartmentCategory
): EmployeeBonus[] {
  const bonus = departmentBonusFor(branchId, category);
  const team = employees.filter(
    (e) => e.branchId === branchId && e.departmentCategory === category
  );
  const totalPerf = team.reduce((s, e) => s + e.performance, 0) || 1;
  return team.map((e) => ({
    employeeId: e.id,
    share: bonus.goalMet
      ? Math.round(bonus.totalPool * (e.performance / totalPerf))
      : 0,
  }));
}
