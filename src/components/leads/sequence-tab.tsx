"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SequencePreview } from "./sequence-preview";

interface SequenceTabProps {
  leadId: string;
}

export function SequenceTab({ leadId }: SequenceTabProps) {
  const queryClient = useQueryClient();
  const [selectedCadenceId, setSelectedCadenceId] = useState<string>("");

  const { data: cadences, isLoading: cadencesLoading } = useQuery({
    queryKey: ["cadences"],
    queryFn: async () => {
      const res = await fetch("/api/cadences");
      if (!res.ok) throw new Error("Failed to fetch cadences");
      return res.json();
    },
  });

  const { data: sequenceData, isLoading: sequenceLoading } = useQuery({
    queryKey: ["lead-sequence", leadId],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${leadId}`);
      if (!res.ok) throw new Error("Failed to fetch lead");
      const lead = await res.json();
      if (!lead.sequences || lead.sequences.length === 0) return null;
      const latest = lead.sequences[lead.sequences.length - 1];
      return {
        ...latest,
        steps: typeof latest.steps === "string" ? JSON.parse(latest.steps) : latest.steps,
      };
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (cadenceId: string) => {
      const res = await fetch(`/api/leads/${leadId}/generate-sequence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadenceId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate sequence");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-sequence", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: async () => {
      if (!sequenceData) return;
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealStage: "Sequencing" }),
      });
      if (!res.ok) throw new Error("Failed to activate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["lead-sequence", leadId] });
    },
  });

  const [regeneratingStep, setRegeneratingStep] = useState<number | null>(null);

  async function handleRegenerate(stepIndex: number) {
    if (!sequenceData) return;
    setRegeneratingStep(stepIndex);
    try {
      const cadenceId = selectedCadenceId || cadences?.[0]?.id;
      if (!cadenceId) return;
      const res = await fetch(`/api/leads/${leadId}/generate-sequence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadenceId }),
      });
      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["lead-sequence", leadId] });
        queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      }
    } finally {
      setRegeneratingStep(null);
    }
  }

  if (sequenceLoading || cadencesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sequenceData && sequenceData.steps?.length > 0) {
    return (
      <div className="pt-4">
        <SequencePreview
          steps={sequenceData.steps}
          sequenceId={sequenceData.id}
          enrollmentId=""
          leadId={leadId}
          onActivate={() => activateMutation.mutate()}
          onRegenerate={handleRegenerate}
          isActivating={activateMutation.isPending}
          regeneratingStep={regeneratingStep}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        No active sequence. Select a cadence and generate personalized emails.
      </p>

      <div className="flex items-center gap-3">
        <Select value={selectedCadenceId} onValueChange={(val) => setSelectedCadenceId(val || "")}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a cadence" />
          </SelectTrigger>
          <SelectContent>
            {cadences?.map((c: any) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => generateMutation.mutate(selectedCadenceId)}
          disabled={!selectedCadenceId || generateMutation.isPending}
          className="gap-2"
        >
          {generateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          Generate Sequence
        </Button>
      </div>

      {generateMutation.isError && (
        <p className="text-sm text-red-500">
          {(generateMutation.error as Error).message}
        </p>
      )}
    </div>
  );
}
