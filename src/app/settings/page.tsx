"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const integrations = [
  { name: "HubSpot", description: "Sync contacts and deals", connected: false },
  { name: "Salesforce", description: "Push leads to your CRM", connected: true },
  { name: "Apollo", description: "Enrich leads with contact data", connected: false },
  { name: "Gmail", description: "Send sequences from your inbox", connected: true },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account, ICP profile, and integrations.
        </p>
      </div>

      {/* Profile */}
      <Card className="p-6">
        <h2 className="text-lg font-medium">Profile</h2>
        <Separator className="my-4" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue="Alex Johnson" readOnly />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="alex@beacon.io" readOnly />
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

      {/* ICP Profile */}
      <Card className="p-6">
        <h2 className="text-lg font-medium">ICP Profile</h2>
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
            <Input defaultValue="Cloud migration, No CISO, SOC 2" readOnly />
          </div>
        </div>
      </Card>

      {/* Integrations */}
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
                  <h3 className="text-sm font-medium">{integration.name}</h3>
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
                className={
                  integration.connected ? "" : "bg-indigo-600 hover:bg-indigo-700"
                }
              >
                {integration.connected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Email Signature */}
      <Card className="p-6">
        <h2 className="text-lg font-medium">Email Signature</h2>
        <Separator className="my-4" />
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium">Alex Johnson</p>
          <p className="text-xs text-muted-foreground">
            Head of Sales | Beacon Security
          </p>
          <p className="text-xs text-muted-foreground">
            alex@beacon.io | (415) 555-0142
          </p>
          <p className="mt-1 text-xs text-indigo-600">
            Book a meeting: cal.com/alex-beacon
          </p>
        </div>
      </Card>
    </div>
  );
}
