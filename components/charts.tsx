"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Mid-tones chosen to stay vivid on dark and remain legible on white.
const BRAND = "#7c5cff";
const PINK = "#f0468a";
const TEAL = "#16bd92";
const AMBER = "#f0991f";
const RED = "#ef5350";

/** Mini sparkline used inside cards / table rows. */
export function Sparkline({
  data,
  color = BRAND,
  height = 40,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const series = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={series} margin={{ top: 4, bottom: 4, left: 0, right: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/** Dual-series spoilage vs. AI forecast area chart for the executive dashboard. */
export function SpoilageForecastChart({
  data,
}: {
  data: { day: string; spoilage: number; forecast: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gSpoil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PINK} stopOpacity={0.45} />
            <stop offset="100%" stopColor={PINK} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gFore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={BRAND} stopOpacity={0.4} />
            <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="spoilage"
          name="Actual spoilage %"
          stroke={PINK}
          strokeWidth={2}
          fill="url(#gSpoil)"
        />
        <Area
          type="monotone"
          dataKey="forecast"
          name="AI forecast %"
          stroke={BRAND}
          strokeWidth={2}
          strokeDasharray="5 4"
          fill="url(#gFore)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Ranked bar chart (productivity by branch etc.), color-coded by score band. */
export function RankedBars({
  data,
  dataKey = "value",
  height = 300,
}: {
  data: { label: string; value: number }[];
  dataKey?: string;
  height?: number;
}) {
  const tone = (v: number) =>
    v >= 85 ? TEAL : v >= 72 ? BRAND : v >= 60 ? AMBER : RED;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={36} domain={[0, 100]} />
        <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey={dataKey} radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={tone(d.value)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 7-day department trend area used on KPI / productivity pages. */
export function TrendArea({
  data,
  color = TEAL,
  height = 200,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const series = data.map((v, i) => ({ day: `D${i + 1}`, v }));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={series} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gTrend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={36} domain={[40, 100]} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="v"
          name="Productivity"
          stroke={color}
          strokeWidth={2}
          fill="url(#gTrend)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
