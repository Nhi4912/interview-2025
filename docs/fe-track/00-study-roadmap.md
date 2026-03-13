# Frontend Interview Study Roadmap — Lộ trình Ôn tập Frontend


> **Track**: FE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../00-table-of-contents.md)

> Dành cho vị trí Frontend Developer (Junior → Senior) tại các công ty tech hàng đầu.

---

## Target Companies — Công ty mục tiêu

**Vietnam:** Zalo (VNG), Grab Vietnam, Axon, Employment Hero
**Global:** Microsoft, Google

---

## Study Order — Thứ tự ôn tập

### Phase 1: JavaScript Fundamentals (2-3 weeks)

> Đây là nền tảng quan trọng nhất. 80% câu hỏi phỏng vấn FE xoay quanh JS fundamentals. Nắm vững phase này trước khi đi tiếp.

| #   | Topic                    | File                                             | Priority |
| --- | ------------------------ | ------------------------------------------------ | -------- |
| 1   | Variables & Data Types   | `01-javascript/01-variables-data-types.md`       | Critical |
| 2   | Scope & Hoisting         | `01-javascript/02-scope-hoisting.md`             | Critical |
| 3   | Closures                 | `01-javascript/03-closures.md`                   | Critical |
| 4   | Prototypes & Inheritance | `01-javascript/04-prototypes-inheritance.md`     | Critical |
| 5   | `this` Keyword           | `01-javascript/05-this-keyword.md`               | Critical |
| 6   | Event Loop & Async       | `01-javascript/06-event-loop-async.md`           | Critical |
| 7   | ES6+ Features            | `01-javascript/07-es6-features.md`               | Critical |
| 8   | Advanced Concepts        | `01-javascript/08-advanced-concepts.md`          | High     |
| 9   | Async Comprehensive      | `01-javascript/09-async-comprehensive.md`        | High     |
| 10  | Functional Programming   | `01-javascript/12-functional-programming.md`     | Medium   |
| 11  | Memory Management        | `01-javascript/15-memory-management-advanced.md` | Medium   |
| 12  | Execution Context Theory | `01-javascript/16-execution-context-theory.md`   | Medium   |

**Deep dive (nếu có thời gian):**

| #   | Topic                            | File                                               | Priority |
| --- | -------------------------------- | -------------------------------------------------- | -------- |
| 13  | Scope & Hoisting (Comprehensive) | `01-javascript/02-scope-hoisting-comprehensive.md` | Medium   |
| 14  | Closures (Comprehensive)         | `01-javascript/03-closures-comprehensive.md`       | Medium   |
| 15  | Prototypes (Deep)                | `01-javascript/10-prototypes-inheritance-deep.md`  | Medium   |
| 16  | ES6 (Deep)                       | `01-javascript/11-es6-features-deep.md`            | Medium   |
| 17  | Metaprogramming                  | `01-javascript/18-metaprogramming-theory.md`       | Low      |
| 18  | Concurrency Models               | `01-javascript/19-concurrency-models-theory.md`    | Low      |
| 19  | Module Systems                   | `01-javascript/20-module-systems-theory.md`        | Low      |
| 20  | Engine Internals (V8)            | `01-javascript/21-engine-internals-theory.md`      | Low      |

---

### Phase 2: TypeScript (1-2 weeks)

> TypeScript là standard ở mọi công ty lớn. Cần nắm vững type system, generics, và utility types.

| #   | Topic                    | File                                             | Priority |
| --- | ------------------------ | ------------------------------------------------ | -------- |
| 1   | TypeScript Basics        | `02-typescript/01-typescript-basics.md`          | Critical |
| 2   | Advanced Types           | `02-typescript/02-advanced-types.md`             | Critical |
| 3   | Generics Deep Dive       | `02-typescript/03-generics-deep-dive.md`         | High     |
| 4   | TypeScript Comprehensive | `02-typescript/04-typescript-comprehensive.md`   | High     |
| 5   | React + TypeScript       | `02-typescript/05-react-typescript.md`           | High     |
| 6   | Type Inference Theory    | `02-typescript/05-type-inference-theory.md`      | Medium   |
| 7   | Modern Features          | `02-typescript/06-typescript-modern-features.md` | Medium   |

---

### Phase 3: React & Next.js (2-3 weeks)

> React là framework chính cho hầu hết vị trí FE. Next.js ngày càng phổ biến, đặc biệt tại Grab và Employment Hero.

