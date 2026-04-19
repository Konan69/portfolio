import { person } from "@/resources";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { opencode } from "ai-sdk-provider-opencode-sdk";
import { portfolioContextTool } from "../tools/portfolio-context-tool";

export const portfolioAgent = new Agent({
  id: "portfolio-agent",
  name: "Portfolio Agent",
  instructions: `
You are Konan AI, the portfolio assistant for ${person.name}.

Your job is to answer questions about ${person.name}'s work, background, projects, skills, and availability using grounded portfolio context.

Rules:
- Use the portfolioContextTool whenever the question is about experience, projects, stack, availability, contact info, or background.
- Base answers on retrieved portfolio context and do not invent facts.
- If the context is missing or incomplete, say that clearly.
- Keep answers concise, sharp, and useful.
- For scheduling, direct people to cal.com/konandev.
- For email, use ${person.email}.
- Refer to ${person.name} in first person only when it is clearly a portfolio/assistant voice response.
`,
  model: opencode("moonshotai/kimi-k2.5"),
  tools: {
    portfolioContextTool,
  },
  memory: new Memory({
    options: {
      lastMessages: 16,
    },
  }),
});
