/**
 * Contact Enrichment Service
 *
 * Supports Hunter.io for email verification/finding and domain search.
 * Falls back to a Claude-powered inference when no API key is configured.
 *
 * Set HUNTER_API_KEY in environment to use Hunter.io.
 */

export interface EnrichedContact {
  email?: string;
  phone?: string;
  linkedin?: string;
  confidence: number; // 0-100
  source: string;
}

export interface DomainSearchResult {
  name: string;
  email: string;
  title: string;
  phone?: string;
  linkedin?: string;
  confidence: number;
  source: string;
}

const HUNTER_API_KEY = process.env.HUNTER_API_KEY;

/**
 * Enrich a specific contact by name + domain using Hunter.io email finder
 */
export async function enrichContact(
  name: string,
  domain: string
): Promise<EnrichedContact | null> {
  if (HUNTER_API_KEY) {
    return enrichViaHunter(name, domain);
  }
  return enrichViaInference(name, domain);
}

/**
 * Find contacts at a domain using Hunter.io domain search
 */
export async function findContactsAtDomain(
  domain: string
): Promise<DomainSearchResult[]> {
  if (HUNTER_API_KEY) {
    return domainSearchViaHunter(domain);
  }
  return [];
}

/**
 * Verify if an email address is deliverable using Hunter.io
 */
export async function verifyEmail(
  email: string
): Promise<{ result: string; score: number } | null> {
  if (!HUNTER_API_KEY) return null;

  try {
    const res = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${HUNTER_API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      result: data.data?.result || "unknown",
      score: data.data?.score || 0,
    };
  } catch {
    return null;
  }
}

// --- Hunter.io Implementation ---

async function enrichViaHunter(
  name: string,
  domain: string
): Promise<EnrichedContact | null> {
  try {
    const [firstName, ...lastParts] = name.split(" ");
    const lastName = lastParts.join(" ");

    const params = new URLSearchParams({
      domain,
      first_name: firstName,
      last_name: lastName,
      api_key: HUNTER_API_KEY!,
    });

    const res = await fetch(
      `https://api.hunter.io/v2/email-finder?${params.toString()}`
    );

    if (!res.ok) return null;
    const data = await res.json();

    if (!data.data?.email) return null;

    return {
      email: data.data.email,
      phone: data.data.phone_number || undefined,
      linkedin: data.data.linkedin_url || undefined,
      confidence: data.data.confidence || 0,
      source: "Hunter.io",
    };
  } catch {
    return null;
  }
}

async function domainSearchViaHunter(
  domain: string
): Promise<DomainSearchResult[]> {
  try {
    const params = new URLSearchParams({
      domain,
      api_key: HUNTER_API_KEY!,
      limit: "10",
    });

    const res = await fetch(
      `https://api.hunter.io/v2/domain-search?${params.toString()}`
    );

    if (!res.ok) return [];
    const data = await res.json();

    return (data.data?.emails || []).map((e: any) => ({
      name: `${e.first_name || ""} ${e.last_name || ""}`.trim() || "Unknown",
      email: e.value,
      title: e.position || "Unknown",
      phone: e.phone_number || undefined,
      linkedin: e.linkedin || undefined,
      confidence: e.confidence || 0,
      source: "Hunter.io",
    }));
  } catch {
    return [];
  }
}

// --- Inference Fallback (no API key) ---

async function enrichViaInference(
  name: string,
  domain: string
): Promise<EnrichedContact | null> {
  // Common email patterns: first.last@domain, flast@domain, first@domain
  const [firstName, ...lastParts] = name.toLowerCase().split(" ");
  const lastName = lastParts.join("").toLowerCase();

  if (!firstName || !lastName) return null;

  const patterns = [
    `${firstName}.${lastName}@${domain}`,
    `${firstName[0]}${lastName}@${domain}`,
    `${firstName}@${domain}`,
    `${firstName}${lastName}@${domain}`,
  ];

  return {
    email: patterns[0], // Most common pattern
    confidence: 35,
    source: "Pattern inference (unverified)",
  };
}
