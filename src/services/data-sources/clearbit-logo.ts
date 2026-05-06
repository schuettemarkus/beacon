/**
 * Company logo URL generation.
 * Uses Google's favicon service as primary (reliable, free, no key needed).
 * Falls back to DuckDuckGo's icon service.
 */
export function getCompanyLogoUrl(domain: string): string {
  // Google's favicon service — returns high-quality favicons at any size
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function getCompanyLogoUrlFallback(domain: string): string {
  // DuckDuckGo icon service as backup
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}
