import { notFound } from "next/navigation";
import { getPosts } from "@/utils/utils";
import { person } from "@/resources";
import Post from "@/components/blog/Post";
import { ShareSection } from "@/components/blog/ShareSection";
import { TracingBeam } from "@/components/ui/tracing-beam";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const allPosts = getPosts(["src", "app", "blog", "posts"]);
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.summary,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.summary,
      type: "article",
      publishedTime: post.metadata.publishedAt,
      ...(post.metadata.image && { images: [{ url: post.metadata.image }] }),
    },
  };
}

export function generateStaticParams() {
  const allPosts = getPosts(["src", "app", "blog", "posts"]);
  return allPosts
    .filter((post) => post.metadata.tag !== "Magic Portfolio")
    .map((post) => ({ slug: post.slug }));
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const allPosts = getPosts(["src", "app", "blog", "posts"]);
  const post = allPosts.find((p) => p.slug === slug);

  if (!post || post.metadata.tag === "Magic Portfolio") {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
      <TracingBeam className="px-6">
        <div className="max-w-4xl mx-auto px-6">
          <Post metadata={post.metadata} content={post.content} />
          <div className="max-w-2xl mx-auto">
            <ShareSection />
          </div>
        </div>
      </TracingBeam>
    </main>
  );
}
