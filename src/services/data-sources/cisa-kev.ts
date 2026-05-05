export interface CISAVulnerability {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  knownRansomwareCampaignUse: string;
}

let cachedKEV: CISAVulnerability[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function getKEVCatalog(): Promise<CISAVulnerability[]> {
  if (cachedKEV && Date.now() - cacheTime < CACHE_TTL) {
    return cachedKEV;
  }

  try {
    const res = await fetch(
      "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
    );
    if (!res.ok) return [];
    const data = await res.json();
    cachedKEV = data.vulnerabilities || [];
    cacheTime = Date.now();
    return cachedKEV!;
  } catch {
    return [];
  }
}

export async function findCVEsForTechStack(techStack: string[]): Promise<CISAVulnerability[]> {
  const kev = await getKEVCatalog();
  const matches: CISAVulnerability[] = [];

  const normalizedStack = techStack.map((t) => t.toLowerCase());

  for (const vuln of kev) {
    const vendor = vuln.vendorProject?.toLowerCase() || "";
    const product = vuln.product?.toLowerCase() || "";

    for (const tech of normalizedStack) {
      const techLower = tech.toLowerCase();
      if (
        vendor.includes(techLower) ||
        product.includes(techLower) ||
        techLower.includes(vendor) ||
        techLower.includes(product)
      ) {
        matches.push(vuln);
        break;
      }
    }
  }

  // Return most recent 10
  return matches
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 10);
}
