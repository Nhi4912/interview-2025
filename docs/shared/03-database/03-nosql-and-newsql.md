# NoSQL and NewSQL — NoSQL và NewSQL

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `be-track/03-database-advanced/03-nosql-redis-mongo.md`, `shared/03-database/database-theory.md`, `shared/02-system-design/system-design-theory.md`

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee catalog at 500M products:** PostgreSQL không thể handle horizontal write scale cho catalog. Shopee dùng Elasticsearch cho full-text search (inverted index), Cassandra cho product events/activity log (write-heavy, append-only), và Redis cho hot product cache. PostgreSQL vẫn dùng cho orders và payments (ACID critical). Không có "one database fits all" — mỗi workload chọn DB phù hợp.

**Bài học:** NoSQL là một họ rất đa dạng — key-value, document, wide-column, graph có internal structure khác nhau và được tối ưu cho access patterns khác nhau. Không thể so sánh Redis với Cassandra như là "NoSQL vs NoSQL".

## What & Why / Cái Gì & Tại Sao

**Analogy:** NoSQL databases giống các loại phương tiện giao thông: Redis như xe máy (nhanh, nhẹ, ngắn hạn), Cassandra như tàu hàng (chậm hơn nhưng chở lượng lớn, đường dài), MongoDB như SUV (linh hoạt nhiều địa hình), Neo4j như hệ thống đường sắt (tối ưu cho mạng lưới kết nối). Mỗi loại có use case riêng.

**Why it matters:** System design interviews ở Senior level luôn yêu cầu justify DB choice. Biết trade-offs giữa các NoSQL types và khi nào dùng NewSQL (CockroachDB, Spanner) là kiến thức phân biệt.

---

## Concept Map / Bản Đồ Khái Niệm

```
                        ┌─────────────────────┐
                        │   NoSQL Ecosystem    │
                        └─────────┬───────────┘
                                  │
          ┌───────────┬───────────┼───────────┬───────────┐
          ▼           ▼           ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Document │ │Key-Value │ │ Column-  │ │  Graph   │ │Time-Series│
    │  Store   │ │  Store   │ │ Family   │ │ Database │ │    DB    │
    │(MongoDB) │ │ (Redis)  │ │(Cassandra│ │ (Neo4j)  │ │(InfluxDB)│
    └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │            │            │
         └────────────┴─────┬──────┴────────────┴────────────┘
                            ▼
                   ┌─────────────────┐
                   │  CAP / PACELC   │──── Trade-off Framework
                   │  ACID vs BASE   │
                   └────────┬────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
     ┌─────────────────┐        ┌─────────────────┐
     │ Polyglot Persist │        │    NewSQL        │
     │ (multi-DB combo) │        │ (Spanner, TiDB)  │
     └─────────────────┘        └─────────────────┘
```

## Overview / Tổng Quan

| #   | Concept                       | Vai trò                                                             | Interview Weight         |
| --- | ----------------------------- | ------------------------------------------------------------------- | ------------------------ |
| 1   | **NoSQL Categories**          | 5 loại DB phi quan hệ, mỗi loại tối ưu cho access pattern khác nhau | ⭐⭐⭐ — Must know       |
| 2   | **Document Stores**           | JSON-flexible, aggregate-oriented (MongoDB, CouchDB)                | ⭐⭐⭐                   |
| 3   | **Key-Value & Column-Family** | Ultra-low latency (Redis) + write-heavy scale (Cassandra)           | ⭐⭐⭐                   |
| 4   | **CAP/PACELC & BASE**         | Trade-off framework cho distributed DB decisions                    | ⭐⭐⭐ — Senior favorite |
| 5   | **NewSQL**                    | SQL + ACID + horizontal scale (CockroachDB, Spanner, TiDB)          | ⭐⭐                     |
| 6   | **Polyglot Persistence**      | Multi-DB strategy: right DB for right workload                      | ⭐⭐                     |
| 7   | **Data Modeling & Migration** | Embedding vs referencing, denormalization, migration patterns       | ⭐⭐                     |

**Relationships:** Chọn DB bắt đầu từ access pattern → CAP trade-off → rồi đến operational complexity. Polyglot persistence kết hợp nhiều loại. NewSQL bridge gap giữa SQL consistency và NoSQL scale.

---

## Core Concepts — Phase 2 Deep Treatment

### Concept 1: NoSQL Categories

> 🧠 **Memory Hook:** "5 loại xe" — Document=SUV (đa dụng), KV=xe máy (nhanh nhẹ), Column=tàu hàng (bulk), Graph=đường sắt (mạng lưới), TimeSeries=xe bus (theo lộ trình thời gian).

**Tại sao tồn tại?**

→ **Why?** Relational DB không tối ưu cho mọi access pattern — mỗi workload có shape khác nhau (key lookup, graph traversal, full-text, time-window)
→ **Why?** Mỗi data model tối ưu cho một loại query cụ thể — O(1) hash lookup, index-free adjacency, inverted index search — không thể có one-size-fits-all

🔵 **Layer 1 — Analogy:** Cũng như không dùng búa cho mọi việc (cần tua-vít cho ốc, kìm cho dây điện), không dùng một DB cho mọi workload. Một học sinh lớp 7 biết chọn đúng dụng cụ đúng việc — đó là điểm khởi đầu của NoSQL thinking.

🔵 **Layer 2 — How It Works:**

