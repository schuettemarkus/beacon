"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const shortcuts = [
  { key: "j", action: "Next lead" },
  { key: "k", action: "Previous lead" },
  { key: "a", action: "Archive selected lead" },
  { key: "s", action: "Snooze selected lead" },
  { key: "e", action: "Open email for selected lead" },
  { key: "/", action: "Focus search / command bar" },
  { key: "?", action: "Toggle shortcuts help" },
  { key: "Esc", action: "Clear selection / close modals" },
];

export function ShortcutsHelp({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Navigate and act on leads without touching your mouse.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 pt-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="contents">
              <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 text-xs font-mono text-muted-foreground">
                {s.key}
              </kbd>
              <span className="text-sm text-foreground">{s.action}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
