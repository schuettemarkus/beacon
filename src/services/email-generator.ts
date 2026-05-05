import { anthropic } from "@/lib/anthropic";
import type { CompanyResearchPayload } from "./company-research";

export interface GeneratedEmail {
  variant: "cold_intro" | "threat_anchored" | "executive_brief";
  subject: string;
  preview: string;
  body: string;
  predictedOpenRate: number;
  predictedReplyRate: number;
}

const VARIANT_PROMPTS = {
  cold_intro: `Write a brief, conversational cold email (80-120 words) from a cybersecurity vendor to this company. Focus on:
- Their growth signals and how security tools accelerate scaling
- A specific, non-threatening observation about their tech stack
- End with a soft CTA (15-min call, not a demo)
Tone: friendly, peer-to-peer, not salesy. Subject line should be curiosity-driven.`,

  threat_anchored: `Write a cold email (80-120 words) that references a SPECIFIC CVE, breach, or threat relevant to this company's tech stack or industry. Be:
- Factual, not fear-mongering
- Reference the specific vulnerability or incident by name
- Show how it applies to THEIR environment specifically
- End with an offer to share a brief analysis
Tone: expert consultant, not ambulance chaser. Subject line should reference the specific threat.`,

  executive_brief: `Write a concise executive-level email (80-120 words) suitable for a C-suite recipient (CEO, CFO, board). Focus on:
- Business impact, not technical details
- Regulatory/compliance risk (financial penalties, board liability)
- Peer comparison ("companies like yours are...")
- A clear, time-bound ask
Tone: authoritative, strategic, respectful of their time. Subject line should be boardroom-appropriate.`,
};

export async function generateEmailVariants(
  research: CompanyResearchPayload,
  contactName?: string,
  contactTitle?: string
): Promise<GeneratedEmail[]> {
  const variants = await Promise.all(
    (Object.entries(VARIANT_PROMPTS) as [keyof typeof VARIANT_PROMPTS, string][]).map(
      async ([variant, prompt]) => {
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: [
            {
              type: "text",
              text: `You are an elite cybersecurity sales copywriter. Return ONLY valid JSON with fields: "subject" (string), "preview" (string, 40 chars max), "body" (string, the email body).`,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nCompany: ${research.company}\nIndustry: ${research.industry}\nEmployees: ${research.employees}\nTech Stack: ${research.techStack.join(", ")}\nKey Signals: ${research.signals.map((s) => s.title).join("; ")}\n${contactName ? `Recipient: ${contactName}, ${contactTitle}` : "Recipient: Security decision-maker"}`,
            },
          ],
        });

        const text =
          response.content[0].type === "text" ? response.content[0].text : "";

        try {
          const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          return {
            variant,
            subject: parsed.subject || `Regarding ${research.company}`,
            preview: (parsed.preview || parsed.subject || "").slice(0, 40),
            body: parsed.body || text,
            predictedOpenRate: variant === "threat_anchored" ? 0.42 : variant === "executive_brief" ? 0.38 : 0.35,
            predictedReplyRate: variant === "threat_anchored" ? 0.12 : variant === "executive_brief" ? 0.09 : 0.08,
          } as GeneratedEmail;
        } catch {
          return {
            variant,
            subject: `Regarding ${research.company}'s security posture`,
            preview: `Quick note about ${research.company}`,
            body: text || "Failed to generate email content.",
            predictedOpenRate: 0.3,
            predictedReplyRate: 0.06,
          } as GeneratedEmail;
        }
      }
    )
  );

  return variants;
}
