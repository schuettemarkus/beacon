"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export function FitScoreBreakdown({ leadId }: { leadId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["score-breakdown", leadId],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/score`);
      if (!res.ok) return null;
      return res.json();
    },
  });

  if (isLoading || !data?.factors) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Fit Score Breakdown</h3>
      <div className="space-y-2">
        {data.factors.map((factor: any, i: number) => {
          const pct = factor.maxScore > 0 ? (factor.score / factor.maxScore) * 100 : 0;
          const color =
            pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-red-400";

          return (
            <motion.div
              key={factor.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{factor.name}</span>
                <span className="text-muted-foreground">
                  {factor.score}/{factor.maxScore}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{factor.reason}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-2 mt-2">
        <span className="text-sm font-semibold">Total</span>
        <span className="text-sm font-bold">{data.total}/100</span>
      </div>
    </div>
  );
}
