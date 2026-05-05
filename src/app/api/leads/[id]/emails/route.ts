import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const emails = await prisma.email.findMany({
      where: { leadId: id },
      include: { contact: true },
      orderBy: { sentAt: "desc" },
    });

    return NextResponse.json(emails);
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { contactId, variant, subject, preview, body: emailBody } = body as {
      contactId: string;
      variant: string;
      subject: string;
      preview: string;
      body: string;
    };

    if (!contactId || !variant || !subject || !preview || !emailBody) {
      return NextResponse.json(
        { error: "contactId, variant, subject, preview, and body are required" },
        { status: 400 }
      );
    }

    // Verify the lead exists
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Verify the contact belongs to this lead
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, leadId: id },
    });
    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found for this lead" },
        { status: 404 }
      );
    }

    const email = await prisma.email.create({
      data: {
        leadId: id,
        contactId,
        variant,
        subject,
        preview,
        body: emailBody,
        predictedOpenRate: 0,
        predictedReplyRate: 0,
      },
    });

    return NextResponse.json(email, { status: 201 });
  } catch (error) {
    console.error("Failed to create email:", error);
    return NextResponse.json(
      { error: "Failed to create email" },
      { status: 500 }
    );
  }
}
