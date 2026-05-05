"use client";

import { motion, type Variants } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
} satisfies Variants;

export function ResearchSkeleton() {
  const sections = [
    // Header
    <div key="header" className="flex items-center gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-6 w-32" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>,
    // KPI grid
    <div key="kpis" className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-xl" />
      ))}
    </div>,
    // Tech stack
    <div key="tech" className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>,
    // Signals
    <div key="signals" className="space-y-3">
      <Skeleton className="h-6 w-44" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
    </div>,
    // Contacts
    <div key="contacts" className="space-y-3">
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
    </div>,
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Beacon pulse loading indicator */}
      <div className="flex items-center justify-center py-4">
        <div className="relative h-12 w-12">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-indigo-500"
              animate={{
                scale: [1, 2.2],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
          <div className="absolute inset-3 rounded-full bg-indigo-500" />
        </div>
      </div>

      {sections.map((section, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {section}
        </motion.div>
      ))}
    </div>
  );
}
