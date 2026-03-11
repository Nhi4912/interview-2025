# Comprehensive Interview Knowledge Base — Epic PRD

**Bead:** epic-interview-kb  
**Created:** 2026-03-11  
**Status:** Draft

## Bead Metadata

```yaml
depends_on: []
parallel: false
conflicts_with: []
blocks: []
estimated_hours: 40
```

---

## Problem Statement

### What problem are we solving?

The interview preparation knowledge base at `docs/interview/` has critical structural gaps that undermine its goal of being a comprehensive, bilingual (EN/VI) resource for mid-senior developers targeting React frontend and Go backend roles at Zalo/VNG, Grab, Axon, Employment Hero, Microsoft, and Google.

**Current state (audit score: 7/10):**

- `shared/05-software-engineering/` is essentially empty (~100 lines of actual content in a 1343-line file that is mostly TOC stubs)
- `shared/04-security/` is incomplete (537 lines, terminates with "continue with more security content")
- `shared/02-system-design/` missing caching patterns, replication strategies, partitioning deep-dives
- `shared/03-database/` is a single monolithic file — needs splitting and expansion
- `be-track/04-be-system-design/` has only 2 files — sparse for senior-level preparation
- `fe-track/09-advanced-topics/` contains 9+ files (`16-theoretical-foundations-*`) that **duplicate** `shared/` CS theory, violating project rule #3 ("No duplicate theory between fe-track/ and be-track/ — use shared/")
- `fe-track/` is mostly English-only — inconsistent with the bilingual goal
- No AI/agents/LLM content exists anywhere — a critical gap for 2025-2026 interviews
- No company-specific interview guides exist (mentioned in PRD but never created)
- No dedicated data structures content in shared/ (scattered across tracks)

### Why now?

The user is preparing for mid-senior interviews in 2026 at top companies. Interview processes at these companies increasingly require:

1. **System design depth** — table stakes at all 6 target companies for senior roles
2. **AI/agents knowledge** — Canva requires AI tool use in interviews; Meta piloting AI-assisted rounds; all companies expecting AI literacy
3. **Go-specific patterns** — Grab and Zalo/VNG heavily test Go concurrency, channels, and microservices
4. **Bilingual preparation** — Zalo/VNG interviews may be in Vietnamese; bilingual materials accelerate learning

### Who is affected?

- **Primary user:** The developer preparing for mid-senior FE (React/TS) and BE (Go) interviews at Zalo/VNG, Grab, Axon, Employment Hero, Microsoft, Google
- **Secondary users:** Any developer using this platform for interview preparation

---

## Scope

### In-Scope

1. **Complete shared fundamentals** — Fill gaps in security, software engineering, system design, database theory, and add data structures
2. **Expand BE-track** — More system design problems, Go advanced patterns, DevOps/infrastructure basics
3. **Fix FE-track duplication** — Remove/restructure `16-theoretical-foundations-*` files that duplicate shared/
4. **Create AI/Agents knowledge section** — New `shared/06-ai-and-agents/` covering ML fundamentals through production agent patterns
5. **Create company interview guides** — Specific preparation guides for all 6 target companies
6. **Standardize format** — Bilingual support, difficulty markers, cross-references across all files
7. **Add interview process overview** — Market research on current interview processes and trends

### Out-of-Scope

- MDX interactive content creation (content/ directory) — separate effort
- Next.js application code changes
- Coding challenge repositories or LeetCode solution banks
- Video/audio content creation
- Content in languages other than English and Vietnamese

---

## Proposed Solution

### Overview

Systematically complete the `docs/interview/` knowledge base through 7 workstreams: (1) complete shared CS fundamentals, (2) expand backend track, (3) fix frontend track duplication and standardize format, (4) create a new AI/agents knowledge section, (5) create company-specific interview guides, (6) add an interview market overview document, and (7) cross-reference and index all content. All new content follows the bilingual Q&A format exemplified by `be-track/` (English headings + Vietnamese explanations, difficulty markers `[Junior]`/`[Mid]`/`[Senior]`).

### Content Format Standard

All new files follow this template:

