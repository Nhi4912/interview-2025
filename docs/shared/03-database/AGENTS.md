# AGENTS.md — 03-database

## OVERVIEW

Vendor-agnostic DB internals: ACID, MVCC, isolation levels, indexing structures, NoSQL families, sharding strategies, and distributed transactions.
Postgres-specific deep work (VACUUM, WAL, advisory locks, pg*stat*\*) lives in `../../be-track/03-database-advanced/`.

## WHERE TO LOOK

| Topic                                                                             | File                              |
| --------------------------------------------------------------------------------- | --------------------------------- |
| ACID properties / MVCC / isolation levels / anomalies                             | `database-theory.md`              |
| B-tree / hash / composite index / EXPLAIN query plans                             | `02-indexing-and-optimization.md` |
| NoSQL families (KV/doc/wide-col/graph) / CAP / Spanner / CockroachDB              | `03-nosql-and-newsql.md`          |
| Sharding strategies (range/hash/consistent hashing) / 2PC / Saga / distributed tx | `04-sharding-and-transactions.md` |

## CROSS-REFERENCES

| Need                                      | Go to                                                        |
| ----------------------------------------- | ------------------------------------------------------------ |
| Postgres-specific: VACUUM, WAL, PG tuning | `../../be-track/03-database-advanced/`                       |
| Caching patterns (theory)                 | `../02-system-design/caching-patterns.md`                    |
| Caching patterns (Postgres/Redis impl)    | `../../be-track/03-database-advanced/04-caching-patterns.md` |
| Consensus internals (Raft/Paxos)          | `../02-system-design/consensus-algorithms.md`                |
| System-level partitioning / replication   | `../02-system-design/replication-partitioning.md`            |

**Ownership rule:** theory (isolation anomalies, CAP, sharding algorithms) stays here; vendor-specific implementation details belong in `be-track/`.

## ANTI-PATTERNS

- ❌ Don't use Postgres-only syntax or pg-specific behaviour as the canonical example — files here must stay vendor-neutral.
- ❌ Don't duplicate caching content — caching theory belongs in `../02-system-design/caching-patterns.md`; Redis/Postgres impl in `../../be-track/03-database-advanced/04-caching-patterns.md`.
- ❌ Don't merge DB-internal sharding/partitioning content with `../02-system-design/replication-partitioning.md` — sharding algorithms live here; system-topology partitioning lives there.
- ❌ Don't renumber files — mixed naming (`database-theory.md` unnumbered + `02-`/`03-`/`04-` numbered) is intentional; downstream links depend on exact filenames.
- ❌ Don't move Spanner/CockroachDB internals to `02-system-design/` — NewSQL is DB-family content and belongs in `03-nosql-and-newsql.md`.
