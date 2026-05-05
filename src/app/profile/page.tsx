"use client";

import { useRouter } from "next/navigation";
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
          <Card className="p-6">
            <h2 className="text-lg font-medium">Ideal Customer Profile</h2>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Target Industry</Label>
                <Input defaultValue="Fintech, SaaS, Healthcare" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Company Size</Label>
                <Input defaultValue="50-500 employees" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Funding Stage</Label>
                <Input defaultValue="Series A - Series C" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Key Signals</Label>
                <Input
                  defaultValue="Cloud migration, No CISO, SOC 2"
                  readOnly
                />
              </div>
            </div>
          </Card>
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
