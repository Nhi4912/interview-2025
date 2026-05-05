# Interview Preparation Knowledge Base — Mục Lục Tổng Hợp

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](00-table-of-contents.md)

> **Comprehensive guide for mid-senior developers targeting Frontend (React/TypeScript) and Backend (Go) roles.**
> Target companies: Google, Microsoft, Grab, Axon, Employment Hero, Zalo/VNG
> Last updated: March 2026

---

## 📋 Quick Start / Bắt Đầu Nhanh

- [Interview Market Overview 2025-2026](./00-interview-market-overview.md) — Xu hướng phỏng vấn và so sánh các công ty
- [Quick Start Guide](./00-quick-start-guide.md)
- [6-Month Study Plan](./00-6-month-study-plan.md) — Lộ trình học 6 tháng chi tiết
- [Quick Reference Cheat Sheet](./quick-reference-cheat-sheet.md)

---

## 📡 2026 Interview Trends — High-Signal Senior Topics

> **NEW (2026)**: 12 high-signal topics that separate mid from staff in modern interviews. Bilingual EN+VI, full pedagogical treatment (A1-A8 + B1-B10 + C1-C7), ~9,800 lines, ~120 graded interview questions.
> **Start here**: [📂 2026-trends/README.md](./2026-trends/README.md) (track index + 5 learning paths)

| #   | Topic                                                                                   | Mnemonic                  | Difficulty | Cluster    |
| --- | --------------------------------------------------------------------------------------- | ------------------------- | ---------- | ---------- |
| 01  | [AI-Augmented Engineering](./2026-trends/01-ai-augmented-engineering.md)                | TASC, GRRRC, SHIELD       | 🟢→🔴      | AI         |
| 02  | [LLM System Design](./2026-trends/02-llm-system-design.md)                              | RPMECG                    | 🟡→🔴      | AI         |
| 03  | [Vector DBs & Embeddings](./2026-trends/03-vector-databases-embeddings.md)              | HNSW, pgvector            | 🟡→🔴      | AI         |
| 04  | [Edge Computing & Serverless 2026](./2026-trends/04-edge-computing-serverless-2026.md)  | PEACE                     | 🟡→🔴      | Runtime    |
| 05  | [Modern JS Runtimes (Bun/Deno/Node)](./2026-trends/05-modern-js-runtimes.md)            | BDN                       | 🟡→🔴      | Runtime    |
| 06  | [React Server Components 2026](./2026-trends/06-react-server-components-2026.md)        | RSC = Render-Stream-Cache | 🟡→🔴      | Frontend   |
| 07  | [WebAssembly FE + BE](./2026-trends/07-webassembly-fe-be.md)                            | WASM-FACE                 | 🟡→🔴      | Frontend   |
| 08  | [Rust for Backend Engineers](./2026-trends/08-rust-for-backend-engineers.md)            | OBE                       | 🟡→🔴      | Systems    |
| 09  | [AI Agent Evaluation in Production](./2026-trends/09-ai-agent-evaluation-production.md) | GETS-G                    | 🔴         | AI         |
| 10  | [Senior Engineer in AI Era](./2026-trends/10-senior-engineer-ai-era.md)                 | JATES                     | 🔴         | Leadership |
| 11  | [Modern Observability](./2026-trends/11-modern-observability.md)                        | MeLT-SCAN                 | 🟡→🔴      | Production |
| 12  | [Platform Engineering & DX](./2026-trends/12-platform-engineering-dx.md)                | PAVED-RoaD                | 🟡→🔴      | Production |

> 🇻🇳 Mỗi file có mnemonic, ASCII diagrams, Common Mistakes table tiếng Việt, Feynman test, spaced repetition schedule. ~120 câu hỏi (3🟢/4🟡/3🔴 mỗi file). Đọc [README track](./2026-trends/README.md) trước để chọn learning path phù hợp.

---

## 🎯 Company-Specific Guides / Hướng Dẫn Theo Công Ty

