# Database Sharding & Transaction Isolation / Phân Mảnh Cơ Sở Dữ Liệu và Cô Lập Giao Dịch

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Database Theory](./database-theory.md) | [Indexing & Optimization](./02-indexing-and-optimization.md)
> **See also**: [Replication & Partitioning](../02-system-design/replication-partitioning.md) | [BE Database Advanced](../../be-track/03-database-advanced/)

---

## Overview / Tổng Quan

Hai chủ đề hay bị hỏi ở phỏng vấn Senior:
1. **Sharding** — cách scale database ngang khi một node không đủ
2. **Transaction Isolation** — cách DB xử lý concurrent transactions và các anomaly tương ứng

---

## Part 1: Database Sharding / Phân Mảnh Cơ Sở Dữ Liệu

### Q: What is sharding and when do you need it? 🟡 Mid

**A:** Sharding = chia data thành nhiều phần (shards), mỗi shard chứa một tập con của data và nằm trên server riêng.

**Khi nào cần sharding**:
- Single DB node không thể handle write throughput
- Dataset quá lớn cho một server (>TB scale)
- Cần geo-isolation (data của user VN ở VN, Singapore ở SG)

```
Without Sharding:         With Sharding (by user_id):
                          Shard 0: user_id 0–33M
All data → [DB]           Shard 1: user_id 33M–66M
                          Shard 2: user_id 66M–100M
```

**Trade-offs của sharding**:
- Pros: horizontal scale, tăng write throughput, giảm latency với data locality
- Cons: cross-shard queries phức tạp, joins khó, transactions across shards không atomic, operational overhead

---

### Q: What are the main sharding strategies? Compare their trade-offs. 🟢 Junior → 🔴 Senior

**A:**

#### 1. Range-based Sharding

```
Shard 0: user_id 1 – 1,000,000
Shard 1: user_id 1,000,001 – 2,000,000
Shard 2: user_id 2,000,001 – 3,000,000
```

- **Pros**: Range queries efficient (get users 500k–600k → one shard)
- **Cons**: **Hotspot problem** — new users always go to last shard; uneven load

#### 2. Hash-based Sharding

```
shard_id = hash(user_id) % num_shards

user_id=123  → hash=0x4a2 → shard 0x4a2 % 3 = 2
user_id=456  → hash=0x8f1 → shard 0x8f1 % 3 = 1
```

- **Pros**: Even distribution, no hotspots
- **Cons**: Range queries require scanning all shards; **resharding problem** — adding a shard changes % → most keys move

#### 3. Consistent Hashing

```
Hash ring: 0 ──────────────────── 2^32
           │                        │
           Shard A(0) Shard B(1/3) Shard C(2/3)

user_id → hash → find next clockwise shard on ring
Adding Shard D: only keys between C and D move (≈ 1/N of total)
```

- **Pros**: Adding/removing shards only moves 1/N of data (vs ~all data with hash % N)
- **Cons**: Uneven distribution if few shards (fix with **virtual nodes**)
- **Used by**: Cassandra, DynamoDB, Redis Cluster

#### 4. Directory-based Sharding

```
Lookup table: user_id → shard_id
user 123 → shard 2
user 456 → shard 0
```

- **Pros**: Full flexibility, easy to move individual users
- **Cons**: Lookup table = single point of failure + bottleneck

**Câu trả lời phỏng vấn**: Với user-facing systems scale lớn → dùng Consistent Hashing. Với data có natural locality (country, org_id) → Range sharding. Tránh hash % N cho production vì resharding nightmare.

---

### Q: What is a hotspot shard and how do you fix it? 🔴 Senior

**A:** Hotspot = một shard nhận traffic lớn hơn các shard khác.

**Common causes**:
1. **Celebrity/viral account**: user_id của influencer có hàng triệu followers → mọi like/comment đến một shard
2. **Time-based sharding**: tất cả writes vào "current" shard
3. **Sequential IDs**: new records always → last shard