```markdown
# [Topic Title]

> **Difficulty:** Junior | Mid | Senior
> **Track:** shared | fe-track | be-track
> **Prerequisites:** [links to prerequisite files]
> **Estimated Reading Time:** X minutes

## Overview / Tổng Quan

[English overview paragraph]

[Vietnamese overview paragraph]

## [Section] / [Vietnamese Section Title]

### [Question/Topic] [Difficulty Tag]

**English explanation with key concepts.**

**Vietnamese explanation (Giải thích tiếng Việt).**

[Code examples where appropriate]

---

## Interview Questions / Câu Hỏi Phỏng Vấn

### Q1: [Question] [Junior]

...

### Q2: [Question] [Mid]

...

### Q3: [Question] [Senior]

...
```

---

## Requirements

### Functional Requirements

#### FR1: Complete Shared Fundamentals

All shared CS theory must live in `docs/interview/shared/` as the single source of truth, with no duplication in track-specific directories.

**Scenarios:**

- **WHEN** a developer reads shared/04-security/ **THEN** they find complete coverage of cryptography, auth protocols (JWT, OAuth, OIDC), TLS/SSL, OWASP Top 10, and common attack vectors
- **WHEN** a developer reads shared/05-software-engineering/ **THEN** they find SOLID principles, GoF design patterns, architectural styles, SDLC, testing strategies, and CI/CD concepts
- **WHEN** a developer searches for data structures theory **THEN** they find a dedicated file in shared/01-cs-fundamentals/ covering arrays, linked lists, trees, graphs, hash tables, heaps, tries, and their complexities

#### FR2: Expand Backend Track

Backend content must cover the depth required for senior Go backend interviews at Grab and Zalo/VNG.

**Scenarios:**

- **WHEN** a developer reads be-track/04-be-system-design/ **THEN** they find 8+ classic system design problems with full solutions (URL shortener, chat system, notification system, rate limiter, search engine, news feed, payment system, ride-matching)
- **WHEN** a developer reads be-track/01-golang/ **THEN** they find advanced Go patterns (context propagation, error handling idioms, testing patterns, performance profiling)

#### FR3: Fix Frontend Track Duplication

Frontend-specific content must not duplicate shared/ theory. FE files focus on implementation in JS/TS/React, referencing shared/ for theory.

**Scenarios:**

- **WHEN** a developer sees `16-theoretical-foundations-*` files in fe-track/09-advanced-topics/ **THEN** those files either no longer exist (replaced by cross-references to shared/) or contain only FE-specific implementation examples with explicit links to shared/ theory
- **WHEN** a developer reads any fe-track file **THEN** they find bilingual content (EN headings + VI explanations) and difficulty markers

#### FR4: AI/Agents Knowledge Section

A new section covering AI fundamentals through production agent patterns must exist for 2025-2026 interview relevance.

**Scenarios:**

- **WHEN** a developer reads shared/06-ai-and-agents/ **THEN** they find: ML fundamentals, transformer architecture, LLM landscape, embeddings/vector DBs, RAG patterns, agent design patterns, MCP, prompt engineering, and AI system design interview questions
- **WHEN** a developer prepares for an AI-related interview question **THEN** they can find practical patterns (RAG chatbot, semantic search, agent pipeline) with architecture diagrams and trade-off analysis

#### FR5: Company Interview Guides

Each target company has a dedicated preparation guide covering process, technical focus, culture fit, and preparation strategy.

**Scenarios:**

- **WHEN** a developer targets Grab **THEN** they find a guide covering: 4-6 round process, Go-heavy backend questions, SEA-scale system design, and specific preparation advice
- **WHEN** a developer targets Google **THEN** they find a guide covering: 5-7 round process, Hard LeetCode focus, system design for L5+, no AI tools policy

### Non-Functional Requirements

- **Format consistency:** All files use bilingual format (EN headings + VI explanations)
- **Difficulty tagging:** All Q&A items tagged `[Junior]`, `[Mid]`, or `[Senior]`
- **Cross-references:** Theory files link to implementation files and vice versa
- **File size:** Each file stays under 2000 lines; split into multiple files if exceeding
- **No code duplication:** Go examples only in be-track/, JS/TS/React examples only in fe-track/, theory in shared/

---

## Success Criteria

- [ ] `shared/05-software-engineering/` contains 3+ substantive files covering SOLID, design patterns, architecture styles, and SDLC (each 500+ lines)
  - Verify: `find docs/interview/shared/05-software-engineering/ -name "*.md" | wc -l` returns >= 3, `wc -l docs/interview/shared/05-software-engineering/*.md` shows each file 500+ lines
