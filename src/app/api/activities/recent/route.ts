import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const activities = await prisma.activity.findMany({
    orderBy: { at: "desc" },
    take: 50,
    include: { lead: { select: { company: true } } },
  });

  return NextResponse.json(
    activities.map((a) => ({
      ...a,
      payload: JSON.parse(a.payload),
      company: a.lead.company,
    }))
  );
}
