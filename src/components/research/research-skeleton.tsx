"use client";

import { motion, type Variants } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.4,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
} satisfies Variants;

export function ResearchSkeleton() {
  const sections = [
    // Header
    <div key="header" className="flex items-center gap-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-24" />
      <div className="ml-auto flex gap-3">
        <Skeleton className="h-10 w-36 rounded-xl" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    </div>,
    // KPI grid
    <div key="kpis" className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-xl" />
      ))}
    </div>,
    // Tech stack
    <div key="tech" className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>,
    // Signals
    <div key="signals" className="space-y-3">
      <Skeleton className="h-4 w-44" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-24 rounded-xl" />
    </div>,
    // Contacts
    <div key="contacts" className="space-y-3">
      <Skeleton className="h-4 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>,
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Smooth beacon pulse */}
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <div className="relative h-10 w-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-primary/30"
              animate={{
                scale: [1, 2.5],
                opacity: [0.4, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          ))}
          <motion.div
            className="absolute inset-2.5 rounded-full bg-primary/80"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Researching company...
        </p>
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
