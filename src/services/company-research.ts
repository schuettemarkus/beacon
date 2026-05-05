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

export async function researchCompany(
  query: string
): Promise<CompanyResearchPayload> {
  // Mock implementation — will be replaced with real research service
  return {
    company: query,
    domain: `${query.toLowerCase().replace(/\s+/g, "")}.com`,
    industry: "SaaS",
    hq: "San Francisco, CA",
    employees: 150,
    revenueBand: "$10M-$50M",
    techStack: ["React", "Node.js", "AWS", "PostgreSQL"],
    funding: "Series B — $25M",
    fitScore: 82,
    signals: [
      {
        type: "hiring",
        severity: "high",
        source: "LinkedIn",
        title: "Hiring VP of Engineering",
        body: `${query} posted a VP of Engineering role, indicating growth investment.`,
      },
      {
        type: "techChange",
        severity: "medium",
        source: "BuiltWith",
        title: "Added Segment to tech stack",
        body: "Recently adopted Segment, suggesting data infrastructure investment.",
      },
    ],
    contacts: [
      {
        name: "Jane Smith",
        title: "CTO",
        email: `jane@${query.toLowerCase().replace(/\s+/g, "")}.com`,
        linkedin: "https://linkedin.com/in/janesmith",
        decisionMakerScore: 92,
      },
      {
        name: "John Doe",
        title: "VP Engineering",
        email: `john@${query.toLowerCase().replace(/\s+/g, "")}.com`,
        decisionMakerScore: 78,
      },
    ],
  };
}
