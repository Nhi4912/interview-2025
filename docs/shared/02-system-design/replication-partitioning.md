# Replication & Partitioning / Sao Chép và Phân Vùng Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [System Design Theory](./system-design-theory.md) | [Consensus Algorithms](./consensus-algorithms.md) | [Sharding & Transactions](../../shared/03-database/04-sharding-and-transactions.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**VinID MySQL replication lag incident:** Production setup: 1 primary + 2 read replicas. Analytics team chạy heavy report queries trên replica. Khi primary có burst of writes (flash sale), replica replication lag tăng lên 45 giây. Result: user đặt hàng thành công nhưng refresh trang thấy "order not found" (vì đọc từ lagging replica). Fix: route critical reads (order status) đến primary, analytics reads đến replica with lag tolerance.

**Bài học:** Replication lag không phải vấn đề lý thuyết — nó xảy ra trong production. Architect phải biết khi nào đọc từ primary vs replica.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Replication giống photocopy tài liệu: bản gốc (primary) được sao chép ra nhiều bản (replicas) để nhiều người cùng đọc. Vấn đề: nếu bản gốc vừa sửa xong, photocopy chưa cập nhật — bạn đọc phiên bản cũ. Sharding giống chia tài liệu thành nhiều quyển theo chủ đề (shard key) — mỗi người giữ một phần.

**Why it matters:** Replication (cho read scale + HA) và sharding (cho write scale) là hai kỹ thuật scale DB quan trọng nhất. Senior phải biết khi nào dùng cái nào.

---

## Visual Overview / Sơ Đồ Tổng Quan

### Replication Models

```
SINGLE LEADER (Master-Slave):
        ┌──────────┐
        │  Leader  │  ← all WRITES go here
        └─────┬────┘
              │ replication log
       ┌──────┴──────┐
       ▼             ▼
  ┌─────────┐  ┌─────────┐
  │Follower1│  │Follower2│  ← READS can go here
  └─────────┘  └─────────┘

  Pros: simple, strong consistency for writes
  Cons: leader = bottleneck + SPOF for writes

MULTI-LEADER:
  ┌──────────┐   ┌──────────┐
  │ Leader A │◄──►│ Leader B │  ← both accept writes
  └─────┬────┘   └────┬─────┘   ← sync between leaders
        ▼              ▼
  [Followers]    [Followers]

  Pros: geo-distributed writes, no single write bottleneck
  Cons: CONFLICT RESOLUTION needed (concurrent writes to same data)

LEADERLESS (Dynamo-style):
  Client writes to W of N nodes
  Client reads from R of N nodes
  Consistency if W + R > N

  W=2, R=2, N=3:  ← quorum read+write
  ┌────┐ ┌────┐ ┌────┐
  │ N1 │ │ N2 │ │ N3 │  Write to 2/3, Read from 2/3
  └────┘ └────┘ └────┘  At least 1 overlap → fresh data
```

### Replication Lag Visualization

```
Async replication timeline:
t=0: Client writes user.name="Alice" to Leader
t=0: Leader commits locally
t=2ms: Follower1 receives and applies
t=5ms: Follower2 receives and applies

Read-your-own-writes problem:
t=1ms: Client reads from Follower1 → still "Bob" (stale!)
                                      ↑
                        Replication lag window

Fix: read-after-write consistency:
  Option 1: Read own writes from Leader
  Option 2: Track replication position, wait until follower caught up
  Option 3: Sticky session — always read from same replica
```

### Partitioning Strategies

```
RANGE PARTITIONING:
Key range:  [A-F]  [G-M]  [N-Z]
Shard:       P1     P2     P3
Problem: "A" names are popular → P1 = hotspot!

HASH PARTITIONING:
hash("alice") % 3 = 1 → Shard P1
hash("bob")   % 3 = 2 → Shard P2
Pros: even distribution
Cons: no range queries, resharding = move everything

CONSISTENT HASHING:
Ring: ──────A(0°)──────B(120°)──────C(240°)──────
       ^ key           ^ key           ^ key
       stored at A     stored at B     stored at C

Add node D between A and B:
Only keys previously at B that are now "closer" to D move
≈ 1/N of total keys move (vs ALL with hash mod N!)
```

---

---

## Overview / Tổng Quan

| #   | Concept / Khái niệm                    | Role / Vai trò                                                 | Interview Weight |
| --- | -------------------------------------- | -------------------------------------------------------------- | ---------------- |
| 1   | **Replication Models**                 | Single-leader, multi-leader, leaderless — khi nào dùng cái nào | ⭐⭐⭐⭐⭐       |
| 2   | **Replication Lag & Consistency**      | Read-after-write, monotonic reads, causal consistency          | ⭐⭐⭐⭐         |
| 3   | **Sync vs Async Replication**          | Durability vs latency tradeoff — semi-sync middle ground       | ⭐⭐⭐⭐         |
| 4   | **Range Partitioning**                 | Key-range sharding — range queries vs hotspot                  | ⭐⭐⭐           |
| 5   | **Hash & Consistent Hashing**          | Even distribution, minimal key movement on rebalance           | ⭐⭐⭐⭐⭐       |
| 6   | **Rebalancing & Migration**            | Zero-downtime shard splits, dual-write patterns                | ⭐⭐⭐⭐         |
| 7   | **Cross-Partition Queries & Hotspots** | Scatter-gather cost, shard key design, tenant isolation        | ⭐⭐⭐⭐         |

**Relationship / Mối quan hệ:** Replication (HA + read scale) và Partitioning (write scale) là 2 trụ cột scale database. Replication model quyết định consistency guarantees; shard key quyết định query performance. Consistent hashing + quorum kết nối cả hai.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: Replication Models