| Company         | Guide                                                                     | Key Focus                                  |
| --------------- | ------------------------------------------------------------------------- | ------------------------------------------ |
| Google          | [01-google.md](./shared/07-company-guides/01-google.md)                   | Hard DSA, System Design (L5+), No AI tools |
| Microsoft       | [02-microsoft.md](./shared/07-company-guides/02-microsoft.md)             | Domain-specific, Compliance, Medium DSA    |
| Grab            | [03-grab.md](./shared/07-company-guides/03-grab.md)                       | Go backend, SEA-scale System Design        |
| Axon            | [04-axon.md](./shared/07-company-guides/04-axon.md)                       | Practical engineering, Mission-driven      |
| Employment Hero | [05-employment-hero.md](./shared/07-company-guides/05-employment-hero.md) | Async-first, Values fit, Product domain    |
| Zalo/VNG        | [06-zalo-vng.md](./shared/07-company-guides/06-zalo-vng.md)               | Go + React, Messaging at scale, Bilingual  |

---

## 📚 Shared Fundamentals / Kiến Thức Nền Tảng Chung

> Language-agnostic theory — single source of truth for both FE and BE tracks.

### 01 — CS Fundamentals / Nền Tảng Khoa Học Máy Tính

| #   | Topic                     | File                                                                                               | Difficulty      |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------- | --------------- |
| 1   | Algorithms Theory         | [algorithms-theory.md](./shared/01-cs-fundamentals/algorithms-theory.md)                           | Junior → Senior |
| 2   | Complexity Analysis       | [complexity-analysis.md](./shared/01-cs-fundamentals/complexity-analysis.md)                       | Junior → Senior |
| 3   | Data Structures Theory    | [data-structures-theory.md](./shared/01-cs-fundamentals/data-structures-theory.md)                 | Junior → Senior |
| 4   | Operating Systems         | [os-theory.md](./shared/01-cs-fundamentals/os-theory.md)                                           | Mid → Senior    |
| 5   | Networking                | [networking-theory.md](./shared/01-cs-fundamentals/networking-theory.md)                           | Mid → Senior    |
| 6   | Information Theory        | [information-theory.md](./shared/01-cs-fundamentals/information-theory.md)                         | Senior          |
| 7   | Concurrency & Parallelism | [07-concurrency-and-parallelism.md](./shared/01-cs-fundamentals/07-concurrency-and-parallelism.md) | Mid → Senior    |
| 8   | Computation Theory        | [08-computation-theory.md](./shared/01-cs-fundamentals/08-computation-theory.md)                   | Senior          |

### 02 — System Design / Thiết Kế Hệ Thống

| #   | Topic                            | File                                                                                 | Difficulty      |
| --- | -------------------------------- | ------------------------------------------------------------------------------------ | --------------- |
| 1   | System Design Theory             | [system-design-theory.md](./shared/02-system-design/system-design-theory.md)         | Mid → Senior    |
| 2   | Consensus Algorithms             | [consensus-algorithms.md](./shared/02-system-design/consensus-algorithms.md)         | Senior          |
| 3   | Caching Patterns                 | [caching-patterns.md](./shared/02-system-design/caching-patterns.md)                 | Mid → Senior    |
| 4   | Replication & Partitioning       | [replication-partitioning.md](./shared/02-system-design/replication-partitioning.md) | Mid → Senior    |
| 5   | Message Queues & Event Streaming | [05-message-queues.md](./shared/02-system-design/05-message-queues.md)               | Mid → Senior    |
| 6   | Load Balancing                   | [06-load-balancing.md](./shared/02-system-design/06-load-balancing.md)               | Junior → Senior |
| 7   | Event Sourcing & CQRS            | [07-event-sourcing-cqrs.md](./shared/02-system-design/07-event-sourcing-cqrs.md)     | Senior          |

### 03 — Database / Cơ Sở Dữ Liệu

