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

  // Verify lead ownership
  const lead = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const activities = await prisma.activity.findMany({
    where: { leadId: id },
    orderBy: { at: "desc" },
    take: 50,
  });

  return NextResponse.json(
    activities.map((a) => ({
      ...a,
      payload: JSON.parse(a.payload),
    }))
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify lead ownership
  const lead = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { kind, payload } = await request.json();

  const activity = await prisma.activity.create({
    data: {
      leadId: id,
      kind,
      payload: JSON.stringify(payload || {}),
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
