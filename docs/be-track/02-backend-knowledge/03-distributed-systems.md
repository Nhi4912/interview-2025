# Distributed Systems - Deep Theory

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Microservices Architecture](./02-microservices.md), [Database Theory](../../shared/03-database/database-theory.md)
> **See also**: [Table of Contents](../../00-table-of-contents.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Flash Sale, 11.11:** 1 triệu user click "Buy" cùng lúc cho 1000 iPhone. Nếu dùng single database với `SELECT ... FOR UPDATE`, mọi request serialize — 1 giây để xử lý 1 request × 1 triệu request = 11 ngày. Giải pháp thực tế: Redis DECR (atomic, sub-millisecond) làm inventory counter, Kafka queue hóa orders, và chấp nhận rằng inventory count có thể temporarily negative — compensate sau.

**Bài học:** Distributed systems không phải "làm hệ thống lớn hơn" — mà là **trade-off engineering**: consistency vs availability, latency vs throughput. CAP theorem, eventual consistency, và idempotency là vocabulary bạn cần để nói chuyện được với senior engineers.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Distributed system giống **chuỗi nhà hàng franchise** — mỗi chi nhánh (node) phục vụ khách riêng, inventory riêng, nhưng phải "eventually" đồng bộ với trung tâm. Khi mạng đứt (partition), chi nhánh phải chọn: từ chối bán (CP) hay bán dù có thể hết hàng thật (AP)? Không có câu trả lời đúng — phụ thuộc vào business requirement.

**Why it matters for interviews:** Hầu hết hệ thống production ở Grab, Shopee, Tiki đều distributed. Hiểu CAP, consensus algorithms, và idempotency là baseline để discuss system design problems.

## Concept Map / Bản Đồ Khái Niệm

```
[Distributed Systems Fundamentals]
         │
         ├──► CAP Theorem: C vs A khi có Partition (P là mandatory)
         │       ├── CP: etcd, ZooKeeper, HBase, MongoDB (strong mode)
         │       └── AP: Cassandra, DynamoDB, CouchDB
         │
         ├──► Consistency Models (spectrum)
         │       Strong → Sequential → Causal → Eventual
         │
         ├──► Consensus Algorithms
         │       ├── Paxos (theoretical foundation)
         │       └── Raft (used in etcd, CockroachDB — easier to understand)
         │
         ├──► Distributed Transactions
         │       ├── 2PC (blocking, single point of failure)
         │       └── Saga (choreography / orchestration)
         │
         └──► Reliability Patterns
                 ├── Idempotency (safe retries)
                 ├── Exactly-once delivery (Kafka transactions)
                 └── Vector clocks (causal ordering)
```

---

## Overview / Tổng Quan

Distributed Systems là nền tảng engineering cho mọi hệ thống quy mô lớn — từ Shopee Flash Sale đến Grab ride-matching. File này cover 7 nhóm khái niệm cốt lõi:

| #   | Concept Group                  | Vai trò                                                           | Interview Weight |
| --- | ------------------------------ | ----------------------------------------------------------------- | ---------------- |
| 1   | CAP Theorem & PACELC           | Trade-off framework — mọi câu system design bắt đầu từ đây        | ⭐⭐⭐⭐⭐       |
| 2   | Consistency Models             | Spectrum từ Strong→Eventual — quyết định UX và correctness        | ⭐⭐⭐⭐         |
| 3   | Consensus & Leader Election    | Raft/Paxos — cách nodes đồng ý trong chaos                        | ⭐⭐⭐⭐         |
| 4   | Replication & Partitioning     | Scale data horizontally — consistent hashing, sharding strategies | ⭐⭐⭐⭐⭐       |
| 5   | Message Queues & Events        | Kafka/RabbitMQ — decouple services, handle backpressure           | ⭐⭐⭐⭐         |
| 6   | Distributed Locking & Caching  | Redis Redlock, cache patterns — practical interview favorites     | ⭐⭐⭐⭐         |
| 7   | Clocks, Failures & Idempotency | Vector clocks, split brain, exactly-once — deep senior topics     | ⭐⭐⭐           |

**Mối quan hệ:** CAP/PACELC (1) là framework → Consistency Models (2) là spectrum cụ thể → Consensus (3) là mechanism đảm bảo consistency → Replication/Partitioning (4) là cách scale → Message Queues (5) decouple communication → Locking/Caching (6) giải quyết contention → Clocks/Failures/Idempotency (7) xử lý edge cases trong production.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: CAP Theorem & PACELC

**🧠 Memory Hook:** "**CAP = Choose 2 of 3, but P is mandatory → really C vs A.** PACELC adds: Even without partition, Latency vs Consistency."

**Tại sao tồn tại / Why exists:**

- Level 1: Network partitions are inevitable in distributed systems — must choose behavior during partition
- Level 2: Brewer proved (2000) that simultaneous C+A+P is impossible → formalized what practitioners knew intuitively
- Level 3: PACELC (Abadi 2012) extends: even without partition (E), you trade Latency vs Consistency — this explains why DynamoDB chooses eventual consistency for speed

**❌ Common Mistakes:**

- "MongoDB is CP" → Depends on configuration (writeConcern: majority = CP, writeConcern: 1 = AP behavior)
- Thinking CAP applies to single-node systems → CAP only relevant when data replicated across nodes
- Ignoring PACELC → Most production time is partition-free, so E/L vs E/C tradeoff matters more daily

**🎯 Interview Pattern:** "Design a system where consistency matters" → Start with CAP position → Justify CP or AP → Then discuss PACELC for normal operation latency tradeoffs

**🔗 Knowledge Chain:** CAP Theorem → Consistency Models → Consensus Algorithms → Replication Strategies

### Concept 2: Consistency Models

**🧠 Memory Hook:** "**Strong → Sequential → Causal → Eventual = Strictness spectrum.** Strong = expensive, Eventual = fast but stale."

**Tại sao tồn tại / Why exists:**

- Level 1: Different applications need different guarantees — banking needs strong, social feed accepts eventual
- Level 2: Stronger consistency requires more coordination (network round-trips) → higher latency, lower throughput
- Level 3: Tunable consistency (Cassandra QUORUM) lets you pick per-query — read-heavy analytics uses ONE, payment uses ALL

**❌ Common Mistakes:**

- "Eventual consistency means data will be wrong" → No, it means temporarily stale, will converge
- Confusing linearizability with serializability → Linearizability = single-object real-time, Serializability = multi-object transaction ordering
- Not knowing tunable consistency exists → Miss that you can mix models in same system

**🎯 Interview Pattern:** "How do you handle stale reads?" → Explain consistency spectrum → Propose tunable consistency → Show tradeoff awareness

**🔗 Knowledge Chain:** Consistency Models → Tunable Consistency → Read-Your-Writes → Session Guarantees

### Concept 3: Consensus & Leader Election

**🧠 Memory Hook:** "**Raft = Understandable Paxos.** 3 phases: Leader Election → Log Replication → Safety. Majority quorum = (N/2)+1."

**Tại sao tồn tại / Why exists:**

- Level 1: Multiple nodes must agree on a single value (leader, committed log entry) despite failures
- Level 2: FLP impossibility (1985) proves no deterministic algorithm solves consensus in async network with even 1 crash → Raft uses timeouts (partial synchrony) to work around this
- Level 3: Raft separates concerns (leader election, log replication, safety) making it implementable — used in etcd, CockroachDB, TiKV

**❌ Common Mistakes:**

- "Raft needs all nodes to agree" → Only majority (quorum) needed — 3-node cluster tolerates 1 failure
- Confusing leader election with distributed locking → Election chooses 1 leader, lock protects a resource
- Not understanding split-brain risk when quorum not maintained

**🎯 Interview Pattern:** "How does etcd ensure consistency?" → Explain Raft → Leader election with term numbers → Log replication with majority commit

**🔗 Knowledge Chain:** Consensus → Raft/Paxos → etcd/ZooKeeper → Service Discovery → Leader Election

### Concept 4: Replication & Partitioning

**🧠 Memory Hook:** "**Replication = copies for availability. Partitioning = splits for scale.** Consistent hashing = minimize reshuffling when nodes change."

**Tại sao tồn tại / Why exists:**

- Level 1: Single node can't handle all data/traffic — must distribute across machines
- Level 2: Replication handles read scale + fault tolerance. Partitioning handles write scale + data size
- Level 3: Consistent hashing (Karger 1997) solves the "add/remove node = reshuffle everything" problem — only K/N keys move on average

**❌ Common Mistakes:**

- Confusing replication with partitioning → Replication = same data on multiple nodes, Partitioning = different data on different nodes
- "Hash partitioning is always better" → Range partitioning needed for range queries (time-series data)
- Not using virtual nodes with consistent hashing → Physical nodes get uneven load

**🎯 Interview Pattern:** "Design a distributed key-value store" → Consistent hashing for partitioning → Replication factor for durability → Quorum reads/writes for consistency

**🔗 Knowledge Chain:** Partitioning → Consistent Hashing → Virtual Nodes → Rebalancing → Hot Spots

### Concept 5: Message Queues & Event Streaming

**🧠 Memory Hook:** "**Queue = task distribution (RabbitMQ). Stream = event log (Kafka).** Queue: message consumed once. Stream: message replayable."

**Tại sao tồn tại / Why exists:**

- Level 1: Synchronous service-to-service calls create tight coupling and cascade failures
- Level 2: Queues enable load leveling (absorb spikes), streams enable event sourcing (replay history)
- Level 3: Kafka's log-based architecture (immutable append-only) enables both messaging and stream processing — consumer groups for parallel processing, compaction for state snapshots

**❌ Common Mistakes:**

- Using Kafka for simple task queues → Overkill, RabbitMQ simpler for fire-and-forget tasks
- "Kafka guarantees exactly-once" → Only within Kafka transactions (producer + consumer in same Kafka cluster)
- Not understanding consumer group rebalancing → Can cause duplicate processing during rebalance

**🎯 Interview Pattern:** "How to handle 100K orders/sec?" → Kafka for ingestion → Consumer groups for parallel processing → Idempotent consumers for exactly-once semantics

**🔗 Knowledge Chain:** Message Queues → Event Streaming → Event Sourcing → CQRS → Saga Pattern

### Concept 6: Distributed Locking & Caching

**🧠 Memory Hook:** "**Redlock = Redis distributed lock with majority quorum. Cache patterns: Cache-Aside (lazy), Write-Through (eager), Write-Behind (async).**"

**Tại sao tồn tại / Why exists:**

- Level 1: Multiple services accessing shared resources need mutual exclusion
- Level 2: Single Redis lock has SPOF — Redlock uses N independent Redis instances with majority agreement
- Level 3: Martin Kleppmann's critique: Redlock unsafe because Redis lacks consensus — use ZooKeeper/etcd for safety-critical locks. But Redlock fine for efficiency locks (prevent duplicate work)

**❌ Common Mistakes:**

- Using SETNX without TTL → Lock never released if holder crashes
- "Redlock is always safe" → Not safe for correctness-critical operations (Kleppmann critique)
- Cache stampede: all caches expire simultaneously → Use jittered TTL + singleflight pattern

**🎯 Interview Pattern:** "Design a rate limiter" → Redis atomic operations → Distributed lock for cross-node coordination → Cache for counter state

**🔗 Knowledge Chain:** Distributed Lock → Redlock → Fencing Tokens → ZooKeeper Locks → Lease-based Locks

### Concept 7: Clocks, Failures & Idempotency

**🧠 Memory Hook:** "**Physical clocks lie. Logical clocks (Lamport/Vector) track causality. Idempotency = safe retries = f(f(x)) = f(x).**"

**Tại sao tồn tại / Why exists:**

- Level 1: Network unreliability means requests can be duplicated, reordered, or lost — idempotency makes retries safe
- Level 2: NTP clock sync has millisecond drift — cannot use wall clock for ordering events across nodes
- Level 3: Hybrid Logical Clocks (HLC) combine physical + logical: physical for rough ordering, logical for causality — used in CockroachDB, MongoDB

**❌ Common Mistakes:**

- Using timestamps for event ordering → Clock skew causes incorrect ordering
- "Exactly-once delivery is possible" → Only exactly-once processing (via idempotent consumers), delivery is at-least-once
- Not using idempotency keys in APIs → Payment processed multiple times on retry

**🎯 Interview Pattern:** "How to prevent duplicate payments?" → Idempotency key → Deduplication table → At-least-once delivery + idempotent processing = exactly-once semantics

**🔗 Knowledge Chain:** Wall Clocks → NTP Drift → Lamport Clocks → Vector Clocks → HLC → Idempotency Keys

---

## 1. CAP Theorem

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: CAP Theorem là gì? Giải thích chi tiết từng thuộc tính. 🟢 🟢 [Junior]

**A:**

CAP Theorem (Eric Brewer, 2000) phát biểu rằng một hệ thống phân tán chỉ có thể đảm bảo **tối đa 2 trong 3** thuộc tính sau:

| Property                    | Definition                                                                                         | Ý nghĩa thực tế                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Consistency (C)**         | Every read receives the most recent write or an error                                              | Mọi node trả về cùng dữ liệu tại cùng thời điểm. Linearizability - hệ thống hoạt động như thể chỉ có 1 bản copy |
| **Availability (A)**        | Every request receives a (non-error) response, without guarantee it contains the most recent write | Mọi request đều nhận được response (không bị timeout hay error), dù data có thể stale                           |
| **Partition Tolerance (P)** | System continues to operate despite network partitions between nodes                               | Hệ thống vẫn hoạt động khi mạng bị chia cắt (message giữa các node bị mất/delay)                                |

**Tại sao thực tế chỉ là C vs A:**

Trong mạng thực tế, partition **luôn có thể xảy ra** (cable đứt, switch hỏng, cloud AZ mất kết nối). Vì vậy P là bắt buộc. Câu hỏi thực sự là:

```
Khi partition xảy ra, bạn chọn gì?
├── CP: Từ chối request (sacrifice Availability) để đảm bảo Consistency
└── AP: Vẫn trả response (sacrifice Consistency) nhưng data có thể stale
```

### Q: Phân biệt CP và AP systems với ví dụ cụ thể? 🟡 🟡 [Mid]

**A:**

**CP Systems** - Ưu tiên Consistency khi có Partition:

```
┌─────────────────────────────────────────────────┐
│  CP System: Khi partition xảy ra                │
│                                                 │
│  Client ──▶ [Node A] ──✕──  [Node B]           │
│              │                  │                │
│              │  Partition!      │                │
│              │                  │                │
│              ▼                  ▼                │
│         REJECT write      REJECT write          │
│         (return error)    (return error)         │
│                                                 │
│  → Không node nào chấp nhận write nếu không     │
│    confirm được majority                        │
└─────────────────────────────────────────────────┘
```

| System                   | Cách đảm bảo CP                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- |
| **etcd**                 | Raft consensus - write cần majority nodes đồng ý                                 |
| **ZooKeeper**            | ZAB protocol - leader phải confirm với majority                                  |
| **HBase**                | Single master cho mỗi region, nếu master down → unavailable cho đến khi failover |
| **MongoDB** (w:majority) | Write concern majority - write phải được xác nhận bởi majority                   |

**AP Systems** - Ưu tiên Availability khi có Partition:

```
┌─────────────────────────────────────────────────┐
│  AP System: Khi partition xảy ra                │
│                                                 │
│  Client ──▶ [Node A] ──✕──  [Node B] ◀── Client│
│              │                  │                │
│              │  Partition!      │                │
│              ▼                  ▼                │
│         ACCEPT write      ACCEPT write          │
│         (local data)      (local data)          │
│              │                  │                │
│              └──── Reconcile ───┘                │
│                  (after heal)                    │
│                                                 │
│  → Cả hai node vẫn serve request, resolve       │
│    conflict sau khi partition heal               │
└─────────────────────────────────────────────────┘
```

| System        | Cách đảm bảo AP                                    |
| ------------- | -------------------------------------------------- |
| **Cassandra** | Tunable consistency, mặc định eventual consistency |
| **DynamoDB**  | Eventual consistent reads mặc định, hinted handoff |
| **CouchDB**   | Multi-version concurrency, conflict resolution     |

### Q: PACELC Theorem là gì? Tại sao nó mở rộng CAP? 🔴 🔴 [Senior]

**A:**

CAP chỉ nói về trường hợp có Partition. Nhưng **phần lớn thời gian hệ thống không bị partition**. PACELC (Daniel Abadi) mở rộng:

```
if (Partition) {
    choose between Availability and Consistency    // giống CAP
} else {
    choose between Latency and Consistency         // tradeoff bình thường
}
```

| System         | P+A vs P+C | E+L vs E+C | Giải thích                                                                |
| -------------- | ---------- | ---------- | ------------------------------------------------------------------------- |
| Cassandra      | PA         | EL         | Khi partition → vẫn available; bình thường → ưu tiên low latency          |
| DynamoDB       | PA         | EL         | Tương tự Cassandra                                                        |
| MongoDB        | PC         | EC         | Khi partition → ưu tiên consistency; bình thường cũng ưu tiên consistency |
| etcd/ZooKeeper | PC         | EC         | Luôn ưu tiên consistency                                                  |
| Cosmos DB      | PA/PC      | EL/EC      | Tunable - cho phép chọn cả hai chiều                                      |

**Real-world: Grab CAP tradeoffs:**

- **Payment service**: CP - Không thể chấp nhận inconsistency trong tiền bạc. Dùng strong consistency (majority write). Nếu partition → reject transaction.
- **Location tracking**: AP - Driver location cần update liên tục, stale location 2-3 giây vẫn chấp nhận được. Availability quan trọng hơn.
- **Chat/notification**: AP - Tin nhắn có thể delay nhưng không được mất. Eventual consistency là đủ.

---

## 2. Consistency Models

### Q: Giải thích các consistency model từ mạnh đến yếu? 🟡 🟡 [Mid]

**A:**

```
Strong ◀──────────────────────────────────────▶ Weak

Linearizability → Sequential → Causal → Eventual
      │               │           │          │
  Mọi op thấy    Mọi client   Chỉ ops có   Cuối cùng
  state mới      thấy cùng    quan hệ      tất cả sẽ
  nhất ngay      thứ tự ops   nhân quả     converge
                              phải ordered
```

**Linearizability (Strongest):**

- Mọi operation diễn ra "atomically" tại một thời điểm giữa invocation và response
- External observer không thể phân biệt với single-server system
- Ví dụ: Nếu write(x=2) hoàn thành trước read(x) bắt đầu → read phải trả về 2
- Cost: **Rất cao** - cần coordination giữa tất cả nodes, tăng latency

**Sequential Consistency:**

- Mọi client thấy operations theo **cùng một thứ tự**, nhưng thứ tự đó **không nhất thiết phải là real-time order**
- Khác linearizability: cho phép "re-order" miễn sao tất cả đồng ý cùng order
- Ví dụ: Client A write x=1 rồi y=2. Client B có thể thấy y=2 trước x=1, nhưng MỌI client phải thấy cùng thứ tự

**Causal Consistency:**

- Operations có quan hệ nhân quả (cause-effect) phải được thấy theo đúng thứ tự
- Operations không liên quan (concurrent) có thể thấy khác thứ tự trên mỗi node
- Ví dụ: User A post "Hello", User B reply "Hi back" → Mọi người phải thấy "Hello" trước "Hi back"

**Read-Your-Writes (Session Consistency):**

- Sau khi client write, chính client đó luôn đọc được giá trị vừa write
- Các client khác có thể chưa thấy
- Implementation: sticky session hoặc read from leader

**Monotonic Reads:**

- Nếu client đã đọc được version X, các read tiếp theo không bao giờ trả về version cũ hơn X
- Ngăn "time travel" - đọc data mới rồi bỗng thấy data cũ

**Eventual Consistency (Weakest useful):**

- Nếu không có write mới, cuối cùng tất cả replicas sẽ converge về cùng giá trị
- Không đảm bảo khi nào converge hoặc thứ tự nào
- DNS là ví dụ kinh điển

### Q: Tunable Consistency trong Cassandra hoạt động thế nào? 🔴 🔴 [Senior]

**A:**

Cassandra cho phép **chọn consistency level per-query**:

```
N = total replicas (thường 3)
W = number of nodes must ACK a write
R = number of nodes must respond to a read

Rule: W + R > N → Strong consistency
      W + R ≤ N → Eventual consistency
```

| Level         | W   | R   | W+R vs N | Consistency   | Latency    | Use case             |
| ------------- | --- | --- | -------- | ------------- | ---------- | -------------------- |
| ONE/ONE       | 1   | 1   | 2 ≤ 3    | Eventual      | Thấp nhất  | Logging, metrics     |
| ONE/QUORUM    | 1   | 2   | 3 = 3    | Hmm, tricky\* | Trung bình | Read-heavy eventual  |
| QUORUM/QUORUM | 2   | 2   | 4 > 3    | Strong        | Cao        | Financial, inventory |
| ALL/ONE       | 3   | 1   | 4 > 3    | Strong        | Write chậm | Write ít, read nhiều |
| ALL/ALL       | 3   | 3   | 6 > 3    | Strong        | Rất cao    | Không nên dùng       |

\*ONE/QUORUM: Nếu write ONE thành công trên node A, nhưng chưa replicate sang B,C → read QUORUM đọc B,C → miss write → NOT strong.

**Tradeoff thực tế:** QUORUM/QUORUM là sweet spot phổ biến nhất cho dữ liệu quan trọng.

---

## 3. Consensus Algorithms

### Q: Tại sao consensus trong distributed systems khó? 🔴 🔴 [Senior]

**A:**

**FLP Impossibility Theorem** (Fischer, Lynch, Paterson, 1985):

> Trong hệ thống asynchronous (không có upper bound cho message delay), **không tồn tại** deterministic consensus algorithm nào đảm bảo termination nếu dù chỉ **1 process có thể crash**.

Điều này có nghĩa: mọi consensus algorithm thực tế đều phải **trade-off**:

- **Paxos/Raft**: Dùng timeout để detect failure → có thể "block" nếu timeout sai
- **Randomized**: Dùng random để phá symmetry → terminate "with probability 1" nhưng không deterministic

### Q: Raft consensus algorithm hoạt động thế nào? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

Raft được thiết kế để **dễ hiểu hơn Paxos** (Diego Ongaro, 2014). Chia consensus thành 3 sub-problems:

#### 1. Leader Election

Mỗi node ở 1 trong 3 state: **Follower**, **Candidate**, **Leader**

```
                    timeout, start election
            ┌──────────────────────────────────┐
            │                                  ▼
     ┌──────────┐                      ┌──────────────┐
     │ Follower │                      │  Candidate   │
     └──────────┘                      └──────────────┘
         ▲  ▲                            │     │    ▲
         │  │   discover leader/         │     │    │
         │  │   new term                 │     │    │
         │  └────────────────────────────┘     │    │
         │                                     │    │
         │        win election (majority)      │    │
         │  ┌──────────────────────────────────┘    │
         │  │        timeout, new election          │
         │  ▼        (split vote) ──────────────────┘
     ┌──────────┐
     │  Leader  │
     └──────────┘
```

**Election flow chi tiết:**

```
Term 1: Node A is Leader
═══════════════════════════════════════════

Node A (Leader)  ──heartbeat──▶  Node B (Follower)
                 ──heartbeat──▶  Node C (Follower)

[Node A crashes]

Term 2: Election
═══════════════════════════════════════════

Time ───────────────────────────────────────────▶

Node B: ...waiting...election timeout!
        Increment term → 2
        Vote for self
        Send RequestVote(term=2) to A, C
                    │
Node C: ◀───────────┘ Receive RequestVote
        term 2 > my term 1 → grant vote
        Reply: VoteGranted=true
                    │
Node B: ◀───────────┘ Got 2 votes (self + C)
        2 > majority(3)/2 = 2 → I am Leader!
        Start sending heartbeats

Node A: [still down, doesn't matter]
```

**Key mechanisms ngăn split brain:**

1. **Term number**: Monotonically increasing. Mỗi term có tối đa 1 leader. Nếu nhận message với term cao hơn → revert to follower.

2. **Randomized election timeout**: Mỗi node có timeout ngẫu nhiên (150-300ms). Giảm xác suất 2 nodes cùng trở thành candidate.

3. **Majority vote**: Cần > N/2 votes. Vì chỉ có 1 majority set, không thể có 2 leaders cùng term.

#### 2. Log Replication

```
Leader nhận write request → append to log → replicate to followers
→ wait majority ACK → commit → apply to state machine → reply client

┌─────────────────────────────────────────────────────────────┐
│                    Log Replication Flow                       │
│                                                              │
│  Client                                                      │
│    │                                                         │
│    │ SET x=5                                                 │
│    ▼                                                         │
│  Leader (Node A)                                             │
│    │  Log: [..., (term=3, SET x=5)]                         │
│    │                                                         │
│    ├──AppendEntries──▶ Node B                               │
│    │                    Append to log                        │
│    │                    Reply: success                       │
│    │                                                         │
│    ├──AppendEntries──▶ Node C                               │
│    │                    Append to log                        │
│    │                    Reply: success                       │
│    │                                                         │
│    │  Got 3/3 ACKs (majority = 2 needed)                    │
│    │  commitIndex++ → entry committed                       │
│    │  Apply to state machine                                │
│    │                                                         │
│    ▼                                                         │
│  Client: OK (x=5 committed)                                 │
│                                                              │
│  Next heartbeat carries updated commitIndex                  │
│  → Followers also apply committed entries                    │
└─────────────────────────────────────────────────────────────┘
```

**Log structure:**

```
Index:    1        2        3        4        5
        ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
Leader: │t=1 │  │t=1 │  │t=2 │  │t=3 │  │t=3 │  commitIndex=5
        │x=1 │  │y=2 │  │x=3 │  │y=7 │  │x=5 │
        └────┘  └────┘  └────┘  └────┘  └────┘

        ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐
Node B: │t=1 │  │t=1 │  │t=2 │  │t=3 │  │t=3 │  commitIndex=4
        │x=1 │  │y=2 │  │x=3 │  │y=7 │  │x=5 │  (chưa nhận commit cho 5)
        └────┘  └────┘  └────┘  └────┘  └────┘

        ┌────┐  ┌────┐  ┌────┐
Node C: │t=1 │  │t=1 │  │t=2 │                    (lagging behind)
        │x=1 │  │y=2 │  │x=3 │                    commitIndex=3
        └────┘  └────┘  └────┘
```

#### 3. Safety Properties

**Election Restriction**: Candidate chỉ thắng election nếu log của nó **ít nhất up-to-date bằng** majority. Khi nhận RequestVote, voter kiểm tra:

- Candidate's last log term > voter's last log term → grant
- Candidate's last log term == voter's last log term AND candidate's log length ≥ voter's → grant
- Otherwise → reject

Điều này đảm bảo: **Leader luôn chứa tất cả committed entries**.

**Log Matching Property**: Nếu 2 logs chứa entry cùng index và term → tất cả entries trước đó cũng giống nhau.

**etcd & Raft**: etcd (viết bằng Go) là implementation phổ biến nhất của Raft. Kubernetes dùng etcd làm data store → mọi cluster state đều qua Raft consensus.

### Q: So sánh Paxos vs Raft vs ZAB? 🔴 🔴 [Senior]

**A:**

| Aspect                | Paxos                           | Raft                        | ZAB                          |
| --------------------- | ------------------------------- | --------------------------- | ---------------------------- |
| **Author**            | Lamport (1989)                  | Ongaro (2014)               | Yahoo (2008)                 |
| **Understandability** | Rất khó                         | Thiết kế để dễ hiểu         | Trung bình                   |
| **Leader**            | Không bắt buộc (Multi-Paxos có) | Bắt buộc strong leader      | Bắt buộc (primary)           |
| **Phases**            | Prepare → Accept                | RequestVote → AppendEntries | Discovery → Sync → Broadcast |
| **Log ordering**      | Không đảm bảo gap-free          | Gap-free, sequential        | Gap-free, sequential         |
| **Used by**           | Chubby (Google)                 | etcd, CockroachDB, TiKV     | ZooKeeper                    |
| **Golang impl**       | Ít                              | etcd/raft, hashicorp/raft   | Không (Java)                 |

---

## 4. Replication

### Q: So sánh các replication strategies? 🟡 🟡 [Mid]

**A:**

#### Single-Leader (Master-Slave)

```
┌────────┐  write   ┌────────┐  replicate  ┌────────────┐
│ Client ├─────────▶│ Leader ├────────────▶│ Follower 1 │
└────────┘          │(Master)│             └────────────┘
     │              │        ├────────────▶┌────────────┐
     │   read       │        │  replicate  │ Follower 2 │
     └─────────────▶└────────┘             └────────────┘
           (or read from followers
            with possible staleness)
```

**Sync vs Async replication:**

| Aspect           | Synchronous                    | Asynchronous                                        | Semi-synchronous                 |
| ---------------- | ------------------------------ | --------------------------------------------------- | -------------------------------- |
| **Flow**         | Leader waits ALL followers ACK | Leader returns immediately, replicate in background | Leader waits 1+ follower ACK     |
| **Durability**   | Cao nhất                       | Có thể mất data nếu leader crash                    | Trung bình                       |
| **Latency**      | Cao (wait slowest replica)     | Thấp                                                | Trung bình                       |
| **Availability** | Bất kỳ follower chậm → block   | Không block                                         | Block nếu không đủ ACK           |
| **Ví dụ**        | Rare (quá chậm)                | MySQL default, PostgreSQL streaming                 | MySQL semi-sync, etcd (majority) |

**Leader failover process:**

```
1. Detect leader failure (timeout-based)
2. Choose new leader (follower with most up-to-date log)
3. Reconfigure: clients redirect to new leader
4. Old leader rejoins as follower (if recovers)

Pitfalls:
- Split brain: cả old và new leader đều accept writes
  → Giải quyết: fencing (STONITH), epoch numbers
- Data loss: async replicated data chưa đến followers
  → Giải quyết: semi-sync, hoặc chấp nhận loss
```

#### Multi-Leader

Use case chính: **Multi-datacenter replication**

```
┌──── DC: Ho Chi Minh ────┐    ┌──── DC: Singapore ────┐
│                          │    │                        │
│  Client ──▶ Leader A ◄──────────▶ Leader B ◀── Client │
│             │            │    │          │              │
│          Follower A1     │    │       Follower B1      │
│          Follower A2     │    │       Follower B2      │
│                          │    │                        │
└──────────────────────────┘    └────────────────────────┘
      Async replication between leaders (conflict possible!)
```

**Conflict resolution strategies:**

| Strategy                  | Cách hoạt động               | Pros                    | Cons                 |
| ------------------------- | ---------------------------- | ----------------------- | -------------------- |
| **Last-Write-Wins (LWW)** | Timestamp lớn nhất thắng     | Đơn giản                | Mất data, clock skew |
| **Custom resolution**     | Application logic quyết định | Linh hoạt               | Phức tạp             |
| **CRDTs**                 | Data structures tự merge     | Automatic, no conflicts | Hạn chế data types   |
| **Operational Transform** | Transform concurrent ops     | Google Docs dùng        | Rất phức tạp         |

#### Leaderless (Dynamo-style)

```
Client writes to AND reads from multiple nodes simultaneously

Write (W=2):                Read (R=2):

Client ──▶ Node A ✓        Client ──▶ Node A (x=5, v3)
       ──▶ Node B ✓               ──▶ Node B (x=5, v3)
       ──▶ Node C ✗ (down)        ──▶ Node C (x=3, v1) ← stale!

W=2 satisfied → success    R=2 satisfied, return latest version (v3)
                           Trigger read repair on Node C
```

**Quorum: W + R > N đảm bảo ít nhất 1 node có latest value:**

```
N=3 nodes, W=2, R=2:

Nodes:     A    B    C
Write v2:  ✓    ✓    ✗     (W=2 satisfied)

Read:      ✓    ✗    ✓     (R=2 satisfied)
           v2        v1

Ít nhất 1 node trong read set (A) có v2 → client nhận v2
```

**Anti-entropy mechanisms:**

- **Read repair**: Khi read detect stale node → send latest value
- **Anti-entropy process**: Background process compare và sync data giữa replicas (dùng Merkle trees)
- **Hinted handoff**: Khi target node down, write tạm vào node khác kèm "hint" để forward khi target up lại

### Replication Strategy Comparison

| Aspect               | Single-Leader              | Multi-Leader              | Leaderless                |
| -------------------- | -------------------------- | ------------------------- | ------------------------- |
| **Write conflict**   | Không (single point)       | Có thể xảy ra             | Có thể xảy ra             |
| **Write latency**    | 1 RTT to leader            | Local DC latency          | Max(W nodes RTT)          |
| **Read scalability** | Cao (read from followers)  | Cao                       | Cao                       |
| **Complexity**       | Thấp                       | Cao (conflict resolution) | Trung bình                |
| **Failover**         | Cần election               | Tự động (other leaders)   | Tự động (no leader)       |
| **Consistency**      | Strong possible            | Eventual                  | Tunable (quorum)          |
| **Ví dụ**            | PostgreSQL, MySQL, MongoDB | CouchDB, MySQL Group Rep  | Cassandra, DynamoDB, Riak |

---

## 5. Data Partitioning / Sharding

### Q: Tại sao cần sharding? So sánh các partitioning strategies? 🟡 🟡 [Mid]

**A:**

**Lý do shard:**

1. **Capacity**: Single node không đủ disk cho toàn bộ data
2. **Throughput**: Tăng write throughput bằng cách phân tải sang nhiều nodes
3. **Latency**: Data gần user hơn (geo-partitioning)

| Strategy            | Cách hoạt động                     | Ưu điểm                               | Nhược điểm                                                    |
| ------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| **Range-based**     | key range [A-M]→Node1, [N-Z]→Node2 | Range queries hiệu quả, data locality | Hot spots (ví dụ: tên bắt đầu bằng "Nguyễn" ở VN)             |
| **Hash-based**      | hash(key) % N → Node               | Phân phối đều                         | Mất range query capability, thêm/bớt node → reshuffle toàn bộ |
| **Directory-based** | Lookup table: key → node           | Linh hoạt, chuyển data dễ             | Single point of failure (lookup service), thêm hop            |

### Q: Consistent Hashing hoạt động thế nào? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

**Vấn đề với hash(key) % N:**

- Thêm 1 node (N→N+1): ~toàn bộ keys phải di chuyển
- Ví dụ: N=3→4, key hash=7: 7%3=1 → 7%4=3 (di chuyển!)

**Consistent Hashing giải quyết: chỉ di chuyển ~K/N keys (K = total keys)**

```
Hash Ring (0 to 2^32 - 1):

              0 / 2^32
               │
        ┌──────┴──────┐
       ╱                ╲
      │    Node A        │
      │    (pos: 50)     │
     ╱                    ╲
    │                      │
    │                      │  Node B
    │                      │  (pos: 150)
    │                      │
     ╲                    ╱
      │                  │
      │    Node C        │
       ╲   (pos: 230)  ╱
        └──────┬──────┘
               │
              180

Key "user:123" → hash = 80 → đi theo chiều kim đồng hồ
→ gặp Node B (150) đầu tiên → stored on Node B

Key "order:456" → hash = 200 → clockwise
→ gặp Node C (230) → stored on Node C
```

**Thêm Node D (pos: 120):**

```
Trước:   keys [51..150]  → Node B
Sau:     keys [51..120]  → Node D (di chuyển!)
         keys [121..150] → Node B (giữ nguyên)

Chỉ ~1/N keys di chuyển, không phải toàn bộ!
```

**Vấn đề: Data imbalance** - Nếu ít nodes, phân phối không đều trên ring.

**Giải pháp: Virtual Nodes (vnodes)**

```
Thay vì 1 position/node → mỗi node có nhiều positions (vnodes):

Ring with Virtual Nodes:
              0
              │
       ┌──────┴──────┐
      ╱    A1         ╲
     │          B1     │
     │    C1           │
    ╱          A2       ╲
   │     B2              │
   │           C2        │
    ╲    A3             ╱
     │          B3     │
     │    C3           │
      ╲        A4     ╱
       └──────┬──────┘
              │

A1, A2, A3, A4 = 4 virtual nodes of Node A
B1, B2, B3    = 3 virtual nodes of Node B
C1, C2, C3    = 3 virtual nodes of Node C

Nhiều vnodes hơn → phân phối đều hơn
Khi Node A down → data phân tán sang B và C (không dồn hết vào 1 node)
```

**Ai dùng Consistent Hashing:**

- **Cassandra**: Partitioner dùng consistent hashing với vnodes (mặc định 256 vnodes/node)
- **DynamoDB**: Consistent hashing cho partition key
- **Redis Cluster**: 16384 hash slots (dạng biến thể), mỗi node quản lý 1 subset
- **CDN (Akamai)**: Route request tới cache server gần nhất

### Q: Secondary indexes với partitioning? 🔴 🔴 [Senior]

**A:**

| Approach                         | Cách hoạt động                                              | Ưu điểm                  | Nhược điểm                                                           |
| -------------------------------- | ----------------------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| **Local index** (document-based) | Mỗi partition maintain index cho data của nó                | Write nhanh (local)      | Read cần scatter-gather tới TẤT CẢ partitions                        |
| **Global index** (term-based)    | Index được partition riêng (ví dụ: color=red → partition 1) | Read chỉ cần 1 partition | Write chậm (cần update index ở partition khác), eventual consistency |

---

## 6. Message Queues & Event Streaming

### Q: Message Queue vs Event Stream khác nhau cơ bản thế nào? 🟡 🟡 [Mid]

**A:**

```
Message Queue (RabbitMQ):           Event Stream (Kafka):

Producer ──▶ Queue ──▶ Consumer     Producer ──▶ Log ──▶ Consumer A
                                                    ──▶ Consumer B
                                                    ──▶ Consumer C

- Message consumed = deleted         - Events retained (configurable)
- Single consumer per message         - Multiple consumers independently
- No replay                          - Replay by offset possible
- Point-to-point hoặc pub/sub        - Append-only immutable log
- Smart broker, dumb consumer         - Dumb broker, smart consumer
```

| Aspect          | Message Queue                                          | Event Stream                             |
| --------------- | ------------------------------------------------------ | ---------------------------------------- |
| **Paradigm**    | Temporary mailbox                                      | Immutable append-only log                |
| **Consumption** | Destructive (message removed after ACK)                | Non-destructive (consumer tracks offset) |
| **Replay**      | Không thể                                              | Có thể (seek to offset)                  |
| **Ordering**    | Toàn queue (hoặc không đảm bảo nếu multiple consumers) | Per-partition ordering                   |
| **Use case**    | Task distribution, RPC                                 | Event sourcing, analytics, data pipeline |

### Q: Kafka architecture và guarantees? (DEEP DIVE) 🔴 🔴 [Senior]

**A:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     Kafka Cluster                                │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ Broker 0 │  │ Broker 1 │  │ Broker 2 │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                  │
│  Topic: "orders" (3 partitions, replication factor = 2)         │
│                                                                  │
│  Partition 0: Broker 0 (L)  Broker 1 (F)                       │
│  Partition 1: Broker 1 (L)  Broker 2 (F)                       │
│  Partition 2: Broker 2 (L)  Broker 0 (F)                       │
│               L = Leader, F = Follower                          │
│                                                                  │
│  ┌─────────────────────────────┐                                │
│  │ Partition 0 (immutable log) │                                │
│  │ ┌───┬───┬───┬───┬───┬───┐  │                                │
│  │ │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │  │  ◀── offsets                  │
│  │ └───┴───┴───┴───┴───┴───┘  │                                │
│  │           ▲           ▲     │                                │
│  │     Consumer A    Consumer B│  (independent offsets)          │
│  └─────────────────────────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

**Consumer Groups:**

```
Topic "orders" (3 partitions)

Consumer Group "order-service":
  Consumer 1 ← Partition 0, Partition 1
  Consumer 2 ← Partition 2

Consumer Group "analytics":
  Consumer 3 ← Partition 0
  Consumer 4 ← Partition 1
  Consumer 5 ← Partition 2

Rules:
- Mỗi partition chỉ assigned cho 1 consumer trong 1 group
- 1 consumer có thể handle nhiều partitions
- Nếu consumers > partitions → some consumers idle
- Khác group → nhận ALL messages (independent)
```

**Delivery Semantics:**

| Semantic          | Cách đạt được                           | Trade-off                     |
| ----------------- | --------------------------------------- | ----------------------------- |
| **At-most-once**  | Commit offset trước khi process         | Nhanh, có thể mất message     |
| **At-least-once** | Process xong rồi commit offset          | An toàn hơn, có thể duplicate |
| **Exactly-once**  | Idempotent producer + transactional API | Chậm hơn, phức tạp            |

**Kafka exactly-once (producer):**

- `enable.idempotence=true`: Mỗi message có producer ID + sequence number → broker detect duplicate
- Transactional API: `beginTransaction()` → send messages → `commitTransaction()` → atomically write to multiple partitions

**Retention**: Kafka giữ messages theo time (7 days mặc định) hoặc size, không phải theo consumption status.

**Log Compaction**: Giữ lại **latest value per key** - hữu ích cho changelog topics (KTable).

### Q: RabbitMQ vs Kafka vs NATS - khi nào dùng cái nào? 🟡 🟡 [Mid]

**A:**

| Aspect         | RabbitMQ                    | Kafka                          | NATS                            |
| -------------- | --------------------------- | ------------------------------ | ------------------------------- |
| **Protocol**   | AMQP 0.9.1                  | Custom binary                  | Custom (text-based)             |
| **Model**      | Smart broker, dumb consumer | Dumb broker, smart consumer    | Both (Core vs JetStream)        |
| **Ordering**   | Per-queue (FIFO)            | Per-partition                  | Per-subject (JetStream)         |
| **Throughput** | ~50K msg/s                  | ~1M msg/s                      | ~10M msg/s (core)               |
| **Latency**    | ~1ms                        | ~5ms (batch-oriented)          | ~0.1ms (core)                   |
| **Retention**  | Until consumed              | Configurable (time/size)       | JetStream: configurable         |
| **Replay**     | Không                       | Có                             | JetStream: Có                   |
| **Language**   | Erlang                      | Java/Scala                     | Go                              |
| **Routing**    | Flexible (exchange types)   | Topic + partition              | Subject-based                   |
| **Use case**   | Task queues, RPC, routing   | Event streaming, data pipeline | Microservice communication, IoT |

**RabbitMQ Exchange Types:**

- **Direct**: Exact routing key match → queue
- **Fanout**: Broadcast to all bound queues
- **Topic**: Pattern matching (orders.\* , orders.#)
- **Headers**: Match on message headers

**NATS specifics:**

- **Core NATS**: Fire-and-forget, at-most-once, ultra-low latency. Tương tự UDP cho messaging.
- **NATS JetStream**: Persistent, at-least-once, replay. Tương tự Kafka nhưng nhẹ hơn.
- Written in Go → rất phù hợp với Go microservices stack.

**Decision Matrix:**

```
Cần message replay/event sourcing?     ──Yes──▶ Kafka
  │ No
  ▼
Cần complex routing logic?             ──Yes──▶ RabbitMQ
  │ No
  ▼
Cần ultra-low latency + Go-native?     ──Yes──▶ NATS
  │ No
  ▼
High throughput data pipeline?          ──Yes──▶ Kafka
  │ No
  ▼
Simple task queue with ACK?             ──Yes──▶ RabbitMQ
```

---

## 7. Distributed Locking

### Q: Tại sao cần distributed lock? Các cách implement? 🟡 🟡 [Mid]

**A:**

**Tại sao cần:** Khi nhiều processes/services cần exclusive access tới shared resource:

- Prevent double-spending (payment)
- Avoid duplicate cron job execution
- Serialize access to external API with rate limit

### Q: Redis-based distributed locking và Redlock controversy? 🔴 🔴 [Senior]

**A:**

**Basic Redis Lock:**

```go
// Acquire lock
result := redis.SetNX("lock:resource", "owner-id", 10*time.Second)
// SetNX = SET if Not eXists + TTL

// Release lock (phải check owner để tránh release lock của người khác)
// Dùng Lua script để atomic check-and-delete:
script := `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`
```

**Vấn đề với single Redis instance:** Nếu Redis master crash sau khi SET nhưng trước khi replicate → lock mất → 2 processes cùng hold lock.

**Redlock Algorithm (Antirez):**

1. Lấy current time
2. Gửi SET NX tới **N Redis instances** (N=5 recommended) lần lượt
3. Lock acquired nếu: majority (≥3) instances SET thành công AND tổng thời gian acquire < TTL
4. Effective TTL = initial TTL - time elapsed during acquiring
5. Nếu fail → release lock trên TẤT CẢ instances

```
┌────────┐  SET NX   ┌──────────┐
│ Client ├──────────▶│ Redis 1  │ ✓
│        ├──────────▶│ Redis 2  │ ✓
│        ├──────────▶│ Redis 3  │ ✓  ← Majority (3/5) = Lock acquired!
│        ├──────────▶│ Redis 4  │ ✗
│        ├──────────▶│ Redis 5  │ ✗
└────────┘           └──────────┘
```

**Martin Kleppmann's Critique (2016):**

Kleppmann chỉ ra rằng Redlock vẫn **unsafe** vì:

1. **GC pause / process pause**: Client A acquire lock → GC pause dài → lock TTL expire → Client B acquire lock → Client A resume, nghĩ mình vẫn hold lock → 2 clients in critical section
2. **Clock skew**: Redlock dựa vào wall clock. Nếu clock trên Redis instance bị jump → TTL tính sai → lock expire sớm

**Fencing tokens giải quyết:**

```
┌────────────────────────────────────────────────────┐
│  Fencing Token Flow:                                │
│                                                     │
│  Client A: acquire lock → token=33                  │
│  Client A: GC pause..............                   │
│  Client B: acquire lock → token=34                  │
│  Client B: write(token=34) to storage → accepted    │
│  Client A: resumes, write(token=33) → REJECTED!     │
│            (storage only accepts token ≥ 34)        │
│                                                     │
│  → Storage layer fence out stale lock holders       │
└────────────────────────────────────────────────────┘
```

**Nhưng: Redis không cung cấp fencing token. etcd/ZooKeeper có.**

### Q: So sánh các distributed lock implementations? 🔴 🔴 [Senior]

**A:**

| Aspect                    | Redis (SETNX)                 | Redlock                   | etcd                             | ZooKeeper                    |
| ------------------------- | ----------------------------- | ------------------------- | -------------------------------- | ---------------------------- |
| **Mechanism**             | SET NX + TTL                  | Multi-instance SET NX     | Lease + revision (fencing token) | Ephemeral sequential znode   |
| **Consistency**           | Weak (async replication)      | Stronger (majority)       | Strong (Raft)                    | Strong (ZAB)                 |
| **Fencing token**         | Không                         | Không                     | Có (revision)                    | Có (zxid)                    |
| **Auto-release on crash** | TTL expire                    | TTL expire                | Lease expire                     | Ephemeral node deleted       |
| **Performance**           | Rất nhanh                     | Chậm hơn (5 instances)    | Trung bình                       | Trung bình                   |
| **Complexity**            | Thấp                          | Trung bình                | Thấp (dùng clientv3)             | Trung bình                   |
| **Best for**              | Non-critical mutual exclusion | Nên tránh (controversial) | Correctness-critical locking     | Correctness-critical locking |

**Khi nào dùng distributed lock vs alternatives:**

- **Efficiency lock** (prevent duplicate work): Redis SETNX đủ. Nếu lock fail occasionally → chỉ waste work, không corrupt data.
- **Correctness lock** (prevent data corruption): etcd hoặc ZooKeeper với fencing token. Redis/Redlock không đảm bảo safety.

---

## 8. Distributed Caching

### Q: Các caching patterns và khi nào dùng? 🟡 🟡 [Mid]

**A:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Cache-Aside (Lazy Loading):                                      │
│                                                                  │
│  App ──1. GET──▶ Cache                                          │
│   │      miss ◀──────┘                                          │
│   │──2. GET──▶ DB                                               │
│   │◀── data ──┘                                                 │
│   └──3. SET──▶ Cache                                            │
│                                                                  │
│  Pros: Cache chỉ chứa data thực sự được đọc                    │
│  Cons: Cache miss → 3 round trips; data có thể stale            │
├─────────────────────────────────────────────────────────────────┤
│ Read-Through:                                                    │
│                                                                  │
│  App ──GET──▶ Cache ──miss──▶ DB                                │
│   ◀── data ──┘  ◀── data ──┘                                   │
│              (cache tự load)                                     │
│                                                                  │
│  Giống cache-aside nhưng cache tự biết load từ DB               │
├─────────────────────────────────────────────────────────────────┤
│ Write-Through:                                                   │
│                                                                  │
│  App ──WRITE──▶ Cache ──WRITE──▶ DB                             │
│   ◀── ACK ────┘  ◀── ACK ────┘                                 │
│               (sync, cả hai done mới return)                     │
│                                                                  │
│  Pros: Cache luôn consistent với DB                             │
│  Cons: Write latency cao; cache data có thể không bao giờ đọc  │
├─────────────────────────────────────────────────────────────────┤
│ Write-Behind (Write-Back):                                       │
│                                                                  │
│  App ──WRITE──▶ Cache ──ACK──▶ App                              │
│                  │                                               │
│                  └──async──▶ DB (batch, delayed)                │
│                                                                  │
│  Pros: Write rất nhanh, batch writes to DB                      │
│  Cons: Data loss risk nếu cache crash trước sync                │
└─────────────────────────────────────────────────────────────────┘
```

### Q: Cache invalidation và các vấn đề liên quan? 🔴 🔴 [Senior]

**A:**

> "There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton

**Cache stampede / Thundering herd:**
Khi hot key expire → hàng nghìn concurrent requests cùng miss cache → tất cả hit DB → DB overload.

**Giải pháp:**

| Solution                              | Cách hoạt động                                   | Khi nào dùng                                 |
| ------------------------------------- | ------------------------------------------------ | -------------------------------------------- |
| **singleflight**                      | Chỉ 1 goroutine fetch DB, còn lại wait kết quả   | Go services (golang.org/x/sync/singleflight) |
| **Mutex/lock**                        | Lock key khi fetching, others wait               | Single instance                              |
| **Probabilistic early expiration**    | Random % requests refresh cache trước khi expire | High-traffic keys                            |
| **Never expire + background refresh** | Cache không expire, background job update        | Critical hot data                            |

```go
// singleflight example - cực kỳ common trong Go services
var group singleflight.Group

func GetUser(id string) (*User, error) {
    v, err, _ := group.Do("user:"+id, func() (interface{}, error) {
        // Chỉ 1 goroutine thực sự gọi DB
        return db.GetUser(id)
    })
    return v.(*User), err
}
```

**Multi-level Caching:**

```
Request ──▶ L1 (In-process, e.g. sync.Map/bigcache)
              │ miss
              ▼
            L2 (Distributed, e.g. Redis)
              │ miss
              ▼
            Database

L1: ~nanoseconds, limited by process memory, no network hop
L2: ~1ms, shared across instances, large capacity
DB: ~5-50ms

Challenge: Invalidation across L1 caches on different instances
→ Pub/Sub (Redis pub/sub) hoặc event bus để notify invalidation
```

---

## 9. Clock Synchronization

### Q: Tại sao đồng hồ vật lý không đáng tin trong distributed systems? 🟡 🟡 [Mid]

**A:**

- Clock drift: Mỗi máy tính có crystal oscillator riêng, drift ~100ms/day
- NTP chỉ sync được ~1-50ms accuracy (còn tệ hơn qua internet)
- NTP có thể jump time (forward hoặc backward!) → dangerous cho ordering
- Network delay bất định → không thể biết "thời điểm chính xác" event xảy ra

**Hệ quả:** Không thể dùng wall clock để ordering events trong distributed system.

### Q: Giải thích Lamport Timestamps, Vector Clocks, và HLC? 🔴 🔴 [Senior]

**A:**

**Lamport Timestamps (1978) - Logical Clock:**

Rules:

1. Mỗi process maintain counter `C`
2. Trước mỗi event: `C = C + 1`
3. Khi gửi message: gửi kèm `C`
4. Khi nhận message với timestamp `T`: `C = max(C, T) + 1`

```
Process A:   (1)──────(2)───────────────────(5)──send──▶
                                                  │
Process B:         (1)──────(2)──send──▶          │
                                   │              │
Process C:              (1)────────(3)──────(4)───(6)
                                   ▲              ▲
                              receive          receive
                              max(1,2)+1=3     max(4,5)+1=6
```

**Hạn chế:** Nếu `L(a) < L(b)` → KHÔNG có nghĩa a happened-before b. Chỉ đảm bảo chiều ngược: nếu a→b thì `L(a) < L(b)`.

**Vector Clocks - Detect concurrent events:**

Mỗi process maintain vector `[C1, C2, ..., Cn]` (1 entry per process):

```
Process A:  [1,0,0]──[2,0,0]─────────────────────[4,2,0]
                                                     │ send
Process B:     [0,1,0]──[0,2,0]──send──▶             │
                            │                         │
Process C:        [0,0,1]───[2,2,2]──────[2,2,3]─────[4,2,4]
                            ▲                         ▲
                       receive from B            receive from A
                       max each + inc C          max each + inc C
                       [max(0,0), max(0,2),      [max(2,4), max(2,2),
                        max(1,0)] + inc C=1       max(3,0)] + inc C=1
                       = [0,2,1] → [0,2,2]      = [4,2,3] → [4,2,4]

Comparison:
  [2,0,0] vs [0,2,0]: A not ≤ B, B not ≤ A → CONCURRENT!
  [1,0,0] vs [2,2,2]: A ≤ B (element-wise) → A happened-before B
```

**Nhược điểm Vector Clock:** Size grows O(N) với N processes → không scalable cho hệ thống lớn.

**Hybrid Logical Clock (HLC):**

- Kết hợp physical time + logical counter
- `(physical_time, logical_counter)`
- Gần với real time nhưng vẫn đảm bảo causal ordering
- CockroachDB sử dụng HLC

**Google TrueTime (Spanner):**

- GPS receivers + atomic clocks trong mỗi data center
- API: `TrueTime.now()` returns `[earliest, latest]` interval
- Uncertainty interval thường ~1-7ms
- Spanner **chờ đợi** uncertainty interval trước khi commit → đảm bảo external consistency
- Chi phí cực cao → chỉ Google scale mới triển khai thực tế

---

## 10. Distributed System Failure Modes

### Q: Các loại failure trong distributed systems? 🟡 🟡 [Mid]

**A:**

```
┌──────────────────────────────────────────────────────────────┐
│                    Failure Taxonomy                            │
│                                                               │
│  Network Failures:                                            │
│  ├── Partition: Nhóm nodes không giao tiếp được               │
│  ├── Packet loss: Message bị mất trên đường                  │
│  ├── Latency spike: Message đến rất chậm (minutes!)          │
│  └── Asymmetric partition: A→B works, B→A fails              │
│                                                               │
│  Node Failures:                                               │
│  ├── Crash-stop: Node crash và không recover                  │
│  ├── Crash-recovery: Node crash rồi restart (có thể stale)   │
│  ├── Omission: Node drop incoming/outgoing messages           │
│  └── Byzantine: Node hoạt động sai (bug, malicious)          │
│                                                               │
│  Timing Failures:                                             │
│  ├── Clock skew: Đồng hồ các node không đồng bộ              │
│  └── Timeout misconfig: Quá ngắn → false positive failure     │
│                                                               │
│  Grey Failures:                                               │
│  ├── Partial failure: Service hoạt động nhưng response chậm   │
│  ├── Performance degradation: CPU spike, GC pause             │
│  └── Flapping: Node up-down liên tục                          │
└──────────────────────────────────────────────────────────────┘
```

### Q: Split brain là gì và cách ngăn chặn? 🔴 🔴 [Senior]

**A:**

**Split brain**: Khi network partition khiến 2+ nhóm nodes đều nghĩ mình là "active/leader" → cả hai accept writes → data divergence.

```
BEFORE partition:
  [Node A: Leader] ←──▶ [Node B] ←──▶ [Node C]

DURING partition:
  [Node A: Leader]  ──✕──  [Node B] ←──▶ [Node C]
       │                        │
  "I'm still leader"     "A is dead, elect B as leader"
       │                        │
  Accept writes ←──          Accept writes ←──
       │                        │
       └── SPLIT BRAIN! ───────┘
```

**Prevention strategies:**

| Strategy                                       | Cách hoạt động                                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Quorum/Majority**                            | Chỉ partition có >N/2 nodes mới elect leader. Partition nhỏ hơn → read-only hoặc shutdown |
| **STONITH** (Shoot The Other Node In The Head) | Node tin mình là leader → power off node cũ (qua IPMI/BMC) trước khi accept writes        |
| **Fencing**                                    | Old leader không thể write vì storage layer reject stale epoch/token                      |
| **Lease-based**                                | Leader phải renew lease periodically. Partition → lease expire → không còn là leader      |

### Q: Cascading failures và cách ngăn chặn? 🔴 🔴 [Senior]

**A:**

```
Cascading Failure:

Service A ──▶ Service B (overloaded, slow response)
  │
  │ timeout waiting for B...
  │ threads exhausted
  ▼
Service A (also overloaded now)
  │
  │ all callers of A also timeout
  ▼
Service C, D, E... (cascade!)
```

**Prevention patterns:**

| Pattern             | Cách hoạt động                                                   | Analogy            |
| ------------------- | ---------------------------------------------------------------- | ------------------ |
| **Circuit Breaker** | Sau N failures → "open circuit" → fail fast thay vì wait timeout | Cầu chì điện       |
| **Bulkhead**        | Isolate resources per dependency (separate thread pools)         | Vách ngăn tàu thủy |
| **Timeout + Retry** | Giới hạn wait time, retry với backoff                            | --                 |
| **Rate Limiting**   | Giới hạn incoming requests                                       | Van nước           |
| **Load Shedding**   | Reject requests khi quá tải (return 503)                         | Cắt tải điện       |

**Circuit Breaker states:**

```
        success (threshold)
     ┌──────────────────────┐
     │                      ▼
┌─────────┐  failures  ┌─────────┐  timeout  ┌───────────┐
│ CLOSED  │───────────▶│  OPEN   │──────────▶│HALF-OPEN  │
│(normal) │  exceed    │(fail    │ (try one  │(test      │
│         │  threshold │ fast)   │  request) │request)   │
└─────────┘            └─────────┘           └───────────┘
     ▲                      ▲                    │    │
     │                      │   failure          │    │
     │                      └────────────────────┘    │
     │              success                           │
     └────────────────────────────────────────────────┘
```

---

## 11. Leader Election

### Q: Các phương pháp leader election? 🟡 🟡 [Mid]

**A:**

**Bully Algorithm:**

- Node với highest ID luôn thắng
- Khi detect leader failure: gửi election message tới tất cả higher-ID nodes
- Nếu không ai reply → tự trở thành leader
- Nếu higher-ID reply → đợi higher-ID trở thành leader
- Đơn giản nhưng không fault-tolerant tốt

**Ring Algorithm:**

- Nodes tổ chức thành logical ring
- Election message đi vòng quanh ring, collect participant IDs
- Node với highest ID trong message trở thành leader
- Tốn O(N) messages

**Practical: etcd/ZooKeeper-based Election:**

```
etcd election sử dụng lease:

1. Mỗi candidate tạo key với lease:
   PUT /election/leader = "node-1" (lease=30s)

2. Key với lowest revision (create_revision) thắng
   → First come, first served

3. Leader phải keep-alive lease mỗi ~10s

4. Nếu leader crash → lease expire → key tự xóa
   → Candidate tiếp theo (lowest revision) trở thành leader

5. Candidates watch key trước nó (không watch leader key)
   → Avoid herd effect khi leader fail
```

**Lease-based Election properties:**

| Property                | Giải thích                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Bounded leader term** | Lease expire → phải renew. Ngăn zombie leader.                                                                                                       |
| **Automatic failover**  | Không cần explicit "step down" message                                                                                                               |
| **Grace period**        | Lease TTL = max time hệ thống không có leader                                                                                                        |
| **Risk**                | Clock skew: leader nghĩ lease còn, nhưng etcd nghĩ expire → brief double leader. Giải quyết: leader stop serving trước lease expire (safety margin). |

---

## 12. Idempotency in Distributed Systems

### Q: Tại sao idempotency critical trong distributed systems? 🟡 🟡 [Mid]

**A:**

```
Không có idempotency:

Client ──POST /pay──▶ Server ──▶ Deduct $100
       ◀── timeout ──┘ (response lost, but payment processed!)

Client ──retry POST /pay──▶ Server ──▶ Deduct $100 AGAIN!
       ◀── 200 OK ────────┘

User bị trừ $200 thay vì $100!
```

**Nguyên nhân cần idempotency:**

- Network timeout: Server xử lý xong nhưng response bị mất → client retry
- At-least-once delivery: Message queue deliver lại message
- Load balancer retry: Retry request khi backend không respond kịp
- Client retry logic: Mobile app retry khi mạng không ổn định

### Q: Cách implement idempotency? 🔴 🔴 [Senior]

**A:**

**Idempotency Key Pattern:**

```
┌────────┐  POST /pay                    ┌────────┐
│ Client │  Idempotency-Key: abc-123     │ Server │
│        │──────────────────────────────▶│        │
│        │                               │  1. Check: "abc-123" in     │
│        │                               │     idempotency store?      │
│        │                               │     NO → process request    │
│        │                               │     Store result with key   │
│        │◀─ 200 OK ────────────────────│                             │
│        │                               │                             │
│        │  (timeout, retry)             │                             │
│        │  POST /pay                    │                             │
│        │  Idempotency-Key: abc-123     │                             │
│        │──────────────────────────────▶│  2. Check: "abc-123" in    │
│        │                               │     store? YES → return     │
│        │◀─ 200 OK (cached result) ────│     stored result           │
└────────┘                               └────────────────────────────┘
```

**Design considerations:**

| Aspect             | Recommendation                                                           |
| ------------------ | ------------------------------------------------------------------------ |
| **Key generation** | Client-generated UUID v4. Không dùng server-side vì retry sẽ tạo key mới |
| **Key storage**    | Redis (fast, TTL tự động) hoặc DB table                                  |
| **TTL**            | 24-48 hours thường đủ. Quá ngắn → retry fail. Quá dài → waste storage    |
| **Scope**          | Per-user + per-action. Cùng key khác user → reject                       |
| **Response**       | Lưu cả response body, không chỉ "processed" flag                         |

**Deduplication strategies khác:**

| Strategy                       | Cách hoạt động                                                     | Use case           |
| ------------------------------ | ------------------------------------------------------------------ | ------------------ |
| **Database unique constraint** | INSERT với unique (user_id, order_id)                              | Simple cases       |
| **Optimistic locking**         | UPDATE WHERE version = X                                           | Concurrent updates |
| **Natural idempotency**        | PUT (replace), DELETE operations tự idempotent                     | RESTful APIs       |
| **State machine**              | Order: PENDING→PAID→SHIPPED. Chỉ transition nếu current state đúng | Workflow/saga      |

### Q: Exactly-once semantics có thực sự khả thi? 🔴 🔴 [Senior]

**A:**

**Strictly speaking: KHÔNG.** Trong mạng không đáng tin cậy, không thể đảm bảo exactly-once delivery. Hai generals' problem chứng minh điều này.

**Thực tế: "Effectively exactly-once" = at-least-once delivery + idempotent processing**

```
"Exactly-once" trong practice:

                    at-least-once                idempotent
Producer ──────────────────────────▶ Consumer ──────────────▶ Side Effect
         (may deliver duplicates)            (dedup before
                                              applying)

Kafka "exactly-once":
- Idempotent producer (sequence numbers) → no duplicates in topic
- Transactional consumer-producer (read-process-write atomically)
- Nhưng: Side effects bên ngoài Kafka (DB write, API call) vẫn cần
  application-level idempotency!
```

---

## Distributed Systems Theory Cheat Sheet

### Key Tradeoffs Summary

```
┌─────────────────────────────────────────────────────────────┐
│              Distributed Systems Tradeoffs                    │
│                                                              │
│  Consistency ◄──────────────────────────▶ Availability       │
│  Consistency ◄──────────────────────────▶ Latency            │
│  Durability  ◄──────────────────────────▶ Performance        │
│  Safety      ◄──────────────────────────▶ Liveness           │
│  Correctness ◄──────────────────────────▶ Throughput         │
│                                                              │
│  There is no silver bullet - chỉ có tradeoffs phù hợp       │
│  với business requirements cụ thể.                           │
└─────────────────────────────────────────────────────────────┘
```

### Concept Quick Reference

| Concept                | One-liner                                                              |
| ---------------------- | ---------------------------------------------------------------------- |
| **CAP**                | Partition xảy ra → chọn Consistency hoặc Availability                  |
| **PACELC**             | CAP + khi không partition: Latency vs Consistency                      |
| **Raft**               | Leader-based consensus: election → log replication → safety            |
| **Consistent Hashing** | Hash ring + virtual nodes → minimal data movement khi add/remove nodes |
| **Quorum**             | W+R>N → guaranteed overlap → strong consistency                        |
| **Vector Clock**       | Detect concurrent events, partial ordering                             |
| **Fencing Token**      | Monotonic token ngăn stale lock holder ghi data                        |
| **singleflight**       | Deduplicate concurrent identical requests (Go pattern)                 |
| **Circuit Breaker**    | Fail fast khi downstream service degraded                              |
| **Idempotency Key**    | Client-generated unique key → dedup retries                            |

### Key Papers to Know

| Paper                           | Year | Key Contribution                                                         | Relevance                          |
| ------------------------------- | ---- | ------------------------------------------------------------------------ | ---------------------------------- |
| **Dynamo** (Amazon)             | 2007 | Leaderless replication, consistent hashing, vector clocks, sloppy quorum | Cassandra, DynamoDB foundation     |
| **Raft** (Ongaro)               | 2014 | Understandable consensus                                                 | etcd, TiKV, CockroachDB            |
| **MapReduce** (Google)          | 2004 | Distributed computation framework                                        | Hadoop foundation                  |
| **Bigtable** (Google)           | 2006 | Wide-column store, SSTable, LSM-tree                                     | HBase, Cassandra influences        |
| **Spanner** (Google)            | 2012 | Global distributed DB, TrueTime, external consistency                    | CockroachDB, YugabyteDB inspired   |
| **Kafka** (LinkedIn)            | 2011 | Distributed commit log                                                   | Event streaming standard           |
| **Paxos Made Simple** (Lamport) | 2001 | Consensus algorithm explanation                                          | Foundation for Raft, ZAB           |
| **Time, Clocks** (Lamport)      | 1978 | Logical clocks, happened-before                                          | Foundation of distributed ordering |

### Interview Questions by Company Focus

**Google-style (Theory heavy):**

- Design a distributed consensus system. What are the trade-offs?
- How would you handle clock synchronization across data centers?
- Explain linearizability vs serializability
- How does Spanner achieve external consistency?

**Grab-style (Practical distributed systems):**

- How to ensure payment is processed exactly once?
- Design a distributed rate limiter across multiple instances
- How would you handle cache invalidation for ride pricing?
- Kafka consumer lag is increasing - how do you debug and fix?
- Design location tracking system (CAP tradeoff discussion)

**Generic Senior/Staff questions:**

- Compare approaches for distributed locking. When is each appropriate?
- How does your system handle split brain scenarios?
- Walk through what happens when a Raft leader fails mid-replication
- Design a distributed cron scheduler (leader election + idempotency)

### Common Misconceptions

| Misconception                             | Reality                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| "CAP means choose 2 of 3"                 | P is not optional in real networks. It's really C vs A during partition.                                                                    |
| "Eventual consistency = slow/bad"         | Eventual consistency is sufficient (and optimal) for many use cases. Strong consistency has latency cost.                                   |
| "Raft guarantees no data loss"            | Raft can lose uncommitted entries on leader crash. Only committed (majority ACK) entries are safe.                                          |
| "Kafka is exactly-once"                   | Only within Kafka ecosystem. External side effects still need app-level idempotency.                                                        |
| "Distributed locks are always needed"     | Often, optimistic concurrency or idempotent operations are better alternatives with less coordination overhead.                             |
| "More replicas = more available"          | More replicas with quorum writes = higher write latency. Availability depends on consistency requirements.                                  |
| "Redis is CP"                             | Redis default replication is async → AP. With WAIT command it's closer to CP but still not guaranteed.                                      |
| "Consistent hashing eliminates hot spots" | It distributes keys evenly, but popular keys (hot keys) still create hot spots. Virtual nodes help with node imbalance, not key popularity. |
| "Vector clocks scale well"                | Vector clock size grows with number of actors. For large systems, need alternatives like dotted version vectors or HLC.                     |

---

_Document version: 2026-03. Focus on theory and conceptual understanding for backend engineering interviews at scale-focused companies._

---

## Self-Check / Tự Kiểm Tra

### Retrieval Practice — Tự trả lời KHÔNG nhìn notes

| #   | Question                                               | Key Points                                                                        |
| --- | ------------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | CAP Theorem nói gì? Tại sao thực tế là C vs A?         | 3 properties, P mandatory, choose C or A during partition                         |
| 2   | Strong vs Eventual consistency — khi nào dùng cái nào? | Banking = strong, social feed = eventual, tunable = per-query                     |
| 3   | Raft consensus hoạt động thế nào? (3 phases)           | Leader election (term), log replication (AppendEntries), safety (majority commit) |
| 4   | Consistent hashing giải quyết vấn đề gì?               | Minimize key redistribution on node add/remove, virtual nodes for balance         |
| 5   | Kafka vs RabbitMQ — khác biệt cốt lõi?                 | Kafka = replayable log, RabbitMQ = task queue (consumed once), consumer groups    |
| 6   | Redlock controversy — Martin Kleppmann nói gì?         | Redlock unsafe for correctness (no consensus), fine for efficiency locks          |
| 7   | Idempotency key pattern hoạt động thế nào?             | Client sends unique key, server deduplicates via lookup table, safe retries       |

### 📅 Spaced Repetition Schedule

| Round | When          | Focus                                                                 |
| ----- | ------------- | --------------------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Memory Hooks, answer Self-Check from memory                  |
| 2     | Day 3         | Redo 🟢 Q&As without notes, review CAP + Raft                         |
| 3     | Day 7         | Redo 🟡 Q&As, whiteboard consistent hashing diagram                   |
| 4     | Day 14        | Full Cold Call simulation, tackle 🔴 Q&As                             |
| 5     | Day 30        | Mock interview: design distributed key-value store using all concepts |

## Interview Q&A Summary / Tổng Hợp Q&A Phỏng Vấn

| #   | Question                                    | Difficulty | Core Concept    | Key Signal                                         |
| --- | ------------------------------------------- | ---------- | --------------- | -------------------------------------------------- |
| 1   | CAP Theorem là gì?                          | 🟢         | CAP             | 3 properties, P mandatory, C vs A                  |
| 2   | Phân biệt CP và AP systems?                 | 🟡         | CAP             | etcd=CP, Cassandra=AP, config-dependent            |
| 3   | PACELC Theorem là gì?                       | 🔴         | CAP             | Extends CAP: E/L vs E/C tradeoff                   |
| 4   | Consistency models từ mạnh đến yếu?         | 🟡         | Consistency     | Strong→Sequential→Causal→Eventual                  |
| 5   | Tunable Consistency trong Cassandra?        | 🔴         | Consistency     | QUORUM=majority, ONE=fast, ALL=strong              |
| 6   | Tại sao consensus khó?                      | 🔴         | Consensus       | FLP impossibility, async + 1 crash                 |
| 7   | Raft algorithm hoạt động thế nào?           | 🔴         | Consensus       | Leader election, log replication, safety           |
| 8   | Paxos vs Raft vs ZAB?                       | 🔴         | Consensus       | Raft=understandable, ZAB=ZooKeeper                 |
| 9   | So sánh replication strategies?             | 🟡         | Replication     | Sync/Async/Semi-sync tradeoffs                     |
| 10  | Tại sao cần sharding?                       | 🟡         | Partitioning    | Write scale, range vs hash partitioning            |
| 11  | Consistent Hashing hoạt động thế nào?       | 🔴         | Partitioning    | Ring, virtual nodes, K/N redistribution            |
| 12  | Secondary indexes với partitioning?         | 🔴         | Partitioning    | Local vs global index tradeoff                     |
| 13  | Message Queue vs Event Stream?              | 🟡         | Messaging       | Queue=consumed once, Stream=replayable             |
| 14  | Kafka architecture và guarantees?           | 🔴         | Messaging       | Partitions, ISR, consumer groups                   |
| 15  | RabbitMQ vs Kafka vs NATS?                  | 🟡         | Messaging       | Task queue vs event log vs lightweight             |
| 16  | Tại sao cần distributed lock?               | 🟡         | Locking         | Mutual exclusion across services                   |
| 17  | Redlock và controversy?                     | 🔴         | Locking         | Majority quorum, Kleppmann critique                |
| 18  | So sánh distributed lock implementations?   | 🔴         | Locking         | Redis vs ZooKeeper vs etcd tradeoffs               |
| 19  | Caching patterns và khi nào dùng?           | 🟡         | Caching         | Cache-Aside, Write-Through, Write-Behind           |
| 20  | Cache invalidation và vấn đề?               | 🔴         | Caching         | Stampede, inconsistency, jittered TTL              |
| 21  | Tại sao đồng hồ vật lý không đáng tin?      | 🟡         | Clocks          | NTP drift, clock skew, leap seconds                |
| 22  | Lamport/Vector Clocks và HLC?               | 🔴         | Clocks          | Lamport=total order, Vector=causality, HLC=hybrid  |
| 23  | Các loại failure trong distributed systems? | 🟡         | Failures        | Crash, omission, timing, Byzantine                 |
| 24  | Split brain là gì và cách ngăn chặn?        | 🔴         | Failures        | Network partition, quorum-based prevention         |
| 25  | Cascading failures và cách ngăn chặn?       | 🔴         | Failures        | Circuit breaker, bulkhead, backpressure            |
| 26  | Các phương pháp leader election?            | 🟡         | Leader Election | Bully, ring, Raft-based, lease-based               |
| 27  | Tại sao idempotency critical?               | 🟡         | Idempotency     | Network retries, at-least-once delivery            |
| 28  | Cách implement idempotency?                 | 🔴         | Idempotency     | Idempotency key, dedup table, TTL                  |
| 29  | Exactly-once semantics khả thi?             | 🔴         | Idempotency     | Only processing (not delivery), Kafka transactions |

**Distribution:** 🟢 2 | 🟡 12 | 🔴 15 — Heavily senior-weighted, reflects distributed systems depth.

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **Interviewer:** "Your distributed cache shows stale data after a node failure. Walk me through what happened."

**30-Second Answer:**
"When a cache node failed, the load balancer redirected traffic to another node that didn't have the latest data — this is a CAP tradeoff in action. The system chose Availability over Consistency during the partition. I'd investigate: (1) Was it a true network partition or node crash? (2) Check replication lag — was the failover node behind? (3) Short-term: use cache-aside pattern with DB fallback. Long-term: add write-through replication with acknowledgment before confirming writes."

**Follow-up:** "How would you prevent this in a payment system?"
→ "For payments, I'd switch to a CP approach: use etcd or ZooKeeper for critical state, require majority quorum for writes, and implement idempotency keys so retries are safe even during failover."

## Connections / Liên Kết

**Same track (be-track):**

- ↔️ [Microservices Architecture](./02-microservices.md) — Microservices ARE distributed systems; service mesh, circuit breakers
- ↔️ [Auth & Security](./04-auth-security.md) — Distributed auth (JWT stateless vs session replication)
- ↔️ [Resilience Patterns](./07-resilience-patterns.md) — Circuit breaker, bulkhead, retry with backoff
- ↔️ [Message Queues](./08-message-queues.md) — Deep dive on Kafka/RabbitMQ patterns
- ↔️ [gRPC & Protobuf](./09-grpc-protobuf.md) — Efficient inter-service communication

**Cross-track:**

- 🔗 [Database Advanced: SQL Fundamentals](../03-database-advanced/01-sql-fundamentals.md) — ACID vs BASE, transaction isolation
- 🔗 [System Design: Design Framework](../04-be-system-design/01-design-framework.md) — CAP tradeoffs in system design interviews
- 🔗 [Go Concurrency](../01-golang/03-concurrency.md) — Goroutines + channels as local distributed system pattern
