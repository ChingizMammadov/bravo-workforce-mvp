"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { NAV_SECTIONS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-bg-border/60 bg-bg-soft/60 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-bg-border/60">
        <img src="/logo.png" alt="Bravo Opsis" className="h-9 w-9 rounded-xl object-cover" />
        <div>
          <p className="text-sm font-semibold text-fg leading-tight">Bravo Opsis</p>
          <p className="text-[10px] uppercase tracking-wider text-fg/50">Workforce Intelligence</p>
        </div>
      </Link>
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-fg/35">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      active
                        ? "bg-fg/10 text-fg shadow-soft"
                        : "text-fg/65 hover:bg-fg/5 hover:text-fg"
                    )}
                  >
                    <Icon size={16} className={cn(active ? "text-brand-300" : "text-fg/50")} />
                    <span className="truncate">{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="m-3 rounded-xl border border-bg-border/80 bg-grad-soft p-4">
        <p className="text-xs font-medium text-fg">AI Engine Online</p>
        <p className="text-[11px] text-fg/60 mt-1">
          Simulated intelligence layer is actively scanning all 5 branches.
        </p>
      </div>
    </aside>
  );
}
