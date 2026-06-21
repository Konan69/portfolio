import { createFileRoute } from "@tanstack/react-router";
import type { ChatStreamHandlerParams } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse } from "ai";
import * as cookie from "cookie";

const THREAD_COOKIE = "portfolio-chat-thread";
const RESOURCE_COOKIE = "portfolio-chat-resource";

type ChatParams = ChatStreamHandlerParams;
type UiStreamResponseStream = Parameters<typeof createUIMessageStreamResponse>[0]["stream"];

type ChatSession = {
  resourceId: string;
  threadId: string;
  setCookieHeaders: string[];
};

function createChatId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function getChatSession(request: Request): ChatSession {
  const cookies = cookie.parse(request.headers.get("cookie") || "");
  const setCookieHeaders: string[] = [];

  let threadId = cookies[THREAD_COOKIE];
  let resourceId = cookies[RESOURCE_COOKIE];

  if (!threadId) {
    threadId = createChatId("thread");
    setCookieHeaders.push(
      cookie.serialize(THREAD_COOKIE, threadId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      }),
    );
  }

  if (!resourceId) {
    resourceId = createChatId("resource");
    setCookieHeaders.push(
      cookie.serialize(RESOURCE_COOKIE, resourceId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
      }),
    );
  }

  return { resourceId, threadId, setCookieHeaders };
}

function withSessionCookies(response: Response, setCookieHeaders: string[]) {
  setCookieHeaders.forEach((header) => response.headers.append("Set-Cookie", header));
  return response;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const params = await request.json() as ChatParams;
        const { resourceId, threadId, setCookieHeaders } = getChatSession(request);

        const [{ mastra }, { handleChatStream }] = await Promise.all([
          import("@/mastra"),
          import("@mastra/ai-sdk"),
        ]);
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

        return withSessionCookies(
          createUIMessageStreamResponse({ stream: stream as unknown as UiStreamResponseStream }),
          setCookieHeaders,
        );
      },
      GET: async ({ request }) => {
        const { resourceId, threadId, setCookieHeaders } = getChatSession(request);
        const [{ mastra }, { toAISdkV5Messages }] = await Promise.all([
          import("@/mastra"),
          import("@mastra/ai-sdk/ui"),
        ]);
        const memory = await mastra.getAgentById("portfolio-agent").getMemory();

        try {
          const response = await memory?.recall({
            resourceId,
            threadId,
          });

          return withSessionCookies(
            Response.json(toAISdkV5Messages(response?.messages || [])),
            setCookieHeaders,
          );
        } catch {
          return withSessionCookies(Response.json([]), setCookieHeaders);
        }
      },
    },
  },
});