- [ ] `shared/04-security/` is complete with 2+ files totaling 2000+ lines covering cryptography, auth, OWASP, TLS
  - Verify: `wc -l docs/interview/shared/04-security/*.md` totals >= 2000
- [ ] `shared/06-ai-and-agents/` exists with 4+ files covering ML basics, LLMs, agents, and RAG
  - Verify: `find docs/interview/shared/06-ai-and-agents/ -name "*.md" | wc -l` returns >= 4
- [ ] `be-track/04-be-system-design/` has 4+ files covering 8+ system design problems
  - Verify: `find docs/interview/be-track/04-be-system-design/ -name "*.md" | wc -l` returns >= 4
- [ ] FE-track `16-theoretical-foundations-*` files are removed or converted to cross-reference stubs
  - Verify: `wc -l docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-*.md 2>/dev/null` shows each file < 50 lines (stub) or files don't exist
- [ ] All new files contain Vietnamese content (not English-only)
  - Verify: `grep -rL "Việt\|tiếng Việt\|Giải thích\|Tổng Quan\|Ví dụ\|Câu Hỏi" docs/interview/shared/06-ai-and-agents/` returns empty (all files contain Vietnamese)
- [ ] Company interview guides exist for all 6 target companies
  - Verify: `ls docs/interview/shared/07-company-guides/*.md | wc -l` returns >= 6
- [ ] Interview market overview document exists
  - Verify: `test -f docs/interview/00-interview-market-overview.md && wc -l docs/interview/00-interview-market-overview.md` shows 500+ lines
- [ ] All new files have difficulty markers
  - Verify: `grep -rL "\[Junior\]\|\[Mid\]\|\[Senior\]" docs/interview/shared/06-ai-and-agents/ docs/interview/shared/07-company-guides/` returns empty

---

## Technical Context

### Existing Patterns

- **Bilingual Q&A format:** `docs/interview/be-track/01-golang/01-language-fundamentals.md` — exemplary format with English questions, Vietnamese answers, difficulty tags, ~75% theory / 25% code
- **Deep theory format:** `docs/interview/shared/01-cs-fundamentals/networking-theory.md` — 1198 lines, bilingual, comprehensive coverage with interview Q&A section
- **System design format:** `docs/interview/be-track/04-be-system-design/02-classic-problems.md` — 1932 lines, step-by-step problem solving with estimation, architecture, and deep dives
- **Study roadmap format:** `docs/interview/be-track/00-study-roadmap.md` — overview of track with learning path recommendations

### Key Files

- `docs/interview/00-table-of-contents.md` — Master table of contents (needs updating after new content)
- `docs/interview/shared/04-security/01-security-fundamentals.md` — Incomplete file to be expanded
- `docs/interview/shared/05-software-engineering/software-engineering-theory.md` — Stub file to be replaced
- `docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-*.md` — 9 files to be removed/replaced with stubs

### Affected Files

Files this bead will create or modify:

