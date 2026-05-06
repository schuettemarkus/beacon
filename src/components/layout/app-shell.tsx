"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";

interface AppShellProps {
  children: ReactNode;
  detail?: ReactNode;
}

export function AppShell({ children, detail }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left rail */}
      <Sidebar />

      {/* Main content — no left margin on mobile (bottom nav), offset on md+ (sidebar) */}
      <main className="ml-0 md:ml-16 flex flex-1 overflow-hidden lg:ml-56">
        {/* Center pane — bottom padding on mobile for bottom nav */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-20 md:pb-6 md:px-8 lg:px-10">
          {children}
        </div>

        {/* Right detail drawer */}
        <AnimatePresence>
          {detail && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="hidden overflow-hidden border-l border-border bg-card shadow-[-2px_0_8px_0_rgba(0,0,0,0.03)] md:block"
            >
              <div className="h-full w-[420px] overflow-y-auto p-6">
                {detail}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
