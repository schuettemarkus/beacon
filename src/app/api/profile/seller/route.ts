import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export interface SellerProfile {
  company: string;
  role: string;
  products: string[];
  valueProps: string;
  territory: {
    type: "national" | "regional" | "states";
    states?: string[];
    description?: string;
  };
}

const DEFAULT_SELLER: SellerProfile = {
  company: "",
  role: "",
  products: [],
  valueProps: "",
  territory: { type: "national" },
};

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { sellerProfile: true },
  });

  const profile = user?.sellerProfile
    ? JSON.parse(user.sellerProfile as string)
    : DEFAULT_SELLER;

  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  await prisma.user.update({
    where: { id: session.id },
    data: { sellerProfile: JSON.stringify(body) },
  });

  return NextResponse.json(body);
}
