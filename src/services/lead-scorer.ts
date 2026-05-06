export interface ICPProfile {
  industries: string[];
  companySizeMin: number;
  companySizeMax: number;
  fundingStages: string[];
  keySignals: string[];
  techStack: string[];
  geoTargets: string[];
  revenueBands: string[];
  buyerTitles?: string[];
  verticals?: string[];
  accountType?: string;
}

export interface ScoreBreakdown {
  total: number;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    reason: string;
  }[];
}

interface LeadData {
  industry: string;
  employees: number;
  funding: string;
  techStack: string[];
  hq: string;
  revenueBand: string;
  signals?: { type: string; title: string }[];
}

export function scoreLead(lead: LeadData, icp: ICPProfile): ScoreBreakdown {
  const factors: ScoreBreakdown["factors"] = [];

  // 1. Industry match (20 pts)
  const industryScore = scoreIndustry(lead.industry, icp.industries);
  factors.push(industryScore);

  // 2. Company size fit (15 pts)
  const sizeScore = scoreSize(lead.employees, icp.companySizeMin, icp.companySizeMax);
  factors.push(sizeScore);

  // 3. Funding stage (10 pts)
  const fundingScore = scoreFunding(lead.funding, icp.fundingStages);
  factors.push(fundingScore);

  // 4. Tech stack overlap (15 pts)
  const techScore = scoreTechStack(lead.techStack, icp.techStack);
  factors.push(techScore);

  // 5. Signal relevance (15 pts)
  const signalScore = scoreSignals(lead.signals || [], icp.keySignals);
  factors.push(signalScore);

  // 6. Geography match (15 pts)
  const geoScore = scoreGeography(lead.hq, icp.geoTargets);
  factors.push(geoScore);

  // 7. Vertical match (10 pts)
  const verticalScore = scoreVertical(lead.industry, icp.verticals);
  factors.push(verticalScore);

  const total = factors.reduce((sum, f) => sum + f.score, 0);

  return { total: Math.min(total, 100), factors };
}

function scoreIndustry(
  leadIndustry: string,
  icpIndustries: string[]
): ScoreBreakdown["factors"][0] {
  if (icpIndustries.length === 0) {
    return { name: "Industry", score: 12, maxScore: 20, reason: "No ICP industry filter set" };
  }

  const leadLower = leadIndustry.toLowerCase();
  for (const ind of icpIndustries) {
    if (leadLower.includes(ind.toLowerCase()) || ind.toLowerCase().includes(leadLower.split("—")[0].trim().toLowerCase())) {
      return { name: "Industry", score: 20, maxScore: 20, reason: `${leadIndustry} matches ICP target "${ind}"` };
    }
  }

  // Partial match (same broad sector)
  const leadSector = leadIndustry.split("—")[0].trim().toLowerCase();
  for (const ind of icpIndustries) {
    if (leadSector.includes(ind.toLowerCase().split(" ")[0])) {
      return { name: "Industry", score: 10, maxScore: 20, reason: `${leadIndustry} partially matches "${ind}"` };
    }
  }

  return { name: "Industry", score: 0, maxScore: 20, reason: `${leadIndustry} not in ICP targets` };
}

function scoreSize(
  employees: number,
  min: number,
  max: number
): ScoreBreakdown["factors"][0] {
  if (min === 0 && max === 0) {
    return { name: "Company Size", score: 8, maxScore: 15, reason: "No size filter set" };
  }

  if (employees >= min && employees <= max) {
    return { name: "Company Size", score: 15, maxScore: 15, reason: `${employees} employees within ${min}-${max} range` };
  }

  if (employees >= min / 2 && employees <= max * 2) {
    return { name: "Company Size", score: 8, maxScore: 15, reason: `${employees} employees near ${min}-${max} range` };
  }

  return { name: "Company Size", score: 0, maxScore: 15, reason: `${employees} employees outside ${min}-${max} range` };
}

function scoreFunding(
  funding: string,
  icpStages: string[]
): ScoreBreakdown["factors"][0] {
  if (icpStages.length === 0) {
    return { name: "Funding", score: 5, maxScore: 10, reason: "No funding filter set" };
  }

  const fundingLower = funding.toLowerCase();
  for (const stage of icpStages) {
    if (fundingLower.includes(stage.toLowerCase())) {
      return { name: "Funding", score: 10, maxScore: 10, reason: `"${funding}" matches "${stage}"` };
    }
  }

  return { name: "Funding", score: 0, maxScore: 10, reason: `"${funding}" not in target stages` };
}

