"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Mail,
  Clock,
  Archive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Lead {
  id: string;
  company: string;
  domain: string;
  industry: string;
  hq: string;
  employees: number;
  revenueBand: string;
  techStack: string[];
  funding: string;
  fitScore: number;
  status: string;
  createdAt: string;
  snoozedUntil?: string;
  contacts: unknown[];
  signals: { title: string; [key: string]: unknown }[];
}

const industryColors: Record<string, string> = {
  Technology: "bg-blue-500",
  Finance: "bg-emerald-500",
  Healthcare: "bg-rose-500",
  Education: "bg-violet-500",
  Retail: "bg-amber-500",
  Manufacturing: "bg-slate-500",
  Energy: "bg-green-600",
  Media: "bg-pink-500",
  default: "bg-indigo-500",
};

function getMonogramColor(industry: string) {
  return industryColors[industry] || industryColors.default;
}

function getFitScoreClasses(score: number) {
  if (score >= 80) return "bg-emerald-100 text-emerald-800";
  if (score >= 60) return "bg-amber-100 text-amber-800";
  if (score >= 40) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

interface LeadCardProps {
  lead: Lead;
  index?: number;
}

export function LeadCard({ lead, index = 0 }: LeadCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/leads/${lead.id}`);
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    // Action handlers would be implemented with mutations
    console.log(action, lead.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
      className="rounded-xl"
    >
      <Card
        className="cursor-pointer transition-shadow hover:ring-foreground/20"
        onClick={handleClick}
      >
        <CardContent className="flex items-start gap-3">
          {/* Monogram */}
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getMonogramColor(lead.industry)}`}
          >
            {lead.company.charAt(0).toUpperCase()}
          </div>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Top row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-foreground truncate">
                  {lead.company}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {lead.industry}
                </span>
              </div>
              <Badge
                className={`shrink-0 border-0 ${getFitScoreClasses(lead.fitScore)}`}
              >
                {lead.fitScore}
              </Badge>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{lead.employees.toLocaleString()} employees</span>
              <span>{lead.hq}</span>
            </div>

            {/* Signal hook */}
            {lead.signals.length > 0 && (
              <p className="text-xs text-muted-foreground/80 truncate">
                {lead.signals[0].title}
              </p>
            )}

            {/* Action row */}
            <div className="flex items-center gap-1 pt-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => handleAction(e, "open")}
                aria-label="Open lead"
              >
                <ExternalLink />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => handleAction(e, "email")}
                aria-label="Email lead"
              >
                <Mail />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => handleAction(e, "snooze")}
                aria-label="Snooze lead"
              >
                <Clock />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={(e) => handleAction(e, "archive")}
                aria-label="Archive lead"
              >
                <Archive />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
