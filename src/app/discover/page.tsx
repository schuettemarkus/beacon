"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const examplePrompts = [
  "Series B fintechs without a CISO doing cloud migration",
  "Healthcare startups using AWS with 50-200 employees",
  "E-commerce companies that recently raised Series A",
  "SaaS companies with no security vendor in tech stack",
  "Manufacturing firms migrating from on-prem to cloud",
];

const mockResults = [
  {
    id: 1,
    company: "NovaPay",
    title: "CTO",
    contact: "Sarah Chen",
    fitScore: 96,
    reasons: ["Series B fintech", "No CISO", "Cloud migration underway"],
  },
  {
    id: 2,
    company: "CloudVault",
    title: "VP Engineering",
    contact: "James Rodriguez",
    fitScore: 93,
    reasons: ["Series B", "AWS heavy", "Hiring security roles"],
  },
  {
    id: 3,
    company: "FinLeap",
    title: "Head of Infrastructure",
    contact: "Priya Sharma",
    fitScore: 89,
    reasons: ["Fintech vertical", "No security vendor", "Growing 40% YoY"],
  },
  {
    id: 4,
    company: "PayStream",
    title: "CTO",
    contact: "Michael Park",
    fitScore: 87,
    reasons: ["Series B fintech", "Multi-cloud", "Compliance needs"],
  },
  {
    id: 5,
    company: "LedgerBase",
    title: "Director of Engineering",
    contact: "Anna Kowalski",
    fitScore: 84,
    reasons: ["Crypto/fintech", "No CISO", "SOC 2 audit planned"],
  },
  {
    id: 6,
    company: "TrustPay",
    title: "VP of Technology",
    contact: "David Liu",
    fitScore: 81,
    reasons: ["Payment processing", "Cloud migration Q2", "50-100 employees"],
  },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResults(null);
    setTimeout(() => {
      setIsLoading(false);
      setResults(mockResults);
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Lead Discovery</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe your ideal customer and let AI find the best matches.
        </p>
      </div>

      {/* Search area */}
      <Card className="p-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your ideal customer..."
          className="w-full resize-none rounded-lg border border-border bg-background p-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          rows={4}
        />

        {/* Example prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {examplePrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => setQuery(prompt)}
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Search className="mr-2 h-4 w-4" />
            Discover Leads
          </Button>
        </div>
      </Card>

      {/* Loading state */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-12"
          >
            <Sparkles className="h-8 w-8 animate-pulse text-indigo-500" />
            <p className="text-sm text-muted-foreground">
              Searching across 2.4M companies...
            </p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {results.length} leads found, ranked by fit
              </p>
              <Button variant="outline" size="sm">
                <Bookmark className="mr-2 h-3.5 w-3.5" />
                Save as Hunt
              </Button>
            </div>

            <div className="space-y-3">
              {results.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="flex items-start gap-4 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {lead.fitScore}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-medium">{lead.company}</h3>
                        <p className="text-sm text-muted-foreground">
                          {lead.contact} &middot; {lead.title}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {lead.reasons.map((reason) => (
                          <Badge
                            key={reason}
                            variant="secondary"
                            className="text-xs font-normal"
                          >
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
