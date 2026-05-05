# AGENTS.md — 02-backend-knowledge

## OVERVIEW

Core backend interview topics for Go mid-senior roles: API contracts, distributed systems theory, resilience patterns, security, and wire protocols.

---

## WHERE TO LOOK

| Interview Topic                                                       | File                        |
| --------------------------------------------------------------------- | --------------------------- |
| REST vs GraphQL vs gRPC trade-offs                                    | `01-api-design.md`          |
| API versioning, pagination, idempotency keys                          | `01-api-design.md`          |
| Service mesh, service discovery, sidecar                              | `02-microservices.md`       |
| Monolith → microservices decomposition                                | `02-microservices.md`       |
| CAP theorem, PACELC                                                   | `03-distributed-systems.md` |
| Raft / Paxos consensus                                                | `03-distributed-systems.md` |
| Consistent hashing, sharding strategies                               | `03-distributed-systems.md` |
| Saga pattern, 2PC, distributed transactions                           | `03-distributed-systems.md` |
| Vector clocks, exactly-once delivery                                  | `03-distributed-systems.md` |
| JWT vs session, OAuth2 / OIDC                                         | `04-auth-security.md`       |
| RBAC / ABAC authorization models                                      | `04-auth-security.md`       |
| mTLS, secret rotation                                                 | `04-auth-security.md`       |
| Goroutine scheduling (GMP model)                                      | `05-os-go.md`               |
| Syscalls, epoll, context switching cost                               | `05-os-go.md`               |
| TCP three-way handshake, TIME_WAIT                                    | `06-networking-go.md`       |
| HTTP/2 multiplexing, head-of-line blocking                            | `06-networking-go.md`       |
| TLS handshake overhead                                                | `06-networking-go.md`       |
| Circuit breaker (Closed→Open→Half-Open)                               | `07-resilience-patterns.md` |
| Bulkhead isolation, blast radius                                      | `07-resilience-patterns.md` |
| Rate limiting algorithms (token bucket, leaky bucket, sliding window) | `07-resilience-patterns.md` |
| Retry + exponential backoff + jitter                                  | `07-resilience-patterns.md` |
| Backpressure, adaptive concurrency                                    | `07-resilience-patterns.md` |
| Kafka vs RabbitMQ vs SQS                                              | `08-message-queues.md`      |
| Consumer groups, partition rebalancing                                | `08-message-queues.md`      |
| At-least-once vs exactly-once semantics                               | `08-message-queues.md`      |
| Dead letter queues                                                    | `08-message-queues.md`      |
| Protobuf schema evolution, field numbering                            | `09-grpc-protobuf.md`       |
| gRPC streaming patterns (unary/server/client/bidi)                    | `09-grpc-protobuf.md`       |
| gRPC load balancing (L7 vs L4, client-side)                           | `09-grpc-protobuf.md`       |
| gRPC interceptors (auth, tracing, retry)                              | `09-grpc-protobuf.md`       |
| gRPC deadline propagation                                             | `09-grpc-protobuf.md`       |

---

## LOCAL CONVENTIONS

- Each file opens with a **real Vietnamese tech company incident** (Grab, Shopee, Tiki) — treat these as interview narrative anchors, not just examples.
- Concept Maps (ASCII trees) appear early — use them to orient before reading deep Q&A.
- Interview weight stars (⭐×5) indicate priority; focus ⭐⭐⭐⭐⭐ topics first.
- `🧠 Memory Hook` callouts provide the one-liner to say out loud in an interview.
- Pattern composition is explicit: files state how patterns combine (e.g. Timeout → Retry → Circuit Breaker defense chain in `07`).

---

## CROSS-REFERENCES

| Topic                                                  | Lives in                              |
| ------------------------------------------------------ | ------------------------------------- |
| Go concurrency primitives (goroutine, channel, mutex)  | `01-golang/03-concurrency.md`         |
| Database caching (Redis patterns, cache invalidation)  | `03-database-advanced/04-caching.md`  |
| Query optimization, indexing                           | `03-database-advanced/02-indexing.md` |
| System design case studies (URL shortener, feed, etc.) | `04-system-design/`                   |
| Observability (tracing, metrics, structured logs)      | sibling file TBD                      |

---

## ANTI-PATTERNS

- **Don't conflate 03 and 08**: Distributed Systems (`03`) covers theory (CAP, consensus, replication); Message Queues (`08`) covers operational specifics (Kafka internals, consumer lag). Interviewers ask them separately.
- **Don't skip OS/networking files**: `05-os-go.md` and `06-networking-go.md` are frequently underestimated; GMP model and TCP TIME_WAIT appear in Go-specific rounds.
- **gRPC ≠ just REST replacement**: `09` is only relevant for internal service communication — don't propose gRPC for public/browser-facing APIs without justifying it.
- **Resilience patterns are compositional**: citing only Circuit Breaker is incomplete; expect follow-up on the full chain (Timeout → Retry → CB → Bulkhead → Rate Limit).
