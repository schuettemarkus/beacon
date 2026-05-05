import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { INDUSTRY_IDS } from "@/config/industries";

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { industry } = await request.json();

  if (!industry || !INDUSTRY_IDS.includes(industry)) {
    return NextResponse.json({ error: "Invalid industry" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { industry },
  });

  return NextResponse.json({ industry });
}
