import { person } from "@/resources";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing by ${person.name}`,
};

const PenIcon = () => (
  <svg
    className="w-12 h-12 text-[#b8860b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

export default function Blog() {
  return (
    <main className="min-h-screen bg-[#f4efe4] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <header className="mb-20 text-center">
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
            Ideas on AI systems, infrastructure, and building things that matter. Coming soon —
            subscribe to know when it drops.
          </p>
        </header>

        {/* Empty State */}
        <div
          className="relative py-24 px-8 text-center rounded-lg border border-dashed"
          style={{
            borderColor: "rgba(184, 134, 11, 0.3)",
            background:
              "linear-gradient(135deg, rgba(250, 248, 240, 0.8), rgba(244, 239, 228, 0.5))",
          }}
        >
          {/* Decorative elements */}
          <div
            className="absolute top-4 left-4 text-6xl opacity-[0.04]"
            style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
          >
            ❧
          </div>
          <div
            className="absolute bottom-4 right-4 text-6xl opacity-[0.04]"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--r-gold)",
              transform: "scaleX(-1)",
            }}
          >
            ❧
          </div>

          <div className="relative">
            <PenIcon />

            <h2
              className="text-xl mt-6 mb-3"
              style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
            >
              The blank page problem
            </h2>

            <p
              className="text-base max-w-md mx-auto mb-8"
              style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
            >
              Every writer faces it. Every engineer who tries to blog faces it worse. I&apos;m
              working on something worth reading — not just another hot take on AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://twitter.com/messages/compose?recipient_id=konandev"
                target="_blank"
                rel="noopener noreferrer"
                className="r-button r-button-primary"
              >
                Follow on X for updates
              </a>
              <a
                href="https://cal.com/konandev"
                target="_blank"
                rel="noopener noreferrer"
                className="r-button"
                style={{
                  background: "transparent",
                  borderColor: "rgba(184, 134, 11, 0.4)",
                  color: "var(--r-sepia)",
                }}
              >
                Or just talk
              </a>
            </div>
          </div>
        </div>

        {/* Topics I'm thinking about */}
        <div className="mt-20">
          <h3
            className="text-sm tracking-[0.2em] uppercase mb-8 text-center"
            style={{ fontFamily: "var(--font-display)", color: "var(--r-gold)" }}
          >
            Topics brewing
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "RAG Pipelines",
                desc: "Beyond the basics of retrieval augmented generation",
              },
              {
                title: "System Design",
                desc: "What I learned scaling to 5M+ monthly transactions",
              },
              { title: "AI Agents", desc: "Building agents that actually ship to production" },
            ].map((topic) => (
              <div
                key={topic.title}
                className="p-5 rounded border transition-colors duration-200 hover:border-[rgba(184,134,11,0.5)]"
                style={{
                  background: "var(--r-cream)",
                  borderColor: "rgba(184, 134, 11, 0.2)",
                }}
              >
                <h4
                  className="font-medium mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
                >
                  {topic.title}
                </h4>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
                >
                  {topic.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
