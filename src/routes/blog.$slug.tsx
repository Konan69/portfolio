import { createFileRoute } from "@tanstack/react-router";
import BlogPost from "@/pages/BlogPost";
import { getBlogPost } from "@/utils/utils";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => getBlogPost(params.slug),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.metadata.title ?? "Post not found" },
      { name: "description", content: loaderData?.metadata.summary ?? "" },
      { property: "og:title", content: loaderData?.metadata.title ?? "Post not found" },
      { property: "og:description", content: loaderData?.metadata.summary ?? "" },
      { property: "og:type", content: "article" },
      ...(loaderData?.metadata.image
        ? [{ property: "og:image", content: loaderData.metadata.image }]
        : []),
    ],
  }),
  component: BlogPostRoute,
});

function BlogPostRoute() {
  const post = Route.useLoaderData();
  return <BlogPost post={post} />;
}
