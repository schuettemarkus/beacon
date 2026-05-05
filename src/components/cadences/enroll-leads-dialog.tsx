"use client";

import { useState, useEffect, useMemo } from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  company: string;
  domain: string;
  fitScore: number;
  status: string;
}

interface EnrollLeadsDialogProps {
  cadenceId: string;
  open: boolean;
  onClose: () => void;
}

export function EnrollLeadsDialog({
  cadenceId,
  open,
  onClose,
}: EnrollLeadsDialogProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    setSearch("");
    setLoading(true);

    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        // Flatten grouped leads into a single array
        const all: Lead[] = [];
        for (const group of Object.values(data)) {
          if (Array.isArray(group)) {
            all.push(
              ...group.map((l: any) => ({
                id: l.id,
                company: l.company,
                domain: l.domain,
                fitScore: l.fitScore,
                status: l.status,
              }))
            );
          }
        }
        setLeads(all);
      })
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return leads;
    const q = search.toLowerCase();
    return leads.filter(
      (l) =>
        l.company.toLowerCase().includes(q) ||
        l.domain.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const toggleLead = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEnroll = async () => {
    if (selected.size === 0) return;
    setEnrolling(true);

    try {
      const res = await fetch(`/api/cadences/${cadenceId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: Array.from(selected) }),
      });

      if (res.ok) {
        onClose();
      }
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Enroll Leads
          </DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search leads..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto min-h-0 max-h-[400px] space-y-1 mt-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No leads found
            </p>
          ) : (
            filtered.map((lead) => (
              <label
                key={lead.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selected.has(lead.id)}
                  onChange={() => toggleLead(lead.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{lead.company}</p>
                  <p className="text-xs text-muted-foreground">{lead.domain}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {lead.fitScore}
                </Badge>
              </label>
            ))
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            {selected.size} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleEnroll}
              disabled={selected.size === 0 || enrolling}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {enrolling ? "Enrolling..." : `Enroll Selected`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
