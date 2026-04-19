---
name: youtube-research
description: Downloads YouTube video transcripts (no API key), chunks + embeds them into a local sqlite-vec store, and runs semantic queries across one or many videos. Use when the user wants to research a YouTube video, extract quotes, enrich a blog post with facts/timestamps from a video, or build a searchable library of transcripts. Triggers on "transcript", "get captions", "research this video", "find quotes about X in this video", "enrich my blog from a YouTube video", or any YouTube URL plus a research/writing intent.
version: 2.0.0
metadata:
  requires:
    anyBins:
      - bun
      - npx
    env:
      - GEMINI_API_KEY  # only required for embed/query, not for raw transcript download
---

# YouTube Research

Two-stage skill:

1. **Transcript download** — pulls captions from YouTube (manual or auto-generated) via the InnerTube API, with `yt-dlp` fallback. No API key needed for this stage.
2. **Embed + query** — chunks cached transcripts, embeds chunks with Gemini `gemini-embedding-001` (768-dim), stores vectors in a local **sqlite-vec** database, and serves semantic queries that return deep-linked timestamps ready to drop into a blog post.

Typical use case: feed it a YouTube URL, then ask "what did they say about X?" and get back quoted chunks with `youtu.be/ID?t=SEC` links.

## Script Directory

Scripts in `scripts/`. `{baseDir}` = this SKILL.md's directory path. Resolve `${BUN_X}` runtime: if `bun` installed → `bun`; if `npx` available → `npx -y bun`; else suggest installing bun. Replace `{baseDir}` and `${BUN_X}` with actual values.

| Script | Purpose |
|--------|---------|
| `scripts/main.ts` | Transcript download CLI |
| `scripts/embed.ts` | Chunk + embed cached transcripts into sqlite-vec |
| `scripts/query.ts` | Semantic search across embedded transcripts |
| `scripts/vecdb.ts` | Shared sqlite-vec + Gemini embeddings helpers |

## One-time Setup (required for embed/query only)

The transcript downloader has zero runtime deps. The embed/query stage needs `sqlite-vec` plus a sqlite build with extension loading enabled:

```bash
# 1. Install the Node dependency
cd {baseDir}
bun install

# 2. Make sure you have a sqlite dylib with extension loading enabled.
#    bun:sqlite ships with extensions disabled, so we point it at brew sqlite.
#    macOS: brew install sqlite   (auto-detected at /opt/homebrew or /usr/local)
#    Linux: install libsqlite3-dev (auto-detected at /usr/lib/...)
#    Other:  export SQLITE_VEC_LIBSQLITE=/abs/path/to/libsqlite3.{dylib,so}

# 3. Export a Gemini API key (get one at https://aistudio.google.com/apikey)
export GEMINI_API_KEY=...
```

If any of these are missing, `embed.ts` / `query.ts` exit with a clear error telling you which step to fix. The raw `main.ts` transcript script works regardless.

## Usage

### Stage 1: download transcript

```bash
# Default: markdown with timestamps (English)
${BUN_X} {baseDir}/scripts/main.ts <youtube-url-or-id>

# Specify languages (priority order)
${BUN_X} {baseDir}/scripts/main.ts <url> --languages zh,en,ja

# Without timestamps
${BUN_X} {baseDir}/scripts/main.ts <url> --no-timestamps

# With chapter segmentation
${BUN_X} {baseDir}/scripts/main.ts <url> --chapters

# With speaker identification (requires AI post-processing)
${BUN_X} {baseDir}/scripts/main.ts <url> --speakers

# SRT subtitle file
${BUN_X} {baseDir}/scripts/main.ts <url> --format srt

# Translate transcript
${BUN_X} {baseDir}/scripts/main.ts <url> --translate zh-Hans

# List available transcripts
${BUN_X} {baseDir}/scripts/main.ts <url> --list

# Force re-fetch (ignore cache)
${BUN_X} {baseDir}/scripts/main.ts <url> --refresh
```

### Stage 2: embed into sqlite-vec

```bash
# Embed one or more videos (must already be downloaded by main.ts).
# Default DB: ./embeddings.db in the CWD.
${BUN_X} {baseDir}/scripts/embed.ts <url-or-id> [<url-or-id>...]

# Custom DB location
${BUN_X} {baseDir}/scripts/embed.ts <url> --db ./research.db

# Tune chunk size (sentences per chunk) and overlap
${BUN_X} {baseDir}/scripts/embed.ts <url> --chunk-size 2 --overlap 0

# Re-embed (wipe prior chunks for this video)
${BUN_X} {baseDir}/scripts/embed.ts <url> --refresh
```

