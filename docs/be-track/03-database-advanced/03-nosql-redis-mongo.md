# NoSQL, Redis, MongoDB & Beyond — Interview Deep Dive

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md) | [NoSQL & NewSQL (Shared)](../../shared/03-database/03-nosql-and-newsql.md)

> **Phạm vi**: Lý thuyết chuyên sâu (~85%) + ví dụ minh họa (~15%). Định dạng Q&A song ngữ.
> **Mục tiêu**: Trang bị kiến thức vững chắc về các hệ thống NoSQL phổ biến cho phỏng vấn Backend/System Design.

---

## Real-World Scenario / Tình Huống Thực Tế

**VNG ZaloPay (thực tế):** Đội kỹ thuật cần lưu trữ session tokens cho 50 triệu user — nếu dùng PostgreSQL, mỗi request authentication phải JOIN 3 bảng và query mất 15ms. Sau khi migrate session data sang Redis (Hash type), latency giảm xuống 0.3ms. Đồng thời, user profile không có schema cố định (một số user có trường `business_account`, một số không) — MongoDB phù hợp hơn PostgreSQL vì schema-on-read.

**Bài học:** NoSQL không thay thế SQL — mỗi loại giải quyết một bài toán khác nhau. Biết _khi nào_ dùng gì quan trọng hơn biết cú pháp.

## What & Why / Cái Gì & Tại Sao

**Analogy:** SQL giống bảng Excel có cột cố định — dữ liệu ngăn nắp, query phức tạp dễ viết. NoSQL giống ngăn kéo linh hoạt: document store như thư mục (bỏ bất kỳ loại tài liệu nào vào), key-value store như tủ khóa (tra cứu nhanh bằng số tủ), graph store như mạng xã hội (kết nối giữa các node).

**Why it matters:** Scale ≥ 10 triệu users, SQL bắt đầu gặp giới hạn về write throughput và flexible schema. NoSQL được thiết kế để horizontal scale từ đầu.

## Concept Map / Bản Đồ Khái Niệm

```
[NoSQL Landscape]
        │
        ├── Key-Value: Redis, DynamoDB
        │     ├── O(1) read/write by key
        │     ├── No query flexibility
        │     └── Use: sessions, caches, counters
        │
        ├── Document: MongoDB, Firestore
        │     ├── JSON/BSON documents, flexible schema
        │     ├── Rich queries within document
        │     └── Use: user profiles, catalogs, content
        │
        ├── Wide-Column: Cassandra, HBase
        │     ├── Row key + column families
        │     ├── Optimized for write-heavy time-series
        │     └── Use: IoT data, activity logs, metrics
        │
        └── Graph: Neo4j, Amazon Neptune
              ├── Nodes + edges + properties
              ├── Efficient relationship traversal
              └── Use: social networks, fraud detection, recommendations
```

---

## Overview / Tổng Quan

| #   | Concept             | Role                                                                         | Interview Weight |
| --- | ------------------- | ---------------------------------------------------------------------------- | ---------------- |
| 1   | SQL vs NoSQL        | Foundation: data model trade-offs, CAP theorem, selection criteria           | ⭐⭐⭐⭐⭐       |
| 2   | Redis Deep Dive     | In-memory data store: types, persistence, cluster, eviction                  | ⭐⭐⭐⭐⭐       |
| 3   | MongoDB             | Document store: schema design, indexing, sharding, transactions              | ⭐⭐⭐⭐         |
| 4   | Elasticsearch       | Search engine: inverted index, BM25, analyzers, not a primary DB             | ⭐⭐⭐           |
| 5   | Cassandra           | Wide-column: partition key, consistency levels, tombstones, LSM-tree         | ⭐⭐⭐           |
| 6   | Time-Series & Graph | Specialized DBs: InfluxDB, TimescaleDB, Neo4j — niche but interview-relevant | ⭐⭐             |
| 7   | Decision Matrix     | Cross-cutting: when to use which DB, multi-layer caching, storage stack      | ⭐⭐⭐⭐         |

**Relationships:** SQL vs NoSQL (1) provides the framework for evaluating all other DBs. Redis (2) is the most-asked NoSQL topic in SE Vietnam interviews. MongoDB (3) complements Redis for document workloads. Elasticsearch (4) sits alongside primary DBs as a search layer. Cassandra (5) appears in system design for write-heavy scenarios. Time-Series/Graph (6) are niche but demonstrate breadth. Decision Matrix (7) ties everything together for "design the data layer" questions.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: SQL vs NoSQL Fundamentals

> 🧠 **Memory Hook:** "SQL = Excel with foreign keys; NoSQL = flexible drawers — each drawer type for a different job"

**Why exists (Root-cause):**

- **Level 1:** Different data problems need different storage models — relational integrity vs horizontal scale
- **Level 2:** RDBMS hit write throughput limits at scale; NoSQL sacrifices JOIN capability for partition tolerance and linear scalability
- **Level 3:** CAP theorem forces explicit trade-offs; PACELC extends this to latency vs consistency even when no partition

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Tưởng tượng bạn quản lý hồ sơ học sinh trong trường. SQL giống bảng điểm chuẩn: mỗi học sinh có đúng các cột (tên, ngày sinh, điểm toán, điểm văn) — ngăn nắp, dễ so sánh, nhưng nếu cần thêm cột mới phải sửa cả bảng. NoSQL giống hồ sơ cá nhân trong ngăn kéo riêng: một học sinh có thêm tờ "đăng ký ngoại khoá", học sinh khác có thêm "đơn xin miễn học" — linh hoạt, nhưng khó so sánh đồng loạt.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
SQL Data Model:              NoSQL Document Model:
┌──────────────────┐         ┌──────────────────────────────┐
│ TABLE: users     │         │ Collection: users             │
├────┬─────┬───────┤         │                               │
│ id │name │ email │         │ { id:1, name:"An",            │
├────┼─────┼───────┤         │   email:"an@x.com",           │
│  1 │ An  │an@x.. │         │   address:{city:"HCM"}, ←─ extra
│  2 │ Bình│bn@x.. │         │   tags:["vip","new"]  } ←─ array
└────┴─────┴───────┘         │ { id:2, name:"Bình" }   ←─ OK
Schema-on-write              └──────────────────────────────┘
(cột cố định)                Schema-on-read (linh hoạt)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Eventual consistency trap**: NoSQL AP systems (Cassandra, DynamoDB) có thể trả data cũ vài ms/giây sau write — không dùng cho tài khoản ngân hàng.
- **PACELC gotcha**: CAP chỉ mô tả khi có network partition. Thực tế, lựa chọn latency vs consistency xảy ra **mọi request** — không cần partition.
- **"NoSQL không cần schema" là myth**: Schema vẫn tồn tại nhưng enforce ở application layer — type bugs khó phát hiện hơn nhiều.
- **Polyglot persistence overhead**: Mỗi DB thêm vào = thêm monitoring, backup, expertise, on-call — đừng thêm DB chỉ vì "nghe hay".
- **Cross-store transaction cực phức tạp**: Saga/outbox patterns phức tạp và dễ bug — thiết kế để tránh cross-store transactions từ đầu.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                     | Tại sao sai                                                                                  | Đúng là                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| "NoSQL nhanh hơn SQL"       | Phụ thuộc access pattern; PostgreSQL với index tốt đánh bại MongoDB cho complex JOINs        | So sánh dựa trên access pattern cụ thể, không phải loại DB |
| Dùng NoSQL để tránh học SQL | Nhiều NoSQL use case vẫn cần relational thinking cho data integrity                          | Học SQL vững trước; NoSQL là lựa chọn thêm, không thay thế |
| Bỏ qua PACELC               | CAP chỉ cover partition scenario; real systems cũng trade-off latency vs consistency mọi lúc | Hiểu PACELC để thiết kế system đúng                        |

**Interview Pattern:** "When would you choose NoSQL over SQL?" → Name 3 criteria (schema flexibility, write throughput, horizontal scale) + 1 counter-example (financial transactions need ACID → SQL)

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SQL Fundamentals](./01-sql-fundamentals.md)
- ➡️ Để hiểu tiếp: [Indexing Optimization](./02-indexing-optimization.md)

### Concept 2: Redis Deep Dive

> 🧠 **Memory Hook:** "Redis = RAM dictionary with 16384 mailboxes (hash slots), single postman (thread), but fastest in the city"

**Why exists (Root-cause):**

- **Level 1:** Disk-based DBs can't serve sub-millisecond reads; Redis keeps everything in memory
- **Level 2:** Single-threaded event loop eliminates lock contention; I/O multiplexing (epoll) handles 100K+ connections
- **Level 3:** Hash slots enable horizontal scale (Cluster) while Sentinel provides HA for single-master setups; persistence (RDB/AOF) trades durability for speed

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Redis giống bàn làm việc so với kho lưu trữ dưới tầng hầm (database trên đĩa). Tìm tài liệu trên bàn = tức thì. Tìm trong kho = phải đi bộ, mở ngăn kéo, tìm kiếm. Redis giữ mọi thứ "trên bàn" (RAM) — đó là lý do nó nhanh gấp 100–1000 lần. Nhưng khi mất điện, bàn làm việc bị xáo trộn — cần persistence để không mất dữ liệu.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Client Request Flow trong Redis:

Client → Network I/O (epoll) → Event Loop (single thread)
                                       │
                          ┌────────────┴──────────────┐
                          │       Command Queue        │
                          │  SET key1 "val"  ←         │
                          │  GET key2        ← ← ← ←   │  Không block nhau
                          │  ZADD lb 100 "p1"←         │
                          └────────────┬──────────────┘
                                       │
                               In-Memory Store
                               ┌──────────────┐
                               │ key1: "val"  │
                               │ key2: ...    │
                               │ lb: ZSet...  │
                               └──────────────┘
                                       │
                              (async) Persistence
                              RDB snapshot / AOF log
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Single-threaded không có nghĩa là chậm**: Bottleneck của Redis là network bandwidth, không phải CPU — hầu hết lệnh hoàn thành trong microseconds.
- **O(N) commands là mìn trong production**: `KEYS *`, `SMEMBERS large_set` trên data lớn → block toàn bộ server. Luôn dùng SCAN thay KEYS.
- **Replication lag**: Replication async — trong window nhỏ sau write, replica có thể trả data cũ. Đọc từ replica = chấp nhận eventual consistency.
- **Memory fragmentation**: `mem_fragmentation_ratio > 1.5` cần `MEMORY PURGE` hoặc restart; monitor thường xuyên.
- **Cluster multi-key gotcha**: Multi-key ops (MSET, pipeline) chỉ hoạt động khi tất cả keys cùng hash slot — dùng hash tags `{user:1}` để group.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                | Đúng là                                                                  |
| ------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dùng Redis làm primary DB             | Không có ACID, không có complex queries; OOM = mất dữ liệu | Dùng Redis làm cache/session/counter layer; SQL/NoSQL là source of truth |
| Dùng KEYS trong production            | O(N) block toàn bộ server; 1 triệu keys = freeze vài giây  | Dùng SCAN với cursor để iterate từng batch nhỏ                           |
| Không set maxmemory + eviction policy | OOM killer sẽ kill Redis process khi hết RAM               | Luôn set `maxmemory` và `allkeys-lfu` cho cache workloads                |
| Nhầm Pub/Sub với Streams              | Pub/Sub fire-and-forget: subscriber offline = mất message  | Dùng Redis Streams khi cần reliability, acknowledgment, consumer groups  |

