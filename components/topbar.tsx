"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Topbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-bg-border/60 bg-bg/70 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-6 lg:px-8 py-4">
        <MobileNav />
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-fg truncate">{title}</h1>
          {subtitle && <p className="text-xs text-fg/55 mt-0.5 truncate">{subtitle}</p>}
        </div>
        <div className="ml-auto flex items-center gap-3">
          {action}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-bg-border/80 bg-bg-card/60 px-3 py-2 w-64">
            <Search size={14} className="text-fg/50" />
            <input
              placeholder="Search branches, SKUs, employees…"
              className="bg-transparent text-sm text-fg placeholder:text-fg/40 outline-none w-full"
            />
          </div>
          <ThemeToggle />
          <button className="relative h-10 w-10 rounded-xl border border-bg-border/80 bg-bg-card/60 grid place-items-center text-fg/70 hover:text-fg">
            <Bell size={16} />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-accent-pink" />
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-bg-border/80 bg-bg-card/60 pl-2 pr-3 py-1.5">
            <div className="h-7 w-7 rounded-lg bg-grad-brand grid place-items-center text-[11px] font-semibold text-white">
              BR
            </div>
            <div className="text-xs leading-tight">
              <p className="text-fg font-medium">Bravo Opsis</p>
              <p className="text-fg/50">Regional Manager</p>
            </div>

            <ChevronDown size={14} className="text-fg/40" />
          </div>
        </div>
      </div>
    </header>
  );
}
