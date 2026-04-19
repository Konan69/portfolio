import { CustomMDX } from "@/components/mdx";
import { formatDate } from "@/utils/formatDate";

interface PostProps {
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    tag?: string;
    image?: string;
  };
  content: string;
}

export default function Post({ metadata, content }: PostProps) {
  return (
    <article className="max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        {metadata.tag && (
          <span
            className="text-xs tracking-[0.3em] uppercase font-medium block mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
          >
            {metadata.tag}
          </span>
        )}
        <h1
          className="text-3xl md:text-4xl lg:text-5xl mb-4 tracking-tight leading-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
        >
          {metadata.title}
        </h1>
        <time
          className="text-sm"
          style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)", opacity: 0.7 }}
          dateTime={metadata.publishedAt}
        >
          {formatDate(metadata.publishedAt, false)}
        </time>
      </header>

      {/* Content */}
      <div className="prose-renaissance">
        <CustomMDX source={content} />
      </div>
    </article>
  );
}
