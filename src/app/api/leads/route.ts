import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.company = { contains: search };
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        contacts: true,
        signals: true,
      },
      orderBy: { fitScore: "desc" },
    });

    const parsed = leads.map((lead) => ({
      ...lead,
      techStack: JSON.parse(lead.techStack) as string[],
    }));

    const grouped = {
      today: parsed.filter((l) => l.status === "today"),
      thisWeek: parsed.filter((l) => l.status === "thisWeek"),
      snoozed: parsed.filter((l) => l.status === "snoozed"),
      closedWon: parsed.filter((l) => l.status === "closedWon"),
      archived: parsed.filter((l) => l.status === "archived"),
    };

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
