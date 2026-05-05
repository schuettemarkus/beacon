import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  if (!q) return NextResponse.json([]);

  const leads = await prisma.lead.findMany({
    where: {
      OR: [
        { company: { contains: q } },
        { industry: { contains: q } },
        { domain: { contains: q } },
      ],
    },
    include: { contacts: true },
    orderBy: { fitScore: "desc" },
    take: 10,
  });

  return NextResponse.json(
    leads.map((l) => ({ ...l, techStack: JSON.parse(l.techStack) }))
  );
}