🪝 **Memory Hook:** "3 mô hình = 3 cấp độ quyền lực: 1 vua (single-leader), nhiều vua (multi-leader), dân chủ (leaderless)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Cần bản sao data cho HA + read performance → cần protocol để đồng bộ
- **Level 2:** Single-leader = simple + consistent nhưng write bottleneck. Multi-leader = geo-distributed writes nhưng conflict resolution. Leaderless = highest availability nhưng eventual consistency. Mỗi model là tradeoff khác nhau trên CAP/PACELC

**Layer 1 — Analogy / Ví dụ đơn giản:**
Single-leader = 1 biên tập viên duyệt bài, phóng viên gửi bài qua editor. Multi-leader = mỗi chi nhánh có editor riêng, sync cuối ngày (conflicts possible). Leaderless = mọi người đều có thể viết và đọc, quorum quyết định phiên bản đúng.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Single-Leader: Client → Leader → WAL → Followers replay
  Write path: 1 node | Read path: N nodes | Failover: election
  Used by: PostgreSQL, MySQL, MongoDB (default)

Multi-Leader: Client → Any Leader → Async sync between leaders
  Write path: N leaders | Read path: local leader | Conflict: LWW/CRDT
  Used by: CockroachDB, Cassandra (multi-DC), Google Docs

Leaderless: Client → W of N nodes | Read from R of N nodes
  Consistency: R+W > N → at least 1 fresh node in read set
  Used by: Cassandra, DynamoDB, Riak
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Multi-leader: concurrent update same row in 2 DCs → LWW may lose data silently
- Leaderless: sloppy quorum allows writes to non-home nodes → hinted handoff restores eventually
- Single-leader failover: unsynced writes on old leader may be lost → log divergence

| Sai lầm                           | Tại sao sai                                   | Đúng là                                       |
| --------------------------------- | --------------------------------------------- | --------------------------------------------- |
| "Single-leader can't scale reads" | Read replicas scale reads to thousands of QPS | Only writes are bottlenecked on leader        |
| "Multi-leader is always better"   | Conflict resolution adds enormous complexity  | Only use when geo-distributed writes required |
| "Leaderless = no consistency"     | With R+W>N, you get strong consistency        | Quorum math provides tunable consistency      |

🎯 **Interview Pattern:** "Compare replication models" → Three models: single-leader (simple, consistent), multi-leader (geo writes, conflicts), leaderless (high availability, quorum). Choose based on: write geography, consistency needs, conflict tolerance.

🔗 **Knowledge Chain:** Replication models → Consistency guarantees → CAP/PACELC tradeoffs → Real systems (PG, Cassandra, DynamoDB)

---

### Concept 2: Replication Lag & Consistency Guarantees

🪝 **Memory Hook:** "Lag = thời gian photocopy chưa kịp cập nhật — user thấy data cũ"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Async replication = follower luôn chậm hơn leader → reads từ follower có thể stale
- **Level 2:** 3 consistency guarantees giải quyết 3 vấn đề khác nhau: read-after-write (đọc ngay sau ghi), monotonic reads (không lùi thời gian), causal consistency (thấy nguyên nhân trước kết quả)

**Layer 1 — Analogy / Ví dụ đơn giản:**
Bạn post ảnh lên Facebook → refresh → "post not found" (vì đọc từ replica chưa sync). Đó là vi phạm read-after-write consistency.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Read-After-Write Consistency:
  Problem: Write → Leader → Read from Follower → STALE!
  Fix 1: Read own writes from Leader (route by user_id)
  Fix 2: Track replication position, wait for follower to catch up
  Fix 3: Sticky sessions — always read from same replica

Monotonic Reads:
  Problem: Request 1 → Follower A (fresh) → Request 2 → Follower B (stale)
  → User sees data "going back in time"
  Fix: Pin session to single replica

Causal Consistency:
  Problem: User A posts, User B comments, User C sees comment but not post
  Fix: Causal ordering via vector clocks or explicit dependencies
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Cross-device: user writes on phone, reads on laptop → different sessions → need global replication position tracking
- Flash sale burst: lag spikes from seconds to minutes → monitoring replication_lag metric critical

| Sai lầm                           | Tại sao sai                                   | Đúng là                                                   |
| --------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| "Replication lag is always small" | Under load, lag can reach minutes             | Monitor and alert on lag; route critical reads to primary |
| "Always read from primary"        | Defeats the purpose of read replicas          | Only route critical reads (order status) to primary       |
| "Eventual consistency = broken"   | Many use cases tolerate lag (analytics, feed) | Match consistency level to business requirement           |

🎯 **Interview Pattern:** "How to handle replication lag?" → Three guarantees (read-after-write, monotonic, causal). Implementation: route critical reads to primary, sticky sessions, track replication position. Real example: order just placed → read from primary.

🔗 **Knowledge Chain:** Replication lag → Consistency guarantees → Session routing → SLI/SLO monitoring

---

### Concept 3: Sync vs Async Replication

🪝 **Memory Hook:** "Sync = gọi điện chờ trả lời (chắc chắn nhưng chậm). Async = gửi tin nhắn (nhanh nhưng có thể mất)"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Sync = no data loss on failover nhưng high latency. Async = fast nhưng có thể mất data
- **Level 2:** Semi-sync (MySQL default) = wait for 1 replica → balance. PostgreSQL synchronous_standby_names cho sync mode. Tradeoff: durability vs latency vs availability

