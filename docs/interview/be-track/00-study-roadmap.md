# Go Backend Interview Study Roadmap / Lộ Trình Học

## Tổng Quan / Overview

- Lộ trình này ưu tiên kiến thức cho Go Backend Middle/Senior.
- Sắp theo phase để học tuần tự từ nền tảng đến system design.
- Có thể điều chỉnh theo công ty mục tiêu và thời gian chuẩn bị.

## Lộ trình ôn tập phỏng vấn Go Backend Developer (Middle/Senior)

### Target Companies

- **Vietnam**: Zalo (VNG), Grab Vietnam, Axon, Employment Hero
- **Global**: Microsoft, Google

---

## Study Order / Thứ tự ôn tập

### Phase 1: CS Fundamentals / Nền Tảng CS (2-3 tuần)

> Nền tảng bắt buộc cho mọi vòng phỏng vấn

| #   | Topic             | File                                         | Priority |
| --- | ----------------- | -------------------------------------------- | -------- |
| 1   | Data Structures   | `01-cs-fundamentals/01-data-structures.md`   | Critical |
| 2   | Algorithms        | `01-cs-fundamentals/02-algorithms.md`        | Critical |
| 3   | Operating Systems | `01-cs-fundamentals/03-operating-systems.md` | High     |
| 4   | Networking        | `01-cs-fundamentals/04-networking.md`        | High     |

### Phase 2: Backend Knowledge / Kiến Thức Backend (2-3 tuần)

> Kiến thức backend cốt lõi, đặc biệt quan trọng cho Senior

| #   | Topic               | File                                             | Priority |
| --- | ------------------- | ------------------------------------------------ | -------- |
| 5   | API Design          | `02-backend-knowledge/01-api-design.md`          | Critical |
| 6   | Microservices       | `02-backend-knowledge/02-microservices.md`       | High     |
| 7   | Distributed Systems | `02-backend-knowledge/03-distributed-systems.md` | High     |
| 8   | Auth & Security     | `02-backend-knowledge/04-auth-security.md`       | Medium   |

### Phase 3: Database / Cơ Sở Dữ Liệu (1-2 tuần)

> Kiến thức database thực chiến

| #   | Topic                   | File                                      | Priority |
| --- | ----------------------- | ----------------------------------------- | -------- |
| 9   | SQL Fundamentals        | `03-database/01-sql-fundamentals.md`      | Critical |
| 10  | Indexing & Optimization | `03-database/02-indexing-optimization.md` | Critical |
| 11  | NoSQL (Redis, MongoDB)  | `03-database/03-nosql-redis-mongo.md`     | High     |
| 12  | Caching Patterns        | `03-database/04-caching-patterns.md`      | High     |

### Phase 4: Golang Deep Dive / Chuyên Sâu Golang (2-3 tuần)

> Kiến thức Go chuyên sâu, rất quan trọng cho Go-specific roles

| #   | Topic                 | File                                    | Priority |
| --- | --------------------- | --------------------------------------- | -------- |
| 13  | Language Fundamentals | `04-golang/01-language-fundamentals.md` | Critical |
| 14  | Interfaces & Generics | `04-golang/02-interfaces-generics.md`   | High     |
| 15  | Concurrency           | `04-golang/03-concurrency.md`           | Critical |
| 16  | Memory & GC           | `04-golang/04-memory-gc.md`             | High     |
| 17  | Testing & Profiling   | `04-golang/05-testing-profiling.md`     | Medium   |

### Phase 5: System Design / Thiết Kế Hệ Thống (2-3 tuần)

> Bắt buộc cho Senior, quan trọng cho Middle

| #   | Topic                | File                                             | Priority |
| --- | -------------------- | ------------------------------------------------ | -------- |
| 18  | Design Framework     | `04-be-system-design/01-design-framework.md`     | Critical |
| 19  | Classic Problems     | `04-be-system-design/02-classic-problems.md`     | Critical |
| 20  | Advanced Problems    | `04-be-system-design/03-advanced-problems.md`    | High     |
| 21  | Distributed Patterns | `04-be-system-design/04-distributed-patterns.md` | High     |

### Phase 6: DevOps & Infrastructure / Hạ Tầng & DevOps (1 tuần)

> Kiến thức DevOps cơ bản cho backend developer

