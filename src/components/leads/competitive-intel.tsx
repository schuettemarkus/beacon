"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Competitor {
  name: string;
  category: string;
  strengths: string[];
  weaknesses: string[];
  talkTrack: string;
}

interface CompetitiveIntelData {
  competitors: Competitor[];
  positioning: string;
}

export function CompetitiveIntel({ leadId }: { leadId: string }) {
  const [data, setData] = useState<CompetitiveIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leads/${leadId}/competitive-intel`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate intel");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function copyTalkTracks() {
    if (!data) return;
    const text = data.competitors
      .map((c) => `${c.name} (${c.category}):\n${c.talkTrack}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!data && !loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <Swords className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Generate competitive intelligence based on this lead&apos;s tech stack and industry.
        </p>
        <Button onClick={generate} disabled={loading}>
          Generate Intel
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Analyzing competitive landscape...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">Positioning Summary</p>
            <p className="text-sm">{data.positioning}</p>
          </CardContent>
        </Card>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={copyTalkTracks}>
            {copied ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
            {copied ? "Copied" : "Copy Talk Tracks"}
          </Button>
          <Button size="sm" variant="ghost" onClick={generate}>
            Regenerate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {data.competitors.map((competitor, i) => (
            <motion.div
              key={competitor.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.08 }}
            >
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold">{competitor.name}</h4>
                    <Badge variant="secondary">{competitor.category}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-600">
                        Strengths
                      </p>
                      <ul className="space-y-0.5">
                        {competitor.strengths.map((s) => (
                          <li key={s} className="text-xs text-muted-foreground">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-red-600">
                        Weaknesses
                      </p>
                      <ul className="space-y-0.5">
                        {competitor.weaknesses.map((w) => (
                          <li key={w} className="text-xs text-muted-foreground">
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/50 border p-3">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Talk Track
                    </p>
                    <p className="text-xs leading-relaxed">{competitor.talkTrack}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
