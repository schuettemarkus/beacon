"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  ExternalLink as Linkedin,
  Copy,
  Check,
  Crown,
  Sparkles,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  decisionMakerScore: number | "high" | "medium" | "low";
  enrichedAt?: string | null;
  enrichmentSource?: string | null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getScoreLevel(score: number | string): "high" | "medium" | "low" {
  if (score === "high" || score === "medium" || score === "low") return score;
  const n = typeof score === "string" ? parseInt(score) : score;
  if (n >= 80) return "high";
  if (n >= 50) return "medium";
  return "low";
}

const scoreColors = {
  high: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

export function ContactCard({
  contact,
  leadId,
}: {
  contact: Contact;
  leadId?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const queryClient = useQueryClient();
  const level = getScoreLevel(contact.decisionMakerScore);
  const isPlaceholder = contact.email.includes("contact@");

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleEnrich() {
    if (!leadId || enriching) return;
    setEnriching(true);
    try {
      const res = await fetch(
        `/api/leads/${leadId}/contacts/${contact.id}/enrich`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Enrichment failed");
        return;
      }
      const data = await res.json();
      toast.success(
        `Enriched via ${data.enrichment.source} (${data.enrichment.confidence}% confidence)`
      );
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
    } catch {
      toast.error("Enrichment failed");
    } finally {
      setEnriching(false);
    }
  }

  return (
    <Card className="relative">
      <CardContent className="flex items-start gap-4 px-4 pt-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {getInitials(contact.name)}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{contact.name}</h4>
            {level === "high" && (
              <Crown className="h-4 w-4 text-amber-500" />
            )}
            {contact.enrichedAt && (
              <span title={`Enriched via ${contact.enrichmentSource}`}><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /></span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{contact.title}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Email */}
            <button
              onClick={() => copyToClipboard(contact.email, "email")}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                isPlaceholder
                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-3 w-3" />
              <span className="max-w-[140px] truncate">{contact.email}</span>
              {copied === "email" ? (
                <Check className="h-3 w-3 text-emerald-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>

            {/* Phone */}
            {contact.phone && (
              <button
                onClick={() => copyToClipboard(contact.phone!, "phone")}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="h-3 w-3" />
                <span>{contact.phone}</span>
                {copied === "phone" ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            )}

            {/* LinkedIn */}
            {contact.linkedin && (
              <a
                href={contact.linkedin.startsWith("http") ? contact.linkedin : `https://${contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-3 w-3" />
                <span>Profile</span>
              </a>
            )}

            {/* Enrich button */}
            {leadId && !contact.enrichedAt && isPlaceholder && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnrich}
                disabled={enriching}
                className="h-7 gap-1 text-xs"
              >
                {enriching ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {enriching ? "Enriching..." : "Enrich"}
              </Button>
            )}
          </div>

          {/* Enrichment badge */}
          {contact.enrichedAt && (
            <p className="text-[10px] text-emerald-600">
              Enriched via {contact.enrichmentSource} · {new Date(contact.enrichedAt).toLocaleDateString()}
            </p>
          )}
          {!contact.enrichedAt && isPlaceholder && !leadId && (
            <p className="text-[10px] text-amber-600">Needs enrichment</p>
          )}
        </div>

        {/* Decision Maker Badge */}
        <Badge variant="outline" className={scoreColors[level]}>
          {level === "high"
            ? "Key Decision Maker"
            : level === "medium"
            ? "Influencer"
            : "Individual"}
        </Badge>
      </CardContent>
    </Card>
  );
}
