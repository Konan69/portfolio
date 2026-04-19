import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, relative, resolve } from "path";

import type { Sentence, Snippet, VideoMeta } from "./types.ts";

export function ensureDir(path: string) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function findGitRoot(start: string): string | null {
  let dir = resolve(start);
  while (true) {
    if (existsSync(join(dir, ".git"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function ensureGitignored(baseDir: string) {
  const gitRoot = findGitRoot(baseDir);
  if (!gitRoot) return;
  const relPath = relative(gitRoot, baseDir).replaceAll("\\", "/");
  if (!relPath || relPath.startsWith("..")) return;
  const entry = `/${relPath}`;
  const gi = join(gitRoot, ".gitignore");
  const existing = existsSync(gi) ? readFileSync(gi, "utf-8") : "";
  const lines = existing.split(/\r?\n/).map((l) => l.trim());
  if (lines.includes(entry) || lines.includes(relPath)) return;
  const prefix = existing.length === 0 || existing.endsWith("\n") ? "" : "\n";
  appendFileSync(gi, `${prefix}\n# youtube-research cache/output\n${entry}\n`);
}

let gitignoredFor: string | null = null;
export function resolveBaseDir(outputDir: string): string {
  const base = resolve(outputDir || "youtube-transcript");
  if (gitignoredFor !== base) {
    ensureGitignored(base);
    gitignoredFor = base;
  }
  return base;
}

function loadIndex(baseDir: string): Record<string, string> {
  try {
    return JSON.parse(readFileSync(join(baseDir, ".index.json"), "utf-8"));
  } catch {
    return {};
  }
}

function saveIndex(baseDir: string, index: Record<string, string>) {
  const path = join(baseDir, ".index.json");
  ensureDir(path);
  writeFileSync(path, JSON.stringify(index, null, 2));
}

export function lookupVideoDir(videoId: string, baseDir: string): string | null {
  const rel = loadIndex(baseDir)[videoId];
  if (rel) {
    const dir = resolve(baseDir, rel);
    if (existsSync(dir)) return dir;
  }
  return null;
}

export function registerVideoDir(videoId: string, channelSlug: string, titleSlug: string, baseDir: string): string {
  const rel = join(channelSlug, titleSlug);
  const index = loadIndex(baseDir);
  index[videoId] = rel;
  saveIndex(baseDir, index);
  return resolve(baseDir, rel);
}

export function hasCachedData(videoDir: string): boolean {
  return existsSync(join(videoDir, "meta.json")) && existsSync(join(videoDir, "transcript-raw.json"));
}

export function loadMeta(videoDir: string): VideoMeta {
  return JSON.parse(readFileSync(join(videoDir, "meta.json"), "utf-8"));
}

export function loadSnippets(videoDir: string): Snippet[] {
  return JSON.parse(readFileSync(join(videoDir, "transcript-raw.json"), "utf-8"));
}

export function loadSentences(videoDir: string): Sentence[] {
  return JSON.parse(readFileSync(join(videoDir, "transcript-sentences.json"), "utf-8"));
}