| #   | Topic                            | File                                                                                    | Difficulty      |
| --- | -------------------------------- | --------------------------------------------------------------------------------------- | --------------- |
| 1   | Database Theory                  | [database-theory.md](./shared/03-database/database-theory.md)                           | Junior → Senior |
| 2   | Indexing & Optimization          | [02-indexing-and-optimization.md](./shared/03-database/02-indexing-and-optimization.md) | Mid → Senior    |
| 3   | NoSQL & NewSQL                   | [03-nosql-and-newsql.md](./shared/03-database/03-nosql-and-newsql.md)                   | Mid → Senior    |
| 4   | Sharding & Transaction Isolation | [04-sharding-and-transactions.md](./shared/03-database/04-sharding-and-transactions.md) | Mid → Senior    |

### 04 — Security / Bảo Mật

| #   | Topic                    | File                                                                                      | Difficulty      |
| --- | ------------------------ | ----------------------------------------------------------------------------------------- | --------------- |
| 1   | Security Fundamentals    | [01-security-fundamentals.md](./shared/04-security/01-security-fundamentals.md)           | Junior → Senior |
| 2   | Cryptography & Protocols | [02-cryptography-and-protocols.md](./shared/04-security/02-cryptography-and-protocols.md) | Mid → Senior    |
| 3   | Web Security & OWASP     | [03-web-security-owasp.md](./shared/04-security/03-web-security-owasp.md)                 | Mid → Senior    |
| 4   | Modern Auth Patterns     | [04-modern-auth-patterns.md](./shared/04-security/04-modern-auth-patterns.md)             | Mid → Senior    |

### 05 — Software Engineering / Kỹ Thuật Phần Mềm

| #   | Topic                   | File                                                                                                | Difficulty      |
| --- | ----------------------- | --------------------------------------------------------------------------------------------------- | --------------- |
| 1   | SOLID & Design Patterns | [01-solid-and-design-patterns.md](./shared/05-software-engineering/01-solid-and-design-patterns.md) | Junior → Senior |
| 2   | Architecture Styles     | [02-architecture-styles.md](./shared/05-software-engineering/02-architecture-styles.md)             | Mid → Senior    |
| 3   | SDLC & Practices        | [03-sdlc-and-practices.md](./shared/05-software-engineering/03-sdlc-and-practices.md)               | Junior → Senior |
| 4   | Testing Theory          | [04-testing-theory.md](./shared/05-software-engineering/04-testing-theory.md)                       | Junior → Senior |
| 5   | Code Quality & Review   | [05-code-quality-and-review.md](./shared/05-software-engineering/05-code-quality-and-review.md)     | Mid → Senior    |
| 6   | Project Management      | [06-project-management.md](./shared/05-software-engineering/06-project-management.md)               | Mid → Senior    |

### 06 — AI & Agentic Systems / AI và Hệ Thống Agent

| #   | Topic                    | File                                                                                       | Difficulty   |
| --- | ------------------------ | ------------------------------------------------------------------------------------------ | ------------ |
| 1   | ML Fundamentals          | [01-ml-fundamentals.md](./shared/06-ai-and-agents/01-ml-fundamentals.md)                   | Junior → Mid |
| 2   | LLMs & Transformers      | [02-llm-and-transformers.md](./shared/06-ai-and-agents/02-llm-and-transformers.md)         | Mid → Senior |
| 3   | Agent Patterns           | [03-agent-patterns.md](./shared/06-ai-and-agents/03-agent-patterns.md)                     | Mid → Senior |
| 4   | RAG & Embeddings         | [04-rag-and-embeddings.md](./shared/06-ai-and-agents/04-rag-and-embeddings.md)             | Mid → Senior |
| 5   | AI Engineering Practice  | [05-ai-engineering-practice.md](./shared/06-ai-and-agents/05-ai-engineering-practice.md)   | Mid → Senior |
| 6   | AI System Design         | [06-ai-system-design.md](./shared/06-ai-and-agents/06-ai-system-design.md)                 | Senior       |
| 7   | AI Production Challenges | [07-ai-production-challenges.md](./shared/06-ai-and-agents/07-ai-production-challenges.md) | Senior       |
| 8   | AI Evaluation & Testing  | [08-ai-evaluation-testing.md](./shared/06-ai-and-agents/08-ai-evaluation-testing.md)       | Mid → Senior |

