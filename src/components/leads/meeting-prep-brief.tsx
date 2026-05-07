"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Copy, Check, Loader2, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MeetingBrief {
  companyOverview: string;
  stakeholders: { name: string; title: string; relevance: string }[];
  recentSignals: string[];
  discoveryQuestions: string[];
  objectionHandlers: { objection: string; response: string }[];
  competitiveLandscape: string[];
  suggestedAgenda: { minutes: number; topic: string }[];
}

export function MeetingPrepBrief({ leadId }: { leadId: string }) {
  const [copied, setCopied] = useState(false);

  const { data: brief, isLoading: loading, error, refetch } = useQuery<MeetingBrief>({
    queryKey: ["meeting-prep", leadId],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/meeting-prep`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate brief");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: false,
  });

  function copyToClipboard() {
    if (!brief) return;
    const lines: string[] = [];
    lines.push("MEETING PREP BRIEF\n");
    lines.push("== Company Overview ==");
    lines.push(brief.companyOverview + "\n");
    lines.push("== Key Stakeholders ==");
    brief.stakeholders.forEach((s) =>
      lines.push(`• ${s.name} — ${s.title}: ${s.relevance}`)
    );
    lines.push("");
    lines.push("== Recent Signals ==");
    brief.recentSignals.forEach((s) => lines.push(`• ${s}`));
    lines.push("");
    lines.push("== Discovery Questions ==");
    brief.discoveryQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
    lines.push("");
    lines.push("== Objection Handlers ==");
    brief.objectionHandlers.forEach((o) =>
      lines.push(`Objection: ${o.objection}\nResponse: ${o.response}\n`)
    );
    lines.push("== Competitive Landscape ==");
    brief.competitiveLandscape.forEach((c) => lines.push(`• ${c}`));
    lines.push("");
    lines.push("== Suggested Agenda (30 min) ==");
    brief.suggestedAgenda.forEach((a) =>
      lines.push(`[${a.minutes} min] ${a.topic}`)
    );

    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Preparing your meeting brief...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <p className="text-sm text-destructive">{(error as Error).message}</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!brief) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pt-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Meeting Prep Brief</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1.5" onClick={copyToClipboard}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-1 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Company Overview
          </p>
          <p className="text-sm">{brief.companyOverview}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Key Stakeholders
          </p>
          <div className="space-y-2">
            {brief.stakeholders.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <Badge variant="secondary" className="shrink-0 text-[10px]">
                  {s.title}
                </Badge>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.relevance}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {brief.recentSignals.length > 0 && (
        <Card>
          <CardContent className="space-y-2 px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Recent Signals
            </p>
            <ul className="space-y-1">
              {brief.recentSignals.map((s, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-muted-foreground">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-2 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Discovery Questions
          </p>
          <ol className="space-y-1.5 list-decimal list-inside">
            {brief.discoveryQuestions.map((q, i) => (
              <li key={i} className="text-sm">
                {q}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Objection Handlers
          </p>
          <div className="space-y-3">
            {brief.objectionHandlers.map((o, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-medium text-destructive/80">
                  "{o.objection}"
                </p>
                <p className="text-sm text-muted-foreground">{o.response}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Competitive Landscape
          </p>
          <ul className="space-y-1">
            {brief.competitiveLandscape.map((c, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-muted-foreground">•</span>
                {c}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 px-4 py-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Suggested Agenda (30 min)
          </p>
          <div className="space-y-1.5">
            {brief.suggestedAgenda.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {a.minutes} min
                </Badge>
                <span>{a.topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
