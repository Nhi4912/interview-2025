# Interview Preparation Knowledge Base / Kho Tài Liệu Phỏng Vấn

> Bilingual (EN/VI) interview preparation for **Frontend (JS/TS/React)** and **Backend (Go)** developers targeting **L5 Senior Engineer** at top tech companies: Google, Microsoft, Grab, Axon, Employment Hero, Zalo/VNG.

---

## Quick Start / Bắt Đầu Nhanh

1. [Quick Start Guide](docs/00-quick-start-guide.md) — Where to begin based on your level
2. [Level Guide](docs/00-level-guide.md) — File-to-level mapping (L3 → L4 → L5)
3. [L5 Self-Assessment](docs/shared/08-l5-competencies/00-l5-self-assessment.md) — Score yourself across 10 competencies
4. [6-Month Study Plan](docs/00-6-month-study-plan.md) — Structured learning roadmap
5. [Table of Contents](docs/00-table-of-contents.md) — Full index of all material

---

## Structure / Cấu Trúc

```
docs/
├── 00-table-of-contents.md      ← Full index
├── 00-quick-start-guide.md      ← Start here / Bắt đầu từ đây
├── 00-level-guide.md            ← Progressive: L3 → L4 → L5
├── 00-6-month-study-plan.md
├── quick-reference-cheat-sheet.md
│
├── shared/                       ← Language-agnostic theory (both tracks)
│   ├── 01-cs-fundamentals/       Data structures, algorithms, OS, networking
│   ├── 02-system-design/         CAP, caching, replication, consensus
│   ├── 03-database/              Relational, indexing, NoSQL
│   ├── 04-security/              CIA, crypto, OWASP, auth patterns
│   ├── 05-software-engineering/  SOLID, architecture, SDLC, testing
│   ├── 06-ai-and-agents/         ML basics, LLMs, RAG, AI system design
│   ├── 07-company-guides/        Google, Microsoft, Grab, Axon, EH, Zalo
│   ├── 08-l5-competencies/       ★ L5 self-assessment, scope, problem-solving
│   └── 09-behavioral/            ★ STAR method, leadership, storytelling
│
├── fe-track/                     ← Frontend track (JS/TS/React)
│   ├── 00-study-roadmap.md
│   ├── 01-javascript/            Variables, closures, prototypes, async, ES6+
│   ├── 02-typescript/            Type system, generics, advanced patterns
│   ├── 03-react/                 Hooks, patterns, state, performance
│   ├── 04-nextjs/                App Router, RSC, data fetching
│   ├── 05-html-css/              Semantic HTML, Flexbox/Grid, architecture
│   ├── 06-browser-performance/   Core Web Vitals, testing strategy, observability
│   ├── 07-web-security/          XSS, CSRF, auth patterns
│   ├── 08-fe-system-design/      Architecture, micro-frontends, quality & observability
│   ├── 09-advanced-topics/       ★ Organized: algorithms, browser-internals, expert-topics
│   ├── 10-networking/            HTTP, REST, GraphQL, WebSockets
│   ├── 11-accessibility/         WCAG, ARIA, keyboard, screen readers
│   ├── 12-behavioral/            FE-specific behavioral (links to shared/)
│   ├── 13-coding-practice/       JS challenges, React components, DOM, algo
│   └── mindmaps/                 Visual review maps per topic
│
├── be-track/                     ← Backend track (Go)
│   ├── 00-study-roadmap.md
│   ├── 01-golang/                Language fundamentals, concurrency, memory
│   ├── 02-backend-knowledge/     API design, microservices, distributed systems
│   ├── 03-database-advanced/     SQL, indexing, Redis, caching patterns
│   ├── 04-be-system-design/      Framework, classic problems, distributed patterns
│   └── 06-devops-infrastructure.md  Docker, K8s, CI/CD
│
└── leetcode/                     ← Algorithm practice by category
    ├── 00-patterns-index.md      ★ Pattern-based problem grouping
    ├── array/, string/, tree-graph/, dp/, backtracking/
    ├── linked-list/, design/, sorting-searching/, math/, others/
    └── index.md
```

> ★ = New in latest update

---

## L5 Senior Engineer Competency Framework

This KB is structured around the **10 competencies** that L5 interviews evaluate:

