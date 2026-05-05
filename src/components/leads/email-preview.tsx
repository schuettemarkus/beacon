"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Copy,
  ExternalLink,
  Zap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EmailDraft {
  id: string;
  variant: "cold_intro" | "threat_anchored" | "executive_brief";
  subject: string;
  preview: string;
  body: string;
  predictedOpenRate: number;
  predictedReplyRate: number;
  sentAt?: string | null;
}

interface EmailPreviewProps {
  email: EmailDraft;
  leadId?: string;
  contactEmail?: string;
}

const toneLabels = ["Formal", "Professional", "Conversational", "Casual"];

export function EmailPreview({ email, leadId, contactEmail }: EmailPreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const [toneIndex, setToneIndex] = useState(1);
  const queryClient = useQueryClient();

  const regenerateMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/emails/${email.id}/regenerate`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to regenerate");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success("Email regenerated");
    },
    onError: () => {
      toast.error("Failed to regenerate email");
    },
  });

  return (
    <Card>
      <CardContent className="space-y-4 px-4 pt-4">
        {/* Subject */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">Subject</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{email.subject}</p>
            {email.sentAt && (
              <Badge className="bg-emerald-100 text-emerald-800 border-0">
                Sent {new Date(email.sentAt).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Preview */}
        <p className="text-xs text-muted-foreground italic">{email.preview}</p>

        {/* Body */}
        <div className="relative">
          <div
            className={`whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-xs leading-relaxed ${
              !expanded ? "line-clamp-6" : ""
            }`}
          >
            {email.body}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show more <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>

        {/* Predicted Rates */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              Open rate:{" "}
              <span className="font-medium text-foreground">
                {email.predictedOpenRate}%
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">
              Reply rate:{" "}
              <span className="font-medium text-foreground">
                {email.predictedReplyRate}%
              </span>
            </span>
          </div>
        </div>

        {/* Tone Slider */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Tone</p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={3}
              value={toneIndex}
              onChange={(e) => setToneIndex(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
            />
            <span className="w-28 text-xs font-medium">
              {toneLabels[toneIndex]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 border-t pt-3">
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!!email.sentAt}
            onClick={() => {
              const url = `https://mail.google.com/mail/?view=cm&su=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
              window.open(url, '_blank');
              if (leadId) {
                fetch(`/api/leads/${leadId}/emails/${email.id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sentAt: new Date().toISOString() }),
                });
              }
              toast.success("Opened Gmail compose");
            }}
          >
            <Mail className="h-3.5 w-3.5" />
            Send via Gmail
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              navigator.clipboard.writeText(email.body);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            disabled={!!email.sentAt}
            onClick={() => {
              window.location.href = `mailto:?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Outlook
          </Button>
          {leadId && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5 ml-auto"
              disabled={regenerateMutation.isPending}
              onClick={() => regenerateMutation.mutate()}
            >
              {regenerateMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Zap className="h-3.5 w-3.5" />
              )}
              Regenerate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
