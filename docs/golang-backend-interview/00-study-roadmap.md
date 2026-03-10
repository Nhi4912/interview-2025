# Go Backend Interview Study Roadmap

## Lộ trình ôn tập phỏng vấn Go Backend Developer (Middle/Senior)

### Target Companies
- **Vietnam**: Zalo (VNG), Grab Vietnam, Axon, Employment Hero
- **Global**: Microsoft, Google

---

## Study Order (Thứ tự ôn tập)

### Phase 1: CS Fundamentals (2-3 tuần)
> Nền tảng bắt buộc cho mọi vòng phỏng vấn

| # | Topic | File | Priority |
|---|-------|------|----------|
| 1 | Data Structures | `01-cs-fundamentals/01-data-structures.md` | Critical |
| 2 | Algorithms | `01-cs-fundamentals/02-algorithms.md` | Critical |
| 3 | Operating Systems | `01-cs-fundamentals/03-operating-systems.md` | High |
| 4 | Networking | `01-cs-fundamentals/04-networking.md` | High |

### Phase 2: Backend Knowledge (2-3 tuần)
> Kiến thức backend cốt lõi, đặc biệt quan trọng cho Senior

| # | Topic | File | Priority |
|---|-------|------|----------|
| 5 | API Design | `02-backend-knowledge/01-api-design.md` | Critical |
| 6 | Microservices | `02-backend-knowledge/02-microservices.md` | High |
| 7 | Distributed Systems | `02-backend-knowledge/03-distributed-systems.md` | High |
| 8 | Auth & Security | `02-backend-knowledge/04-auth-security.md` | Medium |

### Phase 3: Database (1-2 tuần)
> Kiến thức database thực chiến

| # | Topic | File | Priority |
|---|-------|------|----------|
| 9 | SQL Fundamentals | `03-database/01-sql-fundamentals.md` | Critical |
| 10 | Indexing & Optimization | `03-database/02-indexing-optimization.md` | Critical |
| 11 | NoSQL (Redis, MongoDB) | `03-database/03-nosql-redis-mongo.md` | High |
| 12 | Caching Patterns | `03-database/04-caching-patterns.md` | High |

### Phase 4: Golang Deep Dive (2-3 tuần)
> Kiến thức Go chuyên sâu, rất quan trọng cho Go-specific roles

| # | Topic | File | Priority |
|---|-------|------|----------|
| 13 | Language Fundamentals | `04-golang/01-language-fundamentals.md` | Critical |
| 14 | Interfaces & Generics | `04-golang/02-interfaces-generics.md` | High |
| 15 | Concurrency | `04-golang/03-concurrency.md` | Critical |
| 16 | Memory & GC | `04-golang/04-memory-gc.md` | High |
| 17 | Testing & Profiling | `04-golang/05-testing-profiling.md` | Medium |

### Phase 5: System Design (2-3 tuần)
> Bắt buộc cho Senior, quan trọng cho Middle

| # | Topic | File | Priority |
|---|-------|------|----------|
| 18 | Design Framework | `05-system-design/01-design-framework.md` | Critical |
| 19 | Classic Problems | `05-system-design/02-classic-problems.md` | Critical |

### Reference
| # | Topic | File |
|---|-------|------|
| 20 | Company-specific Guide | `06-company-guide.md` |

---

## Company-Specific Focus Matrix

| Topic | Zalo | Grab | Axon | EH | Microsoft | Google |
|-------|------|------|------|----|-----------|--------|
| Algorithms (LC) | Medium | Hard | Medium | Medium | Hard | Very Hard |
| System Design | High | Very High | Medium | Medium | Very High | Very High |
| Go Deep Dive | High | High | Very High | High | Low | Very High |
| Database | High | High | High | Very High | Medium | Medium |
| Microservices | High | Very High | Very High | High | Medium | Medium |
| Concurrency | Very High | High | High | Medium | Medium | Very High |
| Distributed Sys | High | Very High | Medium | Medium | High | Very High |
| Behavioral | Low | Medium | Medium | Medium | High | High |

### Ghi chú theo công ty
- **Zalo**: Focus messaging system, real-time, Go concurrency cho millions connections
- **Grab**: Focus ride-matching, geospatial, Kafka, low-latency API, 3-4 rounds
- **Axon**: Focus clean architecture, TDD, code quality, hexagonal architecture
- **Employment Hero**: Focus multi-tenant SaaS, PostgreSQL, background jobs, AWS
- **Microsoft**: Focus algorithms + system design, ít hỏi Go-specific, 4-5 rounds
- **Google**: Google tạo ra Go, expect hỏi sâu Go internals + algorithms hard, 5+ rounds

---

## Daily Study Template

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
