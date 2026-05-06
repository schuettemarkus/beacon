"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Check,
  Target,
  Shield,
  HeartPulse,
  Banknote,
  Users,
  Megaphone,
  Scale,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BeaconLogo } from "@/components/layout/beacon-logo";
import { toast } from "sonner";
import {
  INDUSTRIES,
  INDUSTRY_IDS,
  type IndustryId,
} from "@/config/industries";

const INDUSTRY_ICONS: Record<IndustryId, React.ComponentType<{ className?: string }>> = {
  cybersecurity: Shield,
  healthtech: HeartPulse,
  fintech: Banknote,
  hrtech: Users,
  martech: Megaphone,
  legaltech: Scale,
};

const REGION_PRESETS: Record<string, string[]> = {
  West: ["CA", "WA", "OR", "NV", "AZ", "UT", "CO"],
  East: ["NY", "NJ", "PA", "MA", "CT", "MD", "VA"],
  Central: ["IL", "OH", "MI", "MN", "WI", "IN", "MO"],
  South: ["TX", "FL", "GA", "NC", "TN", "AL", "SC"],
  Northeast: ["NY", "MA", "CT", "NJ", "PA", "NH", "VT", "ME", "RI"],
};

export function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryId | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // Seller profile fields
  const [sellerCompany, setSellerCompany] = useState("");
  const [sellerRole, setSellerRole] = useState("");
  const [sellerProducts, setSellerProducts] = useState("");
  const [sellerValueProp, setSellerValueProp] = useState("");
  const [territoryType, setTerritoryType] = useState<"national" | "regional" | "states">("national");
  const [territoryStates, setTerritoryStates] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // ICP fields
  const [industries, setIndustries] = useState("");
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [fundingStages, setFundingStages] = useState("");
  const [keySignals, setKeySignals] = useState("");
  const [techStack, setTechStack] = useState("");
  const [geoTargets, setGeoTargets] = useState("");
  const [buyerTitles, setBuyerTitles] = useState("");
  const [verticals, setVerticals] = useState("");
  const [accountType, setAccountType] = useState<"new_business" | "expansion" | "both">("both");

  const dismiss = () => {
    localStorage.setItem("beacon_onboarding_done", "true");
    window.dispatchEvent(new Event("storage"));
  };

  const parseList = (s: string) =>
    s.split(",").map((v) => v.trim()).filter(Boolean);

  async function saveIndustry(id: IndustryId) {
    setSelectedIndustry(id);
    try {
      const res = await fetch("/api/profile/industry", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: id }),
      });
      if (!res.ok) throw new Error();
      setStep(1);
    } catch {
      toast.error("Failed to save industry");
      setSelectedIndustry(null);
    }
  }

  async function saveSellerProfile() {
    setSaving(true);
    try {
      let territory: { type: string; states?: string[]; description?: string } = { type: territoryType };
      if (territoryType === "states") {
        territory.states = parseList(territoryStates);
        territory.description = territory.states.join(", ");
      } else if (territoryType === "regional" && selectedRegion) {
        territory.states = REGION_PRESETS[selectedRegion];
        territory.description = selectedRegion;
      } else {
        territory.description = "National";
      }

      const res = await fetch("/api/profile/seller", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: sellerCompany,
          role: sellerRole,
          products: parseList(sellerProducts),
          valueProps: sellerValueProp,
          territory,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Seller profile saved");
      setStep(2);
    } catch {
      toast.error("Failed to save seller profile");
    } finally {
      setSaving(false);
    }
  }

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
          buyerTitles: parseList(buyerTitles),
          verticals: parseList(verticals),
          accountType,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("ICP profile saved");
      setStep(3);
    } catch {
      toast.error("Failed to save ICP");
    } finally {
      setSaving(false);
    }
  }

  const config = selectedIndustry ? INDUSTRIES[selectedIndustry] : null;

  const titles = [
    "What do you sell?",
    "About You",
    "Define your ICP",
    "You're all set!",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8 md:py-16 md:min-h-[70vh]">
      <BeaconLogo size={48} className="text-primary" />

      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome to Beacon
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Let&apos;s get you set up in {titles.length} quick steps
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
      <div className="relative w-full max-w-md md:max-w-lg">
        <AnimatePresence mode="wait">
          {/* Step 0: Industry Selection */}
          {step === 0 && (
            <motion.div
              key="industry"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold">{titles[0]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick your industry so Beacon can tailor signals, emails, and research to your world.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {INDUSTRY_IDS.map((id) => {
                  const ind = INDUSTRIES[id];
                  const Icon = INDUSTRY_ICONS[id];
                  return (
                    <button
                      key={id}
                      onClick={() => saveIndustry(id)}
                      className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 text-center transition-all hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {ind.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground leading-tight">
                        {ind.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 1: About You (Seller Profile) */}
          {step === 1 && (
            <motion.div
              key="seller"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="size-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{titles[1]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us about your company and what you sell so Beacon can personalize all content.
                </p>
              </div>

              <form
                className="w-full space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSellerProfile();
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Company Name</Label>
                    <Input
                      placeholder="e.g., Trellix, Palo Alto Networks"
                      value={sellerCompany}
                      onChange={(e) => setSellerCompany(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Your Role</Label>
                    <Input
                      placeholder="e.g., Account Manager, AE, SDR"
                      value={sellerRole}
                      onChange={(e) => setSellerRole(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">What You Sell</Label>
                    <Input
                      placeholder="e.g., XDR, MDR, endpoint security"
                      value={sellerProducts}
                      onChange={(e) => setSellerProducts(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Your Value Prop</Label>
                    <Input
                      placeholder="Brief pitch — e.g., Unified threat detection across endpoints and cloud"
                      value={sellerValueProp}
                      onChange={(e) => setSellerValueProp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Territory</Label>
                  <div className="flex gap-2">
                    {(["national", "regional", "states"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setTerritoryType(t); setSelectedRegion(null); }}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          territoryType === t
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {t === "national" ? "National" : t === "regional" ? "Regional" : "Custom States"}
                      </button>
                    ))}
                  </div>
                  {territoryType === "regional" && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Object.keys(REGION_PRESETS).map((region) => (
                        <button
                          key={region}
                          type="button"
                          onClick={() => setSelectedRegion(region)}
                          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                            selectedRegion === region
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  )}
                  {territoryType === "states" && (
                    <Input
                      placeholder="CA, NY, TX, FL"
                      value={territoryStates}
                      onChange={(e) => setTerritoryStates(e.target.value)}
                      className="mt-1"
                    />
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save & Continue"}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 2: ICP Profile */}
          {step === 2 && (
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
                <h3 className="text-lg font-semibold">{titles[2]}</h3>
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
                      placeholder={config?.keySignalPlaceholder || "Cloud migration, No CISO"}
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
                  <div className="space-y-1">
                    <Label className="text-xs">Target Buyer Titles</Label>
                    <Input
                      placeholder="IT Director, CTO, VP Infrastructure"
                      value={buyerTitles}
                      onChange={(e) => setBuyerTitles(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Verticals</Label>
                    <Input
                      placeholder="SLED, GHE, Enterprise, Mid-Market"
                      value={verticals}
                      onChange={(e) => setVerticals(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Account Type</Label>
                  <div className="flex gap-2">
                    {([["new_business", "New Business"], ["expansion", "Expansion"], ["both", "Both"]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAccountType(val)}
                        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          accountType === val
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? "Saving..." : "Save & Continue"}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Step 3: All set */}
          {step === 3 && (
            <motion.div
              key="done"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Check className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{titles[3]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your profile is set up. Beacon will now tailor research, emails, and lead scoring to your world.
                </p>
              </div>
              <Button className="w-full" onClick={dismiss}>
                View Leads
              </Button>
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
                  placeholder={config?.companySearchPlaceholder || "e.g. CrowdStrike, Palo Alto Networks..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" variant="outline" disabled={!searchQuery.trim()}>
                  Research
                </Button>
              </form>
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
        {step < 3 && (
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
