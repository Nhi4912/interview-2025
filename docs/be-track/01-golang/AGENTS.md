# 01-GOLANG KNOWLEDGE BASE

## OVERVIEW

Go language-level interview prep — syntax through production patterns; no framework/infra content.

## WHERE TO LOOK

| Interview Topic                                     | File                          |
| --------------------------------------------------- | ----------------------------- |
| Goroutines, GMP scheduler, channels, sync, Context  | `03-concurrency.md`           |
| Functional Options, Middleware, Worker Pool, pprof  | `08-advanced-patterns.md`     |
| Interfaces, embedding, generics constraints         | `02-interfaces-generics.md`   |
| Slices, maps, strings, value vs pointer semantics   | `01-language-fundamentals.md` |
| GC, escape analysis, heap vs stack, memory layout   | `04-memory-gc.md`             |
| Table-driven tests, benchmarks, fuzz, race detector | `05-testing-profiling.md`     |
| Go-idiomatic DS (linked list, heap, trie, etc.)     | `06-data-structures-go.md`    |
| Sorting, search, DP, graph — implemented in Go      | `07-algorithms-go.md`         |

## LOCAL CONVENTIONS

- **Go version assumed:** 1.21+ (generics stable; `slices`/`maps` stdlib packages available)
- **Code samples:** runnable snippets only — no pseudo-code, no imports omitted
- **Difficulty tags** follow parent AGENTS.md: `🟢 Junior` / `🟡 Mid` / `🔴 Senior`
- **File structure per topic:** Real-World Scenario → What & Why → Concept Map → Core Concepts → Q&A → Anti-Patterns
- **Interview weight stars (⭐–⭐⭐⭐⭐⭐)** appear in each file's Overview table — use them to triage study time
- **Bilingual rule:** English headings, Vietnamese explanation body (see parent for full style guide)

## ANTI-PATTERNS

- Do NOT add framework content (Gin, Echo, GORM) — belongs in `02-backend-knowledge/`
- Do NOT add DB/cache/infra topics — belongs in `03-database-advanced/` or `06-devops-infrastructure.md`
- Do NOT duplicate OS/concurrency theory already in `shared/01-cs-fundamentals/07-concurrency-and-parallelism.md`
- Do NOT write pseudo-code in code blocks — all Go samples must compile
- `07-algorithms-go.md` and `06-data-structures-go.md` are Go-idiomatic implementations only; algorithm theory lives in `shared/`
