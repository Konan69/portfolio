import Post from "@/components/blog/Post";
import { ShareSection } from "@/components/blog/ShareSection";
import { TracingBeam } from "@/components/ui/tracing-beam";
import type { ContentPost } from "@/utils/utils";

export default function BlogPost({ post }: { post: ContentPost | undefined }) {
  if (!post) {
    return (
      <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}>
            Post not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
      <TracingBeam className="px-6">
        <div className="pl-10 pr-6 md:px-6">
          <Post metadata={post.metadata} content={post.content} />
          <div className="max-w-2xl mx-auto">
            <ShareSection />
          </div>
        </div>
      </TracingBeam>
    </main>
  );
}
