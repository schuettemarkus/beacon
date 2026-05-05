import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { scoreLead, type ICPProfile } from "@/services/lead-scorer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { icpProfile: true },
  });

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { signals: true },
  });

  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  if (!user?.icpProfile) {
    return NextResponse.json({
      total: lead.fitScore,
      factors: [{ name: "Default", score: lead.fitScore, maxScore: 100, reason: "No ICP profile set — using seed score" }],
    });
  }

  const icp: ICPProfile = JSON.parse(user.icpProfile);
  const breakdown = scoreLead(
    { ...lead, techStack: JSON.parse(lead.techStack), signals: lead.signals },
    icp
  );

  return NextResponse.json(breakdown);
}
