import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { anthropic } from "@/lib/anthropic";
import { getIndustryConfig } from "@/config/industries";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ runId: string }> }
) {
  const user = await getSession();
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { runId } = await params;
  const { message } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: "Message is required" }), {
      status: 400,
    });
  }

  // Get the research run for context (verify ownership)
  const run = await prisma.researchRun.findFirst({ where: { id: runId, userId: user.id } });
  if (!run) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  }

  const payload = JSON.parse(run.payload);

  const config = getIndustryConfig(user.industry);

  // Load seller profile and ICP profile for context
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { sellerProfile: true, icpProfile: true } as any,
  });
  let sellerContext = "";
  if (userData?.sellerProfile) {
    try {
      const sp = JSON.parse(userData.sellerProfile as string);
      if (sp.company) {
        sellerContext = `\n\nThe salesperson you're helping works at ${sp.company} and sells ${(sp.products || []).join(", ")}. Their value prop is: ${sp.valueProps}. Help them with talk tracks, competitive positioning, and objection handling specific to their product.`;
      }
    } catch { /* ignore parse errors */ }
  }

  let icpContext = "";
  if ((userData as any)?.icpProfile) {
    try {
      const icpProfile = JSON.parse((userData as any).icpProfile as string);
      const parts: string[] = [];
      if (icpProfile.buyerTitles?.length) {
        parts.push(`The salesperson targets these buyer personas: ${icpProfile.buyerTitles.join(", ")}.`);
      }
      if (icpProfile.verticals?.length) {
        parts.push(`They focus on ${icpProfile.verticals.join(", ")} verticals. Help them position for these specific personas.`);
      }
      if (parts.length) {
        icpContext = `\n\n${parts.join(" ")}`;
      }
    } catch { /* ignore parse errors */ }
  }

  // Get or create chat thread
  let thread = await prisma.chatThread.findFirst({
    where: { researchRunId: runId },
  });

  const existingMessages: Array<{ role: string; content: string }> = thread
    ? JSON.parse(thread.messages)
    : [];

  // Add user message
  existingMessages.push({ role: "user", content: message });

  // Build Claude messages
  const systemPrompt = `You are a ${config.copilotRole}. You have deep knowledge about this company:

Company: ${payload.company}
Industry: ${payload.industry}
HQ: ${payload.hq}
Employees: ${payload.employees}
Tech Stack: ${(payload.techStack || []).join(", ")}
Revenue: ${payload.revenueBand}
Funding: ${payload.funding}
Fit Score: ${payload.fitScore}/100

Key Signals:
${(payload.signals || []).map((s: any) => `- [${s.severity}] ${s.title}: ${s.body}`).join("\n")}

Help the salesperson with:
- Outreach drafting and refinement
- Building sales narratives and talking points
- Answering questions about the company's profile and opportunities
- Comparing with peers
- Identifying selling angles

Be concise, actionable, and specific to this company.${sellerContext}${icpContext}`;

  const claudeMessages = existingMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Stream the response
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: systemPrompt,
    messages: claudeMessages,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = "";

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const text = event.delta.text;
          fullResponse += text;
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
          );
        }
      }

      // Save the full response to the thread
      existingMessages.push({ role: "assistant", content: fullResponse });

      if (thread) {
        await prisma.chatThread.update({
          where: { id: thread.id },
          data: { messages: JSON.stringify(existingMessages), updatedAt: new Date() },
        });
      } else {
        await prisma.chatThread.create({
          data: {
            researchRunId: runId,
            messages: JSON.stringify(existingMessages),
          },
        });
      }

      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