**Interview Pattern:** "Why is Redis fast despite being single-threaded?" → In-memory + epoll + no locks + efficient data structures. Follow up: "What about Redis 6.0 I/O threads?" → I/O threads for network read/write only; command execution still single-threaded

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SQL vs NoSQL Fundamentals](#concept-1-sql-vs-nosql-fundamentals) (Concept 1, cùng file)
- ➡️ Để hiểu tiếp: [Caching Patterns](./04-caching-patterns.md)

### Concept 3: MongoDB

> 🧠 **Memory Hook:** "MongoDB = JSON filing cabinet with WiredTiger engine — document-level locks, ESR index rule, oplog replication"

**Why exists (Root-cause):**

- **Level 1:** Relational schema changes are expensive (ALTER TABLE); document model allows schema evolution without downtime
- **Level 2:** WiredTiger replaced MMAPv1 for document-level locking + compression; B-tree indexes similar to PostgreSQL
- **Level 3:** Sharding distributes data by shard key; poor shard key (low cardinality) creates "jumbo chunks" and hotspots

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

MongoDB giống tủ hồ sơ văn phòng hiện đại thay vì bảng tính Excel. Mỗi ngăn kéo (collection) chứa các phong bì (documents) — mỗi phong bì có thể chứa giấy tờ khác nhau. Hồ sơ khách VIP có thêm tờ "thông tin doanh nghiệp", hồ sơ khách thường thì không — không ai phàn nàn vì không có cột chuẩn bắt buộc. Khi cần tra cứu, bạn lật qua phong bì nào có chứa từ khoá đó.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
SQL (PostgreSQL):                    MongoDB:
┌──────────────────────┐             ┌──────────────────────────────┐
│ TABLE: users         │             │ Collection: users             │
│ id | name | city_id  │             │ {                             │
├────┼──────┼──────────┤             │   _id: ObjectId("abc123"),    │
│  1 │ An   │    5     │             │   name: "An",                 │
└────┴──────┴──────────┘             │   address: {                  │
                                     │     city: "HCM",  ← embedded  │
┌──────────────────────┐             │     district: "Q1"            │
│ TABLE: cities        │             │   },                          │
│ id | name            │             │   tags: ["vip","active"]      │
├────┼──────────────── ┤             │ }                             │
│  5 │ Ho Chi Minh     │             └──────────────────────────────┘
└────┴─────────────────┘
JOIN required for city               Single document query — no JOIN
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **16MB document limit**: Không nhúng arrays không giới hạn (comments, logs) vào document — dùng referencing hoặc collection riêng khi array có thể lớn.
- **Shard key không thể đổi dễ dàng**: Trước MongoDB 5.0 là bất biến; từ 5.0 có thể reshard nhưng rất tốn kém — cân nhắc kỹ từ đầu.
- **Aggregation pipeline memory limit**: Mỗi stage được phép dùng 100MB RAM — nếu vượt cần `allowDiskUse: true`, nhưng chậm hơn nhiều.
- **Transactions đắt hơn PostgreSQL**: Nếu schema cần nhiều multi-document transactions, đó là dấu hiệu nên dùng SQL thay vì MongoDB.
- **NRT read concern**: `readConcern: "majority"` yêu cầu majority replicas xác nhận — tăng read latency nhưng đảm bảo không đọc rollback-able data.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                       | Tại sao sai                                                          | Đúng là                                                                     |
| ----------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Nhúng mọi thứ vào 1 document  | Giới hạn 16MB + update amplification khi array lớn                   | Nhúng khi data luôn đọc cùng nhau; reference khi data share hoặc có thể lớn |
| Thiếu compound index theo ESR | Index không dùng được tối đa, query chậm hoặc không dùng index       | Đặt Equality → Sort → Range trong compound index                            |
| Dùng transactions nhiều       | MongoDB transactions chậm hơn PostgreSQL ACID đáng kể                | Nếu cần nhiều transactions, cân nhắc dùng SQL thay                          |
| Chọn sai shard key            | Không thể thay đổi dễ dàng; low cardinality tạo jumbo chunks/hotspot | High cardinality + query isolation + non-monotonic                          |

**Interview Pattern:** "When would you use MongoDB vs PostgreSQL?" → Document model when schema varies per record + read-heavy with known query patterns. Counter: financial ledger with complex JOINs → PostgreSQL

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SQL Fundamentals](./01-sql-fundamentals.md) và [Indexing Optimization](./02-indexing-optimization.md)
- ➡️ Để hiểu tiếp: [Caching Patterns](./04-caching-patterns.md) (MongoDB + Redis kết hợp)

### Concept 4: Elasticsearch

> 🧠 **Memory Hook:** "ES = inverted index phone book — BM25 ranks pages, ~1s delay (NRT), NEVER the source of truth"

**Why exists (Root-cause):**

- **Level 1:** B-tree indexes can't do full-text search efficiently; inverted index maps terms → document IDs
- **Level 2:** BM25 scoring (improved TF-IDF) ranks results by relevance; analyzers tokenize + normalize text
- **Level 3:** NRT (Near Real-Time) ~1s refresh delay means ES is eventually consistent; filter context is cacheable, query context scores relevance

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Inverted index giống mục lục ở cuối sách giáo khoa. Thay vì đọc từng trang để tìm từ "quang hợp" (forward search), bạn tra mục lục: "quang hợp → trang 45, 78, 102" — tìm ngay lập tức. Elasticsearch xây một mục lục khổng lồ cho toàn bộ text của bạn, nên tìm trong triệu documents chỉ mất milliseconds. Nhưng giống mục lục sách: khi có chỉnh sửa, phải in lại mục lục — đó là lý do update trong ES rất tốn kém.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Cách Inverted Index được xây dựng:

Doc 1: "Redis is fast"      Analyzer Pipeline:
Doc 2: "Redis is scalable"  Input → Tokenize → Lowercase → Remove stopwords
Doc 3: "MongoDB is fast"                                        │
                                                                ↓
                            Inverted Index:
                            ┌────────────┬──────────────────────┐
                            │   Term     │    Posting List      │
                            ├────────────┼──────────────────────┤
                            │ "redis"    │ [Doc1(pos:0), Doc2]  │
                            │ "fast"     │ [Doc1(pos:2), Doc3]  │
                            │ "mongodb"  │ [Doc3(pos:0)]        │
                            │ "scalable" │ [Doc2(pos:2)]        │
                            └────────────┴──────────────────────┘

Search "redis fast":
  [Doc1,Doc2] ∩ [Doc1,Doc3] = [Doc1] → ranked by BM25 score ✓
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **NRT ~1 giây delay**: ES không phù hợp real-time reads ngay sau write — Kibana logs có thể hiện muộn ~1 giây sau ingest.
- **Update = delete + reindex**: Không có in-place update; mỗi update tạo document mới + đánh dấu cũ là deleted → segment bloat nếu update thường xuyên.
- **Over-sharding tax**: Mỗi shard là 1 Lucene index với overhead riêng — quá nhiều shards nhỏ tiêu tốn memory và CPU. Rule of thumb: target 20–40GB/shard.
- **Mapping explosion**: Dynamic mapping tự thêm fields → có thể tạo hàng ngàn fields không mong muốn. Dùng `dynamic: "strict"` trong production.
- **ES ≠ primary database**: Không có relational integrity, no ACID, eventual consistency — luôn sync từ source of truth qua CDC/event-driven.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                      | Tại sao sai                                                            | Đúng là                                                                  |
| ---------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Dùng ES làm primary database | Không có ACID, eventual consistency, update = delete + reindex tốn kém | Dùng PostgreSQL/MongoDB làm source of truth; ES chỉ là search layer      |
| Không hiểu NRT delay         | Writes cần ~1s để visible; không phù hợp real-time reads               | Thiết kế app chấp nhận ~1s delay hoặc dùng `?refresh=true` (rất tốn kém) |
| Over-sharding                | Mỗi shard có overhead; quá nhiều shards nhỏ gây slowdowns              | Bắt đầu ít shards, reindex khi cần scale; target 20–40GB/shard           |

**Interview Pattern:** "How would you implement search for an e-commerce site?" → ES for product search + PostgreSQL as source of truth → CDC/event-driven sync → Index with custom analyzers for Vietnamese text

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Indexing Optimization](./02-indexing-optimization.md) (B-Tree index concepts)
- ➡️ Để hiểu tiếp: [System Design Framework](../04-be-system-design/01-design-framework.md) (search architecture patterns)

### Concept 5: Cassandra

> 🧠 **Memory Hook:** "Cassandra = append-only log wall (LSM-tree) — partition key picks the wall, clustering key sorts the bricks"

**Why exists (Root-cause):**

- **Level 1:** Write-heavy workloads (IoT, logs, metrics) need sequential writes; LSM-tree optimizes for this
- **Level 2:** Partition key determines node placement; clustering key determines sort order within partition — query-first data modeling is mandatory
- **Level 3:** R + W > N gives strong consistency; tombstones from deletes accumulate and slow reads — design to avoid frequent deletes

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Cassandra giống sổ nhật ký dạng append-only tại bưu điện: mỗi lần có giao dịch, nhân viên CHỈ ghi thêm dòng mới vào cuối sổ — không bao giờ xoá hay sửa dòng cũ. Sổ được đánh dấu theo ngày (partition key) và giờ (clustering key). Tìm giao dịch ngày 20/3 → lật thẳng đến trang ngày 20/3, đọc tuần tự. Rất nhanh cho ghi và đọc theo thời gian, nhưng không thể "tìm tất cả giao dịch trên 1 triệu đồng" mà không xét từng sổ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
LSM-Tree Write Path trong Cassandra:

Client Write
     │
     ├──→ Commit Log (WAL on disk) ← crash recovery
     │
     └──→ MemTable (RAM, sorted)
               │ (khi đầy)
               ↓
          SSTable (disk, immutable, sorted)
          SSTable
          SSTable  ──→ Compaction ──→ Merged SSTable
          SSTable           (giảm read amplification)

Partition Key → Hash → Token Ring:
         ┌──────────────┐
      Node A          Node C
    (0-5460)      (10922-16383)
         └────Node B────┘
           (5461-10922)
    Data replicated across RF nodes
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Hot partition**: Nếu dùng ngày hiện tại làm partition key, TẤT CẢ writes trong ngày đổ vào 1 partition → 1 node bị quá tải. Thêm bucket/random suffix.
- **Tombstone accumulation**: DELETE tạo marker, không xóa ngay → phải scan qua tombstones khi đọc. `gc_grace_seconds` (10 ngày) phải qua trước khi compaction dọn.
- **Secondary index là anti-pattern**: Scatter-gather query qua tất cả nodes → latency cao. Tạo separate denormalized lookup table thay vì secondary index.
- **Eventual repair required**: Khi node offline rồi online lại, data có thể không đồng bộ — chạy `nodetool repair` định kỳ.
- **Query-first là bắt buộc, không tùy chọn**: Không thể viết query tùy ý như SQL — mỗi query pattern cần 1 table riêng. Thay đổi query = tạo table mới.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                        | Đúng là                                                              |
| ---------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Model data như SQL (normalize rồi query) | Cassandra không hỗ trợ JOINs; scatter-gather queries rất chậm      | Query-first design: 1 query pattern = 1 table, denormalize hoàn toàn |
| Xóa data thường xuyên                    | Tombstones tích tụ → read performance giảm mạnh đến khi compaction | Dùng TTL thay DELETE; thiết kế để minimize deletes ngay từ đầu       |
| Dùng secondary indexes nặng              | Tạo scatter-gather queries qua tất cả nodes → chậm                 | Tạo separate lookup table với partition key phù hợp                  |
| Bỏ qua partition size                    | Partition > 100MB gây GC pressure và slow reads                    | Monitor partition size; dùng time-bucket strategy để giới hạn        |

**Interview Pattern:** "Design time-series storage for IoT with 1M writes/sec" → Cassandra with time-bucketed partition keys + clustering key on timestamp → Explain compaction strategy (TWCS for time-series)

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) (CAP theorem, consistency models)
- ➡️ Để hiểu tiếp: [System Design Framework](../04-be-system-design/01-design-framework.md) (data layer design for write-heavy systems)

