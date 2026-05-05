"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bookmark,
  Mail,
  ExternalLink,
  Shield,
  Users,
  TrendingUp,
  Building2,
  Globe,
  DollarSign,
  Check,
  Loader2,
} from "lucide-react";
import type { CompanyResearchPayload } from "@/services/company-research";

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

interface ResearchResultsProps {
  data: CompanyResearchPayload;
  researchRunId?: string;
}

export function ResearchResults({ data, researchRunId }: ResearchResultsProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

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
        setTimeout(() => router.push(`/leads/${leadId}`), 1500);
      }
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  }

  const kpis = [
    { label: "Industry", value: data.industry, icon: Building2 },
    { label: "Headquarters", value: data.hq, icon: Globe },
    { label: "Employees", value: data.employees.toLocaleString(), icon: Users },
    { label: "Revenue Band", value: data.revenueBand, icon: DollarSign },
    { label: "Funding", value: data.funding, icon: TrendingUp },
    { label: "Fit Score", value: `${data.fitScore}/100`, icon: Shield },
  ];

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Strip */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{data.company}</h1>
          <p className="text-sm text-gray-500">
            {data.industry} &bull; {data.hq} &bull;{" "}
            {data.employees.toLocaleString()} employees
          </p>
        </div>
        <Badge
          variant={data.fitScore >= 80 ? "default" : "secondary"}
          className={
            data.fitScore >= 80
              ? "bg-green-100 text-green-700 hover:bg-green-100"
              : ""
          }
        >
          Fit {data.fitScore}%
        </Badge>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveToInbox}
            disabled={saving || saved || !researchRunId}
          >
            {saved ? (
              <Check className="h-4 w-4 mr-1.5 text-green-600" />
            ) : saving ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Bookmark className="h-4 w-4 mr-1.5" />
            )}
            {saved ? "Saved + Emails Generated" : saving ? "Saving..." : "Save to Inbox"}
          </Button>
        </div>
      </motion.div>

      {/* Snapshot KPIs */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Company Snapshot
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {kpis.map((kpi) => (
            <Card
              key={kpi.label}
              className="p-4 flex items-start gap-3 border-gray-100"
            >
              <div className="rounded-lg bg-indigo-50 p-2">
                <kpi.icon className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{kpi.label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {kpi.value}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Tech Stack &amp; Attack Surface
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </motion.div>

      {/* Cyber Signals */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Recent Signals
        </h2>
        <div className="space-y-3">
          {data.signals.map((signal, i) => (
            <Card key={i} className="p-4 border-gray-100">
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                    signal.severity === "high"
                      ? "bg-red-500"
                      : signal.severity === "medium"
                        ? "bg-amber-500"
                        : "bg-green-500"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {signal.title}
                    </p>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {signal.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{signal.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Source: {signal.source}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Buying Committee */}
      <motion.div variants={fadeUp}>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Buying Committee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.contacts.map((contact) => (
            <Card key={contact.email} className="p-4 border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500">{contact.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{contact.email}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      contact.decisionMakerScore >= 80 ? "default" : "secondary"
                    }
                    className={
                      contact.decisionMakerScore >= 80
                        ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
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
                      className="block mt-2 text-xs text-indigo-600 hover:underline"
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

      {/* Data Policy Note */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
          Research data sourced from public records, filings, and third-party
          databases. Accuracy may vary. Last updated: {new Date().toLocaleDateString()}.
        </p>
      </motion.div>
    </motion.div>
  );
}
