"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Lead } from "./lead-card";

interface DailyBriefingProps {
  todayLeads: Lead[];
}

export function DailyBriefing({ todayLeads }: DailyBriefingProps) {
  const [expanded, setExpanded] = useState(false);

  const hotLeads = todayLeads.filter((l) => l.fitScore >= 80).length;
  const followUps = todayLeads.filter((l) => l.status === "follow_up").length;
  const funded = todayLeads.filter((l) =>
    l.signals.some((s) => s.title.toLowerCase().includes("fund"))
  ).length;

  const summaryParts: string[] = [];
  if (hotLeads > 0) summaryParts.push(`${hotLeads} hot lead${hotLeads > 1 ? "s" : ""}`);
  if (followUps > 0) summaryParts.push(`${followUps} follow-up${followUps > 1 ? "s" : ""} due`);
  if (funded > 0) summaryParts.push(`${funded} lead${funded > 1 ? "s" : ""} just got funded`);

  const summary = summaryParts.length > 0
    ? summaryParts.join(", ")
    : `${todayLeads.length} leads to review today`;

  return (
    <Card className="relative overflow-visible border-0 bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-200/60">
      {/* Beacon pulse dot */}
      <div className="absolute -top-1 -right-1">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
        </span>
      </div>

      <CardContent className="space-y-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{summary}</span>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="size-4 text-blue-600" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-1.5 pt-2 border-t border-blue-200/60">
                <p className="text-xs text-blue-800 font-medium">
                  Today&apos;s plan
                </p>
                {hotLeads > 0 && (
                  <p className="text-xs text-blue-700">
                    Prioritize {hotLeads} high-fit lead{hotLeads > 1 ? "s" : ""} for outreach
                  </p>
                )}
                {followUps > 0 && (
                  <p className="text-xs text-blue-700">
                    Send {followUps} follow-up{followUps > 1 ? "s" : ""} before noon
                  </p>
                )}
                {funded > 0 && (
                  <p className="text-xs text-blue-700">
                    Research newly funded compan{funded > 1 ? "ies" : "y"} for timing
                  </p>
                )}
                {summaryParts.length === 0 && (
                  <p className="text-xs text-blue-700">
                    Review your leads and triage new prospects
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
