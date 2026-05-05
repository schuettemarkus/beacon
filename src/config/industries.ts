// ============================================================================
// Beacon — Master Industry Configuration
// ============================================================================

export type IndustryId =
  | "cybersecurity"
  | "healthtech"
  | "fintech"
  | "hrtech"
  | "martech"
  | "legaltech";

export interface EmailVariantConfig {
  id: string;
  label: string;
  prompt: string;
  predictedOpenRate: number;
  predictedReplyRate: number;
}

export interface CadenceStep {
  type: "email" | "wait" | "linkedin" | "call";
  label: string;
  days?: number;
  emailVariant?: string;
}

export interface CadenceTemplate {
  name: string;
  description: string;
  steps: CadenceStep[];
}

export interface IndustryConfig {
  id: IndustryId;
  displayName: string;
  description: string;
  icon: string;

  // Claude prompt fragments
  analystRole: string;
  copilotRole: string;
  discoveryRole: string;
  emailWriterRole: string;

  // Domain knowledge
  signalTypes: string[];
  keyRegulations: string[];
  typicalBuyerTitles: string[];

  // Data source config
  newsKeywords: string[];
  useVulnSources: boolean;
  industryDataSources: { name: string; description: string; url: string }[];

  // UI copy
  exampleIcpPrompts: string[];
  icpPlaceholder: string;
  keySignalPlaceholder: string;
  companySearchPlaceholder: string;
  copilotSuggestedPrompts: string[];

  // Email variants
  emailVariants: EmailVariantConfig[];

  // Default cadences
  defaultCadences: CadenceTemplate[];
}

// ============================================================================
// 1. CYBERSECURITY
// ============================================================================

