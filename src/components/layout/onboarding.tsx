"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Inbox, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeaconLogo } from "@/components/layout/beacon-logo";

const steps = [
  {
    key: "icp",
    icon: Target,
    title: "Set your ICP",
    description:
      "Define your Ideal Customer Profile so Beacon can find companies that match your target market. We'll use this to score and surface the best-fit leads.",
    cta: "Set up ICP",
  },
  {
    key: "research",
    icon: Search,
    title: "Research your first company",
    description:
      "Search for any company to see a full breakdown — fit score, tech stack, signals, and contacts — all in one place.",
  },
  {
    key: "inbox",
    icon: Inbox,
    title: "Explore your inbox",
    description:
      "Your inbox surfaces new leads daily, ranked by fit. Snooze, archive, or dive deeper — everything you need to stay on top of your pipeline.",
  },
] as const;

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const dismiss = () => {
    localStorage.setItem("beacon_onboarding_done", "true");
    // Force a re-render in parent by dispatching a storage event
    window.dispatchEvent(new Event("storage"));
  };

  const current = steps[step];

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <BeaconLogo size={56} className="text-primary" />

      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to Beacon
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Let&apos;s get you set up in 3 quick steps
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-2 rounded-full transition-all ${
              i === step
                ? "w-6 bg-primary"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="relative w-full max-w-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <current.icon className="size-6" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {current.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {current.description}
              </p>
            </div>

            {/* Step-specific actions */}
            {step === 0 && (
              <Button onClick={() => router.push("/profile?tab=icp")}>
                Set up ICP
              </Button>
            )}

            {step === 1 && (
              <form
                className="flex w-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(
                      `/research?q=${encodeURIComponent(searchQuery.trim())}`,
                    );
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Search a company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button type="submit" disabled={!searchQuery.trim()}>
                  Search
                </Button>
              </form>
            )}

            {step === 2 && (
              <Button onClick={dismiss}>Get started</Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 && (
          <Button variant="outline" size="sm" onClick={() => setStep(step + 1)}>
            Next
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={dismiss}>
          Skip
        </Button>
      </div>
    </div>
  );
}
