"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import type { CompanyResearchPayload } from "@/services/company-research";

type ResearchResponse = CompanyResearchPayload & { researchRunId?: string };
import { ResearchResults } from "@/components/research/research-results";
import { ResearchSkeleton } from "@/components/research/research-skeleton";
import { CopilotChat } from "@/components/research/copilot-chat";

const STORAGE_KEY = "beacon-recent-searches";

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSearch(query: string) {
  const searches = getRecentSearches().filter((s) => s !== query);
  searches.unshift(query);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches.slice(0, 8)));
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  const research = useMutation({
    mutationFn: async (q: string): Promise<ResearchResponse> => {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error("Research failed");
      return res.json();
    },
    onSuccess: () => {
      setRecentSearches(getRecentSearches());
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      saveSearch(trimmed);
      research.mutate(trimmed);
    },
    [query, research]
  );

  const handleChipClick = (search: string) => {
    setQuery(search);
    saveSearch(search);
    research.mutate(search);
  };

  const removeChip = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== search);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const showHero = !research.data && !research.isPending;

  return (
    <div className="flex h-full">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {showHero ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] px-6"
            >
              {/* Beacon pulse motif */}
              <div className="relative h-16 w-16 mb-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-indigo-400/40"
                    animate={{
                      scale: [1, 2.5],
                      opacity: [0.5, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <div className="absolute inset-4 rounded-full bg-indigo-600" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
                Research Studio
              </h1>
              <p className="text-gray-500 text-center mb-8 max-w-md">
                Deep-dive any public or private company. Get fit scores, tech
                stacks, buying signals, and outreach drafts in seconds.
              </p>

              {/* Search input */}
              <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                <div
                  className={`relative rounded-2xl transition-shadow duration-300 ${
                    isFocused
                      ? "shadow-[0_0_0_3px_rgba(79,70,229,0.15),0_0_24px_rgba(79,70,229,0.1)]"
                      : "shadow-lg shadow-gray-200/60"
                  }`}
                >
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Research any public or private company..."
                    className="w-full h-14 pl-13 pr-5 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors text-base"
                  />
                </div>
              </form>

              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleChipClick(search)}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-indigo-50 hover:text-indigo-700 text-sm text-gray-600 transition-colors"
                    >
                      <Search className="h-3 w-3" />
                      {search}
                      <span
                        onClick={(e) => removeChip(search, e)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              {/* Compact search bar */}
              <form onSubmit={handleSubmit} className="mb-6 max-w-xl">
                <div
                  className={`relative rounded-xl transition-shadow duration-300 ${
                    isFocused
                      ? "shadow-[0_0_0_2px_rgba(79,70,229,0.15)]"
                      : ""
                  }`}
                >
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Research another company..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 transition-colors text-sm"
                  />
                </div>
              </form>

              {research.isPending ? (
                <ResearchSkeleton />
              ) : research.data ? (
                <ResearchResults data={research.data} researchRunId={research.data.researchRunId} />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Co-Pilot Chat Panel */}
      {research.data && (
        <CopilotChat
          company={research.data.company}
          researchRunId={research.data.researchRunId}
        />
      )}
    </div>
  );
}