function scoreTechStack(
  leadTech: string[],
  icpTech: string[]
): ScoreBreakdown["factors"][0] {
  if (icpTech.length === 0) {
    return { name: "Tech Stack", score: 8, maxScore: 15, reason: "No tech filter set" };
  }

  const leadSet = new Set(leadTech.map((t) => t.toLowerCase()));
  let matches = 0;
  const matched: string[] = [];

  for (const tech of icpTech) {
    if (leadSet.has(tech.toLowerCase())) {
      matches++;
      matched.push(tech);
    }
  }

  const pct = matches / icpTech.length;
  const score = Math.round(pct * 15);

  return {
    name: "Tech Stack",
    score,
    maxScore: 15,
    reason: matched.length > 0 ? `Matches: ${matched.join(", ")}` : "No tech stack overlap",
  };
}

function scoreSignals(
  signals: { type: string; title: string }[],
  keySignals: string[]
): ScoreBreakdown["factors"][0] {
  if (keySignals.length === 0) {
    return { name: "Signals", score: 8, maxScore: 15, reason: "No signal keywords set" };
  }

  let matches = 0;
  const matched: string[] = [];

  for (const keyword of keySignals) {
    const kw = keyword.toLowerCase();
    for (const signal of signals) {
      if (signal.title.toLowerCase().includes(kw) || signal.type.toLowerCase().includes(kw)) {
        matches++;
        matched.push(keyword);
        break;
      }
    }
  }

  const pct = Math.min(matches / keySignals.length, 1);
  const score = Math.round(pct * 15);

  return {
    name: "Signals",
    score,
    maxScore: 15,
    reason: matched.length > 0 ? `Matching signals: ${matched.join(", ")}` : "No matching signals",
  };
}

const US_STATE_NAMES: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new hampshire", NJ: "new jersey",
  NM: "new mexico", NY: "new york", NC: "north carolina", ND: "north dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode island", SC: "south carolina",
  SD: "south dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west virginia", WI: "wisconsin", WY: "wyoming",
};

function scoreGeography(
  hq: string,
  geoTargets: string[]
): ScoreBreakdown["factors"][0] {
  if (geoTargets.length === 0) {
    return { name: "Geography", score: 8, maxScore: 15, reason: "No geo filter set" };
  }

  const hqLower = hq.toLowerCase();

  // Check for 2-letter state abbreviation targets
  const stateAbbrevTargets = geoTargets.filter((g) => /^[A-Z]{2}$/.test(g.trim()));
  if (stateAbbrevTargets.length > 0) {
    for (const abbrev of stateAbbrevTargets) {
      const stateRegex = new RegExp(`\\b${abbrev}\\b`);
      if (stateRegex.test(hq)) {
        return { name: "Geography", score: 15, maxScore: 15, reason: `HQ "${hq}" matches target state "${abbrev}"` };
      }
      // Also match full state name in HQ
      const fullName = US_STATE_NAMES[abbrev.toUpperCase()];
      if (fullName && hqLower.includes(fullName)) {
        return { name: "Geography", score: 15, maxScore: 15, reason: `HQ "${hq}" matches target state "${abbrev}"` };
      }
    }
  }

  // Check non-abbreviation targets (regions, countries, etc.)
  for (const geo of geoTargets) {
    if (hqLower.includes(geo.toLowerCase())) {
      return { name: "Geography", score: 15, maxScore: 15, reason: `HQ "${hq}" matches target "${geo}"` };
    }
  }

  // Check country-level match (US state abbreviations)
  if (geoTargets.some((g) => g.toLowerCase().includes("united states") || g.toLowerCase() === "us")) {
    const usStates = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
    if (usStates.test(hq)) {
      return { name: "Geography", score: 12, maxScore: 15, reason: `HQ "${hq}" is in the US` };
    }
  }

  return { name: "Geography", score: 0, maxScore: 15, reason: `HQ "${hq}" not in target regions` };
}

function scoreVertical(
  leadIndustry: string,
  verticals?: string[]
): ScoreBreakdown["factors"][0] {
  if (!verticals || verticals.length === 0) {
    return { name: "Vertical", score: 5, maxScore: 10, reason: "No vertical filter set" };
  }

  const leadLower = leadIndustry.toLowerCase();
  for (const vertical of verticals) {
    if (leadLower.includes(vertical.toLowerCase())) {
      return { name: "Vertical", score: 10, maxScore: 10, reason: `"${leadIndustry}" matches vertical "${vertical}"` };
    }
  }

  return { name: "Vertical", score: 0, maxScore: 10, reason: `"${leadIndustry}" not in target verticals` };
}
