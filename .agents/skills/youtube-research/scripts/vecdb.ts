// Shared helpers: sqlite-vec setup + Gemini embeddings.
// Used by embed.ts and query.ts.

import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export const EMBED_MODEL = "gemini-embedding-001";
export const EMBED_DIM = 768;
const EMBED_CONCURRENCY = 8;

/**
 * bun:sqlite ships with an sqlite build that has `load_extension` DISABLED.
 * To load sqlite-vec we point bun at a full-fat sqlite dylib (e.g. brew's).
 * Call once, before any Database is constructed.
 */
let customSqliteConfigured = false;
function configureCustomSqlite(): void {
  if (customSqliteConfigured) return;
  const override = process.env.SQLITE_VEC_LIBSQLITE;
  const candidates = [
    override,
    "/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib", // Apple Silicon brew
    "/usr/local/opt/sqlite/lib/libsqlite3.dylib", // Intel brew
    "/usr/lib/x86_64-linux-gnu/libsqlite3.so.0", // Debian/Ubuntu
    "/usr/lib64/libsqlite3.so.0", // RHEL/Fedora
  ].filter((p): p is string => typeof p === "string" && p.length > 0);

  for (const path of candidates) {
    if (existsSync(path)) {
      try {
        // @ts-ignore — static method
        Database.setCustomSQLite(path);
        customSqliteConfigured = true;
        return;
      } catch {
        // try next
      }
    }
  }

  throw new Error(
    "Could not find a sqlite build with extension loading enabled.\n" +
      "  macOS: run `brew install sqlite` then retry.\n" +
      "  Linux: install libsqlite3 from your package manager.\n" +
      "  Or set SQLITE_VEC_LIBSQLITE to the absolute path of a libsqlite3.{dylib,so}\n" +
      "  built with SQLITE_ENABLE_LOAD_EXTENSION.",
  );
}

export async function loadSqliteVec(db: Database): Promise<void> {
  let sqliteVec: { load: (db: Database) => void };
  try {
    sqliteVec = (await import("sqlite-vec")) as any;
  } catch {
    throw new Error(
      "sqlite-vec not installed. Run `bun install` inside the skill directory " +
        "(where SKILL.md lives) to install it, then retry.",
    );
  }
  try {
    sqliteVec.load(db);
  } catch (err: any) {
    throw new Error(
      `Failed to load sqlite-vec extension: ${err?.message || err}. ` +
        "Make sure you installed sqlite via brew (macOS) or libsqlite3 (Linux) " +
        "and that bun is picking up a dylib with extension loading enabled.",
    );
  }
}

export function openDb(dbPath: string): Database {
  configureCustomSqlite();
  const dir = dirname(dbPath);
  if (dir && dir !== "." && !existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(dbPath, { create: true });
  db.exec("PRAGMA journal_mode = WAL;");
  return db;
}

export async function ensureSchema(db: Database): Promise<void> {
  db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      video_id     TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      channel      TEXT NOT NULL,
      url          TEXT NOT NULL,
      duration     INTEGER,
      publish_date TEXT,
      indexed_at   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chunks (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id    TEXT NOT NULL REFERENCES videos(video_id) ON DELETE CASCADE,
      chunk_index INTEGER NOT NULL,
      start_sec   INTEGER NOT NULL,
      end_sec     INTEGER NOT NULL,
      text        TEXT NOT NULL,
      UNIQUE(video_id, chunk_index)
    );

    CREATE INDEX IF NOT EXISTS idx_chunks_video ON chunks(video_id);
  `);

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS vec_chunks USING vec0(
      chunk_id INTEGER PRIMARY KEY,
      embedding FLOAT[${EMBED_DIM}]
    );
  `);
}

export function requireGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    throw new Error(
      "Missing GEMINI_API_KEY (or GOOGLE_API_KEY). Get one at https://aistudio.google.com/apikey " +
        "and export it in your shell before running embed/query.",
    );
  }
  return key;
}

interface EmbedResponse {
  embedding?: { values: number[] };
  error?: { message?: string };
}

async function embedOne(
  text: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
  key: string,
): Promise<Float32Array> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: { parts: [{ text }] },
        taskType,
        outputDimensionality: EMBED_DIM,
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini embed API failed (${res.status}): ${body}`);
  }
  const data = (await res.json()) as EmbedResponse;
  if (!data.embedding?.values) {
    throw new Error(`Gemini embed API returned no embedding: ${JSON.stringify(data).slice(0, 500)}`);
  }
  return new Float32Array(data.embedding.values);
}

/**
 * Embed one or many strings via Gemini gemini-embedding-001.
 * Returns an array of Float32Array, one per input, in order.
 * Uses concurrent single-call embedContent requests with a small pool
 * (no stable batch endpoint for this model in v1beta).
 */
export async function embedTexts(
  texts: string[],
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY" = "RETRIEVAL_DOCUMENT",
): Promise<Float32Array[]> {
  if (texts.length === 0) return [];
  const key = requireGeminiKey();
  const results: Float32Array[] = new Array(texts.length);

  for (let i = 0; i < texts.length; i += EMBED_CONCURRENCY) {
    const slice = texts.slice(i, i + EMBED_CONCURRENCY);
    const embedded = await Promise.all(
      slice.map((t) => embedOne(t, taskType, key)),
    );
    for (let j = 0; j < embedded.length; j++) results[i + j] = embedded[j];
  }

  return results;
}

// Serialize Float32Array to Buffer for sqlite-vec BLOB column binding.
export function f32ToBlob(arr: Float32Array): Buffer {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
}

// Parse "HH:MM:SS" or "MM:SS" into seconds.
export function hmsToSec(s: string): number {
  const parts = s.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return 0;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

export function secToHms(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}
