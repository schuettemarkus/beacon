import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Leads by status
  const leadsByStatus = await prisma.lead.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  // Leads by deal stage
  const leadsByStage = await prisma.lead.groupBy({
    by: ["dealStage"],
    _count: { id: true },
  });

  // Fit score distribution
  const allLeads = await prisma.lead.findMany({
    select: { fitScore: true, createdAt: true, industry: true },
  });

  const fitScoreDistribution = [
    { range: "90-100", count: allLeads.filter((l) => l.fitScore >= 90).length },
    { range: "80-89", count: allLeads.filter((l) => l.fitScore >= 80 && l.fitScore < 90).length },
    { range: "70-79", count: allLeads.filter((l) => l.fitScore >= 70 && l.fitScore < 80).length },
    { range: "60-69", count: allLeads.filter((l) => l.fitScore >= 60 && l.fitScore < 70).length },
    { range: "< 60", count: allLeads.filter((l) => l.fitScore < 60).length },
  ];

  // Leads by week (last 8 weeks)
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const recentLeads = allLeads.filter(
    (l) => new Date(l.createdAt) >= eightWeeksAgo
  );

  const weeklyLeads: { week: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const count = recentLeads.filter((l) => {
      const d = new Date(l.createdAt);
      return d >= weekStart && d < weekEnd;
    }).length;

    weeklyLeads.push({
      week: weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      count,
    });
  }

  // Emails by variant
  const emailsByVariant = await prisma.email.groupBy({
    by: ["variant"],
    _count: { id: true },
    _avg: { predictedOpenRate: true, predictedReplyRate: true },
  });

  // Industry breakdown
  const industryMap: Record<string, number> = {};
  for (const lead of allLeads) {
    const sector = lead.industry.split("—")[0].trim();
    industryMap[sector] = (industryMap[sector] || 0) + 1;
  }
  const topIndustries = Object.entries(industryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Totals
  const totalLeads = allLeads.length;
  const totalContacts = await prisma.contact.count();
  const totalSignals = await prisma.signal.count();
  const totalEmails = await prisma.email.count();
  const totalResearchRuns = await prisma.researchRun.count();

  return NextResponse.json({
    totals: { totalLeads, totalContacts, totalSignals, totalEmails, totalResearchRuns },
    leadsByStatus: leadsByStatus.map((s) => ({ status: s.status, count: s._count.id })),
    leadsByStage: leadsByStage.map((s) => ({ stage: s.dealStage, count: s._count.id })),
    fitScoreDistribution,
    weeklyLeads,
    emailsByVariant: emailsByVariant.map((e) => ({
      variant: e.variant,
      count: e._count.id,
      avgOpenRate: e._avg.predictedOpenRate,
      avgReplyRate: e._avg.predictedReplyRate,
    })),
    topIndustries,
  });
}
