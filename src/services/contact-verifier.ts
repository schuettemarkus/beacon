import type { DomainSearchResult } from "./enrichment-service";

export interface VerifiedContact {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  verified: boolean;
  confidence: "high" | "medium" | "low";
  source: string;
}

/**
 * Returns ONLY real, verified contacts from Hunter.io.
 * No inferred or AI-generated contacts — real people only.
 * If Hunter returns nothing, returns an empty array.
 */
export function verifyContacts(
  _company: string,
  _domain: string,
  _claudeContacts: { name: string; title: string; email?: string }[],
  hunterContacts: DomainSearchResult[]
): VerifiedContact[] {
  // Only use Hunter.io contacts — these are real, verified people
  return hunterContacts
    .filter((hc) => hc.name && hc.name !== "Unknown" && hc.email)
    .map((hc) => ({
      name: hc.name,
      title: hc.title || "Title not available",
      email: hc.email,
      phone: hc.phone,
      linkedin: hc.linkedin,
      verified: true,
      confidence: hc.confidence >= 80 ? "high" as const : hc.confidence >= 50 ? "medium" as const : "low" as const,
      source: "Hunter.io",
    }));
}