**Layer 1 — Analogy / Ví dụ đơn giản:**
Gửi thư quan trọng: sync = đi bưu điện đợi xác nhận nhận thư (chắc chắn); async = bỏ vào hòm thư (nhanh, hy vọng đến); semi-sync = gửi express, theo dõi 1 điểm check.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
┌──────────────────────────────────────────────┐
│ SYNC:   Client → Primary → Replica → ACK    │
│         Latency = primary + replica RTT      │
│         Durability: ✅ No data loss           │
│         Availability: ❌ Replica down = block │
│                                              │
│ ASYNC:  Client → Primary → ACK → Background │
│         Latency = primary only               │
│         Durability: ❌ May lose on failover   │
│         Availability: ✅ Replica independent  │
│                                              │
│ SEMI-SYNC: Wait for 1 of N replicas         │
│         Latency = primary + min(replica RTTs)│
│         Durability: ✅ (1 replica guaranteed) │
│         Availability: ⚠️ Degrades gracefully │
└──────────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Sync with slow replica: entire system slows to slowest replica → timeout and fallback to async
- Async failover: RPO > 0 (data window lost) → banking systems can't accept this
- Group replication (MySQL): majority-based sync → combines sync durability with quorum availability

| Sai lầm                                      | Tại sao sai                                   | Đúng là                                                     |
| -------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| "Sync replication means zero latency impact" | It adds replica RTT to every write            | Latency = primary + max(replica RTTs for sync replicas)     |
| "Async means data will be lost"              | Only on failover, and only uncommitted writes | 99.99% of the time, async catches up within milliseconds    |
| "Semi-sync is always the best choice"        | Still blocks on 1 replica                     | For geo-distributed, async may be the only practical option |

🎯 **Interview Pattern:** "Sync vs async replication?" → Sync: strong durability, higher latency. Async: low latency, failover risk. Semi-sync: balanced. Decision based on RPO requirements (0 = sync, >0 = async acceptable).

🔗 **Knowledge Chain:** Sync/async → RPO/RTO → Disaster recovery → HA architecture

---

### Concept 4: Range Partitioning

🪝 **Memory Hook:** "Range = từ điển chia theo chữ cái — A-F quyển 1, G-M quyển 2. Nhưng nếu mọi người đều tra 'S'..."

**Why exists / Tại sao tồn tại:**

- **Level 1:** Data quá lớn cho 1 node → chia theo range để range queries vẫn hiệu quả
- **Level 2:** Range partitioning giữ locality: records gần nhau theo key nằm cùng shard → range scan nhanh. Nhưng sequential keys (timestamp, auto-increment) → hotspot ở shard cuối

**Layer 1 — Analogy / Ví dụ đơn giản:**
Chia danh bạ theo chữ cái: A-H → nhóm 1, I-P → nhóm 2, Q-Z → nhóm 3. Tìm "Alice" đến "Bob" chỉ cần 1 nhóm. Nhưng nếu tên Nguyễn chiếm 40% → nhóm 2 quá tải.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Range Partitioning:
┌─────────────────────────────────────┐
│ Key range:  [0-1M]  [1M-2M]  [2M+] │
│ Shard:       S1       S2      S3    │
│                                     │
│ ✅ Range query: WHERE id BETWEEN    │
│    1000 AND 2000 → only S1          │
│                                     │
│ ❌ Hotspot: auto-increment ID       │
│    → all new writes go to S3        │
│                                     │
│ ❌ Hotspot: timestamp-based key     │
│    → all writes to "today" shard    │
└─────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Dynamic range splitting (HBase, Bigtable): auto-split when shard exceeds size threshold
- Compound key: (tenant_id, timestamp) → range partition on tenant first, then time → avoids global hotspot
- Empty ranges after data deletion → need merging/compaction

| Sai lầm                                     | Tại sao sai                                           | Đúng là                                           |
| ------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| "Range partitioning always causes hotspots" | Only with sequential keys (timestamp, auto-increment) | Use composite keys or random prefix to distribute |
| "Hash partitioning is always better"        | Hash loses range query capability                     | Choose based on query patterns                    |
| "Shard boundaries are fixed"                | Most systems support dynamic splitting                | HBase, CockroachDB auto-split ranges              |

🎯 **Interview Pattern:** "When to use range vs hash partitioning?" → Range: when range queries are primary access pattern. Hash: when even distribution matters more. Consistent hashing: when cluster size changes frequently.

🔗 **Knowledge Chain:** Range partitioning → B-tree range scan → HBase/Bigtable regions → Dynamic splitting

---

### Concept 5: Hash & Consistent Hashing

🪝 **Memory Hook:** "Hash = blender xay đều. Consistent hashing = vòng tròn — thêm/bớt node chỉ di chuyển 1/N keys"

**Why exists / Tại sao tồn tại:**

- **Level 1:** hash(key) % N phân phối đều nhưng thêm node → toàn bộ keys bị rehash → catastrophic
- **Level 2:** Consistent hashing: keys và nodes trên vòng tròn → thêm node chỉ di chuyển 1/N keys. Virtual nodes (vnodes) giải quyết uneven distribution

**Layer 1 — Analogy / Ví dụ đơn giản:**
Chia bánh pizza thành 6 miếng cho 3 người (mỗi người 2 miếng). Thêm 1 người → hash mod: chia lại hết 6 miếng. Consistent hashing: chỉ chuyển 1-2 miếng từ người cũ cho người mới.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Hash mod N (naive):
  hash("alice") % 3 = 1 → Shard 1
  Add node: hash("alice") % 4 = 2 → Shard 2 (MOVED!)
  ~75% of keys move on 3→4 nodes change

Consistent Hashing:
  Ring: 0°────────90°────────180°────────270°────────360°
        Node A      Node B      Node C
  Key X (hash=120°) → clockwise → Node B

  Add Node D at 150°:
  Only keys between 90°-150° move from B to D
  ≈ 1/N of total keys move (vs ~75% with mod N)

