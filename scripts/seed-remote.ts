import { createClient } from "@libsql/client";
import { leads, contacts, signals, emails } from "../seed-data";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  // Check if already seeded
  const result = await client.execute("SELECT COUNT(*) as count FROM Lead");
  const count = Number(result.rows[0].count);
  if (count > 0) {
    console.log(`✓ Database already has ${count} leads, skipping seed`);
    return;
  }

  console.log("Seeding leads...");
  for (const lead of leads) {
    await client.execute({
      sql: `INSERT INTO Lead (id, company, domain, industry, hq, employees, revenueBand, techStack, funding, fitScore, status, createdAt, snoozedUntil) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        lead.id,
        lead.company,
        lead.domain,
        lead.industry,
        lead.hq,
        lead.employees,
        lead.revenueBand,
        JSON.stringify(lead.techStack),
        lead.funding,
        lead.fitScore,
        lead.status,
        lead.createdAt,
        lead.snoozedUntil || null,
      ],
    });
  }

  console.log("Seeding contacts...");
  for (const contact of contacts) {
    await client.execute({
      sql: `INSERT INTO Contact (id, leadId, name, title, email, phone, linkedin, decisionMakerScore) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        contact.id,
        contact.leadId,
        contact.name,
        contact.title,
        contact.email,
        contact.phone || null,
        contact.linkedin || null,
        contact.decisionMakerScore,
      ],
    });
  }

  console.log("Seeding signals...");
  for (const signal of signals) {
    await client.execute({
      sql: `INSERT INTO Signal (id, leadId, type, severity, source, title, body, capturedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        signal.id,
        signal.leadId,
        signal.type,
        signal.severity,
        signal.source,
        signal.title,
        signal.body,
        signal.capturedAt,
      ],
    });
  }

  console.log("Seeding emails...");
  for (const email of emails) {
    await client.execute({
      sql: `INSERT INTO Email (id, leadId, contactId, variant, subject, preview, body, predictedOpenRate, predictedReplyRate, sentAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        email.id,
        email.leadId,
        email.contactId,
        email.variant,
        email.subject,
        email.preview,
        email.body,
        email.predictedOpenRate,
        email.predictedReplyRate,
        email.sentAt || null,
      ],
    });
  }

  console.log(
    `✓ Seeded ${leads.length} leads, ${contacts.length} contacts, ${signals.length} signals, ${emails.length} emails`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
