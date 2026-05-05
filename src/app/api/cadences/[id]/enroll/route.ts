import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: cadenceId } = await params;
  const body = await request.json();
  const { leadIds } = body;

  if (!leadIds?.length) {
    return NextResponse.json(
      { error: "leadIds are required" },
      { status: 400 }
    );
  }

  // Verify cadence exists
  const cadence = await prisma.cadence.findUnique({
    where: { id: cadenceId },
  });
  if (!cadence) {
    return NextResponse.json({ error: "Cadence not found" }, { status: 404 });
  }

  // Create enrollments and log activity for each lead
  const enrollments = [];
  for (const leadId of leadIds) {
    const enrollment = await prisma.enrollment.create({
      data: {
        cadenceId,
        leadId,
        currentStep: 0,
        status: "active",
        nextStepAt: new Date(),
      },
    });
    enrollments.push(enrollment);

    await prisma.activity.create({
      data: {
        leadId,
        kind: "cadence_enrolled",
        payload: JSON.stringify({
          cadenceId,
          cadenceName: cadence.name,
          enrollmentId: enrollment.id,
        }),
      },
    });
  }

  return NextResponse.json({ enrolled: enrollments.length }, { status: 201 });
}
