"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Loader2, ExternalLink, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useIndustry } from "@/hooks/use-industry";

interface DiscoveryResult {
  name: string;
  domain: string;
  industry: string;
  employees: number;
  reasons: string[];
  description?: string;
  hq?: string;
  fitScore: number;
  verified: boolean;
}

function buildDiscoveryQuery(icpData: any, sellerData: any): string {
  const parts: string[] = [];

  // Verticals first (most specific targeting)
  if (icpData?.verticals?.length)
    parts.push(icpData.verticals.join(", ") + " organizations");
  else if (icpData?.industries?.length)
    parts.push(icpData.industries.join(", ") + " companies");

  if (icpData?.companySizeMin || icpData?.companySizeMax)
    parts.push(
      `${icpData.companySizeMin || 0}-${icpData.companySizeMax || "?"} employees`
    );
  if (icpData?.fundingStages?.length)
    parts.push(icpData.fundingStages.join(", "));
  if (icpData?.techStack?.length)
    parts.push("using " + icpData.techStack.join(", "));
  if (icpData?.keySignals?.length)
    parts.push("showing " + icpData.keySignals.join(", ") + " signals");

  // Territory from seller profile or ICP
  if (sellerData?.territory?.description)
    parts.push("in " + sellerData.territory.description);
  else if (sellerData?.territory?.states?.length)
    parts.push("in " + sellerData.territory.states.join(", "));
  else if (icpData?.geoTargets?.length)
    parts.push("in " + icpData.geoTargets.join(", "));

  // Seller product context
  if (sellerData?.products?.length)
    parts.push("that would benefit from " + sellerData.products.join(", "));

  // Buyer titles
  if (icpData?.buyerTitles?.length)
    parts.push("with " + icpData.buyerTitles.join(", ") + " as key contacts");

  // Account type
  if (icpData?.accountType === "new_business")
    parts.push("(new business opportunities)");

  return parts.join(", ");
}

export default function DiscoverPage() {
  const { config } = useIndustry();
  const examplePrompts = config.exampleIcpPrompts;
  const [icp, setIcp] = useState("");
  const [results, setResults] = useState<DiscoveryResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const autoRanRef = useRef(false);

  const { data: icpData, isLoading: icpLoading } = useQuery({
    queryKey: ["icp"],
    queryFn: async () => {
      const res = await fetch("/api/profile/icp");
      if (!res.ok) throw new Error("Failed to fetch ICP");
      return res.json();
    },
  });

  const { data: sellerData, isLoading: sellerLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile/seller");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const hasContext =
    (icpData &&
      ((icpData.industries?.length > 0) ||
        (icpData.companySizeMin > 0 || icpData.companySizeMax > 0) ||
        (icpData.fundingStages?.length > 0) ||
        (icpData.techStack?.length > 0) ||
        (icpData.keySignals?.length > 0) ||
        (icpData.verticals?.length > 0) ||
        (icpData.geoTargets?.length > 0))) ||
    (sellerData?.products?.length > 0) ||
    (sellerData?.territory?.states?.length > 0);

  // Auto-discover when profile data loads and user hasn't searched yet
  useEffect(() => {
    if (autoRanRef.current || icpLoading || sellerLoading || !hasContext || results.length > 0)
      return;
    autoRanRef.current = true;
    const description = buildDiscoveryQuery(icpData, sellerData);
    if (description) {
      setIcp(description);
      runDiscovery(description);
    }
  }, [icpData, sellerData, icpLoading, sellerLoading, hasContext, results.length]);

  async function runDiscovery(query: string) {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp: query }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Discovery failed");
      }

      const data = await res.json();
      setResults(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!icp.trim()) return;
    runDiscovery(icp.trim());
  }

  function fillFromIcp() {
    if (!icpData && !sellerData) return;
    const description = buildDiscoveryQuery(icpData, sellerData);
    setIcp(description);
  }

  return (
    <div className="w-full space-y-8 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Discover Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasContext
            ? "Showing companies matching your ICP. Refine your search below."
            : "Describe your ideal customer and let AI find real companies that match."}
        </p>
      </div>

      {/* ICP Input */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {hasContext && !loading && (
          <button
            type="button"
            onClick={fillFromIcp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-xs text-primary font-medium transition-colors"
          >
            <UserCheck className="h-3 w-3" />
            Use my ICP
          </button>
        )}
        <textarea
          value={icp}
          onChange={(e) => setIcp(e.target.value)}
          placeholder="Describe your ideal customer profile... (e.g., 'Series B fintechs in the US, 100-500 employees, no CISO, using cloud infrastructure')"
          className="w-full min-h-[100px] rounded-xl border border-border bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
        />

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={loading || !icp.trim()}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Finding companies..." : "Find Companies"}
          </Button>
        </div>
      </form>

      {/* Example prompts — only show when no results and not loading */}
      {results.length === 0 && !loading && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Try these
          </p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setIcp(prompt);
                  runDiscovery(prompt);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-xs text-muted-foreground transition-colors"
              >
                <Search className="h-3 w-3" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Found {results.length} companies matching your ICP
            </p>

            {results.map((result, i) => (
              <motion.div
                key={result.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{result.name}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            result.fitScore >= 80
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }
                        >
                          Fit {result.fitScore}
                        </Badge>
                        {!result.verified && (
                          <Badge variant="outline" className="text-[10px]">
                            Unverified
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mb-2">
                        {result.industry}
                        {result.hq && ` · ${result.hq}`}
                        {result.employees > 0 &&
                          ` · ${result.employees.toLocaleString()} employees`}
                      </p>

                      {result.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {result.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {result.reasons.map((reason, j) => (
                          <Badge
                            key={j}
                            variant="outline"
                            className="text-[10px] font-normal"
                          >
                            {reason}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5"
                      onClick={() =>
                        router.push(
                          `/research?q=${encodeURIComponent(result.name)}`
                        )
                      }
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Research
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
