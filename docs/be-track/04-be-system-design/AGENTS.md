# AGENTS.md — 04-be-system-design

## OVERVIEW

System design interview track: structured framework (01) → classic/advanced practice problems (02–03) → distributed theory (04) → observability (05) → end-to-end integration case (06).

---

## WHERE TO LOOK

| Topic                                                                            | File                            |
| -------------------------------------------------------------------------------- | ------------------------------- |
| 5-step framework, requirements, estimation, tradeoff reasoning                   | `01-design-framework.md`        |
| URL shortener, rate limiter, chat, distributed cache, notification, autocomplete | `02-classic-problems.md`        |
| Search engine, social feed, video streaming, e-commerce                          | `03-advanced-problems.md`       |
| Consistent hashing, Raft/Paxos, sharding, vector clocks, CRDT                    | `04-distributed-patterns.md`    |
| SLO/SLA, metrics, tracing, alerting, capacity planning                           | `05-observability-and-scale.md` |
| Full Grab-style ride-hailing: location, matching, trip FSM, surge pricing        | `06-ride-hailing-system.md`     |

---

## STUDY ORDER

1. **01 first, always** — internalise the 5-step framework (5-5-10-15-5 timing) before touching any problem file.
2. **02 → 03** — classic problems establish pattern vocabulary; advanced problems layer complexity on top.
3. **04 + 05 in parallel** — distributed patterns and observability are largely orthogonal; read together.
4. **06 last** — integration test: apply everything from 01–05 to ride-hailing without re-reading them.

---

## LOCAL CONVENTIONS

Every problem doc follows the same 5-section skeleton — do not deviate when adding new problems:

```
Requirements (FR + NFR + scale constraints)
  → Estimation (QPS / storage / bandwidth → justify DB/cache choice)
    → High-Level Design (API endpoints + data model + architecture diagram)
      → Deep Dive (bottleneck identified + tradeoffs argued)
        → Wrap-up (monitoring + failure modes + future scale)
```

- Each concept block has a **Memory Hook** (`🧠`) and **Why exists (2+ levels)**.
- Bilingual: section headers in EN, explanations may be EN or VI.
- Difficulty tags: 🟢 Junior / 🟡 Mid / 🔴 Senior — required on every file header.
- Interview weight: ⭐–⭐⭐⭐⭐⭐ in overview tables.

---

## CROSS-REFERENCES

| Content needed                                             | Go to                                               |
| ---------------------------------------------------------- | --------------------------------------------------- |
| Distributed systems theory (CAP, consensus, vector clocks) | `../02-backend-knowledge/03-distributed-systems.md` |
| Message queue internals (Kafka, ordering, DLQ)             | `../02-backend-knowledge/08-message-queues.md`      |
| Deep DB internals (indexing, MVCC, query plans)            | `../03-database-advanced/`                          |
| Grab-specific company context                              | `../../shared/07-company-guides/03-grab.md`         |

`04-distributed-patterns.md` overlaps with `02-backend-knowledge/03` — patterns file owns the _design application_; backend-knowledge file owns the _theory_. Don't duplicate theory here.

---

## ANTI-PATTERNS

- **Don't add deep DB tuning** (index strategies, MVCC, query plans) — belongs in `../03-database-advanced/`.
- **Don't add distributed theory** (proof of Raft, CRDT math) — belongs in `../02-backend-knowledge/03`.
- **Don't skip Step 1 (Requirements)** when writing new problems — the Shopee failure story in 02 exists precisely because of this.
- **Don't create a new problem doc** without the 5-section skeleton above; partial stubs cause inconsistency.
- **Don't add generic SD advice** (e.g. "use caching for performance") without tying it to a specific problem's scale numbers.
