type FrontmatterValue = string | string[];

type Team = {
  name: string;
  role: string;
  avatar: string;
  linkedIn: string;
};

export type PostMetadata = {
  title: string;
  subtitle?: string;
  publishedAt: string;
  summary: string;
  image?: string;
  images: string[];
  tag?: string;
  team: Team[];
  link?: string;
};

export type ContentPost = {
  metadata: PostMetadata;
  slug: string;
  content: string;
};

const blogFiles = import.meta.glob("../content/blog/posts/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const workFiles = import.meta.glob("../content/work/projects/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function cleanFrontmatterValue(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

function parseFrontmatter(rawContent: string) {
  if (!rawContent.startsWith("---")) {
    return { data: {}, content: rawContent };
  }

  const endIndex = rawContent.indexOf("\n---", 3);
  if (endIndex === -1) {
    return { data: {}, content: rawContent };
  }

  const frontmatter = rawContent.slice(3, endIndex).trim();
  const content = rawContent.slice(endIndex + 4).replace(/^\s+/, "");
  const data: Record<string, FrontmatterValue> = {};
  let activeArrayKey: string | null = null;

  frontmatter.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const arrayItem = line.match(/^\s+-\s+(.+)$/);

    if (arrayItem && activeArrayKey) {
      const existing = data[activeArrayKey];
      if (Array.isArray(existing)) {
        existing.push(cleanFrontmatterValue(arrayItem[1]));
      }
      return;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) return;

    const [, key, rawValue] = pair;
    if (!rawValue) {
      data[key] = [];
      activeArrayKey = key;
      return;
    }

    data[key] = cleanFrontmatterValue(rawValue);
    activeArrayKey = null;
  });

  return { data, content };
}

function readMDXContent(filePath: string, rawContent: string): ContentPost {
  const { data, content } = parseFrontmatter(rawContent);
  const filename = filePath.split("/").pop() ?? "";
  const slug = filename.replace(/\.mdx$/, "");
  const images = data.images;

  const metadata: PostMetadata = {
    title: typeof data.title === "string" ? data.title : "",
    subtitle: typeof data.subtitle === "string" ? data.subtitle : "",
    publishedAt: typeof data.publishedAt === "string" ? data.publishedAt : "",
    summary: typeof data.summary === "string" ? data.summary : "",
    image: typeof data.image === "string" ? data.image : "",
    images: Array.isArray(images) ? images : [],
    tag: typeof data.tag === "string" ? data.tag : undefined,
    team: [],
    link: typeof data.link === "string" ? data.link : "",
  };

  return { metadata, slug, content };
}

function getMDXData(files: Record<string, string>) {
  return Object.entries(files).map(([filePath, rawContent]) => readMDXContent(filePath, rawContent));
}

export function getBlogPosts() {
  return getMDXData(blogFiles);
}

export function getPublishedBlogPosts() {
  return getBlogPosts().filter((post) => post.metadata.tag !== "Magic Portfolio");
}

export function getWorkProjects() {
  return getMDXData(workFiles);
}

export function getBlogPost(slug: string) {
  return getPublishedBlogPosts().find((post) => post.slug === slug);
}

export function getPosts(customPath = ["", "", "", ""]) {
  const normalized = customPath.join("/");

  if (normalized.includes("blog/posts")) {
    return getBlogPosts();
  }

  if (normalized.includes("work/projects")) {
    return getWorkProjects();
  }

  return [];
}
