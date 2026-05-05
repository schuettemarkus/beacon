import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchCVEsByProduct } from "@/services/data-sources/nvd-cve";
import { findCVEsForTechStack } from "@/services/data-sources/cisa-kev";

export async function POST(request: Request) {
  // Cron-only route: scans all leads for new vulnerability signals.
  // For production, add CRON_SECRET verification:
  // if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const leads = await prisma.lead.findMany({
    where: {
      status: { notIn: ["archived", "closed_won"] },
    },
    select: { id: true, company: true, techStack: true },
  });

  let newSignals = 0;

  for (const lead of leads) {
    const techStack: string[] = JSON.parse(lead.techStack);
    if (techStack.length === 0) continue;

    // Check CISA KEV for known exploited vulns matching tech stack
    const cisaVulns = await findCVEsForTechStack(techStack);

    for (const vuln of cisaVulns.slice(0, 3)) {
      // Check if we already have this signal
      const existing = await prisma.signal.findFirst({
        where: {
          leadId: lead.id,
          title: { contains: vuln.cveID },
        },
      });

      if (!existing) {
        await prisma.signal.create({
          data: {
            leadId: lead.id,
            type: "tech_vuln",
            severity: vuln.knownRansomwareCampaignUse === "Known" ? "critical" : "high",
            source: "CISA KEV",
            title: `${vuln.cveID}: ${vuln.vulnerabilityName}`,
            body: vuln.shortDescription,
            capturedAt: new Date(vuln.dateAdded),
          },
        });
        newSignals++;
      }
    }

    // Also check NVD for the primary tech (rate-limited: 1 per lead)
    if (techStack[0]) {
      const nvdVulns = await fetchCVEsByProduct(techStack[0]);
      for (const vuln of nvdVulns.slice(0, 2)) {
        const existing = await prisma.signal.findFirst({
          where: {
            leadId: lead.id,
            title: { contains: vuln.id },
          },
        });

        if (!existing && vuln.cvssScore >= 7.0) {
          await prisma.signal.create({
            data: {
              leadId: lead.id,
              type: "tech_vuln",
              severity: vuln.cvssScore >= 9.0 ? "critical" : vuln.cvssScore >= 7.0 ? "high" : "medium",
              source: "NVD",
              title: `${vuln.id} (CVSS ${vuln.cvssScore})`,
              body: vuln.description.slice(0, 500),
              capturedAt: new Date(vuln.published),
            },
          });
          newSignals++;
        }
      }

      // NVD rate limit: 5 req per 30s without API key
      await new Promise((r) => setTimeout(r, 6500));
    }
  }

  return NextResponse.json({
    scanned: leads.length,
    newSignals,
    timestamp: new Date().toISOString(),
  });
}
