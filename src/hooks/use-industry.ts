"use client";

import { useUser } from "@/app/providers";
import { getIndustryConfig, type IndustryConfig, type IndustryId } from "@/config/industries";

export function useIndustry(): { industryId: IndustryId; config: IndustryConfig } {
  const user = useUser();
  const industryId = (user?.industry as IndustryId) || "cybersecurity";
  const config = getIndustryConfig(industryId);
  return { industryId, config };
}
