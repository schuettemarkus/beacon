import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entryId } = await params;

  const entry = await prisma.accountPlanEntry.findFirst({
    where: {
      id: entryId,
      accountPlan: { userId: user.id },
    },
    include: { accountPlan: { select: { name: true, territory: true } } },
  });

  if (!entry)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(entry);
}
