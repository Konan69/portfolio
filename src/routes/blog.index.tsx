import { createFileRoute } from "@tanstack/react-router";
import Blog from "@/pages/Blog";
import { person } from "@/resources";
import { getPublishedBlogPosts } from "@/utils/utils";

export const Route = createFileRoute("/blog/")({
  loader: () => getPublishedBlogPosts(),
  head: () => ({
    meta: [
      { title: "Blog" },
      { name: "description", content: `Writing by ${person.name}` },
    ],
  }),
  component: BlogRoute,
});

function BlogRoute() {
  const posts = Route.useLoaderData();
  return <Blog posts={posts} />;
}