---

## ⚛️ Frontend Track / Lộ Trình Frontend

> [Study Roadmap](./fe-track/00-study-roadmap.md) — Recommended study order

### 01 — JavaScript (25 files)

| #   | Topic                    | File                                                                                  | Priority |
| --- | ------------------------ | ------------------------------------------------------------------------------------- | -------- |
| 1   | Basics                   | [01-javascript-basics.md](./fe-track/01-javascript/01-javascript-basics.md)           | Critical |
| 2   | Variables & Data Types   | [02-variables-types.md](./fe-track/01-javascript/02-variables-types.md)               | Critical |
| 3   | Scope & Hoisting         | [02-scope-hoisting.md](./fe-track/01-javascript/02-scope-hoisting.md)                 | Critical |
| 4   | Closures                 | [03-closures.md](./fe-track/01-javascript/03-closures.md)                             | Critical |
| 5   | Prototypes & Inheritance | [06-prototypes-inheritance.md](./fe-track/01-javascript/06-prototypes-inheritance.md) | Critical |
| 6   | `this` Keyword           | [05-this-keyword.md](./fe-track/01-javascript/05-this-keyword.md)                     | Critical |
| 7   | Event Loop & Async       | [07-event-loop-async.md](./fe-track/01-javascript/07-event-loop-async.md)             | Critical |
| 8   | ES6+ Features            | [08-es6-features.md](./fe-track/01-javascript/08-es6-features.md)                     | Critical |
| 9   | Advanced Concepts        | [10-advanced-concepts.md](./fe-track/01-javascript/10-advanced-concepts.md)           | High     |

### 02 — TypeScript (7+ files)

| #   | Topic              | File                                                                          | Priority |
| --- | ------------------ | ----------------------------------------------------------------------------- | -------- |
| 1   | TypeScript Basics  | [01-typescript-basics.md](./fe-track/02-typescript/01-typescript-basics.md)   | Critical |
| 2   | Advanced Types     | [02-advanced-types.md](./fe-track/02-typescript/02-advanced-types.md)         | High     |
| 3   | Generics Deep Dive | [03-generics-deep-dive.md](./fe-track/02-typescript/03-generics-deep-dive.md) | High     |
| 4   | React + TypeScript | [05-react-typescript.md](./fe-track/02-typescript/05-react-typescript.md)     | High     |

### 03 — React (10+ files)

| #   | Topic                    | File                                                                                 | Priority |
| --- | ------------------------ | ------------------------------------------------------------------------------------ | -------- |
| 1   | React Fundamentals       | [01-react-fundamentals.md](./fe-track/03-react/01-react-fundamentals.md)             | Critical |
| 2   | React 19 Features        | [02-react-19-features.md](./fe-track/03-react/02-react-19-features.md)               | Critical |
| 3   | Hooks Deep Dive          | [03-hooks-deep-dive.md](./fe-track/03-react/03-hooks-deep-dive.md)                   | Critical |
| 4   | Advanced Patterns        | [04-advanced-patterns.md](./fe-track/03-react/04-advanced-patterns.md)               | High     |
| 5   | State Management         | [05-state-management.md](./fe-track/03-react/05-state-management.md)                 | High     |
| 6   | Testing                  | [06-testing.md](./fe-track/03-react/06-testing.md)                                   | High     |
| 7   | Performance Optimization | [09-performance-optimization.md](./fe-track/03-react/09-performance-optimization.md) | High     |

### 04 — Next.js (4+ files)

