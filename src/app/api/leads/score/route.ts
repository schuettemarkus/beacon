import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { scoreLead, type ICPProfile } from "@/services/lead-scorer";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Get the user's ICP
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { icpProfile: true },
  });

  if (!user?.icpProfile) {
    return NextResponse.json({ error: "No ICP profile set" }, { status: 400 });
  }

  const icp: ICPProfile = JSON.parse(user.icpProfile);

  if (body.leadId) {
    // Score a single lead
    const lead = await prisma.lead.findFirst({
      where: { id: body.leadId, userId: session.id },
      include: { signals: true },
    });
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const breakdown = scoreLead(
      { ...lead, techStack: JSON.parse(lead.techStack), signals: lead.signals },
      icp
    );

    await prisma.lead.update({
      where: { id: body.leadId },
      data: { fitScore: breakdown.total },
    });

    return NextResponse.json(breakdown);
  }

  if (body.all) {
    // Re-score all leads (user's leads only)
    const leads = await prisma.lead.findMany({ where: { userId: session.id }, include: { signals: true } });
    let updated = 0;

    for (const lead of leads) {
      const breakdown = scoreLead(
        { ...lead, techStack: JSON.parse(lead.techStack), signals: lead.signals },
        icp
      );

      await prisma.lead.update({
        where: { id: lead.id },
        data: { fitScore: breakdown.total },
      });
      updated++;
    }

    return NextResponse.json({ updated, total: leads.length });
  }

  return NextResponse.json({ error: "Provide leadId or all: true" }, { status: 400 });
}
