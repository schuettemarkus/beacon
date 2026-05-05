import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { dealStage, dealValue } = await request.json();

  // Verify ownership
  const current = await prisma.lead.findFirst({ where: { id, userId: user.id }, select: { dealStage: true } });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: any = {};
  if (dealStage !== undefined) data.dealStage = dealStage;
  if (dealValue !== undefined) data.dealValue = dealValue;

  const lead = await prisma.lead.update({ where: { id }, data });

  // Log pipeline movement
  if (dealStage && current && dealStage !== current.dealStage) {
    await prisma.activity.create({
      data: {
        leadId: id,
        kind: "pipeline_moved",
        payload: JSON.stringify({ from: current.dealStage, to: dealStage }),
      },
    });
  }

  return NextResponse.json(lead);
}
