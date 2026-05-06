"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from "lucide-react";
import { TerritoryPlaybookView } from "@/components/account-planner/territory-playbook";
import type { TerritoryPlaybook } from "@/services/account-planner-types";

export default function AccountPlannerPage() {
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: playbook, isLoading } = useQuery<TerritoryPlaybook | null>({
    queryKey: ["territory-playbook"],
    queryFn: async () => {
      const res = await fetch("/api/account-planner/territory");
      if (!res.ok) throw new Error("Failed to fetch playbook");
      return res.json();
    },
  });

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/account-planner/territory", {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Failed to generate playbook");
      }
      await queryClient.invalidateQueries({ queryKey: ["territory-playbook"] });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-lg">
          Analyzing territories...
        </p>
        <p className="text-muted-foreground text-sm">
          This may take a minute while we research each state.
        </p>
      </div>
    );
  }

  if (!playbook) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground/50" />
          <h1 className="text-2xl font-bold">Account Planner</h1>
          <p className="text-muted-foreground max-w-md">
            Generate a territory playbook to identify top accounts across your
            states.
          </p>
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        <Button size="lg" onClick={generate}>
          Generate Territory Playbook
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Planner</h1>
        <Button variant="outline" onClick={generate} disabled={generating}>
          {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Regenerate
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <TerritoryPlaybookView playbook={playbook} />
    </div>
  );
}
