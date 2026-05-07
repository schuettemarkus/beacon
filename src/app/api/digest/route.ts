import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Count current active leads to detect changes
  const currentLeadCount = await prisma.lead.count({
    where: { userId: user.id, status: { not: "archived" } },
  });

  const existing = await prisma.digest.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const payload = JSON.parse(existing.payload);
    // Regenerate if lead count changed (lead added or removed)
    if (payload.leadCount !== currentLeadCount) {
      // Delete stale digest and regenerate
      await prisma.digest.delete({ where: { id: existing.id } });
    } else {
      return NextResponse.json({
        digest: { id: existing.id, ...payload, createdAt: existing.createdAt, readAt: existing.readAt },
      });
    }
  }

  const digest = await generateDigestForUser(user.id, user.industry);
  return NextResponse.json({ digest });
}

export async function PATCH(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await prisma.digest.update({
    where: { id },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}

export async function generateDigestForUser(userId: string, industry: string) {
  const leads = await prisma.lead.findMany({
    where: { userId, status: { not: "archived" } },
    include: { signals: true, activities: true, contacts: true },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Load seller profile for personalized advice
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: { sellerProfile: true, icpProfile: true },
  });
  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.company) parts.push(`Works at ${sp.company}`);
      if (sp.products?.length) parts.push(`Sells: ${sp.products.join(", ")}`);
      if (sp.valueProps) parts.push(`Value prop: ${sp.valueProps}`);
      if (sp.territory?.states?.length) parts.push(`Territory: ${sp.territory.states.join(", ")}`);
      sellerContext = parts.join(". ");
    } catch {}
  }

  const topLeads = leads
    .map((l) => ({
      ...l,
      recentSignals: l.signals.filter((s) => new Date(s.capturedAt) >= sevenDaysAgo),
      score: l.fitScore + l.signals.filter((s) => new Date(s.capturedAt) >= sevenDaysAgo).length * 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const coldLeads = leads.filter((l) => {
    if (l.status !== "today") return false;
    const lastActivity = l.activities.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    )[0];
    if (!lastActivity) return true;
    return new Date(lastActivity.at) < sevenDaysAgo;
  });

  const newSignals = leads.flatMap((l) =>
    l.signals.filter((s) => new Date(s.capturedAt) >= sevenDaysAgo)
  );

  const pipelineMovement = leads.filter((l) =>
    l.activities.some(
      (a) => a.kind === "stage_change" && new Date(a.at) >= sevenDaysAgo
    )
  );

  const config = getIndustryConfig(industry);

  const prompt = JSON.stringify({
    sellerContext,
    topLeads: topLeads.map((l) => ({
      company: l.company,
      industry: l.industry,
      fitScore: l.fitScore,
      dealStage: l.dealStage,
      dealValue: l.dealValue,
      hq: l.hq,
      employees: l.employees,
      contactCount: l.contacts.length,
      recentSignals: l.recentSignals.map((s) => ({ title: s.title, type: s.type, severity: s.severity })),
      techStack: JSON.parse(l.techStack).slice(0, 5),
    })),
    coldLeads: coldLeads.slice(0, 5).map((l) => ({
      company: l.company,
      fitScore: l.fitScore,
      dealStage: l.dealStage,
      dealValue: l.dealValue,
      lastActivityDaysAgo: l.activities.length
        ? Math.round((Date.now() - new Date(l.activities[l.activities.length - 1].at).getTime()) / 86400000)
        : null,
    })),
    hotSignals: newSignals.slice(0, 10).map((s) => ({
      title: s.title,
      type: s.type,
      severity: s.severity,
    })),
    pipelineMovement: pipelineMovement.map((l) => ({
      company: l.company,
      dealStage: l.dealStage,
    })),
    totalActiveLeads: leads.length,
    totalPipelineValue: leads.reduce((sum, l) => {
      if (!l.dealValue) return sum;
      const match = l.dealValue.match(/\$?([\d.]+)K/i);
      return sum + (match ? parseFloat(match[1]) * 1000 : 0);
    }, 0),
    industry: config.displayName,
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: `You are a hands-on ${config.displayName} sales coach who talks like a real sales manager — direct, specific, no corporate fluff. Given pipeline data, produce a comprehensive weekly battle plan.

Return ONLY valid JSON with this shape:
{
  "pipelineSummary": string (2-3 sentences: pipeline health, total value, what's changed this week, and one motivating insight),
  "topLeadsAdvice": [{ "company": string, "reason": string, "nextAction": string, "urgency": "this_week" | "today" | "schedule" }] (up to 5 leads with specific, actionable advice — not generic. Reference their signals, deal value, and what makes them a priority RIGHT NOW),
  "coldAlerts": [{ "company": string, "suggestedAction": string, "daysInactive": number }] (leads going cold with specific re-engagement tactics — not just "follow up"),
  "weeklyPriorities": [string] (3-5 bullet-point priorities for the week — specific actions like "Schedule demo with X" or "Send breach follow-up to Y"),
  "signalHighlights": [{ "company": string, "signal": string, "opportunity": string }] (top 3 signals that create immediate selling opportunities — connect the signal to a specific action)
}

Be specific. Use company names, dollar amounts, and concrete actions. Write like you're coaching a rep in a 1-on-1, not writing a report.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let parsed;
  try {
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = { topLeadsAdvice: [], coldAlerts: [], pipelineSummary: "Unable to generate summary.", weeklyPriorities: [], signalHighlights: [] };
  }

  const payload = {
    ...parsed,
    topLeads: topLeads.map((l) => ({ id: l.id, company: l.company, fitScore: l.fitScore, dealValue: l.dealValue })),
    coldLeads: coldLeads.slice(0, 5).map((l) => ({ id: l.id, company: l.company })),
    newSignalsCount: newSignals.length,
    pipelineMovementCount: pipelineMovement.length,
    leadCount: leads.length,
  };

  const digest = await prisma.digest.create({
    data: {
      userId,
      type: "weekly",
      payload: JSON.stringify(payload),
    },
  });

  return { id: digest.id, ...payload, createdAt: digest.createdAt, readAt: null };
}