### Concept 6: Time-Series & Graph Databases

> 🧠 **Memory Hook:** "InfluxDB = metrics firehose with auto-downsampling; Neo4j = relationship web where JOINs become O(1) pointer chasing"

**Why exists (Root-cause):**

- **Level 1:** Generic DBs waste storage on timestamp-indexed append-only data; TSDB compresses and auto-aggregates
- **Level 2:** Graph DBs store relationships as first-class citizens; traversing N hops is O(N) regardless of data size vs SQL's N JOINs
- **Level 3:** InfluxDB uses TSM (Time-Structured Merge) tree; TimescaleDB extends PostgreSQL with hypertables; Neo4j uses index-free adjacency for O(1) relationship traversal

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**Time-Series:** Hãy tưởng tượng trạm khí tượng ghi nhiệt độ mỗi 5 phút trong 10 năm — hàng triệu điểm số. PostgreSQL như cuốn sổ tay thông thường: ghi được nhưng chậm, tốn chỗ. InfluxDB như máy ghi tự động chuyên dụng: nén dữ liệu 10x, tự xoá số liệu cũ, trả lời "nhiệt độ trung bình tuần này?" trong milliseconds.

**Graph:** Mạng xã hội như mạng nhện — người A quen B quen C quen D. SQL phải JOIN bảng friends 4 lần. Neo4j "bước đi" theo sợi tơ từ A → D — mỗi bước O(1), tổng O(4 hops).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Time-Series Compression (TSM Engine):

Raw data:    [10:00=23.1, 10:05=23.2, 10:10=23.4, 10:15=23.3]
Delta enc:   [23.1, +0.1, +0.2, -0.1]  → smaller integers
XOR float:   further compressed         → ~10x smaller vs PostgreSQL!
+ Retention: data > 30d auto-deleted, 5min → hourly aggregation

Graph Traversal vs SQL JOIN:

SQL: 4-hop friend query                Neo4j (index-free adjacency):
SELECT * FROM friends f1               MATCH (a)-[:FRIEND*4]->(d)
JOIN friends f2 ON f1.b=f2.a           RETURN d.name
JOIN friends f3 ON f2.b=f3.a
JOIN friends f4 ON f3.b=f4.a           Each hop = O(1) pointer follow
→ O(n^4) table scan                    → O(hops) regardless of size
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **TSDB downsampling từ đầu**: Dữ liệu cũ không cần độ phân giải cao — cấu hình "average mỗi 1 phút cho data > 1 tuần" từ đầu, không phải sau khi disk đầy.
- **InfluxDB tag vs field**: Tags nên là low-cardinality (device_type, region) và được index; Fields là actual values, không indexed — thiết kế sai gây slow queries.
- **Graph DB không phải magic cho mọi thứ**: Chỉ nhanh hơn SQL khi traversal depth > 2 và dataset lớn. Simple lookups có thể chậm hơn RDBMS.
- **Graph write bottleneck**: Neo4j thường read-optimized; write-heavy graph workloads cần careful architecture (JanusGraph, hoặc batch writes).
- **TimescaleDB sweet spot**: Khi team đã dùng PostgreSQL và cần time-series, TimescaleDB là lựa chọn ít migration nhất — full SQL support.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                             | Đúng là                                                              |
| ---------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Dùng generic DB cho metrics              | Tốn 10x storage; không có built-in downsampling/retention policy        | Dùng InfluxDB hoặc TimescaleDB được tối ưu cho time-series patterns  |
| Dùng Graph DB cho mọi thứ                | Chỉ hiệu quả khi traversal depth > 2; simple lookups chậm hơn RDBMS     | Chỉ dùng khi relationship traversal là core use case (social, fraud) |
| Nhầm property graph với RDF/triple store | Query language hoàn toàn khác (Cypher vs SPARQL); không interchangeable | Xác định rõ loại graph cần trước khi chọn DB                         |

