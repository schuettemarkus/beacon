"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
} from "lucide-react";
import type {
  TerritoryPlaybook,
  StatePlaybook,
  StateAccount,
  OverallRanking,
} from "@/services/account-planner-types";

type RankedEntry = OverallRanking & { entryId?: string; growthTrend: StateAccount["growthTrend"] };

function GrowthBadge({ trend }: { trend: StateAccount["growthTrend"] }) {
  if (trend === "growing") {
    return (
      <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/25">
        <TrendingUp className="mr-1 h-3 w-3" />
        Growing
      </Badge>
    );
  }
  if (trend === "contracting") {
    return (
      <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/25">
        <TrendingDown className="mr-1 h-3 w-3" />
        Contracting
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/25">
      <Minus className="mr-1 h-3 w-3" />
      Stable
    </Badge>
  );
}

function StateCard({
  state,
  entryIdLookup,
}: {
  state: StatePlaybook;
  entryIdLookup: Map<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const topAccount = state.accounts[0];

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-bold">{state.state}</span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {state.accounts.length} accounts
        </p>
        {topAccount && !expanded && (
          <p className="text-sm mt-2 truncate">{topAccount.company}</p>
        )}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t pt-3">
              {state.accounts.map((account) => {
                const entryId = entryIdLookup.get(
                  `${account.company}-${state.state}`
                );
                return (
                  <div
                    key={account.domain}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">
                          {account.company}
                        </span>
                        <GrowthBadge trend={account.growthTrend} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {account.justification}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (entryId) router.push(`/account-planner/${entryId}`);
                      }}
                      disabled={!entryId}
                    >
                      View Details
                    </Button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function RankingTable({ ranking }: { ranking: RankedEntry[] }) {
  const router = useRouter();

  return (
    <div className="rounded-lg border">
      <div className="grid grid-cols-[3rem_1fr_8rem_8rem_1fr] gap-2 px-4 py-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
        <span>#</span>
        <span>Company</span>
        <span>State</span>
        <span>Trend</span>
        <span>Justification</span>
      </div>
      {ranking.map((item) => (
        <div
          key={`${item.company}-${item.state}`}
          className="grid grid-cols-[3rem_1fr_8rem_8rem_1fr] gap-2 px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors items-center"
          onClick={() => {
            if (item.entryId) {
              router.push(`/account-planner/${item.entryId}`);
            }
          }}
        >
          <span className="font-bold text-muted-foreground">
            {item.overallRank}
          </span>
          <span className="font-medium truncate">{item.company}</span>
          <span className="text-sm text-muted-foreground">{item.state}</span>
          <span>
            <GrowthBadge trend={item.growthTrend} />
          </span>
          <span className="text-sm text-muted-foreground truncate">
            {item.justification}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TerritoryPlaybookView({
  playbook,
}: {
  playbook: TerritoryPlaybook;
}) {
  const entryIdLookup = new Map<string, string>();
  const trendLookup = new Map<string, StateAccount["growthTrend"]>();

  for (const r of playbook.overallRanking as (OverallRanking & { entryId?: string })[]) {
    if (r.entryId) {
      entryIdLookup.set(`${r.company}-${r.state}`, r.entryId);
    }
  }

  for (const state of playbook.states) {
    for (const account of state.accounts) {
      trendLookup.set(`${account.company}-${state.state}`, account.growthTrend);
    }
  }

  const rankingWithTrends: RankedEntry[] = (
    playbook.overallRanking as (OverallRanking & { entryId?: string })[]
  ).map((r) => ({
    ...r,
    growthTrend: trendLookup.get(`${r.company}-${r.state}`) || "stable",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-4">States</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playbook.states.map((state) => (
            <StateCard
              key={state.state}
              state={state}
              entryIdLookup={entryIdLookup}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Overall Ranking</h2>
        <RankingTable ranking={rankingWithTrends} />
      </div>
    </div>
  );
}
