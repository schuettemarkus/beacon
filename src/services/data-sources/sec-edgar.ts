export interface SECFiling {
  companyName: string;
  ticker?: string;
  cik?: string;
  filingType: string;
  filingDate: string;
  description: string;
  url: string;
}

export async function fetchSECFilings(company: string): Promise<SECFiling[]> {
  try {
    const query = encodeURIComponent(company);
    const res = await fetch(
      `https://efts.sec.gov/LATEST/search-index?q=${query}&dateRange=custom&startdt=2023-01-01&forms=10-K,8-K&hits.hits.total=10`,
      {
        headers: {
          "User-Agent": "Beacon Sales Intelligence bot@beacon.app",
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      // Try the full-text search API instead
      const altRes = await fetch(
        `https://efts.sec.gov/LATEST/search-index?q=${query}&forms=10-K,8-K`,
        {
          headers: {
            "User-Agent": "Beacon Sales Intelligence bot@beacon.app",
            Accept: "application/json",
          },
        }
      );
      if (!altRes.ok) return [];
      const altData = await altRes.json();
      return parseEdgarResponse(altData);
    }

    const data = await res.json();
    return parseEdgarResponse(data);
  } catch {
    return [];
  }
}

function parseEdgarResponse(data: any): SECFiling[] {
  try {
    const hits = data?.hits?.hits || [];
    return hits.slice(0, 5).map((hit: any) => ({
      companyName: hit._source?.display_names?.[0] || hit._source?.entity_name || "Unknown",
      ticker: hit._source?.tickers?.[0] || undefined,
      cik: hit._source?.entity_id || undefined,
      filingType: hit._source?.form_type || "Unknown",
      filingDate: hit._source?.file_date || "Unknown",
      description: hit._source?.display_names?.[0]
        ? `${hit._source.form_type} filing by ${hit._source.display_names[0]}`
        : "SEC filing",
      url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(hit._source?.entity_name || "")}&type=10-K&dateb=&owner=include&count=5`,
    }));
  } catch {
    return [];
  }
}
