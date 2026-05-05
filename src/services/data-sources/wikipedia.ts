export interface WikiCompanyInfo {
  name: string;
  description?: string;
  industry?: string;
  hq?: string;
  employees?: number;
  founded?: string;
  revenue?: string;
  website?: string;
}

export async function fetchWikipediaInfo(company: string): Promise<WikiCompanyInfo | null> {
  try {
    // Search for the company on Wikipedia
    const searchRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(company)}&format=json&origin=*`
    );
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    const firstResult = searchData?.query?.search?.[0];
    if (!firstResult) return null;

    // Get the page extract
    const pageRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops&exintro=true&explaintext=true&pageids=${firstResult.pageid}&format=json&origin=*`
    );
    if (!pageRes.ok) return null;
    const pageData = await pageRes.json();

    const page = Object.values(pageData?.query?.pages || {})[0] as any;
    if (!page || page.missing !== undefined) return null;

    const extract = page.extract || "";

    // Parse basic info from the extract
    const info: WikiCompanyInfo = {
      name: page.title || company,
      description: extract.slice(0, 500),
    };

    // Try to extract structured data from the text
    const hqMatch = extract.match(/headquartered in ([^.]+)/i) ||
      extract.match(/based in ([^.]+)/i);
    if (hqMatch) info.hq = hqMatch[1].trim();

    const employeeMatch = extract.match(/([\d,]+)\s*employees/i);
    if (employeeMatch) info.employees = parseInt(employeeMatch[1].replace(/,/g, ""));

    const foundedMatch = extract.match(/founded (?:in )?(\d{4})/i);
    if (foundedMatch) info.founded = foundedMatch[1];

    return info;
  } catch {
    return null;
  }
}
