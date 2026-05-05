"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/app/providers";
import { LogOut } from "lucide-react";

const integrations = [
  { name: "HubSpot", description: "Sync contacts and deals", connected: false },
  { name: "Salesforce", description: "Push leads to your CRM", connected: true },
  { name: "Apollo", description: "Enrich leads with contact data", connected: false },
  { name: "Gmail", description: "Send sequences from your inbox", connected: true },
];

export default function ProfilePage() {
  const user = useUser();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
            {user?.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user?.name}
            </h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      {/* Tabbed sections */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="icp">ICP Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="signature">Email Signature</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-lg font-medium">Profile</h2>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user?.name || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input defaultValue="Beacon Security" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue="Head of Sales" readOnly />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="icp">
          <ICPEditor />
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-lg font-medium">Integrations</h2>
            <Separator className="my-4" />
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">
                        {integration.name}
                      </h3>
                      {integration.connected && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-700 text-xs"
                        >
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                  <Button
                    variant={integration.connected ? "outline" : "default"}
                    size="sm"
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="signature">
          <Card className="p-6">
            <h2 className="text-lg font-medium">Email Signature</h2>
            <Separator className="my-4" />
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                Head of Sales | Beacon Security
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email} | (415) 555-0142
              </p>
              <p className="mt-1 text-xs text-primary">
                Book a meeting: cal.com/beacon
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ICPEditor() {
  const [industries, setIndustries] = useState("");
  const [sizeMin, setSizeMin] = useState<number>(0);
  const [sizeMax, setSizeMax] = useState<number>(0);
  const [fundingStages, setFundingStages] = useState("");
  const [keySignals, setKeySignals] = useState("");
  const [techStack, setTechStack] = useState("");
  const [geoTargets, setGeoTargets] = useState("");

  const { data: icp, isLoading } = useQuery({
    queryKey: ["icp"],
    queryFn: async () => {
      const res = await fetch("/api/profile/icp");
      if (!res.ok) throw new Error("Failed to fetch ICP");
      return res.json();
    },
  });

  useEffect(() => {
    if (icp) {
      setIndustries((icp.industries || []).join(", "));
      setSizeMin(icp.companySizeMin || 0);
      setSizeMax(icp.companySizeMax || 0);
      setFundingStages((icp.fundingStages || []).join(", "));
      setKeySignals((icp.keySignals || []).join(", "));
      setTechStack((icp.techStack || []).join(", "));
      setGeoTargets((icp.geoTargets || []).join(", "));
    }
  }, [icp]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parseList = (s: string) =>
        s.split(",").map((v) => v.trim()).filter(Boolean);
      const res = await fetch("/api/profile/icp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industries: parseList(industries),
          companySizeMin: sizeMin,
          companySizeMax: sizeMax,
          fundingStages: parseList(fundingStages),
          keySignals: parseList(keySignals),
          techStack: parseList(techStack),
          geoTargets: parseList(geoTargets),
        }),
      });
      if (!res.ok) throw new Error("Failed to save ICP");
      return res.json();
    },
    onSuccess: () => toast.success("ICP profile saved"),
    onError: () => toast.error("Failed to save ICP profile"),
  });

  const rescoreMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/leads/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (!res.ok) throw new Error("Failed to re-score leads");
      return res.json();
    },
    onSuccess: (data) =>
      toast.success(`Re-scored ${data.count ?? 0} leads`),
    onError: () => toast.error("Failed to re-score leads"),
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium">Ideal Customer Profile</h2>
      <Separator className="my-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Industries (comma-separated)</Label>
          <Input
            value={industries}
            onChange={(e) => setIndustries(e.target.value)}
            placeholder="Fintech, SaaS, Healthcare"
          />
        </div>
        <div className="space-y-2">
          <Label>Company Size</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={sizeMin || ""}
              onChange={(e) => setSizeMin(Number(e.target.value))}
              placeholder="Min"
            />
            <span className="text-sm text-muted-foreground">-</span>
            <Input
              type="number"
              value={sizeMax || ""}
              onChange={(e) => setSizeMax(Number(e.target.value))}
              placeholder="Max"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Funding Stages (comma-separated)</Label>
          <Input
            value={fundingStages}
            onChange={(e) => setFundingStages(e.target.value)}
            placeholder="Series A, Series B"
          />
        </div>
        <div className="space-y-2">
          <Label>Key Signals (comma-separated)</Label>
          <Input
            value={keySignals}
            onChange={(e) => setKeySignals(e.target.value)}
            placeholder="Cloud migration, No CISO"
          />
        </div>
        <div className="space-y-2">
          <Label>Tech Stack (comma-separated)</Label>
          <Input
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="AWS, React, Kubernetes"
          />
        </div>
        <div className="space-y-2">
          <Label>Geo Targets (comma-separated)</Label>
          <Input
            value={geoTargets}
            onChange={(e) => setGeoTargets(e.target.value)}
            placeholder="US, Europe, APAC"
          />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save ICP Profile"}
        </Button>
        <Button
          variant="outline"
          onClick={() => rescoreMutation.mutate()}
          disabled={rescoreMutation.isPending}
        >
          {rescoreMutation.isPending ? "Scoring..." : "Re-score All Leads"}
        </Button>
      </div>
    </Card>
  );
}
