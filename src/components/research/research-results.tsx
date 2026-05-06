"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  ExternalLink,
  Shield,
  Users,
  TrendingUp,
  Building2,
  Globe,
  DollarSign,
  Check,
  Loader2,
  FileText,
  Scale,
  Newspaper,
  BarChart3,
} from "lucide-react";
import type { CompanyResearchPayload } from "@/services/company-research";
import { toast } from "sonner";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

interface ResearchResultsProps {
  data: CompanyResearchPayload;
  researchRunId?: string;
}

export function ResearchResults({
  data,
  researchRunId,
}: ResearchResultsProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSaveToInbox() {
    if (!researchRunId || saving || saved) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/research/${researchRunId}/save`, {
        method: "POST",
      });
      if (res.ok) {
        const { leadId } = await res.json();
        setSaved(true);
        toast.success("Saved to leads + 3 emails generated");
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["digest"] });
        setTimeout(() => router.push(`/leads/${leadId}`), 1500);
      }
    } catch (e) {
      console.error("Save failed:", e);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  const kpis = [
    { label: "Industry", value: data.industry, icon: Building2 },
    { label: "Headquarters", value: data.hq, icon: Globe },
    { label: "Employees", value: data.employees?.toLocaleString() || "—", icon: Users },
    { label: "Revenue Band", value: data.revenueBand, icon: DollarSign },
    { label: "Funding", value: data.funding, icon: TrendingUp },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Strip with prominent CTA */}
      <motion.div variants={fadeUp}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {data.logoUrl && (
              <img
                src={data.logoUrl}
                alt=""
                className="h-10 w-10 rounded-lg object-contain bg-white border border-gray-100"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {data.company}
              </h1>
              <p className="text-sm text-muted-foreground">
                {data.industry} · {data.hq} ·{" "}
                {data.employees?.toLocaleString() || "—"} employees
              </p>
            </div>
          </div>

          {/* Prominent Fit Score + Save buttons side by side */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold text-sm ${
                data.fitScore >= 80
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : data.fitScore >= 60
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <Shield className="h-4 w-4" />
              Fit Score: {data.fitScore}/100
            </div>
            <Button
              size="lg"
              onClick={handleSaveToInbox}
              disabled={saving || saved || !researchRunId}
              className={
                saved
                  ? "bg-emerald-600 hover:bg-emerald-600"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              {saved ? (
                <Check className="h-4 w-4 mr-2" />
              ) : saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bookmark className="h-4 w-4 mr-2" />
              )}
              {saved
                ? "Saved + Emails Generated"
                : saving
                ? "Saving..."
                : "Save to Leads"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Snapshot KPIs */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Company Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="p-3 flex items-start gap-2.5">
              <div className="rounded-lg bg-primary/5 p-1.5">
                <kpi.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                <p className="text-sm font-semibold">{kpi.value || "—"}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Tech Stack & Attack Surface
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/5 text-primary hover:bg-primary/10"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Regulatory Profile */}
      {data.regulatoryProfile && data.regulatoryProfile.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            <Scale className="inline h-3.5 w-3.5 mr-1" />
            Regulatory Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.regulatoryProfile.map((reg, i) => (
              <Card key={i} className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{reg.regulation}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {reg.status}
                  </Badge>
                </div>
                {reg.deadline && (
                  <p className="text-[10px] text-muted-foreground mb-1">
                    Deadline: {reg.deadline}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{reg.relevance}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cyber Signals */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Threat & Opportunity Signals
        </h2>
        <div className="space-y-3">
          {data.signals.map((signal, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                    signal.severity === "critical"
                      ? "bg-red-600"
                      : signal.severity === "high"
                      ? "bg-red-500"
                      : signal.severity === "medium"
                      ? "bg-amber-500"
                      : "bg-green-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{signal.title}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {signal.type.replace(/_/g, " ")}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        signal.severity === "critical" || signal.severity === "high"
                          ? "border-red-200 text-red-600"
                          : signal.severity === "medium"
                          ? "border-amber-200 text-amber-600"
                          : ""
                      }`}
                    >
                      {signal.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {signal.body}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    {signal.sourceUrl ? (
                      <a
                        href={signal.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {signal.source}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">
                        {signal.source}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent News */}
      {data.recentNews && data.recentNews.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            <Newspaper className="inline h-3.5 w-3.5 mr-1" />
            Recent News
          </h2>
          <div className="space-y-2">
            {data.recentNews.map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {item.source} · {item.date}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Buying Committee */}
      <motion.div variants={fadeUp}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Buying Committee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.contacts.map((contact) => (
            <Card key={contact.email} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {contact.email}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      contact.decisionMakerScore >= 80 ? "default" : "secondary"
                    }
                    className={
                      contact.decisionMakerScore >= 80
                        ? "bg-primary/10 text-primary"
                        : ""
                    }
                  >
                    DM {contact.decisionMakerScore}
                  </Badge>
                  {contact.linkedin && (
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="inline h-3 w-3 mr-0.5" />
                      LinkedIn
                    </a>
                  )}
                  {!contact.phone && !contact.linkedin && (
                    <p className="text-[10px] text-amber-600 mt-1">
                      Needs enrichment
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Peer Comparison */}
      {data.peerComparison && data.peerComparison.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            <BarChart3 className="inline h-3.5 w-3.5 mr-1" />
            Peer Comparison
          </h2>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-xs text-muted-foreground">
                    Company
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-xs text-muted-foreground">
                    Industry
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-xs text-muted-foreground">
                    Employees
                  </th>
                  <th className="px-4 py-2 text-right font-medium text-xs text-muted-foreground">
                    Fit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.peerComparison.map((peer, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-2 font-medium">{peer.company}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {peer.industry}
                    </td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {peer.employees?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Badge
                        variant="secondary"
                        className={
                          peer.fitScore >= 80
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted"
                        }
                      >
                        {peer.fitScore}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Data Policy Note */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
          Research data sourced from{" "}
          <a href="https://www.sec.gov/edgar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SEC EDGAR</a>,{" "}
          <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Wikipedia</a>,{" "}
          <a href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CISA KEV</a>,{" "}
          <a href="https://nvd.nist.gov" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">NVD</a>,{" "}
          and <a href="https://news.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google News</a>.
          Contact details are placeholders. Last updated: {new Date().toLocaleDateString()}.
        </p>
      </motion.div>
    </motion.div>
  );
}
