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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim() && !addNote.isPending) addNote.mutate();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (text.trim() && !addNote.isPending) addNote.mutate();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a note about this lead... (Cmd+Enter to save)"
        className="min-h-[80px] text-sm resize-none"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!text.trim() || addNote.isPending}
        className="gap-1.5"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        {addNote.isPending ? "Saving..." : "Add Note"}
      </Button>
    </form>
  );
}
