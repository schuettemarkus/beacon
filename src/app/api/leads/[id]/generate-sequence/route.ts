import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

interface CadenceStep {
  type: string;
  label: string;
  days?: number;
  emailVariant?: string;
}

interface SequenceStep {
  stepIndex: number;
  type: string;
  label: string;
  days: number;
  content?: { subject: string; body: string };
  action?: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { cadenceId } = body;

  if (!cadenceId) {
    return NextResponse.json(
      { error: "cadenceId is required" },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.findFirst({
    where: { id, userId: user.id },
    include: { contacts: true, signals: true },
  });

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const cadence = await prisma.cadence.findFirst({
    where: { id: cadenceId, userId: user.id },
  });

  if (!cadence) {
    return NextResponse.json({ error: "Cadence not found" }, { status: 404 });
  }

  const seller = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true, industry: true },
  });

  const sellerProfile = seller?.sellerProfile
    ? JSON.parse(seller.sellerProfile)
    : null;
  const icpProfile = seller?.icpProfile
    ? JSON.parse(seller.icpProfile)
    : null;
  const config = getIndustryConfig(seller?.industry || "cybersecurity");

  const cadenceSteps: CadenceStep[] = JSON.parse(cadence.steps);
  const techStack: string[] = JSON.parse(lead.techStack);
  const primaryContact = lead.contacts[0];

  const sequenceSteps: SequenceStep[] = [];
  const generatedEmails: { subject: string; body: string }[] = [];

  for (let i = 0; i < cadenceSteps.length; i++) {
    const step = cadenceSteps[i];

    if (step.type === "email") {
      const previousEmails = generatedEmails
        .map((e, idx) => `Email ${idx + 1} subject: "${e.subject}"`)
        .join("\n");

      const isFirstEmail = generatedEmails.length === 0;

      const sellerInsert = sellerProfile
        ? `\nSeller company: ${sellerProfile.company}\nProducts: ${sellerProfile.products?.join(", ")}\nValue props: ${sellerProfile.valueProps}`
        : "";

      const prompt = isFirstEmail
        ? `Write a cold outreach email for this lead. Be concise, personalized, and reference specific signals or tech stack items.\n\nCompany: ${lead.company}\nIndustry: ${lead.industry}\nEmployees: ${lead.employees}\nTech Stack: ${techStack.join(", ")}\nSignals: ${lead.signals.map((s) => s.title).join("; ")}\n${primaryContact ? `Recipient: ${primaryContact.name}, ${primaryContact.title}` : `Recipient: ${icpProfile?.buyerTitles?.[0] || config.typicalBuyerTitles[0]}`}${sellerInsert}`
        : `Write a follow-up email for this lead. Reference the previous outreach naturally. Be brief and add new value.\n\nCompany: ${lead.company}\nIndustry: ${lead.industry}\nTech Stack: ${techStack.join(", ")}\nSignals: ${lead.signals.map((s) => s.title).join("; ")}\n${primaryContact ? `Recipient: ${primaryContact.name}, ${primaryContact.title}` : `Recipient: ${icpProfile?.buyerTitles?.[0] || config.typicalBuyerTitles[0]}`}${sellerInsert}\n\nPrevious emails sent:\n${previousEmails}`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: [
          {
            type: "text",
            text: `${config.emailWriterRole} Return ONLY valid JSON with fields: "subject" (string), "body" (string).`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: prompt }],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      let emailContent: { subject: string; body: string };
      try {
        const cleaned = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        emailContent = JSON.parse(cleaned);
      } catch {
        emailContent = {
          subject: `Regarding ${lead.company}`,
          body: text || "Failed to generate email content.",
        };
      }

      generatedEmails.push(emailContent);

      sequenceSteps.push({
        stepIndex: i,
        type: step.type,
        label: step.label,
        days: step.days || 0,
        content: emailContent,
      });
    } else {
      const actionMap: Record<string, string> = {
        linkedin: "Connect on LinkedIn and engage with recent posts",
        call: "Discovery call to discuss pain points",
        wait: `Wait ${step.days || 1} day(s) before next touch`,
      };

      sequenceSteps.push({
        stepIndex: i,
        type: step.type,
        label: step.label,
        days: step.days || 0,
        action: actionMap[step.type] || step.label,
      });
    }
  }

  const sequence = await prisma.sequence.create({
    data: {
      leadId: id,
      steps: JSON.stringify(sequenceSteps),
      status: "draft",
    },
  });

  const enrollment = await prisma.enrollment.create({
    data: {
      cadenceId,
      leadId: id,
      currentStep: 0,
      status: "draft",
    },
  });

  return NextResponse.json({
    sequence: {
      ...sequence,
      steps: sequenceSteps,
    },
    enrollmentId: enrollment.id,
  });
}