**Fixes**:

```
Fix 1: Shard splitting — chia shard nóng thành 2+ shards
Fix 2: Write amplification — replicate hot row sang nhiều shards, reads balanced
Fix 3: Caching — cache hot data (Celebrity tweet) ở Redis, bypass DB shard
Fix 4: Composite shard key — không chỉ user_id mà user_id + bucket_id
  shard = hash(celebrity_id + random_suffix) % N
  Writes go to random bucket, reads fan-out to all buckets and merge
```

**Twitter's approach**: Sharded tweets by tweet_id (not user_id). Celebrity accounts có write amplification — tweet stored in each follower's timeline shard (fanout on write).

---

### Q: How do cross-shard queries and transactions work? 🔴 Senior

**A:**

**Cross-shard query** (e.g., "get orders for users across all shards"):
```
Scatter-gather:
1. Query goes to all shards in parallel
2. Application-level merge + sort + paginate
```
This is expensive — avoid or denormalize to keep related data co-located.

**Cross-shard transaction** options:

| Approach | How | Trade-offs |
|----------|-----|------------|
| **Two-Phase Commit (2PC)** | Coordinator prepares all shards, then commits | ACID but slow, coordinator = SPOF |
| **Saga Pattern** | Compensating transactions per step | Eventual consistency, complex rollback |
| **Avoid entirely** | Design so transactions stay within one shard | Best option — rethink data model |

