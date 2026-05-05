"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, MessageCircle, Phone, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Step {
  type: "email" | "wait" | "linkedin" | "call";
  label: string;
  days?: number;
  emailVariant?: string;
}

interface CadenceBuilderProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editCadence?: {
    id: string;
    name: string;
    description?: string | null;
    steps: string;
    status: string;
  };
}

const stepTypeConfig = {
  email: { icon: Mail, label: "Email", color: "bg-indigo-100 text-indigo-700" },
  wait: { icon: Clock, label: "Wait", color: "bg-gray-100 text-gray-600" },
  linkedin: {
    icon: MessageCircle,
    label: "LinkedIn DM",
    color: "bg-blue-100 text-blue-700",
  },
  call: { icon: Phone, label: "Call", color: "bg-green-100 text-green-700" },
};

const emailVariants = [
  { value: "cold_intro", label: "Cold Intro" },
  { value: "threat_anchored", label: "Threat Anchored" },
  { value: "executive_brief", label: "Executive Brief" },
];

export function CadenceBuilder({
  open,
  onClose,
  onSaved,
  editCadence,
}: CadenceBuilderProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [saving, setSaving] = useState(false);
  const [addingType, setAddingType] = useState<string | null>(null);

  useEffect(() => {
    if (editCadence) {
      setName(editCadence.name);
      setDescription(editCadence.description || "");
      try {
        setSteps(JSON.parse(editCadence.steps));
      } catch {
        setSteps([]);
      }
    } else {
      setName("");
      setDescription("");
      setSteps([]);
    }
  }, [editCadence, open]);

  const addStep = (type: Step["type"]) => {
    const newStep: Step = { type, label: "" };
    switch (type) {
      case "email":
        newStep.label = "Email";
        newStep.emailVariant = "cold_intro";
        break;
      case "wait":
        newStep.label = "Wait 2 days";
        newStep.days = 2;
        break;
      case "linkedin":
        newStep.label = "LinkedIn DM";
        break;
      case "call":
        newStep.label = "Phone Call";
        break;
    }
    setSteps([...steps, newStep]);
    setAddingType(null);
  };

  const updateStep = (index: number, updates: Partial<Step>) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], ...updates };
    if (updates.days !== undefined) {
      updated[index].label = `Wait ${updates.days} day${updates.days === 1 ? "" : "s"}`;
    }
    if (updates.emailVariant !== undefined) {
      const variant = emailVariants.find((v) => v.value === updates.emailVariant);
      updated[index].label = variant?.label || "Email";
    }
    setSteps(updated);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim() || steps.length === 0) return;
    setSaving(true);

    try {
      const url = editCadence
        ? `/api/cadences/${editCadence.id}`
        : "/api/cadences";
      const method = editCadence ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, steps }),
      });

      if (res.ok) {
        onSaved();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editCadence ? "Edit Cadence" : "Create New Sequence"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cold Outbound - Enterprise"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this cadence..."
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Steps</label>
            <div className="mt-2 space-y-2">
              <AnimatePresence mode="popLayout">
                {steps.map((step, i) => {
                  const config = stepTypeConfig[step.type];
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={`${i}-${step.type}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-2 rounded-lg border p-2"
                    >
                      <Badge
                        variant="secondary"
                        className={`shrink-0 ${config.color}`}
                      >
                        <Icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>

                      {step.type === "email" && (
                        <Select
                          value={step.emailVariant || "cold_intro"}
                          onValueChange={(v: string | null) =>
                            updateStep(i, { emailVariant: v || undefined })
                          }
                        >
                          <SelectTrigger className="h-8 w-40 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {emailVariants.map((v) => (
                              <SelectItem key={v.value} value={v.value}>
                                {v.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {step.type === "wait" && (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={1}
                            max={30}
                            value={step.days || 2}
                            onChange={(e) =>
                              updateStep(i, {
                                days: parseInt(e.target.value) || 1,
                              })
                            }
                            className="h-8 w-16 text-xs"
                          />
                          <span className="text-xs text-muted-foreground">
                            days
                          </span>
                        </div>
                      )}

                      {(step.type === "linkedin" || step.type === "call") && (
                        <span className="text-xs text-muted-foreground">
                          {step.label}
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                        onClick={() => removeStep(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {steps.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No steps yet. Add your first step below.
                </p>
              )}
            </div>

            <div className="mt-3">
              {addingType === null ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAddingType("pick")}
                  className="w-full"
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Step
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  {(
                    Object.entries(stepTypeConfig) as [
                      Step["type"],
                      (typeof stepTypeConfig)[Step["type"]],
                    ][]
                  ).map(([type, cfg]) => {
                    const Icon = cfg.icon;
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => addStep(type)}
                        className={`text-xs ${cfg.color}`}
                      >
                        <Icon className="mr-1 h-3 w-3" />
                        {cfg.label}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingType(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || steps.length === 0 || saving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {saving
                ? "Saving..."
                : editCadence
                  ? "Update Cadence"
                  : "Create Cadence"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
