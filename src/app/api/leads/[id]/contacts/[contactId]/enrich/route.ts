import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { enrichContact, verifyEmail } from "@/services/enrichment-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  const user = await getSession();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, contactId } = await params;

  // Verify lead ownership
  const lead = await prisma.lead.findFirst({
    where: { id, userId: user.id },
  });
  if (!lead)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Get the contact
  const contact = await prisma.contact.findUnique({
    where: { id: contactId },
  });
  if (!contact || contact.leadId !== id)
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  // Attempt enrichment
  const enriched = await enrichContact(contact.name, lead.domain);

  if (!enriched) {
    return NextResponse.json(
      { error: "Could not enrich this contact" },
      { status: 404 }
    );
  }

  // If we got an email, optionally verify it
  let verificationResult = null;
  if (enriched.email && enriched.source === "Hunter.io") {
    verificationResult = await verifyEmail(enriched.email);
  }

  // Update the contact with enriched data
  const updateData: any = {
    enrichedAt: new Date(),
    enrichmentSource: enriched.source,
  };

  // Only update fields if we got better data
  if (enriched.email && !contact.email.includes("contact@")) {
    // Don't overwrite a real email with an inferred one
  } else if (enriched.email) {
    updateData.email = enriched.email;
  }

  if (enriched.phone && !contact.phone) {
    updateData.phone = enriched.phone;
  }

  if (enriched.linkedin && !contact.linkedin) {
    updateData.linkedin = enriched.linkedin;
  }

  const updated = await prisma.contact.update({
    where: { id: contactId },
    data: updateData,
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: id,
      kind: "contact_enriched",
      payload: JSON.stringify({
        contactName: contact.name,
        source: enriched.source,
        confidence: enriched.confidence,
        verification: verificationResult?.result,
      }),
    },
  });

  return NextResponse.json({
    contact: updated,
    enrichment: {
      ...enriched,
      verification: verificationResult,
    },
  });
}
