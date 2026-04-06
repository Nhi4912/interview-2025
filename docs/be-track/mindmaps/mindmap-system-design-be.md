# Backend System Design Mind Map - Sơ Đồ Thiết Kế Hệ Thống

> **Track**: BE | **Difficulty**: 🟡 Mid → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả kiến thức System Design để review nhanh trước phỏng vấn

---

## System Design Complete Mind Map

```
                              ┌─────────────────────────────────────────────────────────────┐
                              │                    BACKEND SYSTEM DESIGN                      │
                              └─────────────────────────────────────────────────────────────┘
                                                              │
      ┌──────────────────┬────────────────────────────────────┼──────────────────┬──────────────────┐
      │                  │                                    │                  │                  │
┌─────▼──────┐  ┌────────▼───────┐                  ┌────────▼───────┐  ┌───────▼──────┐  ┌───────▼──────┐
│  DESIGN    │  │   CLASSIC      │                  │  DISTRIBUTED   │  │OBSERVABILITY │  │  MESSAGE     │
│ FRAMEWORK  │  │   PROBLEMS     │                  │   PATTERNS     │  │              │  │   QUEUES     │
└─────┬──────┘  └────────┬───────┘                  └────────┬───────┘  └───────┬──────┘  └───────┬──────┘
      │                  │                                    │                  │                  │
 ┌────┼────┐     ┌───────┼───────┐                  ┌────────┼────────┐  ┌──────┼──────┐   ┌──────┼──────┐
Req  Cap  API  URL Rate  Chat  CAP Consensus Shard Metrics Logs Traces Kafka RMQ Patterns
```

---

