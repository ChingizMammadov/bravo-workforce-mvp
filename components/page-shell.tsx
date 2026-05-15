"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg text-fg relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-[40rem] bg-grid-fade" />
      <Sidebar />
      <div className="flex-1 min-w-0 relative">
        <Topbar title={title} subtitle={subtitle} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px] mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
