// Territory Playbook types

export interface StateAccount {
  company: string;
  domain: string;
  rank: number;
  budgetIndicators: string;
  growthTrend: "growing" | "stable" | "contracting";
  leadershipChanges: string[];
  recentCyberEvents: string[];
  marketPotential: string;
  justification: string;
}

export interface StatePlaybook {
  state: string;
  accounts: StateAccount[];
}

export interface OverallRanking {
  company: string;
  domain: string;
  state: string;
  overallRank: number;
  justification: string;
}

export interface TerritoryPlaybook {
  planId: string;
  states: StatePlaybook[];
  overallRanking: OverallRanking[];
}

// Deep Account Analysis types

export interface DeepAccountAnalysis {
  annualReportTalkingPoints: string[];
  cyberBreaches: { date: string; description: string; impact: string }[];
  itInitiatives: { initiative: string; status: string; relevance: string }[];
  businessExpansions: string[];
  acquisitions: { target: string; date: string; relevance: string }[];
  vendorIntel: {
    itVendors: string[];
    cyberVendors: string[];
    detectionSource: string;
  };
  leadershipChanges: {
    name: string;
    fromRole: string;
    toRole: string;
    date: string;
    significance: string;
  }[];
  winStrategy: {
    approach: string;
    keyMessages: string[];
    timingConsiderations: string;
    riskFactors: string[];
  };
}

// Influence Map types

export interface StakeholderEntry {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  relevance: string;
  engagementStrategy: string;
  confidence: number;
}

export interface InfluenceMap {
  rings: {
    economicBuyers: StakeholderEntry[];
    champions: StakeholderEntry[];
    influencers: StakeholderEntry[];
    partners: StakeholderEntry[];
  };
  relationships: {
    fromName: string;
    toName: string;
    type: "reports_to" | "prior_company" | "university" | "board";
    detail: string;
  }[];
}

// Win Plan types

export interface WinPlan {
  executiveSummary: string;
  accountObjective: string;
  revenueTarget: string;
  timeline: { phase: string; duration: string; actions: string[] }[];
  competitiveStrategy: string;
  valueProposition: string;
  stakeholderEngagementPlan: {
    name: string;
    action: string;
    timing: string;
  }[];
  risksMitigations: { risk: string; mitigation: string }[];
  successMetrics: string[];
  nextSteps: { action: string; dueDate: string }[];
}
