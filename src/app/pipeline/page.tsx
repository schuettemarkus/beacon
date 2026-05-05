"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  company: string;
  fitScore: number;
  dealValue: string;
  stage: string;
}

const stages = [
  "New",
  "Contacted",
  "Engaged",
  "Demo Booked",
  "Proposal",
  "Closed",
];

const initialLeads: Lead[] = [
  { id: "1", company: "NovaPay", fitScore: 96, dealValue: "$48K", stage: "New" },
  { id: "2", company: "CloudVault", fitScore: 93, dealValue: "$36K", stage: "New" },
  { id: "3", company: "FinLeap", fitScore: 89, dealValue: "$62K", stage: "Contacted" },
  { id: "4", company: "PayStream", fitScore: 87, dealValue: "$28K", stage: "Contacted" },
  { id: "5", company: "LedgerBase", fitScore: 84, dealValue: "$55K", stage: "Engaged" },
  { id: "6", company: "TrustPay", fitScore: 81, dealValue: "$42K", stage: "Engaged" },
  { id: "7", company: "DataSync", fitScore: 78, dealValue: "$33K", stage: "Demo Booked" },
  { id: "8", company: "SecureOps", fitScore: 91, dealValue: "$72K", stage: "Demo Booked" },
  { id: "9", company: "Infrawise", fitScore: 76, dealValue: "$24K", stage: "Proposal" },
  { id: "10", company: "NetShield", fitScore: 88, dealValue: "$58K", stage: "Proposal" },
  { id: "11", company: "CyberCore", fitScore: 94, dealValue: "$85K", stage: "Closed" },
  { id: "12", company: "StackGuard", fitScore: 82, dealValue: "$31K", stage: "New" },
  { id: "13", company: "VaultEdge", fitScore: 79, dealValue: "$44K", stage: "Contacted" },
];

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    if (!draggedId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === draggedId ? { ...l, stage } : l))
    );
    setDraggedId(null);
  };

  const getLeadsForStage = (stage: string) =>
    leads.filter((l) => l.stage === stage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag leads between stages to update their status.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
            className="flex w-64 shrink-0 flex-col rounded-xl border border-border bg-muted/30 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">{stage}</h3>
              <Badge variant="secondary" className="text-xs">
                {getLeadsForStage(stage).length}
              </Badge>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {getLeadsForStage(stage).map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(
                      e as unknown as React.DragEvent,
                      lead.id
                    )
                  }
                  className="cursor-grab active:cursor-grabbing"
                >
                  <Card className="p-3 transition-shadow hover:shadow-md">
                    <p className="text-sm font-medium">{lead.company}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Fit: {lead.fitScore}
                      </span>
                      <span className="text-xs font-medium text-indigo-600">
                        {lead.dealValue}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
