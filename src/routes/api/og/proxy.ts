import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/og/proxy")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const imageUrl = url.searchParams.get("url");

          if (!imageUrl) {
            return Response.json({ error: "Missing URL parameter" }, { status: 400 });
          }

          const response = await fetch(imageUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; ImageProxy/1.0)",
            },
          });

          if (!response.ok) {
            return Response.json(
              { error: `Failed to fetch image: ${response.status}` },
              { status: response.status },
            );
          }

          const contentType = response.headers.get("content-type") || "image/jpeg";
          const imageData = await response.arrayBuffer();

          return new Response(imageData, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400",
            },
          });
        } catch (error) {
          console.error("Error proxying image:", error);
          return Response.json({ error: "Failed to proxy image" }, { status: 500 });
        }
      },
    },
  },
});