Virtual Nodes:
  Each physical node has 100-200 vnodes on ring
  → even distribution despite physical node differences
  → fine-grained rebalancing
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Without vnodes: nodes with random positions on ring → uneven data distribution (up to 3x imbalance)
- Hotspot key (celebrity): even with consistent hashing, 1 key = 1 node → add random suffix to spread
- Jump consistent hash: faster O(1) alternative, but less flexible for weighted nodes

| Sai lầm                                         | Tại sao sai                                          | Đúng là                                           |
| ----------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------- |
| "Consistent hashing eliminates all rebalancing" | It minimizes movement, not eliminates                | ≈1/N keys move per node change                    |
| "More vnodes = always better"                   | Too many vnodes increase memory and routing overhead | 100-200 per physical node is typical              |
| "Consistent hashing solves hotspot"             | Hotspot from popular key still goes to 1 node        | Need application-level key splitting for hot keys |

🎯 **Interview Pattern:** "Explain consistent hashing" → Ring-based, keys assigned to next clockwise node. Add node: only 1/N keys move. Virtual nodes for even distribution. Used in: DynamoDB, Cassandra, Redis Cluster, CDN routing.

🔗 **Knowledge Chain:** Hash partitioning → Consistent hashing → Virtual nodes → DynamoDB/Cassandra → CDN routing

---

### Concept 6: Rebalancing & Migration

🪝 **Memory Hook:** "Rebalancing = chuyển nhà không tắt đèn — service vẫn chạy trong khi data di chuyển"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Nodes thêm/bớt, data skew → cần di chuyển data giữa shards
- **Level 2:** Zero-downtime migration: dual-write → backfill → verify → cutover. Key challenge: consistency during migration window

**Layer 1 — Analogy / Ví dụ đơn giản:**
Chuyển hàng từ kho A sang kho B mà cửa hàng vẫn mở. Bước 1: ghi đơn hàng mới vào cả 2 kho (dual-write). Bước 2: chuyển đơn cũ sang kho B. Bước 3: kiểm tra 2 kho giống nhau. Bước 4: chỉ dùng kho B.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Zero-Downtime Shard Migration:
┌─────────────────────────────────────────┐
│ Phase 1: DUAL-WRITE                     │
│   New writes → both old + new shard     │
│                                         │
│ Phase 2: BACKFILL                       │
│   Copy historical data to new shard     │
│   Throttle to avoid overloading source  │
│                                         │
│ Phase 3: VERIFY                         │
│   Compare checksums, row counts         │
│   Run shadow reads against both         │
│                                         │
│ Phase 4: CUTOVER                        │
│   Feature flag: route reads to new shard│
│   Monitor for errors                    │
│   Drop old shard after confidence period│
│                                         │
│ ROLLBACK: Feature flag → revert to old  │
└─────────────────────────────────────────┘
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Dual-write failure: one shard succeeds, other fails → need distributed transaction or async reconciliation
- Backfill race: row modified during backfill → use CDC (Change Data Capture) for continuous sync
- Large shard split: may take hours/days → need progress tracking and SLO monitoring

| Sai lầm                     | Tại sao sai                                        | Đúng là                                            |
| --------------------------- | -------------------------------------------------- | -------------------------------------------------- |
| "Just move data and switch" | Data changes during migration                      | Need dual-write or CDC for zero-downtime           |
| "Rebalancing is automatic"  | Automated rebalancing can cause cascading failures | Control bandwidth, monitor lag, have rollback plan |
| "Verify once is enough"     | Data keeps changing during verification            | Continuous verification until cutover              |

🎯 **Interview Pattern:** "How to perform zero-downtime migration?" → 4 phases: dual-write, backfill, verify, cutover. Always have rollback path. Use feature flags. Monitor checksums.

🔗 **Knowledge Chain:** Rebalancing → Dual-write → CDC → Feature flags → Blue-green deployment

---

### Concept 7: Cross-Partition Queries & Hotspots

🪝 **Memory Hook:** "Cross-shard = international call — đắt và chậm. Shard key sai = 1 shard hứng toàn bộ traffic"

**Why exists / Tại sao tồn tại:**

- **Level 1:** Queries spanning multiple shards = scatter-gather → high latency + resource cost
- **Level 2:** Root cause: shard key không match query pattern. Hotspot: sequential key hoặc popular entity → 1 shard quá tải. Fix: composite key, denormalization, secondary indexes

**Layer 1 — Analogy / Ví dụ đơn giản:**
Thư viện chia sách theo tác giả. Bạn cần tìm tất cả sách xuất bản năm 2024 → phải đi qua MỌI kệ (scatter-gather). Nếu chia theo năm thì query này nhanh, nhưng query "tất cả sách của tác giả X" lại phải đi qua mọi kệ.

**Layer 2 — Mechanics / Cơ chế kỹ thuật:**

```
Cross-Shard Query (Scatter-Gather):
  Query: SELECT * FROM orders WHERE created_at > '2024-01-01'
  Shard key: user_id
  → Must query ALL shards → merge results → SLOW

Shard Key Design Matrix:
┌────────────────┬──────────────┬──────────────┐
│ Key Choice     │ Pros         │ Cons         │
├────────────────┼──────────────┼──────────────┤
│ user_id        │ User queries │ Time queries │
│ created_at     │ Time queries │ Hot shard!   │
│ (tenant,time)  │ Both         │ Large tenant │
│ hash(user_id)  │ Even distrib │ No range     │
└────────────────┴──────────────┴──────────────┘

Hotspot Mitigation:
  1. Composite key: (tenant_id, random_suffix)
  2. Pre-splitting: create shards before data arrives
  3. Tenant isolation: large tenants get dedicated shard
  4. Salting: prepend random prefix → spread hot key
```