```yaml
files:
  # New shared fundamentals
  - docs/interview/shared/01-cs-fundamentals/data-structures-theory.md # New: comprehensive DS coverage
  - docs/interview/shared/02-system-design/caching-patterns.md # New: cache strategies, invalidation
  - docs/interview/shared/02-system-design/replication-partitioning.md # New: replication, sharding, consistent hashing
  - docs/interview/shared/03-database/02-indexing-and-optimization.md # New: split from monolithic file
  - docs/interview/shared/03-database/03-nosql-and-newsql.md # New: NoSQL theory, comparison
  - docs/interview/shared/04-security/01-security-fundamentals.md # Expand: complete the incomplete file
  - docs/interview/shared/04-security/02-cryptography-and-protocols.md # New: crypto, TLS, PKI
  - docs/interview/shared/04-security/03-web-security-owasp.md # New: OWASP Top 10, attack vectors
  - docs/interview/shared/05-software-engineering/01-solid-and-design-patterns.md # New: replace stub
  - docs/interview/shared/05-software-engineering/02-architecture-styles.md # New: monolith, microservices, serverless, event-driven
  - docs/interview/shared/05-software-engineering/03-sdlc-and-practices.md # New: Agile, testing, CI/CD, code review

  # New AI/Agents section
  - docs/interview/shared/06-ai-and-agents/01-ml-fundamentals.md # New: ML paradigms, neural nets, training
  - docs/interview/shared/06-ai-and-agents/02-llm-and-transformers.md # New: transformer architecture, attention, LLM landscape
  - docs/interview/shared/06-ai-and-agents/03-agent-patterns.md # New: ReAct, tool use, multi-agent, Anthropic patterns
  - docs/interview/shared/06-ai-and-agents/04-rag-and-embeddings.md # New: embeddings, vector DBs, RAG pipeline, hybrid search
  - docs/interview/shared/06-ai-and-agents/05-ai-engineering-practice.md # New: prompt engineering, MCP, evaluation, production patterns
  - docs/interview/shared/06-ai-and-agents/06-ai-system-design.md # New: AI system design interview questions (semantic search, chatbot, agent pipeline)

  # New company guides
  - docs/interview/shared/07-company-guides/01-google.md # New
  - docs/interview/shared/07-company-guides/02-microsoft.md # New
  - docs/interview/shared/07-company-guides/03-grab.md # New
  - docs/interview/shared/07-company-guides/04-axon.md # New
  - docs/interview/shared/07-company-guides/05-employment-hero.md # New
  - docs/interview/shared/07-company-guides/06-zalo-vng.md # New

  # Market overview
  - docs/interview/00-interview-market-overview.md # New: interview trends 2025-2026

  # BE-track expansion
  - docs/interview/be-track/04-be-system-design/03-advanced-problems.md # New: additional system design problems
  - docs/interview/be-track/04-be-system-design/04-distributed-patterns.md # New: saga, circuit breaker, CQRS
  - docs/interview/be-track/01-golang/08-advanced-patterns.md # New: context, error idioms, profiling
  - docs/interview/be-track/06-devops-infrastructure.md # New: Docker, K8s basics, CI/CD, monitoring (06- to avoid collision with existing 05-company-guide.md)

  # FE-track deduplication (modify existing)
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-01-computer-science-fundamentals.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-02-computational-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-03-type-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-04-category-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-05-logic-proof-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-06-formal-verification.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-07-distributed-systems-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-08-quantum-computing-theory.md # Replace with cross-reference stub
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-09-complexity-theory-advanced.md # Replace with cross-reference stub

  # Table of contents update
  - docs/interview/00-table-of-contents.md # Update with new sections
```

---

## Risks & Mitigations

| Risk                                                         | Likelihood | Impact | Mitigation                                                                                             |
| ------------------------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------------------------------ |
| Content becomes stale (AI landscape changes rapidly)         | High       | Medium | Date-stamp AI content; note that AI section covers 2025-2026 landscape and should be reviewed annually |
| Scope creep — each topic could become a book                 | High       | High   | Enforce 2000-line file limit; focus on interview-relevant depth, not textbook completeness             |
| Bilingual quality — Vietnamese translations may be imprecise | Medium     | Medium | Use consistent bilingual format from be-track/ as template; keep Vietnamese concise and natural        |
| FE-track deduplication breaks existing bookmarks/links       | Low        | Low    | Replace files with stub cross-references rather than deleting, preserving the filename                 |
| Inconsistent difficulty tagging across files                 | Medium     | Low    | Define clear criteria: Junior = 0-2yr, Mid = 2-5yr, Senior = 5+yr with specific topic expectations     |

---

## Open Questions

| Question                                                                                               | Owner | Due Date       | Status                          |
| ------------------------------------------------------------------------------------------------------ | ----- | -------------- | ------------------------------- |
| Should `16-theoretical-foundations-*` files be deleted entirely or converted to cross-reference stubs? | User  | Before Task 6  | Open — PRD assumes stubs        |
| Should shared/03-database/ be split into multiple files or kept as one expanded file?                  | User  | Before Task 3  | Open — PRD assumes split        |
| Should company guides include salary ranges and negotiation tips?                                      | User  | Before Task 11 | Open — PRD excludes salary info |

---

## Tasks

### Task 1: Complete Security Fundamentals [shared-content]