### Stage 3: query

```bash
# Search across all embedded videos
${BUN_X} {baseDir}/scripts/query.ts "what did they say about rate limiting?"

# Top-N results (default 5)
${BUN_X} {baseDir}/scripts/query.ts "quotes about scaling" -k 10

# Restrict to a single video
${BUN_X} {baseDir}/scripts/query.ts "main thesis" --video-id dQw4w9WgXcQ

# Use a non-default DB
${BUN_X} {baseDir}/scripts/query.ts "..." --db ./research.db

# List all indexed videos
${BUN_X} {baseDir}/scripts/query.ts --list
```

Query output is markdown: each hit has the source video title, channel, `[HH:MM:SS]` timestamp, a `youtu.be/ID?t=SEC` deep link, and the chunk text — ready to paste into a draft blog.

## Options

### `main.ts` (transcript)

| Option | Description | Default |
|--------|-------------|---------|
| `<url-or-id>` | YouTube URL or video ID (multiple allowed) | Required |
| `--languages <codes>` | Language codes, comma-separated, priority order | `en` |
| `--format <fmt>` | Output format: `text`, `srt` | `text` |
| `--translate <code>` | Translate to specified language code | |
| `--list` | List available transcripts instead of fetching | |
| `--timestamps` / `--no-timestamps` | Include `[HH:MM:SS → HH:MM:SS]` timestamps | on |
| `--chapters` | Chapter segmentation from video description | |
| `--speakers` | Raw transcript with metadata for speaker identification | |
| `--exclude-generated` / `--exclude-manually-created` | Filter transcript sources | |
| `--refresh` | Force re-fetch, ignore cached data | |
| `-o, --output <path>` | Save to specific file path | auto |
| `--output-dir <dir>` | Base output directory | `youtube-transcript` |

### `embed.ts`

| Option | Description | Default |
|--------|-------------|---------|
| `<url-or-id>` | One or more videos to embed (must already be cached by `main.ts`) | Required |
| `--db <path>` | sqlite-vec database path | `./embeddings.db` |
| `--chunk-size <n>` | Sentences per chunk | `6` |
| `--overlap <n>` | Sentence overlap between chunks | `1` |
| `--refresh` | Wipe and re-embed the specified videos | |
| `--output-dir <dir>` | Transcript cache dir (must match `main.ts`) | `youtube-transcript` |

### `query.ts`

| Option | Description | Default |
|--------|-------------|---------|
| `<query>` | Natural-language query string | Required (unless `--list`) |
| `-k, --top <n>` | Number of results to return | `5` |
| `--video-id <id>` | Restrict search to one video | |
| `--db <path>` | sqlite-vec database path | `./embeddings.db` |
| `--list` | List all indexed videos in the DB | |
| `--json` | Emit JSON instead of markdown | |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `YOUTUBE_TRANSCRIPT_COOKIES_FROM_BROWSER` | Passed to `yt-dlp --cookies-from-browser` during fallback, e.g. `chrome`, `safari`, `firefox` |
| `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) | Required for `embed.ts` and `query.ts` |
| `SQLITE_VEC_LIBSQLITE` | Absolute path to a `libsqlite3.{dylib,so}` with extension loading enabled. Only needed if auto-detection doesn't find brew/system sqlite. |

## Input Formats

Accepts any of these as video input:
- Full URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short URL: `https://youtu.be/dQw4w9WgXcQ`
- Embed URL: `https://www.youtube.com/embed/dQw4w9WgXcQ`
- Shorts URL: `https://www.youtube.com/shorts/dQw4w9WgXcQ`
- Video ID: `dQw4w9WgXcQ`

## Output Layout

Transcripts live under `--output-dir` (default: `youtube-transcript/` in the CWD). The sqlite-vec DB defaults to `./embeddings.db` in the CWD — keep it next to your project or point `--db` somewhere shared. **Make sure `embeddings.db` (and its `-wal` / `-shm` sidecars) is gitignored** along with the transcript cache dir:

```
# .gitignore
/youtube-transcript
/embeddings.db
/embeddings.db-shm
/embeddings.db-wal
```

```
youtube-transcript/
├── .index.json                          # video ID → directory path mapping
└── {channel-slug}/{title-full-slug}/
    ├── meta.json
    ├── transcript-raw.json
    ├── transcript-sentences.json
    ├── imgs/cover.jpg
    ├── transcript.md
    └── transcript.srt

embeddings.db                            # sqlite-vec database (chunks + vectors)
```

