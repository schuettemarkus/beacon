import { PrismaClient } from '@prisma/client'
import { leads, contacts, signals, emails } from '../seed-data'

const prisma = new PrismaClient()

async function main() {
  // Only seed if no leads exist (idempotent)
  const existingLeads = await prisma.lead.count()
  if (existingLeads > 0) {
    console.log(`✓ Database already has ${existingLeads} leads, skipping seed`)
    return
  }

  // Ensure a seed user exists
  const seedUser = await prisma.user.upsert({
    where: { email: 'demo@beacon.app' },
    update: {},
    create: {
      id: 'seed-user-001',
      name: 'Demo User',
      email: 'demo@beacon.app',
      password: '$2b$10$placeholder', // not a real login
    },
  })

  // Seed leads
  for (const lead of leads) {
    await prisma.lead.create({
      data: {
        id: lead.id,
        userId: seedUser.id,
        company: lead.company,
        domain: lead.domain,
        industry: lead.industry,
        hq: lead.hq,
        employees: lead.employees,
        revenueBand: lead.revenueBand,
        techStack: JSON.stringify(lead.techStack),
        funding: lead.funding,
        fitScore: lead.fitScore,
        status: lead.status,
        createdAt: new Date(lead.createdAt),
        snoozedUntil: lead.snoozedUntil ? new Date(lead.snoozedUntil) : null,
      },
    })
  }

  // Seed contacts
  for (const contact of contacts) {
    await prisma.contact.create({
      data: {
        id: contact.id,
        leadId: contact.leadId,
        name: contact.name,
        title: contact.title,
        email: contact.email,
        phone: contact.phone || null,
        linkedin: contact.linkedin || null,
        decisionMakerScore: contact.decisionMakerScore,
      },
    })
  }

  // Seed signals
  for (const signal of signals) {
    await prisma.signal.create({
      data: {
        id: signal.id,
        leadId: signal.leadId,
        type: signal.type,
        severity: signal.severity,
        source: signal.source,
        title: signal.title,
        body: signal.body,
        capturedAt: new Date(signal.capturedAt),
      },
    })
  }

  // Seed emails
  for (const email of emails) {
    await prisma.email.create({
      data: {
        id: email.id,
        leadId: email.leadId,
        contactId: email.contactId,
        variant: email.variant,
        subject: email.subject,
        preview: email.preview,
        body: email.body,
        predictedOpenRate: email.predictedOpenRate,
        predictedReplyRate: email.predictedReplyRate,
        sentAt: email.sentAt ? new Date(email.sentAt) : null,
      },
    })
  }

  console.log(`✓ Seeded ${leads.length} leads, ${contacts.length} contacts, ${signals.length} signals, ${emails.length} emails`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
