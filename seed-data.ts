/**
 * Beacon — Seed Data
 *
 * DATA POLICY (read this before shipping):
 * - Companies in this file are FICTIONAL. Their profiles (industry, size, HQ,
 *   tech stack, funding band) are designed to mirror real mid-market and
 *   enterprise cybersecurity buyers so the demo feels alive.
 * - Contacts are PLACEHOLDER. Production-grade enrichment (Apollo, Hunter,
 *   ZoomInfo, Clearbit, Cognism) must replace these before any outreach is sent.
 * - Signals reference REAL public cybersecurity events: Change Healthcare
 *   (Feb 2024), MOVEit/Cl0p (May 2023), CDK Global (Jun 2024), Snowflake/UNC5537
 *   (May 2024), ICBC ransomware (Nov 2023), Ascension (May 2024), Volt Typhoon
 *   (PRC, critical infra), Salt Typhoon (PRC, telcos, late 2024), Scattered
 *   Spider (UNC3944), ALPHV/BlackCat, LockBit, Cl0p, Black Basta, Storm-0501.
 * - Regulations referenced are REAL: HIPAA Security Rule NPRM (Dec 2024,
 *   finalization expected 2026), NIS2 (effective Oct 17 2024), DORA (effective
 *   Jan 17 2025), PCI DSS 4.0 (mandatory Apr 1 2025), CMMC 2.0 (phased rollout
 *   2025–2028), NYDFS Part 500 (amended Nov 2023), SEC cyber disclosure rule
 *   (effective Dec 2023), HHS 405(d) HICP, NERC CIP, TSA pipeline directives,
 *   FFIEC CAT, FERPA, ITAR.
 * - CVEs are REAL: CVE-2023-4966 (Citrix Bleed), CVE-2023-34362 (MOVEit),
 *   CVE-2024-21887 (Ivanti Connect Secure), CVE-2024-3400 (PAN-OS GlobalProtect),
 *   CVE-2024-1709 (ConnectWise ScreenConnect), CVE-2024-30040 (Windows MSHTML),
 *   CVE-2021-44228 (Log4Shell).
 * - Some 2025–2026 breach references are plausible-fictional industry events.
 *   AEs should verify any cited event before referencing in real outreach.
 */

export type LeadStatus =
  | 'today'
  | 'this_week'
  | 'snoozed'
  | 'closed_won'
  | 'archived';

export type Lead = {
  id: string;
  company: string;
  domain: string;
  industry: string;
  hq: string;
  employees: number;
  revenueBand: string;
  techStack: string[];
  funding: string;
  fitScore: number; // 0–100
  status: LeadStatus;
  createdAt: string; // ISO
  snoozedUntil?: string;
};

export type Contact = {
  id: string;
  leadId: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  linkedin?: string;
  decisionMakerScore: number; // 0–100
};

export type Signal = {
  id: string;
  leadId: string;
  type:
    | 'regulatory'
    | 'peer_breach'
    | 'industry_breach'
    | 'tech_vuln'
    | 'hiring'
    | 'funding'
    | 'ma'
    | 'insurance'
    | 'compliance_audit'
    | 'supply_chain'
    | 'exec_change'
    | 'news';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  title: string;
  body: string;
  capturedAt: string; // ISO
};

export type EmailVariant = 'cold_intro' | 'threat_anchored' | 'executive_brief';

export type Email = {
  id: string;
  leadId: string;
  contactId: string;
  variant: EmailVariant;
  subject: string;
  preview: string;
  body: string;
  predictedOpenRate: number; // 0–1
  predictedReplyRate: number; // 0–1
  sentAt?: string;
};

export const leads: Lead[] = [
  // === HEALTHCARE (1–8) ===
  { id: 'lead_1', company: 'Meridian Health Partners', domain: 'meridianhealthpartners.org', industry: 'Healthcare — Provider', hq: 'Cleveland, OH', employees: 4500, revenueBand: '$500M–$1B', techStack: ['Epic', 'Microsoft 365', 'Citrix NetScaler', 'VMware', 'Palo Alto', 'CrowdStrike Falcon'], funding: 'Non-profit health system', fitScore: 88, status: 'today', createdAt: '2026-05-04T08:12:00Z' },
  { id: 'lead_2', company: 'Cardinal Pediatric Network', domain: 'cardinalpediatric.com', industry: 'Healthcare — Provider', hq: 'Charlotte, NC', employees: 1200, revenueBand: '$100M–$250M', techStack: ['athenahealth', 'AWS', 'Okta', 'Microsoft 365', 'SonicWall'], funding: 'PE-backed (Welsh Carson, 2022)', fitScore: 82, status: 'today', createdAt: '2026-05-04T07:48:00Z' },
  { id: 'lead_3', company: 'Northwind Diagnostics', domain: 'northwinddx.com', industry: 'Healthcare — Lab & Imaging', hq: 'Minneapolis, MN', employees: 800, revenueBand: '$100M–$250M', techStack: ['Cerner', 'Azure', 'Mimecast', 'SonicWall'], funding: 'Privately held', fitScore: 76, status: 'this_week', createdAt: '2026-05-01T14:30:00Z' },
  { id: 'lead_4', company: 'PrismCare Health Plans', domain: 'prismcare.com', industry: 'Healthcare — Payer', hq: 'Hartford, CT', employees: 2200, revenueBand: '$1B+', techStack: ['Salesforce Health Cloud', 'AWS', 'Okta', 'Splunk', 'Zscaler'], funding: 'Public (NYSE)', fitScore: 84, status: 'today', createdAt: '2026-05-04T06:05:00Z' },
  { id: 'lead_5', company: 'AltaMed Devices', domain: 'altameddevices.com', industry: 'Healthcare — Medical Device', hq: 'Irvine, CA', employees: 600, revenueBand: '$100M–$250M', techStack: ['SAP', 'PTC Windchill', 'Azure', 'Sophos', 'Active Directory'], funding: 'Private equity (Thoma Bravo, 2023)', fitScore: 79, status: 'this_week', createdAt: '2026-04-30T11:20:00Z' },
  { id: 'lead_6', company: 'Helix Telemedicine', domain: 'helixcare.io', industry: 'Healthcare — Telehealth SaaS', hq: 'Austin, TX', employees: 350, revenueBand: '$25M–$100M', techStack: ['AWS', 'Twilio', 'Auth0', 'Datadog', 'Vanta'], funding: 'Series C ($120M, 2024)', fitScore: 72, status: 'this_week', createdAt: '2026-05-02T09:14:00Z' },
  { id: 'lead_7', company: 'Stoneridge Behavioral Health', domain: 'stoneridgebh.com', industry: 'Healthcare — Behavioral Health', hq: 'Denver, CO', employees: 1100, revenueBand: '$100M–$250M', techStack: ['NextGen', 'Microsoft 365', 'Cisco Meraki', 'Mimecast'], funding: 'PE-backed', fitScore: 71, status: 'snoozed', createdAt: '2026-04-22T10:00:00Z', snoozedUntil: '2026-05-12T09:00:00Z' },
  { id: 'lead_8', company: 'Emberline Senior Living', domain: 'emberlineliving.com', industry: 'Healthcare — Long-Term Care', hq: 'Tampa, FL', employees: 3200, revenueBand: '$250M–$500M', techStack: ['PointClickCare', 'Microsoft 365', 'Citrix', 'Sophos'], funding: 'PE-backed (KKR, 2021)', fitScore: 68, status: 'this_week', createdAt: '2026-05-01T16:45:00Z' },

  // === FINTECH (9–16) ===
  { id: 'lead_9', company: 'Volterra Financial', domain: 'volterra.com', industry: 'Fintech — Neobank', hq: 'New York, NY', employees: 800, revenueBand: '$100M–$250M', techStack: ['AWS', 'Snowflake', 'Okta', 'Wiz', 'CrowdStrike', 'Plaid'], funding: 'Series D ($340M, 2024)', fitScore: 91, status: 'today', createdAt: '2026-05-04T05:30:00Z' },
  { id: 'lead_10', company: 'Brightline Capital', domain: 'brightlinecap.com', industry: 'Fintech — Consumer Lending', hq: 'San Francisco, CA', employees: 240, revenueBand: '$25M–$100M', techStack: ['GCP', 'Snowflake', 'Okta', 'CrowdStrike'], funding: 'Series C ($95M, 2023)', fitScore: 85, status: 'today', createdAt: '2026-05-04T07:00:00Z' },
  { id: 'lead_11', company: 'Cobalt Payments', domain: 'cobaltpay.com', industry: 'Fintech — B2B Payments', hq: 'Atlanta, GA', employees: 600, revenueBand: '$100M–$250M', techStack: ['AWS', 'Snowflake', 'MuleSoft', 'Splunk', 'CrowdStrike'], funding: 'Private equity', fitScore: 89, status: 'today', createdAt: '2026-05-04T08:45:00Z' },
  { id: 'lead_12', company: 'Anchorpoint Wealth', domain: 'anchorpointwealth.com', industry: 'Fintech — Wealth Management', hq: 'Boston, MA', employees: 1500, revenueBand: '$250M–$500M', techStack: ['Salesforce Financial Services Cloud', 'Snowflake', 'Okta', 'Mimecast'], funding: 'Public (NASDAQ)', fitScore: 82, status: 'this_week', createdAt: '2026-04-29T13:15:00Z' },
  { id: 'lead_13', company: 'Lattice Lending', domain: 'latticelending.com', industry: 'Fintech — SMB Lending', hq: 'Chicago, IL', employees: 180, revenueBand: '$25M–$100M', techStack: ['AWS', 'Snowflake', 'Auth0', 'Datadog'], funding: 'Series B ($55M, 2024)', fitScore: 74, status: 'this_week', createdAt: '2026-04-30T15:25:00Z' },
  { id: 'lead_14', company: 'Selene Capital Markets', domain: 'selenecap.com', industry: 'Fintech — Proprietary Trading', hq: 'Chicago, IL', employees: 350, revenueBand: '$250M–$500M', techStack: ['On-prem + Equinix colo', 'kdb+', 'Active Directory', 'Tanium', 'Splunk'], funding: 'Privately held', fitScore: 81, status: 'today', createdAt: '2026-05-04T06:50:00Z' },
  { id: 'lead_15', company: 'Gradient Crypto', domain: 'gradient.exchange', industry: 'Fintech — Crypto Exchange', hq: 'Miami, FL', employees: 90, revenueBand: '$25M–$100M', techStack: ['AWS', 'Fireblocks', 'Okta', 'CrowdStrike', 'Wiz'], funding: 'Series B ($60M, 2024)', fitScore: 77, status: 'this_week', createdAt: '2026-05-02T11:40:00Z' },
  { id: 'lead_16', company: 'Tidewater Mutual', domain: 'tidewatermutual.org', industry: 'Fintech — Credit Union', hq: 'Norfolk, VA', employees: 1800, revenueBand: '$250M–$500M', techStack: ['Fiserv', 'Q2', 'Microsoft 365', 'Sophos', 'Active Directory'], funding: 'Member-owned', fitScore: 78, status: 'today', createdAt: '2026-05-04T07:25:00Z' },

  // === MANUFACTURING (17–23) ===
  { id: 'lead_17', company: 'Forgewright Industries', domain: 'forgewright.com', industry: 'Manufacturing — Industrial Machinery', hq: 'Cincinnati, OH', employees: 5500, revenueBand: '$1B+', techStack: ['SAP S/4HANA', 'Siemens NX', 'Active Directory', 'Cisco', 'FortiGate'], funding: 'Public (NYSE), DoD subcontractor', fitScore: 86, status: 'today', createdAt: '2026-05-04T09:15:00Z' },
  { id: 'lead_18', company: 'Continental Polymers', domain: 'continentalpolymers.com', industry: 'Manufacturing — Specialty Chemicals', hq: 'Houston, TX', employees: 2800, revenueBand: '$500M–$1B', techStack: ['SAP', 'AspenTech', 'Active Directory', 'Palo Alto', 'Claroty'], funding: 'Public', fitScore: 83, status: 'this_week', createdAt: '2026-05-01T12:30:00Z' },
  { id: 'lead_19', company: 'Halberd Aerospace', domain: 'halberdaero.com', industry: 'Manufacturing — Aerospace & Defense', hq: 'Wichita, KS', employees: 1400, revenueBand: '$250M–$500M', techStack: ['SAP', 'Siemens NX', 'AD (ITAR-segmented)', 'CrowdStrike', 'Tanium'], funding: 'Privately held, DoD prime/sub', fitScore: 90, status: 'today', createdAt: '2026-05-04T06:20:00Z' },
  { id: 'lead_20', company: 'Northshore Foods', domain: 'northshorefoods.com', industry: 'Manufacturing — Food Processing', hq: 'Madison, WI', employees: 3500, revenueBand: '$500M–$1B', techStack: ['SAP', 'Wonderware', 'Active Directory', 'Cisco', 'Sophos'], funding: 'Privately held', fitScore: 73, status: 'this_week', createdAt: '2026-04-30T10:10:00Z' },
  { id: 'lead_21', company: 'Iron Crescent Automotive', domain: 'ironcrescent.com', industry: 'Manufacturing — Auto Parts (Tier-2)', hq: 'Detroit, MI', employees: 6200, revenueBand: '$1B+', techStack: ['SAP', 'Plex', 'Active Directory', 'Cisco', 'FortiGate'], funding: 'Public', fitScore: 87, status: 'today', createdAt: '2026-05-04T08:30:00Z' },
  { id: 'lead_22', company: 'Helios Solar Components', domain: 'helios-solar.com', industry: 'Manufacturing — Renewable Energy', hq: 'Phoenix, AZ', employees: 900, revenueBand: '$100M–$250M', techStack: ['NetSuite', 'Active Directory', 'Microsoft 365', 'Sophos'], funding: 'PE-backed', fitScore: 70, status: 'this_week', createdAt: '2026-05-01T11:00:00Z' },
  { id: 'lead_23', company: 'Westwall Pharma Manufacturing', domain: 'westwallpharma.com', industry: 'Manufacturing — Contract Pharma (CMO)', hq: 'Princeton, NJ', employees: 2100, revenueBand: '$500M–$1B', techStack: ['SAP', 'MasterControl', 'Active Directory', 'Splunk', 'CrowdStrike'], funding: 'Public', fitScore: 85, status: 'today', createdAt: '2026-05-04T07:55:00Z' },

  // === SAAS / TECH (24–33) ===
  { id: 'lead_24', company: 'Stratifi HR', domain: 'stratifihr.com', industry: 'SaaS — HR Tech', hq: 'Seattle, WA', employees: 320, revenueBand: '$25M–$100M', techStack: ['AWS', 'Snowflake', 'Okta', 'Wiz', 'Vanta'], funding: 'Series C ($85M, 2024)', fitScore: 82, status: 'today', createdAt: '2026-05-04T09:00:00Z' },
  { id: 'lead_25', company: 'Threadbase', domain: 'threadbase.dev', industry: 'SaaS — Developer Tools', hq: 'San Francisco, CA', employees: 180, revenueBand: '$10M–$25M', techStack: ['AWS', 'GitHub Enterprise', 'Okta', 'CrowdStrike'], funding: 'Series B ($45M, 2024)', fitScore: 79, status: 'this_week', createdAt: '2026-04-30T14:00:00Z' },
  { id: 'lead_26', company: 'Clearpoint Analytics', domain: 'clearpointanalytics.com', industry: 'SaaS — BI for SMB', hq: 'Austin, TX', employees: 240, revenueBand: '$25M–$100M', techStack: ['AWS', 'Snowflake', 'Auth0', 'Datadog'], funding: 'Series B', fitScore: 75, status: 'this_week', createdAt: '2026-05-01T15:20:00Z' },
  { id: 'lead_27', company: 'Northstar Field Services', domain: 'northstarfs.com', industry: 'SaaS — Vertical (HVAC field service)', hq: 'Nashville, TN', employees: 140, revenueBand: '$10M–$25M', techStack: ['AWS', 'Stripe', 'Auth0'], funding: 'Series A ($18M, 2023)', fitScore: 71, status: 'snoozed', createdAt: '2026-04-18T09:30:00Z', snoozedUntil: '2026-05-15T09:00:00Z' },
  { id: 'lead_28', company: 'Aurora Logistics Cloud', domain: 'auroralogistics.io', industry: 'SaaS — Supply Chain', hq: 'Atlanta, GA', employees: 410, revenueBand: '$25M–$100M', techStack: ['AWS', 'Snowflake', 'Okta', 'MuleSoft', 'Splunk'], funding: 'Series C', fitScore: 80, status: 'this_week', createdAt: '2026-04-29T11:45:00Z' },
  { id: 'lead_29', company: 'Plinth Identity', domain: 'plinth.io', industry: 'SaaS — Security (IAM)', hq: 'Boston, MA', employees: 95, revenueBand: '$10M–$25M', techStack: ['AWS', 'Okta', 'Wiz', 'Vanta'], funding: 'Series B ($38M, 2025)', fitScore: 73, status: 'today', createdAt: '2026-05-04T08:05:00Z' },
  { id: 'lead_30', company: 'Brightside Marketing', domain: 'brightsidemkt.com', industry: 'SaaS — MarTech', hq: 'New York, NY', employees: 600, revenueBand: '$100M–$250M', techStack: ['AWS', 'Snowflake', 'Salesforce', 'Okta', 'CrowdStrike'], funding: 'PE-backed', fitScore: 78, status: 'this_week', createdAt: '2026-04-30T13:00:00Z' },
  { id: 'lead_31', company: 'Apex Telematics', domain: 'apextelematics.com', industry: 'SaaS — IoT / Fleet', hq: 'Dallas, TX', employees: 280, revenueBand: '$25M–$100M', techStack: ['AWS IoT', 'Snowflake', 'Okta', 'Datadog'], funding: 'Series C', fitScore: 76, status: 'this_week', createdAt: '2026-05-01T10:30:00Z' },
  { id: 'lead_32', company: 'Vector Education', domain: 'vectoredu.com', industry: 'SaaS — EdTech (K-12 admin)', hq: 'Boston, MA', employees: 380, revenueBand: '$25M–$100M', techStack: ['AWS', 'ClassLink', 'Auth0', 'Sophos'], funding: 'PE-backed', fitScore: 74, status: 'this_week', createdAt: '2026-05-02T08:50:00Z' },
  { id: 'lead_33', company: 'Quill DocAI', domain: 'quill.legal', industry: 'SaaS — Legal AI', hq: 'New York, NY', employees: 65, revenueBand: '$5M–$10M', techStack: ['AWS', 'OpenAI API', 'Auth0', 'Vanta'], funding: 'Series A ($22M, 2025)', fitScore: 69, status: 'snoozed', createdAt: '2026-04-15T14:20:00Z', snoozedUntil: '2026-05-20T09:00:00Z' },

  // === LEGAL / PROFESSIONAL SERVICES (34–38) ===
  { id: 'lead_34', company: 'Whitford & Pace LLP', domain: 'whitfordpace.com', industry: 'Legal — National Law Firm', hq: 'New York, NY', employees: 1000, revenueBand: '$500M–$1B', techStack: ['iManage', 'NetDocuments', 'Microsoft 365', 'Mimecast', 'CrowdStrike'], funding: 'Partnership (Am Law 100)', fitScore: 88, status: 'today', createdAt: '2026-05-04T07:10:00Z' },
  { id: 'lead_35', company: 'Ashbury Carter Auditors', domain: 'ashburycarter.com', industry: 'Professional Services — Audit & Accounting', hq: 'Chicago, IL', employees: 720, revenueBand: '$100M–$250M', techStack: ['CCH Axcess', 'Microsoft 365', 'Citrix', 'Mimecast'], funding: 'Partnership', fitScore: 81, status: 'this_week', createdAt: '2026-04-29T16:00:00Z' },
  { id: 'lead_36', company: 'Crestmont Consulting', domain: 'crestmontco.com', industry: 'Professional Services — Management Consulting', hq: 'Boston, MA', employees: 320, revenueBand: '$25M–$100M', techStack: ['Microsoft 365', 'Salesforce', 'Okta', 'Sophos'], funding: 'Privately held', fitScore: 72, status: 'this_week', createdAt: '2026-05-01T13:40:00Z' },
  { id: 'lead_37', company: 'Lindquist & Reeve', domain: 'lindquistreeve.com', industry: 'Legal — IP / Patent Boutique', hq: 'Palo Alto, CA', employees: 280, revenueBand: '$25M–$100M', techStack: ['iManage', 'Microsoft 365', 'Mimecast', 'CrowdStrike'], funding: 'Partnership', fitScore: 84, status: 'today', createdAt: '2026-05-04T08:35:00Z' },
  { id: 'lead_38', company: 'Northpoint Tax Advisors', domain: 'northpointtax.com', industry: 'Professional Services — Tax & Advisory', hq: 'Dallas, TX', employees: 540, revenueBand: '$100M–$250M', techStack: ['CCH Axcess', 'Microsoft 365', 'Citrix', 'Mimecast'], funding: 'PE-backed (2024)', fitScore: 76, status: 'this_week', createdAt: '2026-04-30T12:15:00Z' },

  // === E-COMMERCE / RETAIL (39–44) ===
  { id: 'lead_39', company: 'Hearthline Goods', domain: 'hearthline.co', industry: 'E-commerce — DTC Home Goods', hq: 'Brooklyn, NY', employees: 380, revenueBand: '$100M–$250M', techStack: ['Shopify Plus', 'Snowflake', 'Klaviyo', 'Cloudflare', 'Auth0'], funding: 'Series C ($75M, 2023)', fitScore: 79, status: 'this_week', createdAt: '2026-04-29T10:50:00Z' },
  { id: 'lead_40', company: 'Westmark Outdoor', domain: 'westmarkoutdoor.com', industry: 'Retail — Omnichannel Outdoor', hq: 'Denver, CO', employees: 1200, revenueBand: '$250M–$500M', techStack: ['SAP Commerce', 'AWS', 'Salesforce', 'Cloudflare', 'CrowdStrike'], funding: 'Public', fitScore: 83, status: 'today', createdAt: '2026-05-04T06:40:00Z' },
  { id: 'lead_41', company: 'Gildwater Apparel', domain: 'gildwater.com', industry: 'E-commerce — DTC Apparel', hq: 'Los Angeles, CA', employees: 220, revenueBand: '$25M–$100M', techStack: ['Shopify Plus', 'Klaviyo', 'Cloudflare'], funding: 'Series B', fitScore: 70, status: 'this_week', createdAt: '2026-05-02T15:00:00Z' },
  { id: 'lead_42', company: 'Pinecrest Pet Co', domain: 'pinecrestpet.com', industry: 'Retail — Pet Supplies', hq: 'Dallas, TX', employees: 460, revenueBand: '$100M–$250M', techStack: ['NetSuite', 'Shopify', 'Cloudflare', 'Sophos'], funding: 'PE-backed', fitScore: 72, status: 'this_week', createdAt: '2026-05-01T09:15:00Z' },
  { id: 'lead_43', company: 'Stoneflower Beauty', domain: 'stoneflower.com', industry: 'E-commerce — DTC Beauty', hq: 'New York, NY', employees: 140, revenueBand: '$10M–$25M', techStack: ['Shopify Plus', 'Klaviyo', 'Cloudflare'], funding: 'Series A', fitScore: 67, status: 'snoozed', createdAt: '2026-04-12T13:30:00Z', snoozedUntil: '2026-05-18T09:00:00Z' },
  { id: 'lead_44', company: 'Carriagehouse Marketplace', domain: 'carriagehouse.com', industry: 'E-commerce — B2C Marketplace', hq: 'Seattle, WA', employees: 280, revenueBand: '$25M–$100M', techStack: ['AWS', 'Stripe Connect', 'Auth0', 'Cloudflare'], funding: 'Series C', fitScore: 75, status: 'this_week', createdAt: '2026-04-30T15:50:00Z' },

  // === ENERGY / EDUCATION / DEFENSE (45–50) ===
  { id: 'lead_45', company: 'Lambda Grid Solutions', domain: 'lambdagrid.com', industry: 'Energy — Regional Electric Utility', hq: 'Sacramento, CA', employees: 1100, revenueBand: '$500M–$1B', techStack: ['OSIsoft PI', 'ABB', 'Active Directory', 'Dragos', 'Splunk'], funding: 'Investor-owned utility', fitScore: 92, status: 'today', createdAt: '2026-05-04T05:50:00Z' },
  { id: 'lead_46', company: 'Pacific Bay Water', domain: 'pacificbaywater.org', industry: 'Energy — Water Utility', hq: 'San Diego, CA', employees: 850, revenueBand: '$100M–$250M', techStack: ['OSIsoft PI', 'Schneider Electric', 'Active Directory', 'Cisco', 'Sophos'], funding: 'Municipal', fitScore: 89, status: 'today', createdAt: '2026-05-04T07:35:00Z' },
  { id: 'lead_47', company: 'Quailridge University', domain: 'quailridge.edu', industry: 'Education — Private University', hq: 'Bloomington, IN', employees: 4200, revenueBand: '$500M–$1B', techStack: ['Banner', 'Microsoft 365', 'Shibboleth', 'Cisco', 'CrowdStrike'], funding: 'Non-profit', fitScore: 80, status: 'this_week', createdAt: '2026-04-30T14:25:00Z' },
  { id: 'lead_48', company: 'Tier-One Defense Logistics', domain: 'tieronedl.com', industry: 'Defense — DoD Prime/Sub', hq: 'Huntsville, AL', employees: 1800, revenueBand: '$500M–$1B', techStack: ['SAP', 'AD (segmented)', 'CrowdStrike', 'Tanium', 'Splunk'], funding: 'Privately held, CMMC L2 in scope', fitScore: 93, status: 'today', createdAt: '2026-05-04T06:00:00Z' },
  { id: 'lead_49', company: 'Greylock Pipeline', domain: 'greylockpipeline.com', industry: 'Energy — Midstream Oil & Gas', hq: 'Tulsa, OK', employees: 600, revenueBand: '$250M–$500M', techStack: ['OSIsoft PI', 'Honeywell', 'Active Directory', 'Claroty', 'Splunk'], funding: 'PE-backed', fitScore: 87, status: 'today', createdAt: '2026-05-04T08:20:00Z' },
  { id: 'lead_50', company: 'Coppermark School District', domain: 'coppermark.k12.az.us', industry: 'Education — K-12 Public School District', hq: 'Phoenix, AZ', employees: 2400, revenueBand: '$100M–$250M', techStack: ['ClassLink', 'Microsoft 365', 'Sophos', 'PowerSchool'], funding: 'Public school district (28 schools)', fitScore: 77, status: 'this_week', createdAt: '2026-05-01T08:00:00Z' },
];