```
Access Pattern → Best DB Type:
┌─────────────────────┬──────────────────┬─────────────────┐
│ Pattern             │ DB Type          │ Internal Engine  │
├─────────────────────┼──────────────────┼─────────────────┤
│ Flexible JSON CRUD  │ Document (Mongo) │ B-Tree + BSON    │
│ Key → Value lookup  │ KV (Redis)       │ Hash table + SDS │
│ Write-heavy append  │ Column (Cassandra│ LSM-Tree + SST   │
│ Relationship travel │ Graph (Neo4j)    │ Index-free adj   │
│ Time-window query   │ TSDB (InfluxDB)  │ TSM + retention  │
└─────────────────────┴──────────────────┴─────────────────┘
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Search engines (Elasticsearch) dùng inverted index — không phải primary storage, nên dùng làm read replica của source of truth
- Multi-model DB (ArangoDB, CosmosDB) hỗ trợ nhiều API nhưng thường có trade-off performance ở mỗi model so với DB chuyên biệt
- NewSQL (CockroachDB, TiDB) là category riêng — không phải NoSQL dù scale ngang giống NoSQL
- Sai lầm phổ biến: chọn DB theo trend ("MongoDB hot") thay vì access pattern cụ thể của workload
- DynamoDB là KV + Document hybrid — không thuộc hoàn toàn một category, là managed AWS service với pricing model riêng

| Sai lầm                       | Tại sao sai                              | Đúng là                                      |
| ----------------------------- | ---------------------------------------- | -------------------------------------------- |
| "NoSQL = no schema"           | Document DB vẫn cần schema governance    | NoSQL = flexible schema, not no schema       |
| "MongoDB thay thế PostgreSQL" | Mỗi DB tối ưu cho use case khác          | Polyglot: dùng cả hai cho đúng workload      |
| "Redis là database chính"     | Redis mạnh cache/session, yếu durability | Redis = cache layer, RDBMS = source of truth |

🎯 **Interview Pattern:** "What NoSQL type for X?" → Nêu access pattern → chọn DB type → explain internal engine advantage → mention trade-off.

📚 **Cần biết trước:** [Database Theory — ACID/BASE](./database-theory.md) | [Storage Engines — B-Tree vs LSM-Tree](./database-theory.md)
➡️ **Để hiểu tiếp:** [Polyglot Persistence](#concept-6-polyglot-persistence) | [System Design DB Selection](../02-system-design/system-design-theory.md)

### Concept 2: Document Stores

> 🧠 **Memory Hook:** "JSON tủ hồ sơ" — mỗi document là một folder chứa mọi thông tin liên quan, không cần tra cứu nhiều ngăn.

**Tại sao tồn tại?**

→ **Why?** Schema thay đổi nhanh trong agile development — relational schema migration chậm và rủi ro cao khi production
→ **Why?** Aggregate pattern — đọc toàn bộ entity trong 1 query thay vì JOIN 5 bảng, giảm latency và round-trips tới DB

🔵 **Layer 1 — Analogy:** Document DB giống tủ hồ sơ: mỗi folder (document) chứa tất cả giấy tờ của một người — không cần chạy qua nhiều phòng ban để ghép thông tin. Học sinh lớp 7 giỏi giữ mọi thứ liên quan đến 1 môn trong 1 quyển vở — đó là triết lý embedding.

🔵 **Layer 2 — How It Works:**

```
MongoDB Document:
{
  _id: ObjectId("..."),     ← 12-byte unique ID
  name: "iPhone 15",
  specs: { ram: 8, storage: 256 },  ← Embedded (denormalized)
  reviews: [ { user: "A", rating: 5 } ],  ← Array embedded
  category_id: ObjectId("...")  ← Referenced (normalized)
}

Index: B-Tree on _id + compound indexes
Sharding: by _id or custom shard key
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Multi-document transactions (MongoDB 4.0+) có overhead — thiết kế schema để tránh cross-document transactions khi có thể
- Embedding quá sâu → 16MB document limit và update amplification (cập nhật 1 field = rewrite toàn bộ document)
- Schema validation rules bắt buộc cho production — "schema-less" không có nghĩa là "no governance"
- Unbounded arrays trong document → memory bloat khi document grow over time (e.g., embedding toàn bộ comments)
- Index selectivity quan trọng: thứ tự fields trong compound index ảnh hưởng query performance đáng kể

| Sai lầm              | Tại sao sai                   | Đúng là                                 |
| -------------------- | ----------------------------- | --------------------------------------- |
| Embed everything     | 16MB limit, update complexity | Embed 1:few, reference 1:many           |
| No indexes           | Full collection scan          | Compound index theo query pattern       |
| Ignore write concern | Data loss nếu node crash      | writeConcern: "majority" cho durability |

🎯 **Interview Pattern:** "Design schema for X in MongoDB" → Identify aggregates → embed vs reference decision → index strategy → shard key.

