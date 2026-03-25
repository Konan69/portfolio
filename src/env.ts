import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    UPSTASH_VECTOR_REST_URL: z.string().url(),
    UPSTASH_VECTOR_REST_TOKEN: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL,
    UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
});
