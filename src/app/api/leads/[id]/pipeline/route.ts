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

  const data: any = {};
  if (dealStage !== undefined) data.dealStage = dealStage;
  if (dealValue !== undefined) data.dealValue = dealValue;

  const lead = await prisma.lead.update({ where: { id }, data });
  return NextResponse.json(lead);
}
