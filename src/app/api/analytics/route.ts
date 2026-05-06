import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Leads by status (user's leads only)
  const leadsByStatus = await prisma.lead.groupBy({
    by: ["status"],
    where: { userId: user.id },
    _count: { id: true },
  });

  // Leads by deal stage
  const leadsByStage = await prisma.lead.groupBy({
    by: ["dealStage"],
    where: { userId: user.id },
    _count: { id: true },
  });

  // Fit score distribution
  const allLeads = await prisma.lead.findMany({
    where: { userId: user.id },
    select: { id: true, fitScore: true, createdAt: true, industry: true, dealValue: true },
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

  // Get user's lead IDs for filtering related models
  const userLeadIds = allLeads.map((l) => l.id);

  // Emails by variant (user's leads only)
  const emailsByVariant = await prisma.email.groupBy({
    by: ["variant"],
    where: { leadId: { in: userLeadIds } },
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

  // Total pipeline value from deal estimates
  const totalPipelineValue = allLeads.reduce((sum, l) => {
    if (!l.dealValue) return sum;
    const matches = l.dealValue.match(/\$([0-9.]+)(K|M)-\$([0-9.]+)(K|M)/);
    if (!matches) return sum;
    const min = parseFloat(matches[1]) * (matches[2] === "M" ? 1_000_000 : 1_000);
    const max = parseFloat(matches[3]) * (matches[4] === "M" ? 1_000_000 : 1_000);
    return sum + (min + max) / 2;
  }, 0);

  // Totals (scoped to user's leads)
  const totalLeads = allLeads.length;
  const totalContacts = await prisma.contact.count({ where: { leadId: { in: userLeadIds } } });
  const totalSignals = await prisma.signal.count({ where: { leadId: { in: userLeadIds } } });
  const totalEmails = await prisma.email.count({ where: { leadId: { in: userLeadIds } } });
  const totalResearchRuns = await prisma.researchRun.count({ where: { userId: user.id } });

  return NextResponse.json({
    totals: { totalLeads, totalContacts, totalSignals, totalEmails, totalResearchRuns, totalPipelineValue },
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
