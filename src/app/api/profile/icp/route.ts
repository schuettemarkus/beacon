import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const DEFAULT_ICP = {
  industries: [],
  companySizeMin: 50,
  companySizeMax: 5000,
  fundingStages: [],
  keySignals: [],
  techStack: [],
  geoTargets: [],
  revenueBands: [],
};

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { icpProfile: true },
  });

  const icp = user?.icpProfile ? JSON.parse(user.icpProfile) : DEFAULT_ICP;
  return NextResponse.json(icp);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  await prisma.user.update({
    where: { id: session.id },
    data: { icpProfile: JSON.stringify(body) },
  });

  return NextResponse.json(body);
}
