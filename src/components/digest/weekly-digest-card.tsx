"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertTriangle, TrendingUp, X, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface DigestData {
  id: string;
  topLeadsAdvice: { company: string; reason: string }[];
  coldAlerts: { company: string; suggestedAction: string }[];
  pipelineSummary: string;
  topLeads: { id: string; company: string; fitScore: number }[];
  coldLeads: { id: string; company: string }[];
  newSignalsCount: number;
  pipelineMovementCount: number;
  createdAt: string;
  readAt: string | null;
}

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
    staleTime: 30 * 1000, // Refetch after 30s if leads changed
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
            <p className="text-sm text-muted-foreground">{digest.pipelineSummary}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {digest.topLeadsAdvice.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Focus This Week
                </h4>
                <div className="space-y-2">
                  {digest.topLeadsAdvice.map((item, i) => {
                    const lead = digest.topLeads[i];
                    return (
                      <div
                        key={item.company}
                        className="flex items-start gap-2 text-sm cursor-pointer hover:bg-muted/50 rounded p-1.5 -mx-1.5"
                        onClick={() => lead && onLeadClick?.(lead.id)}
                      >
                        <Badge variant="secondary" className="shrink-0">
                          {lead?.fitScore ?? "--"}
                        </Badge>
                        <div>
                          <span className="font-medium">{item.company}</span>
                          <span className="text-muted-foreground ml-1.5">{item.reason}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {digest.coldAlerts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Going Cold
                </h4>
                <div className="space-y-1.5">
                  {digest.coldAlerts.map((item) => (
                    <div key={item.company} className="text-sm">
                      <span className="font-medium">{item.company}</span>
                      <span className="text-muted-foreground ml-1.5">— {item.suggestedAction}</span>
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
