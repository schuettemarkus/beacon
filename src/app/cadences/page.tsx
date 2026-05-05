"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Share2, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Step {
  type: "email" | "wait" | "linkedin" | "call";
  label: string;
  days?: number;
}

interface Sequence {
  id: string;
  name: string;
  description: string;
  steps: Step[];
  enrolledCount: number;
}

const sequences: Sequence[] = [
  {
    id: "1",
    name: "Cold Outbound - Enterprise",
    description: "5-touch sequence for enterprise prospects over 14 days",
    enrolledCount: 34,
    steps: [
      { type: "email", label: "Intro Email" },
      { type: "wait", label: "Wait 2 days", days: 2 },
      { type: "linkedin", label: "LinkedIn Connection" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "email", label: "Follow-up Email" },
      { type: "wait", label: "Wait 2 days", days: 2 },
      { type: "linkedin", label: "LinkedIn DM" },
      { type: "wait", label: "Wait 4 days", days: 4 },
      { type: "email", label: "Break-up Email" },
    ],
  },
  {
    id: "2",
    name: "Warm Inbound Nurture",
    description: "Quick follow-up for inbound leads showing buying signals",
    enrolledCount: 18,
    steps: [
      { type: "email", label: "Thank You + Value" },
      { type: "wait", label: "Wait 1 day", days: 1 },
      { type: "call", label: "Phone Call" },
      { type: "wait", label: "Wait 2 days", days: 2 },
      { type: "email", label: "Case Study Email" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "linkedin", label: "LinkedIn Engage" },
    ],
  },
  {
    id: "3",
    name: "Re-Engagement",
    description: "Win back leads that went cold after initial contact",
    enrolledCount: 22,
    steps: [
      { type: "email", label: "Check-in Email" },
      { type: "wait", label: "Wait 5 days", days: 5 },
      { type: "linkedin", label: "LinkedIn Comment" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "email", label: "New Value Prop" },
      { type: "wait", label: "Wait 4 days", days: 4 },
      { type: "call", label: "Direct Call" },
    ],
  },
];

const stepIcon = (type: Step["type"]) => {
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "wait":
      return <Clock className="h-4 w-4" />;
    case "linkedin":
      return <Share2 className="h-4 w-4" />;
    case "call":
      return <MessageSquare className="h-4 w-4" />;
  }
};

const stepColor = (type: Step["type"]) => {
  switch (type) {
    case "email":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "wait":
      return "bg-gray-100 text-gray-600 border-gray-200";
    case "linkedin":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "call":
      return "bg-green-100 text-green-700 border-green-200";
  }
};

export default function CadencesPage() {
  const [selectedId, setSelectedId] = useState<string>(sequences[0].id);
  const selected = sequences.find((s) => s.id === selectedId)!;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cadences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-channel outreach sequences.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Sequence
        </Button>
      </div>

      {/* Template cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {sequences.map((seq) => (
          <Card
            key={seq.id}
            onClick={() => setSelectedId(seq.id)}
            className={`cursor-pointer p-4 transition-all ${
              selectedId === seq.id
                ? "ring-2 ring-indigo-500"
                : "hover:shadow-md"
            }`}
          >
            <h3 className="font-medium">{seq.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {seq.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {seq.steps.filter((s) => s.type !== "wait").length} touches
              </Badge>
              <span className="text-xs text-muted-foreground">
                {seq.enrolledCount} enrolled
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Visual timeline */}
      <Card className="p-6">
        <h3 className="mb-6 text-sm font-medium text-muted-foreground">
          Sequence Timeline: {selected.name}
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {selected.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap ${stepColor(step.type)}`}
              >
                {stepIcon(step.type)}
                <span>{step.label}</span>
              </div>
              {i < selected.steps.length - 1 && (
                <div className="h-px w-4 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
