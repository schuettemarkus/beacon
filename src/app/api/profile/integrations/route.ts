import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { integrations: true },
  });

  const integrations = userData?.integrations
    ? JSON.parse(userData.integrations as string)
    : {};

  // Return masked keys (only show last 4 chars)
  return NextResponse.json({
    hunterApiKey: integrations.hunterApiKey ? maskKey(integrations.hunterApiKey) : null,
    resendApiKey: integrations.resendApiKey ? maskKey(integrations.resendApiKey) : null,
    hubspotApiKey: integrations.hubspotApiKey ? maskKey(integrations.hubspotApiKey) : null,
    slackWebhook: integrations.slackWebhook ? maskKey(integrations.slackWebhook) : null,
  });
}

export async function PUT(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Load existing integrations so we don't overwrite keys not being updated
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { integrations: true },
  });

  const existing = userData?.integrations
    ? JSON.parse(userData.integrations as string)
    : {};

  // Only update keys that are explicitly provided (non-undefined)
  const updated = { ...existing };
  if (body.hunterApiKey !== undefined) updated.hunterApiKey = body.hunterApiKey || null;
  if (body.resendApiKey !== undefined) updated.resendApiKey = body.resendApiKey || null;
  if (body.hubspotApiKey !== undefined) updated.hubspotApiKey = body.hubspotApiKey || null;
  if (body.slackWebhook !== undefined) updated.slackWebhook = body.slackWebhook || null;

  await prisma.user.update({
    where: { id: user.id },
    data: { integrations: JSON.stringify(updated) },
  });

  return NextResponse.json({ ok: true });
}

function maskKey(key: string): string {
  if (key.length <= 8) return "••••" + key.slice(-4);
  return "••••••••" + key.slice(-4);
}
