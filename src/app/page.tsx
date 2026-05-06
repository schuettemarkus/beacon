"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DailyBriefing } from "@/components/inbox/daily-briefing";
import { WeeklyDigestCard } from "@/components/digest/weekly-digest-card";
import { LeadGroup } from "@/components/inbox/lead-group";
import { InboxSkeleton } from "@/components/inbox/inbox-skeleton";
import { BulkActionBar } from "@/components/inbox/bulk-action-bar";
import { Onboarding } from "@/components/layout/onboarding";

export default function InboxPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  // Listen for onboarding dismissal via localStorage
  useEffect(() => {
    const check = () => {
      setOnboardingDismissed(
        localStorage.getItem("beacon_onboarding_done") === "true",
      );
    };
    check();
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const bulkMutation = useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: string[];
      status: string;
    }) => {
      await Promise.all(
        ids.map((id) =>
          fetch(`/api/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          }),
        ),
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["digest"] });
      setSelectedLeads(new Set());
      const label = variables.status === "archived" ? "archived" : "snoozed";
      toast.success(`${variables.ids.length} lead(s) ${label}`);
    },
    onError: () => {
      toast.error("Failed to update leads");
    },
  });

  const toggleSelect = useCallback((id: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleBulkAction = (action: string) => {
    const ids = Array.from(selectedLeads);
    if (action === "archive") {
      bulkMutation.mutate({ ids, status: "archived" });
    } else if (action === "snooze") {
      bulkMutation.mutate({ ids, status: "snoozed" });
    }
  };

  const totalCount = data
    ? data.today.length + data.thisWeek.length + data.snoozed.length
    : 0;

  const selectable = selectedLeads.size > 0;

  // Show onboarding when inbox is empty and user hasn't dismissed it
  const showOnboarding =
    !isLoading &&
    data &&
    data.today.length === 0 &&
    data.thisWeek.length === 0 &&
    data.snoozed.length === 0 &&
    !onboardingDismissed;

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leads
        </h1>
        {!isLoading && totalCount > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {totalCount}
          </span>
        )}
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => window.open("/api/leads/export")}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <InboxSkeleton />
      ) : showOnboarding ? (
        <Onboarding />
      ) : data ? (
        <div className="space-y-6">
          <WeeklyDigestCard onLeadClick={(id) => router.push(`/leads/${id}`)} />
          {data.today.length > 0 && <DailyBriefing todayLeads={data.today} />}
          <LeadGroup
            title="Today"
            leads={data.today}
            defaultOpen
            selectable={selectable}
            selectedIds={selectedLeads}
            onToggleSelect={toggleSelect}
          />
          <LeadGroup
            title="This Week"
            leads={data.thisWeek}
            defaultOpen
            selectable={selectable}
            selectedIds={selectedLeads}
            onToggleSelect={toggleSelect}
          />
          <LeadGroup
            title="Snoozed"
            leads={data.snoozed}
            defaultOpen={false}
            selectable={selectable}
            selectedIds={selectedLeads}
            onToggleSelect={toggleSelect}
          />
        </div>
      ) : null}

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedLeads.size > 0 && (
          <BulkActionBar
            selectedIds={Array.from(selectedLeads)}
            onClear={() => setSelectedLeads(new Set())}
            onAction={handleBulkAction}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed right-6 z-50 ${selectedLeads.size > 0 ? "bottom-28 md:bottom-28" : "bottom-20 md:bottom-6"}`}
        whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="Find me leads"
          onClick={() => router.push("/discover")}
        >
          <Plus className="size-6" />
        </Button>
      </motion.div>
    </div>
  );
}
