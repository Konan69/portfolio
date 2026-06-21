import { createFileRoute } from "@tanstack/react-router";
import { baseURL } from "@/resources";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = `User-agent: *\nAllow: /\nSitemap: ${baseURL}/sitemap.xml\n`;
        return new Response(body, {
          headers: { "Content-Type": "text/plain" },
        });
      },
    },
  },
});
