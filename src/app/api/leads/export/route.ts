import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const leads = await prisma.lead.findMany({
    include: { contacts: true, signals: true },
    orderBy: { fitScore: "desc" },
  });

  const headers = [
    "Company",
    "Domain",
    "Industry",
    "HQ",
    "Employees",
    "Revenue",
    "Funding",
    "Tech Stack",
    "Fit Score",
    "Status",
    "Deal Stage",
    "Contacts",
    "Top Signal",
  ];

  const rows = leads.map((lead) => {
    let techStack: string[] = [];
    try {
      techStack = JSON.parse(lead.techStack);
    } catch {
      techStack = [];
    }

    const contactNames = lead.contacts
      .map((c) => c.name)
      .join("; ");

    const topSignal =
      lead.signals.length > 0 ? lead.signals[0].title : "";

    return [
      lead.company,
      lead.domain,
      lead.industry,
      lead.hq,
      String(lead.employees),
      lead.revenueBand,
      lead.funding,
      techStack.join("; "),
      String(lead.fitScore),
      lead.status,
      lead.dealStage,
      contactNames,
      topSignal,
    ].map(escapeCSV);
  });

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="beacon-leads.csv"',
    },
  });
}
