export interface NVDVulnerability {
  id: string;
  description: string;
  published: string;
  severity: string;
  cvssScore: number;
  references: string[];
}

export async function fetchCVEsByProduct(product: string): Promise<NVDVulnerability[]> {
  try {
    const res = await fetch(
      `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(product)}&resultsPerPage=5`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!res.ok) return [];
    const data = await res.json();

    return (data.vulnerabilities || []).slice(0, 5).map((item: any) => {
      const cve = item.cve;
      const metrics = cve.metrics?.cvssMetricV31?.[0]?.cvssData ||
        cve.metrics?.cvssMetricV2?.[0]?.cvssData;

      return {
        id: cve.id,
        description:
          cve.descriptions?.find((d: any) => d.lang === "en")?.value || "No description",
        published: cve.published,
        severity: metrics?.baseSeverity || "UNKNOWN",
        cvssScore: metrics?.baseScore || 0,
        references: (cve.references || []).slice(0, 3).map((r: any) => r.url),
      };
    });
  } catch {
    return [];
  }
}
