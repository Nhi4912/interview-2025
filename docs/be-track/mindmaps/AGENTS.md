# AGENTS.md — mindmaps

## OVERVIEW

ASCII-tree review sheets for last-minute interview cram. NOT a substitute for topic docs — these compress already-learned material.

## FILES

| File                          | Mirrors                                       | Lines |
| ----------------------------- | --------------------------------------------- | ----- |
| `mindmap-golang.md`           | `../01-golang/`                               | ~410  |
| `mindmap-database.md`         | `../03-database-advanced/`                    | ~375  |
| `mindmap-security.md`         | `../02-backend-knowledge/04-auth-security.md` | ~370  |
| `mindmap-system-design-be.md` | `../04-be-system-design/`                     | ~390  |

## WHEN TO USE

- 1–3 days before interview: scan to surface gaps
- During interview prep: print/screenshot for offline review
- NOT for first-time learning — read the topic file first, mindmap after

## LOCAL CONVENTIONS

- **ASCII boxes only** (┌─┐│└─┘├┤┬┴┼) — no images, no Mermaid. Grep-friendly + AI-context-friendly.
- **Hierarchy via indentation depth**: root concept → categories → primitives → examples
- **Mirror the parent folder structure**: section numbering in mindmap matches file numbering in source folder
- **Bilingual headings** (`## 1. Language Fundamentals / Kiến Thức Nền Tảng`) — VI subtitle required
- **Code snippets inside boxes** are OK but kept to 1–3 lines max — pointer not tutorial

## ANTI-PATTERNS

- Don't add NEW knowledge here — if a topic isn't in source folder, add it there first, then summarise
- Don't convert to Mermaid/PlantUML — breaks grep, breaks plain-text rendering, defeats purpose
- Don't exceed ~500 lines per file — past that, it stops being a "review sheet"
- Don't drift from source numbering — if `01-golang/` adds a new file, mindmap section numbers must follow
- Don't delete a mindmap when its source folder still exists — they're paired artifacts
