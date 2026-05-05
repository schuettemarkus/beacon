"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DailyBriefing } from "@/components/inbox/daily-briefing";
import { LeadGroup } from "@/components/inbox/lead-group";
import { InboxSkeleton } from "@/components/inbox/inbox-skeleton";

export default function InboxPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      return res.json();
    },
  });

  const totalCount = data
    ? data.today.length + data.thisWeek.length + data.snoozed.length
    : 0;

  return (
    <div className="relative mx-auto w-full max-w-2xl space-y-6 px-4 py-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Inbox
        </h1>
        {!isLoading && totalCount > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {totalCount}
          </span>
        )}
      </div>

      {isLoading ? (
        <InboxSkeleton />
      ) : data ? (
        <div className="space-y-6">
          {data.today.length > 0 && <DailyBriefing todayLeads={data.today} />}
          <LeadGroup title="Today" leads={data.today} defaultOpen />
          <LeadGroup title="This Week" leads={data.thisWeek} defaultOpen />
          <LeadGroup title="Snoozed" leads={data.snoozed} defaultOpen={false} />
        </div>
      ) : null}

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05, boxShadow: "0 12px 40px rgba(0,0,0,0.15)" }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="h-14 w-14 rounded-full shadow-lg"
          aria-label="Find me leads"
        >
          <Plus className="size-6" />
        </Button>
      </motion.div>
    </div>
  );
}
