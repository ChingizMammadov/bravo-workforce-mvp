"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  AlertTriangle,
  Repeat,
  ListChecks,
  Trophy,
  Activity,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { executiveSnapshot } from "@/lib/ai-engine";
import { currency } from "@/lib/utils";

const FEATURES = [
  {
    icon: Target,
    title: "AI Dynamic KPI Engine",
    desc: "Adaptive department goals generated from live spoilage, FIFO and turnover signals.",
    href: "/kpis",
    tag: "Core innovation",
  },
  {
    icon: AlertTriangle,
    title: "Waste Risk Detection",
    desc: "Predicts spoilage probability and surfaces high-risk inventory before it expires.",
    href: "/risk",
  },
  {
    icon: Repeat,
    title: "FIFO Compliance Intelligence",
    desc: "Monitors rotation order and flags repeated FIFO violations across shelves.",
    href: "/fifo",
  },
  {
    icon: ListChecks,
    title: "Daily Operational Missions",
    desc: "Prioritized, department-specific actions ranked by spoilage urgency.",
    href: "/missions",
  },
  {
    icon: Trophy,
    title: "Cross-Branch Competition",
    desc: "Same-category departments compete enterprise-wide with rewards and badges.",
    href: "/leaderboard",
  },
  {
    icon: Activity,
    title: "Productivity Intelligence",
    desc: "A single weighted score combining waste, FIFO, turnover, efficiency & growth.",
    href: "/productivity",
  },
];

export default function LandingPage() {
  const snap = executiveSnapshot();

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-fg">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-[44rem] bg-grid-fade" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-grad-brand shadow-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">Bravo Opsis</p>
            <p className="text-[10px] uppercase tracking-wider text-fg/50">
              Workforce Intelligence
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/dashboard">
            <Button size="sm" variant="secondary">
              Launch platform <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-16 text-center lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="brand" className="mb-6">
            <Sparkles size={10} /> AI-powered retail operations
          </Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight lg:text-6xl">
            Turn employee execution into{" "}
            <span className="bg-grad-brand bg-clip-text text-transparent">
              measurable operational intelligence
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-fg/60 lg:text-lg">
            Bravo Opsis predicts spoilage risk, generates adaptive department KPIs,
            enforces FIFO compliance, and benchmarks workforce performance across
            every branch — cutting operational waste at the source.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg">
                <LayoutDashboard size={18} /> Open Executive Dashboard
              </Button>
            </Link>
            <Link href="/kpis">
              <Button size="lg" variant="outline">
                Explore AI KPI Engine
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Live stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { k: "Avg productivity", v: `${snap.avgProductivity}` },
            { k: "Avg FIFO", v: `${snap.avgFifo}%` },
            { k: "Branches live", v: `${snap.branchCount}` },
            { k: "Projected savings", v: currency(snap.projectedSavings) },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-bg-border/80 bg-bg-card/60 px-4 py-5 backdrop-blur-xl"
            >
              <p className="text-2xl font-semibold">{s.v}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-fg/50">
                {s.k}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Feature grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.href}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={f.href}
                  className="group block h-full rounded-2xl border border-bg-border/80 bg-bg-card/60 p-6 backdrop-blur-xl transition-all hover:border-brand-500/40 hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-grad-soft text-brand-200">
                      <Icon size={20} />
                    </div>
                    {f.tag && <Badge variant="brand">{f.tag}</Badge>}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-fg/60">{f.desc}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm text-brand-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Open module <ArrowRight size={14} />
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-bg-border/80 bg-grad-soft p-8 text-center">
          <ShieldCheck size={24} className="text-accent-teal" />
          <p className="max-w-2xl text-pretty text-sm text-fg/70">
            Built for frontline supermarket teams — Meat, Fish, Bakery, Dairy,
            Vegetables, Shelf and Inventory. Operational waste reduced at the
            source through intelligent workforce analytics.
          </p>
          <Link href="/dashboard">
            <Button>
              Enter the platform <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative z-10 border-t border-bg-border/60 py-6 text-center text-xs text-fg/40">
        Bravo Opsis Workforce Intelligence — Hackathon MVP · Simulated operational
        intelligence layer
      </footer>
    </div>
  );
}
