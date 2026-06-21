import { createFileRoute } from "@tanstack/react-router";
import { baseURL, routes as routesConfig } from "@/resources";
import { getBlogPosts, getWorkProjects } from "@/utils/utils";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const blogs = getBlogPosts().map((post) => ({
          url: `${baseURL}/blog/${post.slug}`,
          lastModified: post.metadata.publishedAt,
        }));

        const works = getWorkProjects().map((post) => ({
          url: `${baseURL}/work/${post.slug}`,
          lastModified: post.metadata.publishedAt,
        }));

        const activeRoutes = Object.keys(routesConfig).filter(
          (route) => routesConfig[route as keyof typeof routesConfig],
        );

        const routes = activeRoutes.map((route) => ({
          url: `${baseURL}${route !== "/" ? route : ""}`,
          lastModified: new Date().toISOString().split("T")[0],
        }));

        const urls = [...routes, ...blogs, ...works]
          .map(
            (entry) => `  <url><loc>${entry.url}</loc><lastmod>${entry.lastModified}</lastmod></url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: { "Content-Type": "application/xml" },
        });
      },
    },
  },
});
