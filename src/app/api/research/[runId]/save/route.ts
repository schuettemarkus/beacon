import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateEmailVariants } from "@/services/email-generator";
import { scoreLead } from "@/services/lead-scorer";
import type { ICPProfile } from "@/services/lead-scorer";
import type { CompanyResearchPayload } from "@/services/company-research";
import type { SellerContext } from "@/services/research-pipeline";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { runId } = await params;

  // Get the research run (verify ownership)
  const run = await prisma.researchRun.findFirst({ where: { id: runId, userId: user.id } });
  if (!run) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const payload: CompanyResearchPayload = JSON.parse(run.payload);

  // Create the lead
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
      status: "today",
      logoUrl: `https://www.google.com/s2/favicons?domain=${payload.domain}&sz=128`,
    },
  });

  // Score against user's ICP if available
  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { icpProfile: true } as any,
    });
    if ((profile as any)?.icpProfile) {
      const icp: ICPProfile = JSON.parse((profile as any).icpProfile);
      const breakdown = scoreLead(
        {
          industry: payload.industry,
          employees: payload.employees,
          funding: payload.funding,
          techStack: payload.techStack || [],
          hq: payload.hq,
          revenueBand: payload.revenueBand,
        },
        icp
      );
      await prisma.lead.update({
        where: { id: lead.id },
        data: { fitScore: breakdown.total },
      });
    }
  } catch (e) {
    console.error("ICP scoring error:", e);
  }

  // Create contacts and attempt enrichment
  if (payload.contacts?.length) {
    for (const c of payload.contacts) {
      const contact = await prisma.contact.create({
        data: {
          leadId: lead.id,
          name: c.name,
          title: c.title,
          email: c.email,
          phone: c.phone || null,
          linkedin: c.linkedin || null,
          decisionMakerScore: c.decisionMakerScore || 50,
        },
      });

      // Auto-enrich if email is a placeholder
      if (c.email.includes("contact@")) {
        try {
          const { enrichContact } = await import("@/services/enrichment-service");
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
        } catch {
          // Non-fatal: contact saved even if enrichment fails
        }
      }
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

  // Load seller profile for email personalization
  let sellerProfile: SellerContext | undefined;
  try {
    const sellerData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { sellerProfile: true },
    });
    if (sellerData?.sellerProfile) {
      sellerProfile = JSON.parse(sellerData.sellerProfile as string);
    }
  } catch { /* ignore */ }

  // Load ICP profile for email personalization
  let icpProfile: any = null;
  try {
    const icpData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { icpProfile: true } as any,
    });
    if ((icpData as any)?.icpProfile) {
      icpProfile = JSON.parse((icpData as any).icpProfile as string);
    }
  } catch { /* ignore */ }

  // Generate email variants via Claude
  try {
    const firstContact = payload.contacts?.[0];
    const emails = await generateEmailVariants(
      payload,
      firstContact?.name,
      firstContact?.title,
      user.industry,
      sellerProfile,
      icpProfile
    );

    // Get the first contact ID (or create a placeholder)
    const contacts = await prisma.contact.findMany({
      where: { leadId: lead.id },
      take: 1,
    });
    const contactId = contacts[0]?.id;

    if (contactId) {
      await prisma.email.createMany({
        data: emails.map((e) => ({
          leadId: lead.id,
          contactId,
          variant: e.variant,
          subject: e.subject,
          preview: e.preview,
          body: e.body,
          predictedOpenRate: e.predictedOpenRate,
          predictedReplyRate: e.predictedReplyRate,
        })),
      });
    }
  } catch (e) {
    console.error("Email generation error:", e);
    // Non-fatal: lead is still saved even if email generation fails
  }

  // Update research run with lead reference
  await prisma.researchRun.update({
    where: { id: runId },
    data: { savedAsLeadId: lead.id },
  });

  return NextResponse.json({ leadId: lead.id });
}
