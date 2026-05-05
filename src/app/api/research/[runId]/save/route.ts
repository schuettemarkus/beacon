import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateEmailVariants } from "@/services/email-generator";
import { scoreLead } from "@/services/lead-scorer";
import type { ICPProfile } from "@/services/lead-scorer";
import type { CompanyResearchPayload } from "@/services/company-research";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { runId } = await params;

  // Get the research run
  const run = await prisma.researchRun.findUnique({ where: { id: runId } });
  if (!run) {
    return NextResponse.json({ error: "Research run not found" }, { status: 404 });
  }

  const payload: CompanyResearchPayload = JSON.parse(run.payload);

  // Create the lead
  const lead = await prisma.lead.create({
    data: {
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
      logoUrl: `https://logo.clearbit.com/${payload.domain}`,
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

  // Create contacts
  if (payload.contacts?.length) {
    await prisma.contact.createMany({
      data: payload.contacts.map((c) => ({
        leadId: lead.id,
        name: c.name,
        title: c.title,
        email: c.email,
        phone: c.phone || null,
        linkedin: c.linkedin || null,
        decisionMakerScore: c.decisionMakerScore || 50,
      })),
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

  // Generate email variants via Claude
  try {
    const firstContact = payload.contacts?.[0];
    const emails = await generateEmailVariants(
      payload,
      firstContact?.name,
      firstContact?.title
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
