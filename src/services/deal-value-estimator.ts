export interface DealValueEstimate {
  estimatedACV: string;
  confidence: "low" | "medium" | "high";
  factors: string[];
}

interface EstimatorInput {
  employees?: number;
  industry?: string;
  techStack?: string[];
  funding?: string;
  fitScore?: number;
}

function getEmployeeTier(employees: number): { min: number; max: number; label: string } {
  if (employees < 100) return { min: 15_000, max: 30_000, label: "<100 employees" };
  if (employees <= 500) return { min: 30_000, max: 75_000, label: "100-500 employees" };
  if (employees <= 2000) return { min: 75_000, max: 200_000, label: "500-2000 employees" };
  if (employees <= 10000) return { min: 200_000, max: 500_000, label: "2000-10000 employees" };
  return { min: 500_000, max: 1_000_000, label: "10000+ employees" };
}

function getIndustryMultiplier(industry: string): { multiplier: number; label: string | null } {
  const lower = industry.toLowerCase();
  if (lower.includes("cybersecurity") || lower.includes("security"))
    return { multiplier: 1.3, label: "Cybersecurity premium" };
  if (lower.includes("fintech") || lower.includes("financial"))
    return { multiplier: 1.2, label: "Fintech premium" };
  if (lower.includes("healthtech") || lower.includes("health"))
    return { multiplier: 1.1, label: "Healthtech premium" };
  return { multiplier: 1.0, label: null };
}

function getTechComplexityMultiplier(techStack: string[]): { multiplier: number; label: string | null } {
  if (techStack.length >= 5) return { multiplier: 1.2, label: "Complex tech stack (5+ items)" };
  return { multiplier: 1.0, label: null };
}

function getFundingMultiplier(funding: string): { multiplier: number; label: string | null } {
  const lower = funding.toLowerCase();
  if (lower.includes("series c") || lower.includes("series d") || lower.includes("series e") || lower.includes("ipo") || lower.includes("public"))
    return { multiplier: 1.3, label: `${funding} funding` };
  if (lower.includes("series b"))
    return { multiplier: 1.1, label: "Series B funding" };
  return { multiplier: 1.0, label: null };
}

function getFitScoreMultiplier(fitScore: number): { multiplier: number; label: string | null } {
  if (fitScore >= 90) return { multiplier: 1.2, label: "Excellent fit score (90+)" };
  if (fitScore >= 80) return { multiplier: 1.1, label: "Strong fit score (80+)" };
  return { multiplier: 1.0, label: null };
}

function formatValue(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(amount / 1000)}K`;
}

export function estimateDealValue(input: EstimatorInput): DealValueEstimate {
  const factors: string[] = [];
  let confidencePoints = 0;

  const employees = input.employees || 50;
  const tier = getEmployeeTier(employees);
  factors.push(tier.label);
  if (input.employees) confidencePoints++;

  let minACV = tier.min;
  let maxACV = tier.max;

  const industry = getIndustryMultiplier(input.industry || "");
  if (industry.label) {
    factors.push(industry.label);
    confidencePoints++;
  }
  if (input.industry) confidencePoints++;
  minACV *= industry.multiplier;
  maxACV *= industry.multiplier;

  const tech = getTechComplexityMultiplier(input.techStack || []);
  if (tech.label) {
    factors.push(tech.label);
    confidencePoints++;
  }
  minACV *= tech.multiplier;
  maxACV *= tech.multiplier;

  const funding = getFundingMultiplier(input.funding || "");
  if (funding.label) {
    factors.push(funding.label);
    confidencePoints++;
  }
  if (input.funding) confidencePoints++;
  minACV *= funding.multiplier;
  maxACV *= funding.multiplier;

  const fit = getFitScoreMultiplier(input.fitScore || 0);
  if (fit.label) {
    factors.push(fit.label);
  }
  if (input.fitScore) confidencePoints++;
  minACV *= fit.multiplier;
  maxACV *= fit.multiplier;

  let confidence: "low" | "medium" | "high";
  if (confidencePoints >= 4) confidence = "high";
  else if (confidencePoints >= 2) confidence = "medium";
  else confidence = "low";

  const estimatedACV = `${formatValue(minACV)}-${formatValue(maxACV)}`;

  return { estimatedACV, confidence, factors };
}
