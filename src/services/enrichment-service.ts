/**
 * Contact Enrichment Service
 *
 * Supports Hunter.io for email verification/finding and domain search.
 * All Hunter API results are cached in DB to minimize API calls.
 * Falls back to a Claude-powered inference when no API key is configured.
 *
 * Set HUNTER_API_KEY in environment to use Hunter.io.
 */

import { prisma } from "@/lib/db";

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
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function getCached(type: string, key: string): Promise<any | null> {
  try {
    const entry = await prisma.enrichmentCache.findUnique({
      where: { type_key: { type, key } },
    });
    if (!entry) return null;
    if (Date.now() - new Date(entry.createdAt).getTime() > CACHE_TTL_MS) return null;
    return JSON.parse(entry.payload);
  } catch {
    return null;
  }
}

async function setCache(type: string, key: string, domain: string, payload: any): Promise<void> {
  try {
    await prisma.enrichmentCache.upsert({
      where: { type_key: { type, key } },
      update: { payload: JSON.stringify(payload), createdAt: new Date() },
      create: { type, key, domain, payload: JSON.stringify(payload) },
    });
  } catch {
    // Non-fatal
  }
}

/**
 * Enrich a specific contact by name + domain using Hunter.io email finder
 */
export async function enrichContact(
  name: string,
  domain: string
): Promise<EnrichedContact | null> {
  const cacheKey = `${name.toLowerCase()}|${domain.toLowerCase()}`;
  const cached = await getCached("email_find", cacheKey);
  if (cached) return cached;

  let result: EnrichedContact | null;
  if (HUNTER_API_KEY) {
    result = await enrichViaHunter(name, domain);
  } else {
    result = enrichViaInference(name, domain);
  }

  if (result) {
    await setCache("email_find", cacheKey, domain, result);
  }
  return result;
}

/**
 * Find contacts at a domain using Hunter.io domain search
 */
export async function findContactsAtDomain(
  domain: string
): Promise<DomainSearchResult[]> {
  const cacheKey = domain.toLowerCase();
  const cached = await getCached("domain_search", cacheKey);
  if (cached) return cached;

  let results: DomainSearchResult[];
  if (HUNTER_API_KEY) {
    results = await domainSearchViaHunter(domain);
  } else {
    results = [];
  }

  if (results.length > 0) {
    await setCache("domain_search", cacheKey, domain, results);
  }
  return results;
}

/**
 * Verify if an email address is deliverable using Hunter.io
 */
export async function verifyEmail(
  email: string
): Promise<{ result: string; score: number } | null> {
  if (!HUNTER_API_KEY) return null;

  const cacheKey = email.toLowerCase();
  const cached = await getCached("email_verify", cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${HUNTER_API_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = {
      result: data.data?.result || "unknown",
      score: data.data?.score || 0,
    };
    await setCache("email_verify", cacheKey, email.split("@")[1] || "", result);
    return result;
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

function enrichViaInference(
  name: string,
  domain: string
): EnrichedContact | null {
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
    email: patterns[0],
    confidence: 35,
    source: "Pattern inference (unverified)",
  };
}
