"use client";

import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  Mail,
  Clock,
  Zap,
  Building2,
  User,
  BarChart3,
  Settings,
} from "lucide-react";

const mockLeads = [
  { name: "NovaPay", contact: "Sarah Chen" },
  { name: "CloudVault", contact: "James Rodriguez" },
  { name: "FinLeap", contact: "Priya Sharma" },
  { name: "PayStream", contact: "Michael Park" },
  { name: "LedgerBase", contact: "Anna Kowalski" },
  { name: "TrustPay", contact: "David Liu" },
  { name: "SecureOps", contact: "Rachel Kim" },
  { name: "DataSync", contact: "Tom Fischer" },
];

const quickActions = [
  { label: "Email all healthcare leads", icon: Mail },
  { label: "Show leads not touched in 14 days", icon: Clock },
  { label: "Run discovery for Series B fintech", icon: Zap },
  { label: "View pipeline analytics", icon: BarChart3 },
  { label: "Open settings", icon: Settings },
];

const recentActions = [
  { label: "Searched: fintech leads", icon: Search },
  { label: "Emailed Sarah Chen at NovaPay", icon: Mail },
  { label: "Moved CloudVault to Demo Booked", icon: Building2 },
];

export function CommandBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-xl">
        <CommandInput placeholder="Search leads, run actions..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Leads">
            {mockLeads.map((lead) => (
              <CommandItem
                key={lead.name}
                onSelect={() => setOpen(false)}
              >
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{lead.contact}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {lead.name}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.label}
                onSelect={() => setOpen(false)}
              >
                <action.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Recent">
            {recentActions.map((action) => (
              <CommandItem
                key={action.label}
                onSelect={() => setOpen(false)}
              >
                <action.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