| #   | Topic            | File                                                                                          | Priority |
| --- | ---------------- | --------------------------------------------------------------------------------------------- | -------- |
| 1   | Fundamentals     | [00-nextjs-fundamentals.md](./fe-track/04-nextjs/00-nextjs-fundamentals.md)                   | High     |
| 2   | App Router & RSC | [01-app-router-server-components.md](./fe-track/04-nextjs/01-app-router-server-components.md) | High     |
| 3   | Data Fetching    | [02-data-fetching.md](./fe-track/04-nextjs/02-data-fetching.md)                               | High     |
| 4   | Architecture     | [03-nextjs-architecture.md](./fe-track/04-nextjs/03-nextjs-architecture.md)                   | Medium   |

### 05 — HTML & CSS (9+ files)

See `fe-track/05-html-css/` for CSS fundamentals, Grid/Flexbox, architecture, responsive design.

### 05a — CSS Framework Comparison (NEW)

See [fe-track/05-html-css/08-css-framework-comparison.md](./fe-track/05-html-css/08-css-framework-comparison.md) for CSS Modules vs Tailwind vs CSS-in-JS comparison.

### 06 — Browser & Performance (5+ files)

See `fe-track/06-browser-performance/` for Core Web Vitals, React perf, bundle optimization, browser internals.

### 07 — Web Security (3+ files)

See `fe-track/07-web-security/` for vulnerabilities, authentication, security practices.

### 08 — Frontend System Design (6+ files)

See `fe-track/08-fe-system-design/` for architecture patterns, scalability, caching, micro-frontends.

### 09 — Advanced Topics (86 files)

See `fe-track/09-advanced-topics/` for data structures in JS, browser APIs, design patterns, interview practice, visual learning, tools, accessibility, and more.

> ⚠️ Note: Theoretical foundations (16-\*) now redirect to `shared/` — see shared fundamentals above.

### 10 — Networking / Mạng (NEW)

See `fe-track/10-networking/` for HTTP fundamentals, REST API design, GraphQL, WebSockets, caching/CDN, CORS.

### 11 — Accessibility / Khả Năng Truy Cập (NEW)

See `fe-track/11-accessibility/` for WCAG fundamentals, ARIA, keyboard navigation, screen readers, a11y testing.

### 12 — Behavioral Interviews / Phỏng Vấn Hành Vi (NEW)

See `fe-track/12-behavioral/` for STAR method, leadership principles, common questions, storytelling.

### 13 — Coding Practice / Luyện Code (NEW)

See `fe-track/13-coding-practice/` for DOM manipulation, React components, algorithm challenges, performance exercises.

### 14 — Company Guide / Hướng Dẫn Theo Công Ty

See [fe-track/10-company-guide.md](./fe-track/10-company-guide.md) for FE-specific company targeting.

### 14 — Frontend Testing / Kiểm Thử Frontend (NEW)

See [fe-track/14-frontend-testing.md](./fe-track/14-frontend-testing.md) for Vitest, RTL, MSW, Playwright vs Cypress, testing patterns.

### 15 — Modern Platform (2026) / Nền Tảng Hiện Đại (NEW)

See [fe-track/15-modern-platform/](./fe-track/15-modern-platform/) for Web Components & Shadow DOM, CRDTs / real-time collaboration, micro-frontends at scale, and AI-augmented FE workflow (Cursor / Copilot / Claude Code).

### 16 — Career Strategy / Chiến Lược Sự Nghiệp (NEW)

See [fe-track/16-career-strategy/](./fe-track/16-career-strategy/) for the 7 FE specializations (Frontend Masters Handbook 2024 §2), career levels Junior → Distinguished, 2025 compensation bands (VN/SEA/EU/US/FAANG), and T/I/Pi-shape framing.

### Mindmaps / Bản Đồ Tư Duy

See `fe-track/mindmaps/` for visual review aids per category.

---

## 🔧 Backend Track (Go) / Lộ Trình Backend

> [Study Roadmap](./be-track/00-study-roadmap.md) — Recommended study order

### 01 — Go Language (8 files)

