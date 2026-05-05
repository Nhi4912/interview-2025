# SHARED KNOWLEDGE BASE

**Generated:** 2026-05-05 | **Commit:** 03bb2f7 | **Branch:** main

## OVERVIEW

Track-agnostic theory: CS fundamentals, system design primitives, DB internals, security, software engineering, AI/ML, company guides, L5 competencies, behavioral. **FE-track and BE-track reference here instead of duplicating.** Bilingual (EN headings / VI explanations), 57 markdown files, ~66k lines.

## STRUCTURE

```
docs/shared/
├── 01-cs-fundamentals/         # algorithms, DS, complexity, OS, networking, concurrency, computation, info theory
├── 02-system-design/           # caching, replication, consensus, MQ, LB, event sourcing/CQRS
├── 03-database/                # DB theory, indexing, NoSQL/NewSQL, sharding, transactions
├── 04-security/                # security fundamentals, crypto, OWASP, modern auth
├── 05-software-engineering/    # SOLID, architecture, SDLC, testing, code quality, PM
├── 06-ai-and-agents/           # ML, LLM, agents, RAG, AI eng, AI SD, eval, Claude deep-dive, AI-era skills
├── 07-company-guides/          # Google, Microsoft, Grab, Axon, EmploymentHero, Zalo/VNG (one .md per company)
├── 08-l5-competencies/         # L5 Senior Eng self-assessment + 6 weighted competencies
├── 09-behavioral/              # STAR method, leadership principles, common Qs, storytelling
└── THEORY-KNOWLEDGE-INDEX.md   # navigation map for entire shared/ — entry point
```

## WHERE TO LOOK

| Task                                               | Location                                              |
| -------------------------------------------------- | ----------------------------------------------------- |
| Find anything in shared/                           | `THEORY-KNOWLEDGE-INDEX.md` (start here)              |
| Algorithms / DS / complexity / OS / networking     | `01-cs-fundamentals/`                                 |
| Caching / consensus / replication / MQ / LB / CQRS | `02-system-design/`                                   |
| DB theory / indexing / NoSQL / sharding / tx       | `03-database/`                                        |
| Auth / crypto / OWASP / mTLS / OAuth2              | `04-security/`                                        |
| SOLID / architecture / testing / code review       | `05-software-engineering/`                            |
| ML / LLM / RAG / agents / AI production            | `06-ai-and-agents/`                                   |
| Company-specific tactics                           | `07-company-guides/<NN-company>.md`                   |
| L5 self-assessment + competency rubric             | `08-l5-competencies/00-l5-self-assessment.md` (entry) |
| STAR / behavioral storytelling                     | `09-behavioral/`                                      |
| Track-specific application                         | `../be-track/` or `../fe-track/` (NOT here)           |

## CONVENTIONS

- **Bilingual**: EN headings + VI explanation body. VI is primary audience — never strip it.
- **Header metadata** (every topic file):
  ```
  > **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
  > **See also**: [link to ToC or related doc]
  ```
- **File naming is INCONSISTENT across subdirs** — two patterns coexist:
  - Numbered: `NN-kebab-case.md` (e.g. `04-security/01-security-fundamentals.md`)
  - Unnumbered: `<topic>-theory.md` (e.g. `01-cs-fundamentals/algorithms-theory.md`)
  - **Don't normalise** — both are intentional; numbered = ordered curriculum, unnumbered = standalone reference.
- **Sections per file**: Real-World Scenario (often Vietnamese tech company) → What & Why (Feynman analogy + multi-level Why) → Concept Map → Deep Dive → 🧠 Memory Hook → cross-refs.
- **08-l5-competencies/ is weighted** — `00-l5-self-assessment.md` defines 100pt scoring; subfiles map to specific competencies. Don't add a competency file without updating the weight table.
- **07-company-guides/ uses interview-anecdote opener** — file starts with a real candidate pass/fail story. Keep this format.

## ANTI-PATTERNS (THIS PROJECT)

- ❌ Don't put track-specific content here — Go-only patterns belong in `../be-track/01-golang/`, React-only in `../fe-track/03-react/`. Shared = language/framework agnostic.
- ❌ Don't drop VI text — bilingual is the format, not legacy.
- ❌ Don't duplicate FE/BE-track content — if a topic exists in both tracks, lift it here and have both tracks cross-link in.
- ❌ Don't renumber files in numbered subdirs (`04-security/`, `06-ai-and-agents/`) — be-track and fe-track AGENTS.md files link by exact filename.
- ❌ Don't add a new top-level subdir without updating `THEORY-KNOWLEDGE-INDEX.md` AND repo-level `../00-table-of-contents.md`.
- ❌ Don't promote `06-ai-and-agents/09-claude-and-anthropic-deep-dive.md` content into general AI sections — it's a vendor-specific deep dive, intentionally siloed.
- ❌ Don't merge `08-l5-competencies/` into `09-behavioral/` — L5 is competency rubric (scoring), behavioral is interview answer technique (delivery). Different purposes.

## UNIQUE STYLES

- **Multi-level Why blocks** (`→ Why? → Why?`) — Toyota 5-Whys applied to technical concepts. Used heavily in `06-ai-and-agents/` and `02-system-design/`.
- **Real Vietnamese company anecdotes** as openers (Grab geospatial, VinAI churn drift, Shopee Black Friday, Zalo livestream) — these are interview narrative ammunition, not just colour.
- **Feynman analogies** (e.g. "ML như dạy trẻ nhận biết chó") — every What & Why opens with a concrete physical-world analogy before formal definition.
- **L5 weight stars** in `08-l5-competencies/` map directly to the 100-point self-assessment rubric — file weights are NOT arbitrary.

## NOTES

- Pure markdown — no build/test commands. Lint via repo-level tools only.
- `THEORY-KNOWLEDGE-INDEX.md` is the canonical entry; update it whenever adding/removing files.
- When extending: add file → update `THEORY-KNOWLEDGE-INDEX.md` table → cross-link from relevant be-track/fe-track AGENTS.md so tracks discover the new shared content.
- `08-l5-competencies/03-*.md` is intentionally missing (assessment numbering jumps 02 → 04) — do not "fix" by renumbering; preserve numbering for downstream link stability.
