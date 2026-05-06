import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateDigestForUser } from "../route";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({ select: { id: true, industry: true } });
  let generated = 0;

  for (const user of users) {
    const existing = await prisma.digest.findFirst({
      where: {
        userId: user.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    if (!existing) {
      await generateDigestForUser(user.id, user.industry);
      generated++;
    }
  }

  return NextResponse.json({ generated, total: users.length, timestamp: new Date().toISOString() });
}
