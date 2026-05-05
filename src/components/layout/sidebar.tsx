"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Inbox,
  Compass,
  Sparkles,
  Timer,
  Kanban,
  BarChart3,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BeaconLogo } from "@/components/layout/beacon-logo";

const navItems = [
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/research", label: "Research", icon: Sparkles },
  { href: "/cadences", label: "Cadences", icon: Timer },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  function toggleDarkMode() {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(!isDark);
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-border bg-card shadow-[1px_0_3px_0_rgba(0,0,0,0.04)] lg:w-56">
      {/* Brand */}
      <div className="flex h-16 items-center justify-center lg:justify-start lg:px-5">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <BeaconLogo size={28} />
          <span className="hidden text-lg font-semibold tracking-tight lg:inline">
            Beacon
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 lg:px-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-primary/8"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 h-5 w-5 shrink-0" />
                <span className="relative z-10 hidden lg:inline">
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Dark mode toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:justify-start"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="hidden lg:inline">
            {isDark ? "Light mode" : "Dark mode"}
          </span>
        </button>
      </div>
    </aside>
  );
}
