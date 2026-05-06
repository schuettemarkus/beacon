import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";
import type {
  StateAccount,
  StatePlaybook,
  OverallRanking,
  TerritoryPlaybook,
} from "@/services/account-planner-types";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await (prisma as any).accountPlan.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { accounts: { orderBy: { rank: "asc" } } },
  });

  if (!plan || !plan.playbook) return NextResponse.json(null);

  const playbook: TerritoryPlaybook = JSON.parse(plan.playbook);
  return NextResponse.json(playbook);
}

export async function POST() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true },
  });

  let territory: string[] = [];
  let products: string[] = [];
  let company = "";
  let valueProps = "";

  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      territory = sp.territory?.states || [];
      products = sp.products || [];
      company = sp.company || "";
      valueProps = sp.valueProps || "";
    } catch {}
  }

  if (!territory.length) {
    return NextResponse.json(
      { error: "No territory states configured. Update your seller profile first." },
      { status: 400 }
    );
  }

  let verticals: string[] = [];
  let buyerTitles: string[] = [];

  if (userData?.icpProfile) {
    try {
      const icp = JSON.parse(userData.icpProfile as string);
      verticals = icp.verticals || [];
      buyerTitles = icp.buyerTitles || [];
    } catch {}
  }

  const config = getIndustryConfig(user.industry);

  const statePlaybooks: StatePlaybook[] = await Promise.all(
    territory.map(async (state) => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system: [
          {
            type: "text",
            text: `You are a ${config.analystRole}. You help sales professionals identify the best accounts to pursue in their territory. You have deep knowledge of organizational budget cycles, leadership changes, growth trajectories, and market dynamics.`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `Identify the top 3 accounts to pursue in ${state} for a ${config.displayName} seller.

Seller context:
- Company: ${company || "Not specified"}
- Products: ${products.length ? products.join(", ") : "Not specified"}
- Value propositions: ${valueProps || "Not specified"}
- Target verticals: ${verticals.length ? verticals.join(", ") : "Any"}
- Target buyer titles: ${buyerTitles.length ? buyerTitles.join(", ") : config.typicalBuyerTitles.join(", ")}

For each account, evaluate:
- Budget availability / fiscal health
- Growth vs contraction trajectory
- Leadership changes in the past 12 months
- Recent cyber events or security breaches
- Market potential for the seller's specific products

Return ONLY a valid JSON array of exactly 3 objects with these fields:
- "company" (string): Full company name
- "domain" (string): Company website domain
- "rank" (number): 1, 2, or 3
- "budgetIndicators" (string): Brief budget/fiscal health assessment
- "growthTrend" (string): One of "growing", "stable", or "contracting"
- "leadershipChanges" (string[]): Recent leadership changes, empty array if none
- "recentCyberEvents" (string[]): Recent security incidents, empty array if none
- "marketPotential" (string): Why this account is a good fit for the seller's products
- "justification" (string): 2-3 sentence summary of why this is a top account

No markdown, no code fences, just the JSON array.`,
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "[]";

      let accounts: StateAccount[];
      try {
        const cleaned = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        accounts = JSON.parse(cleaned);
      } catch {
        accounts = [];
      }

      return { state, accounts };
    })
  );

  const allAccounts = statePlaybooks.flatMap((sp) =>
    sp.accounts.map((a) => ({
      company: a.company,
      domain: a.domain,
      state: sp.state,
      justification: a.justification,
      growthTrend: a.growthTrend,
    }))
  );

  const consolidationResponse = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: [
      {
        type: "text",
        text: `You are a ${config.analystRole}. You rank sales accounts across an entire territory from best opportunity to worst based on budget potential, growth trajectory, market fit, and likelihood to close.`,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Rank ALL of these accounts from best to worst opportunity overall.

Seller products: ${products.length ? products.join(", ") : "Not specified"}
Target verticals: ${verticals.length ? verticals.join(", ") : "Any"}

Accounts to rank:
${JSON.stringify(allAccounts, null, 2)}

Return ONLY a valid JSON array of objects ranked from best (overallRank: 1) to worst. Each object:
- "company" (string)
- "domain" (string)
- "state" (string)
- "overallRank" (number): sequential from 1
- "justification" (string): 1-2 sentence explanation of this ranking position

No markdown, no code fences, just the JSON array.`,
      },
    ],
  });

  const consolidationText =
    consolidationResponse.content[0].type === "text"
      ? consolidationResponse.content[0].text
      : "[]";

  let overallRanking: OverallRanking[];
  try {
    const cleaned = consolidationText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    overallRanking = JSON.parse(cleaned);
  } catch {
    overallRanking = allAccounts.map((a, i) => ({
      company: a.company,
      domain: a.domain,
      state: a.state,
      overallRank: i + 1,
      justification: a.justification,
    }));
  }

  const db = prisma as any;

  const plan = await db.accountPlan.create({
    data: {
      userId: user.id,
      name: `Territory Playbook — ${new Date().toLocaleDateString()}`,
      territory: JSON.stringify({ states: territory, verticals }),
      status: "active",
      playbook: "",
    },
  });

  const entries: any[] = [];
  for (const account of overallRanking) {
    const entry = await db.accountPlanEntry.create({
      data: {
        accountPlanId: plan.id,
        company: account.company,
        domain: account.domain,
        state: account.state,
        rank: account.overallRank,
        rankJustification: account.justification,
        status: "identified",
      },
    });
    entries.push(entry);
  }

  const playbook: TerritoryPlaybook = {
    planId: plan.id,
    states: statePlaybooks,
    overallRanking: overallRanking.map((r) => {
      const entry = entries.find(
        (e: any) => e.company === r.company && e.state === r.state
      );
      return { ...r, entryId: entry?.id };
    }),
  };

  await db.accountPlan.update({
    where: { id: plan.id },
    data: { playbook: JSON.stringify(playbook) },
  });

  const result = playbook;

  return NextResponse.json(result);
}
