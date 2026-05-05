import { NextRequest, NextResponse } from "next/server";
import { researchCompany } from "@/services/company-research";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body as { query?: string };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { error: "query is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const payload = await researchCompany(query.trim());

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Research failed:", error);
    return NextResponse.json(
      { error: "Research failed" },
      { status: 500 }
    );
  }
}
