# Database Mind Map - Sơ Đồ Tổng Hợp

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Sơ đồ tổng hợp tất cả kiến thức Database để review nhanh trước phỏng vấn

---

## Database Complete Mind Map

```
                                    ┌──────────────────────────────────────────────────────────┐
                                    │                       DATABASE                             │
                                    └──────────────────────────────────────────────────────────┘
                                                                │
           ┌──────────────────┬──────────────────────────────── ┼────────────────┬──────────────────┐
           │                  │                                  │                │                  │
   ┌───────▼──────┐  ┌────────▼───────┐                ┌────────▼───────┐ ┌──────▼──────┐  ┌────────▼───────┐
   │     SQL      │  │     NoSQL      │                │    QUERY       │ │   SCHEMA    │  │  REPLICATION   │
   │ FUNDAMENTALS │  │                │                │ OPTIMIZATION   │ │   DESIGN    │  │  & SHARDING    │
   └───────┬──────┘  └────────┬───────┘                └────────┬───────┘ └──────┬──────┘  └────────┬───────┘
           │                  │                                  │                │                  │
    ┌──────┼──────┐    ┌──────┼──────┐                  ┌───────┼───────┐  ┌─────┼──────┐    ┌──────┼──────┐
  ACID   Joins  Idx  Redis  Mongo  Cassandra           EXPLAIN  Idx    Stats  Normal  ER   Master  Shard
```

---

