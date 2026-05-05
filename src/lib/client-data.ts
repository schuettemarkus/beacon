import { leads, contacts, signals, emails } from "../../seed-data";
import type { Lead, Contact, Signal, Email } from "../../seed-data";

export type LeadWithRelations = Lead & {
  contacts: Contact[];
  signals: Signal[];
  emails: Email[];
};

export function getLeadsGrouped() {
  const grouped = {
    today: [] as LeadWithRelations[],
    thisWeek: [] as LeadWithRelations[],
    snoozed: [] as LeadWithRelations[],
    closedWon: [] as LeadWithRelations[],
    archived: [] as LeadWithRelations[],
  };

  for (const lead of leads) {
    const enriched: LeadWithRelations = {
      ...lead,
      contacts: contacts.filter((c) => c.leadId === lead.id),
      signals: signals.filter((s) => s.leadId === lead.id),
      emails: emails.filter((e) => e.leadId === lead.id),
    };

    switch (lead.status) {
      case "today":
        grouped.today.push(enriched);
        break;
      case "this_week":
        grouped.thisWeek.push(enriched);
        break;
      case "snoozed":
        grouped.snoozed.push(enriched);
        break;
      case "closed_won":
        grouped.closedWon.push(enriched);
        break;
      case "archived":
        grouped.archived.push(enriched);
        break;
    }
  }

  // Sort each group by fitScore descending
  for (const group of Object.values(grouped)) {
    group.sort((a, b) => b.fitScore - a.fitScore);
  }

  return grouped;
}

export function getLeadById(id: string): LeadWithRelations | null {
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;

  return {
    ...lead,
    contacts: contacts.filter((c) => c.leadId === id),
    signals: signals.filter((s) => s.leadId === id),
    emails: emails.filter((e) => e.leadId === id),
  };
}

export function searchLeads(query: string): LeadWithRelations[] {
  const q = query.toLowerCase();
  return leads
    .filter(
      (l) =>
        l.company.toLowerCase().includes(q) ||
        l.industry.toLowerCase().includes(q) ||
        l.domain.toLowerCase().includes(q)
    )
    .map((lead) => ({
      ...lead,
      contacts: contacts.filter((c) => c.leadId === lead.id),
      signals: signals.filter((s) => s.leadId === lead.id),
      emails: emails.filter((e) => e.leadId === lead.id),
    }));
}
