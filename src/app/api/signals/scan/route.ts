import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchCVEsByProduct } from "@/services/data-sources/nvd-cve";
import { findCVEsForTechStack } from "@/services/data-sources/cisa-kev";
import { fetchIndustryNews } from "@/services/data-sources/news";
import { getIndustryConfig } from "@/config/industries";

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
    select: { id: true, company: true, techStack: true, userId: true },
  });

  let newSignals = 0;

  // Cache user → industry and ICP lookups to avoid repeated queries
  const userIndustryCache = new Map<string, string>();
  const userIcpCache = new Map<string, any>();

  for (const lead of leads) {
    // Look up the user's industry and ICP (cached)
    let industry = userIndustryCache.get(lead.userId);
    if (!industry) {
      const user = await prisma.user.findUnique({
        where: { id: lead.userId },
      });
      industry = (user as any)?.industry || "cybersecurity";
      userIndustryCache.set(lead.userId, industry as string);
      if ((user as any)?.icpProfile) {
        try {
          userIcpCache.set(lead.userId, JSON.parse((user as any).icpProfile as string));
        } catch { /* ignore */ }
      }
    }

    const config = getIndustryConfig(industry as string);
    const techStack: string[] = JSON.parse(lead.techStack);

    if (config.useVulnSources) {
      // Run existing CISA/NVD scan for industries that use vuln sources
      if (techStack.length === 0) continue;

      // Check CISA KEV for known exploited vulns matching tech stack
      const cisaVulns = await findCVEsForTechStack(techStack);

      for (const vuln of cisaVulns.slice(0, 3)) {
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
    } else {
      // For non-vuln industries: fetch industry news and create signal records
      const newsItems = await fetchIndustryNews(lead.company, config.newsKeywords);

      // Filter by user's ICP verticals if set
      const userIcp = userIcpCache.get(lead.userId);
      const verticals: string[] = userIcp?.verticals || [];

      for (const item of newsItems.slice(0, 5)) {
        // If user has verticals set, only create signals relevant to those verticals
        if (verticals.length > 0) {
          const titleLower = item.title.toLowerCase();
          const isRelevant = verticals.some((v: string) => titleLower.includes(v.toLowerCase()));
          if (!isRelevant) continue;
        }

        const existing = await prisma.signal.findFirst({
          where: {
            leadId: lead.id,
            title: item.title,
          },
        });

        if (!existing) {
          await prisma.signal.create({
            data: {
              leadId: lead.id,
              type: "news",
              severity: "medium",
              source: item.source || "Google News",
              title: item.title,
              body: item.title,
              capturedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            },
          });
          newSignals++;
        }
      }
    }
  }

  return NextResponse.json({
    scanned: leads.length,
    newSignals,
    timestamp: new Date().toISOString(),
  });
}
