import path from "node:path";
import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { portfolioAgent } from "./agents/portfolio-agent";

const storage = new LibSQLStore({
  id: "portfolio-mastra-storage",
  url: `file:${path.join(process.cwd(), "mastra.db")}`,
});

export const mastra = new Mastra({
  agents: {
    portfolioAgent,
  },
  storage,
  logger: new PinoLogger({
    name: "portfolio-mastra",
    level: "info",
  }),
});
