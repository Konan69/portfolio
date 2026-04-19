import { queryContent } from "@/lib/rag/vector";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const portfolioContextTool = createTool({
  id: "portfolio-context",
  description:
    "Retrieve grounded portfolio snippets about Suleman Mualim's experience, skills, projects, availability, and contact details.",
  inputSchema: z.object({
    question: z.string().min(1).describe("The user's question about Suleman or his work"),
    limit: z.number().int().min(1).max(5).default(3),
  }),
  outputSchema: z.object({
    matches: z.array(
      z.object({
        source: z.string(),
        content: z.string(),
      }),
    ),
  }),
  execute: async ({ question, limit }) => {
    const matches = await queryContent(question, limit);

    return {
      matches: matches.map(({ source, content }) => ({
        source,
        content,
      })),
    };
  },
});