**Layer 3 — Edge Cases / Trường hợp đặc biệt:**

- Celebrity problem: 1 user_id = millions of followers → even user_id sharding doesn't help → need fan-out or dedicated shard
- Secondary index on sharded data: global secondary index = strong consistency but write overhead; local = fast write but scatter-gather reads
- Analytical queries: always scatter-gather → route to OLAP/data warehouse instead

| Sai lầm                            | Tại sao sai                                             | Đúng là                                                                 |
| ---------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| "Just add more shards for hotspot" | If key is the problem, more shards don't help           | Fix the key design, not the shard count                                 |
| "Global secondary index is free"   | Every write must update all index shards                | Local index: write fast, read scatter; global: write scatter, read fast |
| "Shard key can be changed later"   | Resharding is extremely expensive (full data migration) | Get shard key right from the start                                      |

🎯 **Interview Pattern:** "How to design shard key for multi-tenant SaaS?" → Composite key (tenant_id + entity_id). Isolate large tenants. Pre-split. Avoid time-based keys for write-heavy workloads. Route analytics to OLAP.

🔗 **Knowledge Chain:** Shard key → Query patterns → Hotspot → Tenant isolation → Data warehouse separation

---

## 1. Replication Fundamentals / Nền tảng sao chép

### 🟢 Q: Why do systems replicate data? `[Junior]`

**A:** Sao chép dữ liệu để tăng availability, đọc nhanh hơn ở nhiều vùng địa lý, và tăng khả năng chịu lỗi khi node chết.
Replication cũng hỗ trợ backup/DR và giảm tải read cho primary node.
Trade-off: chi phí hạ tầng và độ phức tạp consistency cao hơn.

### 🟢 Q: What is the difference between replication and backup? `[Junior]`

**A:** Replication phục vụ hệ thống online, dữ liệu được sao chép liên tục gần real-time.
Backup là bản chụp để khôi phục khi sự cố/lỗi logic, thường không dùng trực tiếp cho traffic đọc/ghi.

## 2. Leader-Follower Replication / Sao chép có leader

### 🟡 Q: How does leader-follower replication work? `[Mid]`

**A:** Client ghi vào leader, leader ghi WAL/binlog rồi follower replay log để đồng bộ.
Read có thể đi follower để scale, nhưng cần chú ý replication lag.
Failover cần election/promote follower thành leader mới.

### 🟡 Q: What problems are caused by replication lag? `[Mid]`

**A:** Read-after-write có thể fail nếu đọc follower chưa kịp đồng bộ.
Analytics hoặc API list có thể thấy dữ liệu cũ giữa các request.
Mitigation: read-your-writes routing, session stickiness, hoặc monotonic read policy.

## 3. Multi-Leader Replication / Đa leader

### 🔴 Q: When should we use multi-leader replication? `[Senior]`

**A:** Dùng khi cần ghi ở nhiều region độc lập với latency thấp, hoặc hệ thống thường xuyên disconnected (edge/offline-first).
Multi-leader tăng write availability nhưng conflict resolution phức tạp hơn leader-follower.

### 🔴 Q: How are write conflicts resolved in multi-leader systems? `[Senior]`

**A:** Các chiến lược: Last-Write-Wins (đơn giản nhưng có thể mất dữ liệu), vector clock, merge function theo domain, hoặc CRDT.
Phỏng vấn senior nên nêu rõ: conflict policy phải do business semantics quyết định, không chỉ kỹ thuật.

## 4. Leaderless Replication and Quorum / Sao chép không leader

### 🔴 Q: What is leaderless replication (Dynamo style)? `[Senior]`

**A:** Không có node leader cố định; client/coordinator ghi vào nhiều replica song song.
Đọc/ghi dùng quorum với tham số N (replicas), W (write ack), R (read replicas).
Điều kiện phổ biến để đọc thấy dữ liệu mới: R + W > N (trong điều kiện không split nghiêm trọng).

### 🔴 Q: What are sloppy quorum and hinted handoff? `[Senior]`

**A:** Sloppy quorum cho phép ghi tạm vào node thay thế khi replica mục tiêu down.
Hinted handoff lưu 'ghi hộ' rồi chuyển lại replica gốc khi node phục hồi.
Mục tiêu là tăng availability, đánh đổi consistency tạm thời.

## 5. Sync vs Async Replication / Đồng bộ và bất đồng bộ

### 🟡 Q: Synchronous vs asynchronous replication trade-offs? `[Mid]`

**A:** Synchronous: commit khi replica xác nhận -> consistency mạnh hơn nhưng latency cao hơn và giảm availability khi replica lỗi.
Asynchronous: commit nhanh, availability cao hơn, nhưng có cửa sổ mất dữ liệu khi leader chết trước khi ship log.

## 6. Partitioning and Sharding / Phân vùng dữ liệu

### 🟢 Q: What is data partitioning (sharding)? `[Junior]`

**A:** Partitioning là chia dữ liệu lớn thành nhiều phần nhỏ (shard/partition) để lưu trên nhiều node.
Mục tiêu: scale ngang dung lượng và throughput.

### 🟡 Q: Range-based partitioning works how? `[Mid]`

**A:** Chia theo miền giá trị liên tục, ví dụ user_id 1-1M ở shard A, 1M+-2M ở shard B.
Ưu điểm: query theo range nhanh; nhược điểm: dễ lệch tải nếu key tăng tuần tự (hot shard).

