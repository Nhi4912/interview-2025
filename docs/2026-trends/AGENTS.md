# 2026-TRENDS — SENIOR+ HOT TOPICS

**Generated:** 2026-05-05 | 13 files, ~9.8k lines, flat structure

## OVERVIEW

Curated **2026 senior/staff-level interview topics** missing from `be-track/`, `fe-track/`, `shared/`. Selected by signal: appears in real Mid+/Senior+ rounds at FAANG-tier and serious VN startups (2025 Q4 — 2026 Q2). Pedagogical depth, not survey.

Three pedagogical tracks: **A=Fundamentals**, **B=Applications**, **C=Advanced Patterns**. Mnemonics encode order (see `README.md`).

## STRUCTURE

```
2026-trends/
├── README.md                                           # GROUPED INDEX — A/B/C tracks + mnemonics
├── 01-react-server-components.md                       # A1
├── 02-edge-computing-and-cdn.md                        # A2
├── 03-llm-system-design.md                             # B1
├── 04-vector-databases-and-rag.md                      # B2
├── 05-rust-for-backend.md                              # A3
├── 06-webassembly-frontend.md                          # A4
├── 07-design-systems-tokens.md                         # C1
├── 08-observability-otel.md                            # B3
├── 09-zero-trust-security.md                           # C2
├── 10-event-driven-cdc.md                              # B4
├── 11-platform-engineering-idp.md                      # C3
└── 12-ai-coding-agents-workflow.md                     # B5
```

## WHERE TO LOOK

| You face                                              | Read                                                        |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| "Design ChatGPT-like product" / "Build RAG over docs" | `03-llm-system-design.md`, `04-vector-databases-and-rag.md` |
| Next.js 14+/15 App Router architecture round          | `01-react-server-components.md`                             |
| "Why Cloudflare Workers / why edge?"                  | `02-edge-computing-and-cdn.md`                              |
| Backend role asking "would you use Rust here?"        | `05-rust-for-backend.md`                                    |
| "How would you ship Photoshop to web?"                | `06-webassembly-frontend.md`                                |
| "How does your design system scale?"                  | `07-design-systems-tokens.md`                               |
| Senior SRE / production debugging round               | `08-observability-otel.md`, `10-event-driven-cdc.md`        |
| Security architect / staff security                   | `09-zero-trust-security.md`                                 |
| "Tell me about your developer platform"               | `11-platform-engineering-idp.md`                            |
| "How do you use Cursor/Claude/Copilot at work?"       | `12-ai-coding-agents-workflow.md`                           |

## CONVENTIONS (DIVERGENT FROM PARENT)

- **Flat numbering** — `01-12.md` is publication order, NOT difficulty order. Use `README.md`'s A/B/C grouping for study sequence.
- **All files target Mid → Senior** — no 🟢 Junior content here by design.
- **Heavier on architecture diagrams + tradeoff tables** than `shared/` files (~750 avg lines vs ~400).
- **Real-incident references** (e.g. Cloudflare 2023, OpenAI 2024 outages) — keep updated when newer reference incidents emerge.
- Each file ends with a "What to say in interview" 30-second summary block.

## ANTI-PATTERNS

- ❌ Don't merge content into `shared/06-ai-and-agents/` — `2026-trends/` is intentionally a "this year's hot topics" silo. Migrate OUT only when a topic is clearly evergreen (e.g., RSC after 2027).
- ❌ Don't add Junior-level intros — link out to `shared/` or track-specific files instead.
- ❌ Don't renumber existing 01-12 — `README.md` mnemonics depend on it.
- ❌ Don't add a 13th file without updating mnemonic in `README.md`.

## UNIQUE STYLES

- **Mnemonic system** — `README.md` encodes A1-A4, B1-B5, C1-C3 with memorable phrases for senior-round recall under pressure.
- **"Year-stamp" intro** — every file opens with "As of late 2025/early 2026..." anchoring volatility.
- **Tradeoff matrices** dominate — fewer code snippets than be-track/fe-track files; more decision tables.

## NOTES

- Parent repo: see `../AGENTS.md` for repo-wide conventions (bilingual EN/VI, NN-name.md).
- Cross-linked heavily from `shared/` and `be-track/`/`fe-track/` senior-tier sections — preserve filenames.
