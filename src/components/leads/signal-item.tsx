"use client";

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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

export function SignalItem({ signal }: { signal: Signal }) {
  const Icon = typeIconMap[signal.type] || Newspaper;

  return (
    <div
      className={`rounded-lg border border-l-4 bg-card p-4 ${severityBorderColors[signal.severity]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">{signal.title}</h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${severityBadgeColors[signal.severity]}`}
            >
              {signal.severity}
            </span>
          </div>

          <p className="line-clamp-2 text-xs text-muted-foreground">
            {signal.body}
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span>
              {new Date(signal.capturedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {signal.sourceUrl && (
              <a
                href={signal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                {signal.source || "Source"}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
