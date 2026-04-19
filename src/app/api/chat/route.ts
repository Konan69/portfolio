import { mastra } from "@/mastra";
import { handleChatStream } from "@mastra/ai-sdk";
import { toAISdkV5Messages } from "@mastra/ai-sdk/ui";
import { createUIMessageStreamResponse } from "ai";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const THREAD_COOKIE = "portfolio-chat-thread";
const RESOURCE_COOKIE = "portfolio-chat-resource";

function createChatId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

async function getChatSession() {
  const cookieStore = await cookies();

  let threadId = cookieStore.get(THREAD_COOKIE)?.value;
  let resourceId = cookieStore.get(RESOURCE_COOKIE)?.value;

  if (!threadId) {
    threadId = createChatId("thread");
    cookieStore.set(THREAD_COOKIE, threadId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  if (!resourceId) {
    resourceId = createChatId("resource");
    cookieStore.set(RESOURCE_COOKIE, resourceId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
  }

  return { resourceId, threadId };
}

export const maxDuration = 60;

export async function POST(req: Request) {
  const params = await req.json();
  const { resourceId, threadId } = await getChatSession();

  const stream = await handleChatStream({
    mastra,
    agentId: "portfolio-agent",
    version: "v6",
    params: {
      ...params,
      memory: {
        ...params.memory,
        resource: resourceId,
        thread: threadId,
      },
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function GET() {
  const { resourceId, threadId } = await getChatSession();
  const memory = await mastra.getAgentById("portfolio-agent").getMemory();

  try {
    const response = await memory?.recall({
      resourceId,
      threadId,
    });

    return NextResponse.json(toAISdkV5Messages(response?.messages || []));
  } catch {
    return NextResponse.json([]);
  }
}
