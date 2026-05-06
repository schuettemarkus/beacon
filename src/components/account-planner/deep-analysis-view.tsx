"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  ShieldAlert,
  Cpu,
  TrendingUp,
  Building2,
  Database,
  UserCog,
  Target,
  Copy,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DeepAccountAnalysis } from "@/services/account-planner-types";

interface DeepAnalysisViewProps {
  entryId: string;
  analysis: DeepAccountAnalysis | null;
  onAnalysisGenerated: (analysis: DeepAccountAnalysis) => void;
}

function analysisToPlainText(a: DeepAccountAnalysis): string {
  const lines: string[] = [];

  lines.push("=== KEY TALKING POINTS ===");
  a.annualReportTalkingPoints.forEach((p, i) => lines.push(`${i + 1}. ${p}`));

  lines.push("\n=== CYBER BREACHES ===");
  if (a.cyberBreaches.length === 0) lines.push("None found in past 2 years.");
  a.cyberBreaches.forEach((b) =>
    lines.push(`[${b.date}] ${b.description} — Impact: ${b.impact}`)
  );

  lines.push("\n=== IT & CYBER INITIATIVES ===");
  a.itInitiatives.forEach((i) =>
    lines.push(`${i.initiative} (${i.status}) — ${i.relevance}`)
  );

  lines.push("\n=== BUSINESS EXPANSIONS ===");
  a.businessExpansions.forEach((e) => lines.push(`- ${e}`));

  lines.push("\n=== ACQUISITIONS ===");
  if (a.acquisitions.length === 0) lines.push("None found.");
  a.acquisitions.forEach((ac) =>
    lines.push(`${ac.target} (${ac.date}) — ${ac.relevance}`)
  );

  lines.push("\n=== VENDOR INTEL ===");
  lines.push(`IT Vendors: ${a.vendorIntel.itVendors.join(", ")}`);
  lines.push(`Cyber Vendors: ${a.vendorIntel.cyberVendors.join(", ")}`);
  lines.push(`Source: ${a.vendorIntel.detectionSource}`);

  lines.push("\n=== LEADERSHIP CHANGES ===");
  if (a.leadershipChanges.length === 0) lines.push("None in past 12 months.");
  a.leadershipChanges.forEach((l) =>
    lines.push(
      `${l.name}: ${l.fromRole} -> ${l.toRole} (${l.date}) — ${l.significance}`
    )
  );

  lines.push("\n=== WIN STRATEGY ===");
  lines.push(`Approach: ${a.winStrategy.approach}`);
  lines.push(`Key Messages:`);
  a.winStrategy.keyMessages.forEach((m) => lines.push(`  - ${m}`));
  lines.push(`Timing: ${a.winStrategy.timingConsiderations}`);
  lines.push(`Risks:`);
  a.winStrategy.riskFactors.forEach((r) => lines.push(`  - ${r}`));

  return lines.join("\n");
}

export function DeepAnalysisView({
  entryId,
  analysis,
  onAnalysisGenerated,
}: DeepAnalysisViewProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runAnalysis() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/account-planner/${entryId}/deep-analysis`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      onAnalysisGenerated(data);
    } finally {
      setLoading(false);
    }
  }

  async function copyAll() {
    if (!analysis) return;
    await navigator.clipboard.writeText(analysisToPlainText(analysis));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Sparkles className="h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">
          Run a deep analysis to surface actionable intelligence on this account.
        </p>
        <Button onClick={runAnalysis} disabled={loading} size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Run Deep Analysis
            </>
          )}
        </Button>
      </div>
    );
  }

  const sections = [
    {
      key: "talking-points",
      icon: Megaphone,
      title: "Key Talking Points",
      content: (
        <ul className="space-y-2">
          {analysis.annualReportTalkingPoints.map((point, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="font-medium text-muted-foreground shrink-0">
                {i + 1}.
              </span>
              {point}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "breaches",
      icon: ShieldAlert,
      title: "Cyber Breaches",
      content:
        analysis.cyberBreaches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No breaches found in the past 2 years.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.cyberBreaches.map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {b.date}
                  </Badge>
                  <span className="text-sm font-medium">{b.description}</span>
                </div>
                <p className="text-sm text-muted-foreground pl-1">
                  Impact: {b.impact}
                </p>
              </div>
            ))}
          </div>
        ),
    },
    {
      key: "initiatives",
      icon: Cpu,
      title: "IT & Cyber Initiatives",
      content:
        analysis.itInitiatives.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No initiatives identified.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.itInitiatives.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {item.initiative}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground pl-1">
                  {item.relevance}
                </p>
              </div>
            ))}
          </div>
        ),
    },
    {
      key: "expansions",
      icon: TrendingUp,
      title: "Business Expansions",
      content:
        analysis.businessExpansions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expansions identified.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {analysis.businessExpansions.map((item, i) => (
              <li key={i} className="text-sm flex gap-2">
                <span className="text-muted-foreground shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
        ),
    },
    {
      key: "acquisitions",
      icon: Building2,
      title: "Acquisitions",
      content:
        analysis.acquisitions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No acquisitions found.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.acquisitions.map((a, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{a.target}</span>
                  <Badge variant="outline" className="text-xs">
                    {a.date}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground pl-1">
                  {a.relevance}
                </p>
              </div>
            ))}
          </div>
        ),
    },
    {
      key: "vendor-intel",
      icon: Database,
      title: "Vendor Intel",
      content: (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              IT Vendors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.vendorIntel.itVendors.map((v, i) => (
                <Badge key={i} variant="secondary">
                  {v}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Cyber Vendors
            </p>
            <div className="flex flex-wrap gap-1.5">
              {analysis.vendorIntel.cyberVendors.map((v, i) => (
                <Badge key={i} variant="outline">
                  {v}
                </Badge>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Source: {analysis.vendorIntel.detectionSource}
          </p>
        </div>
      ),
    },
    {
      key: "leadership",
      icon: UserCog,
      title: "Leadership Changes",
      content:
        analysis.leadershipChanges.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No changes in the past 12 months.
          </p>
        ) : (
          <div className="space-y-3">
            {analysis.leadershipChanges.map((l, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{l.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {l.fromRole} &rarr; {l.toRole}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {l.date}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground pl-1">
                  {l.significance}
                </p>
              </div>
            ))}
          </div>
        ),
    },
    {
      key: "win-strategy",
      icon: Target,
      title: "Win Strategy",
      content: (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Approach
            </p>
            <p className="text-sm">{analysis.winStrategy.approach}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Key Messages
            </p>
            <ul className="space-y-1">
              {analysis.winStrategy.keyMessages.map((m, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <span className="text-muted-foreground shrink-0">-</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Timing
            </p>
            <p className="text-sm">
              {analysis.winStrategy.timingConsiderations}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">
              Risk Factors
            </p>
            <ul className="space-y-1">
              {analysis.winStrategy.riskFactors.map((r, i) => (
                <li key={i} className="text-sm flex gap-2">
                  <Badge variant="destructive" className="text-xs shrink-0">
                    Risk
                  </Badge>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Deep Account Analysis
        </h3>
        <Button variant="outline" size="sm" onClick={copyAll}>
          {copied ? (
            <>
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-1.5 h-3.5 w-3.5" />
              Copy All
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section, i) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="h-full">
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <section.icon className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-semibold">{section.title}</h4>
                </div>
                {section.content}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