| #   | Topic                   | File                          | Priority |
| --- | ----------------------- | ----------------------------- | -------- |
| 22  | DevOps & Infrastructure | `06-devops-infrastructure.md` | Medium   |

### Phase 7: AI & Agentic Systems / AI & Hệ Thống Agent (1-2 tuần)

> Kiến thức AI ngày càng quan trọng cho phỏng vấn 2025-2026

| #   | Topic               | File                                                 | Priority |
| --- | ------------------- | ---------------------------------------------------- | -------- |
| 23  | ML Fundamentals     | `shared/06-ai-and-agents/01-ml-fundamentals.md`      | High     |
| 24  | LLMs & Transformers | `shared/06-ai-and-agents/02-llm-and-transformers.md` | High     |
| 25  | Agent Patterns      | `shared/06-ai-and-agents/03-agent-patterns.md`       | Medium   |
| 26  | RAG & Embeddings    | `shared/06-ai-and-agents/04-rag-and-embeddings.md`   | Medium   |
| 27  | AI System Design    | `shared/06-ai-and-agents/06-ai-system-design.md`     | Medium   |

### Phase 8: Software Engineering Practices / Thực Hành Kỹ Thuật Phần Mềm (1 tuần)

> Kiến thức design patterns và architecture

| #   | Topic                   | File                                                             | Priority |
| --- | ----------------------- | ---------------------------------------------------------------- | -------- |
| 28  | SOLID & Design Patterns | `shared/05-software-engineering/01-solid-and-design-patterns.md` | High     |
| 29  | Architecture Styles     | `shared/05-software-engineering/02-architecture-styles.md`       | Medium   |

### Reference / Tài Liệu Tham Chiếu

| #   | Topic                     | File                              |
| --- | ------------------------- | --------------------------------- |
| 30  | Company-specific Guide    | `05-company-guide.md`             |
| 31  | Company Guides (shared)   | `shared/07-company-guides/`       |
| 32  | Interview Market Overview | `00-interview-market-overview.md` |

---

## Company-Specific Focus Matrix / Ma Trận Trọng Tâm Theo Công Ty

| Topic           | Zalo      | Grab      | Axon      | EH        | Microsoft | Google    |
| --------------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Algorithms (LC) | Medium    | Hard      | Medium    | Medium    | Hard      | Very Hard |
| System Design   | High      | Very High | Medium    | Medium    | Very High | Very High |
| Go Deep Dive    | High      | High      | Very High | High      | Low       | Very High |
| Database        | High      | High      | High      | Very High | Medium    | Medium    |
| Microservices   | High      | Very High | Very High | High      | Medium    | Medium    |
| Concurrency     | Very High | High      | High      | Medium    | Medium    | Very High |
| Distributed Sys | High      | Very High | Medium    | Medium    | High      | Very High |
| Behavioral      | Low       | Medium    | Medium    | Medium    | High      | High      |

### Ghi chú theo công ty

- **Zalo**: Focus messaging system, real-time, Go concurrency cho millions connections
- **Grab**: Focus ride-matching, geospatial, Kafka, low-latency API, 3-4 rounds
- **Axon**: Focus clean architecture, TDD, code quality, hexagonal architecture
- **Employment Hero**: Focus multi-tenant SaaS, PostgreSQL, background jobs, AWS
- **Microsoft**: Focus algorithms + system design, ít hỏi Go-specific, 4-5 rounds
- **Google**: Google tạo ra Go, expect hỏi sâu Go internals + algorithms hard, 5+ rounds

---

## Daily Study Template / Mẫu Học Hằng Ngày

```
Morning (2h):   Algorithm practice (LeetCode in Go)
Afternoon (2h): Theory topic (theo phase hiện tại)
Evening (1h):   Review + flashcards + mock interview Q&A
Weekend (4h):   System design practice
```

## Resources bổ sung

- LeetCode (filter by Go solutions)
- "Designing Data-Intensive Applications" - Martin Kleppmann
- "System Design Interview" - Alex Xu (Vol 1 & 2)
- "The Go Programming Language" - Donovan & Kernighan
- "Concurrency in Go" - Katherine Cox-Buday
- Go blog: https://go.dev/blog/
- Effective Go: https://go.dev/doc/effective_go