**Best practice**: Design shard key so transactions only touch one shard. User-centric sharding (shard by user_id) means most user operations (profile update, user's orders) stay on one shard.

---

## Part 2: Transaction Isolation Levels / Mức Độ Cô Lập Giao Dịch

### Q: What are the four SQL isolation levels and what anomalies does each prevent? 🟡 Mid

**A:**

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-----------------|------------|---------------------|--------------|
| **READ UNCOMMITTED** | Possible | Possible | Possible |
| **READ COMMITTED** | Prevented | Possible | Possible |
| **REPEATABLE READ** | Prevented | Prevented | Possible |
| **SERIALIZABLE** | Prevented | Prevented | Prevented |

**Three anomalies explained:**

**1. Dirty Read** — đọc uncommitted data của transaction khác
```sql
-- T1 (not yet committed):
UPDATE accounts SET balance = 1000 WHERE id = 1;

-- T2 (READ UNCOMMITTED): reads 1000 even though T1 hasn't committed
SELECT balance FROM accounts WHERE id = 1; -- returns 1000 (dirty!)

-- T1 rolls back → T2 made decision on data that never existed
```

**2. Non-Repeatable Read** — cùng query, đọc 2 lần cho kết quả khác nhau
```sql
-- T1:
SELECT balance FROM accounts WHERE id = 1; -- returns 500

-- T2 (commits between T1's two reads):
UPDATE accounts SET balance = 800 WHERE id = 1; COMMIT;

-- T1 reads again:
SELECT balance FROM accounts WHERE id = 1; -- returns 800 (changed!)
```

**3. Phantom Read** — tập hợp rows thay đổi giữa hai queries trong cùng transaction
```sql
-- T1:
SELECT COUNT(*) FROM orders WHERE user_id = 42; -- returns 3

-- T2 inserts a new order for user 42 and commits

-- T1:
SELECT COUNT(*) FROM orders WHERE user_id = 42; -- returns 4 (phantom!)
```

---

### Q: What isolation level does PostgreSQL use by default? What about MySQL? 🟡 Mid

**A:**

- **PostgreSQL default**: `READ COMMITTED`
- **MySQL InnoDB default**: `REPEATABLE READ`

**PostgreSQL** implements isolation via **MVCC (Multi-Version Concurrency Control)**:
- Each row has hidden `xmin` (created by txn) and `xmax` (deleted by txn) columns
- Read transactions see a **snapshot** of committed data at transaction start
- No read locks needed → readers don't block writers, writers don't block readers

```sql
-- PostgreSQL: explicitly set higher isolation
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT balance FROM accounts WHERE id = 1;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**MySQL InnoDB REPEATABLE READ** + **next-key locks** prevents phantom reads via gap locks (partially, not always).

**Thực tế**: Hầu hết applications dùng READ COMMITTED hoặc REPEATABLE READ. SERIALIZABLE tốt nhất cho correctness nhưng throughput thấp nhất.

---

### Q: What is a deadlock and how do you prevent it? 🟢 Junior → 🔴 Senior

**A:**

**Deadlock** = hai transactions chờ nhau release lock → cả hai blocked mãi mãi.

```
T1: LOCK row A → waiting for row B
T2: LOCK row B → waiting for row A
→ DEADLOCK
```

**Detection**: Most DBs detect deadlocks and kill one transaction with error `ERROR 1213 (40001): Deadlock found`.

**Prevention strategies:**

1. **Consistent lock ordering** — luôn lock theo cùng thứ tự
```sql
-- BAD: T1 locks A then B, T2 locks B then A → deadlock possible
-- GOOD: Both T1 and T2 always lock A then B (smaller id first)
BEGIN;
SELECT * FROM accounts WHERE id = MIN(1,2) FOR UPDATE;
SELECT * FROM accounts WHERE id = MAX(1,2) FOR UPDATE;
-- transfer logic
COMMIT;
```

2. **Short transactions** — giữ lock càng ngắn càng tốt
```sql
-- BAD: lock row, then do HTTP call (takes 500ms), then release
-- GOOD: do HTTP call first, then open transaction
```

3. **SELECT FOR UPDATE with NOWAIT / SKIP LOCKED**
```sql
-- NOWAIT: fail immediately if lock unavailable (don't wait)
SELECT * FROM jobs WHERE status='pending' LIMIT 1 FOR UPDATE NOWAIT;

-- SKIP LOCKED: skip rows already locked (good for job queues)
SELECT * FROM jobs WHERE status='pending' LIMIT 1 FOR UPDATE SKIP LOCKED;
```

4. **Optimistic locking** — no locks, detect conflict at commit
```sql
-- Add version column to table
UPDATE products
SET stock = stock - 1, version = version + 1
WHERE id = 123 AND version = 5; -- fails if version changed
-- If 0 rows affected → conflict → retry
```

**Câu trả lời phỏng vấn**: Cách đơn giản nhất tránh deadlock là consistent lock ordering. Với high-concurrency systems → dùng optimistic locking + retry.

---

### Q: Explain MVCC and why it matters for performance. 🔴 Senior

**A:** **MVCC (Multi-Version Concurrency Control)** = giữ nhiều version của mỗi row để readers và writers không block nhau.

**How it works (PostgreSQL):**
```
Row "account id=1":
  Version 1: balance=500, xmin=100, xmax=200  (created by txn 100, deleted by txn 200)
  Version 2: balance=800, xmin=200, xmax=NULL (created by txn 200, still live)

Txn 150 reads: sees Version 1 (200 > 150, so version 2 doesn't exist yet for txn 150)
Txn 250 reads: sees Version 2 (both 100 and 200 < 250, version 2 is newest)
```

**Benefits:**
- Readers never block writers (no shared read locks)
- Writers never block readers
- Consistent snapshots without locking entire table

**Cost — Vacuum / MVCC bloat:**
Dead row versions accumulate (old versions no longer needed by any transaction). PostgreSQL's `VACUUM` process cleans these up. Without vacuum → table bloat → slower queries.

**MySQL InnoDB** uses MVCC differently — undo log segments store older versions, no explicit vacuum needed.

**Quan trọng với backend developer**: Hiểu MVCC giải thích tại sao PostgreSQL read-heavy workloads scale tốt. Long-running transactions giữ old row versions tồn tại → vacuum không xóa được → bloat.

---

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Answer |
|----------|-------|------------|
| When to shard? | 🟡 | Write throughput limit, dataset too large for single node |
| Consistent hashing vs hash mod N? | 🟡 | Consistent: only 1/N data moves when adding shard |
| Fix a hotspot shard? | 🔴 | Split shard, cache, write amplification with buckets |
| 4 isolation levels? | 🟡 | RU/RC/RR/S; prevents dirty/non-repeatable/phantom reads |
| PostgreSQL default isolation? | 🟡 | READ COMMITTED, uses MVCC |
| How to prevent deadlocks? | 🟡 | Consistent lock ordering, short txns, optimistic locking |
| What is MVCC? | 🔴 | Multiple row versions; readers/writers don't block each other |

---

**See also**: [Database Theory](./database-theory.md) | [NoSQL & NewSQL](./03-nosql-and-newsql.md) | [Replication & Partitioning](../02-system-design/replication-partitioning.md)

---

## 7. Distributed Transactions / Giao Dịch Phân Tán

### Q: How does the Saga pattern handle distributed transactions? / Saga pattern xử lý distributed transaction thế nào? 🔴 Senior

**A:** Saga replaces a single distributed transaction with a sequence of local transactions, each with a compensating action. If step N fails, steps N-1, N-2, ... are compensated (rolled back) via their compensating transactions.

```
Order Service Saga:
  Step 1: Reserve inventory   → Compensation: Release inventory
  Step 2: Charge payment      → Compensation: Refund payment
  Step 3: Assign delivery     → Compensation: Cancel delivery

If step 3 fails:
  Execute compensation for step 2 (refund)
  Execute compensation for step 1 (release inventory)

Two implementations:
  Choreography: services react to each other's events (no coordinator)
    OrderCreated → InventoryService listens → InventoryReserved →
    PaymentService listens → PaymentCharged → ...
    Pro: decoupled; Con: hard to track saga state, hard to debug

  Orchestration: central saga orchestrator sends commands
    Orchestrator → InventoryService.Reserve()
    Orchestrator → PaymentService.Charge()
    Orchestrator → DeliveryService.Assign()
    Pro: explicit flow, easier to track; Con: coupling to orchestrator
```

Vietnamese: Saga là giải pháp thực tế nhất cho distributed transactions ở scale lớn (Grab, Shopee đều dùng). 2PC (Two-Phase Commit) có coordinator SPOF và blocking protocol — không scale. Saga: eventual consistency nhưng compensatable. Key requirement: mỗi step phải **idempotent** (gọi nhiều lần cùng kết quả) và có **compensating action** rõ ràng. Payment saga đặc biệt hay được hỏi trong interview — explain được choreography vs orchestration là điểm cộng lớn.

---

### Q: What is Two-Phase Commit (2PC) and why is it rarely used in microservices? / 2PC là gì và tại sao ít dùng trong microservices? 🔴 Senior

**A:** 2PC is a protocol where a coordinator asks all participants to "prepare" (Phase 1), then commits or aborts (Phase 2). It provides ACID guarantees across distributed nodes but has critical drawbacks: coordinator is a SPOF, all participants block during Phase 1 waiting for Phase 2, and partial failure leaves participants in uncertain state.

Vietnamese: 2PC đảm bảo strong consistency nhưng: (1) **Coordinator SPOF** — nếu coordinator crash sau Phase 1 và trước Phase 2, participants sẽ bị "stuck" (lock held, can't commit or abort). (2) **Blocking** — tất cả participants giữ locks trong suốt protocol → throughput thấp. (3) **Không scale** — latency của 2PC = sum of all participant latencies. Trong microservices scale lớn → Saga/eventual consistency là lựa chọn thực tế hơn. 2PC vẫn dùng trong single-database contexts (PostgreSQL distributed transactions với FDW, XA transactions).

