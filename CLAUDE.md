# Portfolio — CLAUDE.md

## Career-Ops

Skill + slash commands hoisted from [santifer/career-ops](https://github.com/santifer/career-ops). The clone lives at `./career-ops/` (gitignored); only the hoisted files under `.claude/` are tracked.

- **Skill** (Claude Code): `.claude/skills/career-ops/SKILL.md` — router that dispatches by mode arg. Invoke via `/career-ops [mode]` or let Claude auto-invoke on job-search intent.
- **Commands** (OpenCode): `.opencode/commands/career-ops-*.md` — 13 mode-specific OpenCode slash commands (scan, evaluate, batch, deep, compare, pipeline, apply, tracker, pdf, contact, project, training, and the router). Used from OpenCode; Claude Code users invoke the skill directly.

To refresh from upstream: `cd career-ops && git pull && cd .. && cp career-ops/.claude/skills/career-ops/SKILL.md .claude/skills/career-ops/ && cp career-ops/.opencode/commands/*.md .opencode/commands/`.

## LinkedIn posting

Composio MCP is wired up (user-scoped). LinkedIn account `kixeyems0@gmail.com` connected as `urn:li:person:2mDCNt7cjE`. Available tools: `LINKEDIN_CREATE_LINKED_IN_POST`, `LINKEDIN_CREATE_ARTICLE_OR_URL_SHARE`, `LINKEDIN_REGISTER_IMAGE_UPLOAD`, `LINKEDIN_DELETE_POST`, `LINKEDIN_GET_MY_INFO`. OAuth-only — no DMs, feed, or search.