| #   | Topic                    | File                                      | Priority |
| --- | ------------------------ | ----------------------------------------- | -------- |
| 1   | React Fundamentals       | `03-react/01-react-fundamentals.md`       | Critical |
| 2   | Hooks Deep Dive          | `03-react/03-hooks-deep-dive.md`          | Critical |
| 3   | Advanced Patterns        | `03-react/04-advanced-patterns.md`        | Critical |
| 4   | State Management         | `03-react/05-state-management.md`         | High     |
| 5   | React 19 Features        | `03-react/02-react-19-features.md`        | High     |
| 6   | Performance Optimization | `03-react/09-performance-optimization.md` | High     |
| 7   | Testing                  | `03-react/06-testing.md`                  | High     |
| 8   | Hooks Comprehensive      | `03-react/07-hooks-comprehensive.md`      | Medium   |
| 9   | Advanced Patterns (Deep) | `03-react/08-react-patterns-advanced.md`  | Medium   |
| 10  | Modern React Features    | `03-react/10-modern-react-features.md`    | Medium   |

**Next.js:**

| #   | Topic                          | File                                           | Priority |
| --- | ------------------------------ | ---------------------------------------------- | -------- |
| 1   | Next.js Fundamentals           | `04-nextjs/00-nextjs-fundamentals.md`          | High     |
| 2   | App Router & Server Components | `04-nextjs/01-app-router-server-components.md` | High     |
| 3   | Data Fetching                  | `04-nextjs/02-data-fetching.md`                | High     |
| 4   | Architecture                   | `04-nextjs/03-nextjs-architecture.md`          | Medium   |

---

### Phase 4: HTML, CSS & Browser (1-2 weeks)

> Nhiều ứng viên bỏ qua HTML/CSS — đây là sai lầm lớn. Các công ty như Microsoft và Axon hỏi sâu về CSS.

| #   | Topic               | File                                    | Priority |
| --- | ------------------- | --------------------------------------- | -------- |
| 1   | HTML5 Fundamentals  | `05-html-css/00-html5-fundamentals.md`  | High     |
| 2   | CSS Fundamentals    | `05-html-css/00-css-fundamentals.md`    | High     |
| 3   | Grid & Flexbox      | `05-html-css/01-grid-flexbox.md`        | Critical |
| 4   | CSS Architecture    | `05-html-css/02-css-architecture.md`    | Medium   |
| 5   | Responsive Design   | `05-html-css/03-responsive-design.md`   | High     |
| 6   | Modern CSS Features | `05-html-css/06-modern-css-features.md` | Medium   |

**Browser & Performance:**

| #   | Topic                           | File                                                         | Priority |
| --- | ------------------------------- | ------------------------------------------------------------ | -------- |
| 1   | Core Web Vitals                 | `06-browser-performance/01-core-web-vitals.md`               | High     |
| 2   | React Performance               | `06-browser-performance/02-react-performance.md`             | High     |
| 3   | Bundle Optimization             | `06-browser-performance/03-bundle-optimization.md`           | Medium   |
| 4   | Web Performance (Comprehensive) | `06-browser-performance/04-web-performance-comprehensive.md` | Medium   |
| 5   | Rendering Optimization          | `06-browser-performance/05-rendering-optimization-theory.md` | Medium   |

---

### Phase 5: Security & System Design (2-3 weeks)

> System design là yêu cầu bắt buộc cho vị trí Mid-Senior. Security thường được hỏi kết hợp trong system design rounds.

**Security:**

| #   | Topic                                    | File                                                | Priority |
| --- | ---------------------------------------- | --------------------------------------------------- | -------- |
| 1   | Security Fundamentals (shared)           | `../shared/04-security/01-security-fundamentals.md` | High     |
| 2   | Common Vulnerabilities (XSS, CSRF, SQLi) | `07-web-security/01-common-vulnerabilities.md`      | High     |
| 3   | Authentication (JWT, OAuth)              | `07-web-security/02-authentication.md`              | High     |
| 4   | Web Security Comprehensive               | `07-web-security/03-web-security-comprehensive.md`  | Medium   |

**Frontend System Design:**

| #   | Topic                  | File                                               | Priority |
| --- | ---------------------- | -------------------------------------------------- | -------- |
| 1   | Architecture Patterns  | `08-fe-system-design/01-architecture-patterns.md`  | Critical |
| 2   | Scalability            | `08-fe-system-design/02-scalability.md`            | High     |
| 3   | Caching                | `08-fe-system-design/03-caching.md`                | High     |
| 4   | Microservices          | `08-fe-system-design/04-microservices.md`          | Medium   |
| 5   | Database Design        | `08-fe-system-design/05-database-design.md`        | Medium   |
| 6   | Microservices Patterns | `08-fe-system-design/06-microservices-patterns.md` | Medium   |

**Shared Theory (reference):**