**Interview Pattern:** "Design monitoring for 10K microservices" → Prometheus (pull-based metrics) + InfluxDB (long-term storage) + Grafana (visualization). Follow up: "Why not just use PostgreSQL?" → Compression ratio, retention policies, native downsampling

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [SQL Fundamentals](./01-sql-fundamentals.md) và [Cassandra](#concept-5-cassandra) (LSM-tree, append-only patterns)
- ➡️ Để hiểu tiếp: [System Design Framework](../04-be-system-design/01-design-framework.md) (chọn DB cho use cases cụ thể)

### Concept 7: Decision Matrix & Multi-DB Architecture

> 🧠 **Memory Hook:** "No single DB wins all — design a data layer like a team: PostgreSQL for truth, Redis for speed, ES for search, Cassandra for firehose"

**Why exists (Root-cause):**

- **Level 1:** Each DB optimizes for different access patterns; polyglot persistence matches DB to workload
- **Level 2:** Multi-layer caching (L1 local → L2 Redis → L3 CDN) reduces latency at each tier
- **Level 3:** CDC (Change Data Capture) keeps secondary stores in sync with source of truth; event-driven invalidation prevents stale data

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Chọn DB giống tuyển nhân viên cho từng phòng ban: kế toán cần người chặt chẽ, đúng từng đồng (PostgreSQL ACID); lễ tân cần người nhanh nhẹn nhớ mặt khách quen (Redis cache); thư viện cần người giỏi tìm sách theo chủ đề (Elasticsearch); kho hàng cần người ghi chép siêu nhanh từng kiện hàng (Cassandra). Không ai một mình làm tốt tất cả — polyglot persistence là đúng người đúng việc.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Multi-DB Architecture — Ride-hailing App:

     [User Request]
           │
     [API Gateway]
      ┌────┴──────────────────────────────┐
      │                                   │
[Auth/Session]              [Business Logic Layer]
      │                      │         │          │
   Redis               PostgreSQL  MongoDB   Elasticsearch
(session, OTP,         (orders,   (driver   (ride search,
 rate limit,            payments,  profiles,  analytics)
 driver coords)         ACID)      flexible)
      │
   Kafka (event streaming)
      │
 ┌────┴─────────────┐
 InfluxDB         Cassandra
(metrics,        (ride history,
 monitoring)      GPS logs)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **CDC consistency lag**: Sync từ PostgreSQL sang Elasticsearch qua CDC (Debezium) có độ trễ ~100ms–seconds — app phải handle "search results slightly stale".
- **Operational complexity nhân lên**: 5 loại DB = 5 lần monitoring, 5 lần backup procedures, 5 lần on-call expertise. Bắt đầu với ít DB, thêm khi có evidence.
- **Cross-store transaction là anti-pattern**: Nếu cần atomic operation trên 2 DB khác nhau, cần saga/outbox pattern — phức tạp, dễ bug, khó debug.
- **Hot/warm/cold tiering**: Hot data (7 ngày) → fast expensive storage; warm (7–90 ngày) → slower; cold (>90 ngày) → S3/object storage với query engine.
- **Vendor lock-in risk**: Managed cloud DBs (DynamoDB, Firestore) có pricing và API quirks riêng — đánh giá exit cost trước khi commit.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                             | Đúng là                                                                |
| --------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Dùng 1 DB cho tất cả                    | Performance cliff ở scale cao; 1 DB không tối ưu cho mọi access pattern | Polyglot persistence: chọn DB phù hợp từng workload                    |
| Thêm quá nhiều DB không có ops capacity | Mỗi DB cần monitoring, backup, expertise, on-call riêng                 | Bắt đầu đơn giản (PostgreSQL + Redis), thêm DB khi có evidence rõ ràng |
| Bỏ qua consistency giữa các store       | CDC lag = temporary inconsistency; gây confusing UX                     | Thiết kế cho eventual consistency, handle stale data gracefully        |

**Interview Pattern:** "Design the data layer for a ride-hailing app" → PostgreSQL (drivers, riders, payments) + Redis (driver locations, surge pricing cache) + ES (ride search) + Kafka (event streaming) + S3 (ride history cold storage)

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: Concepts 1–6 trong file này và [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md)
- ➡️ Để hiểu tiếp: [System Design Framework](../04-be-system-design/01-design-framework.md) (áp dụng vào thiết kế hệ thống thực tế)

---

## 1. SQL vs NoSQL — Khi Nào Dùng Gì

### Q: SQL và NoSQL khác nhau cơ bản ở điểm nào? `[Junior]`

**A:** Đây là câu hỏi nền tảng — cần hiểu bản chất chứ không chỉ liệt kê.

| Tiêu chí           | SQL (Relational)                    | NoSQL                                   |
| ------------------ | ----------------------------------- | --------------------------------------- |
| **Data Model**     | Bảng (rows/columns), schema cố định | Document, Key-Value, Wide-Column, Graph |
| **Schema**         | Schema-on-write (cứng)              | Schema-on-read (linh hoạt)              |
| **Scaling**        | Vertical (scale-up) chủ yếu         | Horizontal (scale-out) tự nhiên         |
| **ACID**           | Đầy đủ, mạnh mẽ                     | Tuỳ loại — thường eventual consistency  |
| **Joins**          | Hỗ trợ native, mạnh                 | Hạn chế hoặc không hỗ trợ               |
| **Query Language** | SQL chuẩn hoá                       | Mỗi DB một cách query riêng             |
| **Best for**       | Dữ liệu có quan hệ phức tạp         | Dữ liệu bán cấu trúc, throughput cao    |

**Bản chất sâu hơn**: SQL optimize cho **data integrity** và **query flexibility**. NoSQL optimize cho **scalability** và **performance** ở specific access patterns.

### Q: Giải thích CAP Theorem và ảnh hưởng đến việc chọn NoSQL? `[Mid]`

**A:** CAP Theorem (Eric Brewer, 2000) — trong một distributed system, bạn chỉ có thể đảm bảo **2 trong 3** tính chất:

- **C (Consistency)**: Mọi node đều đọc được dữ liệu mới nhất tại cùng một thời điểm.
- **A (Availability)**: Mọi request đều nhận được response (không bị timeout/error), dù có thể không phải data mới nhất.
- **P (Partition Tolerance)**: Hệ thống vẫn hoạt động khi mạng giữa các node bị đứt.

**Thực tế**: Partition Tolerance là bắt buộc trong distributed systems (mạng luôn có thể fail). Nên lựa chọn thực sự là giữa **CP** và **AP**:

| Loại   | Database                      | Giải thích                                                    |
| ------ | ----------------------------- | ------------------------------------------------------------- |
| **CP** | MongoDB, Redis Cluster, HBase | Khi partition xảy ra → từ chối request để đảm bảo consistency |
| **AP** | Cassandra, DynamoDB, CouchDB  | Khi partition xảy ra → vẫn phục vụ nhưng data có thể stale    |
| **CA** | PostgreSQL (single node)      | Không có partition → không phải distributed thực sự           |

**Lưu ý quan trọng**: CAP là **oversimplification**. Thực tế, các database hiện đại cho phép **tunable consistency** — ví dụ Cassandra có thể cấu hình từ ONE đến ALL consistency level. PACELC theorem mở rộng CAP: khi **không** có partition (E — Else), bạn chọn giữa **Latency** và **Consistency**.

### Q: Khi nào nên chọn SQL, khi nào NoSQL? `[Mid]`

**A:**

**Chọn SQL khi:**

- Dữ liệu có quan hệ phức tạp (nhiều bảng liên kết)
- Cần ACID transactions mạnh (tài chính, đơn hàng)
- Schema ổn định, ít thay đổi
- Cần ad-hoc queries linh hoạt (reporting, analytics)
- Team đã quen thuộc với SQL ecosystem

**Chọn NoSQL khi:**

- Schema thay đổi thường xuyên, dữ liệu bán cấu trúc
- Cần horizontal scaling cho write-heavy workloads
- Access pattern đơn giản, ít joins
- Cần latency cực thấp (cache, session, real-time)
- Dữ liệu lớn (Big Data) cần distributed processing

**Thực tế phổ biến**: Hầu hết hệ thống production dùng **polyglot persistence** — kết hợp nhiều loại DB. Ví dụ: PostgreSQL cho orders + Redis cho cache + Elasticsearch cho search + Cassandra cho logs.

---

## 2. Redis Deep Dive

### Q: Redis là gì và tại sao nó nhanh đến vậy? `[Junior]`

**A:** Redis (Remote Dictionary Server) là in-memory data structure store, có thể dùng làm database, cache, message broker.

**Lý do Redis nhanh:**

1. **In-memory**: Tất cả data nằm trong RAM — truy cập O(1) thay vì disk I/O.
2. **Single-threaded event loop**: Không có context switching, không cần lock — tránh overhead của concurrency.
3. **Efficient data structures**: Sử dụng các cấu trúc dữ liệu tối ưu cho từng use case (ziplist, intset, skiplist...).
4. **I/O multiplexing (epoll/kqueue)**: Xử lý hàng ngàn connections đồng thời trên single thread.
5. **Không có query parsing overhead**: Commands đơn giản, trực tiếp.

**Thắc mắc phổ biến**: "Single-threaded thì sao handle nhiều requests?" — Redis dùng **I/O multiplexing**. Bottleneck thường là network, không phải CPU. Từ Redis 6.0, **I/O threading** được thêm vào cho network read/write, nhưng command execution vẫn single-threaded.

### Q: Mô tả chi tiết các data types của Redis? `[Mid]`

**A:** Redis không chỉ là key-value đơn giản — nó cung cấp rich data structures:

**Core Data Types:**

| Type                  | Mô tả                     | Internal Encoding           | Use Case                              |
| --------------------- | ------------------------- | --------------------------- | ------------------------------------- |
| **String**            | Binary-safe, max 512MB    | int, embstr, raw            | Cache, counter, session               |
| **List**              | Doubly linked list        | ziplist, quicklist          | Queue, timeline, recent items         |
| **Set**               | Unordered unique elements | intset, hashtable           | Tags, unique visitors, set operations |
| **Sorted Set (ZSet)** | Set + score, ordered      | ziplist, skiplist+hashtable | Leaderboard, ranking, priority queue  |
| **Hash**              | Field-value pairs         | ziplist, hashtable          | Object storage, user profile          |

**Advanced Data Types:**

| Type            | Mô tả                                 | Use Case                                         |
| --------------- | ------------------------------------- | ------------------------------------------------ |
| **Stream**      | Append-only log (like Kafka)          | Event sourcing, message queue                    |
| **HyperLogLog** | Probabilistic counting (~0.81% error) | Unique visitor counting (chỉ ~12KB cho billions) |
| **Bitmap**      | Bit-level operations trên String      | Daily active users, feature flags                |
| **Geospatial**  | Longitude/latitude indexing           | Nearby search, distance calculation              |

**Sorted Set — tại sao quan trọng trong interview:**

- Dùng **skiplist** internally → O(log N) cho insert/delete/search
- Mỗi element có **score** (float64) để xếp hạng
- Hỗ trợ range queries: `ZRANGEBYSCORE`, `ZRANGEBYLEX`
- Use case kinh điển: leaderboard, rate limiter (sliding window)

```
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"
ZREVRANGE leaderboard 0 9 WITHSCORES   -- Top 10
```

**HyperLogLog — câu hỏi hay trong interview:**

- Đếm số phần tử unique (cardinality) với bộ nhớ cố định ~12KB
- Trade-off: chấp nhận sai số ~0.81% để tiết kiệm memory khổng lồ
- So sánh: dùng Set để đếm 1 tỷ unique IDs → cần hàng GB. HyperLogLog → 12KB.

### Q: Redis persistence — RDB vs AOF, ưu nhược điểm? `[Mid]`

**A:** Redis là in-memory nhưng vẫn cần persistence để tránh mất data khi restart.

**RDB (Redis Database Backup):**

- **Cơ chế**: Snapshot toàn bộ dataset vào file `.rdb` tại các thời điểm (point-in-time snapshot).
- **Trigger**: `SAVE` (blocking), `BGSAVE` (background fork), hoặc tự động theo config (`save 900 1` — save nếu 1 key thay đổi trong 900s).
- **Ưu điểm**: File compact, restore nhanh, tốt cho backup/disaster recovery.
- **Nhược điểm**: Có thể mất data giữa 2 lần snapshot. Fork process tiêu tốn memory (copy-on-write).

**AOF (Append Only File):**

- **Cơ chế**: Ghi lại mọi write command vào log file. Khi restart, replay lại toàn bộ commands.
- **Fsync policies**: `always` (mỗi command — chậm nhất, an toàn nhất), `everysec` (mỗi giây — recommended), `no` (để OS quyết định).
- **Ưu điểm**: Durability tốt hơn (mất tối đa 1 giây data với `everysec`). File dễ đọc.
- **Nhược điểm**: File lớn hơn RDB. Restore chậm hơn. Cần **AOF rewrite** định kỳ để compact.

**So sánh trực tiếp:**

| Tiêu chí          | RDB          | AOF                   |
| ----------------- | ------------ | --------------------- |
| Data loss risk    | Cao (phút)   | Thấp (giây)           |
| File size         | Nhỏ, compact | Lớn hơn               |
| Restore speed     | Nhanh        | Chậm                  |
| Write performance | Ít ảnh hưởng | Ảnh hưởng (tuỳ fsync) |
| Fork overhead     | Có           | Có (khi rewrite)      |

**Best practice**: Dùng **cả hai** — RDB cho backup + AOF cho durability. Redis 7.0 có **RDB-AOF hybrid** (AOF file chứa RDB preamble + AOF tail).

### Q: Redis Pub/Sub hoạt động như thế nào? Hạn chế gì? `[Mid]`

**A:**

**Cơ chế**: Publisher gửi message đến channel, tất cả subscribers đang listen channel đó nhận message **real-time**.

**Đặc điểm quan trọng:**

- **Fire-and-forget**: Nếu subscriber offline → mất message. Không có message persistence.
- **No acknowledgment**: Không biết subscriber đã nhận/xử lý chưa.
- **Pattern subscribe**: `PSUBSCRIBE news.*` — subscribe mọi channel match pattern.

**Hạn chế** (câu hỏi phỏng vấn thường gặp):

- Không có message queue semantics (không retry, không dead letter queue)
- Không scale — mọi subscriber đều nhận tất cả messages
- Subscriber offline = mất message

**Giải pháp**: Dùng **Redis Streams** thay Pub/Sub khi cần reliability. Streams hỗ trợ consumer groups, acknowledgment, persistence — giống Kafka lite.

### Q: Giải thích Lua scripting và Pipelining trong Redis? `[Mid]`

**A:**

**Pipelining:**

- Gửi nhiều commands cùng lúc **không chờ** response từng command.
- Giảm **network round-trip** — thay vì N round-trips → 1 round-trip.
- Lưu ý: **Không phải atomic** — các commands vẫn có thể bị interleave với commands từ client khác.

**Lua Scripting (`EVAL`):**

- Chạy script trên Redis server — **atomic execution** (toàn bộ script chạy không bị interrupt).
- Có thể đọc/ghi nhiều keys trong cùng một atomic operation.
- Use case kinh điển: **distributed lock**, **rate limiting**, bất kỳ logic cần atomic read-then-write.

```lua
-- Rate limiter: atomic increment + expire
local current = redis.call('INCR', KEYS[1])
if current == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
end
if current > tonumber(ARGV[2]) then
    return 0  -- rate limited
end
return 1  -- allowed
```

**So sánh Pipeline vs Lua vs MULTI/EXEC:**

| Feature             | Pipeline       | MULTI/EXEC          | Lua Script           |
| ------------------- | -------------- | ------------------- | -------------------- |
| Atomic              | Không          | Có (isolation)      | Có                   |
| Conditional logic   | Không          | Hạn chế (WATCH)     | Có (full logic)      |
| Network round-trips | 1              | 2+                  | 1                    |
| Use case            | Batch commands | Simple transactions | Complex atomic logic |

### Q: Redis Cluster hoạt động như thế nào? `[Senior]`

**A:** Redis Cluster là giải pháp **horizontal scaling** native của Redis.

**Hash Slots:**

- Toàn bộ keyspace chia thành **16384 hash slots**.
- Mỗi key được map vào slot bằng: `CRC16(key) mod 16384`.
- Mỗi master node quản lý một subset of slots.
- Ví dụ 3 masters: Node A (0-5460), Node B (5461-10922), Node C (10923-16383).

**Replication:**

- Mỗi master có 1+ replica (slave).
- Replication **asynchronous** — có thể mất data khi master fail trước khi sync xong.
- Replica tự động promote thành master khi master fail.

**Failover Process:**

1. Các node liên tục **PING** nhau (gossip protocol).
2. Nếu majority nodes đánh dấu một node là **PFAIL** (possible fail) → chuyển thành **FAIL**.
3. Replica của failed master bắt đầu **election** (Raft-like).
4. Replica được majority vote → promote thành master.
5. Cluster cập nhật slot mapping.

**Hạn chế quan trọng:**

- **Multi-key operations** chỉ hoạt động nếu tất cả keys nằm trên **cùng một slot**. Dùng **hash tags** `{user:1000}.profile` và `{user:1000}.session` để force cùng slot.
- **No strong consistency guarantee** — asynchronous replication.
- Minimum 6 nodes (3 masters + 3 replicas) cho production.

### Q: Redis Sentinel vs Redis Cluster — khác nhau thế nào? `[Mid]`

**A:**

| Tiêu chí              | Sentinel                             | Cluster                           |
| --------------------- | ------------------------------------ | --------------------------------- |
| **Mục đích**          | High Availability (HA)               | HA + Horizontal Scaling           |
| **Data distribution** | Không — toàn bộ data trên 1 master   | Có — data phân tán qua hash slots |
| **Failover**          | Sentinel monitors + promotes replica | Cluster nodes tự vote + promote   |
| **Capacity**          | Giới hạn bởi 1 node memory           | Scale ra nhiều nodes              |
| **Khi nào dùng**      | Data vừa đủ 1 node, cần HA           | Data lớn, cần scale-out           |

**Sentinel**: Chạy 3+ Sentinel processes giám sát master/replica. Khi master fail, Sentinels vote (quorum) để chọn replica promote. Client query Sentinel để biết master hiện tại.

### Q: Giải thích các eviction policies của Redis? `[Mid]`

**A:** Khi Redis đạt `maxmemory`, nó cần quyết định remove key nào.

| Policy              | Mô tả                                            | Scope          |
| ------------------- | ------------------------------------------------ | -------------- |
| **noeviction**      | Trả error cho write commands                     | —              |
| **allkeys-lru**     | Xoá key ít được truy cập nhất (LRU)              | Tất cả keys    |
| **allkeys-lfu**     | Xoá key ít được truy cập thường xuyên nhất (LFU) | Tất cả keys    |
| **allkeys-random**  | Xoá random key                                   | Tất cả keys    |
| **volatile-lru**    | LRU chỉ trên keys có TTL                         | Keys có expire |
| **volatile-lfu**    | LFU chỉ trên keys có TTL                         | Keys có expire |
| **volatile-ttl**    | Xoá key có TTL ngắn nhất                         | Keys có expire |
| **volatile-random** | Random trong keys có TTL                         | Keys có expire |

**LRU vs LFU:**

- **LRU (Least Recently Used)**: Key nào **lâu nhất** chưa được truy cập → xoá. Redis dùng **approximate LRU** (sampling) — không phải exact LRU (tiết kiệm memory).
- **LFU (Least Frequently Used)**: Key nào được truy cập **ít lần nhất** → xoá. Tốt hơn LRU cho workloads có "hot keys" — tránh xoá keys hot nhưng tạm thời không được truy cập.

**Recommendation**: `allkeys-lfu` tốt nhất cho cache use case. `noeviction` cho use case cần giữ toàn bộ data.

### Q: Các use case phổ biến của Redis trong production? `[Mid]`

**A:**

**1. Caching (phổ biến nhất):**

- Cache database query results, API responses, computed data.
- Pattern: Cache-Aside, Write-Through, Write-Behind.
- TTL-based expiration.

**2. Session Store:**

- Lưu user session data (thay vì sticky sessions trên web server).
- Hash type phù hợp: `HSET session:{id} user_id 123 role admin`.

**3. Rate Limiting:**

- Fixed window: `INCR key` + `EXPIRE`.
- Sliding window: Sorted Set với timestamp làm score.
- Token bucket: Lua script.

**4. Leaderboard / Ranking:**

- Sorted Set: `ZADD`, `ZREVRANGE`, `ZRANK`.
- O(log N) operations — hiệu quả với millions of entries.

**5. Distributed Lock (Redlock):**

- `SET key value NX PX 30000` — set if not exists, with expiry.
- **Redlock algorithm**: Lock trên N/2+1 nodes (quorum).
- **Controversial**: Martin Kleppmann chỉ ra nhiều edge cases (clock drift, GC pauses). Nên dùng ZooKeeper/etcd cho strong locking.

**6. Message Queue (Streams):**

- Producer: `XADD stream * field value`
- Consumer Groups: multiple consumers, acknowledgment, pending entries list.

**7. Real-time Analytics:**

- HyperLogLog cho unique counting.
- Bitmap cho daily active users.
- Sorted Set cho time-series aggregation.

### Q: Memory optimization techniques cho Redis? `[Senior]`

**A:**

1. **Chọn data structure phù hợp**: Hash tiết kiệm hơn nhiều String riêng lẻ cho object storage (nhờ ziplist encoding khi nhỏ).
2. **Hash max-ziplist-entries**: Tuning threshold để Redis dùng ziplist (compact) thay vì hashtable.
3. **Key naming convention**: Ngắn gọn nhưng có ý nghĩa. `u:1000:s` thay vì `user:1000:session`.
4. **Sử dụng TTL**: Đặt expire cho mọi cache key.
5. **Compression**: Compress value phía application trước khi lưu (snappy, lz4).
6. **Object sharing**: Redis chia sẻ integers 0-9999 (shared objects pool).
7. **Monitoring**: `INFO memory`, `MEMORY USAGE key`, `MEMORY DOCTOR`.

---

## 3. MongoDB

### Q: MongoDB data model — Document Model là gì? `[Junior]`

**A:** MongoDB lưu data dưới dạng **documents** — cấu trúc dữ liệu linh hoạt (flexible schema).

**Khái niệm cốt lõi:**

- **Document**: JSON-like object (thực tế lưu dưới dạng **BSON** — Binary JSON).
- **Collection**: Nhóm các documents (tương tự table trong SQL, nhưng không bắt buộc cùng schema).
- **Database**: Nhóm các collections.

**BSON vs JSON:**

- BSON hỗ trợ thêm data types: `Date`, `ObjectId`, `Decimal128`, `Binary`, `int32/int64`.
- BSON cho phép **traversal** nhanh hơn (length-prefixed).
- BSON compact hơn cho numeric data, nhưng có thể lớn hơn cho string-heavy data (do length prefix).

**Document design philosophy:**

- **Embedding** (denormalization): Nhúng related data vào cùng document. Tốt cho data được đọc cùng nhau.
- **Referencing** (normalization): Lưu reference (ObjectId) đến document khác. Tốt cho many-to-many, dữ liệu hay thay đổi.

**Nguyên tắc**: "Data that is accessed together should be stored together." Tối ưu cho **read pattern** thay vì normalize.

### Q: Các loại index trong MongoDB? `[Mid]`

**A:**

| Index Type       | Mô tả                                            | Use Case                              |
| ---------------- | ------------------------------------------------ | ------------------------------------- |
| **Single Field** | Index trên 1 field                               | Queries filter/sort trên 1 field      |
| **Compound**     | Index trên nhiều fields (thứ tự quan trọng)      | Queries filter/sort trên nhiều fields |
| **Multikey**     | Tự động tạo cho array fields — index mỗi element | Querying array elements               |
| **Text**         | Full-text search (tokenize, stemming)            | Search trong text content             |
| **Geospatial**   | 2d, 2dsphere — geographic queries                | Near, within, intersects              |
| **Hashed**       | Hash value of field                              | Equality queries, shard key           |
| **Wildcard**     | Index trên dynamic/unknown field paths           | Schemaless queries                    |
| **TTL**          | Tự động delete documents sau thời gian           | Session, temp data expiration         |

**Compound Index — ESR Rule (Equality, Sort, Range):**

- Đặt **Equality** fields trước, rồi **Sort**, rồi **Range** fields.
- Ví dụ: query `{ status: "active", createdAt: { $gte: date } }` sort by `name` → Index: `{ status: 1, name: 1, createdAt: 1 }`.

**Index Intersection**: MongoDB có thể kết hợp 2+ single-field indexes, nhưng **compound index thường hiệu quả hơn**.

**Covered Query**: Khi tất cả fields cần thiết đều nằm trong index → MongoDB trả kết quả **không cần đọc document**. Cực kỳ nhanh.

### Q: Aggregation Pipeline trong MongoDB hoạt động thế nào? `[Mid]`

**A:** Aggregation Pipeline là framework cho data processing — documents đi qua các **stages** tuần tự, mỗi stage transform data.

**Các stage phổ biến:**

| Stage              | Chức năng                                    | SQL Equivalent |
| ------------------ | -------------------------------------------- | -------------- |
| `$match`           | Filter documents                             | WHERE          |
| `$group`           | Group + aggregate                            | GROUP BY       |
| `$project`         | Reshape document (select/compute fields)     | SELECT         |
| `$sort`            | Sắp xếp                                      | ORDER BY       |
| `$limit` / `$skip` | Pagination                                   | LIMIT / OFFSET |
| `$lookup`          | Left outer join với collection khác          | LEFT JOIN      |
| `$unwind`          | Deconstruct array → 1 document per element   | —              |
| `$facet`           | Multiple pipelines song song trên cùng input | —              |
| `$bucket`          | Group theo range                             | —              |

**Optimization tips:**

- Đặt `$match` **đầu tiên** để tận dụng index và giảm data đi qua pipeline.
- `$match` + `$sort` đầu pipeline có thể dùng index.
- Pipeline optimizer tự động reorder stages khi có thể (ví dụ: di chuyển `$match` lên trước `$project`).

### Q: MongoDB Sharding — cách hoạt động và chọn shard key? `[Senior]`

**A:**

**Architecture:**

- **Shard**: Mỗi shard là một replica set chứa subset of data.
- **Config Servers**: Lưu metadata — mapping giữa chunks và shards.
- **mongos**: Query router — client nói chuyện với mongos, mongos route đến đúng shard(s).

**Shard Key**: Field (hoặc compound fields) quyết định data phân bố trên các shards. **Chọn sai shard key = thảm hoạ performance** — và **không thể thay đổi** dễ dàng (từ MongoDB 5.0 có thể reshard nhưng rất tốn kém).

**Tiêu chí chọn shard key:**

1. **High cardinality**: Nhiều distinct values → data phân bố đều. Tránh boolean hay enum ít giá trị.
2. **Low frequency**: Không có giá trị nào xuất hiện quá thường xuyên → tránh "jumbo chunks".
3. **Non-monotonic**: Tránh fields tăng đều (ObjectId, timestamp) → tất cả writes đổ vào shard cuối (**hot shard**). Dùng hashed shard key nếu cần.
4. **Query isolation**: Shard key nên có trong hầu hết queries → mongos route đến 1 shard thay vì scatter-gather tất cả shards.

**Ví dụ thực tế**: Hệ thống multi-tenant — `{ tenant_id: 1, created_at: 1 }` là compound shard key tốt: queries thường filter theo tenant, data phân bố đều.

### Q: Replication trong MongoDB — Replica Set và Oplog? `[Mid]`

**A:**

**Replica Set:**

- Gồm 1 **Primary** (nhận writes) + N **Secondaries** (replicate từ primary).
- Tối thiểu 3 members (hoặc 2 + 1 arbiter) để có majority cho election.
- Khi primary fail → **automatic election** — secondary với oplog mới nhất thường thắng.

**Oplog (Operations Log):**

- **Capped collection** trên primary — ghi lại mọi write operations.
- Secondaries **tail** oplog liên tục để replicate.
- Idempotent — replay nhiều lần cho kết quả giống nhau.
- **Oplog window**: Thời gian từ entry cũ nhất đến mới nhất. Nếu secondary offline lâu hơn window → cần **full resync**.

### Q: Read Concern và Write Concern trong MongoDB là gì? `[Senior]`

**A:** Đây là cơ chế **tunable consistency** — cho phép trade-off giữa consistency và performance.

**Write Concern** — "Bao nhiêu nodes phải xác nhận write trước khi trả success?"

| Level           | Ý nghĩa                    | Trade-off                                        |
| --------------- | -------------------------- | ------------------------------------------------ |
| `w: 0`          | Không chờ acknowledgment   | Nhanh nhất, rủi ro cao nhất                      |
| `w: 1`          | Primary xác nhận (default) | Có thể mất data nếu primary fail trước replicate |
| `w: "majority"` | Majority members xác nhận  | An toàn, chậm hơn                                |
| `j: true`       | Chờ ghi vào journal (WAL)  | Đảm bảo durability                               |

**Read Concern** — "Tôi đọc data ở mức consistency nào?"

| Level          | Ý nghĩa                                                          |
| -------------- | ---------------------------------------------------------------- |
| `local`        | Đọc data mới nhất trên node (có thể bị rollback)                 |
| `available`    | Như local, dùng cho sharded clusters                             |
| `majority`     | Đọc data đã được majority xác nhận (durable)                     |
| `linearizable` | Đọc data mới nhất đã commit — **strong consistency** (chậm nhất) |
| `snapshot`     | Đọc data tại point-in-time snapshot (dùng trong transactions)    |

**Combination phổ biến**: `w: "majority"` + `readConcern: "majority"` = **causal consistency** — đọc luôn thấy writes đã committed.

### Q: MongoDB Transactions — hoạt động thế nào? `[Mid]`

**A:**

- Từ **MongoDB 4.0**: Multi-document transactions trên single replica set.
- Từ **MongoDB 4.2**: Distributed transactions across shards.

**Đặc điểm:**

- ACID transactions với **snapshot isolation**.
- Default timeout: 60 seconds — transactions dài sẽ bị abort.
- **Performance impact**: Transactions giữ locks, tạo oplog entries lớn hơn. Nên giữ transactions ngắn.

**Best practice**: Design data model để **tránh** cần transactions khi có thể — embedding related data trong 1 document tận dụng atomic single-document writes.

### Q: Khi nào nên (và không nên) dùng MongoDB? `[Mid]`

**A:**

**Nên dùng:**

- Content management, catalog, user profiles (schema linh hoạt)
- Real-time analytics, IoT data (write-heavy)
- Mobile/web apps cần phát triển nhanh (schema evolution)
- Geospatial applications
- Document-centric data (nested, hierarchical)

**Không nên dùng:**

- Cần complex multi-table joins thường xuyên
- Financial systems cần strong transactions (prefer SQL)
- Highly relational data (graph → Neo4j, relational → PostgreSQL)
- Small dataset không cần scale → SQL đơn giản hơn

---

## 4. Elasticsearch

### Q: Inverted Index trong Elasticsearch hoạt động thế nào? `[Mid]`

**A:** Inverted Index là cấu trúc dữ liệu cốt lõi cho full-text search.

**Cơ chế:**

- Bình thường (forward index): Document → Terms (có những words nào trong doc này?)
- **Inverted**: Term → Documents (term này xuất hiện trong docs nào?)

**Ví dụ:**

```
Doc 1: "Redis is fast"
Doc 2: "MongoDB is scalable"
Doc 3: "Redis is scalable and fast"

Inverted Index:
"redis"     → [Doc 1, Doc 3]
"fast"      → [Doc 1, Doc 3]
"mongodb"   → [Doc 2]
"scalable"  → [Doc 2, Doc 3]
"is"        → [Doc 1, Doc 2, Doc 3]
```

Khi search "redis fast" → tìm intersection/union của posting lists → Doc 1, Doc 3. Rất nhanh vì chỉ cần **lookup + merge lists**.

### Q: Mapping và Analyzers trong Elasticsearch? `[Mid]`

**A:**

**Mapping**: Định nghĩa schema cho index — field types và cách index chúng.

- **Dynamic mapping**: ES tự đoán type — tiện nhưng có thể sai.
- **Explicit mapping**: Define cụ thể — recommended cho production.
- Field types: `text` (analyzed, full-text search), `keyword` (exact match, aggregation), `date`, `integer`, `nested`, `geo_point`...

**Analyzer** — Pipeline xử lý text trước khi đưa vào inverted index:

```
Input text → Character Filters → Tokenizer → Token Filters → Terms
```

| Component            | Ví dụ                    | Chức năng              |
| -------------------- | ------------------------ | ---------------------- |
| **Character Filter** | html_strip               | Loại bỏ HTML tags      |
| **Tokenizer**        | standard, whitespace     | Tách text thành tokens |
| **Token Filter**     | lowercase, stemmer, stop | Transform tokens       |

**Ví dụ**: Text "Running Quickly" qua standard analyzer → ["running", "quickly"] (lowercase + tokenize).

**Quan trọng**: `text` fields được analyzed (qua analyzer pipeline). `keyword` fields **không** analyzed — lưu nguyên (exact match, sorting, aggregation).

### Q: Query DSL — các loại query quan trọng? `[Mid]`

**A:**

**Full-text queries** (analyzed, dùng cho `text` fields):

| Query          | Mô tả                                               |
| -------------- | --------------------------------------------------- |
| `match`        | Standard full-text query — analyze input rồi search |
| `match_phrase` | Tìm chính xác phrase (đúng thứ tự, liền kề)         |
| `multi_match`  | Match trên nhiều fields                             |

**Term-level queries** (exact match, dùng cho `keyword`/numeric fields):

| Query    | Mô tả                                  |
| -------- | -------------------------------------- |
| `term`   | Exact match (KHÔNG analyze input)      |
| `range`  | Range query (`gte`, `lte`, `gt`, `lt`) |
| `exists` | Field có tồn tại không                 |

**Compound queries:**

| Query  | Mô tả                                                                                      |
| ------ | ------------------------------------------------------------------------------------------ |
| `bool` | Kết hợp queries: `must` (AND), `should` (OR), `must_not` (NOT), `filter` (AND, no scoring) |

**Lưu ý phỏng vấn**: `filter` context vs `query` context:

- **Query context**: Tính relevance score (tốn CPU hơn).
- **Filter context**: Chỉ yes/no, không tính score → **nhanh hơn** + **cacheable**.

### Q: Relevance scoring — TF-IDF và BM25? `[Senior]`

**A:**

**TF-IDF** (cũ, ES < 5.0):

- **TF (Term Frequency)**: Term xuất hiện nhiều lần trong document → score cao.
- **IDF (Inverse Document Frequency)**: Term hiếm trong toàn index → weight cao hơn (term "the" xuất hiện khắp nơi → weight thấp).
- Score = TF × IDF.

**BM25** (default từ ES 5.0+) — cải tiến TF-IDF:

- **Saturation**: TF tăng dần bão hoà (diminishing returns) — term xuất hiện 10 lần không gấp đôi score so với 5 lần. Controlled by parameter `k1`.
- **Field length normalization**: Documents ngắn hơn được boost (cùng 3 lần xuất hiện trong doc 100 từ vs doc 10000 từ). Controlled by parameter `b`.
- Thực tế, BM25 cho kết quả tốt hơn TF-IDF trong hầu hết trường hợp.

### Q: Sharding và Replication trong Elasticsearch? `[Mid]`

**A:**

**Sharding:**

- Mỗi index chia thành N **primary shards** (default: 1 từ ES 7.0).
- Mỗi shard là một **Lucene index** độc lập.
- **Không thể thay đổi** số primary shards sau khi tạo index (cần reindex).
- Queries chạy **parallel** trên tất cả shards → scatter-gather.

**Replication:**

- Mỗi primary shard có N **replica shards** (default: 1).
- Replicas phục vụ **read requests** → tăng throughput.
- Replicas trên **nodes khác** primary → fault tolerance.

**Near Real-Time (NRT) Search:**

- Documents mới **không thể search ngay** — cần đợi **refresh** (default: mỗi 1 giây).
- Refresh tạo new Lucene segment từ in-memory buffer.
- Đây là lý do gọi "near" real-time — delay ~1 second.

### Q: Khi nào nên dùng Elasticsearch? `[Mid]`

**A:**

**Nên dùng:**

- Full-text search với relevance scoring
- Log aggregation và analytics (ELK stack)
- Autocomplete, suggestion, fuzzy search
- Geospatial search
- Real-time analytics dashboards

**Không nên dùng:**

- Primary database (không có ACID, eventual consistency)
- Frequent updates (update = delete + reindex — expensive)
- Strong consistency requirements
- Simple key-value lookups (dùng Redis)

---

## 5. Cassandra

### Q: Cassandra data model — Wide-Column là gì? `[Mid]`

**A:** Cassandra là **distributed wide-column store** — thiết kế cho write-heavy workloads ở massive scale.

**Khái niệm:**

- **Keyspace**: Tương tự database — chứa tables, define replication strategy.
- **Table**: Có schema (khác MongoDB), nhưng mỗi row có thể có columns khác nhau.
- **Partition Key**: Quyết định data nằm trên node nào (hash → token ring).
- **Clustering Key**: Quyết định thứ tự sắp xếp **trong** partition.
- **Primary Key = Partition Key + Clustering Key(s)**.

**Ví dụ:**

```sql
CREATE TABLE messages (
    chat_id UUID,         -- Partition Key
    sent_at TIMESTAMP,    -- Clustering Key (sorted)
    sender TEXT,
    content TEXT,
    PRIMARY KEY (chat_id, sent_at)
);
```

Tất cả messages cùng `chat_id` → cùng partition → cùng node. Trong partition, sort theo `sent_at`. Query `SELECT * FROM messages WHERE chat_id = ? AND sent_at > ?` cực nhanh — single partition read, sequential scan.

### Q: Partition Key vs Clustering Key — tại sao quan trọng? `[Senior]`

**A:**

**Partition Key:**

- Hash value quyết định **node** lưu data.
- **Phải** xuất hiện trong WHERE clause (trừ khi dùng ALLOW FILTERING — anti-pattern).
- Chọn sai partition key → **hot partition** (1 partition quá lớn hoặc traffic quá cao).
- Rule of thumb: Mỗi partition nên < 100MB, < 100K rows.

**Clustering Key:**

- Quyết định **thứ tự** rows trong partition (disk layout).
- Cho phép **range queries** hiệu quả trong partition.
- Có thể có nhiều clustering keys → nested sort.

**Data modeling principle trong Cassandra**: **Query-first design** — thiết kế table cho từng query pattern. 1 query = 1 table (denormalized). Ngược hoàn toàn với SQL (data-first → normalize rồi mới query).

### Q: Consistency Levels trong Cassandra? `[Mid]`

**A:** Cassandra cho phép **tunable consistency** per-query:

| Level                | Write: ghi bao nhiêu nodes?          | Read: đọc bao nhiêu nodes? |
| -------------------- | ------------------------------------ | -------------------------- |
| **ONE**              | 1 node                               | 1 node                     |
| **QUORUM**           | ⌊N/2⌋ + 1 nodes                      | ⌊N/2⌋ + 1 nodes            |
| **LOCAL_QUORUM**     | Quorum trong local datacenter        | Quorum trong local DC      |
| **ALL**              | Tất cả replicas                      | Tất cả replicas            |
| **ANY** (write only) | 1 node bất kỳ (kể cả hinted handoff) | —                          |

**Strong consistency formula**: `R + W > N` (R = read CL, W = write CL, N = replication factor).

- Phổ biến: Write QUORUM + Read QUORUM → strong consistency.
- Trade-off: CL cao → latency cao, availability thấp hơn.

### Q: Tombstones trong Cassandra — vấn đề gì? `[Senior]`

**A:** Cassandra **không xóa data ngay** khi DELETE — thay vào đó tạo **tombstone** (marker đánh dấu "đã xóa").

**Tại sao?** Vì distributed system — nếu xóa ngay trên 1 node, nodes khác không biết → data "sống lại" khi repair/sync.

**Vấn đề:**

- Tombstones tích tụ → **read performance giảm** (phải scan qua tombstones).
- Tombstones bị dọn khi **compaction** (sau `gc_grace_seconds`, default 10 days).
- Anti-pattern: DELETE/INSERT thường xuyên trên cùng partition → tombstone explosion.

**Compaction Strategies:**

| Strategy               | Mô tả                                   | Best for         |
| ---------------------- | --------------------------------------- | ---------------- |
| **STCS** (Size-Tiered) | Merge SSTables cùng size                | Write-heavy      |
| **LCS** (Leveled)      | Organize vào levels, mỗi level 10x size | Read-heavy       |
| **TWCS** (Time-Window) | Group SSTables theo time window         | Time-series data |

### Q: Khi nào dùng Cassandra? `[Mid]`

**A:**

**Nên dùng:**

- Write-heavy workloads (IoT, event logging, metrics) — write performance gần linear scale
- Time-series data
- Multi-datacenter/multi-region deployments (native support)
- Massive scale (hundreds of TB, millions ops/sec)
- Cần high availability (AP system — tunable)

**Không nên dùng:**

- Ad-hoc queries, complex aggregations
- Small dataset (overhead lớn)
- Cần transactions, joins
- Read-heavy với random access patterns

---

## 6. Time-Series Databases

### Q: Time-Series Database là gì và tại sao cần DB riêng? `[Mid]`

**A:** Time-series data: data points indexed theo thời gian — metrics, IoT sensor readings, financial ticks, logs.

**Tại sao RDBMS không tốt cho time-series:**

- Write volume cực lớn, liên tục (millions data points/sec)
- Data chủ yếu **append-only** — ít update/delete
- Queries hầu hết là **range scan theo thời gian** + aggregation
- Old data cần **downsampling** và **auto-deletion** (retention policies)
- Cần compression đặc biệt cho time-series patterns

### Q: InfluxDB vs TimescaleDB? `[Mid]`

**A:**

**InfluxDB:**

- Purpose-built time-series database.
- **TSM (Time-Structured Merge) engine** — optimized cho time-series writes.
- Custom query language: **Flux** (InfluxDB 2.x) hoặc **InfluxQL** (SQL-like).
- Native concepts: **measurement** (table), **tags** (indexed metadata), **fields** (values), **timestamp**.
- **Retention policies**: Tự động xoá data cũ.
- **Continuous queries / Tasks**: Tự động downsampling.
- Best for: Metrics monitoring, IoT, real-time analytics.

**TimescaleDB:**

- **Extension of PostgreSQL** — full SQL support.
- **Hypertables**: Tự động partition data theo time (chunks).
- Lợi thế: Dùng toàn bộ PostgreSQL ecosystem (joins, indexes, tools, extensions).
- **Compression**: 90-95% compression cho time-series data.
- **Continuous Aggregates**: Materialized views tự động refresh.
- Best for: Khi cần SQL + time-series, khi team đã dùng PostgreSQL, khi cần join time-series với relational data.

| Tiêu chí       | InfluxDB        | TimescaleDB             |
| -------------- | --------------- | ----------------------- |
| Foundation     | Custom engine   | PostgreSQL extension    |
| Query language | Flux / InfluxQL | Standard SQL            |
| Joins          | Không           | Có (full SQL)           |
| Ecosystem      | Riêng           | PostgreSQL ecosystem    |
| Learning curve | Mới             | Quen thuộc nếu biết SQL |
| Compression    | Tốt             | Rất tốt (columnar)      |

---

## 7. Graph Databases

### Q: Graph Database là gì? Khi nào cần? `[Mid]`

**A:**

**Mô hình:**

- **Nodes** (entities): Người, sản phẩm, địa điểm...
- **Edges** (relationships): FOLLOWS, PURCHASED, LOCATED_IN...
- **Properties**: Key-value pairs trên cả nodes và edges.

**Tại sao không dùng SQL cho graph data?**

- SQL cần **recursive JOINs** cho traversals — O(n^k) với k levels deep.
- Graph DB dùng **index-free adjacency** — mỗi node có pointer trực tiếp đến neighbors → O(1) per hop.
- Query "bạn của bạn của bạn" (3 hops) trong graph DB: milliseconds. Trong SQL với millions rows: có thể vài phút.

### Q: Neo4j và Cypher query language? `[Mid]`

**A:**

**Neo4j** là graph database phổ biến nhất.

**Cypher** — declarative query language cho graphs:

```cypher
-- Tìm bạn chung giữa Alice và Bob
MATCH (a:Person {name: "Alice"})-[:FRIEND]->(mutual)<-[:FRIEND]-(b:Person {name: "Bob"})
RETURN mutual.name

-- Shortest path
MATCH p = shortestPath(
  (a:Person {name: "Alice"})-[:FRIEND*..6]-(b:Person {name: "Bob"})
)
RETURN p
```

**Concepts:**

- **Labels**: Categorize nodes (`:Person`, `:Product`).
- **Relationship types**: `:FRIEND`, `:PURCHASED` — luôn có direction.
- **Pattern matching**: Core concept — describe graph pattern, Neo4j finds matches.

### Q: Khi nào dùng Graph Database? `[Mid]`

**A:**

**Nên dùng:**

- Social networks (friends, followers, recommendations)
- Fraud detection (tìm patterns bất thường trong relationships)
- Knowledge graphs
- Network/IT infrastructure mapping
- Recommendation engines ("người mua X cũng mua Y")
- Access control (complex permission hierarchies)

**Không nên dùng:**

- Data không có relationships phức tạp
- Bulk analytics, aggregation trên toàn bộ dataset
- Simple CRUD operations
- Write-heavy workloads (graph DB thường read-optimized)

---

## 8. NoSQL Decision Matrix & Comparison

### Bảng So Sánh Tổng Hợp

| Tiêu chí        | Redis                     | MongoDB              | Elasticsearch          | Cassandra                 | InfluxDB            | Neo4j                     |
| --------------- | ------------------------- | -------------------- | ---------------------- | ------------------------- | ------------------- | ------------------------- |
| **Type**        | Key-Value / Multi-model   | Document             | Search Engine          | Wide-Column               | Time-Series         | Graph                     |
| **CAP**         | CP                        | CP                   | AP (tunable)           | AP (tunable)              | CP                  | CA (single), CP (cluster) |
| **Schema**      | Schemaless                | Flexible             | Mapping-based          | Fixed (CQL)               | Tag-based           | Label + Property          |
| **Scaling**     | Cluster (hash slots)      | Sharding             | Sharding               | Peer-to-peer ring         | Clustering          | Causal clustering         |
| **Consistency** | Strong (single)           | Tunable              | Eventual               | Tunable                   | Strong (single)     | ACID                      |
| **Best Write**  | ~100K ops/s               | ~50K ops/s           | ~10K docs/s            | ~100K+ ops/s              | ~500K points/s      | ~10K ops/s                |
| **Latency**     | Sub-ms                    | Low ms               | ~10ms                  | Low ms                    | Low ms              | Varies by traversal       |
| **Persistence** | RDB + AOF                 | WiredTiger (B-tree)  | Lucene segments        | SSTables (LSM-tree)       | TSM engine          | Native store              |
| **Best For**    | Cache, session, real-time | General purpose, CMS | Full-text search, logs | IoT, metrics, time-series | Monitoring, metrics | Social, fraud, knowledge  |

### NoSQL Decision Flowchart

```
Bạn cần gì?
│
├── Cache / Session / Real-time counters?
│   └── → Redis
│
├── Full-text search / Log analytics?
│   └── → Elasticsearch
│
├── Flexible schema + General purpose?
│   └── → MongoDB
│
├── Massive write throughput + Time-series?
│   ├── Cần SQL?
│   │   └── → TimescaleDB
│   ├── Cần multi-DC?
│   │   └── → Cassandra
│   └── Pure metrics/monitoring?
│       └── → InfluxDB
│
├── Complex relationships + Graph traversal?
│   └── → Neo4j
│
└── Cần ACID + Complex queries + Joins?
    └── → PostgreSQL / MySQL (SQL)
```

---

## 9. Interview Questions Tổng Hợp

### Câu hỏi lý thuyết `[Junior → Senior]`

**Q1 [Junior]:** Redis là single-threaded, vậy tại sao nó vẫn nhanh hơn nhiều database khác?

> **Key points**: In-memory, I/O multiplexing (epoll), efficient data structures, no context switching, no lock overhead. Bottleneck là network không phải CPU.

**Q2 [Junior]:** Sự khác biệt giữa Redis và Memcached?

> **Key points**: Redis có rich data structures (không chỉ string), persistence (RDB/AOF), replication, pub/sub, Lua scripting, cluster mode. Memcached đơn giản hơn, multi-threaded, chỉ key-value string, không persistence. Memcached tốt hơn cho simple caching với nhiều cores; Redis tốt hơn cho mọi thứ khác.

**Q3 [Mid]:** Giải thích cache stampede (thundering herd) và cách giải quyết?

> **Key points**: Nhiều requests cùng lúc miss cache → tất cả đổ về DB. Giải pháp: (1) **Mutex/Lock** — chỉ 1 request rebuild cache, (2) **Stale-while-revalidate** — serve stale data + async refresh, (3) **Probabilistic early expiration** — random refresh trước khi TTL hết.

**Q4 [Mid]:** MongoDB dùng WiredTiger engine — nó khác gì engine cũ (MMAPv1)?

> **Key points**: WiredTiger hỗ trợ **document-level locking** (MMAPv1: collection-level), **compression** (snappy/zlib/zstd), **concurrent reads/writes** tốt hơn nhiều. WiredTiger dùng B-tree + write-ahead log (journal).

**Q5 [Mid]:** Tại sao không nên dùng Elasticsearch làm primary database?

> **Key points**: Eventual consistency (NRT delay ~1s), no ACID transactions, update = delete + reindex (expensive), no relational integrity, designed for search not OLTP, có thể mất data nếu cấu hình sai.

**Q6 [Senior]:** Giải thích Redlock algorithm và controversy xung quanh nó?

> **Key points**: Redlock (Salvatore Sanfilippo) — acquire lock trên N independent Redis nodes, thành công nếu lock N/2+1 nodes trong time limit. Martin Kleppmann argue: (1) clock drift giữa nodes, (2) GC pauses khiến lock hết hạn mà client không biết, (3) network delays. Kleppmann recommend dùng **fencing tokens** hoặc consensus-based systems (ZooKeeper, etcd) cho correctness-critical locking.

**Q7 [Senior]:** So sánh LSM-tree (Cassandra, RocksDB) vs B-tree (PostgreSQL, MongoDB/WiredTiger)?

> **Key points**:
>
> - **LSM-tree**: Writes → memtable (memory) → flush to sorted SSTables (disk). **Write-optimized** (sequential writes). Reads cần check multiple SSTables → **read amplification**. Compaction giảm read amplification nhưng gây **write amplification**.
> - **B-tree**: In-place updates trên disk pages. **Read-optimized** (single lookup path). Writes cần random I/O → chậm hơn LSM cho write-heavy.
> - Trade-off: LSM tốt cho write-heavy, B-tree tốt cho read-heavy balanced workloads.

**Q8 [Senior]:** Design caching strategy cho hệ thống e-commerce lớn — bạn sẽ dùng gì?

> **Key points**: Multi-layer caching:
>
> - **L1**: Application-level cache (local, in-process) — product catalog
> - **L2**: Redis cluster — session, cart, user data, rate limiting
> - **L3**: CDN — static assets, product images
> - Strategy: Cache-aside cho reads, write-through cho critical data, event-driven invalidation (pub/sub hoặc CDC)
> - Xử lý: Cache stampede (mutex), cache penetration (bloom filter), cache avalanche (jittered TTL)

**Q9 [Senior]:** Khi nào bạn chọn Cassandra thay vì MongoDB, và ngược lại?

> | Tiêu chí          | Chọn Cassandra                | Chọn MongoDB                 |
> | ----------------- | ----------------------------- | ---------------------------- |
> | Write pattern     | Write-heavy, append-mostly    | Read-heavy, mixed read-write |
> | Query flexibility | Biết trước query patterns     | Cần ad-hoc queries           |
> | Consistency       | Tunable, thường eventual      | Tunable, thường strong       |
> | Scale             | Linear scale, multi-DC native | Sharding manual hơn          |
> | Data model        | Denormalized, query-first     | Document, flexible schema    |
> | Secondary indexes | Hạn chế, anti-pattern         | Mạnh, nhiều loại index       |
> | Aggregation       | Hạn chế (dùng Spark)          | Aggregation pipeline mạnh    |

**Q10 [Senior]:** Hệ thống logging/monitoring lớn — bạn thiết kế storage stack như thế nào?

> **Key points**:
>
> - **Hot tier** (1-7 days): Elasticsearch — search + dashboards
> - **Warm tier** (7-30 days): Elasticsearch (fewer replicas, slower nodes)
> - **Cold tier** (30-90 days): Object storage (S3) + query engine (Athena/Presto)
> - **Metrics**: InfluxDB/Prometheus → Grafana
> - **Ingest pipeline**: Kafka → Logstash/Vector → Elasticsearch + InfluxDB
> - Retention policies tự động xoá data cũ ở mỗi tier

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────┐
│              NoSQL CHEAT SHEET                       │
├─────────────────────────────────────────────────────┤
│ Redis                                               │
│  • 16384 hash slots (Cluster)                       │
│  • Persistence: RDB (snapshot) + AOF (log)          │
│  • Eviction: allkeys-lfu recommended for cache      │
│  • Pub/Sub = fire-and-forget, Streams = persistent  │
│  • Lua = atomic, Pipeline = batch (not atomic)      │
├─────────────────────────────────────────────────────┤
│ MongoDB                                             │
│  • BSON documents, flexible schema                  │
│  • Compound Index: ESR rule (Equality-Sort-Range)   │
│  • Shard key: high cardinality + query isolation    │
│  • Write Concern majority + Read Concern majority   │
│    = causal consistency                             │
│  • WiredTiger: document-level locking, compression  │
├─────────────────────────────────────────────────────┤
│ Elasticsearch                                       │
│  • Inverted index → full-text search                │
│  • BM25 scoring (improved TF-IDF)                   │
│  • NRT: ~1 second refresh delay                     │
│  • Filter context = cacheable, no scoring           │
│  • NOT a primary database                           │
├─────────────────────────────────────────────────────┤
│ Cassandra                                           │
│  • Partition Key → node, Clustering Key → sort      │
│  • R + W > N = strong consistency                   │
│  • Tombstones: don't delete frequently              │
│  • Query-first data modeling                        │
│  • LSM-tree: write-optimized                        │
├─────────────────────────────────────────────────────┤
│ CAP Reality                                         │
│  • P is mandatory in distributed systems            │
│  • Real choice: CP vs AP                            │
│  • Most modern DBs: tunable consistency             │
│  • PACELC: when no partition → Latency vs Consistency│
└─────────────────────────────────────────────────────┘
```

---

_Tài liệu tham khảo: Redis documentation, MongoDB University, Elasticsearch: The Definitive Guide, Designing Data-Intensive Applications (Martin Kleppmann), Apache Cassandra documentation._

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                             | Difficulty | Core Concept    | Key Signal                                         |
| --- | ------------------------------------ | ---------- | --------------- | -------------------------------------------------- |
| 1   | SQL vs NoSQL khác nhau cơ bản?       | 🟢 Junior  | SQL vs NoSQL    | Data model + schema + scaling trade-offs           |
| 2   | CAP Theorem ảnh hưởng chọn NoSQL?    | 🟡 Mid     | SQL vs NoSQL    | CP vs AP + PACELC extension                        |
| 3   | Khi nào chọn SQL, khi nào NoSQL?     | 🟡 Mid     | SQL vs NoSQL    | Decision matrix + counter-examples                 |
| 4   | Redis là gì, tại sao nhanh?          | 🟢 Junior  | Redis           | In-memory + epoll + single-thread + no locks       |
| 5   | Redis data types chi tiết?           | 🟡 Mid     | Redis           | 5 core types + use cases + internal encoding       |
| 6   | Redis persistence RDB vs AOF?        | 🟡 Mid     | Redis           | RDB snapshot vs AOF log + hybrid recommended       |
| 7   | Redis Pub/Sub hoạt động?             | 🟡 Mid     | Redis           | Fire-and-forget vs Streams persistent              |
| 8   | Lua scripting vs Pipelining?         | 🟡 Mid     | Redis           | Lua atomic vs Pipeline batch (not atomic)          |
| 9   | Redis Cluster hoạt động?             | 🔴 Senior  | Redis           | 16384 hash slots + gossip + resharding             |
| 10  | Redis Sentinel vs Cluster?           | 🟡 Mid     | Redis           | HA (Sentinel) vs horizontal scale (Cluster)        |
| 11  | Redis eviction policies?             | 🟡 Mid     | Redis           | allkeys-lfu for cache + maxmemory config           |
| 12  | Redis use cases production?          | 🟡 Mid     | Redis           | Session, cache, rate limit, leaderboard, queue     |
| 13  | Redis memory optimization?           | 🔴 Senior  | Redis           | ziplist, intset, object sharing, key design        |
| 14  | MongoDB Document Model?              | 🟢 Junior  | MongoDB         | BSON + embedding vs referencing + 16MB limit       |
| 15  | MongoDB index types?                 | 🟡 Mid     | MongoDB         | Single, compound (ESR), text, geospatial, TTL      |
| 16  | Aggregation Pipeline?                | 🟡 Mid     | MongoDB         | $match→$group→$sort pipeline stages                |
| 17  | MongoDB Sharding?                    | 🔴 Senior  | MongoDB         | Shard key selection + mongos + config servers      |
| 18  | Replica Set và Oplog?                | 🟡 Mid     | MongoDB         | Primary/Secondary + oplog replication + elections  |
| 19  | Read/Write Concern?                  | 🔴 Senior  | MongoDB         | majority + linearizable = causal consistency       |
| 20  | MongoDB Transactions?                | 🟡 Mid     | MongoDB         | Multi-document ACID since 4.0 + performance cost   |
| 21  | Khi nào dùng MongoDB?                | 🟡 Mid     | MongoDB         | Schema flexibility + read-heavy + known patterns   |
| 22  | ES Inverted Index?                   | 🟡 Mid     | Elasticsearch   | Term → doc IDs mapping + tokenization              |
| 23  | ES Mapping và Analyzers?             | 🟡 Mid     | Elasticsearch   | Analyzer = char filter + tokenizer + token filter  |
| 24  | Query DSL types?                     | 🟡 Mid     | Elasticsearch   | match, term, bool, range + filter vs query context |
| 25  | BM25 scoring?                        | 🔴 Senior  | Elasticsearch   | TF × IDF × field length norm + k1/b params         |
| 26  | ES Sharding/Replication?             | 🟡 Mid     | Elasticsearch   | Primary + replica shards + routing formula         |
| 27  | Khi nào dùng ES?                     | 🟡 Mid     | Elasticsearch   | Full-text search, log analytics, NOT primary DB    |
| 28  | Cassandra Wide-Column?               | 🟡 Mid     | Cassandra       | Row key + column families + LSM-tree               |
| 29  | Partition vs Clustering Key?         | 🔴 Senior  | Cassandra       | Partition = node, Clustering = sort within         |
| 30  | Consistency Levels?                  | 🟡 Mid     | Cassandra       | R+W>N for strong + tunable per query               |
| 31  | Tombstones problem?                  | 🔴 Senior  | Cassandra       | Delete markers + gc_grace_seconds + compaction     |
| 32  | Khi nào dùng Cassandra?              | 🟡 Mid     | Cassandra       | Write-heavy, time-series, multi-DC                 |
| 33  | Time-Series DB là gì?                | 🟡 Mid     | Time-Series     | Compression + retention + downsampling             |
| 34  | InfluxDB vs TimescaleDB?             | 🟡 Mid     | Time-Series     | Custom engine vs PostgreSQL extension              |
| 35  | Graph DB là gì?                      | 🟡 Mid     | Graph           | Nodes + edges + index-free adjacency               |
| 36  | Neo4j và Cypher?                     | 🟡 Mid     | Graph           | Pattern matching + relationship traversal O(1)     |
| 37  | Khi nào dùng Graph?                  | 🟡 Mid     | Graph           | Depth > 2 hops, social, fraud, recommendations     |
| I1  | Redis single-threaded tại sao nhanh? | 🟢 Junior  | Redis           | In-memory + epoll + no context switch              |
| I2  | Redis vs Memcached?                  | 🟢 Junior  | Redis           | Rich types + persistence + cluster vs simple KV    |
| I3  | Cache stampede giải quyết?           | 🟡 Mid     | Redis           | Mutex + stale-while-revalidate + probabilistic     |
| I4  | WiredTiger vs MMAPv1?                | 🟡 Mid     | MongoDB         | Doc-level lock + compression + concurrent RW       |
| I5  | ES không dùng primary DB?            | 🟡 Mid     | Elasticsearch   | No ACID, NRT delay, update expensive               |
| I6  | Redlock controversy?                 | 🔴 Senior  | Redis           | Kleppmann: clock drift + GC pause + fencing tokens |
| I7  | LSM-tree vs B-tree?                  | 🔴 Senior  | Cassandra       | Write-optimized vs read-optimized                  |
| I8  | E-commerce caching strategy?         | 🔴 Senior  | Decision Matrix | L1 local → L2 Redis → L3 CDN + invalidation        |
| I9  | Cassandra vs MongoDB?                | 🔴 Senior  | Decision Matrix | Write-heavy vs read-heavy + query flexibility      |
| I10 | Logging/monitoring storage?          | 🔴 Senior  | Decision Matrix | Hot/warm/cold tiers + ingest pipeline              |

**Distribution:** 🟢 5 Junior | 🟡 30 Mid | 🔴 12 Senior — Total: 47 Q&As

---

## Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Interviewer:** "Redis Cluster có 3 masters, 1 master die. What happens and how does the system recover?"

**⚡ 30-second answer:**
"Redis Cluster detects master failure via gossip protocol — nodes exchange PING/PONG heartbeats. After `cluster-node-timeout` (default 15s), remaining masters vote to promote the failed master's replica. The replica takes over the dead master's hash slots. During failover (~1-2s), requests to those slots return MOVED errors, and smart clients redirect automatically. No data loss if replica was caught up; if not, writes since last replication are lost."

**Follow-up:** "What if there's no replica for that master?"
→ "The cluster enters FAIL state for those hash slots — those keys become unavailable. Setting `cluster-require-full-coverage no` keeps other slots serving requests, but those specific slots remain down until the master recovers or a new node is assigned. This is why production clusters should have at least 1 replica per master."

---

## Self-Check / Tự Kiểm Tra

> **Instructions:** Cover the right column. Try to recall from memory, then verify.

| #   | Loại           | Câu hỏi                                                                                                                                                 |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | Kể tên 4 loại NoSQL, cho một production use case mỗi loại. CAP position của Redis, Cassandra, MongoDB là gì? Tại sao Redis nhanh dù single-threaded?    |
| 2   | 🎨 Visual      | Vẽ inverted index cho 3 câu: "Redis is fast", "Redis is scalable", "MongoDB is fast". Thể hiện cách search query "redis fast" tìm kết quả từ sơ đồ đó.  |
| 3   | 🛠️ Application | Viết compound index tối ưu cho MongoDB query: filter `status="active"`, sort `name`, range `createdAt >= date`. Giải thích thứ tự fields theo ESR rule. |
| 4   | 🐛 Debug       | Redis server bị OOM killed sau vài ngày chạy, memory usage tăng liên tục. Nêu 3 nguyên nhân phổ biến và cách diagnose + fix từng cái.                   |
| 5   | 🎓 Teach       | Giải thích cho junior dev tại sao Elasticsearch không nên dùng làm primary database, bằng ngôn ngữ đơn giản không dùng jargon kỹ thuật.                 |

💬 **Feynman Prompt:** Giải thích cho người bạn không làm IT: tại sao một ứng dụng thương mại điện tử lớn dùng 4–5 "kho lưu trữ" khác nhau thay vì chỉ một cái? Dùng ví dụ từ cuộc sống hàng ngày (chợ, ngân hàng, bưu điện, thư viện...).

### Spaced Repetition Schedule / Lịch Ôn Tập

| Round | When          | Focus                                                               |
| ----- | ------------- | ------------------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Core Concepts + answer Self-Check from memory              |
| 2     | Day 3         | Redis Deep Dive + MongoDB — practice Cold Call aloud                |
| 3     | Day 7         | CAP/PACELC + Cassandra + Decision Matrix — do Interview Q&A Summary |
| 4     | Day 14        | Full Self-Check without notes + explain to someone                  |
| 5     | Day 30        | Mock interview: pick 5 random questions from Summary table          |

---

## Connections / Liên Kết

**Same Track (Database Advanced):**

- ⬅️ [SQL Fundamentals](./01-sql-fundamentals.md) — understand SQL constraints before learning what NoSQL trades away
- ⬅️ [Indexing Optimization](./02-indexing-optimization.md) — MongoDB indexes follow same B-Tree principles; composite index ESR rule
- ➡️ [Caching Patterns](./04-caching-patterns.md) — Redis is the primary caching tool; cache-aside/write-through patterns

**Cross-Track:**

- 🔗 [Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — CAP theorem, consistency models, distributed locking (Redlock)
- 🔗 [System Design Framework](../04-be-system-design/01-design-framework.md) — DB selection is a core Step 3 decision
- 🔗 [Message Queues](../02-backend-knowledge/08-message-queues.md) — Kafka + Redis Streams for event-driven architecture
- 🔗 [Microservices](../02-backend-knowledge/02-microservices.md) — polyglot persistence in microservice data management
