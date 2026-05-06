"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, Check, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";

interface ImportResult {
  company: string;
  status: "pending" | "processing" | "created" | "exists" | "error";
  leadId?: string;
  error?: string;
}

export function BulkImport({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ImportResult[]>([]);
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);
  const queryClient = useQueryClient();

  const accounts = input
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  async function startImport() {
    if (!accounts.length) return;
    abortRef.current = false;
    setRunning(true);

    const initial: ImportResult[] = accounts.map((c) => ({
      company: c,
      status: "pending",
    }));
    setResults(initial);

    for (let i = 0; i < accounts.length; i++) {
      if (abortRef.current) break;

      setResults((prev) =>
        prev.map((r, idx) =>
          idx === i ? { ...r, status: "processing" } : r
        )
      );

      try {
        const res = await fetch("/api/leads/seed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company: accounts[i] }),
        });
        const data = await res.json();

        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: data.status === "created" ? "created" : data.status === "exists" ? "exists" : "error",
                  leadId: data.leadId,
                  error: data.error,
                }
              : r
          )
        );
      } catch (e: any) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i ? { ...r, status: "error", error: e.message } : r
          )
        );
      }
    }

    setRunning(false);
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    queryClient.invalidateQueries({ queryKey: ["digest"] });
  }

  const completed = results.filter((r) => r.status !== "pending" && r.status !== "processing").length;
  const created = results.filter((r) => r.status === "created").length;
  const existing = results.filter((r) => r.status === "exists").length;
  const errors = results.filter((r) => r.status === "error").length;
  const progress = results.length > 0 ? Math.round((completed / results.length) * 100) : 0;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bulk Import Accounts</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!running && results.length === 0 && (
        <>
          <p className="text-sm text-muted-foreground">
            Paste account names (one per line). Each will be researched, enriched,
            scored, and added to your leads with full profiles.
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Illinois Gaming Board\nTexas Children's Hospital\nBlue Cross Blue Shield of Minnesota\n..."}
            className="w-full min-h-[200px] rounded-lg border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none font-mono"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {accounts.length} account{accounts.length !== 1 ? "s" : ""} detected
            </p>
            <Button onClick={startImport} disabled={!accounts.length} className="gap-2">
              <Upload className="h-4 w-4" />
              Import {accounts.length} Account{accounts.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </>
      )}

      {(running || results.length > 0) && (
        <>
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {running ? `Processing ${completed + 1} of ${results.length}...` : "Import complete"}
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex gap-3 text-xs">
              {created > 0 && (
                <span className="text-emerald-600">{created} created</span>
              )}
              {existing > 0 && (
                <span className="text-amber-600">{existing} already exist</span>
              )}
              {errors > 0 && (
                <span className="text-destructive">{errors} failed</span>
              )}
            </div>
          </div>

          {/* Results list */}
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            <AnimatePresence>
              {results.map((r, i) => (
                <motion.div
                  key={r.company}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-center gap-2 py-1.5 px-2 rounded text-sm"
                >
                  {r.status === "pending" && (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  {r.status === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {r.status === "created" && (
                    <Check className="h-4 w-4 text-emerald-500" />
                  )}
                  {r.status === "exists" && (
                    <Badge variant="outline" className="h-4 px-1 text-[9px]">
                      exists
                    </Badge>
                  )}
                  {r.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className={r.status === "pending" ? "text-muted-foreground" : ""}>
                    {r.company}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {running && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => { abortRef.current = true; }}
            >
              Stop Import
            </Button>
          )}

          {!running && results.length > 0 && (
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
