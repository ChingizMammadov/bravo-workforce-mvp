import {
  LayoutDashboard,
  Target,
  AlertTriangle,
  Repeat,
  ListChecks,
  Trophy,
  Activity,
  Wand2,
  Trash2,
  Goal,
  Calculator,
  ClipboardList,
  BarChart3,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "Platform",
    items: [
      { href: "/dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
      { href: "/kpis", label: "AI Dynamic KPIs", icon: Target },
      { href: "/risk", label: "Waste Risk Detection", icon: AlertTriangle },
      { href: "/fifo", label: "FIFO Compliance", icon: Repeat },
      { href: "/missions", label: "Daily Missions", icon: ListChecks },
      { href: "/leaderboard", label: "Cross-Branch League", icon: Trophy },
      { href: "/productivity", label: "Productivity Intelligence", icon: Activity },
    ],
  },
  {
    title: "AI Toolkit",
    items: [
      { href: "/tools", label: "Toolkit Overview", icon: Wand2 },
      { href: "/tools/waste-predictor", label: "Waste Risk Predictor", icon: Trash2 },
      { href: "/tools/goal-generator", label: "AI Goal Generator", icon: Goal },
      { href: "/tools/bonus-calculator", label: "Bonus Calculator", icon: Calculator },
      { href: "/tools/task-engine", label: "Task Recommendations", icon: ClipboardList },
      { href: "/tools/ranking-simulator", label: "Ranking Simulator", icon: BarChart3 },
      { href: "/tools/roi-simulator", label: "What-If ROI", icon: LineChart },
    ],
  },
];

export const NAV: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
