"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Clock,
  MessageCircle,
  Phone,
  Plus,
  Trash2,
  Users,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CadenceBuilder } from "@/components/cadences/cadence-builder";
import { EnrollLeadsDialog } from "@/components/cadences/enroll-leads-dialog";

interface Step {
  type: "email" | "wait" | "linkedin" | "call";
  label: string;
  days?: number;
  emailVariant?: string;
}

interface EnrolledLead {
  id: string;
  currentStep: number;
  status: string;
  lead: {
    id: string;
    company: string;
    fitScore: number;
    domain: string;
    status: string;
  };
}

interface Cadence {
  id: string;
  name: string;
  description: string | null;
  steps: string;
  status: string;
  createdAt: string;
  _count?: { enrollments: number };
  enrollments?: EnrolledLead[];
}

const stepIcon = (type: Step["type"]) => {
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "wait":
      return <Clock className="h-4 w-4" />;
    case "linkedin":
      return <MessageCircle className="h-4 w-4" />;
    case "call":
      return <Phone className="h-4 w-4" />;
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
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editCadence, setEditCadence] = useState<Cadence | undefined>();
  const [enrollDialogCadenceId, setEnrollDialogCadenceId] = useState<
    string | null
  >(null);

  const { data: cadences, isLoading } = useQuery<Cadence[]>({
    queryKey: ["cadences"],
    queryFn: async () => {
      const res = await fetch("/api/cadences");
      if (!res.ok) throw new Error("Failed to fetch cadences");
      return res.json();
    },
  });

  const {
    data: selectedCadence,
    isLoading: detailLoading,
  } = useQuery<Cadence>({
    queryKey: ["cadence", selectedId],
    queryFn: async () => {
      const res = await fetch(`/api/cadences/${selectedId}`);
      if (!res.ok) throw new Error("Failed to fetch cadence");
      return res.json();
    },
    enabled: !!selectedId,
  });

  const handleSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["cadences"] });
    if (selectedId) {
      queryClient.invalidateQueries({ queryKey: ["cadence", selectedId] });
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/cadences/${id}`, { method: "DELETE" });
    if (selectedId === id) setSelectedId(null);
    queryClient.invalidateQueries({ queryKey: ["cadences"] });
  };

  const handleToggleStatus = async (cadence: Cadence) => {
    const newStatus = cadence.status === "active" ? "paused" : "active";
    await fetch(`/api/cadences/${cadence.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    queryClient.invalidateQueries({ queryKey: ["cadences"] });
    queryClient.invalidateQueries({ queryKey: ["cadence", cadence.id] });
  };

  const parseSteps = (stepsStr: string): Step[] => {
    try {
      return JSON.parse(stepsStr);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-2 h-4 w-60" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cadences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Multi-channel outreach sequences.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700"
          onClick={() => {
            setEditCadence(undefined);
            setBuilderOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Sequence
        </Button>
      </div>

      {/* Cadence cards */}
      {!cadences?.length ? (
        <Card className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-muted p-4">
            <Mail className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No cadences yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first sequence to start automating outreach.
          </p>
          <Button
            className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              setEditCadence(undefined);
              setBuilderOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Sequence
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {cadences.map((cadence) => {
            const steps = parseSteps(cadence.steps);
            const isSelected = selectedId === cadence.id;
            return (
              <motion.div
                key={cadence.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  onClick={() =>
                    setSelectedId(isSelected ? null : cadence.id)
                  }
                  className={`cursor-pointer p-4 transition-all ${
                    isSelected
                      ? "ring-2 ring-indigo-500"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{cadence.name}</h3>
                    <Badge
                      variant="secondary"
                      className={
                        cadence.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {cadence.status}
                    </Badge>
                  </div>
                  {cadence.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {cadence.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {steps.filter((s) => s.type !== "wait").length} touches
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {steps.length} steps
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <Users className="mr-1 inline h-3 w-3" />
                      {cadence._count?.enrollments ?? 0} enrolled
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Expanded detail panel */}
      <AnimatePresence>
        {selectedId && selectedCadence && (
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Timeline */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Sequence Timeline: {selectedCadence.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(selectedCadence);
                    }}
                  >
                    {selectedCadence.status === "active" ? (
                      <>
                        <Pause className="mr-1 h-3.5 w-3.5" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3.5 w-3.5" /> Resume
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditCadence(selectedCadence);
                      setBuilderOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(selectedCadence.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {detailLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {parseSteps(selectedCadence.steps).map((step, i, arr) => (
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
                      {i < arr.length - 1 && (
                        <div className="h-px w-4 bg-border" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>

            {/* Enrolled leads */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Enrolled Leads ({selectedCadence.enrollments?.length ?? 0})
                </h3>
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setEnrollDialogCadenceId(selectedCadence.id)}
                >
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  Enroll Leads
                </Button>
              </div>

              {!selectedCadence.enrollments?.length ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No leads enrolled yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedCadence.enrollments.map((enrollment) => {
                    const steps = parseSteps(selectedCadence.steps);
                    const currentStepData = steps[enrollment.currentStep];
                    return (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between rounded-lg border px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium">
                              {enrollment.lead.company}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {enrollment.lead.domain}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs">
                            Fit: {enrollment.lead.fitScore}
                          </Badge>
                          {currentStepData && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${stepColor(currentStepData.type)}`}
                            >
                              Step {enrollment.currentStep + 1}:{" "}
                              {currentStepData.label}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={
                              enrollment.status === "active"
                                ? "bg-green-100 text-green-700"
                                : enrollment.status === "completed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                            }
                          >
                            {enrollment.status}
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <CadenceBuilder
        open={builderOpen}
        onClose={() => {
          setBuilderOpen(false);
          setEditCadence(undefined);
        }}
        onSaved={handleSaved}
        editCadence={editCadence}
      />

      {enrollDialogCadenceId && (
        <EnrollLeadsDialog
          cadenceId={enrollDialogCadenceId}
          open={!!enrollDialogCadenceId}
          onClose={() => {
            setEnrollDialogCadenceId(null);
            if (selectedId) {
              queryClient.invalidateQueries({
                queryKey: ["cadence", selectedId],
              });
            }
            queryClient.invalidateQueries({ queryKey: ["cadences"] });
          }}
        />
      )}
    </div>
  );
}
