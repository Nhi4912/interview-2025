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

> 🧠 **Memory Hook:** B+Tree = mục lục sách nhiều cấp — internal nodes chỉ đường, leaf nodes chứa dữ liệu + linked list cho range scan

**Tại sao tồn tại? / Why does this exist?**

Full table scan đọc toàn bộ dữ liệu — O(n) — không chấp nhận được với hàng triệu rows → **Why?** cần cấu trúc tìm kiếm O(log n). B+Tree với fanout ~500 giữ chiều cao cây chỉ 3-4 levels cho hàng trăm triệu rows → **Why?** mỗi level là một disk I/O, ít levels = ít I/O = cực nhanh. Leaf nodes liên kết thành linked list → **Why?** range scan (`BETWEEN`, `>`, `<`) không cần quay lại tree — chỉ đi theo linked list, đạt O(log n + k) thay vì O(k × log n).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Thư viện với bảng thư mục nhiều cấp: tầng (root) → khu vực (internal nodes) → kệ sách (leaf nodes). Tìm sách: tầng → khu → kệ = 3 bước, dù thư viện có 1 triệu cuốn. Range scan = khi tìm được kệ đầu tiên, chỉ cần đi dọc theo kệ — không phải quay về bảng thư mục mỗi lần.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **B+Tree vs LSM-Tree:** B+Tree tối ưu cho read (in-place update), LSM-Tree tối ưu cho write (append-only + compaction). Cassandra, RocksDB, LevelDB dùng LSM-Tree — chọn đúng engine theo workload.
- **Page splits:** Khi leaf node đầy, split tạo 2 nodes mới → tăng tree height nhẹ và gây fragmentation. Monitor bloat với `pgstattuple`, REINDEX định kỳ.
- **Clustered vs Non-clustered:** InnoDB (MySQL) clustered index theo primary key — data rows sắp xếp vật lý theo PK. PostgreSQL heap-organized — tất cả indexes là non-clustered, trỏ qua CTID.
- **Fanout ảnh hưởng chiều cao:** Fanout thấp → tree cao hơn → nhiều disk I/O. Lý do DB dùng page 8KB–16KB: maximize fanout, minimize height.
- **NULL trong index:** PostgreSQL index NULL values; `IS NULL` predicate thường không selective. Cân nhắc partial index `WHERE col IS NOT NULL` để loại NULLs khỏi index.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                              | Tại sao sai                                            | Đúng là                                                 |
| ------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------- |
| Assume index always faster than scan | Low selectivity → index + lookup > sequential scan     | EXPLAIN: DB may choose Seq Scan when >10-15% rows match |
| Confuse B-Tree with B+Tree           | B-Tree stores data in all nodes; B+Tree only in leaves | B+Tree: internal=routing, leaf=data+linked list         |
| Ignore index page splits             | Writes to full leaf → split → fragmentation over time  | Monitor bloat, REINDEX periodically                     |

