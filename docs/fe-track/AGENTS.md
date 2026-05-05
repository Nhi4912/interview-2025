# FE-TRACK KNOWLEDGE BASE

**Generated:** 2026-05-05 | **Commit:** fc97f13 | **Branch:** main

## OVERVIEW

Frontend interview prep — bilingual (EN/VI) study notes targeting Junior→Senior FE roles at Zalo (VNG), Grab VN, Axon, Employment Hero, Microsoft, Google. Pure markdown, ~236 files, ~177k lines. Mirrors structure/conventions of sibling `be-track/`.

## STRUCTURE

```
docs/fe-track/
├── 00-study-roadmap.md            # Phase-ordered learning path (entry point)
├── 01-javascript/                 # 25 files — Phase 1 anchor (highest priority)
├── 02-typescript/                 # 8 files — Phase 2
├── 03-react/                      # 11 files — Phase 3 (primary framework)
├── 04-nextjs/                     # 7 files — Phase 3 (Grab/Axon/EH stack)
├── 05-html-css/                   # 13 files — Phase 4 (often underestimated)
├── 06-browser-performance/        # 8 files — Core Web Vitals, profiling
├── 07-web-security/               # 4 files — XSS, CSRF, CSP, auth
├── 08-fe-system-design/           # 8 files — FE-specific SD (NOT backend SD)
├── 09-advanced-topics/            # ~75 files in 10 subdirs — senior-level deep map
├── 10-networking/                 # 8 files — HTTP, WS, WebRTC from FE perspective
├── 10-company-guide.md            # ⚠️ duplicate "10-" prefix; do not renumber
├── 11-accessibility/              # 7 files — WCAG, ARIA, keyboard nav
├── 12-behavioral/                 # 2 files — STAR stories
├── 13-coding-practice/            # 30 files + 5 subdirs — live-coding drills
├── 14-mock-interview/             # 3 files — full mock rounds
├── 14-frontend-testing.md         # ⚠️ duplicate "14-" prefix; do not renumber
├── 15-modern-platform/            # 4 files — Web Components, CRDTs, micro-FE, AI workflow (2026 topics)
├── 16-career-strategy/            # 1 file — FE specializations & level/comp framing (FM Handbook 2024 §1-§2)
└── mindmaps/                      # 12 files — pre-interview cram sheets
```

## WHERE TO LOOK

| Task                                                    | Location                     |
| ------------------------------------------------------- | ---------------------------- |
| Plan study order                                        | `00-study-roadmap.md`        |
| JS fundamentals (closures, this, event loop)            | `01-javascript/`             |
| TypeScript types/generics                               | `02-typescript/`             |
| React hooks/patterns/perf                               | `03-react/`                  |
| Next.js App Router/SSR/RSC                              | `04-nextjs/`                 |
| HTML semantics, CSS layout/animation                    | `05-html-css/`               |
| LCP/INP/CLS, profiling, RUM                             | `06-browser-performance/`    |
| XSS/CSRF/CSP                                            | `07-web-security/`           |
| FE system design (design Twitter UI, etc.)              | `08-fe-system-design/`       |
| Senior-level deep dives                                 | `09-advanced-topics/`        |
| HTTP/2, WebSocket, WebRTC                               | `10-networking/`             |
| WCAG, ARIA                                              | `11-accessibility/`          |
| Live-coding drills (debounce, autocomplete)             | `13-coding-practice/`        |
| Full mock interviews                                    | `14-mock-interview/`         |
| 2026 platform (Web Components, CRDTs, MFE, AI workflow) | `15-modern-platform/`        |
| FE career levels & specializations                      | `16-career-strategy/`        |
| Pre-interview cram                                      | `mindmaps/`                  |
| Per-company tactics                                     | `10-company-guide.md`        |
| FE testing (Jest, RTL, Playwright)                      | `14-frontend-testing.md`     |
| Repo-wide TOC                                           | `../00-table-of-contents.md` |

## CONVENTIONS

- **Bilingual content**: EN headings + VI explanations (`🇻🇳 **Tóm tắt**:` blocks). VI is primary audience.
- **File naming**: zero-padded `NN-kebab-case.md`. Cross-doc links use exact filenames.
- **Header metadata** (top of every topic file):
  ```
  > **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
  > **See also**: [Table of Contents](../00-table-of-contents.md)
  ```
- **Difficulty tags**: `🟢 Junior` / `🟡 Mid` / `🔴 Senior` per Q heading
- **Q&A format**: `### 🟢/🟡/🔴 Q: ...` followed by `**A:**`
- **Real-world scenario** opens each topic file (e.g. "GitHub ships 1,000+ Web Components") — narrative anchor, not optional
- **🧠 Memory Hook**: one-liner mnemonic for interview recall
- **Each subdir has `README.md`** as nav index (file table + study order)
- **Code samples**: TypeScript-preferred for type safety; JS allowed for legacy patterns

## ANTI-PATTERNS (THIS PROJECT)

- ❌ Don't drop VI text — bilingual is intentional
- ❌ Don't renumber existing files — links across docs use exact `NN-name.md`. Two intentional duplicate prefixes exist (`10-company-guide.md` vs `10-networking/`, `14-frontend-testing.md` vs `14-mock-interview/`); do not "fix" them
- ❌ Don't add a new top-level subdir without updating `00-study-roadmap.md` AND `../00-table-of-contents.md`
- ❌ Don't put backend SD in `08-fe-system-design/` — that lives in `../be-track/04-be-system-design/`
- ❌ Don't duplicate Phase 1 JS content in `09-advanced-topics/` — advanced is for SENIOR-only deep dives (V8 internals, JIT, GC, metaprogramming)
- ❌ Don't drop the "Real-World Scenario" opener — it's the narrative hook interviewers expect candidates to mirror
- ❌ Don't promote `13-coding-practice/` solutions into topic docs — practice is its own artifact

## UNIQUE STYLES

- **Real-world company stories**: Files open with named-company anecdotes (Figma 32-person canvas, GitHub 1000+ Web Components). Treat these as case-law, not flavor text.
- **Phase-based study**: Roadmap enforces JS → TS → React → CSS → Perf order. Don't skip ahead in the index.
- **Mindmaps as ASCII trees** (not images) — grep-friendly, AI-context-friendly
- **`09-advanced-topics/` is a mini-tree**: 10 subdirs, has its own README acting as a sub-roadmap. Treat as nested study track.

## NOTES

- No build/test commands — pure markdown
- When extending: add file → update local `README.md` table → update `00-study-roadmap.md` if phase ordering changes
- `15-modern-platform/` is the newest section (2026 topics) — extend here for cutting-edge interview Qs (RSC patterns, AI in browser, edge compute)
- Two top-level files share folder prefixes (`10-`, `14-`) — historical artifact; do not renumber, breaks cross-links
