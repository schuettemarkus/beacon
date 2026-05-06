import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const lead = await prisma.lead.findFirst({
    where: { id, userId: user.id },
    include: { contacts: true, signals: true, emails: true, activities: true, sequences: true },
  });

  if (!lead) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...lead,
    techStack: JSON.parse(lead.techStack),
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();

  const data: any = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.snoozedUntil !== undefined)
    data.snoozedUntil = body.snoozedUntil ? new Date(body.snoozedUntil) : null;
  if (body.dealStage !== undefined) data.dealStage = body.dealStage;
  if (body.dealValue !== undefined) data.dealValue = body.dealValue;
  if (body.fitScore !== undefined) data.fitScore = body.fitScore;

  const lead = await prisma.lead.update({ where: { id }, data });
  return NextResponse.json(lead);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Delete related records first
  await prisma.email.deleteMany({ where: { leadId: id } });
  await prisma.signal.deleteMany({ where: { leadId: id } });
  await prisma.contact.deleteMany({ where: { leadId: id } });
  await prisma.activity.deleteMany({ where: { leadId: id } });
  await prisma.sequence.deleteMany({ where: { leadId: id } });
  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
