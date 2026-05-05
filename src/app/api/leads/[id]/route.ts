import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        contacts: true,
        signals: { orderBy: { capturedAt: "desc" } },
        emails: { orderBy: { sentAt: "desc" } },
        activities: { orderBy: { at: "desc" } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...lead,
      techStack: JSON.parse(lead.techStack) as string[],
    });
  } catch (error) {
    console.error("Failed to fetch lead:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { status, snoozedUntil } = body as {
      status?: string;
      snoozedUntil?: string;
    };

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    const validStatuses = [
      "today",
      "thisWeek",
      "snoozed",
      "closedWon",
      "archived",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (status === "snoozed" && snoozedUntil) {
      updateData.snoozedUntil = new Date(snoozedUntil);
    } else if (status !== "snoozed") {
      updateData.snoozedUntil = null;
    }

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...lead,
      techStack: JSON.parse(lead.techStack) as string[],
    });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
