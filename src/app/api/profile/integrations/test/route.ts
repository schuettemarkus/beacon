import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { service, apiKey } = await request.json();

  if (service === "hunter") {
    try {
      const res = await fetch(
        `https://api.hunter.io/v2/account?api_key=${encodeURIComponent(apiKey)}`
      );
      if (!res.ok)
        return NextResponse.json({ ok: false, error: "Invalid API key" });
      const data = await res.json();
      return NextResponse.json({
        ok: true,
        details: {
          email: data.data?.email,
          plan: data.data?.plan_name,
          remaining: data.data?.requests?.searches?.available,
        },
      });
    } catch {
      return NextResponse.json({ ok: false, error: "Connection failed" });
    }
  }

  if (service === "resend") {
    try {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (!res.ok)
        return NextResponse.json({ ok: false, error: "Invalid API key" });
      return NextResponse.json({ ok: true, details: { verified: true } });
    } catch {
      return NextResponse.json({ ok: false, error: "Connection failed" });
    }
  }

  if (service === "slack") {
    try {
      const res = await fetch(apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Beacon connected successfully!" }),
      });
      if (!res.ok)
        return NextResponse.json({ ok: false, error: "Invalid webhook URL" });
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ ok: false, error: "Connection failed" });
    }
  }

  return NextResponse.json({ ok: false, error: "Unknown service" });
}
