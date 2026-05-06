import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runResearchPipeline } from "@/services/research-pipeline";
import type { SellerContext } from "@/services/research-pipeline";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { query } = await request.json();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  // Load seller profile
  let sellerProfile: SellerContext | undefined;
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true },
  });
  if (userData?.sellerProfile) {
    try {
      sellerProfile = JSON.parse(userData.sellerProfile as string);
    } catch { /* ignore */ }
  }

  try {
    const payload = await runResearchPipeline(query, user.id, user.industry, sellerProfile);

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