| #   | Topic                | File                                                 | Priority |
| --- | -------------------- | ---------------------------------------------------- | -------- |
| 1   | System Design Theory | `../shared/02-system-design/system-design-theory.md` | High     |
| 2   | Database Theory      | `../shared/03-database/database-theory.md`           | Medium   |
| 3   | Consensus Algorithms | `../shared/02-system-design/consensus-algorithms.md` | Low      |

---

### Phase 6: CS Fundamentals & Algorithms (2-3 weeks)

> Google và Grab yêu cầu algorithms ở mức khó. Các công ty khác yêu cầu cơ bản đến trung bình.

| #   | Topic                        | File                                                  | Priority |
| --- | ---------------------------- | ----------------------------------------------------- | -------- |
| 1   | Complexity Analysis (shared) | `../shared/01-cs-fundamentals/complexity-analysis.md` | Critical |
| 2   | Algorithms Theory (shared)   | `../shared/01-cs-fundamentals/algorithms-theory.md`   | Critical |
| 3   | Data Structures (JS)         | `09-advanced-topics/01-data-structures-js.md`         | Critical |
| 4   | Algorithms (JS)              | `09-advanced-topics/02-algorithms-js.md`              | Critical |
| 5   | Design Patterns (TS)         | `09-advanced-topics/03-design-patterns-ts.md`         | High     |
| 6   | Graph Algorithms             | `09-advanced-topics/04-graph-algorithms.md`           | Medium   |
| 7   | Tree Algorithms              | `09-advanced-topics/05-tree-algorithms.md`            | Medium   |

---

### Reference — Tài liệu tham khảo

| #   | Topic                       | File                                                   |
| --- | --------------------------- | ------------------------------------------------------ |
| 1   | Company Guide               | `10-company-guide.md`                                  |
| 2   | Knowledge Map               | `modules/00-knowledge-map.md`                          |
| 3   | Interview Practice          | `09-advanced-topics/11-interview-practice-*` (8 files) |
| 4   | Quick Reference Cheat Sheet | `../quick-reference-cheat-sheet.md`                    |
| 5   | Quick Start Guide           | `../00-quick-start-guide.md`                           |

---

## Company-Specific Focus Matrix — Ma trận trọng tâm theo công ty

| Topic             | Zalo (VNG) | Grab      | Axon   | Employment Hero | Microsoft | Google    |
| ----------------- | ---------- | --------- | ------ | --------------- | --------- | --------- |
| JS Fundamentals   | High       | High      | High   | High            | High      | Medium    |
| TypeScript        | Medium     | High      | High   | Very High       | Very High | Medium    |
| React             | High       | Very High | High   | Very High       | High      | Medium    |
| Next.js           | Low        | High      | Medium | High            | Low       | Low       |
| HTML/CSS          | Medium     | Medium    | High   | Medium          | High      | Low       |
| Performance       | High       | Very High | Medium | High            | High      | High      |
| System Design     | Medium     | Very High | Medium | High            | Very High | Very High |
| Algorithms        | Medium     | Very Hard | Low    | Medium          | High      | Very Hard |
| Security          | Medium     | High      | Medium | High            | High      | Medium    |
| Accessibility     | Low        | Low       | High   | Medium          | High      | Medium    |
| Testing           | Medium     | High      | High   | High            | High      | Medium    |
| Browser Internals | Medium     | Medium    | Low    | Low             | Medium    | High      |

---

## Company Notes — Ghi chú theo công ty

### Zalo (VNG)

- Phỏng vấn bằng tiếng Việt
- Focus vào real-time features (chat, call), high-traffic handling
- React + custom internal frameworks
- Hỏi nhiều về performance optimization và event handling
- Coding round: medium difficulty, focus practical problems

### Grab

- Phỏng vấn bằng tiếng Anh
- LeetCode-style coding rounds (Medium-Hard)
- System design rất quan trọng (ride-hailing UI, payment flows, real-time maps)
- React + Next.js stack, mobile-first thinking
- Hỏi về state management patterns, data fetching strategies

### Axon

- Phỏng vấn bằng tiếng Anh
- Focus vào code quality, testing, clean architecture
- CSS knowledge quan trọng (Swiss/German clients care about pixel-perfect UI)
- Accessibility (WCAG) là plus lớn
- Behavioral questions theo STAR format

### Employment Hero

- Phỏng vấn bằng tiếng Anh
- Full-stack leaning (Next.js, TypeScript)
- Focus vào productivity features, form-heavy applications
- Testing culture mạnh (Jest, React Testing Library, Playwright)
- Hỏi về TypeScript advanced patterns, generics

### Microsoft

