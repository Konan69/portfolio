#!/usr/bin/env bun
// Query the local sqlite-vec transcript store.
// Returns markdown (default) or JSON with deep-linked timestamps.

import { existsSync } from "fs";
import {
  embedTexts,
  ensureSchema,
  f32ToBlob,
  loadSqliteVec,
  openDb,
  secToHms,
} from "./vecdb.ts";

const DEFAULT_DB = "./embeddings.db";

interface QueryOptions {
  query: string;
  db: string;
  topK: number;
  videoId: string | null;
  list: boolean;
  json: boolean;
}

function parseArgs(argv: string[]): QueryOptions {
  const opts: QueryOptions = {
    query: "",
    db: DEFAULT_DB,
    topK: 5,
    videoId: null,
    list: false,
    json: false,
  };
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--db") opts.db = argv[++i];
    else if (a === "-k" || a === "--top") opts.topK = parseInt(argv[++i], 10);
    else if (a === "--video-id") opts.videoId = argv[++i];
    else if (a === "--list") opts.list = true;
    else if (a === "--json") opts.json = true;
    else if (a === "-h" || a === "--help") {
      printHelp();
      process.exit(0);
    } else if (a.startsWith("--")) {
      console.error(`Unknown option: ${a}`);
      process.exit(2);
    } else {
      positional.push(a);
    }
  }
  opts.query = positional.join(" ").trim();
  if (!opts.list && !opts.query) {
    printHelp();
    process.exit(2);
  }
  if (!Number.isFinite(opts.topK) || opts.topK < 1) opts.topK = 5;
  return opts;
}

function printHelp() {
  console.log(`Usage: bun query.ts "<query>" [options]
       bun query.ts --list

Options:
  -k, --top <n>        number of results (default: 5)
  --video-id <id>      restrict search to a single video
  --db <path>          sqlite-vec database path (default: ${DEFAULT_DB})
  --json               emit JSON instead of markdown
  --list               list all indexed videos
`);
}

interface Hit {
  chunk_id: number;
  distance: number;
  video_id: string;
  title: string;
  channel: string;
  url: string;
  start_sec: number;
  end_sec: number;
  text: string;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!existsSync(opts.db)) {
    console.error(
      `Database not found at ${opts.db}. Run embed.ts on at least one video first.`,
    );
    process.exit(1);
  }

  const db = openDb(opts.db);
  await loadSqliteVec(db);
  await ensureSchema(db);

  if (opts.list) {
    const rows = db
      .query(
        `SELECT v.video_id, v.title, v.channel, COUNT(c.id) as chunks
         FROM videos v LEFT JOIN chunks c ON c.video_id = v.video_id
         GROUP BY v.video_id ORDER BY v.indexed_at DESC`,
      )
      .all() as { video_id: string; title: string; channel: string; chunks: number }[];
    if (rows.length === 0) {
      console.log("No videos indexed yet.");
    } else if (opts.json) {
      console.log(JSON.stringify(rows, null, 2));
    } else {
      console.log(`# Indexed videos (${rows.length})\n`);
      for (const r of rows) {
        console.log(`- **${r.title}** — ${r.channel} (\`${r.video_id}\`, ${r.chunks} chunks)`);
      }
    }
    db.close();
    return;
  }

  const [qVec] = await embedTexts([opts.query], "RETRIEVAL_QUERY");

  const videoFilter = opts.videoId ? "AND c.video_id = ?" : "";
  const params: any[] = [f32ToBlob(qVec), opts.topK * (opts.videoId ? 4 : 1)];
  if (opts.videoId) params.push(opts.videoId);

  const sql = `
    WITH matches AS (
      SELECT chunk_id, distance
      FROM vec_chunks
      WHERE embedding MATCH ?
      ORDER BY distance
      LIMIT ?
    )
    SELECT
      m.chunk_id, m.distance,
      c.video_id, c.start_sec, c.end_sec, c.text,
      v.title, v.channel, v.url
    FROM matches m
    JOIN chunks c ON c.id = m.chunk_id
    JOIN videos v ON v.video_id = c.video_id
    WHERE 1=1 ${videoFilter}
    ORDER BY m.distance
    LIMIT ${opts.topK}
  `;

  const hits = db.query(sql).all(...params) as Hit[];

  if (hits.length === 0) {
    console.log(opts.json ? "[]" : "_No matches._");
    db.close();
    return;
  }

  if (opts.json) {
    console.log(
      JSON.stringify(
        hits.map((h) => ({
          ...h,
          timestamp: secToHms(h.start_sec),
          deep_link: `https://youtu.be/${h.video_id}?t=${h.start_sec}`,
        })),
        null,
        2,
      ),
    );
  } else {
    console.log(`# Results for: _${opts.query}_\n`);
    hits.forEach((h, i) => {
      const ts = secToHms(h.start_sec);
      const link = `https://youtu.be/${h.video_id}?t=${h.start_sec}`;
      console.log(
        `## ${i + 1}. ${h.title} — [${ts}](${link})  \n` +
          `**${h.channel}** · distance \`${h.distance.toFixed(4)}\`\n\n` +
          `> ${h.text.replace(/\n+/g, " ")}\n`,
      );
    });
  }

  db.close();
}

main().catch((e) => {
  console.error(e?.message || e);
  process.exit(1);
});
