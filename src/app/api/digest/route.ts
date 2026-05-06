import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.digest.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return NextResponse.json({
      digest: { id: existing.id, ...JSON.parse(existing.payload), createdAt: existing.createdAt, readAt: existing.readAt },
    });
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
    include: { signals: true, activities: true },
  });

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const topLeads = leads
    .map((l) => ({
      ...l,
      recentSignals: l.signals.filter((s) => new Date(s.capturedAt) >= sevenDaysAgo),
      score: l.fitScore + l.signals.filter((s) => new Date(s.capturedAt) >= sevenDaysAgo).length * 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

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
    topLeads: topLeads.map((l) => ({
      company: l.company,
      fitScore: l.fitScore,
      dealStage: l.dealStage,
      recentSignals: l.recentSignals.map((s) => s.title),
    })),
    coldLeads: coldLeads.slice(0, 5).map((l) => ({
      company: l.company,
      dealStage: l.dealStage,
      lastActivityDaysAgo: l.activities.length
        ? Math.round((Date.now() - new Date(l.activities[l.activities.length - 1].at).getTime()) / 86400000)
        : null,
    })),
    newSignalsCount: newSignals.length,
    pipelineMovement: pipelineMovement.map((l) => ({
      company: l.company,
      dealStage: l.dealStage,
    })),
    totalActiveLeads: leads.length,
    industry: config.displayName,
  });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: "You are a B2B sales coach. Given pipeline data, produce a weekly digest. Return ONLY valid JSON with this shape: { \"topLeadsAdvice\": [{ \"company\": string, \"reason\": string }], \"coldAlerts\": [{ \"company\": string, \"suggestedAction\": string }], \"pipelineSummary\": string }. No markdown, no explanation.",
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { topLeadsAdvice: [], coldAlerts: [], pipelineSummary: "Unable to generate summary." };
  }

  const payload = {
    ...parsed,
    topLeads: topLeads.map((l) => ({ id: l.id, company: l.company, fitScore: l.fitScore })),
    coldLeads: coldLeads.slice(0, 5).map((l) => ({ id: l.id, company: l.company })),
    newSignalsCount: newSignals.length,
    pipelineMovementCount: pipelineMovement.length,
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