🎯 **Interview Pattern:** "Why B+Tree not hash?" → B+Tree: range queries, ORDER BY, LIKE prefix. Hash: O(1) equality only.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Complexity Analysis — O(log n) vs O(n)](../01-cs-fundamentals/complexity-analysis.md)
- ➡️ Để hiểu tiếp: [Composite & Covering Index](#concept-2-composite--covering-index)

### Concept 2: Composite & Covering Index

> 🧠 **Memory Hook:** ESR = Equality → Sort → Range — thứ tự vàng cho composite index design

**Tại sao tồn tại? / Why does this exist?**

Single-column index không đủ khi query cần WHERE nhiều cột + ORDER BY → **Why?** DB phải merge nhiều index scans hoặc dùng filesort, đều chậm. Composite index giải quyết: một index phục vụ nhiều conditions cùng lúc → **Why?** leftmost prefix rule cho phép một index match WHERE + ORDER BY + một phần SELECT. Covering index đi xa hơn: loại bỏ heap lookup hoàn toàn → **Why?** khi index chứa đủ tất cả columns cần thiết, DB chạy "Index Only Scan" — không cần đọc thêm table rows, nhanh nhất có thể.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Danh bạ điện thoại sắp xếp theo (Họ, Tên): tìm "Nguyễn Văn An" cực nhanh. Nhưng tìm "tất cả người tên An" phải duyệt toàn bộ — leftmost prefix rule: cột đầu tiên phải khớp để index có tác dụng.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **INCLUDE columns (PostgreSQL 11+):** Stored only in leaf nodes, không phải search key — index nhỏ hơn, vẫn cover queries. Không dùng được trong WHERE clause.
- **Leftmost prefix breaks:** Index (a, b, c) không dùng được cho `WHERE b=1` hoặc `WHERE c=1` — chỉ hoạt động từ cột đầu tiên trở đi theo thứ tự.
- **Quá nhiều cột trong composite:** Index lớn → write chậm hơn, storage nhiều hơn. Thực tế: max 3-4 cột, dựa trên top query patterns thực tế.
- **Overlapping indexes:** Index (a, b) và (a, b, c) — cái đầu thường dư thừa. Audit định kỳ để drop/merge, giảm write amplification.
- **Sort direction trong composite:** `INDEX ON t(status, created_at DESC)` — direction matters cho ORDER BY. Khớp direction giữa index và query để tránh backward scan penalty.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                       | Tại sao sai                              | Đúng là                                             |
| ----------------------------- | ---------------------------------------- | --------------------------------------------------- |
| Range column before equality  | Can't use index for equality after range | ESR: equality first, range last                     |
| Too many columns in composite | Large index → slow writes, more storage  | Max 3-4 columns, based on top query patterns        |
| Skip covering index analysis  | Extra heap lookups on every query        | Check EXPLAIN for "Index Scan" vs "Index Only Scan" |

🎯 **Interview Pattern:** "Design index for WHERE status='active' ORDER BY created_at" → Composite (status, created_at), ESR rule

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [B+Tree & Index Structure](#concept-1-btree--index-structure)
- ➡️ Để hiểu tiếp: [EXPLAIN & Query Plans](#concept-4-explain--query-plans)

### Concept 3: Specialized Indexes

> 🧠 **Memory Hook:** B+Tree là dao đa năng — Hash/Bitmap/Full-text là dao chuyên dụng cho từng bài toán

**Tại sao tồn tại? / Why does this exist?**

B+Tree giỏi mọi thứ nhưng không tốt nhất cho tất cả → **Why?** equality lookup với B+Tree là O(log n), hash là O(1) — khi chỉ cần equality, hash nhanh hơn. Full-text search với B+Tree chỉ match prefix, không handle stemming/ranking → **Why?** cần inverted index (GIN/GiST) để tokenize và rank text. Bitmap index cho low-cardinality OLAP → **Why?** bitwise AND/OR trên hàng triệu rows cực nhanh khi cardinality thấp (gender, status 3-4 giá trị).

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Dụng cụ nhà bếp: B+Tree là dao đầu bếp (làm được mọi thứ). Hash index là cái bào tỏi (chỉ một việc, cực nhanh). Full-text index là máy xay thịt (xử lý text phức tạp). Bitmap là cái lọc (AND/OR siêu nhanh cho dữ liệu thưa). Chọn đúng dụng cụ cho đúng bài toán.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Partial index:** `CREATE INDEX ON orders(user_id) WHERE status = 'pending'` — 10x nhỏ hơn full index, nhanh hơn cho workload cụ thể. Lý tưởng khi chỉ query một subset rows thường xuyên.
- **Hash index và WAL recovery:** PostgreSQL hash indexes không WAL-logged trước PG10 — sau crash cần REINDEX. PG10+ đã fix nhưng hash vẫn hiếm được dùng production.
- **Bitmap lock contention:** Bitmap index trong OLTP với UPDATE thường xuyên → row-level lock contention cao. Chỉ dùng cho OLAP / read-heavy workloads.
- **GIN vs GiST:** GIN nhanh hơn cho lookup (exact token match), GiST nhanh hơn cho insert và hỗ trợ fuzzy/spatial search. Chọn GIN cho full-text, GiST cho geometric/range types.
- **Partial index và query planner:** Planner chỉ dùng partial index khi WHERE clause của query khớp chính xác với WHERE clause của index — predicate phải viết giống hệt nhau.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                             | Tại sao sai                                 | Đúng là                                   |
| ----------------------------------- | ------------------------------------------- | ----------------------------------------- |
| Use hash index for range queries    | Hash has no ordering                        | B+Tree for ranges, hash for equality only |
| Full-text with LIKE '%term%'        | LIKE with leading wildcard can't use B+Tree | Use GIN/GiST full-text index instead      |
| Bitmap on OLTP with frequent writes | Bitmap lock contention on writes            | Bitmap for OLAP/read-heavy only           |

🎯 **Interview Pattern:** "When use hash vs B+Tree?" → Hash: O(1) equality only. B+Tree: equality + range + sort + prefix.

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [B+Tree & Index Structure](#concept-1-btree--index-structure)
- ➡️ Để hiểu tiếp: [EXPLAIN & Query Plans](#concept-4-explain--query-plans)

### Concept 4: EXPLAIN & Query Plans

> 🧠 **Memory Hook:** EXPLAIN = X-ray cho query — thấy bên trong DB đang làm gì thật sự

**Tại sao tồn tại? / Why does this exist?**

"Query chậm" là triệu chứng — không nói lên nguyên nhân → **Why?** cần công cụ thấy execution path thực tế của DB. EXPLAIN cho thấy DB chọn plan nào (Seq Scan, Index Scan, Hash Join…) → **Why?** chỉ khi biết DB đang làm gì mới có thể sửa đúng chỗ (thêm index, viết lại query, update statistics). EXPLAIN ANALYZE chạy query thật và trả về số thực → **Why?** estimate vs actual rows khác nhau nhiều = statistics lỗi thời — phải fix stats trước khi thêm index để tránh optimize sai chỗ.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Bác sĩ chụp X-quang: bệnh nhân kêu đau (query chậm), nhưng không biết tại sao. X-quang (EXPLAIN) cho thấy xương gãy đúng chỗ nào (Seq Scan trên 10M rows, missing index, wrong join order). Không có X-ray thì bác sĩ chỉ đoán mò — và thường đoán sai.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **EXPLAIN BUFFERS:** PostgreSQL option hiển thị `shared hit` (từ cache) vs `shared read` (từ disk). `read` cao = thiếu `shared_buffers` hoặc working set lớn hơn RAM.
- **EXPLAIN vs EXPLAIN ANALYZE:** EXPLAIN chỉ estimate (không chạy query). EXPLAIN ANALYZE chạy query thật — cẩn thận với DML (INSERT/UPDATE/DELETE), wrap trong transaction và rollback.
- **Parallel query plans:** PostgreSQL có thể dùng parallel workers — `Gather` node xuất hiện trong plan. Chỉnh `max_parallel_workers_per_gather` nếu table lớn nhưng không chạy parallel.
- **JIT compilation:** PostgreSQL 11+ có JIT cho complex queries — thấy "JIT: Functions" trong EXPLAIN output. JIT có overhead với short-lived queries — có thể disable per session.
- **Plan instability:** Cùng query, khác parameter → khác plan (parameter sniffing). Nếu plan flip-flop, cần extended statistics hoặc query hint/recompile.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                    | Đúng là                                       |
| ------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| Only EXPLAIN without ANALYZE          | Estimates may be wrong — need actual execution | Always use EXPLAIN ANALYZE for real numbers   |
| Ignore "rows" column                  | Wrong estimate → wrong plan choice             | Compare estimated vs actual rows              |
| Fix query without re-checking EXPLAIN | May not actually use new index                 | Always verify with EXPLAIN after adding index |

🎯 **Interview Pattern:** "How debug slow query?" → EXPLAIN ANALYZE → check access type, row estimates, join order

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [B+Tree & Index Structure](#concept-1-btree--index-structure) | [Composite & Covering Index](#concept-2-composite--covering-index)
- ➡️ Để hiểu tiếp: [Query Optimizer & Statistics](#concept-5-query-optimizer--statistics)

### Concept 5: Query Optimizer & Statistics

> 🧠 **Memory Hook:** Optimizer = GPS nội bộ — chọn route dựa trên traffic data (statistics). Stale data → wrong route.

**Tại sao tồn tại? / Why does this exist?**

Một SQL query có thể thực thi theo nhiều cách — optimizer chọn cách rẻ nhất → **Why?** không phải developer chọn execution plan, DB tự tính cost của từng plan và pick cheapest. Cost model dựa trên statistics (cardinality, histogram, null fraction) → **Why?** statistics cũ = estimate sai = plan sai = query chậm dù có đủ indexes. Autovacuum/autoanalyze giúp statistics luôn fresh → **Why?** nếu thiếu fresh stats, optimizer blind — có thể chọn Seq Scan thay vì Index Scan dù index đúng đã tồn tại.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

GPS chọn đường dựa trên dữ liệu giao thông real-time: nếu data giao thông cũ (không update), GPS gửi bạn vào đường tắc. DB optimizer làm y hệt: stale statistics → chọn plan tệ dù có index đúng. Update statistics như update GPS traffic data.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Extended statistics (PostgreSQL 10+):** Mặc định optimizer giả định các cột độc lập. Khi 2 cột tương quan (city + zip_code), dùng `CREATE STATISTICS` để dạy optimizer về correlation — giúp estimate chính xác hơn.
- **Parameter sniffing:** SQL Server/MySQL cache execution plan theo parameter đầu tiên. Parameter khác distribution → cùng plan → chậm. Fix: `OPTION(RECOMPILE)` (SQL Server) hoặc query rewrite.
- **Planner hints PostgreSQL:** PostgreSQL không có optimizer hints (by design). Dùng `SET enable_seqscan=off` cho session để force Index Scan — chỉ để debug, không dùng production.
- **Statistics target:** `ALTER TABLE t ALTER COLUMN c SET STATISTICS 500` — tăng từ default 100. Cho columns với skewed distribution, tăng statistics target giúp estimate chính xác hơn.
- **Join order matters:** Optimizer thử nhiều join orders — với nhiều tables, wrong join order → Nested Loop O(n²) thay vì Hash Join O(n). Dùng `join_collapse_limit` để control.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                       | Tại sao sai                                   | Đúng là                                                   |
| ----------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Never run ANALYZE             | Stale stats → optimizer chooses wrong plan    | Schedule ANALYZE, monitor autovacuum                      |
| Trust plan cache blindly      | Parameter sniffing → bad plan reused          | Check actual vs estimated rows, force recompile if needed |
| Override optimizer with hints | Hint locks plan — won't adapt to data changes | Hints as last resort; fix stats and indexes first         |

🎯 **Interview Pattern:** "Why can EXPLAIN estimate be wrong?" → Stale statistics, correlated columns, skewed data

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [EXPLAIN & Query Plans](#concept-4-explain--query-plans)
- ➡️ Để hiểu tiếp: [Index Maintenance & Costs](#concept-6-index-maintenance--costs)

### Concept 6: Index Maintenance & Costs

> 🧠 **Memory Hook:** Mỗi index = cái giá phải trả khi write — INSERT/UPDATE/DELETE đều update tất cả indexes

**Tại sao tồn tại? / Why does this exist?**

Indexes không free — mỗi index là overhead cho mọi write operation → **Why?** INSERT phải update heap + N indexes, nếu có 10 indexes = 11 write operations mỗi row. Dead tuples từ UPDATE/DELETE accumulate trong indexes → **Why?** PostgreSQL MVCC không xóa row cũ ngay, index entries vẫn trỏ vào dead tuples — index bloat làm scan chậm dần. VACUUM/REINDEX cleanup bloat → **Why?** nếu không vacuum, bloat tăng dần, index pages đầy dead entries, fanout giảm, tree cao hơn, performance suy giảm từ từ theo thời gian.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Thư viện với 10 bộ mục lục chéo: mỗi cuốn sách mới nhập phải cập nhật cả 10 bộ mục lục. Nếu mục lục nào không ai dùng, vẫn phải update — lãng phí. Kiểm tra và bỏ mục lục không ai dùng, giữ thư viện gọn và nhanh.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **HOT (Heap-Only Tuple):** PostgreSQL optimization — nếu updated column không được index, row mới nằm cùng page → không cần update index. Thêm index trên column thường xuyên update phá vỡ HOT → write chậm đáng kể.
- **CONCURRENTLY:** `CREATE INDEX CONCURRENTLY` không lock table nhưng chậm hơn, cần 2 passes. `REINDEX CONCURRENTLY` (PG12+) tương tự. Production: luôn dùng CONCURRENTLY.
- **Index bloat detection:** `SELECT * FROM pgstattuple('index_name')` — xem dead_tuple_percent và bloat ratio. >30% bloat → cân nhắc `REINDEX CONCURRENTLY`.
- **Partial index giảm write cost:** Index chỉ trên subset rows → ít entries hơn, update ít hơn khi write không match WHERE clause của index — hiệu quả kép: nhỏ hơn + ít write amplification.
- **Foreign key indexes:** PostgreSQL không tự tạo index cho FK (khác MySQL InnoDB). Missing FK index → lock contention khi DELETE parent rows. Luôn index FK columns.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                              | Đúng là                                                    |
| ------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| Create index for every column         | Write amplification, storage waste       | Index only WHERE/JOIN/ORDER BY columns from actual queries |
| Never monitor index usage             | Unused indexes slow writes for nothing   | Check pg_stat_user_indexes quarterly                       |
| Drop index without observation period | May miss infrequent but critical queries | Monitor for 30+ days before dropping                       |

🎯 **Interview Pattern:** "Too many indexes — what to do?" → Monitor usage stats, drop unused, consolidate overlapping composites

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [B+Tree & Index Structure](#concept-1-btree--index-structure) | [Query Optimizer & Statistics](#concept-5-query-optimizer--statistics)
- ➡️ Để hiểu tiếp: [Denormalization & Pooling](#concept-7-denormalization--pooling)

### Concept 7: Denormalization & Pooling

> 🧠 **Memory Hook:** Denormalization = duplicate data intentionally for read speed — bất đắc dĩ, không phải default

**Tại sao tồn tại? / Why does this exist?**

Normalized schema tối ưu cho write (no duplication, easy update) nhưng đắt đỏ cho read (nhiều JOINs) → **Why?** ở scale lớn, 3-4 table JOINs với millions of rows tốn cả giây dù có index. Denormalization precomputes joins bằng cách duplicate data → **Why?** trade-off: write phức tạp hơn (update nhiều chỗ), nhưng read cực nhanh (single table scan). Connection pooling giải quyết vấn đề khác: mỗi DB connection tốn ~10MB RAM + handshake overhead → **Why?** 1000 requests/s = 1000 connections = 10GB RAM chỉ cho connections — pooling giới hạn connections thực, reuse cho nhiều requests.

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Báo cáo in sẵn vs query real-time: báo cáo in sẵn (denormalized view) đọc ngay, nhưng có thể hơi cũ. Query real-time (normalized JOINs) luôn fresh nhưng mất thời gian tính. Connection pooling như taxi dùng chung: không mỗi hành khách mua taxi riêng — taxi (connection) được tái sử dụng cho nhiều hành khách (requests).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

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

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Materialized views:** Database-managed denormalization với `REFRESH MATERIALIZED VIEW CONCURRENTLY` — không lock read. Tốt cho dashboards, không phù hợp real-time (có độ trễ refresh).
- **CDC pipeline cho sync:** Khi denormalize, dùng Change Data Capture (Debezium, Kafka Connect) để sync updates từ source → denormalized tables. Tránh update thủ công — dễ miss và dẫn đến inconsistency.
- **Connection pool exhaustion:** Pool full → requests queue/timeout. Monitor pool wait time; không tăng pool size vô tội vạ — tăng pool = tăng DB load. Fix root cause: slow queries, connection leaks.
- **PgBouncer modes:** Session pooling (1 connection per client session), transaction pooling (reuse after each transaction — hiệu quả nhất), statement pooling (aggressive, breaks prepared statements).
- **Premature denormalization:** Normalize trước, chỉ denormalize khi có bằng chứng cụ thể (EXPLAIN, slow query logs, SLO breach). Denormalization sớm làm schema phức tạp không cần thiết.

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                        | Đúng là                                                   |
| ---------------------------------------- | -------------------------------------------------- | --------------------------------------------------------- |
| Denormalize before measuring             | May not need it — premature optimization           | Normalize first, denormalize with evidence (EXPLAIN, SLO) |
| Pool size = 100 connections              | Each connection = ~10MB RAM, too many = contention | Formula: cores \* 2 + spindles, usually 10-30             |
| No source-of-truth for denormalized data | Updates miss some copies → inconsistency           | Clear ownership, CDC pipeline for sync                    |

🎯 **Interview Pattern:** "When denormalize?" → Read-heavy dashboards, hot paths with complex JOINs, after proving normalization is the bottleneck

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Database Theory — Normalization](./database-theory.md)
- ➡️ Để hiểu tiếp: [Sharding & Transactions](./04-sharding-and-transactions.md)

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
