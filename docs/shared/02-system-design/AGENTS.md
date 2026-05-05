# AGENTS.md — 02-system-design

## OVERVIEW

SD primitives and patterns, framework-agnostic (caching, replication, consensus, queues, load-balancing, event-driven).
Track-specific application lives in `../../be-track/04-be-system-design/` and `../../fe-track/08-fe-system-design/`.

---

## WHERE TO LOOK

Read the first 30 lines of each file before diving deeper.

| Topic / Keywords                                                                  | File                          |
| --------------------------------------------------------------------------------- | ----------------------------- |
| SD interview framework, back-of-envelope estimation, capacity math                | `system-design-theory.md`     |
| Cache-aside, write-through, write-behind, read-through, cache stampede, eviction  | `caching-patterns.md`         |
| Leader-follower, multi-leader, leaderless, sharding strategies, partition keys    | `replication-partitioning.md` |
| Raft, Paxos, quorum reads/writes, split-brain, fencing tokens                     | `consensus-algorithms.md`     |
| Kafka, RabbitMQ, SQS — broker theory, delivery semantics, backpressure            | `05-message-queues.md`        |
| L4 vs L7, round-robin, least-connections, consistent hashing, sticky sessions     | `06-load-balancing.md`        |
| Event store, projections, snapshots, CQRS read/write models, eventual consistency | `07-event-sourcing-cqrs.md`   |

**File-naming note:** four files are unnumbered (`system-design-theory.md`, `caching-patterns.md`,
`replication-partitioning.md`, `consensus-algorithms.md`); three are numbered (`05-`, `06-`, `07-`).
Mixed naming is intentional — do not renumber.

---

## CROSS-REFERENCES

| Need                                                              | Go to                                                           |
| ----------------------------------------------------------------- | --------------------------------------------------------------- |
| BE system-design case studies (URL shortener, ride-hailing, etc.) | `../../be-track/04-be-system-design/`                           |
| FE system-design answer skeleton & CDN/rendering patterns         | `../../fe-track/08-fe-system-design/`                           |
| DB-specific sharding, distributed transactions, 2PC/SAGA          | `../03-database/04-sharding-and-transactions.md`                |
| CAP theorem, PACELC, distributed-systems theory                   | `../../be-track/02-backend-knowledge/03-distributed-systems.md` |

**Overlap rule:** theory and primitives live here; applied case studies and worked examples live in tracks.

---

## ANTI-PATTERNS

- **No full case studies here.** URL shortener, ride-hailing, Twitter feed, etc. belong in track folders (`be-track/04-be-system-design/` or `fe-track/08-fe-system-design/`), not in this shared layer.
- **No duplicate distributed-systems theory.** CAP, PACELC, vector clocks are already in `be-track/02-backend-knowledge/03-distributed-systems.md`; don't restate them here.
- **No Postgres-only sharding details.** DB-flavored partitioning (pg_partman, Citus, foreign-data wrappers) belongs in `../03-database/`, not in `replication-partitioning.md`.
- **No renumbering files.** The mixed naming convention (unnumbered + `05/06/07` prefixes) is deliberate; renaming breaks cross-references in other AGENTS files.
- **No conflating queue theory with broker operations.** `05-message-queues.md` covers conceptual semantics; deployment/ops notes go in the relevant track.
