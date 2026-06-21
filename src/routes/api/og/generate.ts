import { createFileRoute } from "@tanstack/react-router";
import { person } from "@/resources";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/api/og/generate")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const title = escapeXml(url.searchParams.get("title") || "Portfolio");
        const name = escapeXml(person.name);
        const role = escapeXml(person.role);

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#15120f"/>
      <stop offset="1" stop-color="#3d2914"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="64" y="64" width="1152" height="592" rx="28" fill="none" stroke="#b8860b" stroke-opacity="0.45" stroke-width="2"/>
  <text x="112" y="310" fill="#f4efe4" font-family="Georgia, serif" font-size="78" font-weight="700">${title}</text>
  <text x="112" y="500" fill="#daa520" font-family="Georgia, serif" font-size="52">${name}</text>
  <text x="112" y="560" fill="#d4c9a8" font-family="monospace" font-size="28">${role}</text>
</svg>`;

        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
