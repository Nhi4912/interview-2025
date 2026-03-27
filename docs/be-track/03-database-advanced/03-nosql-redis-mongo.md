# NoSQL, Redis, MongoDB & Beyond — Interview Deep Dive

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

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

> 🪝 **Memory Hook:** "SQL = Excel with foreign keys; NoSQL = flexible drawers — each drawer type for a different job"

**Why exists (Root-cause):**

- **Level 1:** Different data problems need different storage models — relational integrity vs horizontal scale
- **Level 2:** RDBMS hit write throughput limits at scale; NoSQL sacrifices JOIN capability for partition tolerance and linear scalability
- **Level 3:** CAP theorem forces explicit trade-offs; PACELC extends this to latency vs consistency even when no partition

**Common Mistakes:**

- ❌ "NoSQL is faster than SQL" → Depends on access pattern; PostgreSQL with proper indexes beats MongoDB for complex JOINs
- ❌ Using NoSQL to avoid learning SQL → Many NoSQL use cases still need relational thinking for data integrity
- ❌ Ignoring PACELC → CAP only covers partition scenario; real systems also choose between latency and consistency daily

**Interview Pattern:** "When would you choose NoSQL over SQL?" → Name 3 criteria (schema flexibility, write throughput, horizontal scale) + 1 counter-example (financial transactions need ACID → SQL)

**Knowledge Chain:** SQL Fundamentals → CAP Theorem → NoSQL Categories → Database Selection → System Design Data Layer

### Concept 2: Redis Deep Dive

> 🪝 **Memory Hook:** "Redis = RAM dictionary with 16384 mailboxes (hash slots), single postman (thread), but fastest in the city"

**Why exists (Root-cause):**

- **Level 1:** Disk-based DBs can't serve sub-millisecond reads; Redis keeps everything in memory
- **Level 2:** Single-threaded event loop eliminates lock contention; I/O multiplexing (epoll) handles 100K+ connections
- **Level 3:** Hash slots enable horizontal scale (Cluster) while Sentinel provides HA for single-master setups; persistence (RDB/AOF) trades durability for speed

**Common Mistakes:**

- ❌ Treating Redis as primary DB → No ACID, no complex queries; use as cache/session/counter layer
- ❌ Using KEYS in production → O(N) blocks entire server; use SCAN instead
- ❌ Ignoring maxmemory + eviction policy → OOM kills the process; always set allkeys-lfu for cache workloads
- ❌ Confusing Pub/Sub (fire-and-forget) with Streams (persistent) → Pub/Sub loses messages if subscriber is down

**Interview Pattern:** "Why is Redis fast despite being single-threaded?" → In-memory + epoll + no locks + efficient data structures. Follow up: "What about Redis 6.0 I/O threads?" → I/O threads for network read/write only; command execution still single-threaded

**Knowledge Chain:** Memory hierarchy → In-memory storage → Redis data types → Persistence trade-offs → Cluster sharding → Caching patterns

### Concept 3: MongoDB

> 🪝 **Memory Hook:** "MongoDB = JSON filing cabinet with WiredTiger engine — document-level locks, ESR index rule, oplog replication"

**Why exists (Root-cause):**

- **Level 1:** Relational schema changes are expensive (ALTER TABLE); document model allows schema evolution without downtime
- **Level 2:** WiredTiger replaced MMAPv1 for document-level locking + compression; B-tree indexes similar to PostgreSQL
- **Level 3:** Sharding distributes data by shard key; poor shard key (low cardinality) creates "jumbo chunks" and hotspots

**Common Mistakes:**

- ❌ Embedding everything in one document → 16MB doc limit + update amplification; reference when data is shared across contexts
- ❌ Missing compound indexes → ESR rule (Equality-Sort-Range) determines optimal index order
- ❌ Using multi-document transactions heavily → MongoDB transactions are slower than PostgreSQL; if you need many transactions, reconsider SQL
- ❌ Wrong shard key → Cannot change shard key after creation; high cardinality + query isolation required

**Interview Pattern:** "When would you use MongoDB vs PostgreSQL?" → Document model when schema varies per record + read-heavy with known query patterns. Counter: financial ledger with complex JOINs → PostgreSQL

**Knowledge Chain:** Document Model → WiredTiger → Indexing (ESR) → Sharding → Replica Sets → Read/Write Concern → Transactions

### Concept 4: Elasticsearch

> 🪝 **Memory Hook:** "ES = inverted index phone book — BM25 ranks pages, ~1s delay (NRT), NEVER the source of truth"

**Why exists (Root-cause):**

- **Level 1:** B-tree indexes can't do full-text search efficiently; inverted index maps terms → document IDs
- **Level 2:** BM25 scoring (improved TF-IDF) ranks results by relevance; analyzers tokenize + normalize text
- **Level 3:** NRT (Near Real-Time) ~1s refresh delay means ES is eventually consistent; filter context is cacheable, query context scores relevance

**Common Mistakes:**

- ❌ Using ES as primary database → No ACID, eventual consistency, update = delete + reindex
- ❌ Not understanding NRT delay → Writes visible after ~1s refresh; not suitable for real-time reads
- ❌ Over-sharding → Each shard has overhead (Lucene segment); start with fewer shards, reindex to scale

**Interview Pattern:** "How would you implement search for an e-commerce site?" → ES for product search + PostgreSQL as source of truth → CDC/event-driven sync → Index with custom analyzers for Vietnamese text

**Knowledge Chain:** Inverted Index → Analyzers → BM25 Scoring → Query DSL → Sharding → CDC pipeline → Search architecture