export const contacts: Contact[] = [
  // Meridian Health Partners
  { id: 'ct_1',  leadId: 'lead_1', name: 'Sarah Chen',     title: 'Chief Information Security Officer', email: 'sarah.chen@meridianhealthpartners.org',     phone: '+1-216-555-0142', linkedin: 'linkedin.com/in/sarahchen-ciso',     decisionMakerScore: 95 },
  { id: 'ct_2',  leadId: 'lead_1', name: 'David Okafor',   title: 'VP, IT Infrastructure',              email: 'david.okafor@meridianhealthpartners.org',  phone: '+1-216-555-0188', linkedin: 'linkedin.com/in/davidokafor',         decisionMakerScore: 78 },
  { id: 'ct_3',  leadId: 'lead_1', name: 'Lisa Brennan',   title: 'SVP Compliance & Privacy Officer',   email: 'lisa.brennan@meridianhealthpartners.org',  phone: '+1-216-555-0204', linkedin: 'linkedin.com/in/lisabrennan-privacy', decisionMakerScore: 72 },

  // Cardinal Pediatric Network
  { id: 'ct_4',  leadId: 'lead_2', name: 'Marcus Hill',    title: 'Director of IT & Security',          email: 'marcus.hill@cardinalpediatric.com',        phone: '+1-704-555-0117', linkedin: 'linkedin.com/in/marcushill',          decisionMakerScore: 88 },
  { id: 'ct_5',  leadId: 'lead_2', name: 'Priya Raman',    title: 'Chief Operating Officer',            email: 'priya.raman@cardinalpediatric.com',        phone: '+1-704-555-0162', linkedin: 'linkedin.com/in/priyaraman-coo',      decisionMakerScore: 80 },
  { id: 'ct_6',  leadId: 'lead_2', name: 'Tom Geller',     title: 'HIPAA Privacy Officer',              email: 'tom.geller@cardinalpediatric.com',         phone: '+1-704-555-0193', linkedin: 'linkedin.com/in/tomgeller',           decisionMakerScore: 64 },

  // Northwind Diagnostics
  { id: 'ct_7',  leadId: 'lead_3', name: 'Anika Patel',    title: 'Director of IT',                      email: 'anika.patel@northwinddx.com',              phone: '+1-612-555-0145', linkedin: 'linkedin.com/in/anikapatel',          decisionMakerScore: 85 },
  { id: 'ct_8',  leadId: 'lead_3', name: 'Greg Halvorsen', title: 'CFO',                                 email: 'greg.halvorsen@northwinddx.com',           phone: '+1-612-555-0177', linkedin: 'linkedin.com/in/greghalvorsen',       decisionMakerScore: 76 },
  { id: 'ct_9',  leadId: 'lead_3', name: 'Karen Liu',      title: 'Compliance Manager',                  email: 'karen.liu@northwinddx.com',                phone: '+1-612-555-0212', linkedin: 'linkedin.com/in/karenliu-compliance', decisionMakerScore: 58 },

  // PrismCare Health Plans
  { id: 'ct_10', leadId: 'lead_4', name: 'Rachel Vasquez', title: 'CISO',                                email: 'rachel.vasquez@prismcare.com',             phone: '+1-860-555-0188', linkedin: 'linkedin.com/in/rachelvasquez-ciso',  decisionMakerScore: 96 },
  { id: 'ct_11', leadId: 'lead_4', name: 'Jonathan Park',  title: 'VP, Cyber Risk',                      email: 'jonathan.park@prismcare.com',              phone: '+1-860-555-0211', linkedin: 'linkedin.com/in/jonathanpark',        decisionMakerScore: 84 },
  { id: 'ct_12', leadId: 'lead_4', name: 'Diana Crowell',  title: 'Chief Privacy Officer',               email: 'diana.crowell@prismcare.com',              phone: '+1-860-555-0233', linkedin: 'linkedin.com/in/dianacrowell',        decisionMakerScore: 68 },

  // AltaMed Devices
  { id: 'ct_13', leadId: 'lead_5', name: 'Brian Sato',     title: 'VP, IT & Quality Systems',            email: 'brian.sato@altameddevices.com',            phone: '+1-949-555-0118', linkedin: 'linkedin.com/in/briansato',           decisionMakerScore: 87 },
  { id: 'ct_14', leadId: 'lead_5', name: 'Elena Cruz',     title: 'Director of Regulatory Affairs',      email: 'elena.cruz@altameddevices.com',            phone: '+1-949-555-0156', linkedin: 'linkedin.com/in/elenacruz-ra',        decisionMakerScore: 69 },
  { id: 'ct_15', leadId: 'lead_5', name: 'Mike Donnelly',  title: 'CFO',                                 email: 'mike.donnelly@altameddevices.com',         phone: '+1-949-555-0190', linkedin: 'linkedin.com/in/mikedonnelly-cfo',    decisionMakerScore: 74 },

  // Helix Telemedicine
  { id: 'ct_16', leadId: 'lead_6', name: 'Sam Kowalski',   title: 'Head of Security',                    email: 'sam.kowalski@helixcare.io',                phone: '+1-512-555-0133', linkedin: 'linkedin.com/in/samkowalski',         decisionMakerScore: 86 },
  { id: 'ct_17', leadId: 'lead_6', name: 'Olivia Reyes',   title: 'CTO',                                 email: 'olivia.reyes@helixcare.io',                phone: '+1-512-555-0167', linkedin: 'linkedin.com/in/oliviareyes-cto',     decisionMakerScore: 91 },
  { id: 'ct_18', leadId: 'lead_6', name: 'Aaron Goldfarb', title: 'General Counsel',                     email: 'aaron.goldfarb@helixcare.io',              phone: '+1-512-555-0182', linkedin: 'linkedin.com/in/aarongoldfarb',       decisionMakerScore: 60 },

  // Stoneridge Behavioral Health
  { id: 'ct_19', leadId: 'lead_7', name: 'Jenna Whitlock', title: 'Director of IT',                      email: 'jenna.whitlock@stoneridgebh.com',          phone: '+1-303-555-0144', linkedin: 'linkedin.com/in/jennawhitlock',       decisionMakerScore: 82 },
  { id: 'ct_20', leadId: 'lead_7', name: 'Carlos Medina',  title: 'COO',                                 email: 'carlos.medina@stoneridgebh.com',           phone: '+1-303-555-0179', linkedin: 'linkedin.com/in/carlosmedina-coo',    decisionMakerScore: 75 },
  { id: 'ct_21', leadId: 'lead_7', name: 'Beth Ng',        title: 'HIPAA Privacy Officer',               email: 'beth.ng@stoneridgebh.com',                 phone: '+1-303-555-0201', linkedin: 'linkedin.com/in/bethng-privacy',      decisionMakerScore: 55 },

  // Emberline Senior Living
  { id: 'ct_22', leadId: 'lead_8', name: 'Greg Tannen',    title: 'VP, IT',                              email: 'greg.tannen@emberlineliving.com',          phone: '+1-813-555-0123', linkedin: 'linkedin.com/in/gregtannen',          decisionMakerScore: 80 },
  { id: 'ct_23', leadId: 'lead_8', name: 'Maria Holst',    title: 'Compliance Director',                 email: 'maria.holst@emberlineliving.com',          phone: '+1-813-555-0158', linkedin: 'linkedin.com/in/mariaholst-compliance', decisionMakerScore: 65 },
  { id: 'ct_24', leadId: 'lead_8', name: 'Phil Reston',    title: 'CFO',                                 email: 'phil.reston@emberlineliving.com',          phone: '+1-813-555-0184', linkedin: 'linkedin.com/in/philreston-cfo',      decisionMakerScore: 78 },

  // Volterra Financial
  { id: 'ct_25', leadId: 'lead_9', name: 'Ethan Marlow',   title: 'CISO',                                email: 'ethan.marlow@volterra.com',                phone: '+1-212-555-0150', linkedin: 'linkedin.com/in/ethanmarlow-ciso',    decisionMakerScore: 96 },
  { id: 'ct_26', leadId: 'lead_9', name: 'Jasmine Park',   title: 'VP Engineering',                      email: 'jasmine.park@volterra.com',                phone: '+1-212-555-0173', linkedin: 'linkedin.com/in/jasminepark-eng',     decisionMakerScore: 78 },
  { id: 'ct_27', leadId: 'lead_9', name: 'Robert Klein',   title: 'BSA Officer',                         email: 'robert.klein@volterra.com',                phone: '+1-212-555-0199', linkedin: 'linkedin.com/in/robertklein-bsa',     decisionMakerScore: 70 },

  // Brightline Capital
  { id: 'ct_28', leadId: 'lead_10', name: 'Naomi Sasaki',  title: 'Head of Security',                    email: 'naomi.sasaki@brightlinecap.com',           phone: '+1-415-555-0132', linkedin: 'linkedin.com/in/naomisasaki',         decisionMakerScore: 90 },
  { id: 'ct_29', leadId: 'lead_10', name: 'Daniel Foley',  title: 'CTO',                                 email: 'daniel.foley@brightlinecap.com',           phone: '+1-415-555-0154', linkedin: 'linkedin.com/in/danielfoley-cto',     decisionMakerScore: 88 },
  { id: 'ct_30', leadId: 'lead_10', name: 'Hannah Wu',     title: 'Chief Compliance Officer',            email: 'hannah.wu@brightlinecap.com',              phone: '+1-415-555-0186', linkedin: 'linkedin.com/in/hannahwu-cco',        decisionMakerScore: 76 },

  // Cobalt Payments
  { id: 'ct_31', leadId: 'lead_11', name: 'Marcus Webb',   title: 'CISO',                                email: 'marcus.webb@cobaltpay.com',                phone: '+1-404-555-0149', linkedin: 'linkedin.com/in/marcuswebb-ciso',     decisionMakerScore: 95 },
  { id: 'ct_32', leadId: 'lead_11', name: 'Jess Albright', title: 'SVP Engineering',                     email: 'jess.albright@cobaltpay.com',              phone: '+1-404-555-0171', linkedin: 'linkedin.com/in/jessalbright',        decisionMakerScore: 80 },
  { id: 'ct_33', leadId: 'lead_11', name: 'Tariq Hassan',  title: 'VP Risk & Compliance',                email: 'tariq.hassan@cobaltpay.com',               phone: '+1-404-555-0207', linkedin: 'linkedin.com/in/tariqhassan',         decisionMakerScore: 82 },

  // Anchorpoint Wealth
  { id: 'ct_34', leadId: 'lead_12', name: 'Caroline Voss', title: 'CISO',                                email: 'caroline.voss@anchorpointwealth.com',      phone: '+1-617-555-0119', linkedin: 'linkedin.com/in/carolinevoss-ciso',   decisionMakerScore: 94 },
  { id: 'ct_35', leadId: 'lead_12', name: 'Patrick Doyle', title: 'Director of IT Operations',           email: 'patrick.doyle@anchorpointwealth.com',      phone: '+1-617-555-0143', linkedin: 'linkedin.com/in/patrickdoyle',        decisionMakerScore: 71 },
  { id: 'ct_36', leadId: 'lead_12', name: 'Sonia Bernal',  title: 'Chief Risk Officer',                  email: 'sonia.bernal@anchorpointwealth.com',       phone: '+1-617-555-0168', linkedin: 'linkedin.com/in/soniabernal-cro',     decisionMakerScore: 86 },

  // Lattice Lending
  { id: 'ct_37', leadId: 'lead_13', name: 'Vince Carrera', title: 'Head of Engineering & Security',      email: 'vince.carrera@latticelending.com',         phone: '+1-312-555-0136', linkedin: 'linkedin.com/in/vincecarrera',        decisionMakerScore: 91 },
  { id: 'ct_38', leadId: 'lead_13', name: 'Maya Iverson',  title: 'COO',                                 email: 'maya.iverson@latticelending.com',          phone: '+1-312-555-0162', linkedin: 'linkedin.com/in/mayaiverson',         decisionMakerScore: 78 },
  { id: 'ct_39', leadId: 'lead_13', name: 'Jordan Beck',   title: 'Compliance Lead',                     email: 'jordan.beck@latticelending.com',           phone: '+1-312-555-0188', linkedin: 'linkedin.com/in/jordanbeck-compliance', decisionMakerScore: 60 },

  // Selene Capital Markets
  { id: 'ct_40', leadId: 'lead_14', name: 'Henrik Olsen',  title: 'Head of Cyber & Infrastructure',      email: 'henrik.olsen@selenecap.com',               phone: '+1-312-555-0211', linkedin: 'linkedin.com/in/henrikolsen',         decisionMakerScore: 93 },
  { id: 'ct_41', leadId: 'lead_14', name: 'Lily Tran',     title: 'CTO',                                 email: 'lily.tran@selenecap.com',                  phone: '+1-312-555-0234', linkedin: 'linkedin.com/in/lilytran-cto',        decisionMakerScore: 89 },
  { id: 'ct_42', leadId: 'lead_14', name: 'Erik Vogel',    title: 'COO',                                 email: 'erik.vogel@selenecap.com',                 phone: '+1-312-555-0259', linkedin: 'linkedin.com/in/erikvogel',           decisionMakerScore: 75 },

  // Gradient Crypto
  { id: 'ct_43', leadId: 'lead_15', name: 'Mia Rosenthal', title: 'CISO',                                email: 'mia.rosenthal@gradient.exchange',          phone: '+1-305-555-0124', linkedin: 'linkedin.com/in/miarosenthal-ciso',   decisionMakerScore: 92 },
  { id: 'ct_44', leadId: 'lead_15', name: 'Felix Anand',   title: 'Co-founder & CTO',                    email: 'felix.anand@gradient.exchange',            phone: '+1-305-555-0157', linkedin: 'linkedin.com/in/felixanand',          decisionMakerScore: 95 },
  { id: 'ct_45', leadId: 'lead_15', name: 'Renee Boucher', title: 'BSA / AML Officer',                   email: 'renee.boucher@gradient.exchange',          phone: '+1-305-555-0184', linkedin: 'linkedin.com/in/reneeboucher',        decisionMakerScore: 70 },

  // Tidewater Mutual
  { id: 'ct_46', leadId: 'lead_16', name: 'Walter Hines',  title: 'CIO',                                 email: 'walter.hines@tidewatermutual.org',         phone: '+1-757-555-0140', linkedin: 'linkedin.com/in/walterhines-cio',     decisionMakerScore: 88 },
  { id: 'ct_47', leadId: 'lead_16', name: 'Janelle Ward',  title: 'Information Security Manager',        email: 'janelle.ward@tidewatermutual.org',         phone: '+1-757-555-0166', linkedin: 'linkedin.com/in/janelleward',         decisionMakerScore: 80 },
  { id: 'ct_48', leadId: 'lead_16', name: 'Doug Marsten',  title: 'Chief Risk Officer',                  email: 'doug.marsten@tidewatermutual.org',         phone: '+1-757-555-0192', linkedin: 'linkedin.com/in/dougmarsten',         decisionMakerScore: 84 },

  // Forgewright Industries
  { id: 'ct_49', leadId: 'lead_17', name: 'Steven Brock',  title: 'CISO',                                email: 'steven.brock@forgewright.com',             phone: '+1-513-555-0146', linkedin: 'linkedin.com/in/stevenbrock-ciso',    decisionMakerScore: 94 },
  { id: 'ct_50', leadId: 'lead_17', name: 'Aisha Knowles', title: 'Director, OT Security',               email: 'aisha.knowles@forgewright.com',            phone: '+1-513-555-0173', linkedin: 'linkedin.com/in/aishaknowles-ot',     decisionMakerScore: 86 },
  { id: 'ct_51', leadId: 'lead_17', name: 'Roger Phelps',  title: 'VP IT Infrastructure',                email: 'roger.phelps@forgewright.com',             phone: '+1-513-555-0198', linkedin: 'linkedin.com/in/rogerphelps',         decisionMakerScore: 75 },

  // Continental Polymers
  { id: 'ct_52', leadId: 'lead_18', name: 'Gabriela Cruz', title: 'CISO',                                email: 'gabriela.cruz@continentalpolymers.com',    phone: '+1-713-555-0118', linkedin: 'linkedin.com/in/gabrielacruz',        decisionMakerScore: 91 },
  { id: 'ct_53', leadId: 'lead_18', name: 'Mark Tully',    title: 'OT Security Lead',                    email: 'mark.tully@continentalpolymers.com',       phone: '+1-713-555-0145', linkedin: 'linkedin.com/in/marktully-ot',        decisionMakerScore: 78 },
  { id: 'ct_54', leadId: 'lead_18', name: 'Yara Faisal',   title: 'CIO',                                 email: 'yara.faisal@continentalpolymers.com',      phone: '+1-713-555-0177', linkedin: 'linkedin.com/in/yarafaisal-cio',      decisionMakerScore: 87 },

  // Halberd Aerospace
  { id: 'ct_55', leadId: 'lead_19', name: 'Colonel (Ret.) Frank Devitt', title: 'CISO & FSO',           email: 'frank.devitt@halberdaero.com',             phone: '+1-316-555-0152', linkedin: 'linkedin.com/in/frankdevitt-ciso',    decisionMakerScore: 96 },
  { id: 'ct_56', leadId: 'lead_19', name: 'Megan Caldwell',title: 'Director, CMMC Program',              email: 'megan.caldwell@halberdaero.com',           phone: '+1-316-555-0179', linkedin: 'linkedin.com/in/megancaldwell-cmmc',  decisionMakerScore: 88 },
  { id: 'ct_57', leadId: 'lead_19', name: 'Andre Vesely',  title: 'VP Engineering Operations',           email: 'andre.vesely@halberdaero.com',             phone: '+1-316-555-0204', linkedin: 'linkedin.com/in/andrevesely',         decisionMakerScore: 72 },

  // Northshore Foods
  { id: 'ct_58', leadId: 'lead_20', name: 'Ben Lindstrom', title: 'Director of IT',                      email: 'ben.lindstrom@northshorefoods.com',        phone: '+1-608-555-0125', linkedin: 'linkedin.com/in/benlindstrom',        decisionMakerScore: 84 },
  { id: 'ct_59', leadId: 'lead_20', name: 'Tasha Mensah',  title: 'VP Operations',                       email: 'tasha.mensah@northshorefoods.com',         phone: '+1-608-555-0153', linkedin: 'linkedin.com/in/tashamensah',         decisionMakerScore: 73 },
  { id: 'ct_60', leadId: 'lead_20', name: 'Eric Boylan',   title: 'CFO',                                 email: 'eric.boylan@northshorefoods.com',          phone: '+1-608-555-0181', linkedin: 'linkedin.com/in/ericboylan-cfo',      decisionMakerScore: 76 },

  // Iron Crescent Automotive
  { id: 'ct_61', leadId: 'lead_21', name: 'Dimitri Volkov',title: 'CISO',                                email: 'dimitri.volkov@ironcrescent.com',          phone: '+1-313-555-0137', linkedin: 'linkedin.com/in/dimitrivolkov',       decisionMakerScore: 93 },
  { id: 'ct_62', leadId: 'lead_21', name: 'Carla Reeves',  title: 'Director of IT — Plants',             email: 'carla.reeves@ironcrescent.com',            phone: '+1-313-555-0164', linkedin: 'linkedin.com/in/carlareeves',         decisionMakerScore: 81 },
  { id: 'ct_63', leadId: 'lead_21', name: 'Hank Yoshida',  title: 'VP Procurement',                      email: 'hank.yoshida@ironcrescent.com',            phone: '+1-313-555-0193', linkedin: 'linkedin.com/in/hankyoshida',         decisionMakerScore: 65 },

  // Helios Solar
  { id: 'ct_64', leadId: 'lead_22', name: 'Liam Brennan',  title: 'IT Manager',                          email: 'liam.brennan@helios-solar.com',            phone: '+1-602-555-0149', linkedin: 'linkedin.com/in/liambrennan-it',      decisionMakerScore: 80 },
  { id: 'ct_65', leadId: 'lead_22', name: 'Tessa Albright',title: 'COO',                                 email: 'tessa.albright@helios-solar.com',          phone: '+1-602-555-0175', linkedin: 'linkedin.com/in/tessaalbright',       decisionMakerScore: 76 },
  { id: 'ct_66', leadId: 'lead_22', name: 'Frank Gilroy',  title: 'CFO',                                 email: 'frank.gilroy@helios-solar.com',            phone: '+1-602-555-0202', linkedin: 'linkedin.com/in/frankgilroy-cfo',     decisionMakerScore: 72 },

  // Westwall Pharma
  { id: 'ct_67', leadId: 'lead_23', name: 'Amelia Strand', title: 'CISO',                                email: 'amelia.strand@westwallpharma.com',         phone: '+1-609-555-0128', linkedin: 'linkedin.com/in/ameliastrand-ciso',   decisionMakerScore: 94 },
  { id: 'ct_68', leadId: 'lead_23', name: 'Vikram Anand',  title: 'VP Quality Systems',                  email: 'vikram.anand@westwallpharma.com',          phone: '+1-609-555-0156', linkedin: 'linkedin.com/in/vikramanand',         decisionMakerScore: 80 },
  { id: 'ct_69', leadId: 'lead_23', name: 'Cassie Doerr',  title: 'Director, GxP IT',                    email: 'cassie.doerr@westwallpharma.com',          phone: '+1-609-555-0184', linkedin: 'linkedin.com/in/cassiedoerr',         decisionMakerScore: 78 },

  // Stratifi HR
  { id: 'ct_70', leadId: 'lead_24', name: 'Dev Mehta',     title: 'Head of Security',                    email: 'dev.mehta@stratifihr.com',                 phone: '+1-206-555-0131', linkedin: 'linkedin.com/in/devmehta-sec',        decisionMakerScore: 92 },
  { id: 'ct_71', leadId: 'lead_24', name: 'Sasha Kerr',    title: 'VP Engineering',                      email: 'sasha.kerr@stratifihr.com',                phone: '+1-206-555-0157', linkedin: 'linkedin.com/in/sashakerr-eng',       decisionMakerScore: 79 },
  { id: 'ct_72', leadId: 'lead_24', name: 'Ben Yardley',   title: 'CFO',                                 email: 'ben.yardley@stratifihr.com',               phone: '+1-206-555-0186', linkedin: 'linkedin.com/in/benyardley-cfo',      decisionMakerScore: 76 },

  // Threadbase
  { id: 'ct_73', leadId: 'lead_25', name: 'Quentin Park',  title: 'CTO & Co-founder',                    email: 'quentin.park@threadbase.dev',              phone: '+1-415-555-0214', linkedin: 'linkedin.com/in/quentinpark',         decisionMakerScore: 96 },
  { id: 'ct_74', leadId: 'lead_25', name: 'Riya Joshi',    title: 'Head of Platform',                    email: 'riya.joshi@threadbase.dev',                phone: '+1-415-555-0241', linkedin: 'linkedin.com/in/riyajoshi',           decisionMakerScore: 84 },
  { id: 'ct_75', leadId: 'lead_25', name: 'Kai Watanabe',  title: 'COO',                                 email: 'kai.watanabe@threadbase.dev',              phone: '+1-415-555-0268', linkedin: 'linkedin.com/in/kaiwatanabe',         decisionMakerScore: 78 },

  // Clearpoint Analytics
  { id: 'ct_76', leadId: 'lead_26', name: 'Nora Saldana',  title: 'VP Engineering',                      email: 'nora.saldana@clearpointanalytics.com',     phone: '+1-512-555-0139', linkedin: 'linkedin.com/in/norasaldana',         decisionMakerScore: 86 },
  { id: 'ct_77', leadId: 'lead_26', name: 'Jeremy Hu',     title: 'Director of Security',                email: 'jeremy.hu@clearpointanalytics.com',        phone: '+1-512-555-0167', linkedin: 'linkedin.com/in/jeremyhu',            decisionMakerScore: 84 },
  { id: 'ct_78', leadId: 'lead_26', name: 'Tess Branford', title: 'CFO',                                 email: 'tess.branford@clearpointanalytics.com',    phone: '+1-512-555-0195', linkedin: 'linkedin.com/in/tessbranford',        decisionMakerScore: 70 },

  // Northstar Field Services
  { id: 'ct_79', leadId: 'lead_27', name: 'Ravi Murthy',   title: 'CTO',                                 email: 'ravi.murthy@northstarfs.com',              phone: '+1-615-555-0147', linkedin: 'linkedin.com/in/ravimurthy',          decisionMakerScore: 90 },
  { id: 'ct_80', leadId: 'lead_27', name: 'Hailey Ott',    title: 'CEO',                                 email: 'hailey.ott@northstarfs.com',               phone: '+1-615-555-0173', linkedin: 'linkedin.com/in/haileyott-ceo',       decisionMakerScore: 88 },
  { id: 'ct_81', leadId: 'lead_27', name: 'Logan Pierce',  title: 'Head of Customer Trust',              email: 'logan.pierce@northstarfs.com',             phone: '+1-615-555-0201', linkedin: 'linkedin.com/in/loganpierce',         decisionMakerScore: 65 },

  // Aurora Logistics
  { id: 'ct_82', leadId: 'lead_28', name: 'Penelope Voss', title: 'CISO',                                email: 'penelope.voss@auroralogistics.io',         phone: '+1-404-555-0218', linkedin: 'linkedin.com/in/penelopevoss-ciso',   decisionMakerScore: 93 },
  { id: 'ct_83', leadId: 'lead_28', name: 'Ahmed Saleh',   title: 'VP Platform Engineering',             email: 'ahmed.saleh@auroralogistics.io',           phone: '+1-404-555-0246', linkedin: 'linkedin.com/in/ahmedsaleh',          decisionMakerScore: 80 },
  { id: 'ct_84', leadId: 'lead_28', name: 'Renata Cole',   title: 'GM, Customer Success',                email: 'renata.cole@auroralogistics.io',           phone: '+1-404-555-0273', linkedin: 'linkedin.com/in/renatacole',          decisionMakerScore: 62 },

  // Plinth Identity
  { id: 'ct_85', leadId: 'lead_29', name: 'Theo Marsh',    title: 'Co-founder & CTO',                    email: 'theo.marsh@plinth.io',                     phone: '+1-617-555-0220', linkedin: 'linkedin.com/in/theomarsh',           decisionMakerScore: 96 },
  { id: 'ct_86', leadId: 'lead_29', name: 'Aviva Klein',   title: 'Head of Trust & Compliance',          email: 'aviva.klein@plinth.io',                    phone: '+1-617-555-0247', linkedin: 'linkedin.com/in/avivaklein',          decisionMakerScore: 80 },
  { id: 'ct_87', leadId: 'lead_29', name: 'Jordan Frye',   title: 'CEO',                                 email: 'jordan.frye@plinth.io',                    phone: '+1-617-555-0274', linkedin: 'linkedin.com/in/jordanfrye-ceo',      decisionMakerScore: 92 },

  // Brightside Marketing
  { id: 'ct_88', leadId: 'lead_30', name: 'Camille Pruitt',title: 'CISO',                                email: 'camille.pruitt@brightsidemkt.com',         phone: '+1-212-555-0291', linkedin: 'linkedin.com/in/camillepruitt-ciso',  decisionMakerScore: 91 },
  { id: 'ct_89', leadId: 'lead_30', name: 'Nick Calvert',  title: 'VP Engineering',                      email: 'nick.calvert@brightsidemkt.com',           phone: '+1-212-555-0317', linkedin: 'linkedin.com/in/nickcalvert',         decisionMakerScore: 78 },
  { id: 'ct_90', leadId: 'lead_30', name: 'Rosa Linden',   title: 'General Counsel',                     email: 'rosa.linden@brightsidemkt.com',            phone: '+1-212-555-0344', linkedin: 'linkedin.com/in/rosalinden-gc',       decisionMakerScore: 70 },

  // Apex Telematics
  { id: 'ct_91', leadId: 'lead_31', name: 'Beatriz Ortega',title: 'Director of Information Security',    email: 'beatriz.ortega@apextelematics.com',        phone: '+1-214-555-0156', linkedin: 'linkedin.com/in/beatrizortega',       decisionMakerScore: 89 },
  { id: 'ct_92', leadId: 'lead_31', name: 'Sergio Pham',   title: 'CTO',                                 email: 'sergio.pham@apextelematics.com',           phone: '+1-214-555-0184', linkedin: 'linkedin.com/in/sergiopham',          decisionMakerScore: 86 },
  { id: 'ct_93', leadId: 'lead_31', name: 'Tom Greaves',   title: 'VP Customer Operations',              email: 'tom.greaves@apextelematics.com',           phone: '+1-214-555-0212', linkedin: 'linkedin.com/in/tomgreaves',          decisionMakerScore: 64 },

  // Vector Education
  { id: 'ct_94', leadId: 'lead_32', name: 'Imani Foster',  title: 'CTO',                                 email: 'imani.foster@vectoredu.com',               phone: '+1-617-555-0301', linkedin: 'linkedin.com/in/imanifoster',         decisionMakerScore: 88 },
  { id: 'ct_95', leadId: 'lead_32', name: 'Brent Kowalski',title: 'Head of Security & Privacy',          email: 'brent.kowalski@vectoredu.com',             phone: '+1-617-555-0327', linkedin: 'linkedin.com/in/brentkowalski',       decisionMakerScore: 92 },
  { id: 'ct_96', leadId: 'lead_32', name: 'Phoebe Sinclair', title: 'CEO',                              email: 'phoebe.sinclair@vectoredu.com',             phone: '+1-617-555-0353', linkedin: 'linkedin.com/in/phoebesinclair-ceo',  decisionMakerScore: 84 },

  // Quill DocAI
  { id: 'ct_97', leadId: 'lead_33', name: 'Adrian Selby',  title: 'CTO & Co-founder',                    email: 'adrian.selby@quill.legal',                 phone: '+1-212-555-0376', linkedin: 'linkedin.com/in/adrianselby',         decisionMakerScore: 95 },
  { id: 'ct_98', leadId: 'lead_33', name: 'Nia Brooks',    title: 'Head of Trust',                       email: 'nia.brooks@quill.legal',                   phone: '+1-212-555-0402', linkedin: 'linkedin.com/in/niabrooks',           decisionMakerScore: 82 },
  { id: 'ct_99', leadId: 'lead_33', name: 'Paul Tanaka',   title: 'CEO',                                 email: 'paul.tanaka@quill.legal',                  phone: '+1-212-555-0428', linkedin: 'linkedin.com/in/paultanaka-ceo',      decisionMakerScore: 90 },

  // Whitford & Pace LLP
  { id: 'ct_100', leadId: 'lead_34', name: 'Eleanor Vance', title: 'Chief Information Security Officer', email: 'eleanor.vance@whitfordpace.com',           phone: '+1-212-555-0451', linkedin: 'linkedin.com/in/eleanorvance-ciso',   decisionMakerScore: 96 },
  { id: 'ct_101', leadId: 'lead_34', name: 'Grant Mosley', title: 'Director of IT',                      email: 'grant.mosley@whitfordpace.com',            phone: '+1-212-555-0477', linkedin: 'linkedin.com/in/grantmosley',         decisionMakerScore: 76 },
  { id: 'ct_102', leadId: 'lead_34', name: 'Iris Chamberlain', title: 'Managing Partner — Cyber Risk', email: 'iris.chamberlain@whitfordpace.com',         phone: '+1-212-555-0503', linkedin: 'linkedin.com/in/irischamberlain',     decisionMakerScore: 90 },

  // Ashbury Carter
  { id: 'ct_103', leadId: 'lead_35', name: 'Devon Hatch', title: 'Director of IT & Security',            email: 'devon.hatch@ashburycarter.com',            phone: '+1-312-555-0531', linkedin: 'linkedin.com/in/devonhatch',          decisionMakerScore: 86 },
  { id: 'ct_104', leadId: 'lead_35', name: 'Sloane Reilly', title: 'Partner — Risk Advisory',           email: 'sloane.reilly@ashburycarter.com',          phone: '+1-312-555-0557', linkedin: 'linkedin.com/in/sloanereilly',        decisionMakerScore: 82 },
  { id: 'ct_105', leadId: 'lead_35', name: 'Eduardo Ruiz', title: 'CFO',                                 email: 'eduardo.ruiz@ashburycarter.com',           phone: '+1-312-555-0583', linkedin: 'linkedin.com/in/eduardoruiz',         decisionMakerScore: 74 },

  // Crestmont Consulting
  { id: 'ct_106', leadId: 'lead_36', name: 'Tabitha Lin', title: 'Director of IT',                       email: 'tabitha.lin@crestmontco.com',              phone: '+1-617-555-0611', linkedin: 'linkedin.com/in/tabithalin',          decisionMakerScore: 82 },
  { id: 'ct_107', leadId: 'lead_36', name: 'Reggie Ashworth', title: 'Managing Director',               email: 'reggie.ashworth@crestmontco.com',          phone: '+1-617-555-0637', linkedin: 'linkedin.com/in/reggieashworth',      decisionMakerScore: 84 },
  { id: 'ct_108', leadId: 'lead_36', name: 'Naia Holiday', title: 'Head of People',                      email: 'naia.holiday@crestmontco.com',             phone: '+1-617-555-0663', linkedin: 'linkedin.com/in/naiaholiday',         decisionMakerScore: 60 },

  // Lindquist & Reeve
  { id: 'ct_109', leadId: 'lead_37', name: 'Owen Hartford', title: 'Director of IT & Security',         email: 'owen.hartford@lindquistreeve.com',         phone: '+1-650-555-0691', linkedin: 'linkedin.com/in/owenhartford',        decisionMakerScore: 89 },
  { id: 'ct_110', leadId: 'lead_37', name: 'Marcia Patel', title: 'Managing Partner',                    email: 'marcia.patel@lindquistreeve.com',          phone: '+1-650-555-0717', linkedin: 'linkedin.com/in/marciapatel',         decisionMakerScore: 92 },
  { id: 'ct_111', leadId: 'lead_37', name: 'Jasper Klein', title: 'COO',                                 email: 'jasper.klein@lindquistreeve.com',          phone: '+1-650-555-0743', linkedin: 'linkedin.com/in/jasperklein',         decisionMakerScore: 78 },

  // Northpoint Tax
  { id: 'ct_112', leadId: 'lead_38', name: 'Vincent Park', title: 'CIO',                                 email: 'vincent.park@northpointtax.com',           phone: '+1-214-555-0771', linkedin: 'linkedin.com/in/vincentpark-cio',     decisionMakerScore: 88 },
  { id: 'ct_113', leadId: 'lead_38', name: 'Lupita Mendez', title: 'Partner — Cyber & Risk Advisory',   email: 'lupita.mendez@northpointtax.com',          phone: '+1-214-555-0797', linkedin: 'linkedin.com/in/lupitamendez',        decisionMakerScore: 86 },
  { id: 'ct_114', leadId: 'lead_38', name: 'Trent Boswell', title: 'Director of Compliance',            email: 'trent.boswell@northpointtax.com',          phone: '+1-214-555-0823', linkedin: 'linkedin.com/in/trentboswell',        decisionMakerScore: 70 },

  // Hearthline Goods
  { id: 'ct_115', leadId: 'lead_39', name: 'Margot Reeves', title: 'VP Engineering',                     email: 'margot.reeves@hearthline.co',              phone: '+1-718-555-0851', linkedin: 'linkedin.com/in/margotreeves',        decisionMakerScore: 88 },
  { id: 'ct_116', leadId: 'lead_39', name: 'Diego Salinas', title: 'Director of Security',              email: 'diego.salinas@hearthline.co',              phone: '+1-718-555-0877', linkedin: 'linkedin.com/in/diegosalinas',        decisionMakerScore: 90 },
  { id: 'ct_117', leadId: 'lead_39', name: 'Amelie Roque', title: 'CFO',                                 email: 'amelie.roque@hearthline.co',               phone: '+1-718-555-0903', linkedin: 'linkedin.com/in/amelieroque-cfo',     decisionMakerScore: 76 },

  // Westmark Outdoor
  { id: 'ct_118', leadId: 'lead_40', name: 'Reid Calloway', title: 'CISO',                               email: 'reid.calloway@westmarkoutdoor.com',        phone: '+1-303-555-0931', linkedin: 'linkedin.com/in/reidcalloway-ciso',   decisionMakerScore: 95 },
  { id: 'ct_119', leadId: 'lead_40', name: 'Selene Park',  title: 'VP Digital & E-commerce',             email: 'selene.park@westmarkoutdoor.com',          phone: '+1-303-555-0957', linkedin: 'linkedin.com/in/selenepark',          decisionMakerScore: 80 },
  { id: 'ct_120', leadId: 'lead_40', name: 'Garrett Holm', title: 'Director, PCI Compliance',            email: 'garrett.holm@westmarkoutdoor.com',         phone: '+1-303-555-0983', linkedin: 'linkedin.com/in/garrettholm-pci',     decisionMakerScore: 82 },

  // Gildwater Apparel
  { id: 'ct_121', leadId: 'lead_41', name: 'Thalia Kim',   title: 'Head of Tech & Operations',           email: 'thalia.kim@gildwater.com',                 phone: '+1-310-555-1011', linkedin: 'linkedin.com/in/thaliakim',           decisionMakerScore: 86 },
  { id: 'ct_122', leadId: 'lead_41', name: 'Roman Avila',  title: 'CFO',                                 email: 'roman.avila@gildwater.com',                phone: '+1-310-555-1037', linkedin: 'linkedin.com/in/romanavila-cfo',      decisionMakerScore: 78 },
  { id: 'ct_123', leadId: 'lead_41', name: 'Sage Whitman', title: 'Founder & CEO',                       email: 'sage.whitman@gildwater.com',               phone: '+1-310-555-1063', linkedin: 'linkedin.com/in/sagewhitman',         decisionMakerScore: 90 },

  // Pinecrest Pet
  { id: 'ct_124', leadId: 'lead_42', name: 'Henry Beaumont', title: 'Director of IT',                    email: 'henry.beaumont@pinecrestpet.com',          phone: '+1-214-555-1091', linkedin: 'linkedin.com/in/henrybeaumont',       decisionMakerScore: 84 },
  { id: 'ct_125', leadId: 'lead_42', name: 'Joelle Park',  title: 'VP E-commerce',                       email: 'joelle.park@pinecrestpet.com',             phone: '+1-214-555-1117', linkedin: 'linkedin.com/in/joellepark',          decisionMakerScore: 78 },
  { id: 'ct_126', leadId: 'lead_42', name: 'Wesley Tran',  title: 'CFO',                                 email: 'wesley.tran@pinecrestpet.com',             phone: '+1-214-555-1143', linkedin: 'linkedin.com/in/wesleytran-cfo',      decisionMakerScore: 76 },

  // Stoneflower Beauty
  { id: 'ct_127', leadId: 'lead_43', name: 'Lana Costa',   title: 'CTO',                                 email: 'lana.costa@stoneflower.com',               phone: '+1-212-555-1171', linkedin: 'linkedin.com/in/lanacosta-cto',       decisionMakerScore: 88 },
  { id: 'ct_128', leadId: 'lead_43', name: 'Bryce Anand',  title: 'COO',                                 email: 'bryce.anand@stoneflower.com',              phone: '+1-212-555-1197', linkedin: 'linkedin.com/in/bryceanand',          decisionMakerScore: 80 },
  { id: 'ct_129', leadId: 'lead_43', name: 'Mira Sutton',  title: 'Founder & CEO',                       email: 'mira.sutton@stoneflower.com',              phone: '+1-212-555-1223', linkedin: 'linkedin.com/in/mirasutton-ceo',      decisionMakerScore: 92 },

  // Carriagehouse Marketplace
  { id: 'ct_130', leadId: 'lead_44', name: 'Niko Hartwell', title: 'Head of Trust & Safety',             email: 'niko.hartwell@carriagehouse.com',          phone: '+1-206-555-1251', linkedin: 'linkedin.com/in/nikohartwell',        decisionMakerScore: 88 },
  { id: 'ct_131', leadId: 'lead_44', name: 'Sienna Park',  title: 'VP Engineering',                      email: 'sienna.park@carriagehouse.com',            phone: '+1-206-555-1277', linkedin: 'linkedin.com/in/siennapark-eng',      decisionMakerScore: 84 },
  { id: 'ct_132', leadId: 'lead_44', name: 'Aaron Beck',   title: 'CFO',                                 email: 'aaron.beck@carriagehouse.com',             phone: '+1-206-555-1303', linkedin: 'linkedin.com/in/aaronbeck-cfo',       decisionMakerScore: 74 },

  // Lambda Grid Solutions
  { id: 'ct_133', leadId: 'lead_45', name: 'Eli Moreau',   title: 'CISO',                                email: 'eli.moreau@lambdagrid.com',                phone: '+1-916-555-1331', linkedin: 'linkedin.com/in/elimoreau-ciso',      decisionMakerScore: 97 },
  { id: 'ct_134', leadId: 'lead_45', name: 'Yvonne Pickett', title: 'Director, OT/SCADA Cybersecurity', email: 'yvonne.pickett@lambdagrid.com',            phone: '+1-916-555-1357', linkedin: 'linkedin.com/in/yvonnepickett',       decisionMakerScore: 90 },
  { id: 'ct_135', leadId: 'lead_45', name: 'Stuart Lacey', title: 'VP Operations',                       email: 'stuart.lacey@lambdagrid.com',              phone: '+1-916-555-1383', linkedin: 'linkedin.com/in/stuartlacey',         decisionMakerScore: 80 },

  // Pacific Bay Water
  { id: 'ct_136', leadId: 'lead_46', name: 'Dario Esparza', title: 'IT & Cybersecurity Manager',         email: 'dario.esparza@pacificbaywater.org',        phone: '+1-619-555-1411', linkedin: 'linkedin.com/in/darioesparza',        decisionMakerScore: 91 },
  { id: 'ct_137', leadId: 'lead_46', name: 'Helena Caldwell', title: 'General Manager',                  email: 'helena.caldwell@pacificbaywater.org',      phone: '+1-619-555-1437', linkedin: 'linkedin.com/in/helenacaldwell-gm',   decisionMakerScore: 84 },
  { id: 'ct_138', leadId: 'lead_46', name: 'Calvin Ross',  title: 'Director of Operations & SCADA',      email: 'calvin.ross@pacificbaywater.org',          phone: '+1-619-555-1463', linkedin: 'linkedin.com/in/calvinross-ot',       decisionMakerScore: 86 },

  // Quailridge University
  { id: 'ct_139', leadId: 'lead_47', name: 'Dean Whitford', title: 'CISO',                               email: 'dean.whitford@quailridge.edu',             phone: '+1-812-555-1491', linkedin: 'linkedin.com/in/deanwhitford-ciso',   decisionMakerScore: 93 },
  { id: 'ct_140', leadId: 'lead_47', name: 'Saoirse Lin',  title: 'CIO',                                 email: 'saoirse.lin@quailridge.edu',               phone: '+1-812-555-1517', linkedin: 'linkedin.com/in/saoirselin-cio',      decisionMakerScore: 88 },
  { id: 'ct_141', leadId: 'lead_47', name: 'Phillip Aaron', title: 'Vice President, Finance & Admin',    email: 'phillip.aaron@quailridge.edu',             phone: '+1-812-555-1543', linkedin: 'linkedin.com/in/phillipaaron',        decisionMakerScore: 76 },

  // Tier-One Defense Logistics
  { id: 'ct_142', leadId: 'lead_48', name: 'Kira Henneman', title: 'CISO & CMMC Lead',                   email: 'kira.henneman@tieronedl.com',              phone: '+1-256-555-1571', linkedin: 'linkedin.com/in/kirahenneman-ciso',   decisionMakerScore: 97 },
  { id: 'ct_143', leadId: 'lead_48', name: 'Marcus Doyle', title: 'VP Programs',                         email: 'marcus.doyle@tieronedl.com',               phone: '+1-256-555-1597', linkedin: 'linkedin.com/in/marcusdoyle',         decisionMakerScore: 82 },
  { id: 'ct_144', leadId: 'lead_48', name: 'Felicia Park', title: 'Director, FSO & Insider Threat',      email: 'felicia.park@tieronedl.com',               phone: '+1-256-555-1623', linkedin: 'linkedin.com/in/feliciapark-fso',     decisionMakerScore: 88 },

  // Greylock Pipeline
  { id: 'ct_145', leadId: 'lead_49', name: 'Russell Kade', title: 'Director of OT Cybersecurity',        email: 'russell.kade@greylockpipeline.com',        phone: '+1-918-555-1651', linkedin: 'linkedin.com/in/russellkade-ot',      decisionMakerScore: 92 },
  { id: 'ct_146', leadId: 'lead_49', name: 'Brenna Salazar', title: 'CIO',                              email: 'brenna.salazar@greylockpipeline.com',      phone: '+1-918-555-1677', linkedin: 'linkedin.com/in/brennasalazar-cio',   decisionMakerScore: 88 },
  { id: 'ct_147', leadId: 'lead_49', name: 'Hank Whitlow', title: 'VP HSE & Compliance',                 email: 'hank.whitlow@greylockpipeline.com',        phone: '+1-918-555-1703', linkedin: 'linkedin.com/in/hankwhitlow',         decisionMakerScore: 76 },

  // Coppermark School District
  { id: 'ct_148', leadId: 'lead_50', name: 'Maya Whitfield', title: 'Director of Technology',            email: 'maya.whitfield@coppermark.k12.az.us',      phone: '+1-602-555-1731', linkedin: 'linkedin.com/in/mayawhitfield',       decisionMakerScore: 90 },
  { id: 'ct_149', leadId: 'lead_50', name: 'Carlos Reyes', title: 'Superintendent',                      email: 'carlos.reyes@coppermark.k12.az.us',        phone: '+1-602-555-1757', linkedin: 'linkedin.com/in/carlosreyes-supt',    decisionMakerScore: 84 },
  { id: 'ct_150', leadId: 'lead_50', name: 'Jenna Atwell', title: 'Chief Financial Officer',             email: 'jenna.atwell@coppermark.k12.az.us',        phone: '+1-602-555-1783', linkedin: 'linkedin.com/in/jennaatwell-cfo',     decisionMakerScore: 76 },
];

