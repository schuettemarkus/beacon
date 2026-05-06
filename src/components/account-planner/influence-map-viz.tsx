"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Users,
  ArrowRight,
  DollarSign,
  Star,
  Lightbulb,
  Handshake,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { InfluenceMap, StakeholderEntry } from "@/services/account-planner-types";

interface Props {
  entryId: string;
  data: InfluenceMap | null;
  onGenerate: () => void;
  loading: boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const ringConfig = {
  economicBuyers: {
    label: "Economic Buyers",
    icon: DollarSign,
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-500/5",
    badgeColor: "bg-rose-500/10 text-rose-600",
    avatarColor: "bg-rose-500/10 text-rose-600",
  },
  champions: {
    label: "Champions",
    icon: Star,
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-500/5",
    badgeColor: "bg-amber-500/10 text-amber-600",
    avatarColor: "bg-amber-500/10 text-amber-600",
  },
  influencers: {
    label: "Influencers",
    icon: Lightbulb,
    borderColor: "border-yellow-500/40",
    bgColor: "bg-yellow-500/5",
    badgeColor: "bg-yellow-500/10 text-yellow-600",
    avatarColor: "bg-yellow-500/10 text-yellow-600",
  },
  partners: {
    label: "Partners",
    icon: Handshake,
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/5",
    badgeColor: "bg-blue-500/10 text-blue-600",
    avatarColor: "bg-blue-500/10 text-blue-600",
  },
} as const;

const relationshipLabels: Record<string, string> = {
  reports_to: "reports to",
  prior_company: "prior company overlap",
  university: "same university",
  board: "board connection",
};

function PersonCard({
  person,
  config,
}: {
  person: StakeholderEntry;
  config: (typeof ringConfig)[keyof typeof ringConfig];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Card className="relative">
      <CardContent className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${config.avatarColor}`}
          >
            {getInitials(person.name)}
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-medium text-sm truncate">{person.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {person.title}
            </p>
            <p className="text-xs text-muted-foreground/80 line-clamp-2">
              {person.relevance}
            </p>
            <p className="text-xs italic text-muted-foreground/70 line-clamp-2">
              {person.engagementStrategy}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {person.email && (
                <button
                  onClick={() => copyToClipboard(person.email!, "email")}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3 w-3" />
                  <span className="max-w-[120px] truncate">{person.email}</span>
                  {copied === "email" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              )}
              {person.phone && (
                <button
                  onClick={() => copyToClipboard(person.phone!, "phone")}
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-3 w-3" />
                  <span>{person.phone}</span>
                  {copied === "phone" ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              )}
              {person.linkedin && (
                <a
                  href={
                    person.linkedin.startsWith("http")
                      ? person.linkedin
                      : `https://${person.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InfluenceMapViz({ data, onGenerate, loading }: Props) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <h3 className="mb-2 text-lg font-medium">Influence Map</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Identify key stakeholders, their roles in the buying process, and
          relationships between them.
        </p>
        <Button onClick={onGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mapping stakeholders...
            </>
          ) : (
            "Generate Influence Map"
          )}
        </Button>
      </div>
    );
  }

  function copyAllContacts() {
    if (!data) return;
    const lines: string[] = [];
    for (const [ringKey, people] of Object.entries(data.rings)) {
      const cfg = ringConfig[ringKey as keyof typeof ringConfig];
      if (!cfg || !people.length) continue;
      lines.push(`--- ${cfg.label} ---`);
      for (const p of people) {
        const parts = [p.name, p.title];
        if (p.email) parts.push(p.email);
        lines.push(parts.join(" | "));
      }
      lines.push("");
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopySuccess(true);
    toast.success("Contacts copied to clipboard");
    setTimeout(() => setCopySuccess(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Influence Map</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAllContacts}
          className="gap-1.5"
        >
          {copySuccess ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          Copy All Contacts
        </Button>
      </div>

      {(
        ["economicBuyers", "champions", "influencers", "partners"] as const
      ).map((ringKey, idx) => {
        const people = data.rings[ringKey];
        const cfg = ringConfig[ringKey];
        const Icon = cfg.icon;

        if (!people.length) return null;

        return (
          <motion.div
            key={ringKey}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`${cfg.borderColor} border-l-4`}>
              <CardHeader className={`pb-3 ${cfg.bgColor}`}>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="h-4 w-4" />
                  {cfg.label}
                  <Badge
                    variant="secondary"
                    className={`ml-auto ${cfg.badgeColor}`}
                  >
                    {people.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {people.map((person, i) => (
                    <PersonCard key={i} person={person} config={cfg} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {data.relationships.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.relationships.map((rel, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{rel.fromName}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {relationshipLabels[rel.type] || rel.type}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{rel.toName}</span>
                    {rel.detail && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {rel.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
