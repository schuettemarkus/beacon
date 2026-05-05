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

  const emails = await prisma.email.findMany({
    where: { leadId: id },
    include: { contact: true },
  });

  return NextResponse.json(emails);
}
