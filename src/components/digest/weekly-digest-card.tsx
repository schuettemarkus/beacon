"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, TrendingUp, X, RefreshCw, Zap, CheckCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DigestData {
  id: string;
  topLeadsAdvice: { company: string; reason: string; nextAction?: string; urgency?: string }[];
  coldAlerts: { company: string; suggestedAction: string; daysInactive?: number }[];
  pipelineSummary: string;
  weeklyPriorities?: string[];
  signalHighlights?: { company: string; signal: string; opportunity: string }[];
  topLeads: { id: string; company: string; fitScore: number; dealValue?: string }[];
  coldLeads: { id: string; company: string }[];
  newSignalsCount: number;
  pipelineMovementCount: number;
  createdAt: string;
  readAt: string | null;
}

const urgencyColors = {
  today: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  this_week: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  schedule: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function WeeklyDigestCard({ onLeadClick }: { onLeadClick?: (id: string) => void }) {
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState(false);

  const { data: digest, isLoading: loading, isFetching } = useQuery<DigestData | null>({
    queryKey: ["digest"],
    queryFn: async () => {
      const res = await fetch("/api/digest");
      if (!res.ok) return null;
      const data = await res.json();
      if (data.digest && !data.digest.readAt) return data.digest;
      return null;
    },
    staleTime: 30 * 1000,
  });

  async function handleDismiss() {
    if (!digest) return;
    setDismissed(true);
    await fetch("/api/digest", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: digest.id }),
    });
    queryClient.invalidateQueries({ queryKey: ["digest"] });
  }

  if (loading || !digest || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-primary/20 bg-primary/5 mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Your Weekly Plan
              </CardTitle>
              <div className="flex items-center gap-1">
                {isFetching && <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
                <Button variant="ghost" size="icon" onClick={handleDismiss}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{digest.pipelineSummary}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Weekly Priorities */}
            {digest.weeklyPriorities && digest.weeklyPriorities.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  This Week&apos;s Priorities
                </h4>
                <div className="space-y-1.5">
                  {digest.weeklyPriorities.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Leads */}
            {digest.topLeadsAdvice.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Focus Accounts
                </h4>
                <div className="space-y-2">
                  {digest.topLeadsAdvice.map((item, i) => {
                    const lead = digest.topLeads[i];
                    return (
                      <div
                        key={item.company}
                        className="rounded-lg border bg-background p-3 cursor-pointer hover:shadow-sm transition-shadow"
                        onClick={() => lead && onLeadClick?.(lead.id)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{item.company}</span>
                          {lead?.fitScore && (
                            <Badge variant="secondary" className="text-[10px]">{lead.fitScore}</Badge>
                          )}
                          {lead?.dealValue && (
                            <Badge variant="outline" className="text-[10px] text-green-700 border-green-300">{lead.dealValue}</Badge>
                          )}
                          {item.urgency && (
                            <Badge className={`text-[10px] ${urgencyColors[item.urgency as keyof typeof urgencyColors] || urgencyColors.schedule}`}>
                              {item.urgency === "today" ? "Act Today" : item.urgency === "this_week" ? "This Week" : "Schedule"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.reason}</p>
                        {item.nextAction && (
                          <p className="text-xs font-medium text-primary mt-1">{item.nextAction}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Signal Highlights */}
            {digest.signalHighlights && digest.signalHighlights.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Signal Opportunities
                </h4>
                <div className="space-y-2">
                  {digest.signalHighlights.map((sh, i) => (
                    <div key={i} className="text-sm">
                      <span className="font-medium">{sh.company}</span>
                      <span className="text-muted-foreground"> — {sh.signal}</span>
                      <p className="text-xs text-primary mt-0.5">{sh.opportunity}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cold Alerts */}
            {digest.coldAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Going Cold
                </h4>
                <div className="space-y-1.5">
                  {digest.coldAlerts.map((item) => (
                    <div key={item.company} className="text-sm">
                      <span className="font-medium">{item.company}</span>
                      {item.daysInactive && (
                        <span className="text-muted-foreground text-xs ml-1">({item.daysInactive}d inactive)</span>
                      )}
                      <span className="text-muted-foreground"> — {item.suggestedAction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 text-xs text-muted-foreground pt-1 border-t">
              <span>{digest.newSignalsCount} new signals</span>
              <span>{digest.pipelineMovementCount} stage changes</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
