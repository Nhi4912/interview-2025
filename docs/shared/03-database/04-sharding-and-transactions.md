# Database Sharding & Transaction Isolation / Phân Mảnh Cơ Sở Dữ Liệu và Cô Lập Giao Dịch

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **Prerequisites**: [Database Theory](./database-theory.md) | [Indexing & Optimization](./02-indexing-and-optimization.md)
> **See also**: [Replication & Partitioning](../02-system-design/replication-partitioning.md) | [BE Database Advanced](../../be-track/03-database-advanced/)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinCommerce (Winmart) inventory service:** Khi user checkout, 3 events cần happen trong 1 transaction: (1) trừ inventory, (2) tạo order record, (3) charge payment. Trong MySQL với default isolation level (REPEATABLE READ), hai users đồng thời checkout item cuối cùng — cả hai thấy `inventory = 1`, cả hai commit. Kết quả: `inventory = -1`. Fix: dùng `SELECT ... FOR UPDATE` (pessimistic locking) hoặc optimistic locking với `version` column.

**Bài học:** Transaction isolation levels không phải academic — dirty read, non-repeatable read, phantom read xảy ra trong production nếu không chọn đúng isolation level.

---

## Overview / Tổng Quan

Ba chủ đề hay bị hỏi ở phỏng vấn Senior:

1. **Sharding** — cách scale database ngang khi một node không đủ
2. **Transaction Isolation** — cách DB xử lý concurrent transactions và các anomaly tương ứng
3. **Distributed Transactions** — Saga vs 2PC khi transactions span nhiều services

---

## Concept 1: Database Sharding / Phân Mảnh Cơ Sở Dữ Liệu

> 🧠 **Memory Hook:** RANGE → hotspot cuối shard. HASH % N → resharding nightmare (gần toàn bộ keys di chuyển). **CONSISTENT HASHING** → chỉ 1/N data di chuyển khi thêm/bớt node. Cassandra, DynamoDB, Redis Cluster đều chọn Consistent Hashing — đây là lý do tại sao.

### Tại sao tồn tại?

**Tại sao tồn tại?**

Write throughput và dataset của 1 DB node có giới hạn vật lý (disk I/O, RAM, CPU) → **Why?**
Khi data vượt TB-scale hoặc millions writes/sec, vertical scaling (mua server xịn hơn) hết hiệu quả → **Why?**
Cần phân tán data ra nhiều nodes để mỗi node chỉ xử lý một phần workload → **Why?**
→ **Sharding**: chia dataset thành các **shard** (phân mảnh), mỗi shard nằm trên server riêng, cùng nhau phục vụ toàn bộ traffic.

### Layer 1 — Analogy (12 tuổi)

**Thư viện 1 triệu cuốn sách:**

Thư viện chỉ có **1 kệ khổng lồ** → thủ thư phải lục tìm trong 1 triệu cuốn mỗi khi ai hỏi → chậm, quá tải.

Sharding = chia thành **10 kệ theo chữ cái**: A–C, D–F, G–I... Khi ai cần sách "Einstein" → thẳng đến kệ E–F. Mỗi kệ có thủ thư riêng phục vụ song song → nhanh hơn 10 lần.

**Vấn đề:** Nếu chia kệ theo mức độ phổ biến (kệ 1 = sách bán chạy nhất), kệ 1 sẽ quá tải còn kệ 9 nhàn rỗi → đây chính là **hotspot**.

### Layer 2 — How It Works

**4 Sharding Strategies:**

#### 1. Range-based Sharding

```
Shard 0: user_id 1 – 1,000,000
Shard 1: user_id 1,000,001 – 2,000,000
Shard 2: user_id 2,000,001 – 3,000,000
```

- ✅ **Pros**: Range queries efficient (get users 500k–600k → chỉ 1 shard)
- ❌ **Cons**: **Hotspot problem** — new users luôn vào shard cuối; uneven load

#### 2. Hash-based Sharding

```
shard_id = hash(user_id) % num_shards

user_id=123  → hash=0x4a2 → shard 0x4a2 % 3 = 2
user_id=456  → hash=0x8f1 → shard 0x8f1 % 3 = 1
```

