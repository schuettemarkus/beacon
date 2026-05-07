"use client";

import { useState } from "react";
import { ShieldAlert, Bug, ChevronDown, ExternalLink } from "lucide-react";
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

interface ThreatSurfaceProps {
  techStack: string[];
  signals: Signal[];
}

const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

const heatColors: Record<string, string> = {
  critical: "bg-red-500/10 border-red-500/40 text-red-600",
  high: "bg-orange-500/10 border-orange-500/40 text-orange-600",
  medium: "bg-yellow-500/10 border-yellow-500/40 text-yellow-700",
  low: "bg-zinc-500/10 border-zinc-500/30 text-zinc-600",
  none: "bg-muted border-border text-muted-foreground",
};

function getCvesForTech(tech: string, signals: Signal[]) {
  const lower = tech.toLowerCase();
  return signals.filter(
    (s) =>
      s.type === "tech_vuln" &&
      (s.title.toLowerCase().includes(lower) ||
        s.body.toLowerCase().includes(lower))
  );
}

function getMaxSeverity(
  cves: Signal[]
): "critical" | "high" | "medium" | "low" | "none" {
  if (cves.length === 0) return "none";
  return cves.reduce((max, cve) =>
    severityWeight[cve.severity] > severityWeight[max.severity] ? cve : max
  ).severity;
}

function ExpandableSignal({ signal }: { signal: Signal }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`rounded-md border-l-4 bg-muted/30 transition-shadow hover:shadow-sm cursor-pointer ${
        signal.severity === "critical"
          ? "border-l-red-500"
          : signal.severity === "high"
            ? "border-l-orange-500"
            : signal.severity === "medium"
              ? "border-l-yellow-500"
              : "border-l-zinc-400"
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium">{signal.title}</p>
          {!expanded && (
            <p className="line-clamp-2 text-[10px] text-muted-foreground">
              {signal.body}
            </p>
          )}
          {!expanded && signal.sourceUrl && (
            <a
              href={signal.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline font-medium mt-1"
              onClick={(e) => e.stopPropagation()}
            >
              {signal.source || "View Source"}
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
            signal.severity === "critical"
              ? "bg-red-500/10 text-red-600"
              : signal.severity === "high"
                ? "bg-orange-500/10 text-orange-600"
                : signal.severity === "medium"
                  ? "bg-yellow-500/10 text-yellow-700"
                  : "bg-zinc-500/10 text-zinc-500"
          }`}
        >
          {signal.severity}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
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
            <div className="px-3 pb-3 space-y-2">
              <div className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">
                {signal.body}
              </div>
              <div className="flex items-center flex-wrap gap-3 pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground">
                  {new Date(signal.capturedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {signal.source && (
                  <span className="text-[10px] text-muted-foreground font-medium">{signal.source}</span>
                )}
                {signal.sourceUrl && (
                  <a
                    href={signal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read Full Article
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ThreatSurface({ techStack, signals }: ThreatSurfaceProps) {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const techVulns = signals.filter((s) => s.type === "tech_vuln");
  const sortedBySignals = [...techStack].sort((a, b) => {
    const aCves = getCvesForTech(a, techVulns);
    const bCves = getCvesForTech(b, techVulns);
    const aMax = aCves.length > 0 ? severityWeight[getMaxSeverity(aCves) as keyof typeof severityWeight] || 0 : 0;
    const bMax = bCves.length > 0 ? severityWeight[getMaxSeverity(bCves) as keyof typeof severityWeight] || 0 : 0;
    return bMax - aMax;
  });

  return (
    <div className="space-y-6">
      {/* Signal summary */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-1.5">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <span className="text-xs font-medium text-red-600">
            {techVulns.filter((s) => s.severity === "critical").length} Critical
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-orange-500/10 px-3 py-1.5">
          <Bug className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-orange-600">
            {techVulns.filter((s) => s.severity === "high").length} High
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {techVulns.length} total vulnerabilities detected
        </span>
      </div>

      {/* Tech stack chips */}
      <div className="flex flex-wrap gap-2">
        {sortedBySignals.map((tech) => {
          const cves = getCvesForTech(tech, techVulns);
          const severity = getMaxSeverity(cves);
          const isHovered = hoveredTech === tech;

          return (
            <div key={tech} className="relative">
              <button
                onMouseEnter={() => setHoveredTech(tech)}
                onMouseLeave={() => setHoveredTech(null)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${heatColors[severity]} ${isHovered ? "ring-2 ring-ring/20" : ""}`}
              >
                {severity !== "none" && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      severity === "critical"
                        ? "bg-red-500"
                        : severity === "high"
                          ? "bg-orange-500"
                          : severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-zinc-400"
                    }`}
                  />
                )}
                {tech}
                {cves.length > 0 && (
                  <span className="text-[10px] opacity-70">({cves.length})</span>
                )}
              </button>

              {/* Hover card */}
              {isHovered && cves.length > 0 && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border bg-popover p-3 shadow-lg">
                  <p className="mb-2 text-xs font-semibold">
                    CVEs for {tech} ({cves.length})
                  </p>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {cves.map((cve) => (
                      <div
                        key={cve.id}
                        className="flex items-start gap-2 rounded-md bg-muted/50 p-2"
                      >
                        <span
                          className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                            cve.severity === "critical"
                              ? "bg-red-500"
                              : cve.severity === "high"
                                ? "bg-orange-500"
                                : cve.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-zinc-400"
                          }`}
                        />
                        <div>
                          <p className="text-xs font-medium">{cve.title}</p>
                          <p className="line-clamp-1 text-[10px] text-muted-foreground">
                            {cve.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Non-vuln signals sorted by severity */}
      {signals
        .filter((s) => s.type !== "tech_vuln")
        .sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity])
        .length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Industry & Business Signals</h3>
          <div className="space-y-2">
            {signals
              .filter((s) => s.type !== "tech_vuln")
              .sort(
                (a, b) =>
                  severityWeight[b.severity] - severityWeight[a.severity]
              )
              .map((signal) => (
                <ExpandableSignal key={signal.id} signal={signal} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
