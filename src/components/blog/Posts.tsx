import Link from "next/link";
import { getPosts } from "@/utils/utils";
import { formatDate } from "@/utils/formatDate";

export function Posts() {
  const allPosts = getPosts(["src", "app", "blog", "posts"]);

  // Filter out Magic Portfolio template posts, sort by date descending
  const posts = allPosts
    .filter((post) => post.metadata.tag !== "Magic Portfolio")
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime()
    );

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="block group p-6 rounded-lg border transition-colors duration-200 hover:border-[rgba(184,134,11,0.5)]"
          style={{
            background: "var(--r-cream)",
            borderColor: "rgba(184, 134, 11, 0.2)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
            <h2
              className="text-lg group-hover:text-[#b8860b] transition-colors"
              style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
            >
              {post.metadata.title}
            </h2>
            <time
              className="text-xs shrink-0"
              style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)", opacity: 0.6 }}
              dateTime={post.metadata.publishedAt}
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
          </div>
          {post.metadata.summary && (
            <p
              className="text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
            >
              {post.metadata.summary}
            </p>
          )}
          {post.metadata.tag && (
            <span
              className="inline-block mt-3 text-[10px] tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
            >
              {post.metadata.tag}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