- ✅ **Pros**: Even distribution, no hotspots
- ❌ **Cons**: Range queries phải scan all shards; **resharding problem** — thêm shard → thay đổi % N → gần toàn bộ keys di chuyển

#### 3. Consistent Hashing

```
Hash ring: 0 ─────────────────────────────── 2^32
                │                                │
          Shard A(0°)    Shard B(120°)    Shard C(240°)

user_id → hash → tìm shard clockwise tiếp theo trên ring
Thêm Shard D: chỉ keys giữa C và D di chuyển (≈ 1/N tổng)
```

- ✅ **Pros**: Thêm/bớt shard chỉ di chuyển 1/N data (vs ~100% với hash % N)
- ❌ **Cons**: Distribution không đều nếu ít shards (fix bằng **virtual nodes**)
- 🏭 **Used by**: Cassandra, DynamoDB, Redis Cluster

#### 4. Directory-based Sharding

```
Lookup table (separate metadata DB):
  user 123 → shard 2
  user 456 → shard 0
  user 789 → shard 1
```

- ✅ **Pros**: Full flexibility, dễ migrate individual users sang shard khác
- ❌ **Cons**: Lookup table = **single point of failure** + latency bottleneck

**Hotspot Fixes:**

```
Fix 1: Shard splitting — chia shard nóng thành 2+ shards nhỏ hơn
Fix 2: Write amplification — replicate hot row sang nhiều shards, reads balanced
Fix 3: Caching — cache hot data (celebrity tweet) ở Redis, bypass DB shard
Fix 4: Composite shard key — user_id + random bucket:
  shard = hash(celebrity_id + random_suffix) % N
  Writes → random bucket; Reads → fan-out và merge
```

**Cross-shard Transactions:**

| Approach                   | How                                               | Trade-offs                             |
| -------------------------- | ------------------------------------------------- | -------------------------------------- |
| **Two-Phase Commit (2PC)** | Coordinator prepares all shards, then commits     | ACID nhưng chậm, coordinator = SPOF    |
| **Saga Pattern**           | Compensating transactions per step                | Eventual consistency, complex rollback |
| **Avoid entirely**         | Design data model để transactions chỉ cần 1 shard | Best option — rethink data model       |

**Twitter's approach**: Sharded tweets by tweet_id (not user_id). Celebrity accounts dùng write amplification — tweet stored in each follower's timeline shard (fanout on write).

### Layer 3 — Edge Cases & Trade-offs

- **Cross-shard transactions** không atomic natively — 2PC chậm và có coordinator SPOF; Saga là eventual consistency; best option là tránh cross-shard hoàn toàn qua thiết kế shard key tốt
- **Hotspot shards** xuất hiện với celebrity accounts, viral content, hoặc time-based keys (all writes → "current" shard)
- **Resharding hash % N** di chuyển gần toàn bộ data — không thể làm online trong production mà không có downtime đáng kể
- **Directory-based lookup table**: nếu metadata DB down → toàn bộ routing bị chặn — SPOF nghiêm trọng hơn cả data shards
- **Composite shard keys** giải hotspot nhưng yêu cầu fan-out reads (query N shards và merge) — tăng latency và complexity

### Common Mistakes

| Sai lầm                                                  | Tại sao sai                                                                                                       | Đúng là                                                                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Dùng `hash(key) % N` cho production                      | Thêm 1 shard → N thay đổi → hầu hết keys remap sang shard khác → downtime hoặc data inconsistency không thể tránh | Dùng Consistent Hashing: chỉ 1/N data di chuyển, resharding có thể làm rolling mà không cần downtime                |
| Shard theo auto-increment ID hoặc `created_at` timestamp | New records luôn vào shard cuối → hotspot; các shard cũ nhàn rỗi, shard mới quá tải                               | Shard theo `user_id` hoặc entity hash để phân phối writes đều — range queries chấp nhận được phải scan nhiều shards |
| Cross-shard transaction với 2PC trong microservices      | Coordinator SPOF; tất cả participants giữ locks suốt 2 phases → throughput thấp, không scale khi số services tăng | Thiết kế shard key sao cho transaction chỉ cần 1 shard; dùng Saga (eventual consistency) nếu bắt buộc cross-shard   |

### Knowledge Chain

**📚 Cần biết trước:**

