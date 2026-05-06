"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/app/providers";
import { useIndustry } from "@/hooks/use-industry";
import { LogOut, Search, Mail, Database, MessageSquare, ExternalLink, Check, Eye, EyeOff } from "lucide-react";

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
        <div className="overflow-x-auto -mx-4 px-4">
          <TabsList>
            <TabsTrigger value="profile" className="flex-shrink-0 whitespace-nowrap">Profile</TabsTrigger>
            <TabsTrigger value="seller" className="flex-shrink-0 whitespace-nowrap">My Company</TabsTrigger>
            <TabsTrigger value="icp" className="flex-shrink-0 whitespace-nowrap">ICP Profile</TabsTrigger>
            <TabsTrigger value="integrations" className="flex-shrink-0 whitespace-nowrap">Integrations</TabsTrigger>
            <TabsTrigger value="signature" className="flex-shrink-0 whitespace-nowrap">Email Signature</TabsTrigger>
            <TabsTrigger value="preferences" className="flex-shrink-0 whitespace-nowrap">Preferences</TabsTrigger>
          </TabsList>
        </div>

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

        <TabsContent value="seller">
          <SellerEditor />
        </TabsContent>

        <TabsContent value="icp">
          <ICPEditor />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsEditor />
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

        <TabsContent value="preferences">
          <PreferencesEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface IntegrationDef {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keyField: string;
  placeholder: string;
  docsUrl: string;
  testable: boolean;
  envFallback?: string;
}

const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "hunter",
    name: "Hunter.io",
    description: "Find verified email addresses and enrich contact data for leads",
    icon: Search,
    keyField: "hunterApiKey",
    placeholder: "Enter your Hunter.io API key",
    docsUrl: "https://hunter.io/api-keys",
    testable: true,
    envFallback: "HUNTER_API_KEY",
  },
  {
    id: "resend",
    name: "Resend",
    description: "Send outreach emails directly from Beacon with open/click tracking",
    icon: Mail,
    keyField: "resendApiKey",
    placeholder: "Enter your Resend API key",
    docsUrl: "https://resend.com/api-keys",
    testable: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync leads, contacts, and deal stages to your HubSpot CRM",
    icon: Database,
    keyField: "hubspotApiKey",
    placeholder: "Enter your HubSpot private app token",
    docsUrl: "https://developers.hubspot.com/docs/api/private-apps",
    testable: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notified about new leads, signals, and pipeline updates in Slack",
    icon: MessageSquare,
    keyField: "slackWebhook",
    placeholder: "Enter your Slack webhook URL",
    docsUrl: "https://api.slack.com/messaging/webhooks",
    testable: true,
  },
];

