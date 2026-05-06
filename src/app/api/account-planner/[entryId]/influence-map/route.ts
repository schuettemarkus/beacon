import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";
import {
  findContactsAtDomain,
  enrichContact,
} from "@/services/enrichment-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entryId } = await params;

  const entry = await (prisma as any).accountPlanEntry.findFirst({
    where: {
      id: entryId,
      accountPlan: { userId: user.id },
    },
    include: { accountPlan: true },
  });

  if (!entry)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const contacts = await findContactsAtDomain(entry.domain);

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true },
  });

  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      const parts: string[] = [];
      if (sp.company) parts.push(`Seller company: ${sp.company}.`);
      if (sp.products?.length)
        parts.push(`Products/services: ${sp.products.join(", ")}.`);
      if (sp.valueProps?.length)
        parts.push(`Key value propositions: ${sp.valueProps}.`);
      if (parts.length) sellerContext = parts.join(" ");
    } catch {}
  }

  const config = getIndustryConfig(user.industry);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: [
      {
        type: "text",
        text: `You are a ${config.analystRole} specializing in stakeholder analysis and influence mapping. Given contacts at ${entry.company} and the seller's context, classify people into the buying influence structure and identify relationships.

${sellerContext}

Return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "rings": {
    "economicBuyers": [{ "name": "string", "title": "string", "relevance": "string", "engagementStrategy": "string", "confidence": 85 }],
    "champions": [same shape],
    "influencers": [same shape],
    "partners": [same shape]
  },
  "relationships": [
    { "fromName": "string", "toName": "string", "type": "reports_to|prior_company|university|board", "detail": "string" }
  ]
}

RULES:
- economicBuyers: people with budget authority (CFO, VP, CxO who sign checks)
- champions: internal advocates who would push for the deal (directors, senior managers in the relevant department)
- influencers: people who shape requirements (architects, engineers, analysts)
- partners: system integrators, resellers, consultants who could help or hinder the deal
- For each person: include a specific engagement strategy (not generic advice)
- Identify relationships: reporting lines, prior company overlaps, same university, board connections
- If the contact list is sparse, infer likely roles/titles based on typical org structure for a company like ${entry.company}
- confidence: 0-100, how sure you are this person belongs in this ring`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Build an influence map for selling into ${entry.company} (${entry.domain}).

Known contacts from domain search:
${contacts.length > 0 ? JSON.stringify(contacts, null, 2) : "No contacts found via domain search. Please infer likely stakeholders based on the company's size and industry."}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let influenceMap;
  try {
    let cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    if (!cleaned.startsWith("{")) {
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
      }
    }

    influenceMap = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse influence map" },
      { status: 500 }
    );
  }

  const allPeople = [
    ...(influenceMap.rings?.economicBuyers || []),
    ...(influenceMap.rings?.champions || []),
    ...(influenceMap.rings?.influencers || []),
    ...(influenceMap.rings?.partners || []),
  ];

  await Promise.all(
    allPeople.map(async (person: { name: string; email?: string; phone?: string; linkedin?: string }) => {
      try {
        const enriched = await enrichContact(person.name, entry.domain);
        if (enriched) {
          if (enriched.email) person.email = enriched.email;
          if (enriched.phone) person.phone = enriched.phone;
          if (enriched.linkedin) person.linkedin = enriched.linkedin;
        }
      } catch {}
    })
  );

  await (prisma as any).accountPlanEntry.update({
    where: { id: entryId },
    data: {
      influenceMap: JSON.stringify(influenceMap),
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(influenceMap);
}
