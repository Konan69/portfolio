import { MDXRemote } from "next-mdx-remote/rsc";
import React from "react";

function createHeading(level: number) {
  const sizes: Record<number, string> = {
    1: "text-3xl md:text-4xl mt-12 mb-6",
    2: "text-2xl md:text-3xl mt-10 mb-4",
    3: "text-xl md:text-2xl mt-8 mb-3",
    4: "text-lg md:text-xl mt-6 mb-2",
    5: "text-base md:text-lg mt-4 mb-2",
    6: "text-sm md:text-base mt-4 mb-2",
  };

  return function Heading({ children }: { children?: React.ReactNode }) {
    const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    return (
      <Tag
        className={`${sizes[level]} tracking-tight`}
        style={{ fontFamily: "var(--font-display)", color: "var(--r-umber)" }}
      >
        {children}
      </Tag>
    );
  };
}

function Paragraph({ children }: { children?: React.ReactNode }) {
  // Detect block-level children (e.g. <figure> from Image) to avoid invalid
  // <p><figure>…</figure></p> nesting which causes hydration mismatches.
  const hasBlockChild = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      (child.type === "figure" ||
        child.type === Image ||
        child.type === "div" ||
        child.type === "blockquote")
  );

  const Tag = hasBlockChild ? "div" : "p";

  return (
    <Tag
      className="text-base leading-[1.8] mb-6"
      style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
    >
      {children}
    </Tag>
  );
}

function Anchor({ href, children }: { href?: string; children?: React.ReactNode }) {
  const isExternal = href?.startsWith("http");
  return (
    <a
      href={href}
      className="underline underline-offset-4 decoration-[rgba(184,134,11,0.4)] hover:decoration-[rgba(184,134,11,0.8)] transition-colors"
      style={{ color: "var(--r-umber)" }}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function Blockquote({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote
      className="border-l-2 pl-6 my-6 italic"
      style={{
        borderColor: "rgba(184, 134, 11, 0.4)",
        fontFamily: "var(--font-body)",
        color: "var(--r-sepia)",
      }}
    >
      {children}
    </blockquote>
  );
}

function UnorderedList({ children }: { children?: React.ReactNode }) {
  return (
    <ul
      className="list-disc pl-6 mb-6 space-y-2"
      style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
    >
      {children}
    </ul>
  );
}

function OrderedList({ children }: { children?: React.ReactNode }) {
  return (
    <ol
      className="list-decimal pl-6 mb-6 space-y-2"
      style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
    >
      {children}
    </ol>
  );
}

function Code({ children }: { children?: React.ReactNode }) {
  return (
    <code
      className="text-sm px-1.5 py-0.5 rounded"
      style={{
        background: "rgba(184, 134, 11, 0.08)",
        color: "var(--r-umber)",
        fontFamily: "var(--font-code, 'JetBrains Mono', monospace)",
      }}
    >
      {children}
    </code>
  );
}

function Pre({ children }: { children?: React.ReactNode }) {
  return (
    <pre
      className="text-sm p-4 rounded-lg my-6 overflow-x-auto"
      style={{
        background: "rgba(62, 39, 35, 0.04)",
        border: "1px solid rgba(184, 134, 11, 0.15)",
        fontFamily: "var(--font-code, 'JetBrains Mono', monospace)",
      }}
    >
      {children}
    </pre>
  );
}

function Hr() {
  return (
    <hr
      className="my-10 border-none h-px"
      style={{ background: "rgba(184, 134, 11, 0.2)" }}
    />
  );
}

function Strong({ children }: { children?: React.ReactNode }) {
  return (
    <strong className="font-semibold" style={{ color: "var(--r-umber)" }}>
      {children}
    </strong>
  );
}

function Image({ src, alt }: { src?: string; alt?: string }) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt || ""}
        className="w-full rounded-lg border"
        style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}
      />
      {alt && (
        <figcaption
          className="text-xs mt-3 text-center"
          style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)", opacity: 0.6 }}
        >
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  p: Paragraph,
  a: Anchor,
  blockquote: Blockquote,
  ul: UnorderedList,
  ol: OrderedList,
  code: Code,
  pre: Pre,
  hr: Hr,
  strong: Strong,
  img: Image,
};

export function CustomMDX({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
    />
  );
}
