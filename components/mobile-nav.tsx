"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "./nav-items";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-bg-border/80 bg-bg-card/60 text-fg/70 hover:text-fg lg:hidden"
      >
        <Menu size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-bg-border/60 bg-bg-soft"
            >
              <div className="flex items-center justify-between border-b border-bg-border/60 px-5 py-5">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setOpen(false)}
                >
                  <img src="/logo.png" alt="Bravo Opsis" className="h-9 w-9 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-semibold leading-tight text-fg">
                      Bravo Opsis
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-fg/50">
                      Workforce Intelligence
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close navigation"
                  className="grid h-9 w-9 place-items-center rounded-lg text-fg/60 hover:bg-fg/5 hover:text-fg"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 space-y-5 overflow-y-auto p-3">
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
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                              active
                                ? "bg-fg/10 text-fg shadow-soft"
                                : "text-fg/65 hover:bg-fg/5 hover:text-fg"
                            )}
                          >
                            <Icon
                              size={16}
                              className={cn(
                                active ? "text-brand-300" : "text-fg/50"
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                            {active && (
                              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
              <div className="m-3 rounded-xl border border-bg-border/80 bg-grad-soft p-4">
                <p className="text-xs font-medium text-fg">AI Engine Online</p>
                <p className="mt-1 text-[11px] text-fg/60">
                  Simulated intelligence layer is actively scanning all 5
                  branches.
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
