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
  signals: {
    type: string;
    severity: string;
    source: string;
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
}
