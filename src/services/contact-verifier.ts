import { anthropic } from "@/lib/anthropic";
import type { DomainSearchResult } from "./enrichment-service";

interface UnverifiedContact {
  name: string;
  title: string;
  email?: string;
  source: string; // "claude" | "hunter" | "both"
}

export interface VerifiedContact {
  name: string;
  title: string;
  email?: string;
  verified: boolean;
  confidence: "high" | "medium" | "low";
  source: string;
  correction?: string;
}

export async function verifyContacts(
  company: string,
  domain: string,
  claudeContacts: { name: string; title: string; email?: string }[],
  hunterContacts: DomainSearchResult[]
): Promise<VerifiedContact[]> {
  // Merge contacts from both sources
  const merged: UnverifiedContact[] = [];

  // Hunter contacts are higher trust — add them first
  for (const hc of hunterContacts) {
    merged.push({
      name: hc.name,
      title: hc.title,
      email: hc.email,
      source: "hunter",
    });
  }

  // Add Claude contacts that don't overlap with Hunter
  for (const cc of claudeContacts) {
    const isUnknown = cc.name.toLowerCase().startsWith("unknown");
    const hunterMatch = hunterContacts.find(
      (hc) =>
        hc.name.toLowerCase() === cc.name.toLowerCase() ||
        hc.title.toLowerCase().includes(cc.title.toLowerCase().split(",")[0]) ||
        cc.title.toLowerCase().includes(hc.title.toLowerCase().split(",")[0])
    );

    if (hunterMatch) {
      // Update existing hunter entry if Claude had the same role
      const existing = merged.find(
        (m) => m.name === hunterMatch.name
      );
      if (existing) {
        existing.source = "both";
      }
    } else if (!isUnknown) {
      merged.push({
        name: cc.name,
        title: cc.title,
        email: cc.email,
        source: "claude",
      });
    }
  }

  if (merged.length === 0) return [];

  // Ask Claude to verify and correct
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: [
        {
          type: "text",
          text: `You verify executive contacts at companies. Given a list of names and titles for people at a company, check if they are accurate based on your knowledge of publicly available information (news, press releases, LinkedIn profiles, conference speakers, regulatory filings). Return ONLY valid JSON.`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Verify these contacts at ${company} (${domain}):

${JSON.stringify(merged.map((m) => ({ name: m.name, title: m.title, source: m.source })), null, 2)}

For each contact, return a JSON array of objects:
- "name": string (corrected name if wrong, otherwise same)
- "title": string (corrected title if wrong, otherwise same)
- "verified": boolean (true if you're confident this person holds this role)
- "confidence": "high" | "medium" | "low"
- "correction": string | null (explain what you corrected, or null if accurate)

If you know the REAL person in a role but a different name was provided, replace it with the real name.
If you don't know who holds the role, set verified to false and confidence to "low".
NEVER invent names. If unsure, keep the original name and set confidence to "low".

Return ONLY the JSON array, no markdown.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "[]";
    let verified: any[];
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      verified = JSON.parse(cleaned.startsWith("[") ? cleaned : `[${cleaned}]`);
    } catch {
      // If parse fails, return unverified contacts as-is
      return merged.map((m) => ({
        name: m.name,
        title: m.title,
        email: m.email,
        verified: m.source === "hunter",
        confidence: m.source === "hunter" ? "medium" as const : "low" as const,
        source: m.source,
      }));
    }

    // Map back verified results with email from original data
    return verified.map((v: any, i: number) => ({
      name: v.name || merged[i]?.name || "Unknown",
      title: v.title || merged[i]?.title || "Unknown",
      email: merged[i]?.email,
      verified: v.verified ?? false,
      confidence: v.confidence || "low",
      source: merged[i]?.source || "claude",
      correction: v.correction || undefined,
    }));
  } catch {
    // If verification fails entirely, return unverified
    return merged.map((m) => ({
      name: m.name,
      title: m.title,
      email: m.email,
      verified: m.source === "hunter",
      confidence: m.source === "hunter" ? "medium" as const : "low" as const,
      source: m.source,
    }));
  }
}