export const signals: Signal[] = [
  // === Meridian Health Partners (lead_1) ===
  { id: 'sig_1',  leadId: 'lead_1', type: 'regulatory',     severity: 'high',     source: 'HHS OCR',           title: 'HIPAA Security Rule NPRM finalization expected Q3 2026',                       body: 'HHS OCR is expected to finalize the December 2024 NPRM mandating MFA, encryption at rest, vulnerability scanning, and IR testing. Meridian\'s last public risk analysis predates the NPRM.',                                                                               capturedAt: '2026-04-28T11:15:00Z' },
  { id: 'sig_2',  leadId: 'lead_1', type: 'peer_breach',    severity: 'high',     source: 'HHS Breach Portal', title: 'Two regional health systems disclosed Black Basta ransomware in March 2026',    body: 'Two Midwest health systems disclosed Black Basta-attributed ransomware affecting 1.4M patient records combined; Joint Commission inquiry opened.',                                                                                                                       capturedAt: '2026-04-12T09:30:00Z' },
  { id: 'sig_3',  leadId: 'lead_1', type: 'hiring',         severity: 'medium',   source: 'Workday',           title: 'Hiring 6 cybersecurity roles incl. Sr. SOC Analyst, IAM Engineer',              body: 'Six security postings opened in last 30 days suggest SOC capacity gaps and active modernization budget.',                                                                                                                                                                  capturedAt: '2026-04-30T14:00:00Z' },
  { id: 'sig_4',  leadId: 'lead_1', type: 'tech_vuln',      severity: 'medium',   source: 'Shodan',            title: 'Public-facing Citrix NetScaler instance detected',                              body: 'NetScaler ADC observed externally; CitrixBleed (CVE-2023-4966) and follow-on auth-bypass vulns continue to be actively exploited by ransomware affiliates.',                                                                                                              capturedAt: '2026-05-02T08:20:00Z' },
  { id: 'sig_5',  leadId: 'lead_1', type: 'industry_breach',severity: 'high',     source: 'Becker\'s Hospital', title: 'Change Healthcare echo: payers demanding monthly attestation from providers',  body: 'Following the Feb 2024 Change Healthcare incident, BCBS plans are requiring monthly third-party SOC 2 / HITRUST attestation packages from provider partners.',                                                                                                            capturedAt: '2026-04-18T16:45:00Z' },
  { id: 'sig_6',  leadId: 'lead_1', type: 'insurance',      severity: 'medium',   source: 'Marsh',             title: 'Cyber insurance renewal Q4 2026 — health-system pricing tightening',           body: 'Carriers pricing 18–32% premium increases on health systems without MFA-everywhere and 24/7 SOC monitoring; underwriting questionnaires now ask for MDR vendor by name.',                                                                                                  capturedAt: '2026-04-25T10:00:00Z' },

  // === Cardinal Pediatric Network (lead_2) ===
  { id: 'sig_7',  leadId: 'lead_2', type: 'regulatory',     severity: 'high',     source: 'HHS OCR',           title: 'HIPAA Security Rule NPRM applies to pediatric data',                            body: 'NPRM\'s mandatory MFA and encryption-at-rest provisions land especially hard on pediatric networks where parent/guardian portals expand the identity perimeter.',                                                                                                            capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_8',  leadId: 'lead_2', type: 'peer_breach',    severity: 'high',     source: 'news',              title: 'Pediatric clinic chain in Texas disclosed ransomware in February 2026',         body: 'A 40-clinic pediatric network disclosed Cl0p-attributed data theft via a managed file transfer appliance, reminiscent of the 2023 MOVEit campaign.',                                                                                                                       capturedAt: '2026-03-05T08:30:00Z' },
  { id: 'sig_9',  leadId: 'lead_2', type: 'ma',             severity: 'medium',   source: 'PitchBook',         title: 'PE sponsor exploring add-on acquisitions',                                      body: 'Welsh Carson is exploring add-on practices in Florida and Tennessee; M&A drives integration projects that historically expose identity sprawl and BAA gaps.',                                                                                                              capturedAt: '2026-04-15T12:00:00Z' },
  { id: 'sig_10', leadId: 'lead_2', type: 'tech_vuln',      severity: 'medium',   source: 'Censys',            title: 'Legacy SonicWall TZ appliance detected at 3 clinic locations',                  body: 'TZ-series appliances on outdated firmware; SonicWall has been actively exploited by Akira and BianLian ransomware affiliates throughout 2024–2025.',                                                                                                                       capturedAt: '2026-04-30T09:50:00Z' },
  { id: 'sig_11', leadId: 'lead_2', type: 'compliance_audit',severity: 'medium',  source: 'BAA disclosure',    title: 'Major payer requested updated SOC 2 Type II attestation in March',              body: 'Cardinal\'s largest payer partner requested fresh SOC 2 Type II evidence for in-network credentialing — last attestation covered period ending Sep 2025.',                                                                                                                  capturedAt: '2026-03-22T14:10:00Z' },
  { id: 'sig_12', leadId: 'lead_2', type: 'hiring',         severity: 'low',      source: 'LinkedIn',          title: 'Posted Director of IT Security role 18 days ago',                               body: 'Director of IT Security req still open; role explicitly mentions HIPAA, HITRUST, and "build a 24/7 monitoring program."',                                                                                                                                                  capturedAt: '2026-04-25T11:30:00Z' },

  // === Northwind Diagnostics (lead_3) ===
  { id: 'sig_13', leadId: 'lead_3', type: 'industry_breach',severity: 'high',     source: 'HHS Breach Portal', title: 'National lab disclosed 9.5M-record breach in late 2024 — class actions ongoing',body: 'A US clinical lab disclosed a multi-million-record breach via a third-party integration; class-action settlements topping $30M are reshaping payer scrutiny of lab vendors.',                                                                                              capturedAt: '2026-04-08T13:20:00Z' },
  { id: 'sig_14', leadId: 'lead_3', type: 'regulatory',     severity: 'medium',   source: 'CAP / CLIA',        title: 'CAP inspections increasingly include cybersecurity controls review',           body: 'College of American Pathologists checklist updates added explicit IT security and PHI-handling control reviews — labs failing these face inspection deficiencies.',                                                                                                       capturedAt: '2026-04-12T10:00:00Z' },
  { id: 'sig_15', leadId: 'lead_3', type: 'tech_vuln',      severity: 'high',     source: 'Shodan',            title: 'Externally exposed RDP gateway on legacy Windows Server 2016',                  body: 'RDP-over-TLS gateway identified at HQ subnet running on EOL OS; Server 2016 mainstream support ended Jan 2022 with extended support fading.',                                                                                                                              capturedAt: '2026-05-01T08:45:00Z' },
  { id: 'sig_16', leadId: 'lead_3', type: 'peer_breach',    severity: 'medium',   source: 'news',              title: 'Regional imaging center hit by ALPHV/BlackCat in Q4 2025',                      body: 'A 12-site regional imaging center disclosed BlackCat ransomware; recovery cost reported >$8M and triggered cyber insurance non-renewal.',                                                                                                                                  capturedAt: '2026-03-30T16:20:00Z' },
  { id: 'sig_17', leadId: 'lead_3', type: 'insurance',      severity: 'medium',   source: 'broker',            title: 'Cyber renewal due August — broker indicates "MDR or non-renewal"',              body: 'Renewing broker indicated current carrier will non-renew without 24/7 MDR coverage and documented vulnerability management cadence.',                                                                                                                                     capturedAt: '2026-04-20T15:00:00Z' },
  { id: 'sig_18', leadId: 'lead_3', type: 'hiring',         severity: 'low',      source: 'Indeed',            title: 'Hired first-ever Director of IT four months ago',                               body: 'New Director of IT joined in January from a 200-bed hospital system; first-time security leadership often signals board-level mandate.',                                                                                                                                   capturedAt: '2026-04-02T09:00:00Z' },

  // === PrismCare Health Plans (lead_4) ===
  { id: 'sig_19', leadId: 'lead_4', type: 'regulatory',     severity: 'high',     source: 'HHS OCR',           title: 'HIPAA Security Rule NPRM hits payers especially hard',                          body: 'NPRM\'s vulnerability scanning, encryption-at-rest, and IR testing requirements raise the bar for member-data systems; payer plans typically span 50–200 SaaS integrations.',                                                                                              capturedAt: '2026-04-28T12:00:00Z' },
  { id: 'sig_20', leadId: 'lead_4', type: 'industry_breach',severity: 'critical', source: 'news',              title: 'Change Healthcare incident still reverberating: ALPHV → RansomHub split',       body: 'Feb 2024 Change Healthcare attack ($872M+ disclosed losses) and the ALPHV affiliate that became RansomHub remain top board-level concerns for payer CISOs.',                                                                                                              capturedAt: '2026-04-10T14:30:00Z' },
  { id: 'sig_21', leadId: 'lead_4', type: 'compliance_audit',severity: 'high',    source: 'CMS',               title: 'CMS Medicare Advantage star ratings now factor cyber posture',                  body: 'CMS audit guidance explicitly references cyber-resilience expectations for MA plan operational performance.',                                                                                                                                                              capturedAt: '2026-04-05T11:00:00Z' },
  { id: 'sig_22', leadId: 'lead_4', type: 'exec_change',    severity: 'medium',   source: 'press release',     title: 'New Chief Risk Officer joined in March 2026',                                   body: 'New CRO joined from a top-5 health insurer; first 90 days historically include cyber-program reviews.',                                                                                                                                                                    capturedAt: '2026-03-15T09:00:00Z' },
  { id: 'sig_23', leadId: 'lead_4', type: 'tech_vuln',      severity: 'medium',   source: 'GitHub mentions',   title: 'Public Salesforce community pages with overly-permissive guest access',          body: 'Salesforce Health Cloud Experience Cloud sites detected with potential guest-user object access — pattern responsible for multiple 2024 healthcare data leaks.',                                                                                                          capturedAt: '2026-04-26T13:40:00Z' },
  { id: 'sig_24', leadId: 'lead_4', type: 'hiring',         severity: 'medium',   source: 'LinkedIn',          title: '11 cybersecurity reqs open including Cloud Security Architect',                 body: 'Heavy hiring against AWS, Splunk, and IAM skill sets — modernization in flight.',                                                                                                                                                                                          capturedAt: '2026-04-29T10:15:00Z' },

  // === AltaMed Devices (lead_5) ===
  { id: 'sig_25', leadId: 'lead_5', type: 'regulatory',     severity: 'high',     source: 'FDA',               title: 'FDA premarket cybersecurity guidance now mandatory (Section 524B)',             body: 'FDA premarket submissions for cyber devices must include SBOM, vulnerability management plan, and post-market monitoring per Section 524B of the FD&C Act.',                                                                                                                capturedAt: '2026-04-22T10:30:00Z' },
  { id: 'sig_26', leadId: 'lead_5', type: 'industry_breach',severity: 'high',     source: 'news',              title: 'Two infusion-pump manufacturers disclosed breaches in 2025',                    body: 'Both incidents traced to insecure update servers; FDA issued safety communications and reset 510(k) cyber expectations.',                                                                                                                                                  capturedAt: '2026-03-18T15:00:00Z' },
  { id: 'sig_27', leadId: 'lead_5', type: 'ma',             severity: 'medium',   source: 'press release',     title: 'Acquired smaller competitor in Feb 2026 — integration in progress',             body: 'Tuck-in acquisition of a 90-person device firm; integration projects traditionally surface identity sprawl, AD trust gaps, and SBOM mismatches.',                                                                                                                          capturedAt: '2026-02-20T11:00:00Z' },
  { id: 'sig_28', leadId: 'lead_5', type: 'tech_vuln',      severity: 'medium',   source: 'CISA KEV',          title: 'PTC Windchill PLM vulnerabilities in CISA KEV 2025',                            body: 'Multiple Windchill CVEs added to CISA KEV in 2025; PLM systems contain device design data attractive to nation-state and IP-theft actors.',                                                                                                                               capturedAt: '2026-04-14T09:50:00Z' },
  { id: 'sig_29', leadId: 'lead_5', type: 'compliance_audit',severity: 'medium',  source: 'customer',          title: 'Largest hospital customer requesting third-party risk packet quarterly',        body: 'Top customer increased third-party risk reviews from annual to quarterly; common across health-system buyers post-Change Healthcare.',                                                                                                                                     capturedAt: '2026-04-08T13:25:00Z' },
  { id: 'sig_30', leadId: 'lead_5', type: 'hiring',         severity: 'low',      source: 'LinkedIn',          title: 'Posted Sr. Product Security Engineer role',                                     body: 'Senior product-security req mentions SBOM, IEC 62304, threat modeling — clear product-security maturation.',                                                                                                                                                               capturedAt: '2026-04-26T08:30:00Z' },

  // === Helix Telemedicine (lead_6) ===
  { id: 'sig_31', leadId: 'lead_6', type: 'compliance_audit',severity: 'high',    source: 'customer',          title: 'Enterprise health-system customer requested HITRUST r2 by Q4 2026',             body: 'Top-3 customer made HITRUST r2 a renewal condition; HITRUST r2 typically takes 6–9 months and ~$300K–$600K in advisory + audit fees.',                                                                                                                                     capturedAt: '2026-04-16T14:00:00Z' },
  { id: 'sig_32', leadId: 'lead_6', type: 'regulatory',     severity: 'high',     source: 'HHS OCR',           title: 'Telehealth flexibilities ending — full HIPAA enforcement returned',             body: 'Pandemic-era OCR enforcement discretion has fully sunset; telehealth platforms now subject to standard HIPAA Security Rule scrutiny including the proposed NPRM.',                                                                                                         capturedAt: '2026-04-04T10:30:00Z' },
  { id: 'sig_33', leadId: 'lead_6', type: 'funding',        severity: 'medium',   source: 'Crunchbase',        title: 'Closed Series C ($120M) in Q4 2024',                                            body: 'Series C close historically expands attack surface (new geographies, M&A); board often mandates upgraded security program within 18 months.',                                                                                                                              capturedAt: '2026-04-01T12:00:00Z' },
  { id: 'sig_34', leadId: 'lead_6', type: 'tech_vuln',      severity: 'medium',   source: 'GitHub',            title: 'Public repo references Auth0 tenant config; potential token leak surface',      body: 'Open-source repos reference Auth0 tenant identifiers; review needed to confirm no client secrets or rotation gaps.',                                                                                                                                                       capturedAt: '2026-04-30T10:00:00Z' },
  { id: 'sig_35', leadId: 'lead_6', type: 'industry_breach',severity: 'medium',   source: 'news',              title: 'Telehealth competitor disclosed scraping incident affecting 2.1M users',        body: 'A peer telehealth platform disclosed unauthorized data scraping via authenticated API endpoints — bot-management and rate-limiting now table stakes for telehealth boards.',                                                                                              capturedAt: '2026-03-25T09:45:00Z' },
  { id: 'sig_36', leadId: 'lead_6', type: 'hiring',         severity: 'low',      source: 'LinkedIn',          title: 'Hiring Application Security Engineer and Senior SRE',                           body: 'AppSec + SRE hiring suggests platform-hardening sprint; good window for advisory + tooling conversation.',                                                                                                                                                                  capturedAt: '2026-04-28T11:20:00Z' },

  // === Stoneridge Behavioral Health (lead_7) ===
  { id: 'sig_37', leadId: 'lead_7', type: 'regulatory',     severity: 'high',     source: 'SAMHSA',            title: '42 CFR Part 2 alignment with HIPAA finalized — increased scrutiny',             body: 'Recent 42 CFR Part 2 updates align SUD record handling more closely with HIPAA; behavioral-health providers face new attestation expectations from payers.',                                                                                                              capturedAt: '2026-04-10T14:30:00Z' },
  { id: 'sig_38', leadId: 'lead_7', type: 'industry_breach',severity: 'high',     source: 'news',              title: 'Multi-state behavioral health network disclosed Black Basta in Jan 2026',       body: 'Behavioral-health-specific PHI (mental-health diagnoses, SUD records) is unusually sensitive and frequently targeted; recovery topped $14M.',                                                                                                                              capturedAt: '2026-02-08T10:00:00Z' },
  { id: 'sig_39', leadId: 'lead_7', type: 'tech_vuln',      severity: 'medium',   source: 'BitSight-style',    title: 'External rating downgraded — open SMB ports across 4 facilities',               body: 'Externally observable SMB exposure across multiple clinic sites — common ransomware initial-access vector.',                                                                                                                                                              capturedAt: '2026-04-23T11:00:00Z' },
  { id: 'sig_40', leadId: 'lead_7', type: 'compliance_audit',severity: 'medium',  source: 'state',             title: 'CO state audit identified gaps in IR plan and BAAs',                            body: 'Recent state DORA-equivalent audit flagged out-of-date BAAs and untested IR plan; remediation timeline 12 months.',                                                                                                                                                        capturedAt: '2026-04-02T15:30:00Z' },
  { id: 'sig_41', leadId: 'lead_7', type: 'insurance',      severity: 'medium',   source: 'broker',            title: 'Renewal Q3 — carrier now requires segmented OT/Clinical network',               body: 'Renewing carrier added clinical network segmentation as a binder requirement.',                                                                                                                                                                                            capturedAt: '2026-04-18T13:00:00Z' },
  { id: 'sig_42', leadId: 'lead_7', type: 'hiring',         severity: 'low',      source: 'Workday',           title: 'Posted Cybersecurity Analyst (1st security-dedicated role)',                    body: 'First-ever dedicated security analyst posting — board-level investment signal.',                                                                                                                                                                                          capturedAt: '2026-04-25T10:45:00Z' },

  // === Emberline Senior Living (lead_8) ===
  { id: 'sig_43', leadId: 'lead_8', type: 'industry_breach',severity: 'high',     source: 'news',              title: 'National SNF chain disclosed ransomware in Q1 2026 — care delays reported',     body: 'A 200-facility skilled-nursing chain disclosed ransomware that delayed medication administration; CMS imposed civil monetary penalties.',                                                                                                                                  capturedAt: '2026-02-28T09:30:00Z' },
  { id: 'sig_44', leadId: 'lead_8', type: 'regulatory',     severity: 'medium',   source: 'CMS',               title: 'CMS emergency preparedness rule now references cyber resilience',               body: 'CMS surveyors increasingly request cyber tabletop evidence as part of emergency preparedness compliance.',                                                                                                                                                                 capturedAt: '2026-04-15T12:00:00Z' },
  { id: 'sig_45', leadId: 'lead_8', type: 'tech_vuln',      severity: 'medium',   source: 'Shodan',            title: 'Citrix Gateway exposed across 18 facilities, 2 unpatched per CVE-2023-4966',    body: 'Public Citrix Gateway endpoints across the portfolio with two facilities still missing the CitrixBleed patch released Oct 2023.',                                                                                                                                          capturedAt: '2026-05-02T11:15:00Z' },
  { id: 'sig_46', leadId: 'lead_8', type: 'peer_breach',    severity: 'medium',   source: 'news',              title: 'Florida SNF operator disclosed PHI breach affecting 240k residents',            body: 'Phishing-led breach at a comparable Florida SNF operator; class-action and AG investigation pending.',                                                                                                                                                                     capturedAt: '2026-03-12T13:45:00Z' },
  { id: 'sig_47', leadId: 'lead_8', type: 'compliance_audit',severity: 'low',     source: 'audit firm',        title: 'Annual SOC 2 audit due August',                                                 body: 'PE sponsor requires audited security posture; recurring annual cycle.',                                                                                                                                                                                                    capturedAt: '2026-04-05T09:00:00Z' },
  { id: 'sig_48', leadId: 'lead_8', type: 'insurance',      severity: 'medium',   source: 'broker',            title: 'Cyber premium renewal up 24% — MFA gaps cited',                                 body: 'Renewing broker quoted 24% premium hike citing partial MFA coverage and lack of MDR.',                                                                                                                                                                                     capturedAt: '2026-04-20T15:00:00Z' },

  // === Volterra Financial (lead_9) ===
  { id: 'sig_49', leadId: 'lead_9', type: 'regulatory',     severity: 'high',     source: 'NYDFS',             title: 'NYDFS Part 500 amendment phase 4 deadline Nov 1 2025 (annual cycle live)',      body: 'NYDFS Part 500 amended requirements (CISO-signed compliance certifications, MFA for all access, IR/BCDR testing) are now in force; first annual cycle audits underway in 2026.',                                                                                            capturedAt: '2026-04-26T10:00:00Z' },
  { id: 'sig_50', leadId: 'lead_9', type: 'industry_breach',severity: 'high',     source: 'news',              title: 'Snowflake/UNC5537 echo: customer-credential attacks still ongoing',             body: 'May 2024 UNC5537 campaign abused stolen Snowflake credentials at 165+ customers; lookalike campaigns continued through 2025–2026 against fintechs.',                                                                                                                       capturedAt: '2026-04-08T11:30:00Z' },
  { id: 'sig_51', leadId: 'lead_9', type: 'funding',        severity: 'medium',   source: 'press release',     title: 'Closed $340M Series D in late 2024 — IPO chatter in S-1 prep',                  body: 'Series D close + IPO posture historically triggers SOX readiness, deeper SOC 2, and SEC cyber-disclosure-rule preparation.',                                                                                                                                                capturedAt: '2026-03-30T14:00:00Z' },
  { id: 'sig_52', leadId: 'lead_9', type: 'tech_vuln',      severity: 'medium',   source: 'Wiz/CSPM',          title: 'Public S3 bucket policy detected with overly-permissive cross-account access',  body: 'Recent CSPM scan flagged a non-prod bucket with cross-account read; common pattern that has caused multiple 2024–2025 fintech data exposures.',                                                                                                                            capturedAt: '2026-05-01T09:30:00Z' },
  { id: 'sig_53', leadId: 'lead_9', type: 'compliance_audit',severity: 'high',    source: 'partner bank',      title: 'Sponsor bank demanding quarterly third-party risk packet',                       body: 'Sponsor bank elevated third-party risk cadence post-Synapse / banking-as-a-service turbulence; quarterly packets are now standard.',                                                                                                                                       capturedAt: '2026-04-12T13:00:00Z' },
  { id: 'sig_54', leadId: 'lead_9', type: 'hiring',         severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Detection Engineer, Cloud Security Architect, GRC Analyst',              body: 'Three security postings open simultaneously — modernization budget plus pipeline of work.',                                                                                                                                                                                capturedAt: '2026-04-30T11:00:00Z' },

  // === Brightline Capital (lead_10) ===
  { id: 'sig_55', leadId: 'lead_10', type: 'regulatory',    severity: 'high',     source: 'CFPB',              title: 'CFPB Section 1033 open-banking rule reshapes consumer data handling',           body: 'CFPB 1033 rule places new authentication, data-minimization, and security requirements on consumer-permissioned data flows.',                                                                                                                                              capturedAt: '2026-04-20T10:00:00Z' },
  { id: 'sig_56', leadId: 'lead_10', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'BNPL competitor disclosed account-takeover affecting 600k users',               body: 'Credential-stuffing-led ATO at a peer BNPL lender; bot-management, MFA, and step-up auth now table stakes.',                                                                                                                                                               capturedAt: '2026-03-22T15:00:00Z' },
  { id: 'sig_57', leadId: 'lead_10', type: 'tech_vuln',     severity: 'medium',   source: 'GitHub',            title: 'Stale OAuth client IDs in archived repos',                                      body: 'Archived public repos reference OAuth client IDs and webhook URLs; rotation hygiene needs review.',                                                                                                                                                                        capturedAt: '2026-04-26T09:30:00Z' },
  { id: 'sig_58', leadId: 'lead_10', type: 'compliance_audit',severity: 'medium', source: 'partner bank',      title: 'Sponsor bank requested SOC 2 Type II + pen test attestation in March',          body: 'Bank partner requested fresh SOC 2 + recent pen test; window of activity for advisory + remediation.',                                                                                                                                                                     capturedAt: '2026-03-18T14:00:00Z' },
  { id: 'sig_59', leadId: 'lead_10', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Posted "Head of Security & Compliance" 22 days ago',                            body: 'Senior security role open with mandate to "build the GRC and detection program from current foundation."',                                                                                                                                                                 capturedAt: '2026-04-12T08:45:00Z' },
  { id: 'sig_60', leadId: 'lead_10', type: 'insurance',     severity: 'low',      source: 'broker',            title: 'Cyber insurance renewal Q3 2026',                                               body: 'Renewal scheduled in roughly 90 days — typical window for posture upgrades.',                                                                                                                                                                                              capturedAt: '2026-04-30T13:30:00Z' },

  // === Cobalt Payments (lead_11) ===
  { id: 'sig_61', leadId: 'lead_11', type: 'regulatory',    severity: 'critical', source: 'PCI SSC',           title: 'PCI DSS 4.0 mandatory since April 1, 2025 — full enforcement in 2026 audits',   body: 'All "best practice until" PCI DSS 4.0 controls became mandatory April 1 2025; 2026 ROC audits are the first to fully enforce them.',                                                                                                                                       capturedAt: '2026-04-26T10:00:00Z' },
  { id: 'sig_62', leadId: 'lead_11', type: 'regulatory',    severity: 'high',     source: 'NYDFS / FFIEC',     title: 'B2B payments processors increasingly subject to FFIEC examination',             body: 'FFIEC and state regulators expanding scrutiny of payment processors; FFIEC CAT and Ransomware Self-Assessment Tool referenced in exams.',                                                                                                                                  capturedAt: '2026-04-12T11:30:00Z' },
  { id: 'sig_63', leadId: 'lead_11', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'ICBC ransomware echo continues to shape payments-industry posture',             body: 'November 2023 ICBC LockBit incident remains the case study for treasury & payments cyber-resilience board conversations.',                                                                                                                                                 capturedAt: '2026-04-04T13:00:00Z' },
  { id: 'sig_64', leadId: 'lead_11', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'MuleSoft Anypoint integration logs flowing to a legacy Splunk index without TLS verification', body: 'Internal CSPM/observability scan flagged TLS verification disabled on cross-region API ingestion — privileged-credential exposure risk.',                                                                                                              capturedAt: '2026-04-30T15:00:00Z' },
  { id: 'sig_65', leadId: 'lead_11', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring 8 security/risk roles incl. Threat Intel Lead and PCI QSA Lead',         body: 'Eight open security/risk reqs reflect both audit-cycle workload and program expansion.',                                                                                                                                                                                   capturedAt: '2026-04-28T09:00:00Z' },
  { id: 'sig_66', leadId: 'lead_11', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Top-10 enterprise customer requested updated PCI ROC + HIPAA-adjacent attestation', body: 'Largest customer requested fresh PCI ROC plus a "BAA-style" attestation for healthcare-payments use cases.',                                                                                                                                                          capturedAt: '2026-04-22T12:30:00Z' },

  // === Anchorpoint Wealth (lead_12) ===
  { id: 'sig_67', leadId: 'lead_12', type: 'regulatory',    severity: 'critical', source: 'SEC',               title: 'SEC cyber-disclosure rule fully in effect — 4-business-day Form 8-K trigger',    body: 'SEC rule effective Dec 2023 requires public RIAs and broker-dealers to disclose material cyber incidents within 4 business days; 2026 enforcement actions ramping.',                                                                                                       capturedAt: '2026-04-26T10:30:00Z' },
  { id: 'sig_68', leadId: 'lead_12', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Top-10 RIA disclosed third-party breach via portfolio accounting vendor',       body: 'Q1 2026 disclosure traced to a portfolio-accounting SaaS provider; third-party-risk programs at peer RIAs are getting board-level attention.',                                                                                                                            capturedAt: '2026-03-28T14:00:00Z' },
  { id: 'sig_69', leadId: 'lead_12', type: 'tech_vuln',     severity: 'medium',   source: 'Microsoft 365',     title: 'Legacy authentication still enabled on a subset of mailboxes',                  body: 'Legacy auth (basic auth/POP/IMAP) still observed for advisor mailboxes — known initial-access vector for business-email compromise.',                                                                                                                                       capturedAt: '2026-04-30T10:00:00Z' },
  { id: 'sig_70', leadId: 'lead_12', type: 'compliance_audit',severity: 'medium', source: 'OCIE',              title: 'SEC EXAMS division 2026 priorities include cybersecurity & resilience',         body: 'EXAMS division\'s 2026 priorities re-emphasize cybersecurity, identity controls, and operational resilience for RIAs and broker-dealers.',                                                                                                                                 capturedAt: '2026-04-08T11:00:00Z' },
  { id: 'sig_71', leadId: 'lead_12', type: 'exec_change',   severity: 'low',      source: 'news',              title: 'New CISO joined in Feb 2026 from a top-3 custodian',                            body: 'New CISO from a top-3 custodian; pattern is to launch a 90-day program review.',                                                                                                                                                                                           capturedAt: '2026-02-15T09:00:00Z' },
  { id: 'sig_72', leadId: 'lead_12', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber insurance renewal Q4 — phishing simulation results required',             body: 'Carrier requesting evidence of phishing-simulation cadence and click-rate trend; standard 2026 underwriting question.',                                                                                                                                                    capturedAt: '2026-04-20T13:00:00Z' },

  // === Lattice Lending (lead_13) ===
  { id: 'sig_73', leadId: 'lead_13', type: 'funding',       severity: 'medium',   source: 'Crunchbase',        title: 'Closed Series B ($55M) in Oct 2024 — building first security function',         body: 'Series B funding + sponsor expectations historically trigger SOC 2 Type II readiness within 12 months.',                                                                                                                                                                   capturedAt: '2026-04-15T10:00:00Z' },
  { id: 'sig_74', leadId: 'lead_13', type: 'regulatory',    severity: 'high',     source: 'CFPB',              title: 'CFPB SBL Rule (Section 1071) compliance dates approaching for non-banks',       body: 'Phased compliance dates for small-business-lending data collection and reporting; 1071 raises both data-handling and security expectations.',                                                                                                                              capturedAt: '2026-04-10T13:00:00Z' },
  { id: 'sig_75', leadId: 'lead_13', type: 'compliance_audit',severity: 'high',   source: 'partner bank',      title: 'Sponsor bank demanding SOC 2 Type II by Q4 2026 to keep program live',          body: 'Sponsor bank made SOC 2 Type II a condition for continued lending program — common post-Synapse posture across BaaS sponsor banks.',                                                                                                                                       capturedAt: '2026-04-12T11:00:00Z' },
  { id: 'sig_76', leadId: 'lead_13', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'No quarantine policy on workforce GitHub OAuth apps',                           body: 'OAuth-app sprawl across the engineering GitHub org without periodic review — recurring supply-chain risk pattern.',                                                                                                                                                        capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_77', leadId: 'lead_13', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted "Head of Engineering & Security" combo role',                            body: 'Combined engineering/security leader role — consolidation typical at Series-B fintechs before splitting under a CISO.',                                                                                                                                                    capturedAt: '2026-04-23T15:00:00Z' },
  { id: 'sig_78', leadId: 'lead_13', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Peer SMB lender disclosed vendor breach in Feb 2026',                           body: 'A comparable SMB lender disclosed a breach via a third-party email-marketing vendor; class-action filed.',                                                                                                                                                                 capturedAt: '2026-02-26T13:30:00Z' },

  // === Selene Capital Markets (lead_14) ===
  { id: 'sig_79', leadId: 'lead_14', type: 'regulatory',    severity: 'high',     source: 'SEC / CFTC',        title: 'Reg SCI scrutiny expanding to large prop trading firms',                        body: 'Recent SEC and CFTC commentary suggests Reg SCI-style operational-resilience expectations creeping toward large proprietary trading shops.',                                                                                                                               capturedAt: '2026-04-24T10:00:00Z' },
  { id: 'sig_80', leadId: 'lead_14', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'Major prop trading firm hit by destructive wiper in 2025 — $40M+ losses',       body: 'Industry-disclosed wiper attack at a peer firm reset the industry conversation on segmentation and trade-floor isolation.',                                                                                                                                                capturedAt: '2026-03-12T11:00:00Z' },
  { id: 'sig_81', leadId: 'lead_14', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'Multiple Active Directory CVEs in CISA KEV applicable to on-prem-heavy estates',body: 'On-prem-heavy AD estates remain top targets; recent KEV additions affect Kerberos and certificate services.',                                                                                                                                                              capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_82', leadId: 'lead_14', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Insider-Threat Lead and Detection Engineer',                             body: 'Two specialized hires reflect concern about insider risk on the trade floor and detection-program maturity.',                                                                                                                                                              capturedAt: '2026-04-26T08:30:00Z' },
  { id: 'sig_83', leadId: 'lead_14', type: 'compliance_audit',severity: 'medium', source: 'CFTC',              title: 'CFTC examiners specifically asked for OT/colo-cage cyber posture documentation', body: 'Recent CFTC exam requested documentation on cyber controls within Equinix colo cages and trade-execution networks.',                                                                                                                                                       capturedAt: '2026-04-08T13:30:00Z' },
  { id: 'sig_84', leadId: 'lead_14', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal questionnaire now requires Tanium/CrowdStrike-equivalent EDR',     body: 'Underwriters increasingly require named EDR coverage at >95% of endpoints for prop-trading risk class.',                                                                                                                                                                  capturedAt: '2026-04-20T14:00:00Z' },

  // === Gradient Crypto (lead_15) ===
  { id: 'sig_85', leadId: 'lead_15', type: 'regulatory',    severity: 'critical', source: 'SEC / NYDFS',       title: 'NYDFS BitLicense + SEC custody rules tightening — quarterly attestations',       body: 'NYDFS BitLicense holders subject to expanding cyber attestation cadence; SEC custody rule changes raise the bar on segregation of customer assets.',                                                                                                                       capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_86', leadId: 'lead_15', type: 'industry_breach',severity: 'critical',source: 'Chainalysis',       title: 'Crypto-exchange theft losses topped $2.2B in 2024 — DPRK-attributed surge',     body: 'Lazarus and other DPRK clusters drove a record year of exchange thefts in 2024 with elevated 2025 levels — board-level concern at every exchange.',                                                                                                                       capturedAt: '2026-04-08T10:00:00Z' },
  { id: 'sig_87', leadId: 'lead_15', type: 'tech_vuln',     severity: 'high',     source: 'GitHub',            title: 'Multiple npm typosquatting packages targeting Fireblocks SDK observed',          body: 'Recent typosquatting campaigns against crypto-custody SDKs underscore supply-chain hardening for the engineering toolchain.',                                                                                                                                              capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_88', leadId: 'lead_15', type: 'compliance_audit',severity: 'medium', source: 'partner bank',      title: 'Banking partner requesting SOC 2 + ISO 27001 by year-end',                       body: 'Banking relationship contingent on dual SOC 2 + ISO 27001 attestation; common post-FTX correspondent-banking posture.',                                                                                                                                                    capturedAt: '2026-04-12T14:00:00Z' },
  { id: 'sig_89', leadId: 'lead_15', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring CISO and Sr. Threat Intel Analyst',                                      body: 'Inaugural CISO role + dedicated threat-intel hire — strong programmatic signal.',                                                                                                                                                                                          capturedAt: '2026-04-24T11:30:00Z' },
  { id: 'sig_90', leadId: 'lead_15', type: 'funding',       severity: 'low',      source: 'Crunchbase',        title: 'Series B ($60M) closed late 2024',                                              body: 'Series B funding extends runway and typically funds compliance & security buildout.',                                                                                                                                                                                     capturedAt: '2026-04-02T10:00:00Z' },

  // === Tidewater Mutual (lead_16) ===
  { id: 'sig_91', leadId: 'lead_16', type: 'regulatory',    severity: 'high',     source: 'NCUA',              title: 'NCUA cyber incident notification rule (72-hour) fully active',                  body: 'NCUA\'s 72-hour cyber incident notification requirement has been in force since Sep 2023; examiner expectations on detection capability are climbing.',                                                                                                                    capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_92', leadId: 'lead_16', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Mid-size credit union disclosed Akira ransomware in Q1 2026 — member services down 6 days', body: 'Peer credit union had member-facing services offline for 6 days; recovery estimated $4–7M plus regulatory fines.',                                                                                                                                                  capturedAt: '2026-02-18T13:00:00Z' },
  { id: 'sig_93', leadId: 'lead_16', type: 'tech_vuln',     severity: 'high',     source: 'CISA',              title: 'Fiserv DNA core banking platform CVE chain disclosed in 2025',                  body: 'Vulnerability chain in core banking middleware required emergency patching; credit unions on Fiserv stack should validate patch posture.',                                                                                                                                 capturedAt: '2026-04-04T15:30:00Z' },
  { id: 'sig_94', leadId: 'lead_16', type: 'compliance_audit',severity: 'medium', source: 'NCUA',              title: 'NCUA exam scheduled Q3 2026 — ACET-aligned',                                    body: 'Upcoming NCUA exam will use ACET; documented evidence required across baseline + evolving maturity domains.',                                                                                                                                                              capturedAt: '2026-04-12T10:00:00Z' },
  { id: 'sig_95', leadId: 'lead_16', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Information Security Manager and SOC Analyst (24x7 coverage build)',     body: 'Hiring profile signals 24x7 SOC buildout from current 9-5 in-house posture.',                                                                                                                                                                                              capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_96', leadId: 'lead_16', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber insurance underwriter requiring tested IR plan for renewal',              body: 'Underwriter requested evidence of tabletop exercise within last 12 months as a binder condition.',                                                                                                                                                                         capturedAt: '2026-04-22T14:00:00Z' },

  // === Forgewright Industries (lead_17) ===
  { id: 'sig_97', leadId: 'lead_17', type: 'regulatory',    severity: 'critical', source: 'DoD CIO',           title: 'CMMC 2.0 contracting clauses appearing in DoD solicitations through 2026',     body: 'CMMC 2.0 phased rollout means new DoD solicitations include CMMC requirements; non-CMMC primes/subs face contract eligibility risk.',                                                                                                                                      capturedAt: '2026-04-26T10:30:00Z' },
  { id: 'sig_98', leadId: 'lead_17', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Two Tier-1 industrial OEMs disclosed ransomware in 2025 — production halts of 9–14 days', body: 'Peer OEMs experienced extended OT outages; insurance, customer scorecards, and DoD prime expectations all repriced.',                                                                                                                                              capturedAt: '2026-03-08T11:00:00Z' },
  { id: 'sig_99', leadId: 'lead_17', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'Active exploitation of FortiGate (CVE-2024-21762) and Ivanti (CVE-2024-21887)', body: 'Both vendors used in Forgewright tech profile; patch posture and EOL inventory needed.',                                                                                                                                                                                  capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_100',leadId: 'lead_17', type: 'compliance_audit',severity: 'high',   source: 'DoD prime',         title: 'Top DoD prime customer requested CMMC L2 readiness packet by Sep 2026',         body: 'DoD prime customer has set a hard September deadline for CMMC L2 readiness evidence as a condition of award eligibility.',                                                                                                                                                 capturedAt: '2026-04-15T13:00:00Z' },
  { id: 'sig_101',leadId: 'lead_17', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring OT Security Architect and CMMC Compliance Lead',                         body: 'OT-Security and CMMC dual-track hiring — clear program build.',                                                                                                                                                                                                            capturedAt: '2026-04-28T10:00:00Z' },
  { id: 'sig_102',leadId: 'lead_17', type: 'supply_chain',  severity: 'medium',   source: 'CISA',              title: 'Volt Typhoon advisories continue to flag manufacturing supply chain',           body: 'Joint CISA/NSA advisories continue to identify PRC-state activity targeting critical-infrastructure-adjacent manufacturers.',                                                                                                                                              capturedAt: '2026-04-04T12:00:00Z' },

  // === Continental Polymers (lead_18) ===
  { id: 'sig_103',leadId: 'lead_18', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Specialty chemicals peer disclosed Black Basta in late 2025',                   body: 'A North American specialty chemicals peer disclosed Black Basta ransomware affecting plant operations; remediation cost $20M+.',                                                                                                                                          capturedAt: '2026-03-04T15:00:00Z' },
  { id: 'sig_104',leadId: 'lead_18', type: 'tech_vuln',     severity: 'high',     source: 'Claroty',           title: 'OT risk-monitoring report flags 14% of PLCs with default credentials',          body: 'Internal OT scan flagged Schneider/Allen-Bradley PLCs with default or weak credentials in production cells.',                                                                                                                                                              capturedAt: '2026-04-26T10:00:00Z' },
  { id: 'sig_105',leadId: 'lead_18', type: 'regulatory',    severity: 'medium',   source: 'CFATS',             title: 'CFATS reauthorization still pending — chemical-sector cyber expectations rising',body: 'While CFATS authority lapsed in 2023 federal action, state-level and DHS guidance keep cyber expectations high for chemical facilities.',                                                                                                                                  capturedAt: '2026-04-12T11:30:00Z' },
  { id: 'sig_106',leadId: 'lead_18', type: 'compliance_audit',severity: 'medium', source: 'customer',          title: 'Top auto-OEM customer requested NIST CSF mapping in March',                     body: 'Largest customer requested NIST CSF self-assessment for supply-chain cyber requirements.',                                                                                                                                                                                 capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_107',leadId: 'lead_18', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted OT Security Lead role (1st-of-its-kind)',                                body: 'First dedicated OT security lead — green-field program-build engagement window.',                                                                                                                                                                                          capturedAt: '2026-04-25T09:00:00Z' },
  { id: 'sig_108',leadId: 'lead_18', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal Q4 2026 — production-loss coverage scrutiny',                     body: 'Carriers tightening business-interruption coverage triggers; OT segmentation evidence now required.',                                                                                                                                                                     capturedAt: '2026-04-20T13:30:00Z' },

  // === Halberd Aerospace (lead_19) ===
  { id: 'sig_109',leadId: 'lead_19', type: 'regulatory',    severity: 'critical', source: 'DoD',               title: 'CMMC 2.0 Level 2 self-assessment + 3rd-party assessment now required for CUI',  body: 'Halberd handles CUI across multiple programs; CMMC L2 third-party assessment required as it becomes a contract clause.',                                                                                                                                                  capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_110',leadId: 'lead_19', type: 'regulatory',    severity: 'high',     source: 'State Dept',        title: 'ITAR enforcement actions in 2025 cited cyber controls gaps',                    body: 'Recent State Dept consent agreements explicitly cite inadequate cyber controls as ITAR violations; civil penalties up to $1.2M per violation.',                                                                                                                            capturedAt: '2026-04-12T10:00:00Z' },
  { id: 'sig_111',leadId: 'lead_19', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Aerospace tier-2 supplier disclosed targeted intrusion in 2025 — APT-attributed',body: 'Industrial-espionage-style intrusion at a peer aerospace supplier; CTI community attributes to PRC state-aligned cluster.',                                                                                                                                              capturedAt: '2026-03-10T11:30:00Z' },
  { id: 'sig_112',leadId: 'lead_19', type: 'tech_vuln',     severity: 'medium',   source: 'CISA KEV',          title: 'NX vulnerabilities in Siemens PLM components',                                  body: 'Recent advisories on Siemens NX/Teamcenter components with implications for ITAR-segmented design networks.',                                                                                                                                                              capturedAt: '2026-04-30T08:00:00Z' },
  { id: 'sig_113',leadId: 'lead_19', type: 'hiring',        severity: 'medium',   source: 'Workday',           title: 'Hiring CMMC L2 Program Manager and Insider-Threat Analyst',                     body: 'Two-pronged hiring around CMMC and insider risk; clear program priorities.',                                                                                                                                                                                               capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_114',leadId: 'lead_19', type: 'compliance_audit',severity: 'high',   source: 'DoD prime',         title: 'Prime contractor third-party risk packet due July 2026',                        body: 'DoD prime\'s third-party risk team requested annual cyber attestation packet by July; remediation timeline tight.',                                                                                                                                                        capturedAt: '2026-04-18T14:00:00Z' },

  // === Northshore Foods (lead_20) ===
  { id: 'sig_115',leadId: 'lead_20', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Major US food producer hit by ransomware in 2025 — production loss reported',   body: 'Peer food producer disclosed multi-day production halt due to ransomware; sector-wide cyber-resilience pressure increased.',                                                                                                                                                capturedAt: '2026-03-18T13:00:00Z' },
  { id: 'sig_116',leadId: 'lead_20', type: 'regulatory',    severity: 'medium',   source: 'FDA',               title: 'FSMA cyber-resilience expectations under FSMA 204 traceability rule',           body: 'FSMA 204 traceability rule (compliance Jan 2026) requires resilient digital recordkeeping; cyber outages become traceability outages.',                                                                                                                                    capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_117',leadId: 'lead_20', type: 'tech_vuln',     severity: 'medium',   source: 'Wonderware',        title: 'Legacy Wonderware InTouch on EOL Windows hosts at 2 plants',                    body: 'Wonderware HMIs running on EOL Windows at multiple plants — known ransomware-affiliate target profile.',                                                                                                                                                                  capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_118',leadId: 'lead_20', type: 'compliance_audit',severity: 'medium', source: 'customer',          title: 'Big-box retail customer requested SOC 2 attestation update in March',           body: 'Major retail customer requested fresh SOC 2 covering supply-chain operations.',                                                                                                                                                                                            capturedAt: '2026-03-24T14:00:00Z' },
  { id: 'sig_119',leadId: 'lead_20', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted IT Security Manager (greenfield)',                                       body: 'New role; profile suggests early program maturity.',                                                                                                                                                                                                                       capturedAt: '2026-04-24T10:00:00Z' },
  { id: 'sig_120',leadId: 'lead_20', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber insurance renewal Q4 — capacity tightening for food sector',              body: 'Carriers reducing capacity for food-sector cyber risk after multiple 2024–2025 production losses.',                                                                                                                                                                        capturedAt: '2026-04-20T13:00:00Z' },

  // === Iron Crescent Automotive (lead_21) ===
  { id: 'sig_121',leadId: 'lead_21', type: 'industry_breach',severity: 'critical', source: 'news',             title: 'CDK Global incident (Jun 2024) reset OEM/Tier supplier cyber posture',          body: 'CDK Global cyberattack disrupted ~15K dealerships; OEM tier-supplier scorecards have tightened materially.',                                                                                                                                                              capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_122',leadId: 'lead_21', type: 'regulatory',    severity: 'high',     source: 'TISAX',             title: 'TISAX (German automotive) compliance increasingly required for global suppliers',body: 'Tier suppliers shipping into European OEMs face TISAX scrutiny; assessment cycle 12–18 months.',                                                                                                                                                                          capturedAt: '2026-04-12T10:00:00Z' },
  { id: 'sig_123',leadId: 'lead_21', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'FortiGate CVE-2024-21762 active exploitation; Iron Crescent stack exposed',     body: 'CVE-2024-21762 actively exploited; FortiGate appliances widely deployed across Iron Crescent\'s plant DMZs.',                                                                                                                                                              capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_124',leadId: 'lead_21', type: 'compliance_audit',severity: 'high',   source: 'OEM customer',      title: 'Top-3 OEM customer requesting NIST CSF maturity uplift to "Tier 3" by Q3',      body: 'OEM customer\'s tier-supplier program now requires NIST CSF Tier 3 evidence; 90-day remediation window.',                                                                                                                                                                  capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_125',leadId: 'lead_21', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring 5 OT/cyber roles incl. Director of OT Security',                         body: 'OT-heavy hiring; Director-level OT post is a green-field opportunity for advisory + tooling.',                                                                                                                                                                             capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_126',leadId: 'lead_21', type: 'supply_chain',  severity: 'medium',   source: 'CISA',              title: 'Volt Typhoon advisories cite manufacturing OT as priority target',              body: 'Joint CISA/NSA advisories continue to highlight manufacturing OT for PRC-state pre-positioning activity.',                                                                                                                                                                 capturedAt: '2026-04-04T12:00:00Z' },

  // === Helios Solar Components (lead_22) ===
  { id: 'sig_127',leadId: 'lead_22', type: 'regulatory',    severity: 'medium',   source: 'DOE / FERC',        title: 'DOE supply-chain cyber-risk advisory targets solar inverter firmware',          body: 'DOE published updated guidance on solar/storage device cyber-risk; SBOM and firmware-integrity expectations are climbing.',                                                                                                                                                capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_128',leadId: 'lead_22', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Solar inverter platform compromise disclosed in 2025',                          body: 'A peer inverter manufacturer disclosed a firmware update channel compromise; FERC and DOE issued advisories.',                                                                                                                                                            capturedAt: '2026-03-30T13:30:00Z' },
  { id: 'sig_129',leadId: 'lead_22', type: 'tech_vuln',     severity: 'medium',   source: 'NetSuite',          title: 'NetSuite token-rotation hygiene gap noted in audit',                            body: 'Audit noted SuiteCloud-token rotation cadence below current best-practice frequency.',                                                                                                                                                                                     capturedAt: '2026-04-26T09:00:00Z' },
  { id: 'sig_130',leadId: 'lead_22', type: 'compliance_audit',severity: 'low',    source: 'audit firm',        title: 'SOC 2 Type II readiness in progress — first attestation Q4 2026',               body: 'First-time SOC 2 Type II audit underway; common pre-customer-RFP buildout.',                                                                                                                                                                                               capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_131',leadId: 'lead_22', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted IT/Security Generalist role',                                            body: 'Generalist role suggests modest program maturity; Greenfield opportunity for advisory.',                                                                                                                                                                                   capturedAt: '2026-04-24T11:00:00Z' },
  { id: 'sig_132',leadId: 'lead_22', type: 'insurance',     severity: 'low',      source: 'broker',            title: 'Renewal Q3 2026 — first-time cyber tower expansion',                            body: 'Renewing carrier offering expanded limits subject to MFA + EDR evidence.',                                                                                                                                                                                                 capturedAt: '2026-04-20T13:00:00Z' },

  // === Westwall Pharma Manufacturing (lead_23) ===
  { id: 'sig_133',leadId: 'lead_23', type: 'regulatory',    severity: 'high',     source: 'FDA',               title: 'FDA Part 11 (electronic records) enforcement reaffirmed in 2025 guidance',      body: 'FDA reaffirmed Part 11 expectations for electronic records and signatures; controls audit cadence increasing.',                                                                                                                                                            capturedAt: '2026-04-22T11:30:00Z' },
  { id: 'sig_134',leadId: 'lead_23', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Major CMO disclosed ransomware in 2025 — production lines down 11 days',         body: 'Peer contract manufacturing organization disclosed ransomware causing prolonged production loss; downstream brand impact.',                                                                                                                                                capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_135',leadId: 'lead_23', type: 'tech_vuln',     severity: 'medium',   source: 'CISA KEV',          title: 'MasterControl module CVEs disclosed in 2025',                                   body: 'MasterControl GxP system disclosed multiple CVEs; pharma IT typically lags on patching due to validation cycles.',                                                                                                                                                          capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_136',leadId: 'lead_23', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Top pharma sponsor customer requested annual cyber attestation packet',          body: 'Top sponsor customer requested annual cyber attestation packet aligned with NIST CSF + Part 11 controls.',                                                                                                                                                                capturedAt: '2026-04-12T14:00:00Z' },
  { id: 'sig_137',leadId: 'lead_23', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring GxP IT Security Lead and Sr. Validation Engineer',                       body: 'GxP-specific security hiring — strong program maturity and budget signal.',                                                                                                                                                                                                capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_138',leadId: 'lead_23', type: 'supply_chain',  severity: 'medium',   source: 'CISA',              title: 'Joint CISA/HHS advisory on healthcare supply-chain ransomware',                 body: 'CISA/HHS continue to elevate pharma supply-chain ransomware as a sector concern; CMOs are prime targets for downstream disruption.',                                                                                                                                       capturedAt: '2026-04-04T11:00:00Z' },

  // === Stratifi HR (lead_24) ===
  { id: 'sig_139',leadId: 'lead_24', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Two enterprise customers requested ISO 27001 + SOC 2 + CSA STAR by Q4',         body: 'Three-attestation packet requested by enterprise customers as renewal condition; 6–9 month delivery.',                                                                                                                                                                     capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_140',leadId: 'lead_24', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Enterprise HRIS competitor disclosed credential-stuffing ATO affecting 4M employees', body: 'HRIS vendor disclosed credential-stuffing ATO; identity attacks remain a top vector against B2B SaaS.',                                                                                                                                                                capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_141',leadId: 'lead_24', type: 'regulatory',    severity: 'medium',   source: 'EU',                title: 'EU AI Act high-risk system obligations effective Feb 2026',                     body: 'HRIS vendors with AI features (resume scoring, performance signals) face EU AI Act Article 6 high-risk obligations.',                                                                                                                                                      capturedAt: '2026-04-08T11:00:00Z' },
  { id: 'sig_142',leadId: 'lead_24', type: 'tech_vuln',     severity: 'medium',   source: 'Wiz',               title: 'CSPM flagged 3 IAM roles with broad sts:AssumeRole trust policy',                body: 'Recent CSPM scan flagged overly-permissive IAM trust policies — recurring misconfiguration leading to multiple recent SaaS data exposures.',                                                                                                                               capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_143',leadId: 'lead_24', type: 'funding',       severity: 'medium',   source: 'Crunchbase',        title: 'Series C ($85M) closed in 2024',                                                body: 'Series C close — typical window for buildout of detection-engineering and customer-trust programs.',                                                                                                                                                                       capturedAt: '2026-04-02T10:00:00Z' },
  { id: 'sig_144',leadId: 'lead_24', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Hiring AppSec Engineer and Trust & Safety Manager',                             body: 'AppSec + Trust & Safety hiring — natural buyer of penetration testing, AppSec services, and SaaS protection.',                                                                                                                                                             capturedAt: '2026-04-28T11:00:00Z' },

  // === Threadbase (lead_25) ===
  { id: 'sig_145',leadId: 'lead_25', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'CI/CD provider compromise affected 200+ downstream tenants in 2025',            body: 'CI/CD vendor disclosed compromise via stolen access tokens; downstream pipelines exposed. Devtools customers especially sensitive.',                                                                                                                                       capturedAt: '2026-03-18T13:30:00Z' },
  { id: 'sig_146',leadId: 'lead_25', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'Multiple GitHub Action workflow injection CVEs disclosed in 2025',              body: 'Several GitHub Actions workflow-injection vulnerabilities disclosed in 2025; Threadbase\'s product depends on workflow integrations.',                                                                                                                                     capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_147',leadId: 'lead_25', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Enterprise customer requested SOC 2 Type II + ISO 27001 by year-end',           body: 'Top enterprise prospect made dual-attestation a renewal/expansion condition; tight timeline.',                                                                                                                                                                             capturedAt: '2026-04-12T14:00:00Z' },
  { id: 'sig_148',leadId: 'lead_25', type: 'funding',       severity: 'medium',   source: 'Crunchbase',        title: 'Series B ($45M) closed in 2024',                                                body: 'Series B funding extends runway and typically funds first formal security program.',                                                                                                                                                                                       capturedAt: '2026-04-02T10:30:00Z' },
  { id: 'sig_149',leadId: 'lead_25', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Head of Security and Sr. Detection Engineer',                            body: 'First Head of Security req plus detection engineering — programmatic build under way.',                                                                                                                                                                                    capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_150',leadId: 'lead_25', type: 'supply_chain',  severity: 'medium',   source: 'CISA',              title: 'CISA/NSA SBOM guidance updates emphasize CI/CD provenance',                      body: 'Latest CISA SBOM guidance highlights build-pipeline provenance and signed-artifact expectations relevant to Threadbase\'s product surface.',                                                                                                                               capturedAt: '2026-04-04T11:30:00Z' },

  // === Clearpoint Analytics (lead_26) ===
  { id: 'sig_151',leadId: 'lead_26', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Mid-market bank customer requested SOC 2 Type II + GLBA Safeguards mapping',     body: 'Banking customer requires mapping of Stratifi controls to GLBA Safeguards Rule (FTC) for vendor risk management.',                                                                                                                                                       capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_152',leadId: 'lead_26', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Peer BI vendor disclosed customer-data exposure via misconfigured S3',          body: 'Peer SaaS BI provider disclosed exposure of customer report exports via public S3 bucket; classic misconfiguration pattern.',                                                                                                                                              capturedAt: '2026-03-10T11:00:00Z' },
  { id: 'sig_153',leadId: 'lead_26', type: 'tech_vuln',     severity: 'medium',   source: 'Snyk',              title: 'Multiple high-severity dependencies in product\'s npm tree',                     body: 'SCA scan flagged Log4j-derivative and prototype-pollution dependencies; SBOM transparency increasingly required by customers.',                                                                                                                                            capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_154',leadId: 'lead_26', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Director of Security and Trust',                                          body: 'New Director-level role suggests programmatic build out of security & customer-trust function.',                                                                                                                                                                           capturedAt: '2026-04-26T09:00:00Z' },
  { id: 'sig_155',leadId: 'lead_26', type: 'regulatory',    severity: 'medium',   source: 'state AG',          title: 'CA CPRA + CO/CT/UT/OR privacy regimes increase data-handling obligations',       body: 'Multi-state privacy patchwork raises both DSR (data subject request) and security-control bar for SaaS BI providers.',                                                                                                                                                     capturedAt: '2026-04-12T11:00:00Z' },
  { id: 'sig_156',leadId: 'lead_26', type: 'funding',       severity: 'low',      source: 'Crunchbase',        title: 'Series B closed 2023; Series C activity rumored',                                body: 'Pre-Series-C posture: typical security-program stress test before due-diligence cycle.',                                                                                                                                                                                   capturedAt: '2026-04-02T10:00:00Z' },

  // === Northstar Field Services (lead_27) ===
  { id: 'sig_157',leadId: 'lead_27', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Field-service SaaS competitor disclosed credential breach in 2025',              body: 'Field-service competitor disclosed credential-stuffing affecting 80K technicians; identity controls remain top vector.',                                                                                                                                                  capturedAt: '2026-03-22T11:00:00Z' },
  { id: 'sig_158',leadId: 'lead_27', type: 'compliance_audit',severity: 'medium', source: 'customer',          title: 'Top customer requested SOC 2 Type I → Type II progression by Q3',                body: 'Top customer requested progression from Type I to Type II — common renewal-condition trigger.',                                                                                                                                                                            capturedAt: '2026-04-15T14:00:00Z' },
  { id: 'sig_159',leadId: 'lead_27', type: 'tech_vuln',     severity: 'medium',   source: 'Auth0',             title: 'Auth0 tenant lacks MFA enforcement on customer accounts',                        body: 'Auth0 tenant config inspection: customer-side MFA optional rather than required; ATO risk.',                                                                                                                                                                              capturedAt: '2026-04-30T08:00:00Z' },
  { id: 'sig_160',leadId: 'lead_27', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted "Founding Security Engineer" req',                                        body: 'First-ever security engineering hire — green-field opportunity for advisory + tooling.',                                                                                                                                                                                  capturedAt: '2026-04-25T09:30:00Z' },

  // === Aurora Logistics Cloud (lead_28) ===
  { id: 'sig_161',leadId: 'lead_28', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Major supply-chain SaaS provider hit by ransomware in 2025 — port disruptions',  body: 'Supply-chain SaaS peer disclosed ransomware that disrupted port operations; downstream customers triggered alternative-logistics plans.',                                                                                                                                  capturedAt: '2026-03-30T13:00:00Z' },
  { id: 'sig_162',leadId: 'lead_28', type: 'regulatory',    severity: 'medium',   source: 'CISA',              title: 'TSA / Coast Guard cyber rules tightening for maritime supply chain',             body: 'TSA and USCG continue to issue cyber requirements for maritime supply chain; SaaS providers in this space face downstream compliance ripple.',                                                                                                                            capturedAt: '2026-04-12T11:00:00Z' },
  { id: 'sig_163',leadId: 'lead_28', type: 'compliance_audit',severity: 'high',   source: 'enterprise customer', title: 'Top-3 enterprise customer requested ISO 27001 + SOC 2 Type II by Q4 2026',     body: 'Top customer made dual-attestation a contract renewal condition.',                                                                                                                                                                                                         capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_164',leadId: 'lead_28', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'MuleSoft API logs flowing through publicly readable S3 bucket',                  body: 'CSPM flagged API observability data in public bucket — common misconfiguration with material exposure risk.',                                                                                                                                                              capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_165',leadId: 'lead_28', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring CISO and 4 security engineers',                                          body: 'Hiring of inaugural CISO + scaling team — prime advisory + tooling window.',                                                                                                                                                                                               capturedAt: '2026-04-28T10:00:00Z' },
  { id: 'sig_166',leadId: 'lead_28', type: 'supply_chain',  severity: 'medium',   source: 'CISA',              title: 'Supply-chain SaaS targeted by Salt Typhoon-style data theft activity',           body: 'CTI sources cite continued PRC-state interest in logistics SaaS to enable targeting of downstream organizations.',                                                                                                                                                         capturedAt: '2026-04-04T12:00:00Z' },

  // === Plinth Identity (lead_29) ===
  { id: 'sig_167',leadId: 'lead_29', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'Okta support-system compromise (Oct 2023) still shaping IAM-vendor expectations',body: 'Okta support-system compromise reset customer expectations for IAM vendors\' own internal security; Plinth\'s prospects ask about it directly.',                                                                                                                          capturedAt: '2026-04-26T10:00:00Z' },
  { id: 'sig_168',leadId: 'lead_29', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Two design-partner customers requested SOC 2 Type II by Series-B-close',         body: 'Sponsor-led customers requested SOC 2 Type II as a condition of expansion.',                                                                                                                                                                                               capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_169',leadId: 'lead_29', type: 'funding',       severity: 'medium',   source: 'Crunchbase',        title: 'Series B ($38M) closed in 2025',                                                body: 'Series B close + IAM-vendor scrutiny = formal third-party assessments and pen-test cadence are about to scale.',                                                                                                                                                           capturedAt: '2026-04-02T10:00:00Z' },
  { id: 'sig_170',leadId: 'lead_29', type: 'tech_vuln',     severity: 'medium',   source: 'GitHub',            title: 'Public repo references staging tenant + admin bootstrap script',                 body: 'Public repos reference staging tenant identifiers and bootstrap scripts; rotation hygiene + secret-scanning needed.',                                                                                                                                                      capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_171',leadId: 'lead_29', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Hiring Sr. AppSec and Detection Engineer',                                       body: 'AppSec + Detection hiring — security-program scaling.',                                                                                                                                                                                                                    capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_172',leadId: 'lead_29', type: 'compliance_audit',severity: 'medium', source: 'partner',           title: 'Pen-test + threat-modeling required by SaaS marketplace (Salesforce AppExchange)',body: 'AppExchange listing requires annual pen-test + threat-modeling artifacts.',                                                                                                                                                                                                capturedAt: '2026-04-12T11:00:00Z' },

  // === Brightside Marketing (lead_30) ===
  { id: 'sig_173',leadId: 'lead_30', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Major martech vendor disclosed prompt-injection-led data exposure in 2025',     body: 'Peer martech vendor disclosed AI-feature-induced prompt-injection exposure of customer audience data.',                                                                                                                                                                    capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_174',leadId: 'lead_30', type: 'regulatory',    severity: 'high',     source: 'CA AG',             title: 'CA CCPA enforcement actions targeting martech "dark patterns" and consent flows',body: 'CA AG enforcement actions in 2025 targeted martech consent flows; martech security/privacy increasingly intertwined.',                                                                                                                                                    capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_175',leadId: 'lead_30', type: 'tech_vuln',     severity: 'medium',   source: 'Wiz',               title: 'CSPM flagged Snowflake "ACCOUNTADMIN" access for non-admin service accounts',    body: 'CSPM flagged non-admin services with Snowflake ACCOUNTADMIN access — pattern that contributed to UNC5537 lateral movement.',                                                                                                                                              capturedAt: '2026-04-30T08:30:00Z' },
  { id: 'sig_176',leadId: 'lead_30', type: 'compliance_audit',severity: 'medium', source: 'enterprise customer',title: 'Enterprise customer requested SOC 2 Type II + privacy attestation packet',     body: 'Top enterprise customer requested fresh attestation packet; standard renewal-cycle workload.',                                                                                                                                                                             capturedAt: '2026-04-18T13:30:00Z' },
  { id: 'sig_177',leadId: 'lead_30', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Hiring AppSec Engineer and Privacy Counsel',                                     body: 'AppSec + Privacy hiring — buy-side signal for AppSec services and privacy advisory.',                                                                                                                                                                                      capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_178',leadId: 'lead_30', type: 'ma',            severity: 'medium',   source: 'press release',     title: 'Acquired AI-personalization startup in March 2026',                              body: 'Tuck-in M&A — integration introduces new AI feature surface plus model-supply-chain risk.',                                                                                                                                                                                capturedAt: '2026-03-28T10:00:00Z' },

  // === Apex Telematics (lead_31) ===
  { id: 'sig_179',leadId: 'lead_31', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Vehicle-telematics provider disclosed exposed customer data via API in 2025',    body: 'Peer telematics provider disclosed BOLA/IDOR-style API issue exposing customer GPS data. API security top of mind for telematics buyers.',                                                                                                                                capturedAt: '2026-03-18T14:00:00Z' },
  { id: 'sig_180',leadId: 'lead_31', type: 'regulatory',    severity: 'medium',   source: 'NHTSA',             title: 'NHTSA cyber best practices for connected vehicles updated in 2025',              body: 'NHTSA updated guidance raises bar for over-the-air update integrity, fleet-level data handling, and incident response.',                                                                                                                                                  capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_181',leadId: 'lead_31', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'IoT MQTT broker exposed without TLS verification on staging tenant',             body: 'CSPM flagged staging-tenant MQTT broker without TLS verification — potential data-in-transit exposure.',                                                                                                                                                                  capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_182',leadId: 'lead_31', type: 'compliance_audit',severity: 'medium', source: 'customer',          title: 'Top fleet customer requested SOC 2 Type II + ISO 27001',                         body: 'Top fleet customer made dual attestation a contract renewal condition.',                                                                                                                                                                                                   capturedAt: '2026-04-12T13:00:00Z' },
  { id: 'sig_183',leadId: 'lead_31', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Hiring Director of Information Security',                                        body: 'First Director-level security hire — clear program scaling.',                                                                                                                                                                                                              capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_184',leadId: 'lead_31', type: 'supply_chain',  severity: 'low',      source: 'CISA',              title: 'CISA advisories on connected-vehicle supply-chain risks',                        body: 'CISA continues to elevate connected-vehicle supply-chain risks; OEM customers ask about controls.',                                                                                                                                                                        capturedAt: '2026-04-04T10:30:00Z' },

  // === Vector Education (lead_32) ===
  { id: 'sig_185',leadId: 'lead_32', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'K-12 ransomware wave continued through 2025 — districts increasingly demand vendor attestations', body: 'K-12 ransomware activity persisted through 2025; districts increasingly require SOC 2 + state-level attestations from edtech vendors.',                                                                                                                            capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_186',leadId: 'lead_32', type: 'regulatory',    severity: 'high',     source: 'FCC / E-Rate',      title: 'FCC E-Rate Schools and Libraries Cybersecurity Pilot in execution',              body: 'FCC pilot program expanding cyber funding eligibility — districts will scrutinize vendor cyber posture.',                                                                                                                                                                  capturedAt: '2026-04-12T11:00:00Z' },
  { id: 'sig_187',leadId: 'lead_32', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Three large districts requested updated SOC 2 + state student-data attestations',body: 'Multi-state district customers require state-specific student-data privacy attestations (CA AB 1584, NY Ed §2-d, others).',                                                                                                                                              capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_188',leadId: 'lead_32', type: 'tech_vuln',     severity: 'medium',   source: 'Auth0',             title: 'OAuth scope review needed — multiple integrations request broad scopes',         body: 'OAuth integrations request broad scopes by default; scope hardening needed before 2026 audits.',                                                                                                                                                                          capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_189',leadId: 'lead_32', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Head of Security & Privacy (replacement)',                                body: 'Head of Security & Privacy role refilling after departure — fresh program owner often reconsiders vendor stack.',                                                                                                                                                          capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_190',leadId: 'lead_32', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal Q3 2026 — minor incident in 2025 raised pricing',                  body: 'Carriers reportedly raising pricing after a minor incident reported under good-faith disclosure.',                                                                                                                                                                         capturedAt: '2026-04-20T13:00:00Z' },

  // === Quill DocAI (lead_33) ===
  { id: 'sig_191',leadId: 'lead_33', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Legal AI vendor disclosed prompt-injection-led data exposure in 2025',           body: 'Peer legal AI vendor disclosed prompt-injection issue that exposed cross-tenant data; rapidly resetting buyer expectations.',                                                                                                                                              capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_192',leadId: 'lead_33', type: 'regulatory',    severity: 'medium',   source: 'ABA',               title: 'ABA Model Rule 1.6 + 1.1 increasingly invoked for AI tooling oversight',         body: 'State bars and ABA referencing Model Rules 1.6/1.1 in opinions on AI tools — security-of-confidential-information implications.',                                                                                                                                          capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_193',leadId: 'lead_33', type: 'compliance_audit',severity: 'high',   source: 'customer',          title: 'Top Am Law firm requested SOC 2 Type II + ISO 27001 + threat model in 60 days',  body: 'Tight 60-day deadline from a high-profile Am Law firm — prime advisory + acceleration window.',                                                                                                                                                                            capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_194',leadId: 'lead_33', type: 'tech_vuln',     severity: 'medium',   source: 'OpenAI',            title: 'OpenAI API key rotation policy gap identified in self-audit',                    body: 'Self-audit identified gap in OpenAI API key rotation cadence — important for legal-AI confidentiality posture.',                                                                                                                                                          capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_195',leadId: 'lead_33', type: 'funding',       severity: 'medium',   source: 'Crunchbase',        title: 'Series A ($22M) closed in 2025',                                                body: 'Series A close + heavyweight legal customers = formal security buildout window.',                                                                                                                                                                                          capturedAt: '2026-04-02T10:00:00Z' },
  { id: 'sig_196',leadId: 'lead_33', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted "Head of Trust" req',                                                     body: 'Head of Trust role suggests dedicated investment in customer-facing security and program maturity.',                                                                                                                                                                       capturedAt: '2026-04-25T09:00:00Z' },

  // === Whitford & Pace LLP (lead_34) ===
  { id: 'sig_197',leadId: 'lead_34', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'Multiple Am Law 100 firms hit by ransomware/data-theft in 2024–2025',           body: 'Several Am Law firms (publicly disclosed and undisclosed) experienced ransomware/data-theft events; client demand letters now standard.',                                                                                                                                  capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_198',leadId: 'lead_34', type: 'regulatory',    severity: 'high',     source: 'NYDFS / SEC',       title: 'Public-company clients demanding 24-hour cyber-incident notice from outside counsel', body: 'SEC cyber-disclosure rule (Dec 2023) drove public-company clients to push 24-hour notice clauses into engagement letters.',                                                                                                                                            capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_199',leadId: 'lead_34', type: 'compliance_audit',severity: 'high',   source: 'client',            title: 'Top financial-services client requested ISO 27001 + SOC 2 Type II + tabletop',   body: 'Largest financial-services client requested triple-attestation packet plus tabletop walkthrough.',                                                                                                                                                                        capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_200',leadId: 'lead_34', type: 'tech_vuln',     severity: 'medium',   source: 'CISA KEV',          title: 'iManage cloud + on-prem CVEs disclosed in 2025',                                  body: 'Document management platform CVEs disclosed; law firms typically lag patch cycles due to attorney-availability constraints.',                                                                                                                                              capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_201',leadId: 'lead_34', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Director of Information Security (deputy CISO)',                          body: 'Deputy-CISO posting — programmatic scaling and possible succession plan.',                                                                                                                                                                                                 capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_202',leadId: 'lead_34', type: 'insurance',     severity: 'high',     source: 'broker',            title: 'Cyber tower renewal Q4 — primary carrier pulling capacity',                      body: 'Primary cyber carrier reducing capacity for Am Law-tier firms after 2024–2025 industry losses; potential coverage gap.',                                                                                                                                                   capturedAt: '2026-04-20T13:00:00Z' },

  // === Ashbury Carter Auditors (lead_35) ===
  { id: 'sig_203',leadId: 'lead_35', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Two regional accounting firms disclosed ransomware in 2025',                    body: 'Two regional accounting peers disclosed ransomware events affecting tax-season operations; client class actions filed.',                                                                                                                                                  capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_204',leadId: 'lead_35', type: 'regulatory',    severity: 'high',     source: 'IRS',               title: 'IRS Pub 4557 + WISP requirements + Pub 5708 expanded enforcement',                body: 'IRS continues to expand Written Information Security Program (WISP) enforcement against tax preparers/firms; FTC Safeguards Rule applies.',                                                                                                                                capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_205',leadId: 'lead_35', type: 'compliance_audit',severity: 'medium', source: 'client',            title: 'Public-company audit clients requesting SOC 2 attestation by Q4',                body: 'Public-company audit clients requesting SOC 2 from external auditor as part of vendor risk programs.',                                                                                                                                                                     capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_206',leadId: 'lead_35', type: 'tech_vuln',     severity: 'medium',   source: 'CISA KEV',          title: 'CCH Axcess platform CVEs in CISA KEV during tax season',                          body: 'CCH Axcess CVEs disclosed during peak tax season; firms slow to patch due to filing-deadline constraints.',                                                                                                                                                                capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_207',leadId: 'lead_35', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted IT Security Manager role',                                                body: 'Mid-level security hiring — practical advisory + tooling buyer profile.',                                                                                                                                                                                                  capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_208',leadId: 'lead_35', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal Q3 — tax-season activity raising premium',                          body: 'Carrier raising premium citing tax-season threat exposure (phishing, credential theft).',                                                                                                                                                                                  capturedAt: '2026-04-20T13:00:00Z' },

  // === Crestmont Consulting (lead_36) ===
  { id: 'sig_209',leadId: 'lead_36', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Mid-size consultancy disclosed credential-stuffing ATO in 2025',                 body: 'Peer consultancy disclosed credential-stuffing ATO affecting 8K consultant accounts; clients triggered third-party risk reviews.',                                                                                                                                         capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_210',leadId: 'lead_36', type: 'compliance_audit',severity: 'high',   source: 'client',            title: 'Public-company client requested SOC 2 + tabletop walkthrough by Q3',             body: 'Public-company client cited SEC cyber-disclosure rule when requesting attestation + tabletop.',                                                                                                                                                                            capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_211',leadId: 'lead_36', type: 'tech_vuln',     severity: 'medium',   source: 'M365 audit',        title: 'Legacy IMAP/POP enabled on shared mailboxes',                                    body: 'Legacy auth on shared mailboxes is a known BEC vector — common consultancy weakness.',                                                                                                                                                                                     capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_212',leadId: 'lead_36', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted IT Operations Manager (no dedicated security role)',                       body: 'No dedicated security hire posted — high-touch advisory window.',                                                                                                                                                                                                          capturedAt: '2026-04-25T09:00:00Z' },

  // === Lindquist & Reeve (lead_37) ===
  { id: 'sig_213',leadId: 'lead_37', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Patent boutique disclosed targeted intrusion attributed to APT41',                body: 'Peer IP boutique disclosed targeted intrusion attributed by CTI to PRC-state cluster; IP theft motivation.',                                                                                                                                                               capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_214',leadId: 'lead_37', type: 'regulatory',    severity: 'medium',   source: 'USPTO',             title: 'USPTO scrutinizing law-firm cyber posture for confidential filings',              body: 'USPTO has issued guidance on protecting unpublished applications; firms expected to demonstrate cyber controls.',                                                                                                                                                          capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_215',leadId: 'lead_37', type: 'compliance_audit',severity: 'high',   source: 'client',            title: 'Top tech-company client requested ISO 27001 + advanced threat-hunt evidence',     body: 'Top client requested artifacts of advanced threat-hunting + DLP coverage for IP-related matters.',                                                                                                                                                                         capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_216',leadId: 'lead_37', type: 'tech_vuln',     severity: 'medium',   source: 'CISA KEV',          title: 'iManage Cloud and Microsoft 365 CVEs across 2025',                                body: 'Document-management + M365 CVEs continue to publish; pen-test cadence now table stakes.',                                                                                                                                                                                  capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_217',leadId: 'lead_37', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Information Security Manager (first dedicated role)',                      body: 'First dedicated security manager — ground-floor advisory engagement.',                                                                                                                                                                                                     capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_218',leadId: 'lead_37', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal Q4 — IP-firm class repricing upward',                              body: 'Carriers repricing IP-boutique cyber risk after 2024–2025 industry losses.',                                                                                                                                                                                               capturedAt: '2026-04-20T13:00:00Z' },

  // === Northpoint Tax Advisors (lead_38) ===
  { id: 'sig_219',leadId: 'lead_38', type: 'regulatory',    severity: 'high',     source: 'IRS / FTC',         title: 'FTC Safeguards Rule (revised) fully enforced — tax preparers in scope',          body: 'FTC Safeguards Rule revisions raised security bar for tax preparers; multistate AGs increasingly active on enforcement.',                                                                                                                                                  capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_220',leadId: 'lead_38', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Mid-market tax firm disclosed phishing breach during 2025 tax season',           body: 'Peer mid-market tax firm disclosed phishing-led breach during tax season; clients filed class actions.',                                                                                                                                                                   capturedAt: '2026-03-20T13:00:00Z' },
  { id: 'sig_221',leadId: 'lead_38', type: 'compliance_audit',severity: 'medium', source: 'client',            title: 'Public-company client cyber-controls questionnaire due Q3',                       body: 'Public-company client questionnaire references SEC cyber rule and FTC Safeguards.',                                                                                                                                                                                        capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_222',leadId: 'lead_38', type: 'tech_vuln',     severity: 'medium',   source: 'CCH advisory',      title: 'CCH Axcess platform critical patches issued in 2025',                            body: 'CCH issued critical patches; tax firms tend to lag patching during filing periods.',                                                                                                                                                                                       capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_223',leadId: 'lead_38', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Cybersecurity Analyst (1st dedicated role)',                              body: 'First dedicated cybersecurity analyst hire — green-field tooling and advisory window.',                                                                                                                                                                                    capturedAt: '2026-04-25T09:00:00Z' },
  { id: 'sig_224',leadId: 'lead_38', type: 'ma',            severity: 'medium',   source: 'press release',     title: 'Acquired smaller tax practice in Q1 2026',                                       body: 'Tuck-in M&A — integration drives identity sprawl, BAA gaps, and email-security misconfiguration risk.',                                                                                                                                                                    capturedAt: '2026-03-04T11:00:00Z' },

  // === Hearthline Goods (lead_39) ===
  { id: 'sig_225',leadId: 'lead_39', type: 'regulatory',    severity: 'high',     source: 'PCI SSC',           title: 'PCI DSS 4.0 mandatory since April 2025 — Shopify Plus + custom checkout in scope',body: 'PCI DSS 4.0 in full force; SAQ and ROC scope expanded for merchants with custom checkout flows.',                                                                                                                                                                          capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_226',leadId: 'lead_39', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'DTC peer disclosed Magecart-style skimmer affecting 200K shoppers in 2025',       body: 'Peer DTC retailer disclosed JavaScript-skimmer-led card data theft; PCI 4.0 e-skimming controls now mandatory.',                                                                                                                                                           capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_227',leadId: 'lead_39', type: 'tech_vuln',     severity: 'medium',   source: 'Cloudflare',        title: 'Bot-management not enforced on login + checkout — credential stuffing risk',     body: 'Cloudflare bot-management controls not active on critical paths — credential-stuffing/ATO risk during peak season.',                                                                                                                                                       capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_228',leadId: 'lead_39', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Director of Security and 2 AppSec engineers',                              body: 'Director-level + AppSec hiring — solid program scaling.',                                                                                                                                                                                                                  capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_229',leadId: 'lead_39', type: 'compliance_audit',severity: 'medium', source: 'acquirer bank',     title: 'Acquirer bank requested updated PCI ROC',                                        body: 'Acquirer bank requested fresh PCI ROC; level-1 merchant.',                                                                                                                                                                                                                 capturedAt: '2026-04-12T11:00:00Z' },
  { id: 'sig_230',leadId: 'lead_39', type: 'insurance',     severity: 'low',      source: 'broker',            title: 'Cyber renewal Q4 — peak-season exposure on underwriter radar',                    body: 'Underwriter focusing on November–December peak-season exposure for DTC retailers.',                                                                                                                                                                                        capturedAt: '2026-04-20T13:00:00Z' },

  // === Westmark Outdoor (lead_40) ===
  { id: 'sig_231',leadId: 'lead_40', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'Major outdoor retailer disclosed Scattered Spider-style intrusion in 2025',       body: 'Peer outdoor retailer disclosed Scattered Spider-style social-engineering-led intrusion; help-desk procedures now under scrutiny.',                                                                                                                                        capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_232',leadId: 'lead_40', type: 'regulatory',    severity: 'high',     source: 'PCI SSC',           title: 'PCI DSS 4.0 mandatory; e-skimming + script integrity controls now required',     body: 'Section 11.6 (e-skimming) requirements now mandatory; merchants must demonstrate script-integrity controls.',                                                                                                                                                              capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_233',leadId: 'lead_40', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'Several IAM roles with broad S3 wildcard access flagged',                        body: 'Recent CSPM scan flagged overly-permissive IAM in non-prod; lateral-movement risk if compromised.',                                                                                                                                                                         capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_234',leadId: 'lead_40', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Director of PCI Compliance and Sr. Detection Engineer',                    body: 'PCI-specific Director hire + detection engineer — clear program priorities.',                                                                                                                                                                                              capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_235',leadId: 'lead_40', type: 'compliance_audit',severity: 'high',   source: 'acquirer bank',     title: 'Level-1 merchant ROC due Q4 2026',                                                body: 'Annual PCI ROC cycle for level-1 merchant; PCI 4.0 controls fully in scope.',                                                                                                                                                                                              capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_236',leadId: 'lead_40', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal Q4 — Scattered-Spider help-desk controls now underwriting question',body: 'Carriers explicitly asking about help-desk authentication procedures after 2023–2025 social-engineering wave.',                                                                                                                                                            capturedAt: '2026-04-20T13:00:00Z' },

  // === Gildwater Apparel (lead_41) ===
  { id: 'sig_237',leadId: 'lead_41', type: 'regulatory',    severity: 'medium',   source: 'PCI SSC',           title: 'PCI DSS 4.0 mandatory — DTC merchants in scope',                                  body: 'PCI 4.0 in full force; DTC apparel merchants typically rely on Shopify Plus but custom integrations expand scope.',                                                                                                                                                        capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_238',leadId: 'lead_41', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Fashion DTC peer disclosed Magecart-style skimmer in 2025',                       body: 'Peer fashion DTC disclosed e-skimming incident; California AG launched investigation.',                                                                                                                                                                                    capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_239',leadId: 'lead_41', type: 'tech_vuln',     severity: 'medium',   source: 'Klaviyo',           title: 'Klaviyo API key rotation gap',                                                   body: 'Klaviyo API keys not rotated in 14+ months; standard SaaS-hygiene gap.',                                                                                                                                                                                                   capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_240',leadId: 'lead_41', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Head of Tech & Operations',                                                body: 'Combined tech/operations role — high-touch advisory window.',                                                                                                                                                                                                              capturedAt: '2026-04-25T08:30:00Z' },

  // === Pinecrest Pet Co (lead_42) ===
  { id: 'sig_241',leadId: 'lead_42', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Pet retailer disclosed Magecart-style card data theft in 2025',                    body: 'Pet retailer peer disclosed e-skimming; PCI 4.0 e-skimming controls now front of mind.',                                                                                                                                                                                   capturedAt: '2026-03-15T13:00:00Z' },
  { id: 'sig_242',leadId: 'lead_42', type: 'tech_vuln',     severity: 'medium',   source: 'NetSuite',          title: 'NetSuite SuiteCloud admin tokens last rotated 24 months ago',                    body: 'SuiteCloud admin tokens overdue for rotation; standard hygiene gap.',                                                                                                                                                                                                      capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_243',leadId: 'lead_42', type: 'compliance_audit',severity: 'medium', source: 'acquirer bank',     title: 'Acquirer bank requested updated PCI SAQ-D',                                       body: 'Acquirer bank requested SAQ-D given customer cardholder data flows; PCI 4.0 expanded scope.',                                                                                                                                                                              capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_244',leadId: 'lead_42', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Director of IT (security responsibilities included)',                      body: 'Director of IT responsibilities include cybersecurity — combined-role buyer profile.',                                                                                                                                                                                     capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_245',leadId: 'lead_42', type: 'insurance',     severity: 'low',      source: 'broker',            title: 'Cyber renewal Q4',                                                                body: 'Renewal in Q4; underwriter likely to focus on PCI 4.0 alignment.',                                                                                                                                                                                                         capturedAt: '2026-04-20T13:00:00Z' },

  // === Stoneflower Beauty (lead_43) ===
  { id: 'sig_246',leadId: 'lead_43', type: 'industry_breach',severity: 'medium',  source: 'news',              title: 'Beauty DTC competitor disclosed customer-data scraping in 2025',                  body: 'Peer beauty DTC disclosed authenticated-API scraping; bot-management and rate-limiting on the radar.',                                                                                                                                                                     capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_247',leadId: 'lead_43', type: 'regulatory',    severity: 'medium',   source: 'CA AG',             title: 'CCPA enforcement actions targeting subscription DTC consent flows',               body: 'CA AG focused enforcement on subscription DTC consent + retention practices; security and privacy intertwined.',                                                                                                                                                           capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_248',leadId: 'lead_43', type: 'tech_vuln',     severity: 'low',      source: 'Cloudflare',        title: 'WAF in monitor-only mode on production checkout',                                body: 'WAF currently in monitor-only mode on production checkout — limited e-skimming defense.',                                                                                                                                                                                  capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_249',leadId: 'lead_43', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted COO role',                                                                 body: 'COO hire — typical signal for next-stage operational maturity including security buildout.',                                                                                                                                                                               capturedAt: '2026-04-25T08:30:00Z' },

  // === Carriagehouse Marketplace (lead_44) ===
  { id: 'sig_250',leadId: 'lead_44', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'B2C marketplace peer disclosed credential-stuffing ATO affecting 1.2M users',     body: 'Peer marketplace disclosed credential-stuffing ATO leading to seller-side fraud; bot-management + step-up MFA now table stakes.',                                                                                                                                          capturedAt: '2026-03-22T13:00:00Z' },
  { id: 'sig_251',leadId: 'lead_44', type: 'regulatory',    severity: 'medium',   source: 'CFPB',              title: 'CFPB scrutiny of marketplace payments and consumer disputes',                     body: 'CFPB increasingly scrutinizing marketplace payment flows + consumer dispute mechanisms; security/privacy intertwined.',                                                                                                                                                    capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_252',leadId: 'lead_44', type: 'tech_vuln',     severity: 'medium',   source: 'CSPM',              title: 'Stripe Connect webhooks lack signature verification on staging endpoints',         body: 'Webhook signature verification absent on staging endpoints; pattern that has caused multiple peer compromises.',                                                                                                                                                           capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_253',leadId: 'lead_44', type: 'compliance_audit',severity: 'medium', source: 'enterprise customer', title: 'Enterprise seller customer requested SOC 2 Type II',                            body: 'Enterprise sellers requesting SOC 2 attestation as part of vendor risk programs.',                                                                                                                                                                                         capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_254',leadId: 'lead_44', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Head of Trust & Safety',                                                  body: 'Trust & Safety role — natural buyer for fraud + security tooling.',                                                                                                                                                                                                        capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_255',leadId: 'lead_44', type: 'funding',       severity: 'low',      source: 'Crunchbase',        title: 'Series C closed in 2024 — IPO chatter',                                          body: 'Series C close + IPO chatter = typical SOX readiness + security-program scaling window.',                                                                                                                                                                                  capturedAt: '2026-04-02T10:00:00Z' },

  // === Lambda Grid Solutions (lead_45) ===
  { id: 'sig_256',leadId: 'lead_45', type: 'regulatory',    severity: 'critical', source: 'NERC',              title: 'NERC CIP-015-1 INSM standard approved — internal monitoring required',           body: 'NERC CIP-015-1 (Internal Network Security Monitoring) requires internal traffic monitoring within ESPs; phased implementation.',                                                                                                                                          capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_257',leadId: 'lead_45', type: 'industry_breach',severity: 'critical',source: 'CISA',              title: 'Volt Typhoon pre-positioning across US critical infrastructure ongoing',         body: 'Joint advisories continue to flag PRC-state pre-positioning in US electric/water utilities; OT visibility now mandatory.',                                                                                                                                                 capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_258',leadId: 'lead_45', type: 'tech_vuln',     severity: 'high',     source: 'Dragos',            title: 'OSIsoft PI multiple CVEs in 2025 advisories',                                    body: 'PI Server CVEs disclosed in 2025 advisories — utility OT historians widely deployed across the industry.',                                                                                                                                                                 capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_259',leadId: 'lead_45', type: 'compliance_audit',severity: 'high',   source: 'WECC / NERC',       title: 'WECC audit cycle 2026 — CIP-013 (supply chain) emphasis',                         body: 'WECC audit cycle in 2026 places heightened emphasis on CIP-013 supply-chain controls.',                                                                                                                                                                                    capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_260',leadId: 'lead_45', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Director of OT/SCADA Cybersecurity (replacement)',                         body: 'OT-Director role refilling — fresh program owner.',                                                                                                                                                                                                                        capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_261',leadId: 'lead_45', type: 'supply_chain',  severity: 'high',     source: 'CISA',              title: 'CISA advisory on grid-equipment vendor compromises — supplier hygiene critical',  body: 'CISA continues to flag grid-equipment-vendor compromises; CIP-013 due diligence on suppliers materially harder.',                                                                                                                                                          capturedAt: '2026-04-04T12:00:00Z' },

  // === Pacific Bay Water (lead_46) ===
  { id: 'sig_262',leadId: 'lead_46', type: 'regulatory',    severity: 'critical', source: 'EPA',               title: 'EPA Sanitary Survey + AWIA cybersecurity expectations actively enforced',         body: 'EPA continues sanitary-survey-based cyber checks; AWIA cybersecurity provisions in force for water utilities.',                                                                                                                                                            capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_263',leadId: 'lead_46', type: 'industry_breach',severity: 'critical',source: 'CISA',              title: 'Volt Typhoon + IRGC-affiliated activity targeting water utilities',              body: 'PRC and IRGC-affiliated activity targeting water utilities (Aliquippa, multiple 2024–2025 incidents); board-level priority.',                                                                                                                                              capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_264',leadId: 'lead_46', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'Internet-exposed PLCs continue to be exploited — CISA advisory',                  body: 'CISA continues to advise water utilities to remove internet-exposed PLCs and tighten remote access.',                                                                                                                                                                      capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_265',leadId: 'lead_46', type: 'compliance_audit',severity: 'medium', source: 'state',             title: 'CA state audit referencing AWIA cyber-resilience expectations',                   body: 'California state audit referencing AWIA + EPA cyber expectations; documentation of controls required.',                                                                                                                                                                    capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_266',leadId: 'lead_46', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring SCADA/OT Cyber Engineer (1st-of-its-kind)',                                body: 'First-ever dedicated OT cyber engineer — green-field tooling and advisory window.',                                                                                                                                                                                        capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_267',leadId: 'lead_46', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal — public-sector water risk class repricing',                       body: 'Carriers repricing public-sector water utility cyber risk after 2023–2025 incidents.',                                                                                                                                                                                     capturedAt: '2026-04-20T13:00:00Z' },

  // === Quailridge University (lead_47) ===
  { id: 'sig_268',leadId: 'lead_47', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'MOVEit (Cl0p, May 2023) and Snowflake (UNC5537, May 2024) higher-ed echoes',     body: 'Major US universities continue to disclose breach impact stemming from MOVEit and Snowflake campaigns; class actions ongoing.',                                                                                                                                           capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_269',leadId: 'lead_47', type: 'regulatory',    severity: 'high',     source: 'GLBA / FSA',        title: 'GLBA Safeguards Rule applies to higher-ed financial aid — annual risk assessment required', body: 'GLBA Safeguards Rule (revised) applies to higher-ed financial aid offices; documented risk assessment required annually.',                                                                                                                                            capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_270',leadId: 'lead_47', type: 'tech_vuln',     severity: 'high',     source: 'Ellucian',          title: 'Banner ERP critical CVEs disclosed in 2025',                                     body: 'Banner ERP (widely deployed in higher-ed) had critical CVEs disclosed; many institutions lag patching due to academic calendar.',                                                                                                                                          capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_271',leadId: 'lead_47', type: 'compliance_audit',severity: 'medium', source: 'auditor',           title: 'Federal A-133 audit cycle includes cyber controls scrutiny',                     body: 'A-133 audit cycle increasingly scrutinizing cyber controls due to GLBA + research-data sensitivities.',                                                                                                                                                                    capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_272',leadId: 'lead_47', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring Director of Identity & Access Management',                                body: 'Identity-focused hiring — natural buyer for IAM modernization advisory and tooling.',                                                                                                                                                                                      capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_273',leadId: 'lead_47', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal — higher-ed risk class repricing',                                 body: 'Carriers repricing higher-ed cyber risk after 2024 wave of disclosures.',                                                                                                                                                                                                  capturedAt: '2026-04-20T13:00:00Z' },

  // === Tier-One Defense Logistics (lead_48) ===
  { id: 'sig_274',leadId: 'lead_48', type: 'regulatory',    severity: 'critical', source: 'DoD CIO',           title: 'CMMC 2.0 final rule + 48 CFR clauses — contract eligibility on the line',         body: 'CMMC 2.0 final rule + DFARS contract clauses are now appearing in DoD solicitations; non-compliance = contract eligibility risk.',                                                                                                                                         capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_275',leadId: 'lead_48', type: 'industry_breach',severity: 'high',    source: 'news',              title: 'DoD prime supplier disclosed targeted intrusion in 2025 — APT-attributed',        body: 'Peer DoD supplier disclosed APT-attributed intrusion; defense industrial base under sustained pressure.',                                                                                                                                                                  capturedAt: '2026-03-12T13:00:00Z' },
  { id: 'sig_276',leadId: 'lead_48', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'Multiple FortiGate, Ivanti, and PAN-OS CVEs in DIB-relevant tech stack',          body: 'CVE-2024-21762 (FortiGate), CVE-2024-21887 (Ivanti), CVE-2024-3400 (PAN-OS) all relevant to typical DIB perimeter.',                                                                                                                                                       capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_277',leadId: 'lead_48', type: 'compliance_audit',severity: 'critical',source: 'DoD prime',         title: 'Prime requested CMMC L2 readiness packet by July 2026',                          body: 'DoD prime requested CMMC L2 readiness packet — tight 90-day window for advisory + remediation.',                                                                                                                                                                           capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_278',leadId: 'lead_48', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring CMMC Compliance Lead and Insider-Threat Analyst',                          body: 'CMMC + insider-threat hiring — clear program priorities.',                                                                                                                                                                                                                 capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_279',leadId: 'lead_48', type: 'supply_chain',  severity: 'high',     source: 'CISA',              title: 'CISA advisories: PRC-state targeting of DIB suppliers continuing',               body: 'CISA continues to flag DIB suppliers as priority targets; supply-chain hardening + zero trust.',                                                                                                                                                                            capturedAt: '2026-04-04T12:00:00Z' },

  // === Greylock Pipeline (lead_49) ===
  { id: 'sig_280',leadId: 'lead_49', type: 'regulatory',    severity: 'critical', source: 'TSA',               title: 'TSA Pipeline Security Directive cybersecurity requirements active',              body: 'TSA pipeline-cyber directives (post-Colonial Pipeline) continue to be enforced with reporting + control requirements.',                                                                                                                                                    capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_281',leadId: 'lead_49', type: 'industry_breach',severity: 'critical',source: 'CISA',              title: 'Colonial Pipeline (May 2021) precedent + recent 2025 midstream incidents',       body: 'Colonial precedent remains the case study; 2025 incidents at peer midstream operators reinforced board-level concern.',                                                                                                                                                    capturedAt: '2026-04-12T10:30:00Z' },
  { id: 'sig_282',leadId: 'lead_49', type: 'tech_vuln',     severity: 'high',     source: 'Claroty',           title: 'OT scan: 8% of HMIs lacking patch from 2024',                                    body: 'OT scan flagged HMIs missing patches from 2024 advisories — common downside of long maintenance windows.',                                                                                                                                                                 capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_283',leadId: 'lead_49', type: 'compliance_audit',severity: 'high',   source: 'TSA',               title: 'TSA reporting + audit cycle 2026',                                               body: 'TSA reporting + audit cycle ongoing; documented evidence of OT controls required.',                                                                                                                                                                                        capturedAt: '2026-04-18T14:00:00Z' },
  { id: 'sig_284',leadId: 'lead_49', type: 'hiring',        severity: 'medium',   source: 'LinkedIn',          title: 'Hiring OT Threat Hunter and CISO (first dedicated)',                              body: 'Inaugural CISO + threat hunter hiring — major program scaling.',                                                                                                                                                                                                           capturedAt: '2026-04-28T09:30:00Z' },
  { id: 'sig_285',leadId: 'lead_49', type: 'supply_chain',  severity: 'high',     source: 'CISA',              title: 'CISA flags Volt Typhoon pre-positioning in pipeline OT',                          body: 'Volt Typhoon advisories specifically reference midstream/pipeline pre-positioning activity.',                                                                                                                                                                              capturedAt: '2026-04-04T12:00:00Z' },

  // === Coppermark School District (lead_50) ===
  { id: 'sig_286',leadId: 'lead_50', type: 'industry_breach',severity: 'critical',source: 'news',              title: 'K-12 ransomware wave continued in 2025 — multiple districts hit',                 body: 'K-12 ransomware activity persisted; multiple districts disclosed weeks-long disruptions and student-data exposure.',                                                                                                                                                       capturedAt: '2026-04-26T11:00:00Z' },
  { id: 'sig_287',leadId: 'lead_50', type: 'regulatory',    severity: 'high',     source: 'FCC / E-Rate',      title: 'FCC E-Rate Cybersecurity Pilot active — cyber spend now eligible',               body: 'FCC pilot expands E-Rate eligibility to cyber tools; budget unlock for districts.',                                                                                                                                                                                        capturedAt: '2026-04-22T11:00:00Z' },
  { id: 'sig_288',leadId: 'lead_50', type: 'tech_vuln',     severity: 'high',     source: 'CISA KEV',          title: 'PowerSchool customer-data exposure (Dec 2024) reset K-12 vendor expectations',    body: 'PowerSchool support-credential incident (Dec 2024) led to broad K-12 disclosure obligations — districts now demand vendor attestations.',                                                                                                                                  capturedAt: '2026-04-30T09:00:00Z' },
  { id: 'sig_289',leadId: 'lead_50', type: 'compliance_audit',severity: 'medium', source: 'state',             title: 'AZ state student-data privacy questionnaire due Q3',                              body: 'AZ state-level student-data attestation cycle requires documented controls + vendor list.',                                                                                                                                                                                capturedAt: '2026-04-15T13:30:00Z' },
  { id: 'sig_290',leadId: 'lead_50', type: 'hiring',        severity: 'low',      source: 'LinkedIn',          title: 'Posted Director of Technology (combined IT + security responsibilities)',         body: 'Combined IT/security director role — high-touch advisory window.',                                                                                                                                                                                                         capturedAt: '2026-04-25T08:30:00Z' },
  { id: 'sig_291',leadId: 'lead_50', type: 'insurance',     severity: 'medium',   source: 'broker',            title: 'Cyber renewal — K-12 risk class repricing significantly',                        body: 'K-12 cyber risk class repricing materially upward; MFA + EDR coverage now binder conditions.',                                                                                                                                                                             capturedAt: '2026-04-20T13:00:00Z' },

  // Additional cross-lead "today" / "this_week" fresh signals (sig_292–sig_300)
  { id: 'sig_292',leadId: 'lead_1', type: 'news',           severity: 'medium',   source: 'CISA',              title: 'CISA fresh advisory on Black Basta TTPs — May 2026',                              body: 'New CISA advisory updates Black Basta indicators of compromise; relevant to recent provider-sector targeting.',                                                                                                                                                            capturedAt: '2026-05-03T08:00:00Z' },
  { id: 'sig_293',leadId: 'lead_4', type: 'news',           severity: 'medium',   source: 'NAIC',              title: 'NAIC model cyber-disclosure law adopted in 4 more states',                       body: 'Four additional states adopted versions of NAIC Insurance Data Security Model Law; payer compliance burden growing.',                                                                                                                                                      capturedAt: '2026-05-02T11:00:00Z' },
  { id: 'sig_294',leadId: 'lead_9', type: 'news',           severity: 'medium',   source: 'NYDFS',             title: 'NYDFS issued 2025 industry letter on AI-related cyber controls',                  body: 'NYDFS guidance on AI use-cases sets expectations for fintech adoption; relevant to Volterra\'s AI feature roadmap.',                                                                                                                                                       capturedAt: '2026-05-03T09:30:00Z' },
  { id: 'sig_295',leadId: 'lead_11',type: 'news',           severity: 'high',     source: 'PCI SSC',           title: 'Updated PCI 4.0.1 errata published April 2025 — script integrity refinements',    body: 'PCI 4.0.1 errata clarified Section 11.6 script-integrity expectations; processors should verify implementation alignment.',                                                                                                                                                capturedAt: '2026-05-02T13:00:00Z' },
  { id: 'sig_296',leadId: 'lead_19',type: 'news',           severity: 'high',     source: 'DoD CIO',           title: 'DoD released updated CMMC FAQs in April 2026',                                   body: 'Updated CMMC FAQ clarifies inheritance from cloud provider attestations; relevant to small DIB suppliers.',                                                                                                                                                                capturedAt: '2026-05-01T10:30:00Z' },
  { id: 'sig_297',leadId: 'lead_34',type: 'news',           severity: 'medium',   source: 'ABA',               title: 'ABA Standing Committee opinion on AI tools updated in 2025',                     body: 'ABA opinion sharpened expectations on attorney supervision of AI tools — security/confidentiality central.',                                                                                                                                                               capturedAt: '2026-05-01T12:00:00Z' },
  { id: 'sig_298',leadId: 'lead_45',type: 'news',           severity: 'high',     source: 'NERC',              title: 'NERC issued 2026 ERO Enterprise priorities — INSM at the top',                    body: 'NERC ERO priorities place CIP-015 INSM and CIP-013 supply chain at the top of 2026 audit focus.',                                                                                                                                                                          capturedAt: '2026-05-02T10:00:00Z' },
  { id: 'sig_299',leadId: 'lead_48',type: 'news',           severity: 'critical', source: 'CISA',              title: 'CISA fresh advisory on Salt Typhoon-style targeting of telcos and DIB',           body: 'Fresh CISA advisory on PRC-affiliated Salt Typhoon-style operations targeting telcos and DIB — DIB suppliers urged to test detection controls.',                                                                                                                          capturedAt: '2026-05-03T07:30:00Z' },
  { id: 'sig_300',leadId: 'lead_50',type: 'news',           severity: 'medium',   source: 'CIS / MS-ISAC',     title: 'MS-ISAC May 2026 K-12 advisory — phishing wave targeting district staff',         body: 'MS-ISAC K-12 advisory describes a fresh phishing wave targeting district business-office staff with payroll-redirect lures.',                                                                                                                                              capturedAt: '2026-05-03T08:30:00Z' },
];

export const emails: Email[] = [
  // === Healthcare (leads 1–8) ===
  { id: 'em_1',  leadId: 'lead_1', contactId: 'ct_1',  variant: 'threat_anchored', subject: 'MFA + 24/7 SOC ahead of your Q4 cyber renewal', preview: 'Two regional systems disclosed Black Basta last month and BCBS is now demanding monthly attestation…',
    body: `Sarah —

Two Midwest systems disclosed Black Basta ransomware in March, and post–Change Healthcare, BCBS is now requiring monthly attestation packets from provider partners. With your NetScaler still externally visible and 6 open security reqs, carriers are pricing 18–32% renewal hikes on systems without MFA-everywhere and 24/7 monitoring.

We've stood up MDR + IR retainer at three Midwest health systems in the last six months — 11 days from kickoff to first true-positive containment.

Worth 25 minutes to walk through the Q4-renewal-ready playbook?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_2',  leadId: 'lead_1', contactId: 'ct_1',  variant: 'executive_brief', subject: 'Quick brief — HIPAA NPRM finalization & insurance pressure', preview: 'One-page mapping you can take to the audit committee…',
    body: `Sarah —

Board-level brief: HHS is expected to finalize the HIPAA Security Rule NPRM this quarter — mandating MFA, encryption at rest, vulnerability scanning, and IR testing. Carriers are repricing renewals against the same controls.

We've gotten three Midwest systems to "audit-evidence ready" against the new rule in under 90 days, with MDR included. Happy to send a one-page gap-to-rule mapping you can take straight to your audit committee.

Want it in your inbox?

— [Sender]`,
    predictedOpenRate: 0.58, predictedReplyRate: 0.12 },

  { id: 'em_3',  leadId: 'lead_2', contactId: 'ct_4',  variant: 'threat_anchored', subject: 'Texas pediatric chain hit with Cl0p — your SonicWall posture', preview: 'Three of your clinic locations still on legacy TZ firmware…',
    body: `Marcus —

A 40-clinic pediatric chain in Texas disclosed a Cl0p-attributed data theft via a managed file transfer appliance in February — same playbook as the 2023 MOVEit campaign. Three of Cardinal's clinics still show legacy SonicWall TZ firmware externally; Akira and BianLian have actively chained those CVEs in 2024–2025.

We could close that gap, attest to your top payer's new SOC 2 packet, and stand up monitoring — all on one engagement.

15 minutes to walk through?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_4',  leadId: 'lead_2', contactId: 'ct_5',  variant: 'cold_intro', subject: 'Cardinal\'s payer attestation cycle — making it boring', preview: 'A way to keep your largest payer happy without hijacking IT for a quarter…',
    body: `Priya —

Quick note from outside the noise: most pediatric networks I work with are now spending two FTE-quarters a year on payer attestation packets after the post-Change-Healthcare tightening. With Welsh Carson exploring add-ons in FL/TN, the integration cycle on top will multiply that.

We've built a "payer-ready" service that compresses the packet to two weeks per cycle. Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.09 },

  { id: 'em_5',  leadId: 'lead_3', contactId: 'ct_7',  variant: 'threat_anchored', subject: 'Imaging center hit by BlackCat — your RDP gateway', preview: 'Server 2016 with externally exposed RDP-over-TLS at HQ subnet…',
    body: `Anika —

A 12-site regional imaging center disclosed ALPHV/BlackCat ransomware in Q4; recovery topped $8M and triggered cyber non-renewal. Northwind\'s HQ subnet still shows an RDP gateway on Server 2016 — an EOL profile ransomware affiliates love.

If your broker is hinting at MDR-or-non-renew before August, we could have you renewal-ready in 6 weeks.

Worth a 20-minute walk-through?

— [Sender]`,
    predictedOpenRate: 0.54, predictedReplyRate: 0.10 },
  { id: 'em_6',  leadId: 'lead_3', contactId: 'ct_8',  variant: 'executive_brief', subject: 'CFO brief — cyber renewal & CAP inspection risk', preview: 'A two-page picture for your finance committee…',
    body: `Greg —

Quick CFO-level picture: CAP checklist updates now include cyber controls as inspection-relevant; carriers are tightening lab risk class after a national peer\'s 9.5M-record breach. With Northwind\'s renewal in August and a new IT director driving modernization, this is the right window to budget once and clear three audits.

I can send a 2-page financial picture (premium impact, audit savings, MDR coverage) — useful for the next finance committee?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.11 },

  { id: 'em_7',  leadId: 'lead_4', contactId: 'ct_10', variant: 'threat_anchored', subject: 'Salesforce Experience Cloud — guest-access exposure', preview: 'Same misconfiguration responsible for multiple 2024 healthcare leaks…',
    body: `Rachel —

A specific signal worth your time: PrismCare\'s Salesforce Health Cloud Experience Cloud sites show patterns consistent with overly-permissive guest-user access — the misconfiguration responsible for several 2024 payer-side data leaks. Combined with the HIPAA NPRM finalization expected this quarter and your new CRO\'s 90-day review window, that\'s a high-leverage fix.

I can have a quick scan + remediation playbook in your inbox by Friday — useful?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.13 },
  { id: 'em_8',  leadId: 'lead_4', contactId: 'ct_12', variant: 'cold_intro', subject: 'Privacy-officer briefing — 2026 HIPAA + NAIC overlap', preview: 'A condensed map for the privacy office…',
    body: `Diana —

Diana — quick note. With four more states adopting NAIC Data Security Model Law and HIPAA NPRM finalization expected, payer privacy programs are getting two regulatory updates layered on top of each other. We\'ve built a one-page overlap map (which controls satisfy both) that\'s helped peer privacy officers compress remediation work.

Want it sent over?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.08 },

  { id: 'em_9',  leadId: 'lead_5', contactId: 'ct_13', variant: 'threat_anchored', subject: 'FDA 524B + Windchill CVEs in CISA KEV', preview: 'Specific to AltaMed\'s tech stack and your tuck-in integration…',
    body: `Brian —

Two device manufacturers disclosed breaches in 2025 traced to insecure update servers, prompting FDA safety communications and resetting 510(k) cyber expectations. AltaMed\'s Windchill PLM is now in CISA KEV territory, and the Feb tuck-in is the kind of integration that surfaces identity sprawl and SBOM mismatches.

If your top hospital customer is moving to quarterly third-party risk packets, we can compress the cycle and tighten SBOM hygiene at once.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.56, predictedReplyRate: 0.12 },
  { id: 'em_10', leadId: 'lead_5', contactId: 'ct_14', variant: 'cold_intro', subject: 'Section 524B — making the premarket cyber section boring', preview: 'A reusable submission packet that survives FDA review…',
    body: `Elena —

Heard from a peer device-mfr RA leader that 524B has turned premarket cyber into a 50–80 hour rework cycle per submission. We\'ve built a reusable cyber submission packet (SBOM, VMP, post-market plan) that\'s survived three FDA pre-subs untouched.

Want me to send a redacted version?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.09 },

  { id: 'em_11', leadId: 'lead_6', contactId: 'ct_16', variant: 'threat_anchored', subject: 'HITRUST r2 by Q4 — without breaking your roadmap', preview: 'Three telehealth peers ran the playbook with us in 7 months…',
    body: `Sam —

If a top-3 customer made HITRUST r2 a renewal condition, you\'re looking at a 6–9 month engagement with $300–600K in audit + advisory and a real risk of derailing platform work. Three telehealth peers ran a streamlined version with us in seven months without freezing roadmap — we map controls back to your existing AWS, Auth0, and Vanta posture rather than rebuilding from scratch.

Open to a 20-minute walk-through?

— [Sender]`,
    predictedOpenRate: 0.61, predictedReplyRate: 0.14 },
  { id: 'em_12', leadId: 'lead_6', contactId: 'ct_17', variant: 'executive_brief', subject: 'Series-C posture — what the board will ask in Q3', preview: 'Three things every Series-C health-tech CTO is now asked…',
    body: `Olivia —

Three things every Series-C health-tech CTO is being asked by the board this year: HITRUST timeline, BAA defensibility, and AI-feature security. We\'ve built a 2-page "board pre-read" for telehealth platforms that knocks all three down to one page each.

Want a copy?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_13', leadId: 'lead_7', contactId: 'ct_19', variant: 'threat_anchored', subject: 'Behavioral health Black Basta + your CO state findings', preview: 'IR plan + BAAs + clinic SMB exposure — one engagement…',
    body: `Jenna —

The multi-state behavioral health network that disclosed Black Basta in January took $14M+ to recover. Stoneridge\'s recent state audit flagged out-of-date BAAs and an untested IR plan, and external scans show open SMB across four facilities. Carrier wants segmented clinical networks at renewal.

We can close all three on one engagement with a Q3-renewal-ready milestone. Worth 20 minutes?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_14', leadId: 'lead_7', contactId: 'ct_20', variant: 'cold_intro', subject: 'A boring path to clinical-network segmentation', preview: 'Without a year-long network rebuild…',
    body: `Carlos —

Most behavioral-health COOs I work with are quoted a year-long network rebuild for "clinical segmentation" their cyber broker is asking for. There\'s a faster route — identity-based segmentation layered onto your Cisco Meraki — that we\'ve run in 8 weeks at three peers. Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.08 },

  { id: 'em_15', leadId: 'lead_8', contactId: 'ct_22', variant: 'threat_anchored', subject: 'Citrix Gateway + 24% premium hike at renewal', preview: 'Two of your facilities still missing the CitrixBleed patch…',
    body: `Greg —

Quick specific: two of Emberline\'s facilities still appear to be missing the CitrixBleed (CVE-2023-4966) patch that was released in October 2023. With your 24% premium hike at renewal and CMS\'s emergency-prep rule now factoring cyber, the same fix unlocks both audit and insurance value.

We\'ve done the same compression for two SNF chains in the last 12 months. 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.58, predictedReplyRate: 0.12 },
  { id: 'em_16', leadId: 'lead_8', contactId: 'ct_24', variant: 'executive_brief', subject: 'CFO view — cyber as a CMS care-delivery risk', preview: 'A picture for the next ops review…',
    body: `Phil —

Quick view for ops review: a 200-facility SNF chain hit by ransomware in Q1 had medication-administration delays severe enough that CMS imposed civil monetary penalties. Cyber is increasingly a care-delivery risk on the CMS side, not just a compliance risk. We can send a one-page picture (premium savings + CMP avoidance) tailored to Emberline\'s portfolio.

Want it?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.10 },

  // === Fintech (leads 9–16) ===
  { id: 'em_17', leadId: 'lead_9', contactId: 'ct_25', variant: 'threat_anchored', subject: 'NYDFS annual + Snowflake echo + sponsor-bank quarterly', preview: 'Three deadlines, one engagement…',
    body: `Ethan —

Three things converging: NYDFS Part 500 annual cycle is live, Snowflake/UNC5537 lookalike campaigns are still hitting fintechs, and your sponsor bank wants quarterly third-party risk packets. With S-1 prep on the horizon, that\'s a stack.

We\'ve built a "fintech regulatory cockpit" that compresses NYDFS + SOC 2 + sponsor-bank packets to one quarterly pull. Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.64, predictedReplyRate: 0.16 },
  { id: 'em_18', leadId: 'lead_9', contactId: 'ct_26', variant: 'executive_brief', subject: 'IPO-readiness — cyber as the third gate', preview: 'After SOX and SOC 2, the SEC cyber rule is the third gate…',
    body: `Jasmine —

IPO-readiness has three cyber gates now: SOX, SOC 2 Type II, and the SEC cyber-disclosure rule. Most fintechs underestimate the third — boards have been forced to disclose under the 4-business-day rule with much less material than they expected. We can build the IR + 8-K decision tree before underwriter diligence sees it.

Want a sample run-book?

— [Sender]`,
    predictedOpenRate: 0.52, predictedReplyRate: 0.11 },

  { id: 'em_19', leadId: 'lead_10', contactId: 'ct_28', variant: 'threat_anchored', subject: 'BNPL ATO wave + your sponsor bank\'s March packet', preview: 'Credential stuffing has reset BNPL underwriting…',
    body: `Naomi —

The BNPL peer that disclosed credential-stuffing ATO on 600K users this quarter has reset BNPL underwriting expectations: bot-management, MFA, and step-up auth are now table stakes. With your sponsor bank requesting fresh SOC 2 + pen test in March and a Head of Security & Compliance req still open, this is a window to ship fast.

We could have your renewal packet + ATO controls live in 6 weeks. Open?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.13 },
  { id: 'em_20', leadId: 'lead_10', contactId: 'ct_29', variant: 'cold_intro', subject: 'Stale OAuth client IDs in your archived repos', preview: 'A 60-minute housekeeping exercise that closes a real gap…',
    body: `Daniel —

Quick specific finding: archived public repos under Brightline reference OAuth client IDs and webhook URLs. It\'s a 60-minute housekeeping exercise to rotate, but the same gap has been the lead-in to two recent fintech breaches. Happy to share the exact repos and a rotation playbook.

Want it?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.10 },

  { id: 'em_21', leadId: 'lead_11', contactId: 'ct_31', variant: 'threat_anchored', subject: 'PCI 4.0 full enforcement — Cobalt\'s 2026 ROC will be the first', preview: 'Section 11.6 e-skimming clarified in 4.0.1 errata…',
    body: `Marcus —

PCI DSS 4.0 has been mandatory since April 1 2025, and Cobalt\'s 2026 ROC will be the first audit cycle to enforce all formerly-best-practice controls — including the Section 11.6 e-skimming refinements from the 4.0.1 errata. Your top-10 customer\'s combined PCI + healthcare-payments attestation request adds heat.

We\'ve closed the new 11.6 controls + cross-walked HIPAA-adjacent at two payments processors in 90 days. Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_22', leadId: 'lead_11', contactId: 'ct_33', variant: 'executive_brief', subject: 'ICBC echo — what processors should rehearse before Q3', preview: 'A board-level resilience tabletop in 90 minutes…',
    body: `Tariq —

ICBC remains the case study every payments-processor board asks about. We\'ve built a 90-minute board-level tabletop tuned to processor failure modes (ACH cutover, sponsor-bank notification, treasury liquidity) that\'s run cleanly at three peers.

Want me to send the deck?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.10 },

  { id: 'em_23', leadId: 'lead_12', contactId: 'ct_34', variant: 'threat_anchored', subject: 'SEC cyber-rule + Q1 RIA breach + legacy auth on advisor mailboxes', preview: 'A specific lever with low-effort upside…',
    body: `Caroline —

The Q1 third-party RIA breach via a portfolio-accounting vendor has every wealth board re-examining vendor risk under the 4-business-day SEC rule. Anchorpoint still has legacy auth enabled on a subset of advisor mailboxes — known BEC initial-access vector. Disabling it is a 1-week project that materially shrinks the SEC-disclosure surface.

Worth a 20-minute walk on a packaged remediation?

— [Sender]`,
    predictedOpenRate: 0.60, predictedReplyRate: 0.13 },
  { id: 'em_24', leadId: 'lead_12', contactId: 'ct_36', variant: 'cold_intro', subject: 'CRO-level — your phishing-sim cadence is now an underwriter question', preview: 'A four-question evidence checklist for renewals…',
    body: `Sonia —

Underwriters are now explicitly asking for phishing-sim cadence and click-rate trend at renewals. We\'ve put together a 4-question evidence checklist that\'s saved peer CROs from a renewal scramble.

Want it?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.09 },

  { id: 'em_25', leadId: 'lead_13', contactId: 'ct_37', variant: 'threat_anchored', subject: 'Sponsor-bank SOC 2 by Q4 — the path that doesn\'t freeze engineering', preview: 'GitHub OAuth-app sprawl plus sponsor-bank deadline…',
    body: `Vince —

Sponsor banks made SOC 2 Type II a hard condition post-Synapse, and we\'re seeing fintech engineering orgs lose 20–30% of capacity to scope-creep when they self-run. Lattice\'s GitHub OAuth-app sprawl plus the Q4 deadline = a tight window where the wrong scoping costs you a quarter.

We\'ve hit Type II at five Series-B fintechs in 14 weeks without sliding roadmap. 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.58, predictedReplyRate: 0.12 },
  { id: 'em_26', leadId: 'lead_13', contactId: 'ct_38', variant: 'executive_brief', subject: 'COO view — sponsor-bank packet as a 1-quarter sprint', preview: 'Predictable, board-ready, no engineering drag…',
    body: `Maya —

Quick COO view: sponsor-bank packets done well are a 1-quarter sprint with a board-ready deliverable; done poorly they sprawl and consume engineering bandwidth. We can scope yours into a fixed-price, fixed-timeline engagement with milestones that match your sponsor bank\'s diligence calendar.

Want a sample plan?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_27', leadId: 'lead_14', contactId: 'ct_40', variant: 'threat_anchored', subject: 'Wiper at a peer + AD CVEs in KEV — for trade-floor isolation', preview: 'Specific to your colo cage and AD estate…',
    body: `Henrik —

The 2025 wiper attack at a peer prop firm reset the industry conversation on segmentation and trade-floor isolation, and CFTC examiners are now explicitly asking for OT/colo-cage cyber documentation. With multiple AD CVEs back in CISA KEV and Tanium already deployed, we can deliver a colo-segmentation evidence packet on a 6-week sprint.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.61, predictedReplyRate: 0.13 },
  { id: 'em_28', leadId: 'lead_14', contactId: 'ct_41', variant: 'cold_intro', subject: 'CTO-level — insider-threat program with low fingerprint', preview: 'For prop trading without slowing the floor…',
    body: `Lily —

Insider-threat programs at prop firms tend to fail in two ways — too much friction for the desk, or too little signal for the SOC. We\'ve run a low-fingerprint variant at three peer firms that delivers high-confidence detection without slowing trade-floor work.

Want a 1-pager?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.09 },

  { id: 'em_29', leadId: 'lead_15', contactId: 'ct_43', variant: 'threat_anchored', subject: 'DPRK exchange-theft surge + npm typosquats vs. Fireblocks SDK', preview: 'Two specific levers for a regulated exchange…',
    body: `Mia —

DPRK clusters drove a record $2.2B+ in exchange thefts in 2024 with elevated 2025 levels — your banking partner\'s SOC 2 + ISO 27001 demand and the Fireblocks-SDK typosquatting wave are both downstream of that pressure. We\'ve hardened supply chains + customer-asset segregation at two regulated exchanges in under 90 days.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.60, predictedReplyRate: 0.13 },
  { id: 'em_30', leadId: 'lead_15', contactId: 'ct_44', variant: 'executive_brief', subject: 'CTO/founder brief — what banking partners actually want to see', preview: 'A 6-document evidence packet that closes the bank diligence loop…',
    body: `Felix —

Banking partners post-FTX want a specific 6-document evidence packet, not a generic SOC 2. We can build that packet in 8 weeks on Gradient\'s existing AWS + Fireblocks + Okta posture without a security re-architecture.

Want the document list?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.10 },

  { id: 'em_31', leadId: 'lead_16', contactId: 'ct_46', variant: 'threat_anchored', subject: 'NCUA exam Q3 + Akira at peer credit unions', preview: 'A focused 90-day uplift before exam…',
    body: `Walter —

A peer mid-size credit union had member services down 6 days from Akira ransomware in Q1, with $4–7M recovery + regulatory fines. With your NCUA exam scheduled Q3 (ACET-aligned) and an underwriter requesting tested IR plan evidence, a focused 90-day uplift hits all three.

We\'ve done that uplift at four credit unions in the last year. Open to a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.12 },
  { id: 'em_32', leadId: 'lead_16', contactId: 'ct_48', variant: 'executive_brief', subject: 'CRO view — exam + insurance + member-services resilience', preview: 'A single board-pre-read for Q2 risk committee…',
    body: `Doug —

Quick CRO-level view: NCUA ACET, cyber renewal, and member-services resilience are converging into one risk-committee conversation. We\'ve built a board-pre-read template that consolidates the three into a 4-page picture with a 90-day uplift roadmap.

Want it for your Q2 committee?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.10 },

  // === Manufacturing (leads 17–23) ===
  { id: 'em_33', leadId: 'lead_17', contactId: 'ct_49', variant: 'threat_anchored', subject: 'CMMC L2 by Sep + FortiGate KEV + Volt Typhoon advisories', preview: 'Three pressures, one DoD-prime-ready packet…',
    body: `Steven —

Three forces converging on Forgewright: your DoD prime customer\'s CMMC L2 readiness packet due September, active exploitation of CVE-2024-21762 across your FortiGate footprint, and continuing CISA/NSA Volt Typhoon advisories on manufacturing supply chains. We\'ve built a packet at two DoD subs that hit all three on one engagement.

Open to a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_34', leadId: 'lead_17', contactId: 'ct_50', variant: 'cold_intro', subject: 'OT-Director view — visibility before segmentation', preview: 'A 30-day OT-asset baseline that funds itself…',
    body: `Aisha —

Most OT segmentation projects I see at industrial OEMs fail because they start before the asset baseline is good. We\'ve built a 30-day OT-asset baseline (Claroty-class output, no agent on the floor) that\'s funded itself in insurance savings at two peers.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.10 },

  { id: 'em_35', leadId: 'lead_18', contactId: 'ct_52', variant: 'threat_anchored', subject: 'Default PLC creds + Black Basta at a chemicals peer', preview: '14% of plant PLCs flagged + auto-OEM NIST CSF request…',
    body: `Gabriela —

Internal scans flagged 14% of Continental\'s PLCs with default or weak credentials, and a North American specialty chemicals peer disclosed Black Basta in late 2025 with $20M+ remediation. Your top auto-OEM customer\'s NIST CSF mapping request and Q4 cyber renewal\'s production-loss scrutiny make this the right window.

A focused 60-day uplift could close PLCs, evidence CSF, and reset the renewal narrative.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.12 },
  { id: 'em_36', leadId: 'lead_18', contactId: 'ct_54', variant: 'executive_brief', subject: 'CIO brief — chemicals-sector cyber as a customer scorecard issue', preview: 'A 1-page picture for the executive committee…',
    body: `Yara —

Quick CIO-level picture: chemicals-sector cyber is now showing up on customer scorecards, not just regulatory questionnaires. We\'ve built a one-page exec picture (customer-scorecard impact, OT-uplift cost, insurance offset) tuned to chemicals OEMs.

Want a copy?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_37', leadId: 'lead_19', contactId: 'ct_55', variant: 'threat_anchored', subject: 'CMMC L2 + ITAR enforcement + APT-attributed peer intrusion', preview: 'A specific path that protects program eligibility…',
    body: `Frank —

State Dept ITAR enforcement actions in 2025 explicitly cited cyber-controls gaps; an aerospace tier-2 peer disclosed an APT-attributed intrusion this March; your prime\'s third-party risk packet is due July. CMMC L2 third-party assessment plus ITAR-segmented network attestations are now contract-eligibility issues, not just compliance hygiene.

We\'ve carried two aerospace primes through the same triple-pressure on one engagement. 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.65, predictedReplyRate: 0.16 },
  { id: 'em_38', leadId: 'lead_19', contactId: 'ct_56', variant: 'executive_brief', subject: 'CMMC PM view — controls inheritance + evidence packs', preview: 'A reusable evidence library that survives 3PAO scrutiny…',
    body: `Megan —

Most CMMC PMs end up rebuilding the same evidence three times. We\'ve built a controls-inheritance + evidence-packs library tuned to defense contractors that\'s survived three 3PAO assessments untouched.

Want the structure?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.11 },

  { id: 'em_39', leadId: 'lead_20', contactId: 'ct_58', variant: 'threat_anchored', subject: 'FSMA 204 + EOL Wonderware HMIs at 2 plants', preview: 'Cyber outages are becoming traceability outages…',
    body: `Ben —

FSMA 204 traceability compliance (Jan 2026) makes cyber outages into traceability outages — and Northshore has Wonderware InTouch on EOL Windows at two plants, a known ransomware-affiliate target. Your big-box customer\'s recent SOC 2 request and a tightening cyber market make this the moment.

Open to a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_40', leadId: 'lead_20', contactId: 'ct_60', variant: 'cold_intro', subject: 'CFO — food-sector cyber as a capacity-tightening risk', preview: 'Carriers reducing capacity for food-sector risk…',
    body: `Eric —

Cyber carriers are quietly reducing capacity for food-sector risk after the 2024–2025 production losses. Most CFOs I work with are surprised by the renewal quote even when posture is fine. We\'ve put together a 1-pager on what underwriters now ask for and how to surface it cleanly at renewal.

Want it?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },

  { id: 'em_41', leadId: 'lead_21', contactId: 'ct_61', variant: 'threat_anchored', subject: 'CDK echo + FortiGate KEV + OEM NIST CSF Tier-3 by Q3', preview: 'Three forces converging on Iron Crescent\'s plant DMZs…',
    body: `Dimitri —

Three forces converging: top-3 OEM customer requiring NIST CSF Tier 3 by Q3, active exploitation of FortiGate CVE-2024-21762 across plant DMZs, and TISAX scrutiny on European-bound shipments. CDK echo means OEM scorecards are tightening even on tier-2 suppliers.

We\'ve compressed the same triple-pressure to a 90-day program at two peer Tier-1/Tier-2 suppliers. 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.61, predictedReplyRate: 0.13 },
  { id: 'em_42', leadId: 'lead_21', contactId: 'ct_62', variant: 'cold_intro', subject: 'Plant-IT view — OT visibility you can install on swing shift', preview: 'No floor downtime, baseline in 30 days…',
    body: `Carla —

Most plant-IT directors I work with want OT visibility but can\'t stomach the floor-downtime cost. We\'ve built a 30-day baseline approach we can install on swing shift across multiple plants without unplanned downtime.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.09 },

  { id: 'em_43', leadId: 'lead_22', contactId: 'ct_64', variant: 'cold_intro', subject: 'First SOC 2 + first cyber tower — done together', preview: 'A clean program-build for a Series-equivalent solar mfr…',
    body: `Liam —

Helios is at the inflection where first SOC 2 readiness and first expanded cyber tower happen at the same time. We\'ve built a clean program-build for solar/storage manufacturers that hits both on a single 12-week engagement.

Want a sample plan?

— [Sender]`,
    predictedOpenRate: 0.45, predictedReplyRate: 0.08 },
  { id: 'em_44', leadId: 'lead_22', contactId: 'ct_65', variant: 'threat_anchored', subject: 'DOE inverter-firmware advisory + 2025 peer compromise', preview: 'A specific posture upgrade tuned to solar mfrs…',
    body: `Tessa —

DOE\'s updated solar-device cyber-risk guidance and the 2025 inverter-platform compromise have reset the bar for what utility customers expect from solar component vendors. We\'ve done the upgrade — SBOM, firmware-integrity, supplier hygiene — at a peer in 10 weeks.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.52, predictedReplyRate: 0.10 },

  { id: 'em_45', leadId: 'lead_23', contactId: 'ct_67', variant: 'threat_anchored', subject: 'CMO ransomware echo + MasterControl CVEs + Part 11 emphasis', preview: '11-day production loss at a peer reset the conversation…',
    body: `Amelia —

A peer CMO\'s 11-day production loss in 2025 plus FDA\'s reaffirmation of Part 11 expectations and the MasterControl CVE wave have reset what sponsor customers want to see. Validation cycles make patch lag inevitable — we\'ve built a compensating-controls model that\'s held up under three sponsor audits.

Open to a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.57, predictedReplyRate: 0.12 },
  { id: 'em_46', leadId: 'lead_23', contactId: 'ct_68', variant: 'cold_intro', subject: 'GxP IT view — sponsor attestation packet that survives validation', preview: 'A reusable artifact pack tuned to GxP environments…',
    body: `Vikram —

Most GxP IT leaders I work with rebuild the sponsor attestation packet from scratch each year because validation constraints break standard SOC 2 templates. We\'ve built a reusable artifact pack tuned to GxP environments that\'s held up across multiple sponsor audits.

Want the structure?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.09 },

  // === SaaS / Tech (leads 24–33) ===
  { id: 'em_47', leadId: 'lead_24', contactId: 'ct_70', variant: 'threat_anchored', subject: 'HRIS ATO at a peer + Q4 ISO+SOC2+CSA STAR triple-attestation', preview: 'A focused 6-month program that doesn\'t derail product…',
    body: `Dev —

The HRIS competitor\'s 4M-employee credential-stuffing ATO has reset enterprise-customer expectations across the segment, and you\'re facing a Q4 ISO 27001 + SOC 2 + CSA STAR triple-attestation request. We\'ve built a focused 6-month program for Series-C HR-tech that hits all three without slowing platform work.

25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.61, predictedReplyRate: 0.13 },
  { id: 'em_48', leadId: 'lead_24', contactId: 'ct_71', variant: 'executive_brief', subject: 'VP Eng — broad sts:AssumeRole + audit-evidence drag', preview: 'A specific finding plus a low-friction remediation pattern…',
    body: `Sasha —

CSPM flagged a small set of IAM roles with broad sts:AssumeRole trust — same misconfiguration that\'s driven multiple recent SaaS exposures. The fix is straightforward; pairing it with audit-evidence automation cuts your Q4 attestation drag substantially.

Want a 1-page remediation pattern?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_49', leadId: 'lead_25', contactId: 'ct_73', variant: 'threat_anchored', subject: 'CI/CD compromise echo + GitHub Actions injections + Q4 dual attestation', preview: 'Devtools customers are uniquely sensitive to provenance…',
    body: `Quentin —

Devtools customers care about CI/CD provenance more than most segments, and the 2025 CI/CD provider compromise + the GitHub Actions injection wave have made signed-artifact + SBOM evidence table stakes. With SOC 2 Type II + ISO 27001 due by year-end, this is the right window to ship.

We\'ve done the program at three Series-B devtools companies in 14–16 weeks. 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_50', leadId: 'lead_25', contactId: 'ct_74', variant: 'cold_intro', subject: 'Platform — CI/CD provenance evidence customers actually read', preview: 'Signed-artifact + SBOM + provenance you can ship in 6 weeks…',
    body: `Riya —

Most devtools platform leaders I work with want a CI/CD provenance posture that customers actually read. We\'ve built a signed-artifact + SBOM + build-provenance bundle that ships in 6 weeks and survives even technically demanding enterprise reviews.

Want a sample bundle?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_51', leadId: 'lead_26', contactId: 'ct_76', variant: 'threat_anchored', subject: 'GLBA Safeguards mapping + SaaS BI peer S3 misconfiguration', preview: 'For a banking customer that wants control mapping…',
    body: `Nora —

A peer SaaS BI vendor\'s public-S3 exposure plus your banking customer\'s GLBA Safeguards mapping request makes this the right window to harden + evidence at once. We\'ve built control-mapping + S3-hardening playbooks specific to BI providers.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_52', leadId: 'lead_26', contactId: 'ct_77', variant: 'cold_intro', subject: 'Director-of-Security view — first-90-days plan for a Series-B BI', preview: 'A no-drama plan for the new role…',
    body: `Jeremy —

Most new SaaS-BI security leaders I talk to inherit Snyk findings, an open SOC 2 audit, and a banking customer\'s questionnaire on day one. We\'ve put together a no-drama first-90-days plan for new Director-of-Security hires at Series-B BI vendors.

Want it?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.09 },

  { id: 'em_53', leadId: 'lead_27', contactId: 'ct_79', variant: 'cold_intro', subject: 'Founding security engineer — what to ship in the first 60 days', preview: 'For Northstar\'s top-customer SOC 2 progression…',
    body: `Ravi —

If your top customer is moving SOC 2 Type I → Type II this quarter and you\'re hiring a founding security engineer, the first 60 days will largely determine whether the audit lands clean. We\'ve put together a 60-day starter pack tuned to vertical SaaS at your stage.

Want it?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.09 },

  { id: 'em_54', leadId: 'lead_28', contactId: 'ct_82', variant: 'threat_anchored', subject: 'Supply-chain SaaS ransomware echo + Q4 dual attestation + MuleSoft S3 finding', preview: 'A focused fix plus the right evidence story…',
    body: `Penelope —

The supply-chain SaaS peer hit by ransomware in 2025 (port-disruption fallout) plus your top-3 customer\'s ISO 27001 + SOC 2 Type II demand and an internal CSPM finding on MuleSoft API logs in a public bucket are converging. We can stand up the dual attestation + close the bucket-exposure on one engagement.

Open to a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.60, predictedReplyRate: 0.13 },
  { id: 'em_55', leadId: 'lead_28', contactId: 'ct_83', variant: 'cold_intro', subject: 'VP Eng — when "CISO + 4 engineers" is the bottleneck, not the answer', preview: 'A scaffolding model for fast-scaling supply-chain SaaS…',
    body: `Ahmed —

Hiring a CISO + 4 engineers is necessary but not sufficient at Aurora\'s stage — the program scaffolding (policies, evidence pipelines, auditor playbooks) determines how much velocity you keep. We\'ve built the scaffolding for two peers; happy to share the structure.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.09 },

  { id: 'em_56', leadId: 'lead_29', contactId: 'ct_85', variant: 'threat_anchored', subject: 'Okta echo + IAM-vendor scrutiny + design-partner SOC 2 demand', preview: 'IAM vendors get asked the hardest questions…',
    body: `Theo —

IAM vendors get asked the hardest customer-trust questions, and Okta\'s 2023 support-system compromise still echoes through every IAM RFP. With design-partner customers demanding SOC 2 Type II by Series-B close and AppExchange-required pen-test + threat-model artifacts, this is the right time to ship.

We\'ve carried two Series-B IAM startups through the same gauntlet. 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.63, predictedReplyRate: 0.14 },
  { id: 'em_57', leadId: 'lead_29', contactId: 'ct_87', variant: 'executive_brief', subject: 'CEO brief — IAM customer-trust as a Series-B unlock', preview: 'A 1-page picture for next board meeting…',
    body: `Jordan —

Quick CEO picture: IAM-vendor customer trust is now a Series-B unlock — design partners want enterprise-grade evidence, and the next board meeting will likely re-litigate it. We\'ve built a 1-page board picture (program plan, cost, expansion impact) tuned to IAM startups.

Want a copy?

— [Sender]`,
    predictedOpenRate: 0.52, predictedReplyRate: 0.11 },

  { id: 'em_58', leadId: 'lead_30', contactId: 'ct_88', variant: 'threat_anchored', subject: 'Martech prompt-injection echo + Snowflake ACCOUNTADMIN finding', preview: 'A specific lever for your privacy + AI surface…',
    body: `Camille —

The 2025 martech prompt-injection-led data exposure has reset enterprise-customer expectations on AI features, and CSPM flagged Snowflake ACCOUNTADMIN access on non-admin services — same pattern that contributed to UNC5537 lateral movement. With CCPA enforcement actions targeting martech consent flows, this is a high-leverage window.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.12 },
  { id: 'em_59', leadId: 'lead_30', contactId: 'ct_90', variant: 'cold_intro', subject: 'GC — CCPA enforcement + AI feature risk in one frame', preview: 'A condensed map for the legal team…',
    body: `Rosa —

Most martech GCs I work with want CCPA enforcement risk and AI feature risk consolidated into one defensible posture. We\'ve put together a 2-page map tuned to martech vendors that\'s held up under CA AG questions.

Want it?

— [Sender]`,
    predictedOpenRate: 0.45, predictedReplyRate: 0.08 },

  { id: 'em_60', leadId: 'lead_31', contactId: 'ct_91', variant: 'threat_anchored', subject: 'Telematics API exposure + NHTSA guidance + Q3 dual attestation', preview: 'A specific path that closes API and audit risk together…',
    body: `Beatriz —

The peer telematics provider\'s BOLA/IDOR-style API exposure plus NHTSA\'s updated cyber best practices and your top fleet customer\'s SOC 2 + ISO 27001 demand are converging. We\'ve built an API-hardening + dual-attestation program for telematics SaaS that ships in 14 weeks.

Open to a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.57, predictedReplyRate: 0.12 },
  { id: 'em_61', leadId: 'lead_31', contactId: 'ct_92', variant: 'executive_brief', subject: 'CTO — IoT MQTT staging exposure (specific finding)', preview: 'A 60-minute fix plus a broader pattern fix…',
    body: `Sergio —

CSPM finding worth your time: a staging-tenant MQTT broker without TLS verification — easy to close in 60 minutes, but the broader pattern is worth a sweep before audit cycle. We can run the sweep + ship a recurring detection rule.

Want the playbook?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_62', leadId: 'lead_32', contactId: 'ct_94', variant: 'threat_anchored', subject: 'K-12 ransomware wave + state student-data attestation by Q4', preview: 'A focused program tuned to edtech vendors…',
    body: `Imani —

K-12 ransomware activity persisted through 2025 and districts are increasingly demanding multi-state student-data attestations (CA AB 1584, NY Ed §2-d, others) on top of SOC 2. With a Head of Security & Privacy role open and renewal pricing repricing upward, this is the right window.

We\'ve built the program at two edtech vendors in 14 weeks. Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_63', leadId: 'lead_32', contactId: 'ct_96', variant: 'cold_intro', subject: 'CEO — edtech trust as a renewal-rate lever', preview: 'A 1-pager for next board meeting…',
    body: `Phoebe —

Most edtech CEOs I talk to underestimate how much district renewals depend on cyber posture rather than product performance. We\'ve put together a 1-pager on the renewal-rate impact of trust posture across edtech segments.

Want it?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },

  { id: 'em_64', leadId: 'lead_33', contactId: 'ct_97', variant: 'threat_anchored', subject: 'Legal AI prompt-injection echo + Am Law SOC2+ISO+TM in 60 days', preview: 'A compressed 60-day program tuned to legal AI…',
    body: `Adrian —

The peer legal AI vendor\'s prompt-injection-led cross-tenant exposure has reset Am Law expectations across the segment, and you\'re looking at a 60-day SOC 2 + ISO 27001 + threat model demand from a high-profile firm. We\'ve built a compressed 60-day legal-AI program — including OpenAI-side hardening — that\'s held up to Am Law diligence.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_65', leadId: 'lead_33', contactId: 'ct_99', variant: 'executive_brief', subject: 'CEO brief — Am Law trust as a Series-A milestone', preview: 'A 1-page picture for next board update…',
    body: `Paul —

Quick founder/CEO picture: Am Law trust is the Series-A→B unlock for legal AI — boards now ask for a documented program by next round. We can have the documentation in your hands in 60 days.

Want the plan?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.10 },

  // === Legal / Professional Services (leads 34–38) ===
  { id: 'em_66', leadId: 'lead_34', contactId: 'ct_100', variant: 'threat_anchored', subject: 'Am Law breach wave + financial-services client triple-attestation', preview: 'Three Am Law firms public, more not — your renewal narrative for Q4…',
    body: `Eleanor —

Multiple Am Law firms experienced ransomware/data-theft events in 2024–2025 (publicly disclosed and otherwise), and SEC cyber-disclosure rule expectations are pushing 24-hour notice clauses into engagement letters. With your top financial-services client requesting ISO 27001 + SOC 2 Type II + tabletop and a primary cyber carrier pulling capacity, this is the moment.

We\'ve led the same triple-pressure at two Am Law firms in 16 weeks. 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.63, predictedReplyRate: 0.15 },
  { id: 'em_67', leadId: 'lead_34', contactId: 'ct_102', variant: 'executive_brief', subject: 'Cyber-Risk MP brief — capacity-pull tower restructure', preview: 'Practical options for keeping coverage at the right tier…',
    body: `Iris —

Quick managing-partner picture: with primary cyber carriers pulling capacity at the Am Law tier, the tower restructure is becoming the more urgent conversation than the controls work. We\'ve built a 1-page picture (controls evidence required for the new tier, cost differential, reporting structure) used at three peer firms.

Want a copy?

— [Sender]`,
    predictedOpenRate: 0.52, predictedReplyRate: 0.11 },

  { id: 'em_68', leadId: 'lead_35', contactId: 'ct_103', variant: 'threat_anchored', subject: 'IRS WISP + tax-season ransomware at peers + CCH KEV', preview: 'Three pressures at the worst possible time of year…',
    body: `Devon —

Two regional accounting peers disclosed ransomware events affecting tax-season operations in 2025, IRS WISP enforcement is widening, and CCH Axcess CVEs entered CISA KEV during peak filing. With public-company audit clients now requesting SOC 2 attestation, this is the moment to consolidate.

We\'ve led an audit-firm program in 14 weeks across all three pressures. Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.57, predictedReplyRate: 0.12 },
  { id: 'em_69', leadId: 'lead_35', contactId: 'ct_104', variant: 'cold_intro', subject: 'Risk Advisory partner — making cyber a billable practice', preview: 'A productized "client-side" cyber bundle…',
    body: `Sloane —

Most accounting/audit firms I work with are leaving cyber-advisory revenue on the table because the practice scaffolding doesn\'t exist internally. We\'ve built a productized client-side cyber bundle that audit firms have white-labeled cleanly.

Want a sample structure?

— [Sender]`,
    predictedOpenRate: 0.45, predictedReplyRate: 0.08 },

  { id: 'em_70', leadId: 'lead_36', contactId: 'ct_106', variant: 'threat_anchored', subject: 'Consultancy ATO at a peer + public-company client SOC 2 + tabletop', preview: 'A focused program for mid-size consulting firms…',
    body: `Tabitha —

The peer consultancy\'s 8K-account credential-stuffing ATO has reset client expectations, and your public-company client\'s SEC-driven SOC 2 + tabletop request makes this the right window. Disabling legacy auth on shared mailboxes is a 1-week ship; the bigger program is a 12-week plan.

Open to a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.54, predictedReplyRate: 0.11 },
  { id: 'em_71', leadId: 'lead_36', contactId: 'ct_107', variant: 'cold_intro', subject: 'MD-level — cyber posture as a business-development moat', preview: 'How peer MDs are using cyber as differentiator…',
    body: `Reggie —

Most MDs at mid-size consultancies treat cyber as cost rather than BD lever. Two peers we work with reframed it as differentiator and won engagements explicitly because of the SOC 2 + tabletop posture. Happy to share the framing.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },

  { id: 'em_72', leadId: 'lead_37', contactId: 'ct_109', variant: 'threat_anchored', subject: 'IP boutique APT41-attributed peer + USPTO scrutiny + tech-client demand', preview: 'A specific path tuned to IP/patent firms…',
    body: `Owen —

The peer IP boutique\'s APT41-attributed intrusion has reset tech-client expectations, and your top tech-client\'s ISO 27001 + advanced threat-hunt evidence demand layers on USPTO scrutiny of unpublished filings. We\'ve built a tuned program for IP boutiques in 12 weeks that delivers all three.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.61, predictedReplyRate: 0.14 },
  { id: 'em_73', leadId: 'lead_37', contactId: 'ct_110', variant: 'executive_brief', subject: 'MP brief — IP firm trust as a mandate-retention issue', preview: 'A 1-page picture for next partner meeting…',
    body: `Marcia —

Quick MP-level picture: IP-firm trust posture is now a mandate-retention issue with major tech clients, not a cost center. We\'ve built a 1-page picture (mandate retention impact, audit cost, threat-hunt evidence) tuned to IP boutiques.

Want it for next partner meeting?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.11 },

  { id: 'em_74', leadId: 'lead_38', contactId: 'ct_112', variant: 'threat_anchored', subject: 'FTC Safeguards + tax-season phishing breach at peer + CCH critical patches', preview: 'A consolidated path tuned to mid-size tax firms…',
    body: `Vincent —

The peer mid-market tax firm\'s phishing breach during 2025 tax season + revised FTC Safeguards Rule full enforcement + CCH critical patches make Q3 the right window. Add a Q1 tuck-in acquisition driving identity sprawl, and consolidating with one engagement saves cycles.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.55, predictedReplyRate: 0.11 },
  { id: 'em_75', leadId: 'lead_38', contactId: 'ct_113', variant: 'cold_intro', subject: 'Cyber & Risk Advisory partner — productized practice play', preview: 'For converting cyber posture into a billable client offering…',
    body: `Lupita —

Most "Cyber & Risk Advisory" partners I work with want a productized client-side offering they can ship without rebuilding from scratch. We\'ve built a tax-firm-tuned bundle that\'s been white-labeled cleanly.

Want a sample structure?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },

  // === E-commerce / Retail (leads 39–44) ===
  { id: 'em_76', leadId: 'lead_39', contactId: 'ct_115', variant: 'threat_anchored', subject: 'PCI 4.0.1 + Magecart wave + Cloudflare bot-mgmt off on checkout', preview: 'A focused 8-week program before peak season…',
    body: `Margot —

PCI DSS 4.0 has been mandatory since April 2025 and the 4.0.1 errata sharpened Section 11.6 (e-skimming) — same vector that hit a peer DTC for 200K cards. Hearthline\'s Cloudflare bot-management isn\'t enforced on login + checkout. With acquirer asking for a fresh ROC, an 8-week sprint covers all three before peak season.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.13 },
  { id: 'em_77', leadId: 'lead_39', contactId: 'ct_116', variant: 'cold_intro', subject: 'Director of Security — peak-season runbook for DTC', preview: 'What to ship before Black Friday…',
    body: `Diego —

Most DTC security leaders I work with under-rehearse for peak season. We\'ve put together a 1-pager runbook (e-skimming, ATO, fraud, IR) tuned to DTC retail before Black Friday.

Want it?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.09 },

  { id: 'em_78', leadId: 'lead_40', contactId: 'ct_118', variant: 'threat_anchored', subject: 'Scattered Spider playbook + PCI 4.0 + level-1 ROC', preview: 'A specific path tuned to omnichannel retailers…',
    body: `Reid —

The Scattered Spider-style social-engineering-led intrusion at a peer outdoor retailer has reset help-desk procedures across the segment, and PCI 4.0\'s e-skimming + script-integrity controls are mandatory for level-1 ROCs in 2026. We\'ve led the program at two omnichannel retailers in 14 weeks.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.62, predictedReplyRate: 0.14 },
  { id: 'em_79', leadId: 'lead_40', contactId: 'ct_120', variant: 'executive_brief', subject: 'PCI Compliance Director — 4.0 evidence pack that survives QSAs', preview: 'A reusable artifact pack for level-1 merchants…',
    body: `Garrett —

Quick Director-level picture: most level-1 merchants we see rebuild their PCI evidence each cycle. We\'ve built a reusable artifact pack tuned to PCI 4.0 / 4.0.1 that\'s survived three QSA cycles cleanly.

Want the structure?

— [Sender]`,
    predictedOpenRate: 0.50, predictedReplyRate: 0.10 },

  { id: 'em_80', leadId: 'lead_41', contactId: 'ct_121', variant: 'cold_intro', subject: 'PCI 4.0 for Shopify Plus DTC — without a custom-checkout overhaul', preview: 'A simpler scope tuned to DTC apparel…',
    body: `Thalia —

Most Shopify-Plus DTC brands I work with overscope PCI 4.0 because their custom-integration patterns aren\'t obvious until QSA review. We\'ve built a tuned-scope approach that compresses the program to 6 weeks.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.08 },
  { id: 'em_81', leadId: 'lead_41', contactId: 'ct_123', variant: 'executive_brief', subject: 'Founder/CEO — DTC trust as a re-purchase-rate lever', preview: 'A 1-pager on the brand-impact side…',
    body: `Sage —

Quick founder picture: DTC trust posture has measurable re-purchase impact post-incident — both as upside (when you market it well) and downside (when you don\'t). We\'ve put together a 1-pager on the brand-impact side tuned to DTC apparel.

Want it?

— [Sender]`,
    predictedOpenRate: 0.45, predictedReplyRate: 0.08 },

  { id: 'em_82', leadId: 'lead_42', contactId: 'ct_124', variant: 'threat_anchored', subject: 'Pet retail Magecart echo + acquirer SAQ-D + token rotation gap', preview: 'A focused 8-week consolidation…',
    body: `Henry —

The peer pet retailer\'s Magecart-style card data theft + your acquirer\'s SAQ-D request + a NetSuite SuiteCloud token rotation overdue 24+ months are converging. An 8-week consolidation hits all three before Q4 audit cycle.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.54, predictedReplyRate: 0.11 },
  { id: 'em_83', leadId: 'lead_42', contactId: 'ct_125', variant: 'cold_intro', subject: 'VP E-commerce — peak-season fraud + cyber as one program', preview: 'For pet retail running on Shopify + NetSuite…',
    body: `Joelle —

Most VP-Ecommerce leaders I work with run fraud and cyber as separate programs and end up double-paying. We\'ve consolidated them into one 1-pager tuned to Shopify + NetSuite-based pet/specialty retail.

Want it?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },

  { id: 'em_84', leadId: 'lead_43', contactId: 'ct_127', variant: 'cold_intro', subject: 'CTO — bot-management + WAF in monitor-only on production checkout', preview: 'A 60-minute fix and a sweep…',
    body: `Lana —

Specific finding: WAF in monitor-only mode on production checkout — easy 60-minute fix, but the broader pattern is worth a sweep before holiday season. We can run the sweep + ship a recurring detection rule.

Want the playbook?

— [Sender]`,
    predictedOpenRate: 0.46, predictedReplyRate: 0.09 },
  { id: 'em_85', leadId: 'lead_43', contactId: 'ct_129', variant: 'executive_brief', subject: 'Founder — CCPA enforcement + DTC subscription consent flows', preview: 'A 1-page picture for next ELT meeting…',
    body: `Mira —

CA AG enforcement actions in 2025 specifically targeted subscription DTC consent + retention practices. Beauty DTC is squarely in that frame. We\'ve put together a 1-page picture (likely AG questions, controls evidence, copy review) tuned to subscription DTC.

Want it?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.10 },

  { id: 'em_86', leadId: 'lead_44', contactId: 'ct_130', variant: 'threat_anchored', subject: 'Marketplace ATO at a peer + Stripe Connect webhook signature gap', preview: 'A specific finding plus the broader fix…',
    body: `Niko —

The peer B2C marketplace\'s 1.2M-user credential-stuffing ATO has reset segment expectations, and a CSPM finding shows Stripe Connect webhooks lacking signature verification on staging endpoints — pattern responsible for multiple peer compromises. We can close both on a focused engagement.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.58, predictedReplyRate: 0.12 },
  { id: 'em_87', leadId: 'lead_44', contactId: 'ct_132', variant: 'cold_intro', subject: 'CFO — IPO chatter + cyber as the third gate', preview: 'For Series-C marketplaces eyeing public markets…',
    body: `Aaron —

IPO-readiness has three cyber gates now: SOX, SOC 2 Type II, SEC cyber-disclosure rule. Marketplaces underestimate the third. We\'ve put together a 1-pager (gate-by-gate readiness + cost picture) tuned to Series-C marketplaces.

Want it?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.09 },

  // === Energy / Education / Defense (leads 45–50) ===
  { id: 'em_88', leadId: 'lead_45', contactId: 'ct_133', variant: 'threat_anchored', subject: 'CIP-015 INSM + Volt Typhoon + WECC CIP-013 audit cycle', preview: 'A consolidated path for a regional utility…',
    body: `Eli —

CIP-015-1 INSM phased implementation + ongoing CISA/NSA Volt Typhoon advisories on US utilities + WECC\'s 2026 CIP-013 audit emphasis are converging. With OSIsoft PI CVEs disclosed in 2025 and a Director of OT/SCADA Cybersecurity role refilling, this is the right window for a consolidated 16-week program.

25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.66, predictedReplyRate: 0.16 },
  { id: 'em_89', leadId: 'lead_45', contactId: 'ct_134', variant: 'executive_brief', subject: 'OT Director brief — CIP-013 supplier hygiene as a 2026 audit risk', preview: 'A reusable supplier-hygiene packet…',
    body: `Yvonne —

CIP-013 supplier hygiene is the 2026 audit risk most utilities aren\'t ready for. We\'ve built a reusable supplier-hygiene packet (NDA-friendly evidence, vendor questionnaires, recurring checks) that\'s held up at three peer utilities.

Want the structure?

— [Sender]`,
    predictedOpenRate: 0.53, predictedReplyRate: 0.11 },

  { id: 'em_90', leadId: 'lead_46', contactId: 'ct_136', variant: 'threat_anchored', subject: 'EPA + AWIA + Volt Typhoon + IRGC-affiliated water targeting', preview: 'A specific path tuned to water utilities…',
    body: `Dario —

Volt Typhoon and IRGC-affiliated activity targeting US water utilities (Aliquippa et al.) plus EPA sanitary-survey + AWIA cyber expectations make this a board-level priority. CISA continues to advise removing internet-exposed PLCs and tightening remote access.

We\'ve led the same program at two water utilities in 14 weeks. Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.64, predictedReplyRate: 0.15 },
  { id: 'em_91', leadId: 'lead_46', contactId: 'ct_137', variant: 'executive_brief', subject: 'GM brief — water-utility cyber as a board-level resilience issue', preview: 'A 2-page picture tuned to municipal water…',
    body: `Helena —

Quick GM-level picture: water-utility cyber is now a board-level resilience issue with explicit nation-state targeting. We\'ve built a 2-page picture (threat profile, control gaps, EPA/AWIA-aligned roadmap) tuned to municipal water utilities.

Want it for the next board?

— [Sender]`,
    predictedOpenRate: 0.54, predictedReplyRate: 0.12 },

  { id: 'em_92', leadId: 'lead_47', contactId: 'ct_139', variant: 'threat_anchored', subject: 'MOVEit/Snowflake echoes + GLBA Safeguards + Banner CVEs', preview: 'A consolidated path tuned to higher-ed…',
    body: `Dean —

MOVEit and Snowflake/UNC5537 echoes continue to ripple through higher-ed disclosures, GLBA Safeguards now applies to financial-aid offices, and Banner ERP critical CVEs disclosed in 2025 remain partially unpatched at most institutions due to the academic calendar. We\'ve led the same triple-pressure at two universities in 16 weeks.

25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.59, predictedReplyRate: 0.13 },
  { id: 'em_93', leadId: 'lead_47', contactId: 'ct_140', variant: 'cold_intro', subject: 'CIO — IAM modernization for higher-ed without a year-long migration', preview: 'A staged plan that survives the academic calendar…',
    body: `Saoirse —

Most higher-ed IAM modernization projects collapse under the academic calendar. We\'ve built a staged plan that ships in three discrete-quarter windows without breaking term cycles.

Want a sample plan?

— [Sender]`,
    predictedOpenRate: 0.48, predictedReplyRate: 0.10 },

  { id: 'em_94', leadId: 'lead_48', contactId: 'ct_142', variant: 'threat_anchored', subject: 'CMMC L2 by July + Salt Typhoon advisory + DIB perimeter CVE chain', preview: 'A program that protects program eligibility…',
    body: `Kira —

The fresh CISA advisory on Salt Typhoon-style targeting of telcos and DIB, paired with the active exploitation of CVE-2024-21762 (FortiGate), CVE-2024-21887 (Ivanti), and CVE-2024-3400 (PAN-OS), makes the prime-requested CMMC L2 readiness packet a contract-eligibility issue. We\'ve led the program at two DIB suppliers in 12 weeks.

25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.67, predictedReplyRate: 0.17 },
  { id: 'em_95', leadId: 'lead_48', contactId: 'ct_144', variant: 'executive_brief', subject: 'FSO brief — insider-threat program as a CMMC L2 force-multiplier', preview: 'A FSO-friendly insider-threat overlay…',
    body: `Felicia —

Insider-threat programs at DIB suppliers tend to fail because they\'re bolted onto FSO duties. We\'ve built an FSO-friendly insider-threat overlay that doubles as CMMC L2 evidence.

Want the structure?

— [Sender]`,
    predictedOpenRate: 0.53, predictedReplyRate: 0.12 },

  { id: 'em_96', leadId: 'lead_49', contactId: 'ct_145', variant: 'threat_anchored', subject: 'TSA + Volt Typhoon + 8% of HMIs unpatched from 2024', preview: 'A specific path tuned to midstream operators…',
    body: `Russell —

CISA Volt Typhoon advisories specifically reference midstream/pipeline pre-positioning, TSA reporting + audit cycle is in flight, and an internal scan flagged 8% of HMIs missing 2024 patches. We\'ve led a 12-week consolidated program at two peer midstream operators.

Worth a 25-minute walk?

— [Sender]`,
    predictedOpenRate: 0.64, predictedReplyRate: 0.15 },
  { id: 'em_97', leadId: 'lead_49', contactId: 'ct_146', variant: 'cold_intro', subject: 'CIO — first CISO + OT threat hunter in one engagement', preview: 'A scaffolding model for fast-scaling midstream cyber…',
    body: `Brenna —

Hiring an inaugural CISO + OT threat hunter without scaffolding usually results in 6 months of program drift. We\'ve built a scaffolding model that gets the team to first-true-positive containment in 60 days.

Worth a quick exchange?

— [Sender]`,
    predictedOpenRate: 0.49, predictedReplyRate: 0.10 },

  { id: 'em_98', leadId: 'lead_50', contactId: 'ct_148', variant: 'threat_anchored', subject: 'K-12 ransomware wave + PowerSchool echo + state attestation by Q3', preview: 'A program that uses E-Rate cyber dollars…',
    body: `Maya —

K-12 ransomware activity persisted in 2025, the PowerSchool support-credential incident reset vendor expectations, and the AZ state student-data privacy questionnaire is due Q3. The FCC E-Rate Cybersecurity Pilot makes this fundable. We\'ve led the same program at three districts in 12 weeks.

Worth a 20-minute walk?

— [Sender]`,
    predictedOpenRate: 0.56, predictedReplyRate: 0.12 },
  { id: 'em_99', leadId: 'lead_50', contactId: 'ct_149', variant: 'executive_brief', subject: 'Superintendent brief — using E-Rate cyber dollars without overpromising', preview: 'A 1-page board picture…',
    body: `Carlos —

Quick superintendent picture: the FCC E-Rate Cybersecurity Pilot makes cyber spend fundable but the application gates many districts overpromise on. We\'ve built a 1-page board picture (deliverables, timeline, fundability) used at three peer districts.

Want a copy?

— [Sender]`,
    predictedOpenRate: 0.51, predictedReplyRate: 0.11 },
  { id: 'em_100',leadId: 'lead_50', contactId: 'ct_150', variant: 'cold_intro', subject: 'CFO — K-12 cyber renewal + payroll-redirect phishing wave', preview: 'A focused fix that lands cleanly with finance…',
    body: `Jenna —

The MS-ISAC May 2026 advisory describes a fresh phishing wave targeting district business-office staff with payroll-redirect lures — at the same moment K-12 cyber renewal pricing is repricing materially upward. A focused fix lands cleanly with finance.

Want a 1-pager?

— [Sender]`,
    predictedOpenRate: 0.47, predictedReplyRate: 0.10 },
];
