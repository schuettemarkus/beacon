import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    include: { contacts: true, signals: true, emails: true },
    orderBy: { fitScore: "desc" },
  });

  const parsed = leads.map((lead) => ({
    ...lead,
    techStack: JSON.parse(lead.techStack),
  }));

  const grouped = {
    today: parsed.filter((l) => l.status === "today"),
    thisWeek: parsed.filter((l) => l.status === "this_week"),
    snoozed: parsed.filter((l) => l.status === "snoozed"),
    closedWon: parsed.filter((l) => l.status === "closed_won"),
    archived: parsed.filter((l) => l.status === "archived"),
  };

  return NextResponse.json(grouped);
}

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const lead = await prisma.lead.create({
    data: {
      company: body.company,
      domain: body.domain,
      industry: body.industry || "Unknown",
      hq: body.hq || "Unknown",
      employees: body.employees || 0,
      revenueBand: body.revenueBand || "Unknown",
      techStack: JSON.stringify(body.techStack || []),
      funding: body.funding || "Unknown",
      fitScore: body.fitScore || 50,
      status: "today",
      logoUrl: body.logoUrl || null,
    },
  });

  // Create contacts if provided
  if (body.contacts?.length) {
    await prisma.contact.createMany({
      data: body.contacts.map((c: any) => ({
        leadId: lead.id,
        name: c.name,
        title: c.title,
        email: c.email,
        phone: c.phone || null,
        linkedin: c.linkedin || null,
        decisionMakerScore: c.decisionMakerScore || 50,
      })),
    });
  }

  // Create signals if provided
  if (body.signals?.length) {
    await prisma.signal.createMany({
      data: body.signals.map((s: any) => ({
        leadId: lead.id,
        type: s.type,
        severity: s.severity,
        source: s.source,
        title: s.title,
        body: s.body,
        capturedAt: s.capturedAt ? new Date(s.capturedAt) : new Date(),
      })),
    });
  }

  return NextResponse.json(lead, { status: 201 });
}
