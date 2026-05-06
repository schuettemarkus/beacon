"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Loader2,
  Target,
  DollarSign,
  Calendar,
  Shield,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { WinPlan } from "@/services/account-planner-types";

interface Props {
  entryId: string;
  data: WinPlan | null;
  onGenerate: () => void;
  loading: boolean;
  canGenerate: boolean;
}

export function WinPlanDisplay({
  data,
  onGenerate,
  loading,
  canGenerate,
}: Props) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Target className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <h3 className="mb-2 text-lg font-medium">Win Plan</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          A 90-day action plan with revenue targets, stakeholder engagement, and
          competitive strategy tailored to this account.
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={canGenerate && !loading ? onGenerate : undefined}
              disabled={loading || !canGenerate}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Building win plan...
                </>
              ) : (
                "Generate Win Plan"
              )}
            </TooltipTrigger>
            {!canGenerate && (
              <TooltipContent>
                Run deep analysis and influence map first
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  function copyPlan() {
    if (!data) return;
    const lines: string[] = [];
    lines.push("WIN PLAN");
    lines.push("========");
    lines.push("");
    lines.push("EXECUTIVE SUMMARY");
    lines.push(data.executiveSummary);
    lines.push("");
    lines.push(`OBJECTIVE: ${data.accountObjective}`);
    lines.push(`REVENUE TARGET: ${data.revenueTarget}`);
    lines.push("");
    lines.push("TIMELINE");
    for (const phase of data.timeline) {
      lines.push(`${phase.phase} (${phase.duration})`);
      for (const action of phase.actions) {
        lines.push(`  - ${action}`);
      }
      lines.push("");
    }
    lines.push("COMPETITIVE STRATEGY");
    lines.push(data.competitiveStrategy);
    lines.push("");
    lines.push("VALUE PROPOSITION");
    lines.push(data.valueProposition);
    lines.push("");
    lines.push("STAKEHOLDER ENGAGEMENT");
    for (const s of data.stakeholderEngagementPlan) {
      lines.push(`  ${s.name} | ${s.action} | ${s.timing}`);
    }
    lines.push("");
    lines.push("RISKS & MITIGATIONS");
    for (const r of data.risksMitigations) {
      lines.push(`  Risk: ${r.risk}`);
      lines.push(`  Mitigation: ${r.mitigation}`);
      lines.push("");
    }
    lines.push("NEXT STEPS");
    for (const n of data.nextSteps) {
      lines.push(`  [ ] ${n.action} (${n.dueDate})`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopySuccess(true);
    toast.success("Win plan copied to clipboard");
    setTimeout(() => setCopySuccess(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Win Plan</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyPlan}
          className="gap-1.5"
        >
          {copySuccess ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Copy Plan
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.executiveSummary}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="flex items-start gap-3 pt-4">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Account Objective
              </p>
              <p className="mt-1 text-sm">{data.accountObjective}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 pt-4">
            <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Revenue Target
              </p>
              <p className="mt-1 text-sm font-semibold">{data.revenueTarget}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h4 className="mb-3 flex items-center gap-2 text-sm font-medium">
          <Calendar className="h-4 w-4" />
          90-Day Timeline
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          {data.timeline.map((phase, i) => (
            <div key={i} className="relative">
              <Card className="h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium">
                    {phase.phase}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit text-[10px]">
                    {phase.duration}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1.5">
                    {phase.actions.map((action, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              {i < data.timeline.length - 1 && (
                <div className="absolute top-1/2 -right-2 hidden -translate-y-1/2 md:block">
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Competitive Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {data.competitiveStrategy}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Value Proposition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {data.valueProposition}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Stakeholder Engagement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="pb-2 pr-4 text-left font-medium">Name</th>
                    <th className="pb-2 pr-4 text-left font-medium">Action</th>
                    <th className="pb-2 text-left font-medium">Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stakeholderEngagementPlan.map((s, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{s.name}</td>
                      <td className="py-2 pr-4 text-muted-foreground">
                        {s.action}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-[10px]">
                          {s.timing}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Risks & Mitigations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.risksMitigations.map((r, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-red-500/5 px-3 py-2">
                    <p className="text-[10px] font-medium text-red-600">Risk</p>
                    <p className="text-xs text-muted-foreground">{r.risk}</p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/5 px-3 py-2">
                    <p className="text-[10px] font-medium text-emerald-600">
                      Mitigation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {data.successMetrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {data.successMetrics.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <CheckSquare className="h-4 w-4" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.nextSteps.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[10px] text-muted-foreground">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-xs">{step.action}</span>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {step.dueDate}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