### 🟡 Q: Hash-based partitioning works how? `[Mid]`

**A:** Tính hash(key) rồi mod theo số shard để phân phối đều hơn.
Nhược điểm: query theo range kém và rehash tốn kém khi đổi số shard nếu không dùng consistent hashing.

### 🔴 Q: How does consistent hashing with virtual nodes work? `[Senior]`

**A:** Map node và key lên vòng hash. Key thuộc node đầu tiên theo chiều kim đồng hồ.
Virtual nodes (vnodes) cho mỗi physical node giúp phân phối đều hơn và rebalancing mượt khi node join/leave.
Khi thêm node, chỉ một phần key di chuyển thay vì toàn bộ.

### 🟡 Q: What is directory-based partitioning? `[Mid]`

**A:** Có một directory service/map lưu key-range -> shard location.
Ưu điểm: linh hoạt định tuyến; nhược điểm: cần HA cho directory và tăng complexity vận hành.

## 7. Horizontal vs Vertical Partitioning / Phân vùng ngang và dọc

### 🟢 Q: Horizontal vs vertical partitioning? `[Junior]`

**A:** Horizontal partitioning chia theo hàng (rows) giữa nhiều shard.
Vertical partitioning chia theo cột/nhóm thuộc tính (columns/tables) theo miền nghiệp vụ hoặc access pattern.
Có thể kết hợp cả hai trong hệ thống lớn.

## 8. Rebalancing and Movement / Tái cân bằng dữ liệu

### 🔴 Q: When must partitions move and rebalance? `[Senior]`

**A:** Khi node đầy disk, CPU/hotspot, thêm node mới, hoặc thay đổi pattern truy cập.
Rebalancing cần giới hạn bandwidth, theo dõi lag, và ưu tiên online migration để giảm downtime.

### 🔴 Q: What are safe rebalancing strategies? `[Senior]`

**A:** Dual-write tạm thời + checksum verification + cutover bằng feature flag.
Với DB hỗ trợ native rebalance, vẫn cần runbook rollback và SLO guardrail.

## 9. Cross-Partition Queries / Truy vấn xuyên phân vùng

### 🔴 Q: Why are cross-partition joins expensive? `[Senior]`

**A:** Join cần shuffle dữ liệu qua mạng giữa shard, tăng latency và chi phí I/O.
Global secondary index hoặc data duplication có thể giảm cost nhưng tăng write complexity.

### 🟡 Q: How to reduce cross-shard query cost? `[Mid]`

**A:** Thiết kế shard key theo access pattern chính, pre-aggregate, denormalize có kiểm soát, và dùng query router thông minh.
Nếu cần analytical query phức tạp, chuyển sang data warehouse/OLAP riêng.

## 10. Real-World Database Examples / Ví dụ thực tế

### 🟡 Q: How PostgreSQL implements replication at high level? `[Mid]`

**A:** PostgreSQL dùng WAL shipping/streaming replication từ primary đến standby.
Có thể async hoặc semi-sync/sync tùy cấu hình. Standby thường read-only cho scale đọc.

### 🟡 Q: How MongoDB sharding works conceptually? `[Mid]`

**A:** MongoDB chia dữ liệu theo shard key, có mongos router và config servers quản lý metadata.
Chunk migration hỗ trợ rebalancing; chọn shard key sai dễ gây hotspot.

### 🟡 Q: How Cassandra uses consistent hashing? `[Mid]`

**A:** Cassandra đặt partition key lên token ring, replication theo strategy (Simple/NetworkTopology).
Dữ liệu phân tán bằng consistent hashing + vnode, hỗ trợ scale ngang tốt.

## 11. Interview Drill Q&A / Bộ câu hỏi luyện phỏng vấn

### 🟢 Q: What does R+W>N mean in quorum systems? `[Junior]`

**A:** Đây là điều kiện trực giác để read quorum giao với write quorum, tăng khả năng đọc được phiên bản mới nhất.
Tuy nhiên vẫn cần xử lý clock skew, hinted handoff và repair.

### 🟢 Q: Why not always use synchronous replication? `[Junior]`

**A:** Vì latency cao và giảm availability khi replica chậm/lỗi.
Nhiều hệ thống chọn async + cơ chế bù để cân bằng UX và độ bền dữ liệu.

### 🟡 Q: How do you choose a good shard key? `[Mid]`

**A:** Shard key nên có cardinality cao, phân phối đều, và bám sát query pattern phổ biến.
Tránh key tăng tuần tự hoặc quá lệch theo tenant lớn.

### 🟡 Q: What is monotonic read and why important? `[Mid]`

**A:** Monotonic read đảm bảo user không đọc dữ liệu 'lùi thời gian' giữa hai request liên tiếp.
Hữu ích khi đọc từ follower có lag.

### 🟡 Q: How can we handle tenant hotspot in multi-tenant DB? `[Mid]`

**A:** Tách tenant lớn sang shard riêng (tenant isolation), hoặc thêm tiered partitioning theo tenant+subkey.
Kết hợp rate limiting và adaptive rebalancing.

### 🔴 Q: How to perform zero-downtime shard split? `[Senior]`

**A:** Thực hiện backfill song song, dual-write, verify checksum/row count, sau đó cut traffic dần.
Giữ rollback path đến khi confidence đạt ngưỡng.

### 🔴 Q: How do anti-entropy repairs work in leaderless stores? `[Senior]`

**A:** Node định kỳ so sánh Merkle tree/hash range để phát hiện divergence và đồng bộ lại.
Cơ chế này giảm drift dài hạn do packet loss hoặc partial failures.

### 🔴 Q: How to reason about PACELC with replication choices? `[Senior]`

