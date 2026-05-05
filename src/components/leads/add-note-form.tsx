"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function AddNoteForm({ leadId }: { leadId: string }) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();

  const addNote = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "note", payload: { text } }),
      });
      if (!res.ok) throw new Error("Failed to add note");
      return res.json();
    },
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      toast.success("Note added");
    },
  });

  return (
    <div className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a note about this lead..."
        className="min-h-[80px] text-sm resize-none"
      />
      <Button
        size="sm"
        disabled={!text.trim() || addNote.isPending}
        onClick={() => addNote.mutate()}
        className="gap-1.5"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        {addNote.isPending ? "Saving..." : "Add Note"}
      </Button>
    </div>
  );
}