📚 **Cần biết trước:** [NoSQL Categories](#concept-1-nosql-categories) | [Indexing & Optimization](./02-indexing-and-optimization.md)
➡️ **Để hiểu tiếp:** [Data Modeling & Embedding vs Referencing](#concept-7-data-modeling--migration) | [Sharding](./04-sharding-and-transactions.md)

### Concept 3: Key-Value & Column-Family

> 🧠 **Memory Hook:** "Redis = tủ khóa tốc độ ánh sáng, Cassandra = kho hàng xuyên lục địa" — Redis cho nano-second lookup, Cassandra cho petabyte writes.

**Tại sao tồn tại?**

→ **Why?** RDBMS quá chậm cho cache/session (KV) hoặc quá giới hạn write throughput cho time-series/activity log (Column-Family)
→ **Why?** KV = O(1) hash lookup trực tiếp trong memory. Column = LSM-Tree tối ưu sequential writes, compaction chạy background

🔵 **Layer 1 — Analogy:** Redis giống ATM (nhanh, đơn giản, lấy tiền đúng theo số tài khoản). Cassandra giống dây chuyền sản xuất nhà máy (ghi liên tục, throughput cao, phân tán nhiều xưởng). Mỗi loại phục vụ một nhu cầu hoàn toàn khác nhau — không thể dùng ATM để sản xuất hàng loạt.

🔵 **Layer 2 — How It Works:**

```
Redis: Hash Table in-memory
  GET key → O(1) → return value
  Data types: String, List, Set, Hash, Sorted Set, Stream
  Persistence: RDB snapshot + AOF append-only file
  Cluster: 16384 hash slots, automatic failover

Cassandra: LSM-Tree + SSTables
  Write path: Memtable (memory) → flush → SSTable (disk)
  Read path: Bloom filter → SSTable lookup → merge
  Partition: Consistent hashing, rack/DC-aware
  Consistency: tunable per query (ONE/QUORUM/ALL)
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Redis single-threaded cho command execution nhưng io-threads cho networking — bottleneck thực sự ở network, không phải CPU command execution
- Cassandra tombstone accumulation cần repair định kỳ — deleted data không xóa ngay, gây read amplification theo thời gian
- DynamoDB = managed KV + document hybrid — không self-managed như Cassandra, trade-off là AWS vendor lock-in
- Redis AOF fsync "everysec" → tối đa 1 giây data loss khi crash — không phải true durability, không dùng làm source of truth
- Cassandra "query-first" modeling: không thiết kế schema trước rồi query sau — phải thiết kế query trước rồi model table theo query

| Sai lầm                       | Tại sao sai                                  | Đúng là                                    |
| ----------------------------- | -------------------------------------------- | ------------------------------------------ |
| "Redis persistence = durable" | AOF fsync every second → 1s data loss window | Redis = cache-first, not primary store     |
| Cassandra SELECT \*           | Full cluster scan, no ad-hoc queries         | Design query first → model table around it |
| Ignore tombstones             | Read amplification, slow queries             | Run regular repair, set gc_grace_seconds   |

🎯 **Interview Pattern:** "Redis vs Memcached?" → data structures, persistence, cluster, Lua scripting. "Cassandra data model?" → query-driven, partition key = access path.

📚 **Cần biết trước:** [Storage Engines — Hash Table vs LSM-Tree](./database-theory.md) | [In-Memory vs Disk-Based Storage](./database-theory.md)
➡️ **Để hiểu tiếp:** [BE NoSQL Implementation — Redis & Mongo](../../be-track/03-database-advanced/03-nosql-redis-mongo.md) | [Sharding & Partitioning](./04-sharding-and-transactions.md)

### Concept 4: CAP/PACELC & BASE

> 🧠 **Memory Hook:** "Partition = bão, chọn C (đúng) hay A (chạy)" — khi mạng partition, hệ thống phải chọn consistency (từ chối phục vụ sai) hoặc availability (phục vụ có thể sai).

**Tại sao tồn tại?**

→ **Why?** Network partition xảy ra trong mọi hệ phân tán — phải có framework để quyết định trade-off khi không thể có cả hai cùng lúc
→ **Why?** CAP cho binary choice khi partition. PACELC mở rộng thực tế hơn: khi không có partition, vẫn phải chọn Latency vs Consistency mỗi ngày

🔵 **Layer 1 — Analogy:** Bưu điện trong bão (partition): không biết gói hàng cũ đã đến chưa. Chọn A = vẫn nhận gói mới (có thể trùng lặp hoặc mất). Chọn C = đóng cửa cho đến khi có xác nhận chắc chắn. Không có lựa chọn nào "đúng tuyệt đối" — tuỳ nghiệp vụ quan trọng cái gì hơn: chính xác hay sẵn sàng phục vụ.

🔵 **Layer 2 — How It Works:**

```
CAP: During partition, choose C or A
  CP: HBase, ZooKeeper, etcd → refuse stale reads
  AP: Cassandra, DynamoDB → serve stale data

PACELC: Even without partition:
  PA/EL: Cassandra → partition=Available, else=Latency (fast reads)
  PC/EC: HBase → partition=Consistent, else=Consistent (always correct)
  PA/EC: rare — available during partition but consistent otherwise
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- CAP chỉ áp dụng cho distributed systems — single-node DB = CA nhưng là single point of failure, không thực sự scale
- "Consistency" trong CAP ≠ ACID consistency: CAP C = linearizability (latest write visible), ACID C = business invariants maintained
- Partition tolerance bắt buộc trong thực tế — network luôn có khả năng fail, nên real choice là CP hoặc AP, không phải CA
- PACELC quan trọng hơn CAP trong thực tế: latency vs consistency trade-off xảy ra mỗi ngày, partition rất hiếm
- "Eventual consistency" không có nghĩa là "eventually correct" — conflict resolution cũng cần thiết (LWW, CRDTs, application merge)

| Sai lầm               | Tại sao sai                                  | Đúng là                                     |
| --------------------- | -------------------------------------------- | ------------------------------------------- |
| "Chọn 2 trong 3 CAP"  | P bắt buộc → thực tế chọn CP hoặc AP         | Network partition always possible           |
| "AP = no consistency" | Eventual consistency = hội tụ                | AP = may serve stale, not permanently wrong |
| CAP C = ACID C        | CAP C = linearizability, ACID C = invariants | Two different definitions of "consistency"  |

🎯 **Interview Pattern:** "Is your system CP or AP?" → Identify partition behavior → explain normal-mode trade-off (PACELC) → give example (payment=CP, social feed=AP).

📚 **Cần biết trước:** [Distributed Systems Fundamentals](../../be-track/02-backend-knowledge/03-distributed-systems.md) | [Replication & Consistency Models](./database-theory.md)
➡️ **Để hiểu tiếp:** [Consensus Algorithms — Raft/Paxos](../02-system-design/consensus-algorithms.md) | [NewSQL](#concept-5-newsql)

### Concept 5: NewSQL

> 🧠 **Memory Hook:** "SQL + superpowers" — NewSQL = muốn giữ SQL syntax + ACID transactions nhưng scale ngang như NoSQL.

**Tại sao tồn tại?**

→ **Why?** Businesses muốn scale ngang mà không từ bỏ SQL syntax và ACID guarantees — hai điều mà NoSQL buộc phải đánh đổi
→ **Why?** Raft/Paxos consensus cho phép distributed transactions ACID mà không cần 2PC blocking — giải quyết bài toán mà trước đây chỉ có NoSQL mới làm được ở scale

🔵 **Layer 1 — Analogy:** NewSQL giống xe hybrid — có cả xăng (SQL familiarity, ACID guarantees quen thuộc) và điện (horizontal scale, distributed storage). Không phải tốt nhất ở từng loại riêng, nhưng tiện lợi cho nhiều người không muốn phải chọn một trong hai.

🔵 **Layer 2 — How It Works:**

```
CockroachDB/TiDB/Spanner architecture:
  SQL Layer → Distributed KV (Raft consensus per range)

  Range: data split into ranges (~64-512MB each)
  Each range: 3 replicas via Raft consensus
  Transaction: distributed via timestamp ordering + 2PC within ranges

  Spanner: TrueTime (GPS + atomic clocks) for global ordering
  CockroachDB: Hybrid Logical Clock (HLC) approximation
  TiDB: Compatible with MySQL protocol
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Cross-region transactions = high latency (Spanner ~7ms same-region, ~200ms cross-region) — không phù hợp latency-sensitive workloads
- Operational complexity vẫn cao — không phải "plug and play" như managed PostgreSQL (RDS), đòi hỏi Raft và distributed systems expertise
- Cost-per-node cao hơn PostgreSQL đáng kể — chỉ justify khi thực sự cần distributed ACID ở global scale
- Not always faster than well-tuned PostgreSQL + read replicas cho workload không cần cross-shard transactions
- Migration từ PostgreSQL sang NewSQL không trivial — query optimizer khác, edge cases khác, cần thorough testing và shadow traffic

| Sai lầm                  | Tại sao sai                                     | Đúng là                                    |
| ------------------------ | ----------------------------------------------- | ------------------------------------------ |
| "NewSQL thay thế mọi DB" | Niche cho strong-consistency distributed        | Evaluate: có thực sự cần distributed ACID? |
| "Free horizontal scale"  | Cross-region latency, ops overhead              | Scale có cost: latency, complexity, $      |
| "Same as PostgreSQL"     | Different query optimizer, different edge cases | Migration cần thorough testing             |

🎯 **Interview Pattern:** "When NewSQL over PostgreSQL?" → Need global distribution + ACID + SQL → CockroachDB/Spanner. Otherwise → PostgreSQL + read replicas + Citus for sharding.

📚 **Cần biết trước:** [RDBMS Fundamentals](../../be-track/03-database-advanced/01-sql-fundamentals.md) | [Consensus — Raft/Paxos](../02-system-design/consensus-algorithms.md)
➡️ **Để hiểu tiếp:** [Multi-Region Architecture](../02-system-design/system-design-theory.md) | [Polyglot Persistence](#concept-6-polyglot-persistence)

### Concept 6: Polyglot Persistence

> 🧠 **Memory Hook:** "Nhà bếp chuyên nghiệp" — không dùng 1 dao cho mọi món: dao sushi (Redis), dao phay (PostgreSQL), dao bánh mì (Elasticsearch).

**Tại sao tồn tại?**

→ **Why?** Không DB nào tốt nhất cho mọi workload — mỗi DB tối ưu cho một access pattern và consistency model cụ thể
→ **Why?** Microservices architecture tự nhiên dẫn đến mỗi service chọn DB phù hợp nhất cho domain — service boundary = data boundary

🔵 **Layer 1 — Analogy:** Siêu thị có tủ lạnh (Redis cache — giữ đồ tươi sẵn sàng lấy ngay), kệ hàng (PostgreSQL — hàng hoá chính xác, đủ loại), catalog tìm kiếm (Elasticsearch — tìm nhanh theo từ khoá). Mỗi loại lưu trữ phục vụ mục đích riêng, không loại nào thay thế loại kia được.

🔵 **Layer 2 — How It Works:**

```
Typical Polyglot Stack:
┌──────────────┬───────────────────┬────────────────────┐
│ PostgreSQL   │ Orders, Users     │ ACID transactions  │
│ Redis        │ Session, Cache    │ Low-latency lookup │
│ Elasticsearch│ Product Search    │ Full-text + facets │
│ Cassandra    │ Activity Logs     │ Write-heavy append │
│ S3           │ Images, Files     │ Blob storage       │
└──────────────┴───────────────────┴────────────────────┘

Data sync: CDC (Change Data Capture) / Event Bus
Ownership: Each service owns its DB — no shared DB
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Data duplication across DBs cần ownership contracts rõ ràng — ai là source of truth khi dữ liệu conflict giữa Postgres và Elasticsearch?
- Monitoring N databases = N× operational complexity — cần unified observability platform, không chỉ riêng lẻ từng DB
- Team cần expertise across all DB types — cost cao cho small teams, cân nhắc kỹ trước khi thêm DB mới vào stack
- Eventual consistency giữa DBs (PostgreSQL → Elasticsearch sync qua CDC) — sync lag cần design UI/logic chịu được trạng thái tạm
- "Right tool for right job" có thể thành "too many tools" — bắt đầu đơn giản, thêm DB mới chỉ khi có workload evidence rõ ràng

| Sai lầm                         | Tại sao sai                               | Đúng là                              |
| ------------------------------- | ----------------------------------------- | ------------------------------------ |
| "Mỗi service một DB riêng biệt" | Overengineering nếu traffic nhỏ           | Start monolith DB, split when needed |
| Shared DB between services      | Tight coupling, schema change = cascade   | Service owns its data, API boundary  |
| No data ownership map           | Conflict khi 2 services write same entity | Clear ownership + CDC for sync       |

🎯 **Interview Pattern:** "Design data layer for e-commerce" → PostgreSQL for orders, Redis for cart/session, ES for search, S3 for images → explain sync via CDC/events.

📚 **Cần biết trước:** [NoSQL Categories](#concept-1-nosql-categories) | [Microservices Architecture](../02-system-design/system-design-theory.md)
➡️ **Để hiểu tiếp:** [CDC & Event Bus](../../be-track/02-backend-knowledge/03-distributed-systems.md) | [Data Modeling & Migration](#concept-7-data-modeling--migration)

### Concept 7: Data Modeling & Migration

> 🧠 **Memory Hook:** "Dọn nhà" — migration là dọn từ nhà cũ (SQL) sang nhà mới (NoSQL) — phải đóng gói (ETL), kiểm tra (validation), chuyển từng phòng (strangler pattern).

**Tại sao tồn tại?**

→ **Why?** Business requirements thay đổi → DB cũ không phù hợp về scale hoặc access pattern → cần migrate an toàn mà không mất dữ liệu
→ **Why?** NoSQL data modeling (embedding, denormalization) khác fundamentally với SQL normalization — không thể dump SQL schema thẳng vào MongoDB mà không redesign

🔵 **Layer 1 — Analogy:** SQL normalization = sắp xếp sách theo tác giả (mỗi tác giả 1 chỗ, join để tìm). NoSQL denormalization = sắp xếp theo chủ đề đọc (cùng sách có thể ở nhiều kệ — tốn chỗ hơn nhưng lấy nhanh hơn theo cách đọc của bạn). Không có cách nào đúng tuyệt đối — tuỳ cách bạn hay tra cứu.

🔵 **Layer 2 — How It Works:**

```
NoSQL Modeling Decision:
  Q: "Does child always read with parent?"
  ├── Yes + child small → EMBED (1 read, denormalized)
  └── No or child large  → REFERENCE (normalized, 2 reads)

Migration Pattern (SQL → NoSQL):
  Phase 1: Dual-write (write both) or CDC pipeline
  Phase 2: Shadow read (read from both, compare)
  Phase 3: Cutover (primary read from new DB)
  Phase 4: Decommission old DB
```

🔵 **Layer 3 — Edge Cases & Trade-offs:**

- Migration rollback plan critical — nếu không thể rollback nhanh và an toàn, migration chưa đủ điều kiện cutover
- Idempotent writes cho retry safety — network timeout không biết request thành công hay thất bại, retry phải safe không tạo duplicate
- Schema versioning cho document evolution — v1 và v2 documents có thể tồn tại cùng lúc, cần lazy migration hoặc eager migration script
- Big-bang migration là anti-pattern — luôn dùng strangler pattern, migrate từng bounded context một để giảm risk
- Data validation trước cutover: so sánh read results từ old và new DB để detect silent corruption — latency tốt mà correctness kém = migration thất bại

| Sai lầm                     | Tại sao sai                  | Đúng là                                |
| --------------------------- | ---------------------------- | -------------------------------------- |
| Big-bang migration          | Risk quá cao, rollback khó   | Strangler pattern, migrate per module  |
| No data validation          | Silent data corruption       | Compare read results before cutover    |
| Embed everything in MongoDB | 16MB limit, update conflicts | Embed 1:few, reference 1:many or large |

🎯 **Interview Pattern:** "How to migrate from PostgreSQL to DynamoDB?" → Identify bounded context → CDC pipeline → dual-write → shadow read → cutover → decommission.

📚 **Cần biết trước:** [Schema Design & Normalization](../../be-track/03-database-advanced/01-sql-fundamentals.md) | [Document Stores](#concept-2-document-stores)
➡️ **Để hiểu tiếp:** [Strangler Fig & Blue-Green Deployment](../02-system-design/system-design-theory.md) | [Sharding & Transactions](./04-sharding-and-transactions.md)

---

## 1. NoSQL Overview / Tổng quan NoSQL

### 🟢 Q: What does NoSQL mean in modern systems? `[Junior]`

**A:** NoSQL thường nghĩa là 'Not only SQL': nhóm cơ sở dữ liệu phi quan hệ tối ưu cho scale ngang, schema linh hoạt, hoặc workload chuyên biệt.
NoSQL không thay thế hoàn toàn SQL; nhiều hệ thống dùng kết hợp.

### 🟢 Q: When should we prefer NoSQL over relational DB? `[Junior]`

**A:** Khi cần scale write/read cực lớn, schema thay đổi nhanh, hoặc access pattern không phù hợp join quan hệ.
Tuy nhiên vẫn phải đánh đổi transaction consistency và truy vấn ad-hoc.

## 2. Document Stores / Cơ sở dữ liệu tài liệu

### 🟡 Q: When/why use document databases like MongoDB or CouchDB? `[Mid]`

**A:** Phù hợp dữ liệu dạng document JSON linh hoạt theo domain (profile, catalog, CMS).
Embedding giúp đọc theo aggregate nhanh, giảm join.
Nhược điểm: cập nhật field sâu và transaction xuyên document có thể phức tạp hơn SQL.

## 3. Key-Value Stores / Kho key-value

### 🟡 Q: When/why use Redis or DynamoDB style key-value? `[Mid]`

**A:** Dùng khi truy cập chủ yếu theo key trực tiếp: session, cart, token, rate limiting, cache metadata.
Ưu điểm: latency rất thấp, scale tốt.
Hạn chế: query theo nhiều chiều/phân tích phức tạp không phải điểm mạnh.

## 4. Column-Family Stores / Cột-họ

### 🟡 Q: When/why use Cassandra or HBase? `[Mid]`

**A:** Rất mạnh cho write-heavy và dữ liệu phân tán lớn theo partition key/time-series.
Thiết kế schema dựa trên query trước (query-driven modeling).
Không phù hợp nếu cần join linh hoạt như SQL truyền thống.

## 5. Graph Databases / Cơ sở dữ liệu đồ thị

### 🟡 Q: When/why use Neo4j or Amazon Neptune? `[Mid]`

**A:** Khi bài toán tập trung vào quan hệ nhiều bước: social graph, fraud ring, recommendation path.
Traversal nhiều hop trong graph DB thường tự nhiên và nhanh hơn join đệ quy phức tạp ở RDBMS.

## 6. Time-Series Databases / Cơ sở dữ liệu chuỗi thời gian

### 🟡 Q: When/why use InfluxDB or TimescaleDB? `[Mid]`

**A:** Phù hợp metrics, observability, IoT telemetry với timestamp dày đặc.
TSDB tối ưu ingest theo thời gian, retention policy, downsampling, và query theo window.

## 7. CAP, ACID, BASE / Định lý và mô hình nhất quán

### 🔴 Q: How does CAP theorem apply to real databases? `[Senior]`

**A:** CAP nói rằng khi có network partition, hệ phân tán phải chọn ưu tiên Consistency hoặc Availability.
Ví dụ Cassandra thiên AP (eventual consistency), còn hệ strongly consistent thường thiên CP trong partition.
Trong điều kiện bình thường, PACELC giúp phân tích thêm trade-off latency vs consistency.

### 🟡 Q: ACID vs BASE differences? `[Mid]`

**A:** ACID ưu tiên transaction mạnh, nhất quán chặt cho nghiệp vụ critical.
BASE chấp nhận eventual consistency để lấy availability/scale, với dữ liệu hội tụ theo thời gian.

## 8. SQL vs NoSQL Comparison / Ma trận so sánh SQL và NoSQL

### 🟢 Q: What are key differences between SQL and NoSQL at interview level? `[Junior]`

**A:** SQL: schema chặt, join mạnh, transaction ACID tốt, phù hợp nghiệp vụ quan hệ phức tạp.
NoSQL: schema linh hoạt, scale ngang dễ hơn ở một số workload, tối ưu theo model chuyên biệt.
Không có lựa chọn 'tốt nhất tuyệt đối'; cần chọn theo yêu cầu cụ thể.

## 9. NewSQL / Cầu nối SQL + phân tán

### 🔴 Q: What is NewSQL and why did it emerge? `[Senior]`

**A:** NewSQL (CockroachDB, TiDB, Spanner) cố gắng giữ SQL + ACID nhưng scale phân tán ngang.
Mục tiêu: tránh phải chọn cực đoan giữa RDBMS truyền thống và NoSQL.

### 🔴 Q: How do NewSQL systems handle distributed transactions? `[Senior]`

**A:** Thường dùng consensus replication (Raft/Paxos), timestamp ordering, và transaction coordinator.
Đổi lại là độ phức tạp vận hành và chi phí mạng giữa region.

## 10. Polyglot Persistence / Đa dạng hóa tầng dữ liệu

### 🟡 Q: What is polyglot persistence? `[Mid]`

**A:** Là chiến lược dùng nhiều loại DB trong cùng hệ thống, mỗi loại giải bài toán phù hợp nhất.
Ví dụ: PostgreSQL cho transaction, Redis cho cache/session, Elasticsearch cho search, Cassandra cho event lớn.

## 11. NoSQL Data Modeling / Mô hình hóa dữ liệu NoSQL

### 🟡 Q: Embedding vs referencing in document modeling? `[Mid]`

**A:** Embedding tốt khi dữ liệu con luôn đi cùng cha và kích thước vừa phải.
Referencing tốt khi dữ liệu con lớn, tái sử dụng nhiều nơi, hoặc cập nhật độc lập.
Cần cân bằng read efficiency với update complexity.

### 🔴 Q: Why denormalization is common in NoSQL? `[Senior]`

**A:** Vì nhiều NoSQL tối ưu đọc theo partition key và tránh cross-node join.
Denormalization giúp query nhanh nhưng yêu cầu pipeline cập nhật nhiều bản sao dữ liệu.

## 12. Migration Strategies / Chiến lược di chuyển SQL <-> NoSQL

### 🔴 Q: How to migrate from SQL to NoSQL safely? `[Senior]`

**A:** Bắt đầu từ bounded context rõ ràng, dual-write hoặc CDC pipeline, backfill kiểm chứng, rồi cutover từng phần.
Đảm bảo idempotent, data validation, và rollback plan trước khi mở traffic hoàn toàn.

### 🔴 Q: How to migrate from NoSQL back to SQL or NewSQL? `[Senior]`

**A:** Chuẩn hóa schema theo query quan trọng, xây ETL/replay log, và dọn các inconsistency tồn tại trước.
Không nên big-bang migration; ưu tiên strangler pattern theo module.

## 13. Interview Drill Q&A / Bộ câu hỏi luyện phỏng vấn

### 🟢 Q: Is MongoDB always schema-less? `[Junior]`

**A:** MongoDB linh hoạt schema nhưng không có nghĩa là bỏ qua schema governance.
Bạn vẫn nên dùng validation rules và versioned document contract.

### 🟢 Q: When is Redis not a good primary database? `[Junior]`

**A:** Khi cần transaction mạnh phức tạp, query ad-hoc sâu, hoặc durability nghiêm ngặt mà chưa có persistence/HA phù hợp.
Redis rất tốt cho tốc độ, nhưng cần đánh giá kỹ durability requirements.

### 🟡 Q: How to choose between Cassandra and DynamoDB? `[Mid]`

**A:** Cassandra cho self-managed/high control; DynamoDB cho managed service với ops nhẹ hơn.
Quyết định theo đội vận hành, lock-in, SLA, và mô hình chi phí.

### 🟡 Q: How does CAP relate to user experience? `[Mid]`

**A:** Chọn availability cao có thể cho phép stale reads nhưng app phản hồi nhanh hơn khi mạng có vấn đề.
Chọn consistency cao có thể tăng lỗi timeout hoặc latency trong partition.

### 🟡 Q: What is eventual consistency in plain words? `[Mid]`

**A:** Các bản sao dữ liệu có thể tạm thời khác nhau, nhưng nếu không có update mới thì cuối cùng sẽ đồng nhất.
Ứng dụng cần thiết kế UI/logic chịu được trạng thái tạm không đồng bộ.

### 🔴 Q: How to design idempotent writes for distributed NoSQL systems? `[Senior]`

**A:** Dùng idempotency key/request ID, conditional writes (CAS), và dedup window.
Giúp retry an toàn khi network lỗi hoặc timeout không rõ commit state.

### 🔴 Q: What are common pitfalls in polyglot persistence? `[Senior]`

**A:** Dữ liệu trùng lặp thiếu ownership rõ ràng, monitoring phân mảnh, và team thiếu kỹ năng đa hệ.
Cần data contract, ownership map, và observability thống nhất.

### 🔴 Q: How do NewSQL systems compare with PostgreSQL + sharding middleware? `[Senior]`

**A:** NewSQL tích hợp distributed consensus và SQL engine thống nhất hơn, nhưng learning curve và cost có thể cao.
PostgreSQL + middleware linh hoạt hơn ở một số tổ chức nhưng vận hành phức tạp hơn theo thời gian.

### 🔴 Q: How to evaluate migration success beyond latency? `[Senior]`

**A:** Đo correctness (data parity), incident rate, developer velocity, cost, và SLO vi phạm.
Latency tốt mà correctness kém vẫn là migration thất bại.

### 🟡 Q: What interview answer structure works best for SQL vs NoSQL choice? `[Mid]`

**A:** Nêu workload + consistency needs + query pattern + ops constraints + cost.
Sau đó đưa 1-2 phương án và giải thích trade-off rõ ràng.

## 14. Cross-References / Tài liệu liên quan

- `docs/shared/03-database/database-theory.md`
- `docs/shared/02-system-design/system-design-theory.md`
- `docs/shared/02-system-design/consensus-algorithms.md`
- `docs/be-track/03-database-advanced/03-nosql-redis-mongo.md`
- `docs/be-track/03-database-advanced/01-sql-fundamentals.md`
- `docs/be-track/02-backend-knowledge/03-distributed-systems.md`

---

## Interview Q&A Summary / Tổng hợp câu hỏi phỏng vấn

### Q: What are the main types of NoSQL databases and when to use each? / Các loại NoSQL database và khi nào dùng? 🟡 Mid

**A:**

```
NoSQL Categories:

1. Document Store
   Examples: MongoDB, Firestore, CouchDB
   Data model: JSON/BSON documents, schema-flexible
   Strengths: nested data, schema evolution, dev speed
   Weaknesses: no multi-document ACID (without transactions), joins expensive
   Use when:
   ├── Content management (articles, user profiles)
   ├── Catalog (product with varying attributes)
   └── Prototype/MVP (fast schema iteration)

2. Key-Value Store
   Examples: Redis, DynamoDB (also document), Memcached
   Data model: key → opaque value (string, list, set, hash)
   Strengths: O(1) lookup, extreme throughput (Redis: 1M+ ops/sec)
   Weaknesses: no range queries (key-only), limited data modeling
   Use when:
   ├── Caching (session, computed results)
   ├── Rate limiting counters
   └── Pub/Sub messaging

3. Wide-Column (Column Family)
   Examples: Cassandra, HBase, Google Bigtable
   Data model: row key → column families → columns
   Strengths: massive write throughput, linear scalability, time-series
   Weaknesses: no ad-hoc queries, must design for access patterns
   Use when:
   ├── Time-series data (metrics, logs, IoT)
   ├── Write-heavy workloads (activity feeds, audit logs)
   └── Geo-distributed (Cassandra multi-datacenter)

4. Graph Database
   Examples: Neo4j, Amazon Neptune, ArangoDB
   Data model: nodes + edges + properties
   Strengths: relationship traversal (friend-of-friend in O(1))
   Weaknesses: doesn't scale horizontally as well, niche use
   Use when:
   ├── Social networks (followers, friends)
   ├── Fraud detection (transaction networks)
   └── Recommendation engines (collaborative filtering)

5. Search Engine
   Examples: Elasticsearch, OpenSearch, Solr
   Data model: inverted index over documents
   Strengths: full-text search, faceted search, aggregations
   Weaknesses: not primary storage, eventually consistent
   Use when: search feature, log analytics (ELK stack)
```

**Điểm then chốt:** "What's your access pattern?" là câu hỏi đầu tiên khi chọn NoSQL. MongoDB nếu dữ liệu hierarchical. Redis cho caching/real-time. Cassandra cho time-series/high-write. Elasticsearch cho full-text search.

### Q: What is the CAP theorem and BASE properties? / CAP theorem và BASE là gì? 🔴 Senior

**A:**

```
CAP Theorem (Brewer, 2000):
  In a distributed system, you can only guarantee 2 of 3:

  C - Consistency:   Every read sees most recent write (or error)
  A - Availability:  Every request gets a response (no error)
  P - Partition Tolerance: System works despite network partitions

  Since network partitions WILL happen in distributed systems:
  → Real choice is between CP and AP

CP systems (sacrifice Availability):
├── During partition: refuse to serve stale data → return error
├── Examples: HBase, Zookeeper, etcd, Redis (single-node), MongoDB (strong)
└── Use for: banking, inventory (correctness > availability)

AP systems (sacrifice Consistency):
├── During partition: serve potentially stale data → eventual consistency
├── Examples: Cassandra, DynamoDB, CouchDB
└── Use for: social media, DNS, shopping cart (availability > perfect consistency)

PACELC extension (more complete):
  PAC: partition → choose Availability or Consistency
  ELC: else (no partition) → choose Latency or Consistency
  └── Even without partitions, replication adds latency vs consistency trade-off
```

**BASE vs ACID:**

```
ACID (traditional RDBMS):
├── Atomicity: transaction is all-or-nothing
├── Consistency: database invariants maintained
├── Isolation: concurrent transactions don't interfere
└── Durability: committed data survives crashes

BASE (NoSQL systems):
├── Basically Available: system responds even if partially failed
├── Soft state: state may change without input (due to replication convergence)
└── Eventually Consistent: system converges to consistent state over time

Example of eventual consistency:
  Write to Cassandra (3 replicas):
  t=0: write to replica 1 ✓
  t=0: write to replica 2 ✓
  t=50ms: replica 3 receives async update ✓
  → During those 50ms, reads from replica 3 see stale data
  → After 50ms: all replicas consistent
```

**Điểm phỏng vấn:** CAP là câu hỏi senior kinh điển. Thực tế: partition tolerance là bắt buộc (mạng luôn có khả năng phân vùng), nên choice thực sự là CP vs AP. Biết hệ thống nào là CP và AP trong ecosystem thường dùng.

### Q: How does DynamoDB achieve its scalability? / DynamoDB scale như thế nào? 🔴 Senior

**A:**

```
DynamoDB Architecture:
  Managed NoSQL from AWS: key-value + document, single-digit ms latency

Data model:
├── Table → Items (rows) → Attributes (columns, flexible)
├── Primary Key: Partition Key (PK) + optional Sort Key (SK)
└── GSI (Global Secondary Index): alternate query patterns

Partitioning:
  PK → hashed → partition (managed node)
  ├── Each partition: max 10GB, 3000 RCU, 1000 WCU
  ├── SDK automatically routes requests to correct partition
  └── Scales to unlimited partitions → linear scalability

Hot partition problem:
  Bad PK: user_id="admin" → all requests to 1 partition → throttled
  Fix:
  ├── Choose high-cardinality PK (UUID, timestamp+random)
  ├── Write sharding: PK = user_id + random_suffix (1-10)
  └── DAX (DynamoDB Accelerator): in-memory cache, microsecond reads

Query patterns — design first:
  ✅ PK = user_id, SK = timestamp → "get user's recent orders" (range query)
  ✅ GSI on email → "find user by email"
  ❌ Filter scan → full table scan → O(n), expensive, avoid

Single-table design:
  One table, multiple entity types with composite keys:
  PK=USER#123, SK=PROFILE       → user profile
  PK=USER#123, SK=ORDER#456     → user's order
  PK=ORDER#456, SK=ITEM#789     → order item
  └── Enables "get user + their orders" in 1 query
```

**Pricing model:** On-demand (pay per request) vs Provisioned (set RCU/WCU, cheaper at steady load). Use on-demand for variable/unpredictable traffic.

**Điểm senior:** DynamoDB design là về access patterns trước tiên. Single-table design là advanced pattern giúp minimize costs và queries. Hot partition là failure mode cần biết. DynamoDB Streams + Lambda là pattern cho event-driven với DynamoDB.

---

## Self-Check / Tự Kiểm Tra

| #   | Loại           | Câu hỏi tự kiểm                                                                                                       |
| --- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔁 Retrieval   | Kể 5 loại NoSQL với internal data model và 1 production use case cụ thể cho mỗi loại (không dùng tài liệu)            |
| 2   | 🖼️ Visual      | Vẽ write path của Cassandra (Memtable → SSTable) và so sánh với B+Tree write path của PostgreSQL                      |
| 3   | ⚙️ Application | Thiết kế data layer cho e-commerce: chọn DB cho orders, cart, search, activity log — giải thích từng lựa chọn         |
| 4   | 🐛 Debug       | Redis đang dùng AOF persistence nhưng vẫn mất ~1 giây dữ liệu sau crash — nguyên nhân chính xác và cách fix?          |
| 5   | 🎓 Teach       | Giải thích CAP theorem cho junior engineer: tại sao P bắt buộc, CP vs AP khác nhau thế nào, ví dụ 1 hệ thống mỗi loại |

💬 **Feynman Prompt:** Giải thích tại sao MongoDB (document store) không phù hợp để replace Redis (key-value) cho session storage — dù cả hai đều là "NoSQL". Nêu ít nhất 3 lý do kỹ thuật cụ thể (hint: latency model, data structure, persistence trade-off).

## Connections / Liên Kết

- ⬅️ **Built on**: [Database Theory](./database-theory.md) — ACID vs BASE, CAP theorem
- ➡️ **Applied in**: [BE NoSQL Go](../../be-track/03-database-advanced/03-nosql-redis-mongo.md) — Redis and MongoDB implementation
- 🔗 **Related**: [Indexing](./02-indexing-and-optimization.md) — NoSQL uses LSM-Tree vs B+Tree for indexes
- 🔗 **Related**: [Sharding](./04-sharding-and-transactions.md) — NoSQL databases often have built-in sharding
