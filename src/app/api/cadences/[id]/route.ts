import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const cadence = await prisma.cadence.findUnique({
    where: { id },
    include: {
      enrollments: {
        include: {
          lead: {
            select: {
              id: true,
              company: true,
              fitScore: true,
              domain: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!cadence) {
    return NextResponse.json({ error: "Cadence not found" }, { status: 404 });
  }

  return NextResponse.json(cadence);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.status !== undefined) data.status = body.status;
  if (body.steps !== undefined) {
    data.steps =
      typeof body.steps === "string" ? body.steps : JSON.stringify(body.steps);
  }
  data.updatedAt = new Date();

  const cadence = await prisma.cadence.update({
    where: { id },
    data,
  });

  return NextResponse.json(cadence);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Delete enrollments first, then the cadence
  await prisma.enrollment.deleteMany({ where: { cadenceId: id } });
  await prisma.cadence.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
