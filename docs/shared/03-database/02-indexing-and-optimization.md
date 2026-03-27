# Indexing & Query Optimization / Đánh Chỉ Mục và Tối Ưu Truy Vấn

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Database Theory](./database-theory.md) | [Sharding & Transactions](./04-sharding-and-transactions.md) | [NoSQL & NewSQL](./03-nosql-and-newsql.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki.vn search query timeout:** `SELECT * FROM products WHERE category='electronics' AND price < 1000000 ORDER BY created_at DESC LIMIT 20` — query mất 8 giây với 50 triệu rows. `EXPLAIN ANALYZE` shows: full table scan (Seq Scan), không có index. Fix 1: add index on `(category, price, created_at)` — composite index ESR order. Query time: 8s → 45ms. Fix 2: thêm index trên `created_at DESC` riêng cho sort — Index Only Scan.

**Bài học:** Index không tự động. `EXPLAIN ANALYZE` là công cụ bắt buộc khi debug slow queries. Biết cách đọc query plan là kỹ năng phân biệt Junior vs Senior DB developer.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Database index giống mục lục sách: thay vì đọc từng trang (full table scan), bạn mở mục lục tìm trang số (B+Tree lookup) → nhảy thẳng đến trang đó. Composite index giống mục lục nhiều cấp (chương → mục → trang) — chỉ hữu ích nếu bạn search từ cấp đầu tiên.

**Why it matters:** 80% performance issues ở production database là missing indexes hoặc wrong indexes. Biết B+Tree internals giúp predict query performance và design indexes đúng.

---

## Concept Map / Bản Đồ Khái Niệm

```
    [B+Tree Structure]
         │
    ┌────┼────────────┐
    ▼    ▼            ▼
[Single] [Composite]  [Specialized]
 Index    Index        Hash/Bitmap/Full-text
    │       │            │
    ▼       ▼            ▼
[Covering] [Partial]  [Materialized View]
    │       │
    └───────┼─────────────┐
            ▼             ▼
      [EXPLAIN ANALYZE]  [Query Optimizer]
            │             │
            ▼             ▼
      [Performance]    [Statistics/Cardinality]
```

---

## Overview / Tổng Quan

| #   | Concept                      | Role                                                         | Interview Weight                |
| --- | ---------------------------- | ------------------------------------------------------------ | ------------------------------- |
| 1   | B+Tree & Index Structure     | How indexes work internally — leaf linked list, O(log n)     | ⭐⭐⭐ (most asked)             |
| 2   | Composite & Covering Index   | Multi-column index design, leftmost prefix, index-only scan  | ⭐⭐⭐ (ESR rule)               |
| 3   | Specialized Indexes          | Hash, bitmap, full-text, partial — choosing right type       | ⭐⭐ (when B+Tree isn't enough) |
| 4   | EXPLAIN & Query Plans        | Reading execution plans, identifying Seq Scan vs Index Scan  | ⭐⭐⭐ (practical debugging)    |
| 5   | Query Optimizer & Statistics | Cost-based optimization, cardinality estimation, stale stats | ⭐⭐ (senior-level)             |
| 6   | Index Maintenance & Costs    | Write amplification, unused indexes, bloat, vacuum           | ⭐⭐ (production reality)       |
| 7   | Denormalization & Pooling    | When to break normalization for reads, connection management | ⭐⭐ (system design)            |

**Relationship:** B+Tree is the **foundation** (how indexes work). Composite/covering indexes are the **design patterns** (how to design them). EXPLAIN is the **debugging tool** (how to verify). Optimizer/statistics is the **why** (how DB chooses plans). Maintenance is the **operational cost** (write amplification, bloat).

---

## Core Concepts Phase 2 / Khái Niệm Cốt Lõi — Chuyên Sâu

### Concept 1: B+Tree & Index Structure

🪝 **Memory Hook:** B+Tree = mục lục sách nhiều cấp — internal nodes chỉ đường, leaf nodes chứa dữ liệu + linked list cho range scan

**Why exists / Tại sao tồn tại:**

- Level 1: Full table scan is O(n) — need O(log n) lookup structure
- Level 2: B+Tree's high fanout keeps tree height low (3-4 levels for millions of rows)
- Level 3: Leaf linked list enables efficient range scans without tree traversal per row

**Layer 1 (Simple Analogy):** Library with floor directory (root) → section signs (internal) → shelf labels (leaf). Finding a book: floor→section→shelf = 3 steps regardless of library size.

**Layer 2 (Technical Mechanics):**

```
B+Tree (height 3, fanout ~500):
  Level 0 (root): 1 page, 500 keys
  Level 1: 500 pages, 250K keys
  Level 2 (leaf): 250K pages, 125M keys
  → 125M rows indexed in just 3 I/O reads!

Leaf node structure:
[key1|ptr1] ↔ [key2|ptr2] ↔ [key3|ptr3] ↔ ...
  linked list → range scan follows pointers
```

**Layer 3 (Edge Cases):** B+Tree vs LSM-Tree — B+Tree optimized for reads (in-place update), LSM-Tree optimized for writes (append-only, compaction). Cassandra/RocksDB use LSM-Tree.

| Sai lầm                              | Tại sao sai                                            | Đúng là                                                 |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| Assume index always faster than scan | Low selectivity → index + lookup > sequential scan     | EXPLAIN: DB may choose Seq Scan when >10-15% rows match |
| Confuse B-Tree with B+Tree           | B-Tree stores data in all nodes; B+Tree only in leaves | B+Tree: internal=routing, leaf=data+linked list         |
| Ignore index page splits             | Writes to full leaf → split → fragmentation over time  | Monitor bloat, REINDEX periodically                     |

🎯 **Interview Pattern:** "Why B+Tree not hash?" → B+Tree: range queries, ORDER BY, LIKE prefix. Hash: O(1) equality only.

🔗 **Knowledge Chain:** Disk I/O cost → Tree structure → Fanout optimization → Leaf linked list → Range scan efficiency

### Concept 2: Composite & Covering Index

🪝 **Memory Hook:** ESR = Equality → Sort → Range — thứ tự vàng cho composite index design

**Why exists / Tại sao tồn tại:**

- Level 1: Single-column index can't serve multi-column WHERE efficiently
- Level 2: Covering index eliminates heap lookup — Index Only Scan = fastest

**Layer 1:** Phone book sorted by (LastName, FirstName) — find "Smith, John" fast. But find "all Johns" requires scanning everything (leftmost prefix rule).

**Layer 2:**

```
Composite Index on (status, created_at, user_id):
  ESR: status = 'active' (Equality)
       ORDER BY created_at DESC (Sort)
       AND user_id > 100 (Range)
  → Index serves all three efficiently

Covering Index:
  CREATE INDEX ON orders(customer_id) INCLUDE (total, status);
  SELECT total, status FROM orders WHERE customer_id = 123;
  → "Index Only Scan" — no heap fetch needed
```

**Layer 3:** INCLUDE columns (PG 11+) are stored in leaf nodes only, not search keys — smaller index, still covers queries.

| Sai lầm                       | Tại sao sai                              | Đúng là                                             |
| ----------------------------- | ---------------------------------------- | --------------------------------------------------- |
| Range column before equality  | Can't use index for equality after range | ESR: equality first, range last                     |
| Too many columns in composite | Large index → slow writes, more storage  | Max 3-4 columns, based on top query patterns        |
| Skip covering index analysis  | Extra heap lookups on every query        | Check EXPLAIN for "Index Scan" vs "Index Only Scan" |

🎯 **Interview Pattern:** "Design index for WHERE status='active' ORDER BY created_at" → Composite (status, created_at), ESR rule

🔗 **Knowledge Chain:** Query patterns → ESR ordering → Leftmost prefix → Covering optimization → EXPLAIN verification

### Concept 3: Specialized Indexes

🪝 **Memory Hook:** B+Tree là dao đa năng — Hash/Bitmap/Full-text là dao chuyên dụng cho từng bài toán

**Why exists / Tại sao tồn tại:**

- Level 1: B+Tree can't do everything — hash is faster for equality, full-text needs inverted index
- Level 2: Bitmap enables fast multi-column AND/OR on low-cardinality columns (OLAP)

**Layer 1:** Kitchen tools — B+Tree is a chef's knife (versatile). Hash index is a garlic press (one job, fast). Full-text index is a food processor (handles text specifically).

**Layer 2:**

```
Hash Index: hash(key) → bucket → O(1) lookup
  ✅ WHERE email = 'x@y.com' (exact match)
  ❌ WHERE email LIKE 'x%' (no ordering)

Bitmap Index: bit vector per distinct value
  gender_M: 1 0 1 1 0 ...
  gender_F: 0 1 0 0 1 ...
  AND operation: bitwise, very fast for OLAP aggregations

Full-Text (GIN/GiST in PostgreSQL):
  Tokenize → inverted index → search "golang concurrency"
  Supports: stemming, ranking, boolean operators
```

**Layer 3:** Partial index: `CREATE INDEX ON orders(user_id) WHERE status = 'pending'` — 10x smaller than full index, faster for specific workload.

| Sai lầm                             | Tại sao sai                                 | Đúng là                                   |
| ----------------------------------- | ------------------------------------------- | ----------------------------------------- |
| Use hash index for range queries    | Hash has no ordering                        | B+Tree for ranges, hash for equality only |
| Full-text with LIKE '%term%'        | LIKE with leading wildcard can't use B+Tree | Use GIN/GiST full-text index instead      |
| Bitmap on OLTP with frequent writes | Bitmap lock contention on writes            | Bitmap for OLAP/read-heavy only           |

🎯 **Interview Pattern:** "When use hash vs B+Tree?" → Hash: O(1) equality only. B+Tree: equality + range + sort + prefix.

🔗 **Knowledge Chain:** Access pattern → Index type selection → Storage tradeoffs → Maintenance cost

### Concept 4: EXPLAIN & Query Plans

🪝 **Memory Hook:** EXPLAIN = X-ray cho query — thấy bên trong DB đang làm gì thật sự

**Why exists / Tại sao tồn tại:**

- Level 1: Can't optimize what you can't measure — EXPLAIN shows actual execution path
- Level 2: Estimated rows vs actual rows reveals stale statistics

**Layer 1:** Doctor's X-ray — symptom is "query slow" (patient hurts), EXPLAIN shows the internal cause (broken bone = Seq Scan on 10M rows).

**Layer 2:**

```
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;

Red flags to look for:
1. type=ALL / Seq Scan → missing index
2. rows estimate very different from actual → stale statistics
3. "Using filesort" → no index for ORDER BY
4. "Using temporary" → complex GROUP BY without index
5. Nested Loop with large outer table → wrong join order

Fix workflow:
  Slow query → EXPLAIN ANALYZE → identify bottleneck → add index or rewrite → verify
```

**Layer 3:** EXPLAIN BUFFERS (PostgreSQL) shows I/O: shared hit (cache) vs read (disk). High reads = not enough shared_buffers.

| Sai lầm                               | Tại sao sai                                    | Đúng là                                       |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| Only EXPLAIN without ANALYZE          | Estimates may be wrong — need actual execution | Always use EXPLAIN ANALYZE for real numbers   |
| Ignore "rows" column                  | Wrong estimate → wrong plan choice             | Compare estimated vs actual rows              |
| Fix query without re-checking EXPLAIN | May not actually use new index                 | Always verify with EXPLAIN after adding index |

🎯 **Interview Pattern:** "How debug slow query?" → EXPLAIN ANALYZE → check access type, row estimates, join order

🔗 **Knowledge Chain:** Slow query → EXPLAIN ANALYZE → Access path → Statistics → Index/rewrite → Verify

### Concept 5: Query Optimizer & Statistics

🪝 **Memory Hook:** Optimizer = GPS nội bộ — chọn route dựa trên traffic data (statistics). Stale data → wrong route.

**Why exists / Tại sao tồn tại:**

- Level 1: Multiple execution plans exist — optimizer picks cheapest based on cost model
- Level 2: Statistics (histograms, MCV, null fraction) drive cardinality estimates

**Layer 1:** GPS routing — recalculates based on current traffic. If traffic data is stale (no live updates), GPS sends you through a traffic jam. Same with DB: stale stats → wrong plan.

**Layer 2:**

```
Cost-based optimizer flow:
1. Parse SQL → logical plan (what to compute)
2. Generate candidate physical plans (how to compute)
   Plan A: Seq Scan + Sort → cost = 5000
   Plan B: Index Scan → cost = 20
   Plan C: Index Only Scan → cost = 8
3. Pick Plan C (lowest cost)

Statistics updated by:
  ANALYZE table_name;      -- manual
  autovacuum + autoanalyze  -- automatic (PostgreSQL)

Parameter sniffing (SQL Server/MySQL):
  First execution → plan cached
  Different parameter → same plan → may be terrible for different data distribution
```

**Layer 3:** Extended statistics (PostgreSQL 10+) for correlated columns — default assumes independence, extended stats handle correlations.

| Sai lầm                       | Tại sao sai                                   | Đúng là                                                   |
| ----------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Never run ANALYZE             | Stale stats → optimizer chooses wrong plan    | Schedule ANALYZE, monitor autovacuum                      |
| Trust plan cache blindly      | Parameter sniffing → bad plan reused          | Check actual vs estimated rows, force recompile if needed |
| Override optimizer with hints | Hint locks plan — won't adapt to data changes | Hints as last resort; fix stats and indexes first         |

🎯 **Interview Pattern:** "Why can EXPLAIN estimate be wrong?" → Stale statistics, correlated columns, skewed data

🔗 **Knowledge Chain:** Statistics collection → Cardinality estimation → Cost model → Plan selection → Plan cache

### Concept 6: Index Maintenance & Costs

🪝 **Memory Hook:** Mỗi index = cái giá phải trả khi write — INSERT/UPDATE/DELETE đều update tất cả indexes

**Why exists / Tại sao tồn tại:**

- Level 1: More indexes = slower writes (write amplification)
- Level 2: Dead tuples from updates accumulate → index bloat → needs VACUUM

**Layer 1:** Library card catalog with 10 cross-reference systems — every new book requires updating all 10 catalogs. Remove catalogs you don't actually use.

**Layer 2:**

```
Write amplification per index:
  1 INSERT → update table heap + N indexes
  5 indexes → 6 writes per INSERT

Detecting unused indexes (PostgreSQL):
  SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
  → Index never used in queries → candidate for dropping

Index bloat:
  UPDATEs create dead tuples → old index entries point to dead rows
  VACUUM cleans dead tuples → REINDEX rebuilds index compactly
```

**Layer 3:** HOT (Heap-Only Tuple) optimization in PostgreSQL — if updated columns aren't indexed, new version stays on same page → no index update needed.

| Sai lầm                               | Tại sao sai                              | Đúng là                                                    |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Create index for every column         | Write amplification, storage waste       | Index only WHERE/JOIN/ORDER BY columns from actual queries |
| Never monitor index usage             | Unused indexes slow writes for nothing   | Check pg_stat_user_indexes quarterly                       |
| Drop index without observation period | May miss infrequent but critical queries | Monitor for 30+ days before dropping                       |

🎯 **Interview Pattern:** "Too many indexes — what to do?" → Monitor usage stats, drop unused, consolidate overlapping composites

🔗 **Knowledge Chain:** Write amplification → Index cost → Usage monitoring → Bloat → VACUUM/REINDEX

### Concept 7: Denormalization & Pooling

🪝 **Memory Hook:** Denormalization = duplicate data intentionally for read speed — bất đắc dĩ, không phải default

**Why exists / Tại sao tồn tại:**

- Level 1: Normalized schema → many JOINs → slow reads at scale
- Level 2: Connection pooling reuses DB connections — avoids expensive handshake per request

**Layer 1:** Pre-printed reports vs real-time query — report (denormalized view) is instant to read but may be slightly stale. Real-time query (normalized JOINs) is always fresh but slower.

**Layer 2:**

```
Denormalization example:
  Normalized: orders JOIN users JOIN products → 3-table JOIN
  Denormalized: orders_summary table with user_name, product_name
  → Single table read, no JOINs
  Trade-off: data duplication, update complexity

Connection Pooling:
  Without: each request → TCP handshake + auth + query + close
  With (PgBouncer/HikariCP): reuse established connections
  Pool size: num_cores * 2 + effective_spindle_count
  → 4 cores = ~10 connections (not 100!)
```

**Layer 3:** Materialized views — database-managed denormalization with REFRESH. Good for dashboards, bad for real-time.

| Sai lầm                                  | Tại sao sai                                        | Đúng là                                                   |
| ---------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Denormalize before measuring             | May not need it — premature optimization           | Normalize first, denormalize with evidence (EXPLAIN, SLO) |
| Pool size = 100 connections              | Each connection = ~10MB RAM, too many = contention | Formula: cores \* 2 + spindles, usually 10-30             |
| No source-of-truth for denormalized data | Updates miss some copies → inconsistency           | Clear ownership, CDC pipeline for sync                    |

🎯 **Interview Pattern:** "When denormalize?" → Read-heavy dashboards, hot paths with complex JOINs, after proving normalization is the bottleneck

🔗 **Knowledge Chain:** Normalization cost → JOIN overhead → Denormalization strategy → Materialized views → Connection pooling

---

## Visual Overview / Sơ Đồ Tổng Quan

### How B+Tree Index Works

```
Table: users (id, name, age, email)
Index on: age

B+Tree Index:
                [30 | 50]           ← internal node (routing only)
               /    |    \
         [20,25] [35,40] [55,60]    ← internal nodes
          /  \    / \     / \
        leaf leaf ...  leaf leaf    ← leaf nodes (actual data + pointers)

Leaf nodes form a LINKED LIST:
[20→row] ↔ [25→row] ↔ [30→row] ↔ [35→row] ↔ ...

Query: WHERE age = 35
→ Traverse tree: root → [30,50] → left of 50 → leaf [35] → row pointer
→ O(log n) to find, then pointer to actual row

Query: WHERE age BETWEEN 25 AND 40
→ Find leaf [25] via tree traversal
→ Follow linked list: [25] → [30] → [35] → [40] → STOP
→ O(log n) + O(k) where k = matching rows = VERY FAST for ranges!
```

### Full Table Scan vs Index Scan

```
Table: 1,000,000 rows
Query: SELECT * FROM orders WHERE customer_id = 123

WITHOUT INDEX:                  WITH INDEX:
Read ALL 1M rows                B+Tree lookup
Check each customer_id          → ~20 comparisons (log₂(1M) ≈ 20)
Return matches                  → jump to rows
Cost: O(n) = scan 1M rows       Cost: O(log n) = 20 comparisons

Time: ~500ms                    Time: ~1ms
```

### Index Types Comparison

```
B+Tree Index:                   Hash Index:
┌─────────────────┐             ┌──────────────────┐
│ Perfect for:    │             │ Perfect for:     │
│ = , <, >, BETWEEN│           │ = only (exact)   │
│ ORDER BY        │             │ Fastest lookup   │
│ GROUP BY        │             │                  │
│ LIKE 'prefix%'  │             │ NOT for:         │
│                 │             │ ranges, sorting  │
└─────────────────┘             └──────────────────┘

Composite Index: INDEX(last_name, first_name)
Left-prefix rule:
  WHERE last_name = 'Smith'              ← uses index ✓
  WHERE last_name = 'Smith' AND first_name = 'John'  ← uses index ✓
  WHERE first_name = 'John'             ← does NOT use index ✗
  (only uses leftmost columns in sequence)
```

### Query Execution Plan (EXPLAIN)

```
EXPLAIN SELECT * FROM orders
  JOIN customers ON orders.customer_id = customers.id
  WHERE customers.city = 'Hanoi'
  ORDER BY orders.created_at DESC
  LIMIT 10;

Output (simplified):
┌─────────────────────────────────────────────────────┐
│ id │ type  │ table     │ key          │ rows │ Extra │
├────┼───────┼───────────┼──────────────┼──────┼───────┤
│ 1  │ ALL   │ customers │ NULL         │ 50k  │Using filesort│ ← BAD: full scan!
│ 1  │ ref   │ orders    │ customer_id  │ 3    │       │ ← OK: uses index
└─────────────────────────────────────────────────────┘

Red flags in EXPLAIN:
  type=ALL     → full table scan (add index!)
  Extra=Using filesort → no index for ORDER BY (add index!)
  Extra=Using temporary → temp table (complex query)
  rows=50000   → estimating too many rows (bad statistics)
```

---

---

## 1. Why Indexing Matters / Vì sao index quan trọng

### 🟢 Q: Why is full table scan expensive? `[Junior]`

**A:** Full table scan đọc gần như toàn bộ pages của bảng, tốn I/O và CPU khi bảng lớn.
Index giúp giới hạn phạm vi đọc, đặc biệt cho truy vấn chọn lọc cao (high selectivity).

### 🟢 Q: How does an index reduce query latency? `[Junior]`

**A:** Index cung cấp cấu trúc tìm kiếm có thứ tự/hash để truy cập nhanh hơn thay vì duyệt tuần tự.
Đổi lại, write operations sẽ tốn thêm chi phí cập nhật index entries.

## 2. B-Tree and B+Tree / Cây B và B+

### 🟡 Q: What is B-tree index structure? `[Mid]`

**A:** B-tree là cây cân bằng đa nhánh; mỗi node chứa nhiều key và con trỏ child.
Lookup đi từ root xuống leaf với độ phức tạp xấp xỉ O(log n).
Giữ tree cân bằng giúp performance ổn định khi dữ liệu tăng.

### 🟡 Q: Why do most databases use B+tree instead of B-tree? `[Mid]`

**A:** B+tree lưu toàn bộ record pointer ở leaf nodes; internal nodes chỉ giữ key điều hướng.
Leaf nodes liên kết tuần tự nên range scan cực hiệu quả.
Fan-out cao hơn giúp chiều cao cây thấp, giảm số page đọc.

## 3. Other Index Types / Các loại index khác

### 🟢 Q: When should hash indexes be used? `[Junior]`

**A:** Hash index phù hợp lookup equality (`=`) rất nhanh.
Không phù hợp cho range query (`>`, `<`, `BETWEEN`) vì không có thứ tự.

### 🟢 Q: What is bitmap index good for? `[Junior]`

**A:** Bitmap index hiệu quả với cột cardinality thấp (vd gender, status).
Thường hữu ích trong OLAP vì phép toán bitwise trên tập lớn rất nhanh.

### 🟡 Q: What is full-text index and why not LIKE '%x%'? `[Mid]`

**A:** Full-text index tokenize văn bản, hỗ trợ stemming/ranking/boolean query.
`LIKE '%term%'` thường không tận dụng B-tree tốt, dễ full scan.

## 4. Composite and Covering Index / Index tổng hợp và bao phủ

### 🟡 Q: Why does column order matter in composite index? `[Mid]`

**A:** Composite index tuân theo leftmost-prefix. Điều kiện lọc/sort phải phù hợp thứ tự cột để tối ưu.
Ví dụ index (tenant_id, created_at) tốt cho query theo tenant rồi range time.

### 🟡 Q: What is a covering index? `[Mid]`

**A:** Covering index chứa đủ cột cần cho query (lọc + select), nên DB không phải lookup lại table heap/cluster.
Giảm random I/O đáng kể cho query hot path.

### 🟡 Q: What is a partial/filtered index? `[Mid]`

**A:** Partial index chỉ index tập con rows (ví dụ `WHERE deleted_at IS NULL`).
Giảm kích thước index và tăng hiệu quả cho workload có predicate cố định.

## 5. Index Maintenance Cost / Chi phí bảo trì index

### 🟢 Q: Why too many indexes can hurt writes? `[Junior]`

**A:** Mỗi INSERT/UPDATE/DELETE phải cập nhật nhiều index, tăng write amplification.
Index nhiều cũng tăng storage và thời gian VACUUM/rebuild.

### 🟡 Q: How to detect unused indexes? `[Mid]`

**A:** Dựa vào thống kê usage của DB (pg_stat_user_indexes, sys DMVs, etc.) và workload thực tế.
Unused index nên cân nhắc drop sau thời gian quan sát đủ dài.

## 6. Query Optimization Basics / Tối ưu truy vấn cơ bản

### 🟡 Q: How to read EXPLAIN/ANALYZE output? `[Mid]`

**A:** Nhìn access path (seq scan/index scan), join type (nested/hash/merge), estimated rows vs actual rows.
Sai lệch estimate lớn thường chỉ ra statistics lỗi thời hoặc predicate phức tạp.

### 🟡 Q: Common slow query patterns to avoid? `[Mid]`

**A:** SELECT \* không cần thiết, function trên cột indexed (mất khả năng dùng index), OR condition thiếu index hỗ trợ.
Join không có điều kiện lọc sớm hoặc query không giới hạn pagination.

### 🟡 Q: What is the N+1 query problem? `[Mid]`

**A:** Ứng dụng chạy 1 query lấy danh sách rồi N query con cho từng item.
Khắc phục bằng eager loading, batching, hoặc JOIN có chọn lọc.
Cross-reference: `fe-track/03-react/09-performance-optimization.md` cho N+1 từ phía API consumption.

## 7. Planner, Statistics, and Cardinality / Bộ lập kế hoạch và thống kê

### 🔴 Q: How does query planner choose indexes? `[Senior]`

**A:** Planner ước lượng cardinality/selectivity dựa trên statistics (histogram, MCV, null fraction).
Nó so sánh cost model của nhiều plan rồi chọn plan có cost thấp nhất.
Nếu statistics cũ, planner có thể chọn sai plan dù index tồn tại.

### 🔴 Q: Why are database statistics critical? `[Senior]`

**A:** Vì optimizer ra quyết định dựa trên estimate, không đọc toàn bộ dữ liệu thật khi lập kế hoạch.
ANALYZE định kỳ và autovacuum/autostats đúng ngưỡng giúp plan ổn định.

## 8. Denormalization and Pooling / Phi chuẩn hóa và connection pooling

### 🟡 Q: When is denormalization worth it? `[Mid]`

**A:** Khi read-heavy, join đắt đỏ, và chấp nhận duplication + pipeline đồng bộ dữ liệu.
Cần xác định clearly source of truth và cơ chế reconcile.

### 🟡 Q: Why do we need connection pooling? `[Mid]`

**A:** Mở kết nối DB mới cho mỗi request rất tốn handshake/auth/resource.
Pool tái sử dụng connection, giới hạn concurrent load lên DB, cải thiện stability.
Cross-reference: `be-track/02-backend-knowledge/01-api-design.md` (backend throughput concerns).

## 9. Interview Drill Q&A / Bộ câu hỏi luyện phỏng vấn

### 🟢 Q: If a query uses WHERE a=... AND b=..., what index first? `[Junior]`

**A:** Bắt đầu từ cột có selectivity cao và xuất hiện ổn định trong predicate/query pattern.
Nhưng cần kiểm tra thêm ORDER BY/GROUP BY để chọn thứ tự composite thực tế.

### 🟢 Q: Can index always make queries faster? `[Junior]`

**A:** Không. Với bảng nhỏ hoặc selectivity thấp, planner có thể chọn seq scan nhanh hơn.
Index cũng làm write chậm hơn.

### 🟡 Q: How to optimize OFFSET pagination at high page numbers? `[Mid]`

**A:** Dùng keyset/cursor pagination thay vì OFFSET lớn.
Kết hợp index phù hợp theo cột sort.

### 🟡 Q: How do covering indexes help APIs? `[Mid]`

**A:** Giảm heap lookup nên endpoint read-heavy có thể giảm p95 đáng kể.
Đặc biệt hữu ích cho dashboard/list endpoints.

### 🟡 Q: What does 'index selectivity' mean? `[Mid]`

**A:** Là mức độ index lọc được ít rows so với tổng rows; selectivity cao thường tốt cho index scan.
Cột boolean thường selectivity thấp, không phải lúc nào cũng nên index riêng.

### 🔴 Q: How to diagnose parameter sniffing issues? `[Senior]`

**A:** So sánh execution plan giữa parameter khác nhau, kiểm tra plan cache reuse.
Có thể cần hint/recompile/query rewrite tùy hệ DB.

### 🔴 Q: When should we use materialized views? `[Senior]`

**A:** Khi truy vấn tổng hợp nặng lặp lại nhiều lần và chấp nhận độ trễ refresh.
Cần chiến lược refresh (full/incremental) phù hợp SLO.

### 🔴 Q: How to avoid over-indexing in microservices? `[Senior]`

**A:** Áp dụng performance budget cho index, review theo endpoint hot path và query logs.
Xóa index không dùng và ưu tiên composite thay vì nhiều index đơn lẻ chồng chéo.

### 🔴 Q: Why can EXPLAIN estimate be very wrong on skewed data? `[Senior]`

**A:** Vì histogram sampling không phản ánh hết phân phối lệch hoặc correlation giữa nhiều cột.
Có thể cần extended statistics hoặc query rewrite.

### 🟡 Q: What is a practical index tuning loop? `[Mid]`

**A:** Thu thập slow query -> EXPLAIN ANALYZE -> đề xuất index/query rewrite -> benchmark -> rollout có giám sát.
Lặp lại theo chu kỳ release.

## 10. Cross-References / Tài liệu liên quan

- `docs/shared/03-database/database-theory.md`
- `docs/shared/01-cs-fundamentals/complexity-analysis.md`
- `docs/be-track/03-database-advanced/02-indexing-optimization.md`
- `docs/be-track/03-database-advanced/01-sql-fundamentals.md`
- `docs/be-track/01-golang/05-testing-profiling.md`
- `docs/fe-track/modules/10-cs-fundamentals.md`

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: How do you choose which columns to index? / Cách chọn columns nào cần đánh index? 🟡 Mid

**A:** Index columns used in: **WHERE clauses** (filter conditions), **JOIN conditions** (foreign keys), **ORDER BY** (avoid sort), **GROUP BY**. Avoid indexing: low-cardinality columns (boolean, status with few values), write-heavy tables (every write updates indexes), columns rarely queried.

```
Index candidates:
user_id, email, created_at, status (high-cardinality)

Composite index order matters:
INDEX(status, user_id, created_at)

Query: WHERE status = 'active' AND user_id = 123 → uses index
Query: WHERE user_id = 123                       → cannot use index fully
       (first column must match for index use)

ESR Rule (Equality, Sort, Range):
= first, then ORDER BY, then range conditions
INDEX(status, created_at) for:
WHERE status = 'active' ORDER BY created_at → optimal
```

Vietnamese explanation: Composite index: left-prefix rule (mỗi query phải match từ leftmost column). Too many indexes: write overhead (each INSERT/UPDATE/DELETE updates all indexes). Monitor: `pg_stat_user_indexes` để tìm unused indexes. Index bloat: dead tuples từ UPDATE → vacuuming important. Partial index: `INDEX ON orders(user_id) WHERE status = 'pending'` — nhỏ hơn, nhanh hơn for specific queries.

---

### Q: What is a covering index and how does it help? / Covering index là gì và tại sao hữu ích? 🟡 Mid

**A:** A covering index includes all columns needed by a query — the DB can satisfy the query entirely from the index without fetching the actual table rows (heap). This enables "Index Only Scan" — much faster.

```sql
-- Query needing user_id, email, created_at
SELECT email, created_at FROM users WHERE user_id = 123;

-- Without covering index:
-- 1. Index scan: find rows with user_id=123 (get row pointers)
-- 2. Heap fetch: go to table to get email, created_at
-- = 2 I/O operations

-- With covering index:
CREATE INDEX ON users(user_id) INCLUDE (email, created_at);
-- OR (PostgreSQL syntax):
CREATE INDEX ON users(user_id, email, created_at);
-- Query fully served from index — no heap fetch!
-- EXPLAIN shows: "Index Only Scan"
```

Vietnamese explanation: INCLUDE clause (PostgreSQL 11+): columns added to leaf nodes only (not search key) → smaller index. Use for: frequently run queries with specific column sets, reporting queries, API response queries. Trade-off: larger index size. Check: `pg_stat_user_tables.idx_scan` và `heap_blks_read` ratio để xác định covering index value.

---

## Interview Q&A Summary / Tổng Kết Câu Hỏi Phỏng Vấn

| #   | Question                             | Difficulty | Core Concept    | Key Signal                                                 |
| --- | ------------------------------------ | ---------- | --------------- | ---------------------------------------------------------- |
| 1   | Why full table scan expensive?       | 🟢         | B+Tree          | O(n) I/O vs O(log n) with index                            |
| 2   | How index reduces latency?           | 🟢         | B+Tree          | Ordered/hash structure → skip sequential scan              |
| 3   | B-tree vs B+tree?                    | 🟡         | B+Tree          | B+Tree: data in leaves only, leaf linked list for ranges   |
| 4   | Why B+Tree not B-Tree?               | 🟡         | B+Tree          | Higher fanout, range scan via linked list                  |
| 5   | When use hash index?                 | 🟢         | Specialized     | Equality only O(1), no ranges                              |
| 6   | What is bitmap index?                | 🟢         | Specialized     | Low-cardinality OLAP, bitwise AND/OR                       |
| 7   | Full-text vs LIKE?                   | 🟡         | Specialized     | Full-text: tokenize+rank, LIKE '%x%' = scan                |
| 8   | Composite index column order?        | 🟡         | Composite       | Leftmost prefix rule, ESR ordering                         |
| 9   | What is covering index?              | 🟡         | Composite       | All columns in index → Index Only Scan                     |
| 10  | What is partial index?               | 🟡         | Composite       | Subset of rows → smaller, faster for specific queries      |
| 11  | Why too many indexes hurt writes?    | 🟢         | Maintenance     | Write amplification: each write updates all indexes        |
| 12  | How detect unused indexes?           | 🟡         | Maintenance     | pg_stat_user_indexes where idx_scan = 0                    |
| 13  | How read EXPLAIN output?             | 🟡         | EXPLAIN         | Access path, join type, estimated vs actual rows           |
| 14  | Common slow query patterns?          | 🟡         | EXPLAIN         | SELECT \*, function on indexed col, N+1, no LIMIT          |
| 15  | N+1 query problem?                   | 🟡         | EXPLAIN         | 1 + N queries → eager load / JOIN / batch                  |
| 16  | How planner chooses indexes?         | 🔴         | Optimizer       | Cost-based: cardinality × I/O cost per plan                |
| 17  | Why are statistics critical?         | 🔴         | Optimizer       | Wrong stats → wrong plan → slow query                      |
| 18  | When denormalize?                    | 🟡         | Denormalization | Read-heavy + complex JOINs + measured bottleneck           |
| 19  | Why connection pooling?              | 🟡         | Pooling         | Reuse connections, avoid handshake per request             |
| 20  | Index for WHERE a=x AND b=y?         | 🟢         | Composite       | High selectivity first, check ORDER BY/GROUP BY            |
| 21  | Can index always help?               | 🟢         | B+Tree          | No: small tables, low selectivity, write cost              |
| 22  | OFFSET pagination fix?               | 🟡         | EXPLAIN         | Keyset/cursor pagination + index on sort column            |
| 23  | Covering index for APIs?             | 🟡         | Composite       | Reduce heap lookup → lower p95 for list endpoints          |
| 24  | Index selectivity?                   | 🟡         | Optimizer       | High selectivity = few rows match = good for index         |
| 25  | Parameter sniffing?                  | 🔴         | Optimizer       | Cached plan bad for different parameter distributions      |
| 26  | Materialized views?                  | 🔴         | Denormalization | Pre-computed aggregate, refresh strategy for SLO           |
| 27  | Over-indexing in microservices?      | 🔴         | Maintenance     | Performance budget, review hot path, drop unused           |
| 28  | EXPLAIN wrong on skewed data?        | 🔴         | Optimizer       | Histogram sampling misses skew, need extended stats        |
| 29  | Practical index tuning loop?         | 🟡         | Maintenance     | Slow query → EXPLAIN → index/rewrite → benchmark → monitor |
| 30  | Which columns to index? (bilingual)  | 🟡         | Composite       | WHERE/JOIN/ORDER BY; ESR rule; monitor pg_stat             |
| 31  | Covering index explained (bilingual) | 🟡         | Composite       | INCLUDE clause, Index Only Scan, no heap fetch             |

**Distribution:** 🟢 Junior (7) | 🟡 Mid (18) | 🔴 Senior (6)

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Nhanh

> **"Product search query on 50M rows takes 8 seconds. EXPLAIN shows Seq Scan. There's a composite index on (category, price) but it's not being used. Why?"**

**30-second answer / Trả lời 30 giây:**
Three likely reasons: (1) Query uses `ORDER BY created_at DESC` but index doesn't cover sort column — add `created_at` to composite (ESR: category=equality, created_at=sort, price=range). (2) Category selectivity too low — if 40% of products are 'electronics', optimizer prefers Seq Scan. (3) Stale statistics — run ANALYZE to update cardinality estimates. Verify with EXPLAIN ANALYZE after each change.

**Follow-up / Hỏi thêm:** "After adding the right composite index, queries are fast but write throughput dropped 30%. How do you balance read and write performance?" → Audit all indexes (pg_stat_user_indexes), drop unused, consolidate overlapping composites. Consider covering index with INCLUDE to reduce total index count.

---

## Self-Check / Tự Kiểm Tra

> Đóng tài liệu lại và trả lời:

| #   | Type           | Question                                                                    | Key Points                                                                               |
| --- | -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | B+Tree lookup cho WHERE age = 35 mất bao nhiêu bước?                        | Root → internal → leaf = ~3 steps (height of tree), O(log n)                             |
| 2   | 🎨 Visual      | Vẽ composite index (status, created_at) serving WHERE + ORDER BY            | Leaf nodes: sorted by status first, then created_at within each status group             |
| 3   | 🛠️ Application | Design indexes cho e-commerce search: category + price range + sort by date | ESR: INDEX(category, created_at DESC, price) + INCLUDE(name, image_url)                  |
| 4   | 🐛 Debug       | Index exists nhưng EXPLAIN vẫn shows Seq Scan — 3 causes                    | Low selectivity, stale stats, function on column, type mismatch                          |
| 5   | 🎓 Teach       | Giải thích cho junior tại sao 10 indexes trên 1 table là anti-pattern       | Each INSERT updates 11 structures (heap + 10 indexes), write amplification → slow writes |

💬 **Feynman Prompt:** Giải thích tại sao `WHERE status = 'active'` index không hiệu quả khi 90% rows có status='active' — và tại sao PostgreSQL chọn Seq Scan thay vì Index Scan trong trường hợp này.

---

## 📅 Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When   | Focus                                                     |
| ----- | ------ | --------------------------------------------------------- |
| 1     | Day 1  | B+Tree basics, single vs composite index, leftmost prefix |
| 2     | Day 3  | ESR rule, covering index, EXPLAIN red flags               |
| 3     | Day 7  | Hash/bitmap/full-text, partial index, N+1 problem         |
| 4     | Day 14 | Optimizer internals, statistics, parameter sniffing       |
| 5     | Day 30 | Full cold call: design index strategy for 100M row table  |

---

## Connections / Liên Kết

**Same track (Shared — Database):**

- ⬅️ [Database Theory](./database-theory.md) — relational model and ACID foundation
- 🔗 [NoSQL & NewSQL](./03-nosql-and-newsql.md) — LSM-Tree vs B+Tree for write optimization
- 🔗 [Sharding & Transactions](./04-sharding-and-transactions.md) — shard key follows index design principles
- ➡️ [BE Indexing Deep Dive](../../be-track/03-database-advanced/02-indexing-optimization.md) — Go-specific implementation

**Cross-track:**

- 🔗 [Complexity Analysis](../01-cs-fundamentals/complexity-analysis.md) — O(log n) vs O(n) theoretical basis
- 🔗 [SQL Fundamentals (BE)](../../be-track/03-database-advanced/01-sql-fundamentals.md) — query patterns and EXPLAIN
- 🔗 [Caching Patterns](../02-system-design/caching-patterns.md) — cache as alternative to over-indexing