**A:** PACELC: nếu Partition thì A/C tradeoff; Else thì Latency/Consistency tradeoff.
Ví dụ multi-region sync replication thường tăng consistency nhưng trả giá bằng latency.

### 🔴 Q: What failure mode is often ignored in failover drills? `[Senior]`

**A:** Split-brain và stale DNS/client cache sau failover thường bị đánh giá thấp.
Cần fencing token và health check nhiều tầng.

### 🟡 Q: When should we avoid cross-region writes? `[Mid]`

**A:** Khi business không cần active-active và conflict cost quá cao.
Single-writer per region pair thường đơn giản hơn để vận hành.

## 12. Cross-References / Tài liệu liên quan

- `docs/shared/02-system-design/system-design-theory.md`
- `docs/shared/02-system-design/consensus-algorithms.md`
- `docs/shared/03-database/database-theory.md`
- `docs/be-track/02-backend-knowledge/03-distributed-systems.md`
- `docs/be-track/03-database-advanced/03-nosql-redis-mongo.md`
- `docs/be-track/04-be-system-design/02-classic-problems.md`

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What are the replication strategies and their trade-offs? / Các chiến lược replication? 🟡 Mid

**A:** Three strategies: **Synchronous**: primary waits for all replicas to acknowledge. Strong consistency, higher latency. **Asynchronous**: primary responds after local write, replicates in background. Low latency, possible data loss on failover. **Semi-synchronous**: wait for at least one replica (MySQL default). Balanced.

```
Sync:   Client → Primary → Replica1 → Replica2 → ACK all → respond
        Latency = max(replica RTTs). No data loss on failover.

Async:  Client → Primary → respond immediately
                              ↓ background
                           Replica1, Replica2 (lag possible)
        Latency = just primary. Risk: failover may lose uncommitted writes.

Semi:   Wait for 1 replica → respond. Balance of both.
```

Vietnamese explanation: PostgreSQL streaming replication mặc định = async (set `synchronous_standby_names` for sync). MySQL Group Replication = semi-sync. Replication lag: replica có thể read stale data. Fix "read-your-writes": read từ primary sau write, hoặc session token route về synced replica. Interview: "Khi nào dùng async vs sync replication?" → business consistency requirements.

---

### Q: What is database sharding and how do you choose a shard key? / Database sharding và cách chọn shard key? 🔴 Senior

**A:** Sharding splits data across multiple DB instances (horizontal partitioning). A **shard key** determines which shard a record belongs to.

```
Shard key strategies:
1. Range-based: user_id 1-1M → Shard1, 1M-2M → Shard2
   ✓ Range queries efficient
   ✗ Hotspot risk (new users all hit last shard)

2. Hash-based: hash(user_id) % N → shard
   ✓ Even distribution
   ✗ Range queries need scatter-gather (slow)

3. Geographic: US → Shard-US, EU → Shard-EU
   ✓ Data residency + latency
   ✗ Uneven load if regions imbalanced

Good shard key: high cardinality, even distribution, immutable,
in most query predicates. Avoid: time-based (hotspot), low cardinality (status).
```

Vietnamese explanation: Chọn shard key là quyết định quan trọng nhất. Pitfalls: (1) `created_at` → all new writes to last shard. (2) `status` → imbalanced. (3) Sequential ID → same hotspot. Best: composite key (`tenant_id + user_id`). Consistent hashing: add/remove shards without full rehash. Cross-shard queries = expensive scatter-gather → design schema to avoid. Interview: don't jump to sharding — read replicas + caching first.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                            | Difficulty | Core Concept       | Key Signal                                      |
| --- | ----------------------------------- | ---------- | ------------------ | ----------------------------------------------- |
| 1   | Why replicate data?                 | 🟢         | Replication Models | HA, read scale, fault tolerance                 |
| 2   | Replication vs backup?              | 🟢         | Replication Models | Online vs offline, real-time vs snapshot        |
| 3   | Leader-follower replication?        | 🟡         | Replication Models | WAL/binlog, failover election                   |
| 4   | Replication lag problems?           | 🟡         | Lag & Consistency  | Read-after-write, monotonic, causal             |
| 5   | When multi-leader?                  | 🔴         | Replication Models | Geo-distributed, conflict resolution            |
| 6   | Multi-leader conflict resolution?   | 🔴         | Replication Models | LWW, vector clock, CRDT                         |
| 7   | Leaderless replication?             | 🔴         | Quorum             | R+W>N, sloppy quorum, hinted handoff            |
| 8   | Sloppy quorum + hinted handoff?     | 🔴         | Quorum             | Availability tradeoff, temp node                |
| 9   | Sync vs async tradeoffs?            | 🟡         | Sync/Async         | Durability vs latency, semi-sync                |
| 10  | What is sharding?                   | 🟢         | Partitioning       | Horizontal split, write scale                   |
| 11  | Range-based partitioning?           | 🟡         | Range Partition    | Range queries, hotspot risk                     |
| 12  | Hash-based partitioning?            | 🟡         | Hash Partition     | Even distribution, no range queries             |
| 13  | Consistent hashing + vnodes?        | 🔴         | Consistent Hashing | Ring, 1/N key movement, virtual nodes           |
| 14  | Directory-based partitioning?       | 🟡         | Partitioning       | Flexible routing, HA requirement                |
| 15  | Horizontal vs vertical?             | 🟢         | Partitioning       | Rows vs columns, combine both                   |
| 16  | When must partitions rebalance?     | 🔴         | Rebalancing        | Disk/CPU hotspot, online migration              |
| 17  | Safe rebalancing strategies?        | 🔴         | Rebalancing        | Dual-write, checksum, feature flag              |
| 18  | Cross-partition joins expensive?    | 🔴         | Cross-Partition    | Scatter-gather, network shuffle                 |
| 19  | Reduce cross-shard cost?            | 🟡         | Cross-Partition    | Shard key design, denormalize, OLAP             |
| 20  | PG replication high level?          | 🟡         | Sync/Async         | WAL streaming, async/sync configurable          |
| 21  | MongoDB sharding?                   | 🟡         | Hash Partition     | Shard key, mongos router, chunk migration       |
| 22  | Cassandra consistent hashing?       | 🟡         | Consistent Hashing | Token ring, vnode, NetworkTopology              |
| 23  | R+W>N meaning?                      | 🟢         | Quorum             | Read-write overlap, probabilistic freshness     |
| 24  | Why not always sync?                | 🟢         | Sync/Async         | Latency + availability cost                     |
| 25  | Choose good shard key?              | 🟡         | Cross-Partition    | High cardinality, even, match query pattern     |
| 26  | Monotonic read?                     | 🟡         | Lag & Consistency  | No time-travel, pin to replica                  |
| 27  | Tenant hotspot handling?            | 🟡         | Cross-Partition    | Dedicated shard, tiered key, rate limit         |
| 28  | Zero-downtime shard split?          | 🔴         | Rebalancing        | Backfill, dual-write, verify, cutover           |
| 29  | Anti-entropy repairs?               | 🔴         | Quorum             | Merkle tree, hash range comparison              |
| 30  | PACELC + replication?               | 🔴         | Replication Models | Partition→A/C, Else→L/C                         |
| 31  | Failover mode often ignored?        | 🔴         | Lag & Consistency  | Split-brain, stale DNS, fencing tokens          |
| 32  | When avoid cross-region writes?     | 🟡         | Replication Models | Single-writer simpler, conflict cost            |
| 33  | Replication strategies + tradeoffs? | 🟡         | Sync/Async         | Sync/async/semi-sync comparison                 |
| 34  | Database sharding + shard key?      | 🔴         | Cross-Partition    | Range/hash/geo, composite key, avoid time-based |

