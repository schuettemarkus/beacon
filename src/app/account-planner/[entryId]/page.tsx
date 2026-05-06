"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  Loader2,
  MapPin,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DeepAnalysisView } from "@/components/account-planner/deep-analysis-view";
import { InfluenceMapViz } from "@/components/account-planner/influence-map-viz";
import { WinPlanDisplay } from "@/components/account-planner/win-plan-display";
import type { DeepAccountAnalysis, InfluenceMap, WinPlan } from "@/services/account-planner-types";

function rankColor(rank: number) {
  if (rank <= 3) return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (rank <= 10) return "bg-amber-500/10 text-amber-600 border-amber-500/20";
  return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
}

function statusColor(status: string) {
  switch (status) {
    case "researched":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "engaged":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
  }
}

export default function AccountPlanEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const queryClient = useQueryClient();

  const { data: entry, isLoading } = useQuery({
    queryKey: ["account-plan-entry", entryId],
    queryFn: async () => {
      const res = await fetch(`/api/account-planner/${entryId}`);
      if (!res.ok) throw new Error("Failed to fetch entry");
      return res.json();
    },
    enabled: !!entryId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Entry not found.</p>
      </div>
    );
  }

  const analysis: DeepAccountAnalysis | null = entry.deepAnalysis
    ? JSON.parse(entry.deepAnalysis)
    : null;
  const influenceMapData: InfluenceMap | null = entry.influenceMap
    ? JSON.parse(entry.influenceMap)
    : null;
  const winPlanData: WinPlan | null = entry.winPlan
    ? JSON.parse(entry.winPlan)
    : null;

  const [genInfluence, setGenInfluence] = useState(false);
  const [genWinPlan, setGenWinPlan] = useState(false);

  async function handleGenerateInfluenceMap() {
    setGenInfluence(true);
    try {
      const res = await fetch(`/api/account-planner/${entryId}/influence-map`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      queryClient.setQueryData(["account-plan-entry", entryId], (prev: any) =>
        prev ? { ...prev, influenceMap: JSON.stringify(data) } : prev
      );
    } catch { /* toast handled by component */ }
    finally { setGenInfluence(false); }
  }

  async function handleGenerateWinPlan() {
    setGenWinPlan(true);
    try {
      const res = await fetch(`/api/account-planner/${entryId}/win-plan`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      queryClient.setQueryData(["account-plan-entry", entryId], (prev: any) =>
        prev ? { ...prev, winPlan: JSON.stringify(data) } : prev
      );
    } catch { /* toast handled by component */ }
    finally { setGenWinPlan(false); }
  }

  function handleAnalysisGenerated(data: DeepAccountAnalysis) {
    queryClient.setQueryData(
      ["account-plan-entry", entryId],
      (prev: any) =>
        prev
          ? { ...prev, deepAnalysis: JSON.stringify(data), status: "researched" }
          : prev
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-6xl space-y-6 p-4 md:p-6"
    >
      <Link
        href="/account-planner"
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Account Planner
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{entry.company}</h1>
          <Badge variant="outline" className={statusColor(entry.status)}>
            {entry.status}
          </Badge>
          <Badge variant="outline" className={rankColor(entry.rank)}>
            #{entry.rank}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <MapPin className="mr-1 h-3 w-3" />
            {entry.state}
          </Badge>
          {entry.domain && (
            <a
              href={`https://${entry.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Globe className="h-3.5 w-3.5" />
              {entry.domain}
            </a>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="influence">Influence Map</TabsTrigger>
          <TabsTrigger value="winplan">Win Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Rank Justification
                </p>
                <p className="text-sm leading-relaxed">
                  {entry.rankJustification}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Domain
                </p>
                <a
                  href={`https://${entry.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {entry.domain}
                </a>
              </div>
              {entry.accountPlan && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Account Plan
                  </p>
                  <p className="text-sm">{entry.accountPlan.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {!analysis && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center gap-3 py-10">
                <p className="text-sm text-muted-foreground">
                  No deep analysis yet. Run one to surface actionable
                  intelligence.
                </p>
                <DeepAnalysisView
                  entryId={entryId}
                  analysis={null}
                  onAnalysisGenerated={handleAnalysisGenerated}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <DeepAnalysisView
            entryId={entryId}
            analysis={analysis}
            onAnalysisGenerated={handleAnalysisGenerated}
          />
        </TabsContent>

        <TabsContent value="influence" className="mt-6">
          <InfluenceMapViz
            entryId={entryId}
            data={influenceMapData}
            onGenerate={handleGenerateInfluenceMap}
            loading={genInfluence}
          />
        </TabsContent>

        <TabsContent value="winplan" className="mt-6">
          <WinPlanDisplay
            entryId={entryId}
            data={winPlanData}
            onGenerate={handleGenerateWinPlan}
            loading={genWinPlan}
            canGenerate={!!analysis && !!influenceMapData}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
