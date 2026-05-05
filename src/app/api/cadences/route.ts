import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cadences = await prisma.cadence.findMany({
    where: { userId: user.id },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cadences);
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, description, steps } = body;

  if (!name || !steps) {
    return NextResponse.json(
      { error: "Name and steps are required" },
      { status: 400 }
    );
  }

  const stepsStr = typeof steps === "string" ? steps : JSON.stringify(steps);

  const cadence = await prisma.cadence.create({
    data: {
      userId: user.id,
      name,
      description: description || null,
      steps: stepsStr,
      status: "active",
    },
  });

  return NextResponse.json(cadence, { status: 201 });
}
