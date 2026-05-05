import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { researchCompany } from "@/services/company-research";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { query } = await request.json();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const payload = await researchCompany(query);
  return NextResponse.json(payload);
}
