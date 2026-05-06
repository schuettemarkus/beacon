import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runResearchPipeline } from "@/services/research-pipeline";
import { generateEmailVariants } from "@/services/email-generator";
import { scoreLead } from "@/services/lead-scorer";
import { estimateDealValue } from "@/services/deal-value-estimator";
import { enrichContact, findContactsAtDomain } from "@/services/enrichment-service";
import type { ICPProfile } from "@/services/lead-scorer";
import type { SellerContext } from "@/services/research-pipeline";

export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { accounts } = await request.json();
  if (!accounts?.length)
    return NextResponse.json({ error: "accounts array required" }, { status: 400 });

  // Load seller + ICP profiles
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true },
  });

  let sellerProfile: SellerContext | undefined;
  if (userData?.sellerProfile) {
    try { sellerProfile = JSON.parse(userData.sellerProfile as string); } catch {}
  }
  let icpProfile: ICPProfile | null = null;
  if (userData?.icpProfile) {
    try { icpProfile = JSON.parse(userData.icpProfile as string); } catch {}
  }

  const results: { company: string; status: string; leadId?: string }[] = [];

  // Process in batches of 3 to avoid rate limits
  for (let i = 0; i < accounts.length; i += 3) {
    const batch = accounts.slice(i, i + 3);
    const batchResults = await Promise.allSettled(
      batch.map(async (company: string) => {
        // Check if lead already exists
        const existing = await prisma.lead.findFirst({
          where: { userId: user.id, company: { equals: company } },
        });
        if (existing) return { company, status: "exists", leadId: existing.id };

        // Run research pipeline
        const payload = await runResearchPipeline(
          company, user.id, user.industry, sellerProfile, icpProfile || undefined
        );

        // Re-score with deterministic scorer
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
              icpProfile
            );
            payload.fitScore = breakdown.total;
          } catch {}
        }

        // Estimate deal value
        const estimate = estimateDealValue({
          employees: payload.employees,
          industry: payload.industry,
          techStack: payload.techStack || [],
          funding: payload.funding,
          fitScore: payload.fitScore,
        });

        // Create lead
        const lead = await prisma.lead.create({
          data: {
            userId: user.id,
            company: payload.company,
            domain: payload.domain,
            industry: payload.industry,
            hq: payload.hq,
            employees: payload.employees,
            revenueBand: payload.revenueBand,
            techStack: JSON.stringify(payload.techStack),
            funding: payload.funding,
            fitScore: payload.fitScore,
            dealValue: estimate.estimatedACV,
            status: "today",
            logoUrl: `https://www.google.com/s2/favicons?domain=${payload.domain}&sz=128`,
          },
        });

        // Save research run
        await prisma.researchRun.create({
          data: {
            userId: user.id,
            query: company,
            payload: JSON.stringify(payload),
            savedAsLeadId: lead.id,
          },
        });

        // Enrich contacts via domain search + create
        let domainContacts: Awaited<ReturnType<typeof findContactsAtDomain>> = [];
        try { domainContacts = await findContactsAtDomain(payload.domain); } catch {}

        if (payload.contacts?.length) {
          for (const c of payload.contacts) {
            const domainMatch = domainContacts.find(
              (dc) => dc.title.toLowerCase().includes(c.title.toLowerCase().split(",")[0]) ||
                      c.title.toLowerCase().includes(dc.title.toLowerCase().split(",")[0])
            );

            const contact = await prisma.contact.create({
              data: {
                leadId: lead.id,
                name: domainMatch?.name || c.name,
                title: domainMatch?.title || c.title,
                email: domainMatch?.email || c.email,
                phone: domainMatch?.phone || null,
                linkedin: domainMatch?.linkedin || null,
                decisionMakerScore: c.decisionMakerScore || 50,
                enrichedAt: domainMatch ? new Date() : null,
                enrichmentSource: domainMatch?.source || null,
              },
            });

            if (!domainMatch && c.email.includes("contact@")) {
              try {
                const enriched = await enrichContact(c.name, payload.domain);
                if (enriched?.email) {
                  await prisma.contact.update({
                    where: { id: contact.id },
                    data: {
                      email: enriched.email,
                      phone: enriched.phone || contact.phone,
                      linkedin: enriched.linkedin || contact.linkedin,
                      enrichedAt: new Date(),
                      enrichmentSource: enriched.source,
                    },
                  });
                }
              } catch {}
            }
          }
        }

        // Add extra contacts from domain search
        if (domainContacts.length > 0 && payload.contacts?.length) {
          const existingEmails = new Set(payload.contacts.map((c) => c.email));
          const extra = domainContacts.filter(
            (dc) => !existingEmails.has(dc.email) &&
                    !payload.contacts!.some((c) => c.name.toLowerCase() === dc.name.toLowerCase())
          );
          for (const dc of extra.slice(0, 3)) {
            await prisma.contact.create({
              data: {
                leadId: lead.id,
                name: dc.name,
                title: dc.title,
                email: dc.email,
                phone: dc.phone || null,
                linkedin: dc.linkedin || null,
                decisionMakerScore: 50,
                enrichedAt: new Date(),
                enrichmentSource: dc.source,
              },
            });
          }
        }

        // Create signals
        if (payload.signals?.length) {
          await prisma.signal.createMany({
            data: payload.signals.map((s) => ({
              leadId: lead.id,
              type: s.type,
              severity: s.severity,
              source: s.source,
              title: s.title,
              body: s.body,
            })),
          });
        }

        // Generate email variants
        try {
          const firstContact = payload.contacts?.[0];
          const emails = await generateEmailVariants(
            payload, firstContact?.name, firstContact?.title,
            user.industry, sellerProfile, icpProfile
          );
          const contacts = await prisma.contact.findMany({
            where: { leadId: lead.id }, take: 1,
          });
          if (contacts[0]?.id) {
            await prisma.email.createMany({
              data: emails.map((e) => ({
                leadId: lead.id,
                contactId: contacts[0].id,
                variant: e.variant,
                subject: e.subject,
                preview: e.preview,
                body: e.body,
                predictedOpenRate: e.predictedOpenRate,
                predictedReplyRate: e.predictedReplyRate,
              })),
            });
          }
        } catch {}

        return { company, status: "created", leadId: lead.id };
      })
    );

    for (const r of batchResults) {
      if (r.status === "fulfilled") {
        results.push(r.value);
      } else {
        const company = batch[batchResults.indexOf(r)];
        results.push({ company, status: `error: ${r.reason?.message || "unknown"}` });
      }
    }
  }

  return NextResponse.json({
    total: accounts.length,
    created: results.filter((r) => r.status === "created").length,
    existing: results.filter((r) => r.status === "exists").length,
    errors: results.filter((r) => r.status.startsWith("error")).length,
    results,
  });
}
