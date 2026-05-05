# AGENTS.md — fe-track/mindmaps

## OVERVIEW

ASCII-tree review sheets paired with parent topic folders — last-minute cram, not first-time learning. Same pattern as `be-track/mindmaps/`.

## WHERE TO LOOK

| File                       | Mirrors                      |
| -------------------------- | ---------------------------- |
| `mindmap-javascript.md`    | `../01-javascript/`          |
| `mindmap-typescript.md`    | `../02-typescript/`          |
| `mindmap-react.md`         | `../03-react/`               |
| `mindmap-nextjs.md`        | `../04-nextjs/`              |
| `mindmap-html-css.md`      | `../05-html-css/`            |
| `mindmap-browser.md`       | `../06-browser-performance/` |
| `mindmap-performance.md`   | `../06-browser-performance/` |
| `mindmap-networking.md`    | `../10-networking/`          |
| `mindmap-system-design.md` | `../08-fe-system-design/`    |
| `mindmap-accessibility.md` | `../11-accessibility/`       |
| `mindmap-behavioral.md`    | `../12-behavioral/`          |
| `mindmap-foundations.md`   | `../01-javascript/` + shared |

## LOCAL CONVENTIONS

- **ASCII boxes only** (┌─┐│└─┘├┤) — no Mermaid, no images. Grep-friendly + AI-context-friendly.
- **Hierarchy via indentation**: root concept → categories → primitives → examples
- **Bilingual headings** (`## 1. Core / Kiến Thức Cơ Bản`) — VI subtitle required, matches be-track pattern
- **Code snippets inside boxes**: 1–3 lines max — pointer only, not tutorial
- **Mirror source numbering**: mindmap section N matches source folder file N

## CROSS-REFERENCES

Each mindmap is a compressed mirror of its source folder. When source adds content, update the mindmap section to match — section numbers must stay in sync. Cross-folder topics (e.g. browser + performance) may share a mindmap; note both parents in the file header.

## ANTI-PATTERNS

- Don't replace source docs with mindmaps — mindmaps summarise, source docs teach
- Don't use Mermaid/PlantUML/images — breaks grep, breaks plain-text rendering
- Don't add net-new knowledge here — add to source folder first, then summarise
- Don't exceed ~500 lines per file — past that, it's no longer a review sheet
- Don't delete a mindmap while its source folder still exists — they're paired artifacts
