"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Copy,
  ExternalLink,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmailDraft {
  id: string;
  variant: "cold_intro" | "threat_anchored" | "executive_brief";
  subject: string;
  preview: string;
  body: string;
  predictedOpenRate: number;
  predictedReplyRate: number;
}

const toneLabels = ["Formal", "Professional", "Conversational", "Casual"];

export function EmailPreview({ email }: { email: EmailDraft }) {
  const [expanded, setExpanded] = useState(false);
  const [toneIndex, setToneIndex] = useState(1);

  return (
    <Card>
      <CardContent className="space-y-4 px-4 pt-4">
        {/* Subject */}
        <div>
          <p className="text-xs font-medium text-muted-foreground">Subject</p>
          <p className="text-sm font-medium">{email.subject}</p>
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
          <Button size="sm" className="gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Send via Gmail
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Open in Outlook
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5 ml-auto">
            <Zap className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
