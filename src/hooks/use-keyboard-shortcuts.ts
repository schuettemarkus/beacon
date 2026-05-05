"use client";

import { useEffect, useState, useCallback } from "react";

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Check if shortcuts are enabled
      const enabled = localStorage.getItem("beacon_shortcuts_enabled");
      if (enabled === "false") return;

      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Don't intercept modifier combos (except Cmd+K handled by command bar)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "?":
          e.preventDefault();
          setShowHelp((prev) => !prev);
          break;
        case "/":
          e.preventDefault();
          // Trigger Cmd+K command bar
          document.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              bubbles: true,
            })
          );
          break;
        case "Escape":
          setShowHelp(false);
          break;
        case "j": {
          e.preventDefault();
          const cards = document.querySelectorAll<HTMLElement>(
            "[data-lead-card]"
          );
          const focused = document.querySelector<HTMLElement>(
            "[data-lead-card][data-focused='true']"
          );
          if (!focused && cards.length > 0) {
            cards[0].setAttribute("data-focused", "true");
            cards[0].focus();
          } else if (focused) {
            const idx = Array.from(cards).indexOf(focused);
            if (idx < cards.length - 1) {
              focused.removeAttribute("data-focused");
              cards[idx + 1].setAttribute("data-focused", "true");
              cards[idx + 1].focus();
              cards[idx + 1].scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          }
          break;
        }
        case "k": {
          e.preventDefault();
          const cards = document.querySelectorAll<HTMLElement>(
            "[data-lead-card]"
          );
          const focused = document.querySelector<HTMLElement>(
            "[data-lead-card][data-focused='true']"
          );
          if (focused) {
            const idx = Array.from(cards).indexOf(focused);
            if (idx > 0) {
              focused.removeAttribute("data-focused");
              cards[idx - 1].setAttribute("data-focused", "true");
              cards[idx - 1].focus();
              cards[idx - 1].scrollIntoView({
                block: "nearest",
                behavior: "smooth",
              });
            }
          }
          break;
        }
        case "a": {
          e.preventDefault();
          const focused = document.querySelector<HTMLElement>(
            "[data-lead-card][data-focused='true']"
          );
          if (focused) {
            const archiveBtn = focused.querySelector<HTMLElement>(
              "[data-action='archive']"
            );
            archiveBtn?.click();
          }
          break;
        }
        case "s": {
          e.preventDefault();
          const focused = document.querySelector<HTMLElement>(
            "[data-lead-card][data-focused='true']"
          );
          if (focused) {
            const snoozeBtn = focused.querySelector<HTMLElement>(
              "[data-action='snooze']"
            );
            snoozeBtn?.click();
          }
          break;
        }
        case "e": {
          e.preventDefault();
          const focused = document.querySelector<HTMLElement>(
            "[data-lead-card][data-focused='true']"
          );
          if (focused) {
            const emailBtn = focused.querySelector<HTMLElement>(
              "[data-action='email']"
            );
            emailBtn?.click();
          }
          break;
        }
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp };
}