The sqlite-vec DB holds three things:
- `videos` — one row per indexed video (id, title, channel, url, duration)
- `chunks` — one row per chunk (video_id, chunk_index, start_sec, end_sec, text)
- `vec_chunks` — vec0 virtual table mapping `chunk_id` → embedding `FLOAT[768]`

## Caching

On first fetch, `main.ts` saves `meta.json`, `transcript-raw.json`, `transcript-sentences.json`, and `imgs/cover.jpg`. Subsequent runs for the same video use the cache. Use `--refresh` to force re-fetch.

`embed.ts` reads from this cache — it will fail loudly if you ask it to embed a video that hasn't been downloaded yet. Re-embedding (`--refresh`) only wipes the vector rows, not the transcript cache.

When YouTube returns anti-bot responses on the direct InnerTube path, `main.ts` retries with alternate client identities and falls back to `yt-dlp` if available. If fallback tooling is missing, the agent should resolve that itself.

## Workflow: enrich a blog post from a YouTube video

1. **Download** the transcript: `main.ts <url> --chapters`
2. **Embed** it: `embed.ts <url>` (one-time per video — reuses cache)
3. **Query** for whatever the blog section needs: `query.ts "key argument about X" -k 8`
4. Paste the returned quotes (with deep-linked timestamps) into the draft. Each result carries its source video + `youtu.be/ID?t=SEC`, so citations stay honest.
5. For multi-video research, embed several videos into the same DB and query across all of them. Use `--video-id` to scope down.

When the user only wants a single transcript (no research/search), stop after step 1 — there's no need to embed.

## Chapter & Speaker Workflow

### Chapters (`--chapters`)

`main.ts` parses chapter timestamps from the video description (e.g., `0:00 Introduction`), segments the transcript by chapter boundaries, groups snippets into readable paragraphs, and saves as `.md` with a Table of Contents.

If no chapter timestamps exist in the description, the transcript is output as grouped paragraphs without chapter headings.

### Speaker Identification (`--speakers`)

Speaker identification requires AI processing. `main.ts` outputs a raw `.md` containing YAML frontmatter with video metadata, description, chapter list, and the transcript in SRT format. Then:

1. Read the saved `.md` file
2. Read the prompt template at `{baseDir}/prompts/speaker-transcript.md`
3. Process with a sub-agent (Sonnet is fine for cost):
   - Identify speakers using video metadata (title → guest, channel → host, description → names)
   - Detect speaker turns from conversation flow, Q&A patterns, contextual cues
   - Segment into chapters (use description chapters if available, else topic shifts)
   - Format with `**Speaker Name:**` labels, paragraph grouping (2–4 sentences), `[HH:MM:SS → HH:MM:SS]` timestamps
4. Overwrite the `.md` with the processed transcript (keep the YAML frontmatter)

When `--speakers` is used, `--chapters` is implied.

## Error Cases

| Error | Meaning |
|-------|---------|
| Transcripts disabled | Video has no captions at all |
| No transcript found | Requested language not available |
| Video unavailable | Video deleted, private, or region-locked |
| IP blocked | Too many requests, try again later |
| Age restricted | Video requires login for age verification |
| bot detected | `main.ts` retries alternate clients and `yt-dlp`; if fallback tooling is missing, the agent should resolve that itself. Otherwise try `YOUTUBE_TRANSCRIPT_COOKIES_FROM_BROWSER=safari` |
| `sqlite-vec not installed` | Run `bun install` inside the skill directory |
| `Could not find a sqlite build with extension loading enabled` | Install brew sqlite (macOS) or libsqlite3 (Linux), or set `SQLITE_VEC_LIBSQLITE` |
| `Missing GEMINI_API_KEY` | Export the key before running embed/query |
| `Video not cached` (embed.ts) | Run `main.ts` for that video first |

## Notes

- Single-quote YouTube URLs when running scripts — zsh treats `?` as a glob wildcard. Use `'https://www.youtube.com/watch?v=ID'`.
- The `embeddings.db` file is safe to delete; re-running `embed.ts` rebuilds it from the transcript cache.
- Embedding 768-dim vectors in sqlite-vec scales comfortably to tens of thousands of chunks on a laptop. If you outgrow it, migrating the rows to pgvector is a short script.
- Auto-caption videos (no manual punctuation) sometimes collapse into a handful of huge "sentences". Pass `--chunk-size 1 --overlap 0` to embed.ts for finer-grained retrieval on those.