## 1. Design Framework / Khung Thiết Kế

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM DESIGN FRAMEWORK                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  STEP 1: REQUIREMENTS GATHERING (5 min)                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  Functional Requirements:                                                      │   │
│  │  • What features does the system need?                                        │   │
│  │  • What are the core use cases?                                               │   │
│  │  • What does the API look like?                                               │   │
│  │                                                                                │   │
│  │  Non-Functional Requirements:                                                  │   │
│  │  • Scale: DAU, QPS, data volume                                               │   │
│  │  • Latency: p50/p99 targets (e.g., < 100ms p99)                              │   │
│  │  • Availability: 99.9% (8.7h/yr), 99.99% (52min/yr)                         │   │
│  │  • Consistency: strong vs eventual                                            │   │
│  │  • Durability: can we lose data?                                              │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  STEP 2: CAPACITY PLANNING (5 min)                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  Traffic Estimation:                                                           │   │
│  │  • 100M DAU × 10 actions/day = 1B requests/day                               │   │
│  │  • 1B / 86400s ≈ 12K QPS average                                             │   │
│  │  • Peak = 2-3× average ≈ 30K QPS                                             │   │
│  │                                                                                │   │
│  │  Storage Estimation:                                                           │   │
│  │  • 1M writes/day × 1KB/record = 1GB/day = 365GB/year                         │   │
│  │  • 3× replication = ~1TB/year                                                 │   │
│  │                                                                                │   │
│  │  Bandwidth:                                                                    │   │
│  │  • 30K QPS × 1KB = 30MB/s read                                               │   │
│  │  • Write bandwidth = write QPS × avg payload size                            │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  STEP 3: HIGH-LEVEL DESIGN (10 min)                                                 │
│  • Draw major components: client, LB, API servers, cache, DB, queue               │
│  • Choose SQL vs NoSQL, where to add cache, async vs sync                          │
│  • Data flow for each use case                                                     │
│                                                                                       │
│  STEP 4: DEEP DIVE (15-20 min)                                                      │
│  • Focus on bottlenecks the interviewer highlights                                 │
│  • DB schema design, API design, algorithm choices                                 │
│  • Scaling strategy: horizontal/vertical, sharding, caching layers                 │
│                                                                                       │
│  STEP 5: WRAP-UP                                                                    │
│  • Identify bottlenecks and single points of failure                               │
│  • Monitoring and alerting strategy                                                 │
│  • Operational considerations                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Classic Problems / Bài Toán Kinh Điển

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              URL SHORTENER (bit.ly)                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Scale: 100M URLs, 10B redirects/day (write:read = 1:100)                          │
│                                                                                       │
│  Key Design Decisions:                                                               │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │  Short ID generation:                                                           │  │
│  │  • Counter + base62 encode (simple, predictable → collision risk)              │  │
│  │  • Random 7-char base62 = 62^7 = ~3.5 trillion combinations                   │  │
│  │  • MD5/SHA → take first 7 chars (check collision in DB)                       │  │
│  │  • Snowflake ID → base62 (distributed, sortable)                               │  │
│  │                                                                                 │  │
│  │  Storage:                                                                       │  │
│  │  • MySQL/Postgres for durability (short_code → original_url)                  │  │
│  │  • Redis cache for hot URLs (cache-aside, 24h TTL)                            │  │
│  │                                                                                 │  │
│  │  Redirect: 301 (cache in browser) vs 302 (no cache, track clicks)             │  │
│  │  Analytics: async pipeline via Kafka → Spark → analytics DB                   │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                             RATE LIMITER                                               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Algorithms: Token Bucket | Leaky Bucket | Sliding Window Log | Sliding Window Counter│
│                                                                                       │
│  Distributed Rate Limiting:                                                          │
│  • Redis INCR + EXPIRE (simple, fixed window)                                       │
│  • Redis sorted set ZADD (sliding window log, accurate but memory-heavy)            │
│  • Redis + Lua script (atomic token bucket)                                         │
│                                                                                       │
│  Architecture: Middleware → Redis → Allow/Deny → 429 response                      │
│  Sticky sessions or consistent hashing to route same user to same node             │
│                                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                              CHAT SYSTEM (WhatsApp)                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Protocols: WebSocket for real-time, HTTP long-polling fallback                     │
│                                                                                       │
│  Architecture:                                                                       │
│  Client ←─WebSocket─→ Chat Server ←→ Message Queue ←→ Fanout Service              │
│                              │                              │                        │
│                           DB (msgs)                   Push Notification              │
│                                                                                       │
│  Message Delivery:                                                                   │
│  1. Sender → Chat Server (WebSocket)                                                │
│  2. Server persists to DB + publishes to MQ                                         │
│  3. Fanout to recipient's chat server                                               │
│  4. If offline → push notification + store for sync                                 │
│                                                                                       │
│  Message ordering: Sequence IDs per conversation (Snowflake / DB auto-increment)   │
│  Read receipts: delivered ✓, read ✓✓ acknowledgements                              │
│  Group messages: fanout-on-write vs fanout-on-read (tradeoff at scale)             │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Distributed Patterns / Mẫu Phân Tán

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            DISTRIBUTED PATTERNS                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  CAP THEOREM:                                                                        │
│  ┌────────────────────────────────────────────────────────────────────────────────┐ │
│  │                    C (Consistency)                                               │ │
│  │                         /\                                                       │ │
│  │                        /  \                                                      │ │
│  │                       /    \                                                     │ │
│  │            CA ●───────────────────● CP                                          │ │
│  │           /        CA Systems:     \  CP Systems:                               │ │
│  │          /     Single-node RDBMSs   \  HBase, Zookeeper,                        │ │
│  │         /                            \  MongoDB (config),                       │ │
│  │   A ●───────────────────────────────────● P                                     │ │
│  │        AP Systems: Cassandra, DynamoDB,                                         │ │
│  │        CouchDB — prefer availability, eventual consistency                      │ │
│  │                                                                                   │ │
│  │  In practice: You always have P (network partitions happen)                     │ │
│  │  → Choose between C (consistency) and A (availability)                         │ │
│  └────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│  PACELC: Extension — even without partition, tradeoff between Latency and Consistency│
│                                                                                       │
│  CONSENSUS ALGORITHMS:                                                               │
│  ┌──────────────────────┬──────────────────────────────────────────────────────┐   │
│  │       Raft           │                   Paxos                              │   │
│  ├──────────────────────┼──────────────────────────────────────────────────────┤   │
│  │                      │                                                      │   │
│  │ Leader election:     │ Proposer → Acceptors → Learners                     │   │
│  │ Nodes vote for       │ Phase 1: Prepare → Promise                          │   │
│  │ candidate with most  │ Phase 2: Accept → Accepted                          │   │
│  │ up-to-date log       │                                                      │   │
│  │                      │ More academic, harder to understand                 │   │
│  │ Log replication:     │ Multi-Paxos = practical version                     │   │
│  │ Leader appends &     │                                                      │   │
│  │ replicates to        │ Used in: Chubby (Google), Cassandra (light)         │   │
│  │ majority before ack  │                                                      │   │
│  │                      │                                                      │   │
│  │ Used in: etcd,       │                                                      │   │
│  │ CockroachDB, Consul  │                                                      │   │
│  └──────────────────────┴──────────────────────────────────────────────────────┘   │
│                                                                                       │
│  DISTRIBUTED TRANSACTIONS:                                                           │
│  ┌──────────────────────────────┬──────────────────────────────────────────────┐   │
│  │    2PC (Two-Phase Commit)    │           SAGA Pattern                       │   │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │                              │                                              │   │
│  │ Phase 1: Coordinator asks    │ Sequence of local transactions               │   │
│  │   all participants to vote   │ Each publishes event/triggers next step      │   │
│  │                              │ On failure: compensating transactions        │   │
│  │ Phase 2: If all vote yes →   │                                              │   │
│  │   commit. If any no → abort  │ Choreography: events trigger next service    │   │
│  │                              │ Orchestration: central saga orchestrator     │   │
│  │ Problem: blocking, single    │                                              │   │
│  │ point of failure on coord.   │ Better for microservices than 2PC           │   │
│  └──────────────────────────────┴──────────────────────────────────────────────┘   │
│                                                                                       │
│  CONSISTENT HASHING:                                                                 │
│  • Map both nodes and keys to ring (0..2^32)                                       │
│  • Key assigned to nearest clockwise node                                           │
│  • Adding/removing node only remaps ~K/N keys (K=keys, N=nodes)                   │
│  • Virtual nodes: each physical node has multiple positions                        │
│  • Used in: Amazon DynamoDB, Apache Cassandra, Nginx load balancing                │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Observability / Quan Sát Hệ Thống

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                OBSERVABILITY                                          │
├──────────────────────────────┬────────────────────────────┬──────────────────────────┤
│           METRICS            │           LOGGING          │         TRACING          │
├──────────────────────────────┼────────────────────────────┼──────────────────────────┤
│                              │                            │                          │
│ What: numeric measurements   │ What: timestamped text     │ What: request flow       │
│ over time                    │ events                     │ across services          │
│                              │                            │                          │
│ Types:                       │ Levels:                    │ Concepts:                │
│ • Counter (always up)        │ • DEBUG  (dev only)        │ • Trace: end-to-end      │
│ • Gauge  (can go down)       │ • INFO   (normal ops)      │ • Span: single operation │
│ • Histogram (bucketed dist)  │ • WARN   (recoverable)     │ • TraceID: correlates    │
│ • Summary (quantiles)        │ • ERROR  (needs action)    │   spans across services  │
│                              │ • FATAL  (crash)           │                          │
│ 4 Golden Signals:            │                            │ W3C Trace Context:       │
│ 1. Latency (p50/p99/p999)   │ Structured logging:        │ traceparent header        │
│ 2. Traffic (QPS)             │ { "level": "error",        │                          │
│ 3. Errors (error rate %)     │   "msg": "DB timeout",     │ Tools:                   │
│ 4. Saturation (CPU/mem %)    │   "trace_id": "abc123",    │ • Jaeger                 │
│                              │   "user_id": 42 }          │ • Zipkin                 │
│ Tools:                       │                            │ • OpenTelemetry          │
│ • Prometheus + Grafana       │ Tools:                     │ • AWS X-Ray              │
│ • Datadog                    │ • ELK Stack                │                          │
│ • CloudWatch                 │ • Loki + Grafana           │                          │
│                              │ • Datadog                  │                          │
│ SLO/SLA/SLI:                 │                            │                          │
│ SLI: actual measurement      │ Log aggregation:           │                          │
│ SLO: target (99.9% uptime)  │ Fluentd/Filebeat →         │                          │
│ SLA: contractual commitment  │ Kafka → Elasticsearch      │                          │
│                              │                            │                          │
│ Error Budget:                │ PII: mask sensitive data   │                          │
│ 1 - SLO = budget for downtime│ in logs (GDPR compliance)  │                          │
│                              │                            │                          │
└──────────────────────────────┴────────────────────────────┴──────────────────────────┘
```

---

## 5. Message Queues / Hàng Đợi Tin Nhắn

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               MESSAGE QUEUES                                          │
├──────────────────────────────────────┬──────────────────────────────────────────────┤
│              KAFKA                   │             RABBITMQ                          │
├──────────────────────────────────────┼──────────────────────────────────────────────┤
│                                      │                                               │
│  Distributed log / event streaming   │  Message broker (AMQP protocol)              │
│                                      │                                               │
│  Concepts:                           │  Concepts:                                    │
│  • Topic: logical stream name        │  • Exchange: routes messages                  │
│  • Partition: ordered subset         │  • Queue: stores messages                    │
│  • Offset: position in partition     │  • Binding: exchange → queue rules           │
│  • Consumer Group: parallel consume  │  • Routing key: message routing              │
│  • Broker: Kafka server              │                                               │
│  • ZooKeeper / KRaft: metadata       │  Exchange types:                             │
│                                      │  • Direct: exact routing key match           │
│  Retention: time-based or size-based │  • Fanout: broadcast to all queues          │
│  Messages never deleted by consumers │  • Topic: pattern-based routing             │
│                                      │  • Headers: header attribute matching       │
│  Use cases:                          │                                               │
│  • Event streaming                   │  Use cases:                                   │
│  • Log aggregation                   │  • Task queues / work queues                 │
│  • Activity tracking                 │  • RPC (request-reply)                       │
│  • Stream processing (Kafka Streams) │  • Complex routing requirements              │
│  • Change data capture (CDC)         │  • At-most-once / at-least-once delivery     │
│                                      │                                               │
│  Throughput: millions msgs/sec       │  Throughput: thousands-tens of K msgs/sec    │
│  Durability: written to disk         │  Durability: configurable persistence        │
│                                      │                                               │
├──────────────────────────────────────┴──────────────────────────────────────────────┤
│                            MESSAGE DELIVERY GUARANTEES                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  At-most-once:   May lose messages, no duplicates  (best effort, fire and forget)   │
│  At-least-once:  May duplicate, no message loss    (ack after processing)           │
│  Exactly-once:   No loss, no duplicates           (hardest, idempotent consumers)   │
│                                                                                       │
│  Idempotency: Consumer checks if message already processed (deduplication key)      │
│                                                                                       │
│  PATTERNS:                                                                           │
│  ┌──────────────────┬──────────────────────────────────────────────────────────┐   │
│  │  Dead Letter Queue│ Failed messages → DLQ for inspection / retry            │   │
│  │  Fan-Out          │ One message → multiple queues/consumers                 │   │
│  │  Competing Consumers│ Multiple consumers on one queue (load balance)        │   │
│  │  Saga via Events  │ Microservice coordination through events                │   │
│  │  Outbox Pattern   │ Write to DB + outbox table, relay to MQ atomically      │   │
│  └──────────────────┴──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. gRPC / Protobuf

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               gRPC / PROTOBUF                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  Protocol Buffers (protobuf):                                                        │
│  • Binary serialization format (smaller, faster than JSON)                         │
│  • Schema defined in .proto files                                                   │
│  • Code generated for multiple languages                                            │
│                                                                                       │
│  syntax = "proto3";                                                                  │
│  message User {                                                                      │
│      uint64 id    = 1;                                                               │
│      string name  = 2;                                                               │
│      string email = 3;                                                               │
│  }                                                                                   │
│  service UserService {                                                               │
│      rpc GetUser(GetUserRequest) returns (User);                                    │
│      rpc ListUsers(ListRequest) returns (stream User);  // server streaming        │
│  }                                                                                   │
│                                                                                       │
│  gRPC COMMUNICATION TYPES:                                                          │
│  ┌─────────────────────┬────────────────────────────────────────────────────────┐  │
│  │  Unary              │ Single request → single response (like REST)           │  │
│  │  Server Streaming   │ Single request → stream of responses                   │  │
│  │  Client Streaming   │ Stream of requests → single response                   │  │
│  │  Bidirectional      │ Both sides stream (WebSocket-like)                     │  │
│  └─────────────────────┴────────────────────────────────────────────────────────┘  │
│                                                                                       │
│  gRPC vs REST:                                                                       │
│  ┌────────────────────────┬──────────────────────┬──────────────────────────────┐  │
│  │  Feature               │       REST           │          gRPC                │  │
│  ├────────────────────────┼──────────────────────┼──────────────────────────────┤  │
│  │  Protocol              │  HTTP/1.1            │  HTTP/2 (multiplexing)       │  │
│  │  Format                │  JSON (text)         │  Protobuf (binary)           │  │
│  │  Performance           │  Moderate            │  Fast (3-10× smaller msgs)  │  │
│  │  Browser support       │  Native              │  Needs grpc-web              │  │
│  │  Streaming             │  Limited             │  Built-in bidirectional      │  │
│  │  Code gen              │  Optional (OpenAPI)  │  Required (.proto → code)    │  │
│  │  Use case              │  Public APIs         │  Internal microservices       │  │
│  └────────────────────────┴──────────────────────┴──────────────────────────────┘  │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Quick Reference / Tham Khảo Nhanh

| Topic              | Key Concept                                    | Common Interview Question         |
| ------------------ | ---------------------------------------------- | --------------------------------- |
| Design Framework   | Requirements → Capacity → HLD → Deep Dive      | How to design Instagram?          |
| CAP Theorem        | Consistency, Availability, Partition tolerance | Pick 2 of 3                       |
| Consistent Hashing | Minimal rebalancing when nodes change          | How does DynamoDB shard?          |
| Rate Limiter       | Token bucket / sliding window                  | Design a distributed rate limiter |
| Raft Consensus     | Leader election + log replication              | How does etcd achieve consensus?  |
| SAGA Pattern       | Distributed transactions via compensation      | Microservice order workflow       |
| Kafka              | Durable log, consumer groups, offsets          | Kafka vs RabbitMQ                 |
| Observability      | Metrics, Logs, Traces (pillars of obs.)        | How to debug production latency?  |
| gRPC               | Binary protocol over HTTP/2                    | gRPC vs REST                      |
| Outbox Pattern     | Atomic DB write + event publishing             | Dual write problem                |

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh trước phỏng vấn