| #   | Topic                 | File                                                                            | Priority |
| --- | --------------------- | ------------------------------------------------------------------------------- | -------- |
| 1   | Language Fundamentals | [01-language-fundamentals.md](./be-track/01-golang/01-language-fundamentals.md) | Critical |
| 2   | Interfaces & Generics | [02-interfaces-generics.md](./be-track/01-golang/02-interfaces-generics.md)     | Critical |
| 3   | Concurrency           | [03-concurrency.md](./be-track/01-golang/03-concurrency.md)                     | Critical |
| 4   | Memory & GC           | [04-memory-gc.md](./be-track/01-golang/04-memory-gc.md)                         | High     |
| 5   | Testing & Profiling   | [05-testing-profiling.md](./be-track/01-golang/05-testing-profiling.md)         | High     |
| 6   | Data Structures (Go)  | [06-data-structures-go.md](./be-track/01-golang/06-data-structures-go.md)       | High     |
| 7   | Algorithms (Go)       | [07-algorithms-go.md](./be-track/01-golang/07-algorithms-go.md)                 | High     |
| 8   | Advanced Patterns     | [08-advanced-patterns.md](./be-track/01-golang/08-advanced-patterns.md)         | High     |

### 02 — Backend Knowledge (9 files)

| #   | Topic               | File                                                                                   | Priority |
| --- | ------------------- | -------------------------------------------------------------------------------------- | -------- |
| 1   | API Design          | [01-api-design.md](./be-track/02-backend-knowledge/01-api-design.md)                   | Critical |
| 2   | Microservices       | [02-microservices.md](./be-track/02-backend-knowledge/02-microservices.md)             | High     |
| 3   | Distributed Systems | [03-distributed-systems.md](./be-track/02-backend-knowledge/03-distributed-systems.md) | High     |
| 4   | Auth & Security     | [04-auth-security.md](./be-track/02-backend-knowledge/04-auth-security.md)             | Medium   |
| 5   | OS for Go           | [05-os-go.md](./be-track/02-backend-knowledge/05-os-go.md)                             | Medium   |
| 6   | Networking for Go   | [06-networking-go.md](./be-track/02-backend-knowledge/06-networking-go.md)             | Medium   |
| 7   | Resilience Patterns | [07-resilience-patterns.md](./be-track/02-backend-knowledge/07-resilience-patterns.md) | High     |
| 8   | Message Queues (Go) | [08-message-queues.md](./be-track/02-backend-knowledge/08-message-queues.md)           | High     |
| 9   | gRPC & Protobuf     | [09-grpc-protobuf.md](./be-track/02-backend-knowledge/09-grpc-protobuf.md)             | High     |

### 03 — Database Advanced (4 files)

| #   | Topic                   | File                                                                                       | Priority |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ | -------- |
| 1   | SQL Fundamentals        | [01-sql-fundamentals.md](./be-track/03-database-advanced/01-sql-fundamentals.md)           | Critical |
| 2   | Indexing & Optimization | [02-indexing-optimization.md](./be-track/03-database-advanced/02-indexing-optimization.md) | Critical |
| 3   | NoSQL (Redis, MongoDB)  | [03-nosql-redis-mongo.md](./be-track/03-database-advanced/03-nosql-redis-mongo.md)         | High     |
| 4   | Caching Patterns        | [04-caching-patterns.md](./be-track/03-database-advanced/04-caching-patterns.md)           | High     |

### 04 — Backend System Design (5 files)

