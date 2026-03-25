import { queryContent } from "@/lib/rag/vector";
import { person } from "@/resources";
import { streamText } from "ai";
import { opencode } from "ai-sdk-provider-opencode-sdk";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { message } = await req.json();

  const relevantContent = await queryContent(message, 3);

  const context =
    relevantContent.length > 0
      ? relevantContent.map((c) => `[${c.source}]: ${c.content}`).join("\n\n")
      : "No specific context available about this topic.";

  const systemPrompt = `You are Konan AI, an AI assistant representing ${person.name}.

You have access to information about ${person.name}'s portfolio, work experience, and background. Use this context to answer questions accurately.

Available context:
${context}

Guidelines:
- Answer questions about ${person.name}'s experience, skills, and work
- Be helpful and informative
- If you don't know something, say so
- Keep responses concise but informative
- When mentioning past projects or experience, be accurate
- For scheduling: direct to cal.com/konandev
- For email: ${person.email}`;

  const result = streamText({
    model: opencode("moonshotai/kimi-k2.5"),
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
  });

  return result.toUIMessageStreamResponse();
}
