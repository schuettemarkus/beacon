"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STAGES = ["New", "Contacted", "Engaged", "Demo Booked", "Proposal", "Closed"];

interface PipelineLead {
  id: string;
  company: string;
  fitScore: number;
  dealStage: string;
  dealValue: string | null;
  industry: string;
}

export default function PipelinePage() {
  const queryClient = useQueryClient();
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const { data: leads, isLoading } = useQuery<PipelineLead[]>({
    queryKey: ["pipeline-leads"],
    queryFn: async () => {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const grouped = await res.json();
      // Flatten all groups into a single array
      return [
        ...grouped.today,
        ...grouped.thisWeek,
        ...grouped.snoozed,
        ...grouped.closedWon,
        ...grouped.archived,
      ];
    },
  });

  const moveLead = useMutation({
    mutationFn: async ({ id, dealStage }: { id: string; dealStage: string }) => {
      const res = await fetch(`/api/leads/${id}/pipeline`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealStage }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onMutate: async ({ id, dealStage }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["pipeline-leads"] });
      queryClient.setQueryData<PipelineLead[]>(["pipeline-leads"], (old) =>
        old?.map((l) => (l.id === id ? { ...l, dealStage } : l))
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-leads"] });
    },
  });

  function handleDragStart(leadId: string) {
    setDraggedLead(leadId);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(stage: string) {
    if (draggedLead) {
      moveLead.mutate({ id: draggedLead, dealStage: stage });
      setDraggedLead(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4 py-6 px-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-x-auto">
          {STAGES.map((s) => (
            <Skeleton key={s} className="h-96 w-64 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-6 px-4">
      <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = (leads || []).filter((l) => l.dealStage === stage);

          return (
            <div
              key={stage}
              className="flex-shrink-0 w-64"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold">{stage}</h3>
                <Badge variant="secondary" className="text-xs">
                  {stageLeads.length}
                </Badge>
              </div>

              <div className="space-y-2 min-h-[300px] rounded-lg bg-muted/30 p-2">
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(lead.id)}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <Card className="p-3 hover:shadow-md transition-shadow">
                      <p className="text-sm font-medium truncate">
                        {lead.company}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {lead.industry}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          variant="secondary"
                          className={
                            lead.fitScore >= 80
                              ? "bg-emerald-100 text-emerald-700 text-[10px]"
                              : "text-[10px]"
                          }
                        >
                          Fit {lead.fitScore}
                        </Badge>
                        {lead.dealValue && (
                          <span className="text-[10px] text-muted-foreground">
                            {lead.dealValue}
                          </span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
