# NoSQL and NewSQL — NoSQL và NewSQL

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `be-track/03-database-advanced/03-nosql-redis-mongo.md`, `shared/03-database/database-theory.md`, `shared/02-system-design/system-design-theory.md`

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
