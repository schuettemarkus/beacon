"use client";

import { useState } from "react";
import {
  FileText,
  ShieldAlert,
  Bug,
  Users,
  TrendingUp,
  Building2,
  Shield,
  ClipboardCheck,
  Link,
  UserCog,
  Newspaper,
  ExternalLink,
  Pill,
  FlaskConical,
  Gavel,
  FileCheck,
  TrendingDown,
  Zap,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Signal {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  body: string;
  source?: string;
  sourceUrl?: string;
  capturedAt: string;
}

const typeIconMap: Record<string, LucideIcon> = {
  regulatory: FileText,
  peer_breach: ShieldAlert,
  industry_breach: ShieldAlert,
  tech_vuln: Bug,
  hiring: Users,
  funding: TrendingUp,
  ma: Building2,
  insurance: Shield,
  compliance_audit: ClipboardCheck,
  supply_chain: Link,
  exec_change: UserCog,
  news: Newspaper,
  fda_action: Pill,
  clinical_trial: FlaskConical,
  compliance_fine: Gavel,
  contract_award: FileCheck,
  labor_law_change: Gavel,
  workforce_trend: TrendingDown,
  privacy_change: Shield,
  platform_update: Zap,
  court_ruling: Gavel,
  law_firm_merger: Building2,
  fraud_incident: AlertTriangle,
  market_shift: TrendingUp,
  hipaa_incident: ShieldAlert,
};

const severityBorderColors = {
  critical: "border-l-red-500",
  high: "border-l-orange-500",
  medium: "border-l-yellow-500",
  low: "border-l-zinc-400",
};

const severityBadgeColors = {
  critical: "bg-red-500/10 text-red-600",
  high: "bg-orange-500/10 text-orange-600",
  medium: "bg-yellow-500/10 text-yellow-700",
  low: "bg-zinc-500/10 text-zinc-500",
};

const typeLabels: Record<string, string> = {
  regulatory: "Regulatory",
  peer_breach: "Peer Breach",
  industry_breach: "Industry Breach",
  tech_vuln: "Vulnerability",
  hiring: "Hiring",
  funding: "Funding",
  ma: "M&A",
  insurance: "Insurance",
  compliance_audit: "Compliance",
  supply_chain: "Supply Chain",
  exec_change: "Leadership",
  news: "News",
};

export function SignalItem({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIconMap[signal.type] || Newspaper;

  return (
    <div
      className={`rounded-lg border border-l-4 bg-card transition-shadow hover:shadow-sm ${severityBorderColors[signal.severity]} cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="mt-0.5 rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-medium">{signal.title}</h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${severityBadgeColors[signal.severity]}`}
            >
              {signal.severity}
            </span>
            {typeLabels[signal.type] && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {typeLabels[signal.type]}
              </span>
            )}
          </div>

          {!expanded && (
            <p className="line-clamp-1 text-xs text-muted-foreground mt-1">
              {signal.body}
            </p>
          )}

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {signal.body}
                </p>

                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(signal.capturedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {signal.source && !signal.sourceUrl && (
                    <span className="text-xs text-muted-foreground">
                      {signal.source}
                    </span>
                  )}
                  {signal.sourceUrl && (
                    <a
                      href={signal.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {signal.source || "View Source"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </div>
    </div>
  );
}
