# AGENTS.md — 03-database-advanced

## OVERVIEW

Bilingual (EN heading / VI explanation) DB interview prep: SQL → indexing → NoSQL/Redis → caching patterns, Junior→Senior difficulty.

## WHERE TO LOOK

| Topic                                                                     | File                          |
| ------------------------------------------------------------------------- | ----------------------------- |
| ACID, transactions, JOINs, window functions                               | `01-sql-fundamentals.md`      |
| B-tree vs hash index, composite/covering, `EXPLAIN ANALYZE`, partitioning | `02-indexing-optimization.md` |
| Redis data types, MongoDB patterns, CAP theorem, NoSQL tradeoffs          | `03-nosql-redis-mongo.md`     |
| Cache-aside vs write-through vs write-behind, stampede, TTL, eviction     | `04-caching-patterns.md`      |

## LOCAL CONVENTIONS

- **SQL flavor:** PostgreSQL throughout — index types (GIN, GiST, BRIN), `EXPLAIN ANALYZE`, `pg_stat_statements` are Postgres-specific
- **Difficulty markers:** 🟢 Junior | 🟡 Middle | 🔴 Senior — answers should match target level
- **Structure per file:** Real-world Vietnamese scenario → Concept Map → layered deep-dive → Go code examples
- **Composite index leftmost-prefix rule** is a recurring test: `(a,b,c)` covers `a`, `a+b`, `a+b+c` only
- **Cache stampede** (thundering herd) is the single most-asked failure scenario in `04` — always pair problem with solution (singleflight / probabilistic expiry)

## CROSS-REFERENCES

- Caching architecture (multi-level L1→L2→CDN) overlaps with `../04-be-system-design/` system design section
- Redis pub/sub and message queue tradeoffs tie to `../02-backend-knowledge/08` (message queues)
- Redis data structures from `03` are also used as building blocks in distributed locking questions elsewhere in the track
- Write-behind cache pattern has data-loss implications covered more deeply in transaction/durability section of `01`

## ANTI-PATTERNS

- Don't treat SQL flavor as generic — Postgres-specific syntax is intentional, don't substitute MySQL equivalents without noting the difference
- Don't skip `EXPLAIN ANALYZE` output when answering optimization questions — the file treats reading query plans as a baseline mid/senior expectation
- Don't conflate cache invalidation strategies: TTL ≠ event-driven ≠ versioning — each has distinct consistency guarantees
- Don't answer NoSQL questions with "just use Redis" — `03` covers when MongoDB, Redis, and relational each fit
- Index coverage: never claim an index is used without verifying leftmost-prefix rule applies