**Distribution:** 🟢 6 | 🟡 14 | 🔴 14

---

## ⚡ Cold Call Simulation / Mô Phỏng Phỏng Vấn Bất Ngờ

**"Your team's MySQL read replica is 45 seconds behind primary during a flash sale. Users report 'order not found' after placing orders. How do you fix this?"**

> **30-second answer:** "Classic replication lag problem. Immediate fix: route order-status reads to the primary — users must see their own writes. For non-critical reads (product listings, analytics), keep using replicas. Longer term: add more replicas to spread read load, or use semi-synchronous replication for the order table to guarantee at least one replica is caught up."

**Follow-up:** "How would you prevent this from happening again?"

> "Monitor replication lag as an SLI — alert at 5 seconds. Implement read-after-write consistency at the application layer: after a write, include a replication position token in the response; subsequent reads check if the replica has caught up to that position before serving. If not caught up, route to primary."

---

## Self-Check / Tự Kiểm Tra

_Close this document and answer from memory:_

| #   | Type           | Question                                                    | Key Points                                                                    |
| --- | -------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Name 3 replication models and when to use each              | Single-leader (default), multi-leader (geo), leaderless (max availability)    |
| 2   | 🎨 Visual      | Draw consistent hashing ring with 3 nodes, add a 4th        | Ring, clockwise assignment, only 1/N keys move                                |
| 3   | 🛠️ Application | Design shard key for multi-tenant e-commerce (orders table) | (tenant_id, order_id) — composite key avoids hotspot                          |
| 4   | 🐛 Debug       | Read replica shows stale data — diagnose and fix            | Check replication lag metric, route critical reads to primary, check disk I/O |
| 5   | 🗣️ Teach       | Explain to a junior why R+W>N guarantees consistency        | At least 1 node in read set has latest write (overlap)                        |

💬 **Feynman Prompt:** Giải thích tại sao "always route reads to primary" solves replication lag but is not a scalable solution — và khi nào bạn _phải_ chấp nhận eventual consistency từ replica.

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When          | Focus                                                 |
| ----- | ------------- | ----------------------------------------------------- |
| 1     | Day 1 (today) | Read all Core Concepts, do Self-Check                 |
| 2     | Day 3         | Replication models comparison, quorum math            |
| 3     | Day 7         | Consistent hashing draw, shard key design exercise    |
| 4     | Day 14        | Cold Call simulation, rebalancing 4-phase walkthrough |
| 5     | Day 30        | Full review, design sharding for 100M row table       |

---

## Connections / Liên Kết

**Same track / Cùng track:**

- ➡️ [System Design Theory](./system-design-theory.md) — scaling strategies require replication understanding
- ➡️ [Consensus Algorithms](./consensus-algorithms.md) — leader election needs consensus (Raft/Paxos)
- ➡️ [Caching Patterns](./caching-patterns.md) — cache invalidation patterns complement replication
- ➡️ [Message Queues](./05-message-queues.md) — event-driven replication patterns
- ➡️ [Load Balancing](./06-load-balancing.md) — routing reads to replicas

**Cross track / Liên track:**

- 🔗 [Sharding & Transactions](../../shared/03-database/04-sharding-and-transactions.md) — detailed sharding implementation
- 🔗 [NoSQL & Redis](../../be-track/03-database-advanced/03-nosql-redis-mongo.md) — Cassandra/DynamoDB replication
- 🔗 [Observability & Scale](../../be-track/04-be-system-design/05-observability-and-scale.md) — monitoring replication lag SLIs
