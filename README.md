# Bravo AI — Workforce Intelligence Platform

AI-powered retail **workforce optimization & waste-reduction** system for supermarket
frontline operations. The platform turns employee execution into measurable
operational intelligence — predicting spoilage risk, generating adaptive
department KPIs, enforcing FIFO compliance, and benchmarking performance across
branches.

> Hackathon MVP. The "AI" layer is a deterministic rule-based simulation over a
> static dataset, so every demo is reproducible.

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

```bash
npm run build && npm start   # production build
```

Requires Node.js 18.18+ (Next.js 14).

---

## What's inside

Targets frontline departments only — **Meat, Fish, Bakery, Dairy, Vegetables,
Shelf, Inventory** (Finance/HR/Marketing are intentionally excluded — they don't
drive spoilage or operational waste).

| Route | Module |
|---|---|
| `/` | Landing — overview & entry point |
| `/dashboard` | **Executive Waste Intelligence** — spoilage trend vs. AI forecast, branch ranking, risk feed, projected savings |
| `/kpis` | **AI Dynamic KPI Engine** — adaptive, department-specific goals with on-track status |
| `/risk` | **Waste Risk Detection** — spoilage risk scores, distribution & operational warning feed |
| `/fifo` | **FIFO Compliance** — branch × department compliance matrix + rotation alerts |
| `/missions` | **Daily Operational Missions** — prioritized actions ranked by spoilage urgency |
| `/leaderboard` | **Cross-Branch Competition** — league table, goal-driven **bonus pools**, per-employee rewards |
| `/productivity` | **Productivity Intelligence** — weighted composite score breakdown |
| `/tools` | **AI Toolkit** — 6 interactive calculators (below) |

### AI Toolkit (`/tools/*`)

Self-contained input → compute → result tools, all in AZN:

| Route | Tool |
|---|---|
| `/tools/waste-predictor` | Waste Risk Predictor — expected unsold qty, risk %, estimated loss |
| `/tools/goal-generator` | AI Goal Generator — 4–6 period-based department goals |
| `/tools/bonus-calculator` | Bonus Calculator — department score → pool → per-employee bonus |
| `/tools/task-engine` | Task Recommendation Engine — prioritized operational missions |
| `/tools/ranking-simulator` | Cross-Branch Ranking Simulator — editable branch table, top-3 qualify |
| `/tools/roi-simulator` | What-If ROI Simulator — waste cost, savings, net benefit, ROI % |

All six calculation functions live in [`lib/calculators.ts`](lib/calculators.ts)
as pure, testable functions.

### Incentive model

A department's bonus pool **unlocks only when it meets its AI productivity goal**
(score ≥ 72), then scales with how far it beats target and applies a
cross-branch rank multiplier (#1 ×1.6, #2 ×1.4, #3 ×1.2). The pool is split
across the team weighted by individual performance. See it on `/leaderboard`.

```
Productivity = 0.3·WasteReduction + 0.25·FIFO + 0.2·Turnover
             + 0.15·TaskEfficiency + 0.1·SalesGrowth
```

---

## Tech stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** with a CSS-variable theme system
- **Framer Motion** (animation) · **Recharts** (charts) · **lucide-react** (icons)

### Theming

Light & dark themes via the toggle in the top bar (and landing header). The
choice is persisted to `localStorage` and applied before first paint (no
flash). Colors, shadows and gradients are driven by CSS variables in
[`app/globals.css`](app/globals.css) — adjust the `:root` (light) and `.dark`
blocks to retune either theme.

---

## Project structure

```
app/                 Routes (one folder per screen) + root layout & globals.css
components/           UI: sidebar, topbar, mobile-nav, charts, theme-*, cards…
  ui/                 Primitives: button, card, badge, progress
lib/
  data.ts             Simulated branches / departments / employees / inventory
  ai-engine.ts        KPI, risk, mission, productivity & bonus logic
  utils.ts            cn(), currency(), pct()
```

All data is generated deterministically from a seeded hash in `lib/data.ts`, so
numbers are stable across reloads.