`docs/interview/shared/04-security/` contains comprehensive security theory: expanded `01-security-fundamentals.md` (complete the incomplete file), plus new `02-cryptography-and-protocols.md` (symmetric/asymmetric encryption, hashing, TLS/SSL handshake, PKI, digital signatures) and `03-web-security-owasp.md` (OWASP Top 10 2021, XSS, CSRF, SQL injection, SSRF, with interview Q&A).

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/04-security/01-security-fundamentals.md
  - docs/interview/shared/04-security/02-cryptography-and-protocols.md
  - docs/interview/shared/04-security/03-web-security-owasp.md
```

**Verification:**

- `wc -l docs/interview/shared/04-security/*.md` shows 3 files totaling 2000+ lines
- `grep -c "Việt\|tiếng Việt\|Giải thích\|Tổng Quan" docs/interview/shared/04-security/*.md` shows Vietnamese content in each file
- `grep -c "\[Junior\]\|\[Mid\]\|\[Senior\]" docs/interview/shared/04-security/*.md` shows difficulty markers in each file

### Task 2: Create Software Engineering Fundamentals [shared-content]

`docs/interview/shared/05-software-engineering/` contains 3 substantive files replacing the current stub: `01-solid-and-design-patterns.md` (SOLID principles with examples, GoF patterns — creational, structural, behavioral — with interview Q&A), `02-architecture-styles.md` (monolith vs microservices vs serverless, event-driven architecture, layered architecture, hexagonal architecture, DDD basics), and `03-sdlc-and-practices.md` (Agile/Scrum/Kanban, testing pyramid, CI/CD, code review, technical debt management). The existing `software-engineering-theory.md` stub file is deleted.

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/05-software-engineering/software-engineering-theory.md
  - docs/interview/shared/05-software-engineering/01-solid-and-design-patterns.md
  - docs/interview/shared/05-software-engineering/02-architecture-styles.md
  - docs/interview/shared/05-software-engineering/03-sdlc-and-practices.md
```

**Verification:**

- `find docs/interview/shared/05-software-engineering/ -name "*.md" -exec wc -l {} +` shows 3+ substantive files each 500+ lines
- `grep -c "SOLID\|Design Pattern\|Creational\|Structural\|Behavioral" docs/interview/shared/05-software-engineering/01-solid-and-design-patterns.md` returns > 0
- `grep -c "\[Junior\]\|\[Mid\]\|\[Senior\]" docs/interview/shared/05-software-engineering/*.md` shows difficulty markers

### Task 3: Expand Shared System Design and Database Theory [shared-content]

`docs/interview/shared/02-system-design/` has new files `caching-patterns.md` (cache-aside, write-through, write-behind, cache invalidation strategies, CDN caching, distributed cache patterns) and `replication-partitioning.md` (leader-follower replication, multi-leader, leaderless, horizontal/vertical partitioning, consistent hashing, sharding strategies). `docs/interview/shared/03-database/` has new files `02-indexing-and-optimization.md` (B-tree, B+tree, hash index, bitmap, composite, covering indexes, query optimization, EXPLAIN plans) and `03-nosql-and-newsql.md` (document stores, key-value, column-family, graph databases, NewSQL, CAP theorem applied, comparison matrix).

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/02-system-design/caching-patterns.md
  - docs/interview/shared/02-system-design/replication-partitioning.md
  - docs/interview/shared/03-database/02-indexing-and-optimization.md
  - docs/interview/shared/03-database/03-nosql-and-newsql.md
```

**Verification:**

- `ls docs/interview/shared/02-system-design/*.md | wc -l` returns >= 4
- `ls docs/interview/shared/03-database/*.md | wc -l` returns >= 3
- `wc -l docs/interview/shared/02-system-design/caching-patterns.md docs/interview/shared/02-system-design/replication-partitioning.md` each 600+ lines
- `grep -c "\[Junior\]\|\[Mid\]\|\[Senior\]" docs/interview/shared/02-system-design/caching-patterns.md` returns > 0

### Task 4: Create Data Structures Theory [shared-content]

`docs/interview/shared/01-cs-fundamentals/data-structures-theory.md` exists as a comprehensive reference covering: arrays, linked lists (singly/doubly/circular), stacks, queues (priority, deque), hash tables (collision resolution, load factor), trees (BST, AVL, Red-Black, B-tree, trie), heaps (min/max, Fibonacci), graphs (representations, traversals), and advanced structures (skip list, bloom filter, union-find). Each structure includes: definition, operations with complexity, use cases, and interview Q&A.

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/01-cs-fundamentals/data-structures-theory.md
```

**Verification:**

- `wc -l docs/interview/shared/01-cs-fundamentals/data-structures-theory.md` shows 800+ lines
- `grep -c "Array\|LinkedList\|Tree\|Graph\|Hash\|Heap\|Stack\|Queue\|Trie" docs/interview/shared/01-cs-fundamentals/data-structures-theory.md` returns >= 9
- `grep -c "\[Junior\]\|\[Mid\]\|\[Senior\]" docs/interview/shared/01-cs-fundamentals/data-structures-theory.md` returns >= 5

### Task 5: Create AI and Agents Knowledge Section [shared-content]

`docs/interview/shared/06-ai-and-agents/` directory exists with 6 files covering the complete AI knowledge required for 2025-2026 interviews: `01-ml-fundamentals.md` (supervised/unsupervised/RL, neural networks, backpropagation, training concepts, evaluation metrics), `02-llm-and-transformers.md` (transformer architecture, attention mechanism, positional encoding, LLM landscape — GPT-4/Claude/Gemini/Llama, scaling laws, MoE, KV cache, tokenization), `03-agent-patterns.md` (Anthropic's 5 patterns, ReAct, CoT, tool use, multi-agent systems, frameworks — LangChain/LangGraph/CrewAI/AutoGen), `04-rag-and-embeddings.md` (embeddings, vector databases, ANN algorithms, RAG pipeline, hybrid search, reranking, HyDE, evaluation with RAGAS), `05-ai-engineering-practice.md` (prompt engineering, MCP protocol, fine-tuning vs RAG decision framework, LLMOps, AI coding assistants, AI security — prompt injection, guardrails), and `06-ai-system-design.md` (semantic search architecture, RAG chatbot, agent pipeline, content moderation, recommendation system with embeddings — complete with architecture diagrams and interview Q&A).

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/06-ai-and-agents/01-ml-fundamentals.md
  - docs/interview/shared/06-ai-and-agents/02-llm-and-transformers.md
  - docs/interview/shared/06-ai-and-agents/03-agent-patterns.md
  - docs/interview/shared/06-ai-and-agents/04-rag-and-embeddings.md
  - docs/interview/shared/06-ai-and-agents/05-ai-engineering-practice.md
  - docs/interview/shared/06-ai-and-agents/06-ai-system-design.md
```

**Verification:**

- `find docs/interview/shared/06-ai-and-agents/ -name "*.md" | wc -l` returns 6
- `wc -l docs/interview/shared/06-ai-and-agents/*.md` shows each file 600+ lines
- `grep -c "Transformer\|Attention\|LLM\|RAG\|Agent\|MCP\|Embedding" docs/interview/shared/06-ai-and-agents/*.md` returns > 0 for each file
- `grep -c "Việt\|tiếng Việt\|Giải thích" docs/interview/shared/06-ai-and-agents/*.md` shows Vietnamese content in each file

### Task 6: Deduplicate FE-Track Theoretical Foundations [fe-track-fix]

All 9 `docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-*.md` files are converted to cross-reference stubs (< 30 lines each) pointing to the corresponding `shared/` files. Each stub retains the original filename for link stability and contains: a title, a 1-sentence description, and explicit links to the shared/ source files where the full theory lives.

**Metadata:**

```yaml
depends_on: ["Task 1", "Task 2", "Task 3", "Task 4"]
parallel: false
conflicts_with: []
files:
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-01-computer-science-fundamentals.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-02-computational-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-03-type-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-04-category-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-05-logic-proof-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-06-formal-verification.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-07-distributed-systems-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-08-quantum-computing-theory.md
  - docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-09-complexity-theory-advanced.md
```

**Verification:**

- `wc -l docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-*.md` shows each file < 50 lines
- `grep -c "shared/" docs/interview/fe-track/09-advanced-topics/16-theoretical-foundations-*.md` returns > 0 for each file (cross-references present)

### Task 7: Expand BE-Track System Design [be-track-content]

`docs/interview/be-track/04-be-system-design/` has 2 new files: `03-advanced-problems.md` (6+ additional system design problems: notification system, rate limiter, payment system, ride-matching/real-time location, news feed ranking, distributed file storage — each with requirements, estimation, architecture, deep dive, trade-offs) and `04-distributed-patterns.md` (saga pattern, circuit breaker, CQRS, event sourcing, service mesh, distributed tracing, idempotency patterns — with Go implementation sketches where appropriate).

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/be-track/04-be-system-design/03-advanced-problems.md
  - docs/interview/be-track/04-be-system-design/04-distributed-patterns.md
```

**Verification:**

- `find docs/interview/be-track/04-be-system-design/ -name "*.md" | wc -l` returns >= 4
- `wc -l docs/interview/be-track/04-be-system-design/03-advanced-problems.md` shows 1500+ lines
- `grep -c "notification\|rate limit\|payment\|ride\|news feed\|file storage" docs/interview/be-track/04-be-system-design/03-advanced-problems.md` returns >= 5

### Task 8: Add Go Advanced Patterns and DevOps Basics [be-track-content]

`docs/interview/be-track/01-golang/08-advanced-patterns.md` exists covering: context propagation best practices, advanced error handling (sentinel errors, error wrapping, custom error types), table-driven tests, benchmark testing, pprof profiling, Go module management, and build optimization. `docs/interview/be-track/06-devops-infrastructure.md` exists covering: Docker fundamentals (Dockerfile, multi-stage builds), Kubernetes basics (pods, deployments, services), CI/CD pipelines (GitHub Actions, GitLab CI), monitoring (Prometheus, Grafana), logging (structured logging, ELK), and infrastructure-as-code concepts.

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/be-track/01-golang/08-advanced-patterns.md
  - docs/interview/be-track/06-devops-infrastructure.md
```

**Verification:**

- `wc -l docs/interview/be-track/01-golang/08-advanced-patterns.md` shows 700+ lines
- `wc -l docs/interview/be-track/06-devops-infrastructure.md` shows 800+ lines
- `grep -c "context\|error\|pprof\|benchmark" docs/interview/be-track/01-golang/08-advanced-patterns.md` returns >= 4
- `grep -c "Docker\|Kubernetes\|CI/CD\|Prometheus" docs/interview/be-track/06-devops-infrastructure.md` returns >= 4

### Task 9: Create Interview Market Overview [overview-content]

`docs/interview/00-interview-market-overview.md` exists as a comprehensive document covering: current interview process trends (2025-2026), comparison of interview processes at all 6 target companies (round count, types, difficulty, unique aspects), the shift toward AI-assisted interviews (Canva, Meta piloting), live coding vs take-home trends by company type, system design as table stakes at senior level, priority matrix (coding/system design/behavioral weight by company), and preparation strategy recommendations.

**Metadata:**

```yaml
depends_on: []
parallel: true
conflicts_with: []
files:
  - docs/interview/00-interview-market-overview.md
```

**Verification:**

- `wc -l docs/interview/00-interview-market-overview.md` shows 800+ lines
- `grep -c "Google\|Microsoft\|Grab\|Axon\|Employment Hero\|Zalo\|VNG" docs/interview/00-interview-market-overview.md` returns >= 6
- `grep -c "2025\|2026" docs/interview/00-interview-market-overview.md` returns >= 5

### Task 10: Create Company Interview Guides [company-guides]

`docs/interview/shared/07-company-guides/` directory exists with 6 files, one per target company: `01-google.md`, `02-microsoft.md`, `03-grab.md`, `04-axon.md`, `05-employment-hero.md`, `06-zalo-vng.md`. Each guide covers: company overview and engineering culture, interview process (rounds, types, duration), technical focus areas (FE and BE), system design expectations, behavioral/cultural fit criteria, specific preparation advice, common interview questions, recommended study order referencing other docs/interview/ files, and tips from verified candidate reports.

**Metadata:**

```yaml
depends_on: ["Task 9"]
parallel: true
conflicts_with: []
files:
  - docs/interview/shared/07-company-guides/01-google.md
  - docs/interview/shared/07-company-guides/02-microsoft.md
  - docs/interview/shared/07-company-guides/03-grab.md
  - docs/interview/shared/07-company-guides/04-axon.md
  - docs/interview/shared/07-company-guides/05-employment-hero.md
  - docs/interview/shared/07-company-guides/06-zalo-vng.md
```

**Verification:**

- `find docs/interview/shared/07-company-guides/ -name "*.md" | wc -l` returns 6
- `wc -l docs/interview/shared/07-company-guides/*.md` shows each file 400+ lines
- `grep -c "Interview Process\|Technical Focus\|System Design\|Preparation" docs/interview/shared/07-company-guides/01-google.md` returns >= 4
- `grep -c "docs/interview/" docs/interview/shared/07-company-guides/*.md` returns > 0 for each (cross-references to other content)

### Task 11: Update Table of Contents and Cross-References [documentation]

`docs/interview/00-table-of-contents.md` is updated to include all new sections (06-ai-and-agents, 07-company-guides, expanded system design, expanded security, expanded software engineering, expanded BE system design, interview market overview). Cross-reference links are added to existing files where they reference topics now covered in new files. Study roadmaps (`fe-track/00-study-roadmap.md`, `be-track/00-study-roadmap.md`) are updated to reference new content.

**Metadata:**

```yaml
depends_on:
  [
    "Task 1",
    "Task 2",
    "Task 3",
    "Task 4",
    "Task 5",
    "Task 6",
    "Task 7",
    "Task 8",
    "Task 9",
    "Task 10",
  ]
parallel: false
conflicts_with: []
files:
  - docs/interview/00-table-of-contents.md
  - docs/interview/fe-track/00-study-roadmap.md
  - docs/interview/be-track/00-study-roadmap.md
```

**Verification:**

- `grep -c "06-ai-and-agents\|07-company-guides\|market-overview" docs/interview/00-table-of-contents.md` returns >= 3
- `grep -c "shared/06-ai\|shared/07-company\|05-software-engineering" docs/interview/fe-track/00-study-roadmap.md` returns >= 2
- `grep -c "shared/06-ai\|shared/07-company\|06-devops" docs/interview/be-track/00-study-roadmap.md` returns >= 2

---

## Dependency Legend

| Field            | Purpose                                           | Example                                      |
| ---------------- | ------------------------------------------------- | -------------------------------------------- |
| `depends_on`     | Must complete before this task starts             | `["Task 1", "Task 2"]`                       |
| `parallel`       | Can run concurrently with other parallel tasks    | `true` / `false`                             |
| `conflicts_with` | Cannot run in parallel (same files)               | `["Task 6"]`                                 |
| `files`          | Files this task modifies (for conflict detection) | `["docs/interview/shared/04-security/*.md"]` |

---

## Execution Waves

```
Wave 1 (Parallel — no dependencies):
  Task 1:  Complete Security Fundamentals
  Task 2:  Create Software Engineering Fundamentals
  Task 3:  Expand System Design & Database Theory
  Task 4:  Create Data Structures Theory
  Task 5:  Create AI/Agents Knowledge Section
  Task 7:  Expand BE-Track System Design
  Task 8:  Add Go Advanced Patterns & DevOps
  Task 9:  Create Interview Market Overview

Wave 2 (Depends on Wave 1):
  Task 6:  Deduplicate FE-Track Theoretical Foundations (depends on Tasks 1-4)
  Task 10: Create Company Interview Guides (depends on Task 9)

Wave 3 (Depends on all):
  Task 11: Update Table of Contents & Cross-References (depends on Tasks 1-10)
```

---

## Notes

### Content Research Sources (verified)

- **Interview processes:** interviewing.io (Google, Microsoft guides), Canva Engineering Blog (AI interviews), Tech Interview Handbook, Vietnamese engineering forums (ITViec, TopDev)
- **AI/Agents:** Anthropic "Building Effective Agents" (Dec 2024), modelcontextprotocol.io, Lilian Weng "LLM Powered Autonomous Agents", Andrew Ng agentic patterns, LangChain/CrewAI/AutoGen official docs, Pinecone RAG guides
- **Existing content quality:** Internal audit found 290k+ words, 7/10 quality score, with BE-track as exemplary format

### File Size Guidelines

- Aim for 600-1500 lines per file (optimal for reading and maintenance)
- If a topic exceeds 2000 lines, split into logical sub-files
- Keep code examples to 10-20% of content for shared/ theory files
- BE-track: ~75% theory / 25% Go code examples
- FE-track: Can include more JS/TS/React code examples

### Bilingual Format

- English headings and key terms
- Vietnamese explanations and detailed answers
- Code comments in English (universal)
- Use Vietnamese naturally, not machine-translated
