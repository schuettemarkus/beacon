export interface CompanyResearchPayload {
  company: string;
  domain: string;
  industry: string;
  hq: string;
  employees: number;
  revenueBand: string;
  techStack: string[];
  funding: string;
  fitScore: number;
  logoUrl?: string;
  signals: {
    type: string;
    severity: string;
    source: string;
    sourceUrl?: string;
    title: string;
    body: string;
  }[];
  contacts: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    linkedin?: string;
    decisionMakerScore: number;
  }[];
  regulatoryProfile?: {
    regulation: string;
    status: string;
    deadline?: string;
    relevance: string;
  }[];
  recentNews?: {
    title: string;
    source: string;
    url: string;
    date: string;
  }[];
  peerComparison?: {
    company: string;
    industry: string;
    employees: number;
    fitScore: number;
  }[];
}
