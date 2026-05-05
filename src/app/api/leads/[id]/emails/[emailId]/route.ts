import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, emailId } = await params;

  // Verify lead ownership
  const lead = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { sentAt } = await request.json();

  const email = await prisma.email.update({
    where: { id: emailId },
    data: { sentAt: sentAt ? new Date(sentAt) : new Date() },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: id,
      kind: "email_sent",
      payload: JSON.stringify({ emailId, variant: email.variant }),
    },
  });

  return NextResponse.json(email);
}