const cybersecurity: IndustryConfig = {
  id: "cybersecurity",
  displayName: "Cybersecurity",
  description: "Sell security solutions using breach intel, CVE data, and compliance deadlines",
  icon: "Shield",

  analystRole: "cybersecurity sales intelligence analyst",
  copilotRole: "cybersecurity sales co-pilot",
  discoveryRole:
    "You are a cybersecurity market research specialist. You identify companies with security gaps, compliance deadlines, recent incidents, and technology vulnerabilities that create buying urgency for security solutions.",
  emailWriterRole:
    "You are an elite cybersecurity sales copywriter who crafts emails referencing specific threats, breaches, and compliance deadlines. You write with technical credibility and avoid fear-mongering.",

  signalTypes: [
    "regulatory",
    "peer_breach",
    "industry_breach",
    "tech_vuln",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
  ],
  keyRegulations: [
    "HIPAA",
    "PCI DSS 4.0",
    "NIS2",
    "DORA",
    "CMMC 2.0",
    "NYDFS Part 500",
    "SEC cyber disclosure",
    "NERC CIP",
  ],
  typicalBuyerTitles: [
    "CISO",
    "VP Security",
    "CTO",
    "VP IT Infrastructure",
    "Chief Privacy Officer",
  ],

  newsKeywords: [
    "cybersecurity",
    "breach",
    "ransomware",
    "vulnerability",
    "security incident",
  ],
  useVulnSources: true,
  industryDataSources: [
    { name: "NIST NVD", description: "National Vulnerability Database for CVE tracking", url: "https://nvd.nist.gov" },
    { name: "CISA KEV", description: "Known Exploited Vulnerabilities catalog", url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog" },
    { name: "HaveIBeenPwned", description: "Breach notification and exposure data", url: "https://haveibeenpwned.com" },
  ],

  exampleIcpPrompts: [
    "Mid-market healthcare companies with legacy on-prem infrastructure",
    "Series B+ fintechs processing payments without SOC 2",
    "Manufacturers facing CMMC 2.0 deadlines in the next 6 months",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., mid-market SaaS companies with SOC 2 gaps)...",
  keySignalPlaceholder: "e.g., recent breach, PCI DSS 4.0 deadline, CVE in their stack",
  companySearchPlaceholder: "Search companies by name, industry, or tech stack...",
  copilotSuggestedPrompts: [
    "Which of my leads have the most urgent compliance deadlines?",
    "Summarize the latest CVEs affecting my pipeline companies",
    "Draft a follow-up referencing the MOVEit breach for financial services leads",
    "What security hiring signals suggest buying intent this quarter?",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.35,
      predictedReplyRate: 0.08,
      prompt: `Write a brief, conversational cold email (80-120 words) from a cybersecurity vendor to this company. Focus on:
- Their growth signals and how security tools accelerate scaling
- A specific, non-threatening observation about their tech stack
- End with a soft CTA (15-min call, not a demo)
Tone: friendly, peer-to-peer, not salesy. Subject line should be curiosity-driven.`,
    },
    {
      id: "threat_anchored",
      label: "Threat Anchored",
      predictedOpenRate: 0.42,
      predictedReplyRate: 0.12,
      prompt: `Write a cold email (80-120 words) that references a SPECIFIC CVE, breach, or threat relevant to this company's tech stack or industry. Be:
- Factual, not fear-mongering
- Reference the specific vulnerability or incident by name
- Show how it applies to THEIR environment specifically
- End with an offer to share a brief analysis
Tone: expert consultant, not ambulance chaser. Subject line should reference the specific threat.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.38,
      predictedReplyRate: 0.09,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a C-suite recipient (CEO, CFO, board). Focus on:
- Business impact, not technical details
- Regulatory/compliance risk (financial penalties, board liability)
- Peer comparison ("companies like yours are...")
- A clear, time-bound ask
Tone: authoritative, strategic, respectful of their time. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "Security Leader Outreach",
      description: "5-touch sequence targeting CISOs and VP Security with threat intelligence and compliance urgency",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection request with security insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Threat Anchored", emailVariant: "threat_anchored" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing email threat data" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Compliance Deadline Campaign",
      description: "Regulation-driven outreach timed around PCI DSS 4.0, NIS2, and CMMC deadlines",
      steps: [
        { type: "email", label: "Threat Anchored", emailVariant: "threat_anchored" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with compliance checklist" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss compliance readiness" },
      ],
    },
    {
      name: "Post-Breach Peer Outreach",
      description: "Reach companies in the same vertical after a major industry breach",
      steps: [
        { type: "email", label: "Threat Anchored", emailVariant: "threat_anchored" },
        { type: "wait", label: "Wait 1 day", days: 1 },
        { type: "call", label: "Urgent call referencing peer breach" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn follow-up with breach analysis link" },
      ],
    },
  ],
};

// ============================================================================
// 2. HEALTHTECH
// ============================================================================

const healthtech: IndustryConfig = {
  id: "healthtech",
  displayName: "HealthTech",
  description: "Sell to health systems and life sciences using FDA, HIPAA, and clinical trial signals",
  icon: "HeartPulse",

  analystRole: "healthtech and life sciences sales intelligence analyst",
  copilotRole: "healthtech sales co-pilot",
  discoveryRole:
    "You are a healthtech market research specialist. You identify health systems, digital health companies, and life sciences organizations with regulatory deadlines, interoperability mandates, clinical trial activity, and technology modernization needs.",
  emailWriterRole:
    "You are a healthtech sales copywriter who understands clinical workflows, HIPAA requirements, and FDA regulatory timelines. You write with clinical credibility and respect for patient-centered missions.",

  signalTypes: [
    "regulatory",
    "fda_action",
    "clinical_trial",
    "hipaa_incident",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
  ],
  keyRegulations: [
    "HIPAA",
    "HITECH",
    "FDA 21 CFR Part 11",
    "42 CFR Part 2",
    "ONC Cures Act",
    "GDPR (clinical data)",
    "340B",
  ],
  typicalBuyerTitles: [
    "CTO",
    "VP Clinical Operations",
    "CMIO",
    "Chief Medical Officer",
    "Director of Health IT",
    "Compliance Director",
  ],

  newsKeywords: [
    "healthtech",
    "FDA approval",
    "clinical trial",
    "HIPAA",
    "EHR",
    "telehealth",
    "digital health",
  ],
  useVulnSources: false,
  industryDataSources: [
    { name: "ClinicalTrials.gov", description: "Federal database of clinical studies", url: "https://clinicaltrials.gov" },
    { name: "FDA MAUDE", description: "Medical device adverse event reports", url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfmaude/search.cfm" },
    { name: "HHS Breach Portal", description: "HIPAA breach reporting database", url: "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf" },
  ],

  exampleIcpPrompts: [
    "Mid-size health systems migrating from legacy EHR platforms",
    "Digital health startups post-Series A building clinical data pipelines",
    "Pharma companies with upcoming FDA submission deadlines",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., regional health systems with interoperability gaps)...",
  keySignalPlaceholder: "e.g., HIPAA breach, FDA 510(k) submission, ONC Cures Act deadline",
  companySearchPlaceholder: "Search health systems, pharma, or digital health companies...",
  copilotSuggestedPrompts: [
    "Which health systems in my pipeline have upcoming ONC Cures Act deadlines?",
    "Show me recent HIPAA breaches affecting organizations similar to my leads",
    "Draft an email for a hospital CTO about interoperability mandates",
    "What FDA actions this quarter affect my life sciences prospects?",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.33,
      predictedReplyRate: 0.07,
      prompt: `Write a brief, conversational cold email (80-120 words) from a healthtech vendor to this organization. Focus on:
- Their growth trajectory, recent funding, or clinical expansion signals
- A specific observation about their digital health infrastructure or EHR environment
- How your solution accelerates clinical outcomes or operational efficiency
- End with a soft CTA (15-min discovery call)
Tone: respectful of clinical mission, peer-to-peer, not pushy. Subject line should be outcome-driven.`,
    },
    {
      id: "compliance_alert",
      label: "Compliance Alert",
      predictedOpenRate: 0.40,
      predictedReplyRate: 0.11,
      prompt: `Write a cold email (80-120 words) anchored to a specific HIPAA, FDA, or ONC compliance deadline relevant to this organization. Be:
- Precise about the regulation and its effective date
- Clear about the operational impact of non-compliance (fines, audit risk, patient safety)
- Practical — reference what peer organizations are doing to prepare
- End with an offer to share a compliance readiness brief
Tone: informed advisor, not fear-mongering. Subject line should reference the specific regulation or deadline.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.36,
      predictedReplyRate: 0.09,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a CMO, CTO, or health system CEO. Focus on:
- Patient outcome improvements and operational ROI, not feature lists
- Regulatory risk framed as board-level governance concern
- Peer health system comparisons ("leading health systems are...")
- A clear, time-bound ask for a strategic conversation
Tone: authoritative, mission-aligned, respectful of clinical leadership demands. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "Clinical Decision Maker",
      description: "5-touch sequence for CMIOs, VPs of Clinical Ops, and Health IT directors",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection with clinical insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing compliance timeline" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Compliance-Led Outreach",
      description: "Regulation-driven sequence timed around HIPAA audits, ONC deadlines, or FDA submissions",
      steps: [
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with compliance checklist" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss compliance readiness" },
      ],
    },
    {
      name: "C-Suite Health System",
      description: "Executive sequence for health system CEOs and CFOs focused on digital transformation ROI",
      steps: [
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "linkedin", label: "LinkedIn thought leadership share" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Executive phone call" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
      ],
    },
  ],
};

