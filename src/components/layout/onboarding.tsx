"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Inbox, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { toast } from "sonner";

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // ICP fields
  const [industries, setIndustries] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [fundingStages, setFundingStages] = useState("");
  const [keySignals, setKeySignals] = useState("");
  const [techStack, setTechStack] = useState("");
  const [geoTargets, setGeoTargets] = useState("");

  const dismiss = () => {
    localStorage.setItem("beacon_onboarding_done", "true");
    window.dispatchEvent(new Event("storage"));
  };

  const parseList = (s: string) =>
    s.split(",").map((v) => v.trim()).filter(Boolean);

  async function saveICP() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile/icp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industries: parseList(industries),
          companySizeMin: Number(sizeMin) || 0,
          companySizeMax: Number(sizeMax) || 0,
          fundingStages: parseList(fundingStages),
          keySignals: parseList(keySignals),
          techStack: parseList(techStack),
          geoTargets: parseList(geoTargets),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("ICP profile saved");
      setStep(1);
    } catch {
      toast.error("Failed to save ICP");
    } finally {
      setSaving(false);
    }
  }

  const titles = ["Define your ICP", "Research your first company", "You're all set"];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <BeaconLogo size={48} className="text-primary" />

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
        {titles.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step
                ? "w-6 bg-primary"
                : i < step
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="relative w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Step 0: ICP Profile */}
          {step === 0 && (
            <motion.div
              key="icp"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Target className="size-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{titles[0]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us who you sell to so we can score and surface the best leads.
                </p>
              </div>

              <form
                className="w-full space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveICP();
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Target Industries</Label>
                    <Input
                      placeholder="Fintech, SaaS, Healthcare"
                      value={industries}
                      onChange={(e) => setIndustries(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Company Size</Label>
                    <div className="flex items-center gap-1.5">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={sizeMin}
                        onChange={(e) => setSizeMin(e.target.value)}
                      />
                      <span className="text-xs text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="Max"
                        value={sizeMax}
                        onChange={(e) => setSizeMax(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Funding Stages</Label>
                    <Input
                      placeholder="Series A, Series B"
                      value={fundingStages}
                      onChange={(e) => setFundingStages(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Key Signals</Label>
                    <Input
                      placeholder="Cloud migration, No CISO"
                      value={keySignals}
                      onChange={(e) => setKeySignals(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tech Stack</Label>
                    <Input
                      placeholder="AWS, Kubernetes"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Regions</Label>
                    <Input
                      placeholder="US, Europe"
                      value={geoTargets}
                      onChange={(e) => setGeoTargets(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save & Continue"}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 1: Research */}
          {step === 1 && (
            <motion.div
              key="research"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{titles[1]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search for any company to get a full intelligence breakdown powered by real data.
                </p>
              </div>
              <form
                className="flex w-full gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    dismiss();
                    router.push(
                      `/research?q=${encodeURIComponent(searchQuery.trim())}`
                    );
                  }
                }}
              >
                <Input
                  type="text"
                  placeholder="e.g. CrowdStrike, Palo Alto Networks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button type="submit" disabled={!searchQuery.trim()}>
                  Research
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Done */}
          {step === 2 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Inbox className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{titles[2]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your inbox will show leads you research and save. Use Discover to find companies matching your ICP, or research any company directly.
                </p>
              </div>
              <Button onClick={dismiss} className="w-full">
                Get started
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        {step < 2 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(step + 1)}>
            Skip step
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={dismiss}>
          Skip all
        </Button>
      </div>
    </div>
  );
}