function IntegrationsEditor() {
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [keyValue, setKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, { ok: boolean; error?: string; details?: any }>>({});

  const { data: saved, isLoading } = useQuery({
    queryKey: ["integrations"],
    queryFn: async () => {
      const res = await fetch("/api/profile/integrations");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      const res = await fetch("/api/profile/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      setEditingKey(null);
      setKeyValue("");
      setShowKey(false);
      toast.success("Integration saved");
    },
    onError: () => toast.error("Failed to save integration"),
  });

  const disconnectMutation = useMutation({
    mutationFn: async (field: string) => {
      const res = await fetch("/api/profile/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: "" }),
      });
      if (!res.ok) throw new Error("Failed to disconnect");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      setTestResult({});
      toast.success("Integration disconnected");
    },
    onError: () => toast.error("Failed to disconnect"),
  });

  async function testConnection(integration: IntegrationDef) {
    const key = editingKey === integration.id ? keyValue : "";
    if (!key && !saved?.[integration.keyField]) return;

    setTesting(integration.id);
    try {
      const res = await fetch("/api/profile/integrations/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: integration.id,
          apiKey: key || "use-saved",
        }),
      });
      const data = await res.json();
      setTestResult((prev) => ({ ...prev, [integration.id]: data }));
      if (data.ok) {
        toast.success(`${integration.name} connected successfully`);
      } else {
        toast.error(data.error || "Connection test failed");
      }
    } catch {
      setTestResult((prev) => ({ ...prev, [integration.id]: { ok: false, error: "Network error" } }));
      toast.error("Connection test failed");
    } finally {
      setTesting(null);
    }
  }

  function isConnected(field: string): boolean {
    return !!saved?.[field];
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium">Integrations</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect external services to enhance Beacon&apos;s capabilities.
      </p>
      <Separator className="my-4" />
      <div className="space-y-4">
        {INTEGRATIONS.map((integration) => {
          const connected = isConnected(integration.keyField);
          const isEditing = editingKey === integration.id;
          const Icon = integration.icon;
          const result = testResult[integration.id];

          return (
            <div
              key={integration.id}
              className={`rounded-lg border p-4 transition-colors ${
                connected
                  ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
                  : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    connected ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{integration.name}</h3>
                      {connected && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400 text-[10px]"
                        >
                          <Check className="mr-0.5 h-3 w-3" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {integration.description}
                    </p>
                    {connected && !isEditing && (
                      <p className="mt-1 text-xs font-mono text-muted-foreground">
                        Key: {saved[integration.keyField]}
                      </p>
                    )}
                    {result && !result.ok && (
                      <p className="mt-1 text-xs text-destructive">{result.error}</p>
                    )}
                    {result?.ok && result.details && (
                      <p className="mt-1 text-xs text-emerald-600">
                        {result.details.plan && `Plan: ${result.details.plan}`}
                        {result.details.remaining !== undefined && ` · ${result.details.remaining} searches remaining`}
                        {result.details.verified && "Domain verified"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={integration.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                    title="View docs"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  {connected && !isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => disconnectMutation.mutate(integration.keyField)}
                      disabled={disconnectMutation.isPending}
                    >
                      Disconnect
                    </Button>
                  ) : !isEditing ? (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingKey(integration.id);
                        setKeyValue("");
                        setShowKey(false);
                        setTestResult((prev) => {
                          const next = { ...prev };
                          delete next[integration.id];
                          return next;
                        });
                      }}
                    >
                      Connect
                    </Button>
                  ) : null}
                </div>
              </div>

              {/* API key input form */}
              {isEditing && (
                <div className="mt-3 space-y-2 pl-12">
                  <div className="relative">
                    <Input
                      type={showKey ? "text" : "password"}
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      placeholder={integration.placeholder}
                      className="pr-10"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => saveMutation.mutate({ field: integration.keyField, value: keyValue })}
                      disabled={!keyValue.trim() || saveMutation.isPending}
                    >
                      {saveMutation.isPending ? "Saving..." : "Save Key"}
                    </Button>
                    {integration.testable && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testConnection({ ...integration })}
                        disabled={!keyValue.trim() || testing === integration.id}
                      >
                        {testing === integration.id ? "Testing..." : "Test Connection"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingKey(null); setKeyValue(""); setShowKey(false); }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PreferencesEditor() {
  const [darkMode, setDarkMode] = useState(false);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [defaultGroup, setDefaultGroup] = useState("today");

  useEffect(() => {
    setDarkMode(localStorage.getItem("beacon_dark_mode") === "true");
    setShortcutsEnabled(
      localStorage.getItem("beacon_shortcuts_enabled") !== "false"
    );
    setCompactMode(localStorage.getItem("beacon_compact_mode") === "true");
    setDefaultGroup(
      localStorage.getItem("beacon_default_group") || "today"
    );
  }, []);

  function toggleDarkMode(checked: boolean) {
    setDarkMode(checked);
    localStorage.setItem("beacon_dark_mode", String(checked));
    document.documentElement.classList.toggle("dark", checked);
  }

  function toggleShortcuts(checked: boolean) {
    setShortcutsEnabled(checked);
    localStorage.setItem("beacon_shortcuts_enabled", String(checked));
  }

  function toggleCompact(checked: boolean) {
    setCompactMode(checked);
    localStorage.setItem("beacon_compact_mode", String(checked));
  }

  function changeDefaultGroup(val: string | null) {
    if (!val) return;
    setDefaultGroup(val);
    localStorage.setItem("beacon_default_group", val);
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium">Preferences</h2>
      <Separator className="my-4" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <p className="text-xs text-muted-foreground">
              Switch between light and dark theme
            </p>
          </div>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Keyboard Shortcuts</Label>
            <p className="text-xs text-muted-foreground">
              Use keys like j/k to navigate leads, a to archive, ? for help
            </p>
          </div>
          <Switch
            checked={shortcutsEnabled}
            onCheckedChange={toggleShortcuts}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Compact Mode</Label>
            <p className="text-xs text-muted-foreground">
              Show denser inbox cards with less whitespace
            </p>
          </div>
          <Switch checked={compactMode} onCheckedChange={toggleCompact} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Default Inbox Group</Label>
            <p className="text-xs text-muted-foreground">
              Which group opens expanded by default
            </p>
          </div>
          <Select value={defaultGroup} onValueChange={changeDefaultGroup}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}

function ICPEditor() {
  const { config } = useIndustry();
  const [industries, setIndustries] = useState("");
  const [sizeMin, setSizeMin] = useState<number>(0);
  const [sizeMax, setSizeMax] = useState<number>(0);
  const [fundingStages, setFundingStages] = useState("");
  const [keySignals, setKeySignals] = useState("");
  const [techStack, setTechStack] = useState("");
  const [geoTargets, setGeoTargets] = useState("");
  const [buyerTitles, setBuyerTitles] = useState("");
  const [verticals, setVerticals] = useState("");
  const [accountType, setAccountType] = useState<"new_business" | "expansion" | "both">("both");

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
      setBuyerTitles((icp.buyerTitles || []).join(", "));
      setVerticals((icp.verticals || []).join(", "));
      setAccountType(icp.accountType || "both");
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
          buyerTitles: parseList(buyerTitles),
          verticals: parseList(verticals),
          accountType,
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
            placeholder={config.keySignalPlaceholder}
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
        <div className="space-y-2">
          <Label>Target Buyer Titles (comma-separated)</Label>
          <Input
            value={buyerTitles}
            onChange={(e) => setBuyerTitles(e.target.value)}
            placeholder="IT Director, CTO, VP Infrastructure"
          />
        </div>
        <div className="space-y-2">
          <Label>Verticals (comma-separated)</Label>
          <Input
            value={verticals}
            onChange={(e) => setVerticals(e.target.value)}
            placeholder="SLED, GHE, Enterprise, Mid-Market"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Account Type</Label>
          <div className="flex gap-2">
            {([["new_business", "New Business"], ["expansion", "Expansion"], ["both", "Both"]] as const).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setAccountType(val)}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
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

const REGION_PRESETS: Record<string, string[]> = {
  West: ["CA", "WA", "OR", "NV", "AZ", "UT", "CO"],
  East: ["NY", "NJ", "PA", "MA", "CT", "MD", "VA"],
  Central: ["IL", "OH", "MI", "MN", "WI", "IN", "MO"],
  South: ["TX", "FL", "GA", "NC", "TN", "AL", "SC"],
  Northeast: ["NY", "MA", "CT", "NJ", "PA", "NH", "VT", "ME", "RI"],
};

function SellerEditor() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [products, setProducts] = useState("");
  const [valueProps, setValueProps] = useState("");
  const [territoryType, setTerritoryType] = useState<"national" | "regional" | "states">("national");
  const [territoryStates, setTerritoryStates] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data: seller, isLoading } = useQuery({
    queryKey: ["seller-profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile/seller");
      if (!res.ok) throw new Error("Failed to fetch seller profile");
      return res.json();
    },
  });

  useEffect(() => {
    if (seller) {
      setCompany(seller.company || "");
      setRole(seller.role || "");
      setProducts((seller.products || []).join(", "));
      setValueProps(seller.valueProps || "");
      setTerritoryType(seller.territory?.type || "national");
      if (seller.territory?.type === "states") {
        setTerritoryStates((seller.territory.states || []).join(", "));
      }
      if (seller.territory?.type === "regional") {
        setSelectedRegion(seller.territory.description || null);
      }
    }
  }, [seller]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const parseList = (s: string) =>
        s.split(",").map((v) => v.trim()).filter(Boolean);

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
          company,
          role,
          products: parseList(products),
          valueProps,
          territory,
        }),
      });
      if (!res.ok) throw new Error("Failed to save seller profile");
      return res.json();
    },
    onSuccess: () => toast.success("Seller profile saved"),
    onError: () => toast.error("Failed to save seller profile"),
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
      <h2 className="text-lg font-medium">My Company</h2>
      <Separator className="my-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Trellix, Palo Alto Networks"
          />
        </div>
        <div className="space-y-2">
          <Label>Your Role</Label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Account Manager, AE, SDR"
          />
        </div>
        <div className="space-y-2">
          <Label>Products (comma-separated)</Label>
          <Input
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            placeholder="e.g., XDR, MDR, endpoint security"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Value Proposition</Label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={valueProps}
            onChange={(e) => setValueProps(e.target.value)}
            placeholder="Brief pitch — e.g., Unified threat detection across endpoints and cloud"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Territory</Label>
          <div className="flex gap-2">
            {(["national", "regional", "states"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTerritoryType(t); setSelectedRegion(null); }}
                className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
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
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.keys(REGION_PRESETS).map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-md border px-2.5 py-1 text-sm font-medium transition-colors ${
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
              value={territoryStates}
              onChange={(e) => setTerritoryStates(e.target.value)}
              placeholder="CA, NY, TX, FL"
              className="mt-2"
            />
          )}
        </div>
      </div>
      <div className="mt-6">
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save Seller Profile"}
        </Button>
      </div>
    </Card>
  );
}
