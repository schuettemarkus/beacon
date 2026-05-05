"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const periods = ["7d", "30d", "90d"] as const;

const weeklyLeads = [
  { week: "W1", leads: 12 },
  { week: "W2", leads: 19 },
  { week: "W3", leads: 15 },
  { week: "W4", leads: 28 },
  { week: "W5", leads: 34 },
  { week: "W6", leads: 29 },
  { week: "W7", leads: 42 },
  { week: "W8", leads: 38 },
];

const fitScoreDistribution = [
  { range: "0-20", count: 3 },
  { range: "21-40", count: 8 },
  { range: "41-60", count: 22 },
  { range: "61-80", count: 45 },
  { range: "81-100", count: 31 },
];

const funnelData = [
  { stage: "Leads Sourced", value: 248, pct: 100 },
  { stage: "Contacted", value: 186, pct: 75 },
  { stage: "Replied", value: 64, pct: 26 },
  { stage: "Demo Booked", value: 28, pct: 11 },
  { stage: "Proposal", value: 14, pct: 6 },
  { stage: "Closed", value: 7, pct: 3 },
];

const replyRateByVariant = [
  { variant: "Pain Point", rate: 18 },
  { variant: "Social Proof", rate: 14 },
  { variant: "Direct Ask", rate: 9 },
  { variant: "Value Prop", rate: 22 },
  { variant: "Referral", rate: 27 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<(typeof periods)[number]>("30d");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pipeline Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track sourcing performance and conversion metrics.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-indigo-600 text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Leads Sourced */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Weekly Leads Sourced
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Fit Score Distribution */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Fit Score Distribution
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fitScoreDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion Funnel */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            {funnelData.map((step) => (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{step.stage}</span>
                  <span className="text-muted-foreground">
                    {step.value} ({step.pct}%)
                  </span>
                </div>
                <div className="h-6 w-full overflow-hidden rounded bg-muted">
                  <div
                    className="h-full rounded bg-indigo-500 transition-all"
                    style={{ width: `${step.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Reply Rate by Variant */}
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Reply Rate by Email Variant
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={replyRateByVariant} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
              <YAxis
                type="category"
                dataKey="variant"
                tick={{ fontSize: 12 }}
                width={90}
              />
              <Tooltip />
              <Bar dataKey="rate" fill="#4F46E5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
