import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { runResearchPipeline } from "@/services/research-pipeline";
import { generateEmailVariants } from "@/services/email-generator";
import { scoreLead } from "@/services/lead-scorer";
import { estimateDealValue } from "@/services/deal-value-estimator";
import { findContactsAtDomain } from "@/services/enrichment-service";
import { verifyContacts } from "@/services/contact-verifier";
import type { ICPProfile } from "@/services/lead-scorer";
import type { SellerContext } from "@/services/research-pipeline";

// Processes ONE account at a time to stay under Vercel's function timeout
export async function POST(request: Request) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { company } = await request.json();
  if (!company)
    return NextResponse.json({ error: "company string required" }, { status: 400 });

  // Check if lead already exists
  const existing = await prisma.lead.findFirst({
    where: { userId: user.id, company: { equals: company } },
  });
  if (existing)
    return NextResponse.json({ status: "exists", leadId: existing.id, company });

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
      overview: payload.overview || null,
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

  // Only use verified contacts from Hunter.io — no AI-generated names
  let domainContacts: Awaited<ReturnType<typeof findContactsAtDomain>> = [];
  try { domainContacts = await findContactsAtDomain(payload.domain); } catch {}

  const verifiedContacts = verifyContacts(
    payload.company, payload.domain, [], domainContacts
  );

  for (const vc of verifiedContacts) {
    await prisma.contact.create({
      data: {
        leadId: lead.id,
        name: vc.name,
        title: vc.title,
        email: vc.email || `contact@${payload.domain}`,
        phone: vc.phone || null,
        linkedin: vc.linkedin || null,
        decisionMakerScore: vc.confidence === "high" ? 80 : vc.confidence === "medium" ? 60 : 40,
        enrichedAt: new Date(),
        enrichmentSource: `Verified (${vc.source})`,
      },
    });
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

  return NextResponse.json({ status: "created", leadId: lead.id, company: payload.company });
}