// ============================================================================
// 3. FINTECH
// ============================================================================

const fintech: IndustryConfig = {
  id: "fintech",
  displayName: "FinTech",
  description: "Sell to banks, payments companies, and fintechs using regulatory and fraud signals",
  icon: "Landmark",

  analystRole: "fintech and financial services sales intelligence analyst",
  copilotRole: "fintech sales co-pilot",
  discoveryRole:
    "You are a fintech market research specialist. You identify banks, payment processors, and financial services companies facing regulatory pressure, fraud incidents, technology modernization needs, and compliance gaps.",
  emailWriterRole:
    "You are a fintech sales copywriter who understands banking regulations, payment infrastructure, and financial compliance. You write with institutional credibility and quantitative precision.",

  signalTypes: [
    "regulatory",
    "compliance_fine",
    "market_shift",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
    "fraud_incident",
  ],
  keyRegulations: [
    "SOX",
    "PCI DSS",
    "DORA",
    "AML/BSA",
    "FFIEC CAT",
    "GLBA",
    "SEC regulations",
    "NYDFS Part 500",
    "MiCA",
  ],
  typicalBuyerTitles: [
    "CTO",
    "CISO",
    "Chief Risk Officer",
    "VP Compliance",
    "Head of Payments",
    "VP Engineering",
  ],

  newsKeywords: [
    "fintech",
    "banking regulation",
    "payments",
    "AML",
    "compliance fine",
    "financial crime",
    "open banking",
  ],
  useVulnSources: false,
  industryDataSources: [
    { name: "FDIC Enforcement", description: "FDIC enforcement actions and orders", url: "https://www.fdic.gov/bank-examinations/enforcement-actions-and-orders" },
    { name: "SEC EDGAR", description: "SEC filings and regulatory disclosures", url: "https://www.sec.gov/cgi-bin/browse-edgar" },
    { name: "FinCEN", description: "Financial crimes enforcement network advisories", url: "https://www.fincen.gov" },
  ],

  exampleIcpPrompts: [
    "Community banks under $10B assets modernizing core banking systems",
    "Series B+ payment fintechs expanding into cross-border transactions",
    "Regional banks that received FFIEC examination findings in the past year",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., mid-tier banks with legacy core systems)...",
  keySignalPlaceholder: "e.g., consent order, AML fine, DORA deadline, core banking RFP",
  companySearchPlaceholder: "Search banks, fintechs, or payment companies...",
  copilotSuggestedPrompts: [
    "Which banks in my pipeline have upcoming DORA compliance deadlines?",
    "Show me recent enforcement actions against organizations similar to my leads",
    "Draft a follow-up email for a Chief Risk Officer about AML modernization",
    "What fraud trends this quarter create urgency for my payment prospects?",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.34,
      predictedReplyRate: 0.07,
      prompt: `Write a brief, conversational cold email (80-120 words) from a fintech vendor to this financial institution or company. Focus on:
- Their growth signals: new product launches, geographic expansion, or recent funding
- A specific observation about their payment infrastructure or technology stack
- How modern tooling accelerates their roadmap without adding compliance risk
- End with a soft CTA (15-min call to exchange ideas)
Tone: peer-to-peer, institutionally credible, not salesy. Subject line should be outcome-driven.`,
    },
    {
      id: "compliance_alert",
      label: "Compliance Alert",
      predictedOpenRate: 0.41,
      predictedReplyRate: 0.11,
      prompt: `Write a cold email (80-120 words) anchored to a specific regulatory deadline, enforcement action, or compliance mandate relevant to this company. Be:
- Precise about the regulation (DORA, AML/BSA, PCI DSS) and its effective date or enforcement trend
- Quantitative about the financial impact (fines, remediation costs, examiner scrutiny)
- Practical — reference what peer institutions are doing to prepare
- End with an offer to share a regulatory readiness brief
Tone: informed risk advisor, not alarmist. Subject line should reference the specific regulatory event.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.37,
      predictedReplyRate: 0.09,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a CEO, CFO, or Chief Risk Officer at a financial institution. Focus on:
- Strategic business impact: revenue at risk, regulatory capital implications, competitive positioning
- Board-level governance concerns (examiner findings, consent orders, peer comparisons)
- Industry benchmarks ("top-quartile banks are...")
- A clear, time-bound ask for a strategic conversation
Tone: authoritative, quantitatively rigorous, respectful of fiduciary responsibilities. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "Payment Decision Maker",
      description: "5-touch sequence for Heads of Payments, VPs of Engineering, and CTOs at payment companies",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection with payments insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing regulatory timeline" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Compliance-Led Outreach",
      description: "Regulation-driven sequence timed around DORA, AML exams, or PCI DSS deadlines",
      steps: [
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with compliance checklist" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss examination preparedness" },
      ],
    },
    {
      name: "Executive Banking Brief",
      description: "C-suite sequence for bank CEOs and CFOs focused on modernization ROI and examiner readiness",
      steps: [
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "linkedin", label: "LinkedIn share — industry research or benchmark" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Executive phone call" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Compliance Alert", emailVariant: "compliance_alert" },
      ],
    },
  ],
};

// ============================================================================
// 4. HRTECH
// ============================================================================

const hrtech: IndustryConfig = {
  id: "hrtech",
  displayName: "HRTech",
  description: "Sell workforce solutions using labor law changes, benefits cycles, and hiring signals",
  icon: "Users",

  analystRole: "HR technology and workforce solutions sales intelligence analyst",
  copilotRole: "HR technology sales co-pilot",
  discoveryRole:
    "You are an HR technology market research specialist. You identify companies with workforce challenges, labor law compliance gaps, benefits administration needs, and talent acquisition bottlenecks that create buying urgency for HR solutions.",
  emailWriterRole:
    "You are an HR technology sales copywriter who understands people operations, labor law, and workforce strategy. You write with empathy for the human side of business and quantitative rigor around workforce ROI.",

  signalTypes: [
    "regulatory",
    "labor_law_change",
    "workforce_trend",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
  ],
  keyRegulations: [
    "ACA",
    "FMLA",
    "EEOC",
    "FLSA",
    "GDPR (employee data)",
    "CCPA (employee data)",
    "WARN Act",
    "I-9/E-Verify",
  ],
  typicalBuyerTitles: [
    "CHRO",
    "VP People Operations",
    "Head of Talent Acquisition",
    "VP Total Rewards",
    "HR Director",
  ],

  newsKeywords: [
    "HR technology",
    "workforce",
    "payroll",
    "employee benefits",
    "talent acquisition",
    "labor law",
    "workplace",
  ],
  useVulnSources: false,
  industryDataSources: [
    { name: "BLS", description: "Bureau of Labor Statistics employment data and trends", url: "https://www.bls.gov" },
    { name: "DOL Enforcement", description: "Department of Labor enforcement actions and wage/hour data", url: "https://www.dol.gov/agencies/whd/data" },
    { name: "EEOC Press", description: "EEOC litigation and settlement announcements", url: "https://www.eeoc.gov/newsroom" },
  ],

  exampleIcpPrompts: [
    "Companies with 500-5,000 employees still using spreadsheets for benefits enrollment",
    "High-growth startups that tripled headcount and need scalable people ops",
    "Multi-state employers facing patchwork labor law compliance challenges",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., mid-market companies with manual HR processes)...",
  keySignalPlaceholder: "e.g., mass hiring, new state labor law, open enrollment season, layoff announcement",
  companySearchPlaceholder: "Search companies by name, headcount, or industry...",
  copilotSuggestedPrompts: [
    "Which companies in my pipeline are hiring aggressively right now?",
    "What new state labor laws affect my multi-state employer leads?",
    "Draft a benefits-season email for a VP People Operations",
    "Show me workforce trend signals that create urgency for my prospects",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.32,
      predictedReplyRate: 0.07,
      prompt: `Write a brief, conversational cold email (80-120 words) from an HR technology vendor to this company. Focus on:
- Their growth signals: headcount growth, new office openings, or recent funding
- A specific observation about their people operations challenges at their current scale
- How modern HR tooling removes friction so their team can focus on culture and retention
- End with a soft CTA (15-min call to share what peers are doing)
Tone: empathetic, people-first, not transactional. Subject line should be outcome-driven.`,
    },
    {
      id: "workforce_insight",
      label: "Workforce Insight",
      predictedOpenRate: 0.38,
      predictedReplyRate: 0.10,
      prompt: `Write a cold email (80-120 words) anchored to a specific workforce trend, labor law change, or compliance event relevant to this company. Be:
- Precise about the regulation or trend (new state pay transparency law, FLSA overtime rule, ACA reporting deadline)
- Practical about the operational impact on their HR team and employee experience
- Reference what peer companies of similar size are doing to adapt
- End with an offer to share a workforce readiness brief or benchmarking data
Tone: informed people strategist, not compliance scaremonger. Subject line should reference the specific trend or regulation.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.35,
      predictedReplyRate: 0.08,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a CHRO or CEO. Focus on:
- Workforce ROI: retention savings, time-to-hire improvements, compliance cost reduction
- Strategic talent concerns framed as board-level priorities (employer brand, DE&I metrics, workforce planning)
- Peer comparisons ("companies your size typically see...")
- A clear, time-bound ask for a strategic conversation
Tone: authoritative, people-centric, respectful of executive priorities. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "HR Leader Outreach",
      description: "5-touch sequence for CHROs, VPs of People Ops, and HR Directors",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection with workforce insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Workforce Insight", emailVariant: "workforce_insight" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing labor law update" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Benefits Season Campaign",
      description: "Time-sensitive sequence for benefits administrators during open enrollment planning (Q3-Q4)",
      steps: [
        { type: "email", label: "Workforce Insight", emailVariant: "workforce_insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with benefits benchmarking data" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss open enrollment readiness" },
      ],
    },
    {
      name: "Executive People Strategy",
      description: "C-suite sequence for CEOs and CHROs focused on workforce planning and talent retention ROI",
      steps: [
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "linkedin", label: "LinkedIn share — workforce trends report" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Executive phone call" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Workforce Insight", emailVariant: "workforce_insight" },
      ],
    },
  ],
};

