"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
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
  BarChart3,
  Settings,
} from "lucide-react";

const quickActions = [
  { label: "Email all healthcare leads", icon: Mail, href: "/discover" },
  { label: "Show leads not touched in 14 days", icon: Clock, href: "/" },
  { label: "Run discovery for Series B fintech", icon: Zap, href: "/discover" },
  { label: "View pipeline analytics", icon: BarChart3, href: "/analytics" },
  { label: "Open settings", icon: Settings, href: "/profile" },
];

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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

  const handleSearch = useCallback(async (value: string) => {
    setSearchQuery(value);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/leads/search?q=${encodeURIComponent(value)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.slice(0, 6));
      }
    } catch {
      // ignore search errors
    }
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search leads, run actions..."
        value={searchQuery}
        onValueChange={handleSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {searchResults.length > 0 && (
          <CommandGroup heading="Leads">
            {searchResults.map((lead: any) => (
              <CommandItem
                key={lead.id}
                onSelect={() => {
                  setOpen(false);
                  router.push(`/leads/${lead.id}`);
                }}
              >
                <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{lead.company}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {lead.industry}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.label}
              onSelect={() => {
                setOpen(false);
                router.push(action.href);
              }}
            >
              <action.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent">
          <CommandItem onSelect={() => { setOpen(false); router.push("/research"); }}>
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Research a company</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
