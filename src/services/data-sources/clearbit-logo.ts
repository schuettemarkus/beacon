export function getCompanyLogoUrl(domain: string): string {
  // Clearbit Logo API is free and requires no key
  return `https://logo.clearbit.com/${domain}`;
}
