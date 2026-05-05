"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function logActivity(leadId: string, kind: string, payload: any = {}) {
  fetch(`/api/leads/${leadId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, payload }),
  }).catch(() => {});
}

export function useLeadActions(leadId: string, company: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
    queryClient.invalidateQueries({ queryKey: ["pipeline-leads"] });
  }

  const snooze = useMutation({
    mutationFn: async (days: number = 1) => {
      const snoozedUntil = new Date();
      snoozedUntil.setDate(snoozedUntil.getDate() + days);
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "snoozed", snoozedUntil: snoozedUntil.toISOString() }),
      });
      if (!res.ok) throw new Error("Failed to snooze");
      return res.json();
    },
    onSuccess: (_, days) => {
      invalidate();
      logActivity(leadId, "snoozed", { days });
      toast.success(`Snoozed ${company}`, {
        description: `Will reappear in ${days} day${days > 1 ? "s" : ""}`,
      });
    },
  });

  const archive = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) throw new Error("Failed to archive");
      return res.json();
    },
    onSuccess: () => {
      invalidate();
      logActivity(leadId, "archived");
      toast.success(`Archived ${company}`, {
        action: {
          label: "Undo",
          onClick: () => {
            fetch(`/api/leads/${leadId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "today" }),
            }).then(() => {
              invalidate();
              logActivity(leadId, "unarchived");
              toast.success(`Restored ${company}`);
            });
          },
        },
      });
    },
  });

  function goToEmails() {
    router.push(`/leads/${leadId}?tab=emails`);
  }

  function goToLead() {
    router.push(`/leads/${leadId}`);
  }

  return {
    snooze: (days: number = 1) => snooze.mutate(days),
    archive: () => archive.mutate(),
    goToEmails,
    goToLead,
    isLoading: snooze.isPending || archive.isPending,
  };
}
