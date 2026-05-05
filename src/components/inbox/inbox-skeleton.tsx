"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function InboxSkeleton() {
  return (
    <div className="space-y-6">
      {/* Briefing skeleton */}
      <Skeleton className="h-16 w-full rounded-xl" />

      {/* Group skeleton */}
      {[1, 2].map((group) => (
        <div key={group} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="flex items-start gap-3 rounded-xl border p-4"
              >
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-64" />
                  <div className="flex gap-1 pt-1">
                    {[1, 2, 3, 4].map((btn) => (
                      <Skeleton key={btn} className="h-6 w-6 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