## 1. SQL Fundamentals / Nền Tảng SQL

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SQL FUNDAMENTALS                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                            ACID PROPERTIES                                    │   │
│  ├──────────────────┬──────────────────┬──────────────────┬─────────────────────┤   │
│  │   ATOMICITY      │   CONSISTENCY    │    ISOLATION     │    DURABILITY       │   │
│  ├──────────────────┼──────────────────┼──────────────────┼─────────────────────┤   │
│  │                  │                  │                  │                     │   │
│  │ All or nothing   │ DB moves from    │ Concurrent txns  │ Committed data      │   │
│  │                  │ valid state to   │ don't interfere  │ survives failures   │   │
│  │ Either all ops   │ valid state      │                  │                     │   │
│  │ succeed or all   │                  │ Levels:          │ WAL (Write-Ahead    │   │
│  │ are rolled back  │ Constraints are  │ • READ UNCOMMIT  │ Log)                │   │
│  │                  │ always satisfied │ • READ COMMIT    │                     │   │
│  │                  │                  │ • REPEATABLE RD  │ Fsync to disk       │   │
│  │                  │                  │ • SERIALIZABLE   │ before commit ack   │   │
│  └──────────────────┴──────────────────┴──────────────────┴─────────────────────┘   │
│                                                                                       │
│  ISOLATION PROBLEMS:                                                                 │
│  ┌────────────────────┬──────────────┬──────────────┬────────────────────────────┐  │
│  │   Problem          │ READ UNCOMM  │ READ COMMIT  │ REPEATABLE RD │ SERIAL.   │  │
│  ├────────────────────┼──────────────┼──────────────┼───────────────┼───────────┤  │
│  │ Dirty Read         │     ✅ yes    │    ❌ no     │    ❌ no      │   ❌ no   │  │
│  │ Non-Repeatable Read│     ✅ yes    │    ✅ yes    │    ❌ no      │   ❌ no   │  │
│  │ Phantom Read       │     ✅ yes    │    ✅ yes    │    ✅ yes     │   ❌ no   │  │
│  └────────────────────┴──────────────┴──────────────┴───────────────┴───────────┘  │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Joins / Kết Hợp Bảng

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    JOINS                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  A = {1,2,3}   B = {2,3,4}                                                          │
│                                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐│
│  │INNER JOIN│  │LEFT JOIN │  │RIGHT JOIN│  │FULL OUTER│  │CROSS JOIN│  │ SELF    ││
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  │  JOIN   ││
│  │  {2,3}   │  │ {1,2,3}  │  │ {2,3,4}  │  │{1,2,3,4} │  │ A × B    │  │         ││
│  │          │  │ B nulls  │  │ A nulls  │  │nulls both│  │cartesian │  │ table   ││
│  │ matching │  │ for 1    │  │ for 4    │  │ sides    │  │ product  │  │ joined  ││
│  │ rows only│  │          │  │          │  │          │  │          │  │ itself  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────┘│
│                                                                                       │
│  JOIN ALGORITHMS (PostgreSQL/MySQL):                                                 │
│  ┌──────────────────┬──────────────────────────────────────────────────────────────┐│
│  │  Nested Loop     │ For each row in outer, scan inner. O(n*m). Good for small    ││
│  │  Hash Join       │ Build hash table on smaller table. O(n+m). Good for large    ││
│  │  Merge Join      │ Sort both, merge. O(n log n). Good when both sorted          ││
│  └──────────────────┴──────────────────────────────────────────────────────────────┘│
│                                                                                       │
│  WINDOW FUNCTIONS:                                                                   │
│  SELECT name, salary,                                                                │
│    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rank,                    │
│    ROW_NUMBER() OVER (ORDER BY id) as row_num,                                      │
│    LAG(salary, 1) OVER (ORDER BY id) as prev_salary,                                │
│    SUM(salary) OVER (PARTITION BY dept) as dept_total                               │
│  FROM employees;                                                                     │
│                                                                                       │
│  AGGREGATES & GROUP BY:                                                              │
│  SELECT dept, COUNT(*), AVG(salary), MAX(salary)                                    │
│  FROM employees                                                                      │
│  WHERE active = true                                                                 │
│  GROUP BY dept                                                                       │
│  HAVING COUNT(*) > 5         ← filter AFTER grouping                                │
│  ORDER BY AVG(salary) DESC;                                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Indexes / Chỉ Mục

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    INDEXES                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │                           INDEX TYPES                                         │   │
│  ├────────────────┬───────────────────┬──────────────────┬────────────────────────┤  │
│  │   B-Tree       │    Hash Index     │   GIN/GiST       │   Partial Index        │  │
│  ├────────────────┼───────────────────┼──────────────────┼────────────────────────┤  │
│  │                │                   │                  │                        │  │
│  │ Default type   │ Exact match only  │ GIN: full-text,  │ CREATE INDEX ON tbl    │  │
│  │ Balanced tree  │ O(1) lookup       │ arrays, JSONB    │ (col) WHERE active=true│  │
│  │ Range queries  │ No range queries  │                  │                        │  │
│  │ ORDER BY       │ Hash tables       │ GiST: geometric, │ Smaller, faster for    │  │
│  │ = < > BETWEEN  │                   │ proximity search │ filtered queries       │  │
│  │                │                   │                  │                        │  │
│  └────────────────┴───────────────────┴──────────────────┴────────────────────────┘  │
│                                                                                       │
│  COMPOSITE INDEX:                                                                    │
│  CREATE INDEX idx ON orders (user_id, created_at, status);                          │
│                                                                                       │
│  • Leftmost prefix rule: (user_id) ✅  (user_id, created_at) ✅  (created_at) ❌    │
│  • Column order matters: equality cols first, range cols last                        │
│  • Covering index: includes all cols needed → index-only scan                       │
│                                                                                       │
│  WHEN INDEX IS NOT USED:                                                             │
│  • Function on indexed col: WHERE UPPER(name) = 'BOB'  ← use functional index      │
│  • Type mismatch: WHERE id = '123' (id is int)                                      │
│  • OR conditions spanning multiple columns                                           │
│  • Leading wildcard: WHERE name LIKE '%smith'                                        │
│  • Low cardinality: WHERE active = true (only 2 values)                             │
│  • Table too small: seq scan may be cheaper                                          │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. NoSQL / Cơ Sở Dữ Liệu Phi Quan Hệ

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   NoSQL                                               │
├──────────────────────────────┬───────────────────────────────┬────────────────────────┤
│           REDIS              │          MONGODB              │      CASSANDRA         │
├──────────────────────────────┼───────────────────────────────┼────────────────────────┤
│                              │                               │                        │
│ In-memory key-value store    │ Document store (BSON/JSON)    │ Wide-column store      │
│                              │                               │                        │
│ Data types:                  │ db.collection.find({          │ Designed for:          │
│ • String: SET/GET            │   age: {$gt: 25},             │ • Write-heavy loads    │
│ • Hash:   HSET/HGET          │   status: "active"            │ • Geo-distributed      │
│ • List:   LPUSH/RPOP         │ })                            │ • Time-series data     │
│ • Set:    SADD/SMEMBERS      │                               │                        │
│ • ZSet:   ZADD/ZRANGE        │ Indexing:                     │ Partition key +        │
│ • Stream: XADD/XREAD         │ db.coll.createIndex(          │ Clustering key         │
│                              │   {field: 1})                 │                        │
│ Use cases:                   │                               │ Eventual consistency   │
│ • Session store              │ Aggregation pipeline:         │ Tunable consistency    │
│ • Cache                      │ db.orders.aggregate([         │                        │
│ • Rate limiting              │   {$match: {status:"done"}},  │ CQL (Cassandra Query   │
│ • Pub/Sub                    │   {$group: {_id:"$user",      │ Language) similar      │
│ • Leaderboard (ZSet)         │     total:{$sum:"$amount"}}   │ to SQL                 │
│ • Distributed lock           │ ])                            │                        │
│                              │                               │                        │
│ Persistence:                 │ When to use:                  │ CAP: AP (Availability  │
│ • RDB (snapshots)            │ • Flexible schema             │ + Partition tolerance) │
│ • AOF (append-only file)     │ • Rapid iteration             │                        │
│ • RDB+AOF                    │ • Hierarchical data           │                        │
│                              │ • Horizontal scaling          │                        │
│ Cluster: Redis Cluster       │                               │                        │
│ Sentinel: HA failover        │ Not ideal for:                │                        │
│                              │ • Complex joins               │                        │
│ WATCH / MULTI / EXEC         │ • Multi-doc transactions*     │                        │
│ for optimistic locking       │   (*4.0+ supported)           │                        │
│                              │                               │                        │
└──────────────────────────────┴───────────────────────────────┴────────────────────────┘
```

---

## 5. Query Optimization / Tối Ưu Truy Vấn

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              QUERY OPTIMIZATION                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  EXPLAIN ANALYZE (PostgreSQL):                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;                    │   │
│  │                                                                               │   │
│  │  Seq Scan on orders (cost=0.00..4523.00 rows=1 width=72)                    │   │
│  │                       actual time=0.042..89.203 rows=1 loops=1              │   │
│  │                                                                               │   │
│  │  KEY METRICS:                                                                 │   │
│  │  • cost=start..total   ← planner estimate                                    │   │
│  │  • rows=N              ← estimated vs actual row count                       │   │
│  │  • actual time=start..end ← wall clock ms                                   │   │
│  │  • loops=N             ← how many times node executed                        │   │
│  │  • Seq Scan vs Index Scan vs Index Only Scan vs Bitmap Heap Scan             │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  N+1 PROBLEM:                                                                        │
│  ❌ 1 query for posts + N queries for each post's author                             │
│  ✅ Fix: JOIN, or eager loading (SELECT ... WHERE user_id IN (...))                  │
│                                                                                       │
│  INDEX STRATEGIES:                                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────────┐   │
│  │  1. Identify slow queries: slow query log, pg_stat_statements                │   │
│  │  2. Check missing indexes: EXPLAIN shows Seq Scan on large table             │   │
│  │  3. Add index on WHERE, JOIN, ORDER BY columns                               │   │
│  │  4. Consider covering indexes for SELECT-heavy queries                       │   │
│  │  5. Remove unused indexes (they slow writes)                                 │   │
│  │  6. ANALYZE table to update statistics                                       │   │
│  └──────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  QUERY PATTERNS:                                                                     │
│  • Use EXISTS instead of COUNT(*) > 0 for existence checks                          │
│  • Use CTEs for readability, subqueries for performance (sometimes)                 │
│  • Avoid SELECT * in production code                                                │
│  • Use pagination: LIMIT + OFFSET or keyset (WHERE id > last_id)                   │
│  • Keyset pagination is O(1) vs OFFSET which is O(n)                               │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Caching Patterns / Mẫu Bộ Đệm

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              CACHING PATTERNS                                         │
├────────────────────┬───────────────────────┬──────────────────────┬─────────────────┤
│   CACHE-ASIDE      │    WRITE-THROUGH      │   WRITE-BEHIND       │  READ-THROUGH   │
│   (Lazy Loading)   │                       │   (Write-Back)       │                 │
├────────────────────┼───────────────────────┼──────────────────────┼─────────────────┤
│                    │                       │                      │                 │
│ App checks cache   │ Write to cache AND    │ Write to cache,      │ App reads cache │
│ On miss: load DB,  │ DB synchronously      │ async to DB          │ On miss: cache  │
│ populate cache,    │                       │                      │ loads from DB   │
│ return             │ Consistent but slower │ Fast writes, risk    │                 │
│                    │ writes                │ of data loss         │                 │
│ Most common pattern│                       │                      │                 │
│                    │                       │                      │                 │
├────────────────────┴───────────────────────┴──────────────────────┴─────────────────┤
│                              EVICTION POLICIES                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  LRU  (Least Recently Used)     ← most common, evict oldest accessed               │
│  LFU  (Least Frequently Used)   ← evict least often accessed                       │
│  FIFO (First In First Out)      ← evict oldest inserted                            │
│  TTL  (Time To Live)            ← evict after expiry time                          │
│                                                                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                              CACHE PROBLEMS                                           │
├──────────────────────────────┬──────────────────────────────────────────────────────┤
│  Cache Stampede               │ Many simultaneous requests on cache miss             │
│  (Thundering Herd)            │ Fix: mutex/lock, probabilistic early expiry         │
├──────────────────────────────┼──────────────────────────────────────────────────────┤
│  Cache Penetration            │ Queries for non-existent keys bypass cache          │
│                               │ Fix: cache null/empty result, bloom filter          │
├──────────────────────────────┼──────────────────────────────────────────────────────┤
│  Cache Avalanche              │ Many keys expire simultaneously → DB overload       │
│                               │ Fix: random TTL jitter, background refresh          │
└──────────────────────────────┴──────────────────────────────────────────────────────┘
```

---

## 7. Schema Design / Thiết Kế Lược Đồ

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               SCHEMA DESIGN                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  NORMALIZATION:                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │  1NF: Atomic values, no repeating groups, primary key                       │   │
│  │  2NF: 1NF + no partial dependency on composite PK                           │   │
│  │  3NF: 2NF + no transitive dependency (non-key → non-key)                   │   │
│  │  BCNF: Every determinant is a candidate key                                 │   │
│  │  4NF: No multi-valued dependencies                                          │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                       │
│  DENORMALIZATION (when to break rules):                                             │
│  • Read-heavy workloads where JOIN cost is too high                                 │
│  • Pre-computed aggregates for analytics                                            │
│  • Time-series / event tables                                                       │
│                                                                                       │
│  COMMON PATTERNS:                                                                    │
│  ┌──────────────────────────────┬──────────────────────────────────────────────┐   │
│  │  Soft Deletes                │ deleted_at TIMESTAMP NULL                    │   │
│  │                              │ WHERE deleted_at IS NULL                     │   │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │  Audit Trail                 │ created_at, updated_at, created_by columns   │   │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │  Polymorphic Associations    │ entity_type + entity_id (use with caution)   │   │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │  EAV (Entity-Attribute-Value)│ Flexible but hard to query, use JSONB instead│  │
│  ├──────────────────────────────┼──────────────────────────────────────────────┤   │
│  │  UUID vs Auto-increment      │ UUID: no enumeration, distributed; but larger│  │
│  │                              │ ULID: sortable UUID alternative              │   │
│  └──────────────────────────────┴──────────────────────────────────────────────┘   │
│                                                                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Replication & Sharding / Nhân Bản & Phân Mảnh

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           REPLICATION & SHARDING                                      │
├──────────────────────────────────────┬──────────────────────────────────────────────┤
│            REPLICATION               │               SHARDING                        │
├──────────────────────────────────────┼──────────────────────────────────────────────┤
│                                      │                                               │
│  Master-Slave (Primary-Replica):     │  Horizontal partitioning of data              │
│  • Reads from replicas               │  across multiple DBs/nodes                    │
│  • Writes to primary only            │                                               │
│  • Async or sync replication         │  Shard Key strategies:                        │
│  • Replication lag issue             │  • Range-based: user_id 1-1M → shard1        │
│                                      │  • Hash-based: hash(user_id) % N             │
│  Multi-Master:                       │  • Directory-based: lookup service           │
│  • Multiple writable nodes           │  • Geo-based: by region                      │
│  • Conflict resolution needed        │                                               │
│                                      │  Challenges:                                  │
│  Log Shipping Methods:               │  • Cross-shard JOINs (avoid or denorm)       │
│  • WAL (Postgres streaming)          │  • Rebalancing when adding shards            │
│  • Binlog (MySQL)                    │  • Hotspot: one shard gets all traffic       │
│  • Redo log (Oracle)                 │  • Distributed transactions                  │
│                                      │                                               │
│  Read vs Write Split:                │  Consistent Hashing:                          │
│  • Use replica for analytics         │  • Minimizes rebalancing                      │
│  • Route writes to primary           │  • Virtual nodes for even distribution       │
│  • Connection pooling (PgBouncer)    │  • Used in Cassandra, DynamoDB               │
│                                      │                                               │
└──────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 9. Quick Reference / Tham Khảo Nhanh

| Topic          | Key Concept                                   | Common Interview Question            |
| -------------- | --------------------------------------------- | ------------------------------------ |
| ACID           | Atomicity, Consistency, Isolation, Durability | Explain transaction isolation levels |
| Indexes        | B-Tree, Hash, GIN/GiST                        | How does a B-Tree index work?        |
| N+1 Query      | Missing JOIN causes N extra queries           | How to detect and fix N+1?           |
| Normalization  | 1NF→3NF, reduce redundancy                    | When to denormalize?                 |
| Cache patterns | Cache-aside, Write-through                    | How to handle cache invalidation?    |
| Sharding       | Horizontal partitioning                       | How to choose a shard key?           |
| Replication    | Primary-replica, async lag                    | How to handle replication lag?       |
| EXPLAIN        | Query execution plan analysis                 | How to optimize a slow query?        |

---

> **Sử dụng:** In ra hoặc lưu file này để review nhanh trước phỏng vấn