- [Database Theory](./database-theory.md) — ACID, CAP theorem: nền tảng để hiểu sharding trade-offs (Consistency vs Availability)
- [Indexing & Optimization](./02-indexing-and-optimization.md) — nguyên tắc chọn shard key tương tự chọn index key: cardinality cao, phân phối đều

**➡️ Để hiểu tiếp:**

- [Replication & Partitioning](../02-system-design/replication-partitioning.md) — sharding (write scale) thường kết hợp với replication (read scale)
- [Distributed Transactions](#concept-3-distributed-transactions) — cross-shard transactions dẫn thẳng đến Saga và 2PC trade-offs

### Self-Check

| #   | Dạng           | Câu hỏi                                                                                                         |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | 4 sharding strategies là gì? Trade-off chính của từng loại (1 pros, 1 cons)?                                    |
| 2   | 👁️ Visual      | Vẽ consistent hash ring với 3 shards — user_id=789 rơi vào shard nào? Khi thêm Shard D, data nào di chuyển?     |
| 3   | 🛠️ Application | E-commerce 100M users — chọn shard key gì cho bảng `orders`? Tại sao không chọn `order_date`?                   |
| 4   | 🐛 Debug       | Shard 2 nhận 80% traffic dù dùng hash-based sharding — 2 nguyên nhân có thể là gì và fix thế nào?               |
| 5   | 🎓 Teach       | Giải thích cho junior dev tại sao `hash % N` là vấn đề trong production và Consistent Hashing giải quyết ra sao |

> ✅ Đạt: trả lời được ≥4/5. Nếu thiếu → review Layer tương ứng.

**💬 Feynman Prompt:** Giải thích Consistent Hashing cho người không biết database — tại sao thêm 1 shard chỉ di chuyển 1/N data thay vì gần tất cả, và virtual nodes giải quyết vấn đề gì?

---

## Concept 2: Transaction Isolation Levels / Mức Độ Cô Lập Giao Dịch

> 🧠 **Memory Hook:** 4 levels như 4 kiểu phòng thi — **RU** (thấy bài nháp), **RC** (chỉ thấy bài đã nộp), **RR** (bài nộp không đổi khi mình đang đọc), **S** (phòng kín một mình). Mỗi bước lên level ngăn thêm 1 anomaly: dirty read → non-repeatable read → phantom read.

### Tại sao tồn tại?

**Tại sao tồn tại?**

Nhiều transactions đọc/ghi cùng data đồng thời là bình thường trong production → **Why?**
Nếu không có quy tắc, T2 thấy data chưa commit của T1 → quyết định dựa trên data có thể bị rollback → **Why?**
Database cần contract rõ ràng: "transaction của mày thấy gì khi transaction khác đang modify cùng data" → **Why?**
→ **Isolation Levels**: 4 mức compromise giữa data consistency (correctness) và concurrency (performance).

### Layer 1 — Analogy (12 tuổi)

**4 kiểu phòng thi:**

- **READ UNCOMMITTED** 📄 Thấy bài nháp viết dở của người kế bên — họ chưa nộp vẫn thấy hết. Nguy hiểm: bạn copy đáp án rồi họ xóa đi (rollback).
- **READ COMMITTED** ✅ Chỉ thấy bài đã nộp chính thức. Nhưng nếu họ nộp lại lúc bạn đang xem, lần xem sau thấy bản mới — bài thay đổi.
- **REPEATABLE READ** 🔒 Lần đầu nhìn bài người kế, DB "chụp snapshot" lại. Lần sau nhìn → vẫn thấy snapshot đó dù họ đã sửa. Nhưng nếu **người mới vào phòng** (INSERT row mới) thì vẫn thấy.
- **SERIALIZABLE** 🚪 Phòng kín, một mình. Không ai vào được. Chậm nhất nhưng tuyệt đối chính xác.

### Layer 2 — How It Works

**Anomaly Prevention Matrix:**

| Isolation Level      | Dirty Read   | Non-Repeatable Read | Phantom Read   |
| -------------------- | ------------ | ------------------- | -------------- |
| **READ UNCOMMITTED** | ❌ Possible  | ❌ Possible         | ❌ Possible    |
| **READ COMMITTED**   | ✅ Prevented | ❌ Possible         | ❌ Possible    |
| **REPEATABLE READ**  | ✅ Prevented | ✅ Prevented        | ⚠️ Partially\* |
| **SERIALIZABLE**     | ✅ Prevented | ✅ Prevented        | ✅ Prevented   |

\* MySQL InnoDB REPEATABLE READ dùng next-key locks để partially prevent phantom reads; PostgreSQL REPEATABLE READ vẫn có thể có phantom reads.

**3 Anomalies Explained:**

**1. Dirty Read** — đọc uncommitted data của transaction khác

```sql
-- T1 (chưa commit):
UPDATE accounts SET balance = 1000 WHERE id = 1;

-- T2 (READ UNCOMMITTED): đọc 1000 dù T1 chưa commit
SELECT balance FROM accounts WHERE id = 1; -- returns 1000 (dirty!)

-- T1 rollback → T2 ra quyết định dựa trên data không bao giờ tồn tại
```

**2. Non-Repeatable Read** — cùng query, đọc 2 lần cho kết quả khác nhau

```sql
-- T1 read 1:
SELECT balance FROM accounts WHERE id = 1; -- returns 500

-- T2 commit giữa 2 lần T1 đọc:
UPDATE accounts SET balance = 800 WHERE id = 1; COMMIT;

-- T1 read 2:
SELECT balance FROM accounts WHERE id = 1; -- returns 800 (changed!)
```

**3. Phantom Read** — tập hợp rows thay đổi giữa hai queries trong cùng transaction

```sql
-- T1 count 1:
SELECT COUNT(*) FROM orders WHERE user_id = 42; -- returns 3

-- T2 insert row mới và commit:
INSERT INTO orders (user_id, ...) VALUES (42, ...); COMMIT;

-- T1 count 2:
SELECT COUNT(*) FROM orders WHERE user_id = 42; -- returns 4 (phantom!)
```

**DB Defaults:**

- **PostgreSQL default**: `READ COMMITTED` — MVCC cho snapshot reads, no read locks
- **MySQL InnoDB default**: `REPEATABLE READ` — next-key locks cho gap locking

```sql
-- Explicitly set higher isolation level (PostgreSQL):
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
  SELECT balance FROM accounts WHERE id = 1;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

**MVCC (Multi-Version Concurrency Control) — PostgreSQL:**

```
Row "account id=1":
  Version 1: balance=500, xmin=100, xmax=200  (tạo bởi txn 100, xóa bởi txn 200)
  Version 2: balance=800, xmin=200, xmax=NULL (tạo bởi txn 200, đang live)

Txn 150 đọc: thấy Version 1 (xmin=200 > 150, Version 2 chưa tồn tại với txn 150)
Txn 250 đọc: thấy Version 2 (xmin=200 < 250, là version mới nhất)
```

→ **Readers không block writers, writers không block readers** — lý do PostgreSQL read-heavy workloads scale tốt.

**Cost:** Dead row versions tích lũy → `VACUUM` phải dọn. Long-running transactions giữ old versions tồn tại → VACUUM không xóa được → **table bloat**.

**Deadlock Prevention:**

```
T1: LOCK row A → đợi row B
T2: LOCK row B → đợi row A
→ DEADLOCK — DB phát hiện và kill 1 transaction
```

Strategies:

```sql
-- 1. Consistent lock ordering: luôn lock theo thứ tự (smaller id trước)
BEGIN;
SELECT * FROM accounts WHERE id = LEAST(1,2)    FOR UPDATE;
SELECT * FROM accounts WHERE id = GREATEST(1,2) FOR UPDATE;
COMMIT;

-- 2. SKIP LOCKED: pattern chuẩn cho distributed job queues
SELECT * FROM jobs WHERE status='pending' LIMIT 1 FOR UPDATE SKIP LOCKED;

-- 3. Optimistic locking: no DB locks, detect conflict at commit
UPDATE products
SET stock = stock - 1, version = version + 1
WHERE id = 123 AND version = 5;
-- 0 rows affected → conflict → retry application-side
```

### Layer 3 — Edge Cases & Trade-offs

- **MySQL REPEATABLE READ** dùng next-key locks để partially prevent phantom reads — không hoàn toàn như SERIALIZABLE trong mọi edge case; test kỹ với gap inserts
- **SERIALIZABLE throughput** thấp nhất: serialize tất cả conflicting transactions — high-contention workloads (e.g., ticketing) bị bottleneck nghiêm trọng
- **MVCC bloat (PostgreSQL)**: long-running transactions giữ old row versions live → VACUUM không xóa được → table size phình to → sequential scans chậm hơn
- **Optimistic locking** hiệu quả khi conflict rate thấp; khi conflict cao → retry storms làm tình huống worse than pessimistic locking
- **`SELECT FOR UPDATE SKIP LOCKED`** là pattern chuẩn cho distributed job queues — multiple workers consume jobs không deadlock, không block lẫn nhau

### Common Mistakes

| Sai lầm                                     | Tại sao sai                                                                                            | Đúng là                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Dùng READ UNCOMMITTED để "tăng performance" | Đọc uncommitted data → decision dựa trên data có thể bị rollback → data corruption, negative inventory | READ COMMITTED là minimum safe level; performance gain của RU không đáng với risk data corruption       |
| Nghĩ REPEATABLE READ ngăn mọi anomaly       | INSERT mới (không phải UPDATE) vẫn visible trong cùng transaction → `COUNT(*)` thay đổi → phantom read | Dùng SERIALIZABLE hoặc `SELECT ... FOR UPDATE` khi cần ngăn phantom reads (e.g., "last seat" scenarios) |
| Lock rows theo thứ tự bất kỳ trong code     | T1 lock A→B, T2 lock B→A → deadlock cấu trúc, không tránh được dù retry                                | Luôn lock theo thứ tự nhất quán (e.g., smaller `id` trước); chuẩn hóa thứ tự trong một helper function  |

### Knowledge Chain

**📚 Cần biết trước:**

- [Database Theory](./database-theory.md) — ACID, đặc biệt Isolation property và tại sao nó cần thiết cho correctness
- [Indexing & Optimization](./02-indexing-and-optimization.md) — row locks liên quan đến index: `SELECT FOR UPDATE` lock theo index range hay full table scan tùy query plan

**➡️ Để hiểu tiếp:**

- [Distributed Transactions](#concept-3-distributed-transactions) — khi transactions phải span nhiều databases hoặc services, isolation levels không còn đủ
- [NoSQL & NewSQL](./03-nosql-and-newsql.md) — eventual consistency trong distributed DBs vs strong isolation của SQL

### Self-Check

| #   | Dạng           | Câu hỏi                                                                                                           |
| --- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | 3 anomalies là gì? Isolation level nào (minimum) ngăn từng loại?                                                  |
| 2   | 👁️ Visual      | Vẽ timeline T1 và T2 showing phantom read — step nào và tại thời điểm nào tạo ra phantom?                         |
| 3   | 🛠️ Application | VinCommerce checkout: 2 users cùng checkout item cuối — isolation level nào và locking strategy nào phù hợp nhất? |
| 4   | 🐛 Debug       | Production: `inventory = -1` sau concurrent checkouts dù dùng REPEATABLE READ. Root cause? Exact fix?             |
| 5   | 🎓 Teach       | Giải thích MVCC cho junior — tại sao PostgreSQL readers không block writers? Trade-off (MVCC bloat) là gì?        |

> ✅ Đạt: trả lời được ≥4/5. Nếu thiếu → review Layer tương ứng.

**💬 Feynman Prompt:** Giải thích Phantom Read — dùng ví dụ inventory checkout để show khi nào REPEATABLE READ không đủ và cần SERIALIZABLE hoặc `SELECT FOR UPDATE`.

---

## Concept 3: Distributed Transactions / Giao Dịch Phân Tán

> 🧠 **Memory Hook:** **2PC** = người trung gian bị tai nạn giữa Phase 1 và Phase 2 → tất cả participants chờ mãi mãi (blocking SPOF). **Saga** = mỗi bước có "nút hoàn tác" riêng (compensating action) → eventual consistency nhưng không bị stuck. **Choreography** (events lan tự nhiên) vs **Orchestration** (nhạc trưởng ra lệnh từng bước).

### Tại sao tồn tại?

**Tại sao tồn tại?**

Microservices = mỗi service có database riêng biệt, không thể share 1 DB connection → **Why?**
Không thể dùng single DB transaction để đảm bảo atomicity cross-service → **Why?**
Order + Inventory + Payment phải cùng succeed hoặc cùng rollback — partial commit là unacceptable → **Why?**
→ **Distributed Transactions**: **2PC** cho strong consistency (ACID, nhưng không scale), **Saga** cho eventual consistency (scalable, resilient — lựa chọn thực tế cho microservices).

### Layer 1 — Analogy (12 tuổi)

**Đặt combo bữa tối ở 3 quán riêng biệt:**

**2PC (Two-Phase Commit):**
Một người trung gian. Phase 1: gọi cho cả 3 quán "có sẵn nguyên liệu không?" → cả 3 "có, đang giữ cho anh". Phase 2: "bắt đầu nấu đi!" Nếu người trung gian **bị tai nạn sau Phase 1 nhưng trước Phase 2** → 3 quán đứng chờ mãi mãi, không dám nấu cũng không dám thả nguyên liệu ra (blocked, locks held indefinitely).

**Saga:**
Đặt quán 1 (xong, commit) → đặt quán 2 (xong, commit) → đặt quán 3 (hết nguyên liệu, thất bại). Compensate: **hủy quán 2** (refund tiền đặt) → **hủy quán 1** (refund tiền đặt). Mỗi bước có "nút hoàn tác" riêng. Không có ai bị stuck. Tuy nhiên: khoảng thời gian giữa "quán 1 nấu" và "quán 3 thất bại" là **intermediate inconsistent state**.

### Layer 2 — How It Works

**2PC vs Saga — Comparison:**

|                  | 2PC                                     | Saga                           |
| ---------------- | --------------------------------------- | ------------------------------ |
| **Consistency**  | Strong (ACID)                           | Eventual (BASE)                |
| **Failure mode** | Coordinator crash → participants stuck  | Compensation chain rollback    |
| **Throughput**   | Low (blocking locks across all phases)  | High (only local transactions) |
| **Complexity**   | Simple protocol, catastrophic failures  | Complex compensation logic     |
| **SPOF**         | Coordinator                             | None (distributed)             |
| **Use case**     | Single-cluster distributed DB (XA, FDW) | Microservices                  |

**Saga — Hai Implementations:**

```
Choreography: services react to each other's events (no central coordinator)

  OrderCreated → InventoryService listens
              → InventoryReserved → PaymentService listens
              → PaymentCharged → DeliveryService listens
              → DeliveryAssigned ✅

  ✅ Decoupled — services không biết nhau
  ❌ Saga state phân tán qua events → hard to debug, hard to audit, hard to rollback

Orchestration: central saga orchestrator sends explicit commands

  Orchestrator → InventoryService.Reserve()
  Orchestrator → PaymentService.Charge()
  Orchestrator → DeliveryService.Assign()

  ✅ Explicit flow — orchestrator biết toàn bộ saga state
  ❌ Coupling đến orchestrator; orchestrator có thể là bottleneck
```

**Saga Compensation Flow:**

```
Step 1: Reserve inventory   → Compensation: Release inventory
Step 2: Charge payment      → Compensation: Refund payment
Step 3: Assign delivery     → Compensation: Cancel delivery

If step 3 fails:
  Execute Compensation(step 2): Refund payment
  Execute Compensation(step 1): Release inventory

KEY REQUIREMENT: Mỗi step phải IDEMPOTENT
  → Gọi N lần = gọi 1 lần (network retry safety)
  → INSERT ... ON CONFLICT DO NOTHING
  → Check idempotency key trước khi process
```

### Layer 3 — Edge Cases & Trade-offs

- **Saga không phải ACID**: intermediate states visible — order "created" nhưng payment "pending" là valid visible state trong distributed system; UX phải handle trạng thái này
- **Compensating transactions phải idempotent**: network retry có thể trigger compensation 2 lần → double refund nếu không guard bằng idempotency key
- **Choreography khó debug**: để trace saga state phải correlate events across nhiều services và message queues — phải có distributed tracing (e.g., Jaeger, Zipkin)
- **2PC vẫn hợp lệ** trong intra-database contexts: PostgreSQL Foreign Data Wrappers, XA transactions, single-cluster distributed DBs như CockroachDB
- **Eventual consistency window**: khoảng thời gian giữa "step 1 done" và "step N done" là data inconsistent — phải design UX cho trạng thái "đang xử lý" thay vì "đã xác nhận"

### Common Mistakes

| Sai lầm                                        | Tại sao sai                                                                                                               | Đúng là                                                                                                     |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Dùng 2PC cho microservices production          | Coordinator SPOF; blocking locks giữ xuyên suốt 2 phases → throughput thấp, không scale khi số services hoặc latency tăng | Dùng Saga: local transactions với compensating actions, eventual consistency chấp nhận được                 |
| Quên idempotency trong Saga steps              | Network retry → cùng step gọi 2 lần → double charge payment, duplicate inventory deduction                                | Mỗi step phải idempotent: `INSERT ... ON CONFLICT DO NOTHING`, check `idempotency_key` trước khi xử lý      |
| Dùng Choreography cho Saga phức tạp (>3 steps) | Saga state phân tán qua events → hard to debug failure, hard to audit, hard to implement rollback                         | Dùng Orchestration cho complex flows: orchestrator lưu explicit saga state, dễ retry và recover khi failure |

### Knowledge Chain

**📚 Cần biết trước:**

- [Transaction Isolation](#concept-2-transaction-isolation-levels) — hiểu isolation trong single DB trước khi extend ra distributed context
- [Database Sharding](#concept-1-database-sharding) — cross-shard transactions là use case chính dẫn đến nhu cầu distributed transactions

**➡️ Để hiểu tiếp:**

- [Distributed Patterns](../../be-track/04-be-system-design/04-distributed-patterns.md) — Saga trong context microservices architecture đầy đủ (event sourcing, outbox pattern)
- [Replication & Partitioning](../02-system-design/replication-partitioning.md) — distributed data patterns bổ sung cho Saga

### Self-Check

| #   | Dạng           | Câu hỏi                                                                                                   |
| --- | -------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | 2PC gồm mấy phase? Tại sao coordinator crash sau Phase 1 là catastrophic cho participants?                |
| 2   | 👁️ Visual      | Vẽ Saga flow cho checkout: inventory → payment → delivery với compensating actions khi payment thất bại   |
| 3   | 🛠️ Application | Thiết kế Saga cho Grab: driver accept ride + charge rider. Chọn Choreography hay Orchestration? Tại sao?  |
| 4   | 🐛 Debug       | Payment service nhận cùng charge request 2 lần do network retry → double charge. Root cause và exact fix? |
| 5   | 🎓 Teach       | Giải thích cho PM tại sao không dùng 2PC trong microservices — dùng analogy 3 quán ăn                     |

> ✅ Đạt: trả lời được ≥4/5. Nếu thiếu → review Layer tương ứng.

**💬 Feynman Prompt:** Giải thích Saga pattern — tại sao idempotency là bắt buộc, và điều gì xảy ra nếu compensating action cũng thất bại (nested failure scenario)?

---

## Interview Q&A Summary / Tổng Kết Phỏng Vấn

| Question                          | Level | Key Answer                                                                                        |
| --------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| When to shard?                    | 🟡    | Write throughput limit, dataset quá lớn cho single node                                           |
| Consistent hashing vs hash mod N? | 🟡    | Consistent: chỉ 1/N data di chuyển khi thêm shard                                                 |
| Fix a hotspot shard?              | 🔴    | Split shard, cache hot data, composite shard key với random bucket                                |
| 4 isolation levels?               | 🟡    | RU/RC/RR/S — ngăn dirty/non-repeatable/phantom reads tuần tự                                      |
| PostgreSQL default isolation?     | 🟡    | READ COMMITTED, dùng MVCC (readers không block writers)                                           |
| How to prevent deadlocks?         | 🟡    | Consistent lock ordering, short txns, optimistic locking với version column                       |
| What is MVCC?                     | 🔴    | Multiple row versions; readers/writers không block nhau; cost là VACUUM để dọn dead versions      |
| 2PC vs Saga?                      | 🔴    | 2PC: ACID nhưng blocking SPOF, không scale; Saga: eventual consistency, scalable, cần idempotency |

---

**See also**: [Database Theory](./database-theory.md) | [NoSQL & NewSQL](./03-nosql-and-newsql.md) | [Replication & Partitioning](../02-system-design/replication-partitioning.md)
