import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function POST(
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
    include: { accountPlan: true },
  });

  if (!entry)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!entry.deepAnalysis || !entry.influenceMap) {
    return NextResponse.json(
      { error: "Run deep analysis and influence map first" },
      { status: 400 }
    );
  }

  const deepAnalysis = JSON.parse(entry.deepAnalysis);
  const influenceMap = JSON.parse(entry.influenceMap);

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
        parts.push(`Key value propositions: ${sp.valueProps.join("; ")}.`);
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
        text: `You are a ${config.analystRole} and sales strategy coach. This AM needs to hit quota with net new business. Be specific about dollar amounts, timelines, and action items. Write like a sales coach, not a consultant.

${sellerContext}

Return ONLY valid JSON matching this schema (no markdown, no code fences):
{
  "executiveSummary": "string (2-3 sentences, punchy)",
  "accountObjective": "string (what the AM is trying to achieve)",
  "revenueTarget": "string (specific dollar estimate with justification)",
  "timeline": [
    { "phase": "Phase 1: Discovery & Access", "duration": "Days 1-30", "actions": ["string"] },
    { "phase": "Phase 2: Solution Alignment", "duration": "Days 31-60", "actions": ["string"] },
    { "phase": "Phase 3: Close & Expand", "duration": "Days 61-90", "actions": ["string"] }
  ],
  "competitiveStrategy": "string (how to displace incumbents)",
  "valueProposition": "string (tailored to this account's specific needs)",
  "stakeholderEngagementPlan": [
    { "name": "string", "action": "string (specific outreach action)", "timing": "string (Week 1, etc.)" }
  ],
  "risksMitigations": [
    { "risk": "string", "mitigation": "string" }
  ],
  "successMetrics": ["string"],
  "nextSteps": [
    { "action": "string", "dueDate": "string (relative date like 'Week 1')" }
  ]
}

RULES:
- revenueTarget must be a specific dollar amount based on the company's size and typical deal sizes
- timeline must have exactly 3 phases of 30 days each with 3-5 concrete actions per phase
- stakeholderEngagementPlan should reference actual people from the influence map
- nextSteps should have 5-7 items with specific dates
- Be direct and actionable, not vague`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Build a win plan for ${entry.company} (${entry.domain}).

Deep Analysis:
${JSON.stringify(deepAnalysis, null, 2)}

Influence Map:
${JSON.stringify(influenceMap, null, 2)}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "{}";

  let winPlan;
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

    winPlan = JSON.parse(cleaned);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse win plan" },
      { status: 500 }
    );
  }

  await prisma.accountPlanEntry.update({
    where: { id: entryId },
    data: {
      winPlan: JSON.stringify(winPlan),
      status: "planned",
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(winPlan);
}
