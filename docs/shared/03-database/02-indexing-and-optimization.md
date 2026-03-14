# Indexing & Query Optimization / Đánh Chỉ Mục và Tối Ưu Truy Vấn

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Database Theory](./database-theory.md) | [Sharding & Transactions](./04-sharding-and-transactions.md) | [NoSQL & NewSQL](./03-nosql-and-newsql.md)

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
**A:** SELECT * không cần thiết, function trên cột indexed (mất khả năng dùng index), OR condition thiếu index hỗ trợ.
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

## Interview Q&A Summary / Tổng Kết

| Question | Level | Key Point |
|----------|-------|-----------|
| Which columns to index | 🟡 | WHERE/JOIN/ORDER BY columns; ESR rule for composite; avoid low-cardinality |
| Covering index | 🟡 | All needed columns in index → Index Only Scan; no heap fetch |
