import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const DEFAULT_CADENCES = [
  {
    name: "Cold Outreach (5-Touch)",
    description: "Standard cold outreach sequence for new leads. Email-first with LinkedIn and call follow-ups.",
    steps: [
      { type: "email", label: "Cold Intro Email", emailVariant: "cold_intro" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "linkedin", label: "LinkedIn Connection Request" },
      { type: "wait", label: "Wait 4 days", days: 4 },
      { type: "email", label: "Threat-Anchored Follow-up", emailVariant: "threat_anchored" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "call", label: "Phone Call" },
      { type: "wait", label: "Wait 5 days", days: 5 },
      { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
    ],
  },
  {
    name: "Warm Re-Engagement",
    description: "Re-engage leads who went cold. Shorter cadence focused on new signals and value.",
    steps: [
      { type: "email", label: "New Signal Alert Email", emailVariant: "threat_anchored" },
      { type: "wait", label: "Wait 2 days", days: 2 },
      { type: "linkedin", label: "LinkedIn Message" },
      { type: "wait", label: "Wait 3 days", days: 3 },
      { type: "email", label: "Case Study Follow-up", emailVariant: "cold_intro" },
      { type: "wait", label: "Wait 5 days", days: 5 },
      { type: "call", label: "Direct Call" },
    ],
  },
  {
    name: "Executive Outreach",
    description: "High-touch sequence for C-suite targets. Fewer touches, higher quality, board-level messaging.",
    steps: [
      { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      { type: "wait", label: "Wait 5 days", days: 5 },
      { type: "linkedin", label: "LinkedIn InMail" },
      { type: "wait", label: "Wait 7 days", days: 7 },
      { type: "email", label: "ROI Follow-up", emailVariant: "executive_brief" },
      { type: "wait", label: "Wait 5 days", days: 5 },
      { type: "call", label: "EA/Assistant Outreach Call" },
    ],
  },
];

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Seed default cadences on first access
  const count = await prisma.cadence.count({ where: { userId: user.id } });
  if (count === 0) {
    for (const c of DEFAULT_CADENCES) {
      await prisma.cadence.create({
        data: {
          userId: user.id,
          name: c.name,
          description: c.description,
          steps: JSON.stringify(c.steps),
          status: "active",
        },
      });
    }
  }

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
