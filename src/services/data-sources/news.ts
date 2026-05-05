export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source?: string;
}

export async function fetchIndustryNews(company: string, keywords?: string[]): Promise<NewsItem[]> {
  try {
    const searchTerms = keywords && keywords.length > 0
      ? `${company} ${keywords.join(" OR ")}`
      : company;
    const query = encodeURIComponent(searchTerms);
    const res = await fetch(
      `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`
    );

    if (!res.ok) return [];
    const text = await res.text();

    // Parse RSS XML
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(text)) !== null && items.length < 8) {
      const itemXml = match[1];
      const title = itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1") || "";
      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const source = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/, "$1") || undefined;

      if (title) {
        items.push({ title: decodeHTMLEntities(title), link, pubDate, source });
      }
    }

    return items;
  } catch {
    return [];
  }
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