### Concept 5: Cassandra

> 🪝 **Memory Hook:** "Cassandra = append-only log wall (LSM-tree) — partition key picks the wall, clustering key sorts the bricks"

**Why exists (Root-cause):**

- **Level 1:** Write-heavy workloads (IoT, logs, metrics) need sequential writes; LSM-tree optimizes for this
- **Level 2:** Partition key determines node placement; clustering key determines sort order within partition — query-first data modeling is mandatory
- **Level 3:** R + W > N gives strong consistency; tombstones from deletes accumulate and slow reads — design to avoid frequent deletes

**Common Mistakes:**

- ❌ Modeling data like SQL (normalize, then query) → Cassandra requires query-first denormalized design
- ❌ Frequent deletes → Tombstones accumulate until compaction; design with TTL instead
- ❌ Using secondary indexes heavily → Anti-pattern; creates scatter-gather queries across nodes
- ❌ Ignoring partition sizing → Large partitions (>100MB) cause GC pressure and slow queries

**Interview Pattern:** "Design time-series storage for IoT with 1M writes/sec" → Cassandra with time-bucketed partition keys + clustering key on timestamp → Explain compaction strategy (TWCS for time-series)

**Knowledge Chain:** LSM-tree → Partition/Clustering Key → Consistency Levels → Compaction → Tombstones → Query-first modeling

### Concept 6: Time-Series & Graph Databases

> 🪝 **Memory Hook:** "InfluxDB = metrics firehose with auto-downsampling; Neo4j = relationship web where JOINs become O(1) pointer chasing"

**Why exists (Root-cause):**

- **Level 1:** Generic DBs waste storage on timestamp-indexed append-only data; TSDB compresses and auto-aggregates
- **Level 2:** Graph DBs store relationships as first-class citizens; traversing N hops is O(N) regardless of data size vs SQL's N JOINs
- **Level 3:** InfluxDB uses TSM (Time-Structured Merge) tree; TimescaleDB extends PostgreSQL with hypertables; Neo4j uses index-free adjacency for O(1) relationship traversal

**Common Mistakes:**

- ❌ Using generic DB for metrics → Wastes 10x storage; no built-in downsampling/retention
- ❌ Using graph DB for everything → Only beneficial when relationship traversal depth > 2; simple lookups are slower than RDBMS
- ❌ Confusing property graph (Neo4j) with RDF/triple store → Different query languages (Cypher vs SPARQL)

**Interview Pattern:** "Design monitoring for 10K microservices" → Prometheus (pull-based metrics) + InfluxDB (long-term storage) + Grafana (visualization). Follow up: "Why not just use PostgreSQL?" → Compression ratio, retention policies, native downsampling

**Knowledge Chain:** Time-Series use cases → TSM/compression → Retention policies → Graph model → Cypher → Social network/fraud detection

### Concept 7: Decision Matrix & Multi-DB Architecture

> 🪝 **Memory Hook:** "No single DB wins all — design a data layer like a team: PostgreSQL for truth, Redis for speed, ES for search, Cassandra for firehose"

**Why exists (Root-cause):**

- **Level 1:** Each DB optimizes for different access patterns; polyglot persistence matches DB to workload
- **Level 2:** Multi-layer caching (L1 local → L2 Redis → L3 CDN) reduces latency at each tier
- **Level 3:** CDC (Change Data Capture) keeps secondary stores in sync with source of truth; event-driven invalidation prevents stale data

**Common Mistakes:**

- ❌ Using one DB for everything → Leads to performance cliffs at scale
- ❌ Too many DBs without operational capability → Each DB needs monitoring, backup, expertise
- ❌ Ignoring consistency between stores → CDC lag means temporary inconsistency; design for eventual consistency

**Interview Pattern:** "Design the data layer for a ride-hailing app" → PostgreSQL (drivers, riders, payments) + Redis (driver locations, surge pricing cache) + ES (ride search) + Kafka (event streaming) + S3 (ride history cold storage)

**Knowledge Chain:** Individual DB strengths → Access pattern analysis → Polyglot persistence → CDC/sync → Operational complexity → Cost optimization

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

| #   | Question                                                              | Key Points                                                                                                                                     |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Name 4 NoSQL types with production use case each                      | Key-Value (Redis: session), Document (MongoDB: user profile), Wide-Column (Cassandra: IoT logs), Graph (Neo4j: fraud detection)                |
| 2   | Explain CAP theorem — which side do Redis, Cassandra, MongoDB choose? | Redis: CP (single-master, reject writes on partition); Cassandra: AP (tunable, usually eventual); MongoDB: CP (primary election blocks writes) |
| 3   | Why is Redis fast despite single-threaded?                            | In-memory + epoll I/O multiplexing + no lock contention + efficient data structures + network is bottleneck not CPU                            |
| 4   | MongoDB ESR rule for compound indexes?                                | Equality fields first, Sort fields second, Range fields last — maximizes index scan efficiency                                                 |
| 5   | Why can't Elasticsearch be a primary database?                        | No ACID, NRT ~1s delay, update = delete + reindex, no relational integrity, can lose data                                                      |
| 6   | Cassandra partition key vs clustering key?                            | Partition key → determines which node; Clustering key → sort order within partition; together = primary key                                    |
| 7   | Design multi-layer caching for e-commerce?                            | L1: in-process local cache (product catalog), L2: Redis cluster (session, cart), L3: CDN (images, static); invalidation via CDC/event-driven   |

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
