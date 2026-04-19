import { person } from "@/resources";
import { Posts } from "@/components/blog/Posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing by ${person.name}`,
};

export default function Blog() {
  return (
    <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="mb-16 text-center">
            <span
              className="text-xs tracking-[0.3em] uppercase font-medium block mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
            >
              Writing
            </span>
            <h1
              className="text-4xl md:text-5xl mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
            >
              Thoughts in progress.
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
            >
              Ideas on AI systems, infrastructure, and building things that matter.
            </p>
          </header>

          {/* Posts */}
          <Posts />
        </div>
    </main>
  );
}
