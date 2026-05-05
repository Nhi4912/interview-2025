# DOCS KNOWLEDGE BASE

**Generated:** 2026-05-05 | **Branch:** main

## OVERVIEW

Master index for all interview-prep knowledge. Bilingual EN/VI study notes targeting Mid/Senior roles at Google, Microsoft, Grab VN, Axon, Employment Hero, Zalo (VNG). Pure markdown — no build artifacts.

## STRUCTURE

```
docs/
├── 00-table-of-contents.md          # PRIMARY entry point (full index)
├── 00-quick-start-guide.md          # 1-page onboarding
├── 00-6-month-study-plan.md         # Phase-ordered learning roadmap
├── 00-interview-market-overview.md  # 2025-2026 market intel (1k lines)
├── 00-level-guide.md                # Junior → Staff progression
├── LEARNING-METHODOLOGY.md          # Spaced repetition / Feynman / SRS
├── quick-reference-cheat-sheet.md   # Last-minute review (1.3k lines)
├── be-track/                        # Go backend (BE)
├── fe-track/                        # React/TS frontend (FE)
├── shared/                          # Track-agnostic (CS, SD, security, AI, L5, behavioral, company)
├── 2026-trends/                     # 12 high-signal senior topics (NEW for 2026)
├── leetcode/                        # DSA practice (~2,300 problems, ~100 hand-crafted)
├── interview-company-wise-problems/ # ORPHAN GIT SUBMODULE — scraped external (350+ companies); see NOTES
└── specs/                           # Knowledge-generation process docs (meta)
```

## WHERE TO LOOK

| Intent                                                                       | Start at                                                            |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| First-time orientation                                                       | `00-quick-start-guide.md`                                           |
| Plan study path                                                              | `00-6-month-study-plan.md` → `00-table-of-contents.md`              |
| Backend (Go) prep                                                            | `be-track/AGENTS.md`                                                |
| Frontend (React/TS) prep                                                     | `fe-track/AGENTS.md`                                                |
| CS theory / SD primitives / security / AI / company guides / L5 / behavioral | `shared/AGENTS.md`                                                  |
| 2026 senior+ topics (RSC, LLM SD, Edge, WASM, Rust BE)                       | `2026-trends/README.md`                                             |
| LeetCode practice                                                            | `leetcode/AGENTS.md` (start with `00-study-guide.md`)               |
| Company-specific LeetCode lists                                              | `leetcode/company-wise/`                                            |
| External scraped company problems                                            | `interview-company-wise-problems/<company>/` (read-only, see NOTES) |
| How content is generated/specced                                             | `specs/AGENTS.md`                                                   |
| Last-minute review                                                           | `quick-reference-cheat-sheet.md`                                    |

## CONVENTIONS (REPO-WIDE)

- **Bilingual EN/VI** — every doc mixes English headings with Vietnamese explanations. VI is primary audience; do NOT strip it.
- **File naming** — zero-padded `NN-kebab-case.md` (e.g. `03-concurrency.md`). `NN` defines study order within folder.
- **Header metadata** at top of every topic file:
  ```
  > **Track**: BE | FE | Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
  > **See also**: [Table of Contents](path/to/00-table-of-contents.md)
  ```
- **Difficulty markers** — 🟢 Junior / 🟡 Mid / 🔴 Senior, applied per Q and per file overview.
- **Subdir AGENTS.md** is the entry index for that subdir; root AGENTS.md (this file) only routes between subdirs.
- **Every subdir has `README.md`** acting as human-facing index; AGENTS.md is the agent-facing summary.

## ANTI-PATTERNS (THIS PROJECT)

- ❌ Don't create new top-level subdirs without updating `00-table-of-contents.md` AND this file.
- ❌ Don't renumber existing files — cross-doc links use exact `NN-name.md` paths.
- ❌ Don't drop VI text — bilingual is intentional.
- ❌ Don't put track-specific content in `shared/` — only language-/framework-agnostic theory belongs there.
- ❌ Don't edit `interview-company-wise-problems/` — orphan git submodule (gitlink in parent index, no `.gitmodules`). Files visible in working tree are NOT tracked by parent. Treat as read-only external resource.
- ❌ Don't promote `payment-service-notes.md` (be-track) into general docs — NDA-adjacent project context.
- ❌ Don't merge `2026-trends/` into `shared/06-ai-and-agents/` — trends is a deliberate "hot topics" silo.
- ❌ Don't populate `leetcode/_archive/` — it's deprecated content, kept for reference only.

## UNIQUE STYLES

- **Vietnamese tech-company anecdotes** open many files (Grab, Tiki, Shopee, Zalo, VinAI) — use as interview narrative anchors, not just examples.
- **🧠 Memory Hook** callouts give the one-liner to say in interviews.
- **Multi-level Why blocks** (2+ levels of "why") precede every concept introduction.
- **Mindmaps as ASCII trees** — grep-friendly for AI context, NOT Mermaid/images.
- **Q&A format** — `### 🟢/🟡/🔴 Q: ...` followed by `**A:**` block. Color = difficulty.
- **L5 100-pt rubric** drives competency mapping (`shared/08-l5-competencies/`).

## NOTES

- No build/test commands — pure markdown. Lint via repo-level tools only.
- 31 AGENTS.md files exist as of this commit (be-track 6, fe-track 15, shared 10) — this file makes 32+; subtree generation continues.
- The repo has an **orphan git submodule** at `interview-company-wise-problems/` — gitlink registered in parent index (commit `a0c0e0f`) but no `.gitmodules` mapping. Working-tree files are visible but NOT tracked by parent. Do not add AGENTS.md or any new files there — they'd be invisible to the parent repo.
- When extending: add file → update local `README.md` table → update `00-table-of-contents.md` if it changes top-level structure.
