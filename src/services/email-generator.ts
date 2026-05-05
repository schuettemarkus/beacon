import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";
import type { CompanyResearchPayload } from "./company-research";

export interface GeneratedEmail {
  variant: string;
  subject: string;
  preview: string;
  body: string;
  predictedOpenRate: number;
  predictedReplyRate: number;
}

export async function generateEmailVariants(
  research: CompanyResearchPayload,
  contactName?: string,
  contactTitle?: string,
  industry: string = "cybersecurity"
): Promise<GeneratedEmail[]> {
  const config = getIndustryConfig(industry);

  const variants = await Promise.all(
    config.emailVariants.map(async (variantConfig) => {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        system: [
          {
            type: "text",
            text: `${config.emailWriterRole} Return ONLY valid JSON with fields: "subject" (string), "preview" (string, 40 chars max), "body" (string, the email body).`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `${variantConfig.prompt}\n\nCompany: ${research.company}\nIndustry: ${research.industry}\nEmployees: ${research.employees}\nTech Stack: ${research.techStack.join(", ")}\nKey Signals: ${research.signals.map((s) => s.title).join("; ")}\n${contactName ? `Recipient: ${contactName}, ${contactTitle}` : `Recipient: ${config.typicalBuyerTitles[0]}`}`,
          },
        ],
      });

      const text =
        response.content[0].type === "text" ? response.content[0].text : "";

      try {
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return {
          variant: variantConfig.id,
          subject: parsed.subject || `Regarding ${research.company}`,
          preview: (parsed.preview || parsed.subject || "").slice(0, 40),
          body: parsed.body || text,
          predictedOpenRate: variantConfig.predictedOpenRate,
          predictedReplyRate: variantConfig.predictedReplyRate,
        } as GeneratedEmail;
      } catch {
        return {
          variant: variantConfig.id,
          subject: `Regarding ${research.company}`,
          preview: `Quick note about ${research.company}`,
          body: text || "Failed to generate email content.",
          predictedOpenRate: variantConfig.predictedOpenRate * 0.85,
          predictedReplyRate: variantConfig.predictedReplyRate * 0.75,
        } as GeneratedEmail;
      }
    })
  );

  return variants;
}
