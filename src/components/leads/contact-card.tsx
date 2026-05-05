"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  ExternalLink as Linkedin,
  Copy,
  Check,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  decisionMakerScore: "high" | "medium" | "low";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const scoreColors = {
  high: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

export function ContactCard({ contact }: { contact: Contact }) {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
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
            {contact.decisionMakerScore === "high" && (
              <Crown className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">{contact.title}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* Email */}
            <button
              onClick={() => copyToClipboard(contact.email, "email")}
              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
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
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-3 w-3" />
                <span>Profile</span>
              </a>
            )}
          </div>
        </div>

        {/* Decision Maker Badge */}
        <Badge
          variant="outline"
          className={scoreColors[contact.decisionMakerScore]}
        >
          {contact.decisionMakerScore === "high"
            ? "Key Decision Maker"
            : contact.decisionMakerScore === "medium"
              ? "Influencer"
              : "Individual"}
        </Badge>
      </CardContent>
    </Card>
  );
}