- Phỏng vấn bằng tiếng Anh
- Multiple rounds: coding + system design + behavioral
- TypeScript depth rất quan trọng (Microsoft tạo ra TS)
- Accessibility là yêu cầu bắt buộc
- Design patterns, SOLID principles, clean code
- System design: focus collaboration tools, enterprise apps

### Google

- Phỏng vấn bằng tiếng Anh
- Algorithms Hard level (LeetCode Hard, dynamic programming, graph)
- System design at scale (billions of users)
- Deep browser internals knowledge (rendering pipeline, V8)
- "Googleyness" — leadership, collaboration, handling ambiguity
- Coding in any language (JS/TS acceptable)

---

## Daily Study Template — Lịch học hàng ngày

| Time          | Activity                                                | Duration |
| ------------- | ------------------------------------------------------- | -------- |
| **Morning**   | Theory: đọc 1 topic từ roadmap + ghi chú                | 1.5h     |
| **Morning**   | Practice: code along examples, build mini projects      | 1h       |
| **Afternoon** | LeetCode/HackerRank: 2-3 problems (tăng dần difficulty) | 1.5h     |
| **Evening**   | Review: flashcards, revisit weak areas                  | 1h       |
| **Weekend**   | Mock interview practice (system design hoặc coding)     | 2-3h     |
| **Weekend**   | Build portfolio project hoặc contribute open source     | 2-3h     |

---

## New Content — Nội Dung Mới (2026)

> Các tài liệu mới được thêm vào shared/ — áp dụng cho cả FE và BE.

### AI & Agentic Systems (Critical for 2025-2026 interviews)

| #   | Topic                   | File                                                    | Priority |
| --- | ----------------------- | ------------------------------------------------------- | -------- |
| 1   | ML Fundamentals         | `shared/06-ai-and-agents/01-ml-fundamentals.md`         | High     |
| 2   | LLMs & Transformers     | `shared/06-ai-and-agents/02-llm-and-transformers.md`    | High     |
| 3   | Agent Patterns          | `shared/06-ai-and-agents/03-agent-patterns.md`          | Medium   |
| 4   | RAG & Embeddings        | `shared/06-ai-and-agents/04-rag-and-embeddings.md`      | Medium   |
| 5   | AI Engineering Practice | `shared/06-ai-and-agents/05-ai-engineering-practice.md` | Medium   |
| 6   | AI System Design        | `shared/06-ai-and-agents/06-ai-system-design.md`        | Medium   |

### Software Engineering Fundamentals

| #   | Topic                   | File                                                             | Priority |
| --- | ----------------------- | ---------------------------------------------------------------- | -------- |
| 1   | SOLID & Design Patterns | `shared/05-software-engineering/01-solid-and-design-patterns.md` | High     |
| 2   | Architecture Styles     | `shared/05-software-engineering/02-architecture-styles.md`       | Medium   |
| 3   | SDLC & Practices        | `shared/05-software-engineering/03-sdlc-and-practices.md`        | Medium   |

### Expanded Security

| #   | Topic                    | File                                                  | Priority |
| --- | ------------------------ | ----------------------------------------------------- | -------- |
| 1   | Cryptography & Protocols | `shared/04-security/02-cryptography-and-protocols.md` | Medium   |
| 2   | Web Security & OWASP     | `shared/04-security/03-web-security-owasp.md`         | High     |

### Company Interview Guides

See `shared/07-company-guides/` for detailed guides for Google, Microsoft, Grab, Axon, Employment Hero, Zalo/VNG.

### Interview Market Overview

See `00-interview-market-overview.md` for current interview trends and company comparison.

---

## Supplementary Resources — Tài liệu bổ sung

### Books

- **"You Don't Know JS Yet"** (Kyle Simpson) — JS fundamentals
- **"Effective TypeScript"** (Dan Vanderkam) — TS best practices
- **"Learning React"** (Alex Banks) — React patterns
- **"Designing Data-Intensive Applications"** (Martin Kleppmann) — System design bible

### Online

- [javascript.info](https://javascript.info) — JS reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) — Official TS docs
- [React.dev](https://react.dev) — Official React docs
- [Patterns.dev](https://patterns.dev) — Design patterns for JS/React
- [NeetCode.io](https://neetcode.io) — LeetCode patterns (categorized)
- [GreatFrontEnd](https://greatfrontend.com) — FE-specific interview prep
- [Frontend Masters](https://frontendmasters.com) — Video courses

### Practice Platforms

- **LeetCode** — Algorithms (focus: Top 150 Interview Questions)
- **GreatFrontEnd** — FE coding challenges (build autocomplete, modal, etc.)
- **Frontend Expert** (AlgoExpert) — FE system design
