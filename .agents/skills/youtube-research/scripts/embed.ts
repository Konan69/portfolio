#!/usr/bin/env bun
// Embed cached YouTube transcripts into a local sqlite-vec DB.
//
// Prereq: run scripts/main.ts on the video(s) first so the transcript is cached,
// then `bun install` inside the skill directory, and set GEMINI_API_KEY.

import { extractVideoId } from "./shared.ts";
import {
  hasCachedData,
  loadMeta,
  loadSentences,
  lookupVideoDir,
  resolveBaseDir,
} from "./storage.ts";
import {
  embedTexts,
  ensureSchema,
  f32ToBlob,
  hmsToSec,
  loadSqliteVec,
  openDb,
} from "./vecdb.ts";
import type { Sentence } from "./types.ts";

const DEFAULT_DB = "./embeddings.db";

interface EmbedOptions {
  videoIds: string[];
  db: string;
  chunkSize: number;
  overlap: number;
  refresh: boolean;
  outputDir: string;
}

function parseArgs(argv: string[]): EmbedOptions {
  const opts: EmbedOptions = {
    videoIds: [],
    db: DEFAULT_DB,
    chunkSize: 6,
    overlap: 1,
    refresh: false,
    outputDir: "youtube-transcript",
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--db") opts.db = argv[++i];
    else if (a === "--chunk-size") opts.chunkSize = parseInt(argv[++i], 10);
    else if (a === "--overlap") opts.overlap = parseInt(argv[++i], 10);
    else if (a === "--refresh") opts.refresh = true;
    else if (a === "--output-dir") opts.outputDir = argv[++i];
    else if (a === "-h" || a === "--help") {
      printHelp();
      process.exit(0);
    } else if (a.startsWith("--")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else {
      opts.videoIds.push(extractVideoId(a));
    }
  }

  if (opts.videoIds.length === 0) {
    printHelp();
    process.exit(2);
  }
  if (opts.chunkSize < 1) opts.chunkSize = 1;
  if (opts.overlap < 0) opts.overlap = 0;
  if (opts.overlap >= opts.chunkSize) opts.overlap = opts.chunkSize - 1;
  return opts;
}

function printHelp() {
  console.log(`Usage: bun embed.ts <url-or-id> [<url-or-id>...] [options]

Options:
  --db <path>          sqlite-vec database path (default: ${DEFAULT_DB})
  --chunk-size <n>     sentences per chunk (default: 6)
  --overlap <n>        sentence overlap between chunks (default: 1)
  --refresh            wipe and re-embed the specified videos
  --output-dir <dir>   transcript cache dir (default: youtube-transcript)
`);
}

interface Chunk {
  index: number;
  text: string;
  startSec: number;
  endSec: number;
}

function chunkSentences(sentences: Sentence[], size: number, overlap: number): Chunk[] {
  const chunks: Chunk[] = [];
  const step = Math.max(1, size - overlap);
  let idx = 0;
  for (let i = 0; i < sentences.length; i += step) {
    const slice = sentences.slice(i, i + size);
    if (slice.length === 0) break;
    chunks.push({
      index: idx++,
      text: slice.map((s) => s.text).join(" ").trim(),
      startSec: hmsToSec(slice[0].start),
      endSec: hmsToSec(slice[slice.length - 1].end),
    });
    if (i + size >= sentences.length) break;
  }
  return chunks;
}

async function embedVideo(
  db: ReturnType<typeof openDb>,
  videoId: string,
  opts: EmbedOptions,
): Promise<void> {
  const baseDir = resolveBaseDir(opts.outputDir);
  const videoDir = lookupVideoDir(videoId, baseDir);
  if (!videoDir || !hasCachedData(videoDir)) {
    throw new Error(
      `Video ${videoId} not cached at ${baseDir}. Run main.ts on this video first.`,
    );
  }

  const meta = loadMeta(videoDir);
  const sentences = loadSentences(videoDir);
  if (sentences.length === 0) {
    console.warn(`[${videoId}] no sentences in cache, skipping.`);
    return;
  }

  const existing = db
    .query("SELECT COUNT(*) as n FROM chunks WHERE video_id = ?")
    .get(videoId) as { n: number };
  if (existing.n > 0 && !opts.refresh) {
    console.log(`[${videoId}] already indexed (${existing.n} chunks). Use --refresh to rebuild.`);
    return;
  }

  if (opts.refresh && existing.n > 0) {
    const ids = db
      .query("SELECT id FROM chunks WHERE video_id = ?")
      .all(videoId) as { id: number }[];
    const delVec = db.prepare("DELETE FROM vec_chunks WHERE chunk_id = ?");
    for (const r of ids) delVec.run(r.id);
    db.run("DELETE FROM chunks WHERE video_id = ?", [videoId]);
    console.log(`[${videoId}] refreshed: dropped ${ids.length} prior chunks.`);
  }

  db.run(
    `INSERT INTO videos(video_id, title, channel, url, duration, publish_date)
     VALUES(?, ?, ?, ?, ?, ?)
     ON CONFLICT(video_id) DO UPDATE SET
       title=excluded.title, channel=excluded.channel, url=excluded.url,
       duration=excluded.duration, publish_date=excluded.publish_date`,
    [
      meta.videoId,
      meta.title,
      meta.channel,
      meta.url,
      meta.duration ?? null,
      meta.publishDate ?? null,
    ],
  );

  const chunks = chunkSentences(sentences, opts.chunkSize, opts.overlap);
  console.log(`[${videoId}] ${sentences.length} sentences → ${chunks.length} chunks`);

  const embeddings = await embedTexts(
    chunks.map((c) => c.text),
    "RETRIEVAL_DOCUMENT",
  );

  const insertChunk = db.prepare(
    `INSERT INTO chunks(video_id, chunk_index, start_sec, end_sec, text)
     VALUES(?, ?, ?, ?, ?) RETURNING id`,
  );
  const insertVec = db.prepare(`INSERT INTO vec_chunks(chunk_id, embedding) VALUES(?, ?)`);

  const tx = db.transaction(() => {
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const row = insertChunk.get(videoId, c.index, c.startSec, c.endSec, c.text) as {
        id: number;
      };
      insertVec.run(row.id, f32ToBlob(embeddings[i]));
    }
  });
  tx();

  console.log(`[${videoId}] embedded ${chunks.length} chunks → ${opts.db}`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const db = openDb(opts.db);
  await loadSqliteVec(db);
  await ensureSchema(db);

  for (const id of opts.videoIds) {
    try {
      await embedVideo(db, id, opts);
    } catch (e: any) {
      console.error(`[${id}] ${e?.message || e}`);
      process.exitCode = 1;
    }
  }
  db.close();
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
