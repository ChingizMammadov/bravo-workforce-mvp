"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trash2,
  Goal,
  Calculator,
  ClipboardList,
  BarChart3,
  LineChart,
  ArrowRight,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SectionHeader } from "@/components/section-header";
import { Card } from "@/components/ui/card";

const TOOLS = [
  {
    href: "/tools/waste-predictor",
    icon: Trash2,
    title: "Waste Risk Predictor",
    desc: "Predict how much inventory will expire unsold, and the AZN loss it carries.",
  },
  {
    href: "/tools/goal-generator",
    icon: Goal,
    title: "AI Goal Generator",
    desc: "Turn raw performance metrics into 4–6 clear, period-based department goals.",
  },
  {
    href: "/tools/bonus-calculator",
    icon: Calculator,
    title: "Bonus Calculator",
    desc: "Compute department score, branch pool and per-employee cross-branch bonus.",
  },
  {
    href: "/tools/task-engine",
    icon: ClipboardList,
    title: "Task Recommendation Engine",
    desc: "Generate prioritized operational missions from risk, FIFO and expiry signals.",
  },
  {
    href: "/tools/ranking-simulator",
    icon: BarChart3,
    title: "Cross-Branch Ranking Simulator",
    desc: "Rank same-category departments across branches and flag bonus qualifiers.",
  },
  {
    href: "/tools/roi-simulator",
    icon: LineChart,
    title: "What-If ROI Simulator",
    desc: "Model the financial impact: waste cost, savings, net benefit and ROI %.",
  },
];

export default function ToolkitHub() {
  return (
    <PageShell
      title="AI Toolkit"
      subtitle="Interactive calculators & simulators on top of the intelligence engine"
    >
      <SectionHeader
        eyebrow="Interactive"
        aiTagged
        title="Run the numbers, instantly"
        description="Six self-contained tools that turn the platform's analytics into concrete predictions, goals, bonuses and ROI you can act on."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t, i) => {
          const Icon = t.icon;
          return (
            <motion.div
              key={t.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link href={t.href} className="group block h-full">
                <Card className="h-full p-6 transition-all hover:border-brand-400/50 hover:shadow-glow">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-grad-soft text-brand-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-fg">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm text-fg/60">{t.desc}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Open tool <ArrowRight size={14} />
                  </p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </PageShell>
  );
}