| #   | Topic                      | File                                                                                          | Priority |
| --- | -------------------------- | --------------------------------------------------------------------------------------------- | -------- |
| 1   | Design Framework           | [01-design-framework.md](./be-track/04-be-system-design/01-design-framework.md)               | Critical |
| 2   | Classic Problems           | [02-classic-problems.md](./be-track/04-be-system-design/02-classic-problems.md)               | Critical |
| 3   | Advanced Problems          | [03-advanced-problems.md](./be-track/04-be-system-design/03-advanced-problems.md)             | High     |
| 4   | Distributed Patterns       | [04-distributed-patterns.md](./be-track/04-be-system-design/04-distributed-patterns.md)       | High     |
| 5   | Observability & Scale      | [05-observability-and-scale.md](./be-track/04-be-system-design/05-observability-and-scale.md) | High     |
| 6   | Ride-Hailing System (Grab) | [06-ride-hailing-system.md](./be-track/04-be-system-design/06-ride-hailing-system.md)         | Senior   |

### 05 — Company Guide

See [be-track/05-company-guide.md](./be-track/05-company-guide.md) for BE-specific company targeting.

### 06 — DevOps & Infrastructure

| #   | Topic                   | File                                                                  | Priority |
| --- | ----------------------- | --------------------------------------------------------------------- | -------- |
| 1   | DevOps & Infrastructure | [06-devops-infrastructure.md](./be-track/06-devops-infrastructure.md) | Medium   |

---

## 🏋️ LeetCode / Luyện Thuật Toán (NEW)

> See `leetcode/` for algorithm problem solutions organized by category.

| Category            | Files | Difficulty Range |
| ------------------- | ----- | ---------------- |
| Array               | ~29   | Easy → Hard      |
| String              | ~21   | Easy → Hard      |
| Tree & Graph        | ~20   | Medium → Hard    |
| Dynamic Programming | ~13   | Medium → Hard    |
| Backtracking        | ~13   | Medium → Hard    |
| Linked List         | ~13   | Easy → Medium    |
| Design              | ~11   | Medium → Hard    |
| Sorting & Searching | ~8    | Easy → Hard      |
| Math                | ~7    | Easy → Medium    |
| Others              | ~12   | Mixed            |

---

## 📊 Content Statistics / Thống Kê Nội Dung

| Section             | Files          | Coverage                                                   |
| ------------------- | -------------- | ---------------------------------------------------------- |
| Shared Fundamentals | ~39 files      | CS, System Design, DB, Security, SE, AI, Company Guides    |
| Frontend Track      | ~200+ files    | JS, TS, React, Next.js, HTML/CSS, Perf, Security, SD, a11y |
| Backend Track       | ~27 files      | Go, Backend, DB, System Design, DevOps                     |
| LeetCode            | ~149 files     | Arrays, Strings, Trees, DP, Backtracking, Design           |
| **Total**           | **~440 files** | **Comprehensive bilingual interview prep**                 |

---

## 🔗 Cross-Reference Guide / Hướng Dẫn Tham Chiếu Chéo

| If studying...  | Also see...                                                                                                                                                    |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| System Design   | `shared/02-system-design/` + `be-track/04-be-system-design/` + `fe-track/08-fe-system-design/`                                                                 |
| Security        | `shared/04-security/` + `fe-track/07-web-security/` + `be-track/02-backend-knowledge/04-auth-security.md`                                                      |
| Data Structures | `shared/01-cs-fundamentals/data-structures-theory.md` + `fe-track/09-advanced-topics/01-data-structures-js.md` + `be-track/01-golang/06-data-structures-go.md` |
| AI/Agents       | `shared/06-ai-and-agents/` (theory applies to both FE and BE roles)                                                                                            |
| Design Patterns | `shared/05-software-engineering/01-solid-and-design-patterns.md` + track-specific implementations                                                              |
| Networking      | `shared/01-cs-fundamentals/networking-theory.md` + `fe-track/10-networking/` + `be-track/02-backend-knowledge/06-networking-go.md`                             |
| Algorithms      | `shared/01-cs-fundamentals/algorithms-theory.md` + `leetcode/` + `fe-track/13-coding-practice/`                                                                |

---

**Last Updated**: March 2026
**Format**: Bilingual (English + Vietnamese) | Gold Standard (🎯📖🤔🔧🕐)
**Difficulty Range**: 🟢 Junior → 🟢 Junior → 🔴 Senior