| # | Competency | Weight | Coverage |
|---|-----------|--------|----------|
| 1 | Scope & Impact | 15pts | [Scope & Impact](docs/shared/08-l5-competencies/01-scope-and-impact.md) |
| 2 | Problem-Solving | 15pts | [Problem-Solving Frameworks](docs/shared/08-l5-competencies/02-problem-solving-frameworks.md) + [LeetCode Patterns](docs/leetcode/00-patterns-index.md) |
| 3 | Technical Mastery | 20pts | FE track (JS/TS/React/Next.js) + BE track (Go) + Shared CS |
| 4 | Communication | 10pts | [STAR Method](docs/shared/09-behavioral/01-star-method.md) + [Storytelling](docs/shared/09-behavioral/04-storytelling.md) |
| 5 | Leadership | 10pts | [Leadership Principles](docs/shared/09-behavioral/02-leadership-principles.md) |
| 6 | Ownership & Execution | 10pts | [Self-Assessment](docs/shared/08-l5-competencies/00-l5-self-assessment.md) |
| 7 | Quality & Risk | 10pts | [Testing Strategy](docs/fe-track/06-browser-performance/06-frontend-testing-strategy.md) + [Observability](docs/fe-track/08-fe-system-design/07-frontend-quality-and-observability.md) |
| 8 | Team Multiplier | 5pts | [Design Patterns](docs/shared/05-software-engineering/01-solid-and-design-patterns.md) |
| 9 | Behaviour | 3pts | [Common Questions](docs/shared/09-behavioral/03-common-questions.md) |
| 10 | Business Awareness | 2pts | [Company Guides](docs/shared/07-company-guides/) |

**Target**: ≥ 70/100. Use the [L5 Self-Assessment](docs/shared/08-l5-competencies/00-l5-self-assessment.md) to find your gaps.

---

## Pedagogical Approach / Phương Pháp Sư Phạm

Every content file follows research-backed learning techniques:

- **Harvard Case Method** — Real-world scenario first, theory second
- **Feynman Technique** — Explain concepts in simple analogies before formal definitions
- **Bloom's Taxonomy** — Q&A tagged 🟢 Junior → 🟡 Mid → 🔴 Senior
- **Kumon Ordering** — Prerequisites linked, progressive difficulty within each file
- **Spaced Repetition** — Self-check sections with 3/7/14/30-day review schedules
- **Dual Coding** — ASCII diagrams + text explanations for visual + verbal learning

---

## Content Format / Định Dạng Nội Dung

- **Bilingual**: English headings + Vietnamese explanations (song ngữ)
- **Difficulty tags**: 🟢 Junior | 🟡 Mid | 🔴 Senior
- **Q&A format** with Interview Signals (✅ Strong / ❌ Weak)
- **Follow-up Chains** on 🔴 Senior questions (3 progressive follow-ups)
- **Cross-references** between shared theory and track-specific implementations
- **LeetCode integration** — theory files link to practice problems

---

## Coverage / Phạm Vi

| Section | Files | Topics |
|---------|-------|--------|
| Shared Fundamentals | ~45 | CS, System Design, DB, Security, SE, AI, L5 Competencies, Behavioral |
| Frontend Track | ~200+ | JS, TS, React, Next.js, Browser, Performance, Testing, Security |
| Backend Track | ~27 | Go, Backend, DB, System Design, DevOps |
| LeetCode | ~156 | Arrays, Strings, Trees, DP, Backtracking, Design (12 patterns) |

---

## Company Targets / Công Ty Mục Tiêu

| Company | Level | Primary Focus | Guide |
|---------|-------|---------------|-------|
| Google | L4–L6 | Hard DSA, System Design, Behavioral | [Google](docs/shared/07-company-guides/01-google.md) |
| Microsoft | SDE2–SDE3 | Domain knowledge, medium DSA | [Microsoft](docs/shared/07-company-guides/02-microsoft.md) |
| Grab | SWE2–SWE3 | Go backend, SEA-scale system design | [Grab](docs/shared/07-company-guides/03-grab.md) |
| Axon | SWE | Practical engineering, mission-driven | [Axon](docs/shared/07-company-guides/04-axon.md) |
| Employment Hero | SWE | Product thinking, async collaboration | [EH](docs/shared/07-company-guides/05-employment-hero.md) |
| Zalo/VNG | Mid–Senior | Go + React, messaging at scale | [Zalo](docs/shared/07-company-guides/06-zalo-vng.md) |

---

## Study Path by Level / Lộ Trình Theo Level

| Level | Target | Focus |
|-------|--------|-------|
| **L3 Junior** | Pass Easy-Medium coding | JS/TS basics, React fundamentals, LeetCode Easy |
| **L4 Mid** | Pass Medium coding + domain | Advanced JS/TS, React patterns, Performance, Security |
| **L5 Senior** | Pass Hard + System Design + Behavioral | Architecture, L5 Competencies, Leadership, LeetCode Hard |

See [Level Guide](docs/00-level-guide.md) for the complete file-to-level mapping.
