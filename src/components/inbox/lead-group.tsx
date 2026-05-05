"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadCard, type Lead } from "./lead-card";

interface LeadGroupProps {
  title: string;
  leads: Lead[];
  defaultOpen?: boolean;
}

export function LeadGroup({ title, leads, defaultOpen = true }: LeadGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (leads.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left transition-colors hover:bg-muted/50"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </motion.div>
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <Badge variant="secondary" className="text-[10px]">
          {leads.length}
        </Badge>
      </button>

      {/* Collapsible content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pb-2">
              {leads.map((lead, index) => (
                <LeadCard key={lead.id} lead={lead} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
