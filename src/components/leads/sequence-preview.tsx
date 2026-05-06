"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, MessageCircle, Phone, ChevronDown, ChevronUp, RotateCw, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SequenceStep {
  stepIndex: number;
  type: string;
  label: string;
  days: number;
  content?: { subject: string; body: string };
  action?: string;
}

interface SequencePreviewProps {
  steps: SequenceStep[];
  sequenceId: string;
  enrollmentId: string;
  leadId: string;
  onActivate: () => void;
  onRegenerate: (stepIndex: number) => void;
  isActivating?: boolean;
  regeneratingStep?: number | null;
}

const typeIcon: Record<string, any> = {
  email: Mail,
  wait: Clock,
  linkedin: MessageCircle,
  call: Phone,
};

const typeColor: Record<string, string> = {
  email: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  wait: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  linkedin: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  call: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

export function SequencePreview({
  steps,
  sequenceId,
  enrollmentId,
  leadId,
  onActivate,
  onRegenerate,
  isActivating,
  regeneratingStep,
}: SequencePreviewProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  function toggleStep(index: number) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  let cumulativeDays = 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-3">
          {steps.map((step, i) => {
            cumulativeDays += step.days;
            const Icon = typeIcon[step.type] || Mail;
            const isExpanded = expandedSteps.has(i);
            const isEmail = step.type === "email";

            return (
              <motion.div
                key={step.stepIndex}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.25 }}
              >
                <Card className="ml-10 relative">
                  <div className="absolute -left-[26px] top-4 z-10 rounded-full border bg-background p-1.5">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={typeColor[step.type] || ""}>
                          Day {cumulativeDays}
                        </Badge>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {isEmail && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => onRegenerate(step.stepIndex)}
                            disabled={regeneratingStep === step.stepIndex}
                          >
                            <RotateCw
                              className={`h-3.5 w-3.5 ${regeneratingStep === step.stepIndex ? "animate-spin" : ""}`}
                            />
                          </Button>
                        )}
                        {isEmail && step.content && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => toggleStep(i)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {isEmail && step.content && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 space-y-2 border-t pt-3"
                      >
                        <p className="text-sm font-medium">{step.content.subject}</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {step.content.body}
                        </p>
                      </motion.div>
                    )}

                    {!isEmail && step.action && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {step.action}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onActivate}
          disabled={isActivating}
          className="gap-2"
        >
          <Rocket className="h-4 w-4" />
          {isActivating ? "Activating..." : "Activate Sequence"}
        </Button>
      </div>
    </div>
  );
}
