"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Compass,
  Sparkles,
  Target,
  Timer,
  Kanban,
  BarChart3,
} from "lucide-react";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { useUser } from "@/app/providers";

const navItems = [
  { href: "/", label: "Leads", icon: Users },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/research", label: "Research", icon: Sparkles },
  { href: "/account-planner", label: "Planner", icon: Target },
  { href: "/cadences", label: "Cadences", icon: Timer },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useUser();

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden md:flex w-16 flex-col border-r border-border bg-card shadow-[1px_0_3px_0_rgba(0,0,0,0.04)] lg:w-56">
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
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {active && (
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

        {/* User profile */}
        {user && (
          <div className="border-t border-border p-2 lg:p-3">
            <Link href="/profile">
              <motion.div
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === "/profile" || pathname === "/settings"
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {getInitials(user.name)}
                </div>
                <div className="relative z-10 hidden min-w-0 lg:block">
                  <p className="truncate text-sm font-medium leading-tight">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex md:hidden items-center justify-around border-t border-border bg-card/95 backdrop-blur-md px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {user && (
          <Link
            href="/profile"
            className={`relative flex flex-col items-center gap-0.5 px-2 py-2.5 text-[10px] font-medium transition-colors ${
              pathname === "/profile" || pathname === "/settings"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[8px] font-semibold text-primary-foreground">
              {getInitials(user.name)}
            </div>
            <span>Profile</span>
          </Link>
        )}
      </nav>
    </>
  );
}
