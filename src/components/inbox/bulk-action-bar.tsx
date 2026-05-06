"use client";

import { motion } from "framer-motion";
import { Archive, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedIds: string[];
  onClear: () => void;
  onAction: (action: string) => void;
}

export function BulkActionBar({
  selectedIds,
  onClear,
  onAction,
}: BulkActionBarProps) {
  if (selectedIds.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-lg max-w-[calc(100vw-2rem)]">
        <span className="text-sm font-medium text-foreground">
          {selectedIds.length} selected
        </span>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("archive")}
          className="gap-1.5"
        >
          <Archive className="size-4" />
          <span className="hidden sm:inline">Archive All</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("snooze")}
          className="gap-1.5"
        >
          <Clock className="size-4" />
          <span className="hidden sm:inline">Snooze All</span>
        </Button>

        <div className="mx-1 h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onClear}
          aria-label="Clear selection"
        >
          <X className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
