import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { generateEmailVariants } from "@/services/email-generator";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; emailId: string }> }
) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, emailId } = await params;

  // Load the email to know the variant
  const email = await prisma.email.findUnique({ where: { id: emailId } });
  if (!email) return NextResponse.json({ error: "Email not found" }, { status: 404 });

  // Load the lead with signals for context
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { contacts: true, signals: true },
  });
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  // Find the contact for this email
  const contact = await prisma.contact.findUnique({ where: { id: email.contactId } });

  // Generate all variants but only use the one we need
  const variants = await generateEmailVariants(
    {
      company: lead.company,
      domain: lead.domain,
      industry: lead.industry,
      hq: lead.hq,
      employees: lead.employees,
      revenueBand: lead.revenueBand,
      techStack: JSON.parse(lead.techStack),
      funding: lead.funding,
      fitScore: lead.fitScore,
      signals: lead.signals.map((s) => ({
        type: s.type,
        severity: s.severity,
        source: s.source,
        title: s.title,
        body: s.body,
      })),
      contacts: [],
    },
    contact?.name,
    contact?.title
  );

  const regenerated = variants.find((v) => v.variant === email.variant);
  if (!regenerated) {
    return NextResponse.json({ error: "Failed to regenerate" }, { status: 500 });
  }

  const updated = await prisma.email.update({
    where: { id: emailId },
    data: {
      subject: regenerated.subject,
      preview: regenerated.preview,
      body: regenerated.body,
      predictedOpenRate: regenerated.predictedOpenRate,
      predictedReplyRate: regenerated.predictedReplyRate,
      sentAt: null, // Reset sent status
    },
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: id,
      kind: "email_regenerated",
      payload: JSON.stringify({ emailId, variant: email.variant }),
    },
  });

  return NextResponse.json(updated);
}
