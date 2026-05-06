import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runResearchPipeline } from "@/services/research-pipeline";
import { scoreLead } from "@/services/lead-scorer";
import type { ICPProfile } from "@/services/lead-scorer";
import type { SellerContext } from "@/services/research-pipeline";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { query } = await request.json();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Load seller profile and ICP profile
  let sellerProfile: SellerContext | undefined;
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true } as any,
  });
  if (userData?.sellerProfile) {
    try {
      sellerProfile = JSON.parse(userData.sellerProfile as string);
    } catch { /* ignore */ }
  }
  const icpProfile = (userData as any)?.icpProfile ? JSON.parse((userData as any).icpProfile as string) : null;

  try {
    const payload = await runResearchPipeline(query, user.id, user.industry, sellerProfile, icpProfile);

    // Re-score with deterministic scorer if ICP is available (overrides Claude's arbitrary score)
    if (icpProfile) {
      try {
        const breakdown = scoreLead(
          {
            industry: payload.industry,
            employees: payload.employees,
            funding: payload.funding,
            techStack: payload.techStack || [],
            hq: payload.hq,
            revenueBand: payload.revenueBand,
            signals: payload.signals,
          },
          icpProfile as ICPProfile
        );
        payload.fitScore = breakdown.total;
      } catch {
        // Keep Claude's score if scorer fails
      }
    }

    // Save the research run
    const run = await prisma.researchRun.create({
      data: {
        userId: user.id,
        query,
        payload: JSON.stringify(payload),
      },
    });

    return NextResponse.json({ ...payload, researchRunId: run.id });
  } catch (e: unknown) {
    console.error("Research pipeline error:", e);
    const message = e instanceof Error ? e.message : "Research failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
