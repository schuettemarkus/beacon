import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const lead = await prisma.lead.findFirst({
    where: { id, userId: user.id },
    include: { contacts: true, signals: true },
  });

  if (!lead)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true },
  });

  const config = getIndustryConfig(user.industry);

  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.company) parts.push(`Seller company: ${sp.company}.`);
      if (sp.products?.length)
        parts.push(`Products/services: ${sp.products.join(", ")}.`);
      if (sp.valueProps?.length)
        parts.push(`Key value propositions: ${sp.valueProps.join("; ")}.`);
      if (parts.length) sellerContext = parts.join(" ");
    } catch {}
  }

  let icpContext = "";
  if (userData?.icpProfile) {
    try {
      const icpProfile = JSON.parse(userData.icpProfile as string);
      const parts: string[] = [];
      if (icpProfile.buyerTitles?.length)
        parts.push(`Target buyer titles: ${icpProfile.buyerTitles.join(", ")}.`);
      if (icpProfile.verticals?.length)
        parts.push(`Target verticals: ${icpProfile.verticals.join(", ")}.`);
      if (parts.length) icpContext = parts.join(" ");
    } catch {}
  }

  const techStack = JSON.parse(lead.techStack);
  const contactsSummary = lead.contacts
    .map((c) => `${c.name} — ${c.title} (${c.email || "no email"})`)
    .join("\n");
  const signalsSummary = lead.signals
    .slice(0, 10)
    .map((s) => `[${s.severity}] ${s.title} (${s.capturedAt.toISOString().split("T")[0]})`)
    .join("\n");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2500,
    system: [
      {
        type: "text",
        text: `You are a ${config.analystRole} preparing a concise meeting prep brief for a sales rep.

${sellerContext}
${icpContext}

Return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "companyOverview": "string (2-3 sentences about the company)",
  "stakeholders": [{ "name": "string", "title": "string", "relevance": "string" }],
  "recentSignals": ["string"],
  "discoveryQuestions": ["string (3-5 tailored questions)"],
  "objectionHandlers": [{ "objection": "string", "response": "string" }],
  "competitiveLandscape": ["string"],
  "suggestedAgenda": [{ "minutes": number, "topic": "string" }]
}`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Prepare a meeting brief for a sales call with this company:

Company: ${lead.company}
Domain: ${lead.domain}
Industry: ${lead.industry}
Employees: ${lead.employees || "Unknown"}
HQ: ${lead.hq || "Unknown"}
Revenue: ${lead.revenueBand || "Unknown"}
Funding: ${lead.funding || "Unknown"}
Fit Score: ${lead.fitScore}/100
Tech Stack: ${techStack.join(", ")}

Key Contacts:
${contactsSummary || "None identified yet"}

Recent Signals:
${signalsSummary || "None yet"}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  try {
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const brief = JSON.parse(cleaned);
    return NextResponse.json(brief);
  } catch {
    return NextResponse.json(
      { error: "Failed to generate brief" },
      { status: 500 }
    );
  }
}
