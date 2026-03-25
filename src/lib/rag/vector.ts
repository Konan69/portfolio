import { env } from "@/env";
import { Index, QueryResult } from "@upstash/vector";
import OpenAI from "openai";

export interface ContentChunk {
  id: string;
  content: string;
  source: string;
  type: "portfolio" | "blog" | "about";
}

export interface StoredMetadata {
  content: string;
  source: string;
  type: string;
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

let index: Index;

function getIndex(): Index {
  if (!index) {
    index = new Index({
      url: env.UPSTASH_VECTOR_REST_URL,
      token: env.UPSTASH_VECTOR_REST_TOKEN,
    });
  }
  return index;
}

export async function upsertContent(chunks: ContentChunk[]): Promise<void> {
  const idx = getIndex();

  const vectors = await Promise.all(
    chunks.map(async (chunk) => ({
      id: chunk.id,
      vector: await generateEmbedding(chunk.content),
      metadata: {
        content: chunk.content,
        source: chunk.source,
        type: chunk.type,
      },
    })),
  );

  await idx.upsert(vectors);
}

export async function queryContent(query: string, topK = 5): Promise<ContentChunk[]> {
  const idx = getIndex();
  const queryVector = await generateEmbedding(query);

  const results = await idx.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return results
    .filter((r) => r.metadata && r.score && r.score > 0.3)
    .map((r) => {
      const meta = r.metadata as unknown as StoredMetadata | undefined;
      return {
        id: r.id as string,
        content: meta?.content ?? "",
        source: meta?.source ?? "",
        type: (meta?.type ?? "portfolio") as "portfolio" | "blog" | "about",
      };
    });
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8192),
  });

  return response.data[0].embedding;
}
