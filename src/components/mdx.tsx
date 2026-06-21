import React from "react";

function createHeading(level: 1 | 2 | 3 | 4 | 5 | 6, text: string, key: string) {
  const sizes: Record<number, string> = {
    1: "text-3xl md:text-4xl mt-12 mb-6",
    2: "text-2xl md:text-3xl mt-10 mb-4",
    3: "text-xl md:text-2xl mt-8 mb-3",
    4: "text-lg md:text-xl mt-6 mb-2",
    5: "text-base md:text-lg mt-4 mb-2",
    6: "text-sm md:text-base mt-4 mb-2",
  };
  const className = `${sizes[level]} tracking-tight`;
  const style = { fontFamily: "var(--font-display)", color: "var(--r-umber)" };
  const children = renderInline(text);

  switch (level) {
    case 1:
      return <h1 key={key} className={className} style={style}>{children}</h1>;
    case 2:
      return <h2 key={key} className={className} style={style}>{children}</h2>;
    case 3:
      return <h3 key={key} className={className} style={style}>{children}</h3>;
    case 4:
      return <h4 key={key} className={className} style={style}>{children}</h4>;
    case 5:
      return <h5 key={key} className={className} style={style}>{children}</h5>;
    case 6:
      return <h6 key={key} className={className} style={style}>{children}</h6>;
  }
}

function renderInline(text: string): React.ReactNode[] {
  const pattern = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      nodes.push(
        <strong key={`strong-${match.index}`} className="font-semibold" style={{ color: "var(--r-umber)" }}>
          {match[2]}
        </strong>,
      );
    } else if (match[4] && match[5]) {
      const isExternal = match[5].startsWith("http");
      nodes.push(
        <a
          key={`link-${match.index}`}
          href={match[5]}
          className="underline underline-offset-4 decoration-[rgba(184,134,11,0.4)] hover:decoration-[rgba(184,134,11,0.8)] transition-colors"
          style={{ color: "var(--r-umber)" }}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {match[4]}
        </a>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-base leading-[1.8] mb-6"
      style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
    >
      {children}
    </p>
  );
}

function renderMarkdown(source: string) {
  const lines = source.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    if (text) {
      const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let foundImage = false;

      while ((match = imagePattern.exec(text)) !== null) {
        foundImage = true;
        const before = text.slice(lastIndex, match.index).trim();
        if (before) {
          blocks.push(<Paragraph key={`p-${blocks.length}`}>{renderInline(before)}</Paragraph>);
        }

        blocks.push(
          <figure key={`figure-${blocks.length}`} className="my-8">
            <img
              src={match[2]}
              alt={match[1] || ""}
              className="w-full rounded-lg border"
              style={{ borderColor: "rgba(184, 134, 11, 0.15)" }}
            />
            {match[1] ? (
              <figcaption
                className="text-xs mt-3 text-center"
                style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)", opacity: 0.6 }}
              >
                {match[1]}
              </figcaption>
            ) : null}
          </figure>,
        );

        lastIndex = imagePattern.lastIndex;
      }

      const after = text.slice(lastIndex).trim();
      if (after) {
        blocks.push(<Paragraph key={`p-${blocks.length}`}>{renderInline(after)}</Paragraph>);
      } else if (!foundImage) {
        blocks.push(<Paragraph key={`p-${blocks.length}`}>{renderInline(text)}</Paragraph>);
      }
    }
    paragraph = [];
  };

  const flushList = () => {
    if (listItems.length === 0) return;
    blocks.push(
      <ul
        key={`ul-${blocks.length}`}
        className="list-disc pl-6 mb-6 space-y-2"
        style={{ fontFamily: "var(--font-body)", color: "var(--r-sepia)" }}
      >
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push(createHeading(heading[1].length as 1 | 2 | 3 | 4 | 5 | 6, heading[2], `h-${index}`));
      return;
    }

    if (line === "---") {
      flushParagraph();
      flushList();
      blocks.push(
        <hr
          key={`hr-${index}`}
          className="my-10 border-none h-px"
          style={{ background: "rgba(184, 134, 11, 0.2)" }}
        />,
      );
      return;
    }

    const listItem = line.match(/^-\s+(.+)$/);
    if (listItem) {
      flushParagraph();
      listItems.push(listItem[1]);
      return;
    }

    paragraph.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
}

export function CustomMDX({ source }: { source: string }) {
  return <>{renderMarkdown(source)}</>;
}