// ============================================================================
// 5. MARTECH
// ============================================================================

const martech: IndustryConfig = {
  id: "martech",
  displayName: "MarTech",
  description: "Sell marketing tools using privacy changes, platform shifts, and growth signals",
  icon: "Megaphone",

  analystRole: "marketing technology and advertising sales intelligence analyst",
  copilotRole: "marketing technology sales co-pilot",
  discoveryRole:
    "You are a martech market research specialist. You identify companies with marketing technology gaps, privacy compliance challenges, attribution blind spots, and data strategy needs that create buying urgency for marketing solutions.",
  emailWriterRole:
    "You are a martech sales copywriter who understands the marketing stack, privacy regulations, and performance marketing metrics. You write with data-driven credibility and respect for the revenue pressure CMOs face.",

  signalTypes: [
    "regulatory",
    "privacy_change",
    "market_shift",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
    "platform_update",
  ],
  keyRegulations: [
    "GDPR",
    "CCPA/CPRA",
    "CAN-SPAM",
    "TCPA",
    "ePrivacy Directive",
    "Digital Markets Act",
    "Children's Online Privacy (COPPA)",
  ],
  typicalBuyerTitles: [
    "CMO",
    "VP Marketing",
    "Head of Growth",
    "VP Demand Generation",
    "Director of Marketing Ops",
  ],

  newsKeywords: [
    "martech",
    "marketing automation",
    "advertising",
    "CDP",
    "first-party data",
    "privacy",
    "attribution",
    "CRM",
  ],
  useVulnSources: false,
  industryDataSources: [
    { name: "IAB", description: "Interactive Advertising Bureau standards and privacy frameworks", url: "https://www.iab.com" },
    { name: "GDPR Enforcement Tracker", description: "Database of GDPR fines and enforcement decisions", url: "https://www.enforcementtracker.com" },
    { name: "BuiltWith", description: "Technology profiling for marketing stack detection", url: "https://builtwith.com" },
  ],

  exampleIcpPrompts: [
    "D2C brands spending $1M+/month on paid media with no CDP in place",
    "B2B SaaS companies with 50+ marketing tools and no unified attribution",
    "E-commerce companies in the EU facing GDPR consent management gaps",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., D2C brands with fragmented marketing stacks)...",
  keySignalPlaceholder: "e.g., cookie deprecation impact, GDPR fine, new ad platform policy, CDP evaluation",
  companySearchPlaceholder: "Search companies by name, marketing stack, or ad spend...",
  copilotSuggestedPrompts: [
    "Which leads are most affected by recent privacy regulation changes?",
    "Show me companies in my pipeline that are evaluating CDP solutions",
    "Draft an email for a CMO about first-party data strategy",
    "What platform changes this quarter create urgency for my prospects?",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.33,
      predictedReplyRate: 0.07,
      prompt: `Write a brief, conversational cold email (80-120 words) from a martech vendor to this company. Focus on:
- Their growth signals: ad spend increases, new channel launches, or recent funding
- A specific observation about their current marketing stack or data strategy
- How modern martech removes friction between data, personalization, and revenue
- End with a soft CTA (15-min call to share what similar brands are doing)
Tone: data-informed, growth-minded, not pushy. Subject line should be performance-driven.`,
    },
    {
      id: "privacy_impact",
      label: "Privacy Impact",
      predictedOpenRate: 0.39,
      predictedReplyRate: 0.10,
      prompt: `Write a cold email (80-120 words) anchored to a specific privacy regulation, platform policy change, or data deprecation event relevant to this company. Be:
- Precise about the change (GDPR enforcement trend, CCPA amendment, cookie deprecation timeline, Apple ATT impact)
- Quantitative about the business impact (lost attribution, consent rates, CPM increases)
- Practical — reference how peer brands are adapting their data strategy
- End with an offer to share a privacy-readiness audit or benchmarking data
Tone: strategic data advisor, not privacy scaremonger. Subject line should reference the specific change or regulation.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.36,
      predictedReplyRate: 0.08,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a CMO or CEO. Focus on:
- Revenue impact: CAC efficiency, attribution accuracy, customer lifetime value
- Strategic concerns framed as board-level priorities (marketing ROI accountability, first-party data as competitive moat)
- Peer comparisons ("leading brands in your category are...")
- A clear, time-bound ask for a strategic conversation
Tone: authoritative, revenue-focused, respectful of P&L accountability. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "Marketing Leader Outreach",
      description: "5-touch sequence for CMOs, VPs of Marketing, and Heads of Growth",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection with marketing insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Privacy Impact", emailVariant: "privacy_impact" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing data strategy trends" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Privacy-Led Campaign",
      description: "Regulation-driven sequence timed around GDPR enforcement waves, CCPA amendments, or platform changes",
      steps: [
        { type: "email", label: "Privacy Impact", emailVariant: "privacy_impact" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with privacy compliance checklist" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss data strategy readiness" },
      ],
    },
    {
      name: "CMO Executive Brief",
      description: "C-suite sequence for CMOs and CEOs focused on marketing ROI and competitive positioning",
      steps: [
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "linkedin", label: "LinkedIn share — martech benchmark report" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Executive phone call" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Privacy Impact", emailVariant: "privacy_impact" },
      ],
    },
  ],
};

// ============================================================================
// 6. LEGALTECH
// ============================================================================

const legaltech: IndustryConfig = {
  id: "legaltech",
  displayName: "LegalTech",
  description: "Sell legal solutions using court rulings, regulatory changes, and law firm growth signals",
  icon: "Scale",

  analystRole: "legal technology sales intelligence analyst",
  copilotRole: "legal technology sales co-pilot",
  discoveryRole:
    "You are a legaltech market research specialist. You identify law firms, corporate legal departments, and legal services companies with technology gaps, e-discovery needs, contract management challenges, and regulatory compliance mandates.",
  emailWriterRole:
    "You are a legaltech sales copywriter who understands legal workflows, billable hour economics, and regulatory complexity. You write with professional credibility and respect for the risk-averse nature of legal buyers.",

  signalTypes: [
    "regulatory",
    "court_ruling",
    "law_firm_merger",
    "hiring",
    "funding",
    "ma",
    "compliance_audit",
    "news",
    "contract_award",
  ],
  keyRegulations: [
    "GDPR",
    "ABA Model Rules",
    "CCPA",
    "e-Discovery rules (FRCP)",
    "Legal AI ethics guidelines",
    "ITAR",
    "SOX (for corporate legal)",
  ],
  typicalBuyerTitles: [
    "General Counsel",
    "CLO",
    "Director of Legal Operations",
    "Managing Partner",
    "Head of Litigation Support",
  ],

  newsKeywords: [
    "legal technology",
    "law firm",
    "e-discovery",
    "contract management",
    "legal AI",
    "litigation",
    "legal operations",
  ],
  useVulnSources: false,
  industryDataSources: [
    { name: "PACER", description: "Public Access to Court Electronic Records", url: "https://pacer.uscourts.gov" },
    { name: "Am Law 200", description: "Rankings and financial data for top law firms", url: "https://www.law.com/americanlawyer/rankings/the-2024-am-law-200/" },
    { name: "ABA TechReport", description: "American Bar Association legal technology survey", url: "https://www.americanbar.org/groups/law_practice/resources/tech-report/" },
  ],

  exampleIcpPrompts: [
    "Am Law 200 firms with over 500 attorneys and no AI-powered contract review",
    "Corporate legal departments at Fortune 500 companies with manual e-discovery processes",
    "Mid-size firms expanding litigation practice groups and hiring associates",
  ],
  icpPlaceholder: "Describe your ideal customer (e.g., Am Law 100 firms with manual document review)...",
  keySignalPlaceholder: "e.g., major court ruling, firm merger, new e-discovery obligation, AI ethics opinion",
  companySearchPlaceholder: "Search law firms, corporate legal departments, or legal services companies...",
  copilotSuggestedPrompts: [
    "Which firms in my pipeline are most affected by recent court rulings on AI use?",
    "Show me law firm mergers that signal technology consolidation opportunities",
    "Draft an email for a General Counsel about e-discovery cost reduction",
    "What regulatory changes this quarter affect my corporate legal prospects?",
  ],

  emailVariants: [
    {
      id: "cold_intro",
      label: "Cold Intro",
      predictedOpenRate: 0.31,
      predictedReplyRate: 0.06,
      prompt: `Write a brief, conversational cold email (80-120 words) from a legaltech vendor to this firm or legal department. Focus on:
- Their growth signals: new practice groups, lateral hires, geographic expansion, or recent matters won
- A specific observation about their legal operations workflow or technology gap
- How modern legal technology improves matter economics and attorney productivity without disrupting established workflows
- End with a soft CTA (15-min call to share peer firm benchmarks)
Tone: professionally credible, respectful of legal conservatism, not pushy. Subject line should be outcome-driven.`,
    },
    {
      id: "regulatory_alert",
      label: "Regulatory Alert",
      predictedOpenRate: 0.38,
      predictedReplyRate: 0.10,
      prompt: `Write a cold email (80-120 words) anchored to a specific court ruling, bar association opinion, regulatory change, or e-discovery obligation relevant to this firm or legal department. Be:
- Precise about the ruling or regulation and its practical implications for their practice areas
- Clear about the operational impact (new disclosure requirements, AI use limitations, e-discovery costs)
- Reference how peer firms or legal departments are adapting their technology and workflows
- End with an offer to share an analysis or implementation guide
Tone: informed legal strategist, not ambulance chaser. Subject line should reference the specific ruling or regulatory change.`,
    },
    {
      id: "executive_brief",
      label: "Executive Brief",
      predictedOpenRate: 0.35,
      predictedReplyRate: 0.08,
      prompt: `Write a concise executive-level email (80-120 words) suitable for a Managing Partner, General Counsel, or CLO. Focus on:
- Economic impact: realization rates, matter profitability, cost-per-review metrics
- Strategic concerns framed as partnership/board-level priorities (competitive positioning, talent retention, client demands for efficiency)
- Peer comparisons ("Am Law 100 firms are..." or "Fortune 500 legal departments are...")
- A clear, time-bound ask for a strategic conversation
Tone: authoritative, economically rigorous, respectful of partnership dynamics. Subject line should be boardroom-appropriate.`,
    },
  ],

  defaultCadences: [
    {
      name: "General Counsel Outreach",
      description: "5-touch sequence for General Counsels, CLOs, and Directors of Legal Operations",
      steps: [
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "linkedin", label: "LinkedIn connection with legal ops insight" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "email", label: "Regulatory Alert", emailVariant: "regulatory_alert" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "call", label: "Phone call referencing recent ruling or compliance change" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
      ],
    },
    {
      name: "Litigation Support Campaign",
      description: "E-discovery and litigation-focused sequence timed around major case filings or rule changes",
      steps: [
        { type: "email", label: "Regulatory Alert", emailVariant: "regulatory_alert" },
        { type: "wait", label: "Wait 2 days", days: 2 },
        { type: "linkedin", label: "LinkedIn DM with e-discovery cost analysis" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Call to discuss litigation technology needs" },
      ],
    },
    {
      name: "Managing Partner Brief",
      description: "C-suite sequence for Managing Partners and firm leadership focused on profitability and competitive positioning",
      steps: [
        { type: "email", label: "Executive Brief", emailVariant: "executive_brief" },
        { type: "wait", label: "Wait 4 days", days: 4 },
        { type: "linkedin", label: "LinkedIn share — legal industry benchmark report" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Cold Intro", emailVariant: "cold_intro" },
        { type: "wait", label: "Wait 5 days", days: 5 },
        { type: "call", label: "Executive phone call" },
        { type: "wait", label: "Wait 3 days", days: 3 },
        { type: "email", label: "Regulatory Alert", emailVariant: "regulatory_alert" },
      ],
    },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const INDUSTRIES: Record<IndustryId, IndustryConfig> = {
  cybersecurity,
  healthtech,
  fintech,
  hrtech,
  martech,
  legaltech,
};

export const INDUSTRY_IDS = Object.keys(INDUSTRIES) as IndustryId[];

export function getIndustryConfig(id: string): IndustryConfig {
  const config = INDUSTRIES[id as IndustryId];
  if (!config) {
    throw new Error(`Unknown industry: "${id}". Valid industries: ${INDUSTRY_IDS.join(", ")}`);
  }
  return config;
}
