# Database Indexing & Query Optimization

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> Theory-focused guide (~85% theory, 15% SQL/examples). Bilingual: English headings + Vietnamese explanations.
> Difficulty: 🟢 Junior | 🟡 Middle | 🔴 Senior
> **Prerequisites**: [SQL Fundamentals](./01-sql-fundamentals.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Tiki.vn product search:** `SELECT * FROM products WHERE category = 'phone' AND price < 5000000 ORDER BY sold_count DESC LIMIT 20` — query này chạy 3 giây vì cần full table scan 10 triệu products. DBA thêm composite index `(category, price, sold_count)` — query xuống 5ms. Nhưng khi thêm index thứ 8 vào bảng, INSERT vào `products` chậm lại 40%.

**Bài học:** Index là con dao hai lưỡi. Đúng index = read nhanh. Quá nhiều index = write chậm. Senior DB engineer biết đọc `EXPLAIN ANALYZE` và hiểu execution plan trước khi thêm/xóa index.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Index giống **mục lục cuốn sách**. Không có index: đọc từ trang 1 đến trang cuối để tìm từ "goroutine". Có index: tra mục lục → trang 247 ngay. B-Tree index như mục lục theo alphabet. Hash index như từ điển tra bằng key. Partial index như mục lục chỉ liệt kê chương quan trọng.

**Why this is interviewed:** Query optimization là kỹ năng thực tế nhất mà engineer dùng hàng ngày. Không có team nào không có "slow query" problem. Biết `EXPLAIN ANALYZE` là baseline expectation cho backend mid/senior.

## Concept Map / Bản Đồ Khái Niệm

```
[Database Index Types]
        │
        ├── B-Tree (default) → range queries, ORDER BY, LIKE 'prefix%'
        ├── Hash → equality only (=), faster than B-Tree for point lookups
        ├── GIN → arrays, JSONB, full-text search
        ├── GiST → geometric, range types
        └── Partial → index WHERE condition (smaller, faster for specific filters)
        │
[Composite Index Rule: column order matters]
        (a, b, c) → can use: a | a,b | a,b,c
                    cannot use: b | c | b,c alone (without a)
        │
[EXPLAIN ANALYZE output]
        Seq Scan → full table scan (bad for large tables)
        Index Scan → uses index (good)
        Index Only Scan → no heap access (best)
        Bitmap Heap Scan → batch index reads (good for many rows)
```

---

## Overview / Tổng Quan

Bài này cover toàn diện indexing & query optimization — từ B+ Tree fundamentals đến production monitoring. Kiến thức xây theo tầng: **index structure** giải thích tại sao nhanh, **index types** cho đúng tool, **composite/covering** tối ưu multi-column, **EXPLAIN** đọc query plan, **optimization strategies** fix real patterns, **partitioning** scale beyond single-table, **monitoring** detect regression.

| #   | Concept                         | Role                                                       | Interview Weight   |
| --- | ------------------------------- | ---------------------------------------------------------- | ------------------ |
| 1   | **Index Fundamentals**          | B+ Tree trade-off: read speed vs write cost                | 🟢 Must-know       |
| 2   | **B+ Tree & Clustered Index**   | Physical structure, clustered vs heap, double lookup       | 🟡🔴 Deep dive     |
| 3   | **Index Types**                 | B-tree, Hash, GIN, GiST, BRIN — right tool for right job   | 🟡 Mid knowledge   |
| 4   | **Composite & Covering Index**  | Leftmost prefix, column ordering, index-only scan          | 🟡🔴 Key interview |
| 5   | **EXPLAIN / EXPLAIN ANALYZE**   | Read query plans, identify bottlenecks                     | 🟡🔴 Practical     |
| 6   | **Query Optimization Patterns** | N+1, pagination, subquery, function-on-column              | 🟡 Coding round    |
| 7   | **Partitioning & Monitoring**   | Table partitioning, pg_stat_statements, write optimization | 🔴 Senior only     |

**Mối quan hệ:** Fundamentals → Types cho toolbox → Composite/Covering cho multi-column optimization → EXPLAIN verify → Optimization fix patterns → Partitioning scale → Monitoring production loop.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: Index Fundamentals

- **Memory Hook / Móc Nhớ:** "Index = sách có mục lục vs đọc từ trang 1" — O(log n) vs O(n).
- **Why exists:**
  - Level 1: Full table scan trên 10M rows mất vài giây — index lookup mất milliseconds
  - Level 2: B+ Tree balanced → height ~3-4 cho millions of rows → 3-4 disk reads max
  - Level 3: Trade-off: mỗi index thêm = write amplification (INSERT/UPDATE/DELETE phải maintain tất cả indexes) → over-indexing kills write performance
- **Common Mistakes:**
  - Index mọi column "phòng hờ" → write-heavy table chậm 5x
  - Quên check index usage → unused index vẫn tốn write cost
  - Low selectivity index (boolean column) → optimizer chọn seq scan
- **Interview Pattern:** "When to index?" → Signal: mention selectivity, write trade-off, EXPLAIN verification — không chỉ "when WHERE clause uses it"
- **Knowledge Chain:** Index Fundamentals → B+ Tree Structure → Composite Index Design → EXPLAIN verification

### Concept 2: B+ Tree & Clustered Index

- **Memory Hook / Móc Nhớ:** "InnoDB PK = data sorted on disk (clustered). PG = heap + separate indexes (non-clustered)."
- **Why exists:**
  - Level 1: Clustered index = data physically sorted by PK → range scans trên PK cực nhanh (sequential I/O)
  - Level 2: Non-clustered = separate structure → secondary index lookup = 2 B-tree traversals (index → PK → clustered index/heap)
  - Level 3: UUID as PK trong InnoDB → random page splits (không sequential) → use ULID hoặc ordered UUID. PG: BRIN index cho naturally ordered data (timestamps)
- **Common Mistakes:**
  - UUID PK trong InnoDB không biết random insert → page split hell
  - Quên covering index → always double lookup
  - Assume PostgreSQL có clustered index like InnoDB
- **Interview Pattern:** "Clustered vs non-clustered?" → Signal: explain physical storage difference, double lookup, covering index solution
- **Knowledge Chain:** B+ Tree → Clustered Index (InnoDB) → Secondary Index overhead → Covering Index optimization

### Concept 3: Index Types

- **Memory Hook / Móc Nhớ:** "B-tree = Swiss Army knife, Hash = exact match only, GIN = full-text/array, BRIN = sorted data."
- **Why exists:**
  - Level 1: Khác nhau workload cần khác nhau index — range queries ≠ equality ≠ full-text search
  - Level 2: GIN inverted index cho JSONB `@>`, array `&&`, tsvector → không thể dùng B-tree cho these operations
  - Level 3: BRIN = block range index, tiny footprint, perfect cho timestamp columns inserted in order — 1000x smaller than B-tree
- **Common Mistakes:**
  - Hash index cho range query → không work (only equality)
  - GIN index trên small table → overhead > benefit
  - Quên BRIN cho time-series data → unnecessary B-tree bloat
- **Interview Pattern:** "Which index type for X?" → Signal: match workload to index type with reasoning
- **Knowledge Chain:** Index Types → Workload Analysis → Storage Trade-offs → Monitoring Index Size

### Concept 4: Composite & Covering Index

- **Memory Hook / Móc Nhớ:** "Leftmost prefix = phone book sorted (lastname, firstname)" — search by lastname OK, firstname alone NOT OK.
- **Why exists:**
  - Level 1: Multi-column queries need multi-column indexes — single-column indexes combined = bitmap scan (slower)
  - Level 2: Column order matters: equality columns first, then range column last (ERS: Equal-Range-Sort rule)
  - Level 3: Covering index (INCLUDE) = all needed columns in index → Index Only Scan, zero heap access → fastest possible read
- **Common Mistakes:**
  - Wrong column order → index unusable for common queries
  - Range column before equality → index partial use only
  - Too many columns in covering index → write amplification, index bloat
- **Interview Pattern:** "Design composite index for query X" → Signal: explain ERS rule, leftmost prefix, covering index option
- **Knowledge Chain:** Composite Index → EXPLAIN verification → Covering Index → Index-Only Scan → Query Plan optimization

### Concept 5: EXPLAIN / EXPLAIN ANALYZE

- **Memory Hook / Móc Nhớ:** "EXPLAIN = doctor's prediction, EXPLAIN ANALYZE = actual blood test results."
- **Why exists:**
  - Level 1: Không đoán query slow ở đâu — EXPLAIN shows exactly what database will do
  - Level 2: Estimated vs actual rows mismatch → stale statistics → run ANALYZE → optimizer re-estimates
  - Level 3: Plan nodes hierarchy: Seq Scan → Index Scan → Index Only Scan (best). Join types: Nested Loop (small), Hash Join (medium), Merge Join (large sorted)
- **Common Mistakes:**
  - EXPLAIN without ANALYZE → only estimates, not reality
  - Ignore "Rows Removed by Filter" → index not selective enough
  - Run EXPLAIN ANALYZE on production with mutating query → actually modifies data! Wrap in transaction + rollback
- **Interview Pattern:** "Walk through EXPLAIN output" → Signal: identify Seq Scan as red flag, check actual vs estimated, suggest specific fix
- **Knowledge Chain:** EXPLAIN → Identify bottleneck → Design index → Re-EXPLAIN verify → Monitor pg_stat_statements

### Concept 6: Query Optimization Patterns

- **Memory Hook / Móc Nhớ:** "N+1 = hỏi từng người 1 thay vì hỏi cả lớp. OFFSET = đếm từ đầu mỗi lần."
- **Why exists:**
  - Level 1: Application-level patterns (N+1, OFFSET) cause more damage than missing indexes
  - Level 2: Function-on-column (WHERE YEAR(x)=2024) prevents index usage → rewrite as range condition
  - Level 3: Keyset pagination = cursor-based → O(log N) constant regardless of page number vs OFFSET O(N)
- **Common Mistakes:**
  - ORM hide N+1 → only visible in query logs or APM
  - Correlated subquery thay vì JOIN → O(n²) execution
  - `SELECT *` prevents covering index optimization
- **Interview Pattern:** "Optimize this slow query" → Signal: check N+1 first, then EXPLAIN, then index design
- **Knowledge Chain:** N+1 Detection → Eager Loading → Pagination Strategy → EXPLAIN-driven optimization

### Concept 7: Partitioning & Monitoring

- **Memory Hook / Móc Nhớ:** "Partition = chia tủ sách theo năm, chỉ mở đúng tủ cần tìm."
- **Why exists:**
  - Level 1: Single table 500M rows → even with index, vacuum/maintenance painful → partition by range/list/hash
  - Level 2: Partition pruning → optimizer chỉ scan relevant partitions → dramatic speedup cho time-range queries
  - Level 3: DROP partition = instant vs DELETE 500M rows. Write optimization: batch insert, async commit, minimal indexes per partition
- **Common Mistakes:**
  - Partition key not in WHERE → scan all partitions (worse than no partition)
  - Too many partitions (daily for 10 years = 3650) → planning overhead
  - Forget monitoring: pg_stat_statements, index bloat, partition size balance
- **Interview Pattern:** "Design for 500M row table" → Signal: partition strategy + index per partition + monitoring plan
- **Knowledge Chain:** Partitioning → Write Optimization → Monitoring → Capacity Planning → Production Operations

---

## 1. Index Fundamentals

### 🟢 Q: Index là gì? Tại sao nó giúp query nhanh hơn? 🟢 [Junior]

Index là một **cấu trúc dữ liệu phụ** (auxiliary data structure) được tạo từ một hoặc nhiều cột của bảng, giúp database tìm kiếm dữ liệu mà **không cần quét toàn bộ bảng** (full table scan).

**Analogy:** Hãy tưởng tượng bảng dữ liệu là một cuốn sách dày 1000 trang. Không có index, bạn phải đọc từng trang để tìm từ khóa. Có index (mục lục cuối sách), bạn tra mục lục → nhảy thẳng tới trang cần tìm.

```
Without Index (Full Table Scan):
┌─────────────────────────────────────────┐
│  Row 1 → Row 2 → Row 3 → ... → Row 1M  │  Scan ALL rows: O(N)
└─────────────────────────────────────────┘

With Index (B+ Tree Lookup):
         [Root]
        /      \
    [Node]    [Node]        Traverse 3-4 levels: O(log N)
    /    \    /    \
  [Leaf] [Leaf] [Leaf] [Leaf]  → Jump to exact row
```

**Tại sao nhanh hơn:**

- Giảm **disk I/O** — thay vì đọc hàng triệu rows, chỉ đọc vài index pages (3-4 levels)
- **Dữ liệu đã được sắp xếp** trong index → binary search thay vì linear scan
- Bảng 10 triệu rows: full scan đọc ~100K pages, index lookup đọc ~3-4 pages

---

### 🟢 Q: Index là một trade-off như thế nào? 🟢 [Junior]

Index **không phải miễn phí**. Đây là trade-off kinh điển trong database:

| Aspect                   | Without Index          | With Index                                        |
| ------------------------ | ---------------------- | ------------------------------------------------- |
| **SELECT (read)**        | Slow — full scan O(N)  | Fast — O(log N)                                   |
| **INSERT**               | Fast — append only     | Slower — must update index tree                   |
| **UPDATE** (indexed col) | Fast — modify in place | Slower — rebalance index                          |
| **DELETE**               | Fast — mark as deleted | Slower — remove from index                        |
| **Storage**              | Table data only        | Table + index data (thêm 10-30% storage)          |
| **Memory**               | Table pages cached     | Table + index pages cached (buffer pool pressure) |

**Chi phí cụ thể của mỗi index:**

- **Write amplification:** Mỗi INSERT phải ghi vào table + tất cả indexes. 5 indexes = 6 writes.
- **Storage:** Một index trên cột VARCHAR(255) cho bảng 10M rows có thể chiếm 500MB-1GB.
- **Maintenance:** Index cần VACUUM (PostgreSQL) hoặc optimize (MySQL) để tránh fragmentation.
- **Planning overhead:** Query optimizer phải evaluate nhiều execution plans hơn.

---

### 🟡 Q: Khi nào nên tạo index? Khi nào KHÔNG nên? 🟡 [Mid]

**NÊN tạo index khi:**

- Cột thường xuyên xuất hiện trong **WHERE**, **JOIN ON**, **ORDER BY**
- Cột có **selectivity cao** (nhiều giá trị distinct) — email, user_id, order_number
- Bảng có **nhiều rows** (>10K) và queries cần filter/sort
- Query patterns đã **ổn định** và được xác định rõ

**KHÔNG NÊN tạo index khi:**

- Bảng nhỏ (<1000 rows) — full scan nhanh hơn index lookup vì ít overhead
- Cột có **cardinality thấp** — gender (M/F), status (active/inactive) → index không giúp filter nhiều
- Bảng **write-heavy** mà hiếm khi read — log tables, event streams
- Cột thường xuyên **UPDATE** — chi phí rebalance index quá cao
- Cột chứa **giá trị rất dài** — TEXT, large VARCHAR → index size lớn, hiệu quả thấp
- Đã có **quá nhiều indexes** trên bảng (>5-6) — mỗi write phải update tất cả

---

## 2. B+ Tree Index (Most Important)

### 🟡 Q: Giải thích cấu trúc B+ Tree trong database? 🟡 [Mid]

B+ Tree là cấu trúc index **mặc định và quan trọng nhất** trong hầu hết database (MySQL InnoDB, PostgreSQL). Đây là biến thể của B-Tree được tối ưu cho disk I/O.

**Đặc điểm chính:**

| Component       | B-Tree               | B+ Tree                 |
| --------------- | -------------------- | ----------------------- |
| Internal nodes  | Keys + data pointers | **Keys only** (no data) |
| Leaf nodes      | Keys + data          | Keys + data pointers    |
| Leaf connection | None                 | **Doubly linked list**  |
| Data access     | Any level            | **Leaf level only**     |

**Tại sao B+ Tree vượt trội hơn B-Tree cho database:**

1. Internal nodes chỉ chứa keys → **fan-out cao hơn** → cây thấp hơn → ít disk I/O hơn
2. Leaf nodes liên kết linked list → **range scan cực kỳ hiệu quả** (chỉ follow pointers)
3. Tất cả data ở leaf → **consistent access time** cho mọi query

```
B+ Tree Structure (order = 4, 3 levels):

Level 0 (Root):
                    ┌──────────────┐
                    │   [30 | 60]  │
                    └──┬───┬───┬───┘
                  <30  │ 30-60│  ≥60
                 ┌─────┘     │     └──────┐
                 ▼           ▼            ▼
Level 1 (Internal Nodes — keys only, NO data):
        ┌───────────┐  ┌───────────┐  ┌───────────┐
        │ [10 | 20] │  │ [40 | 50] │  │ [70 | 80] │
        └─┬──┬──┬───┘  └─┬──┬──┬───┘  └─┬──┬──┬───┘
          │  │  │         │  │  │         │  │  │
          ▼  ▼  ▼         ▼  ▼  ▼         ▼  ▼  ▼
Level 2 (Leaf Nodes — keys + row pointers + linked list):
  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
  │1,5,8 │⟷│10,15 │⟷│20,25 │⟷│30,35 │⟷│40,45 │ ...
  │→row  │   │→row  │   │→row  │   │→row  │   │→row  │
  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘
        ◄── Doubly Linked List giữa leaf nodes ──►

  Each leaf entry: [ key | pointer to actual row on disk ]
```

**Tính toán thực tế — tại sao chỉ cần 3-4 levels:**

- Mỗi page = 16KB (InnoDB default). Key = 8 bytes (BIGINT) + pointer = 6 bytes.
- Internal node fan-out: 16KB / 14 bytes ≈ **1170 children**
- Level 1: 1 root → 1170 children
- Level 2: 1170 × 1170 = **1,368,900 leaf nodes**
- Level 3: ~1.37M × ~500 records/leaf = **~680 million rows**
- **3 levels cho ~700M rows.** Root + level 1 thường cache trong RAM → chỉ cần **1-2 disk reads** cho mỗi lookup.

---

### 🟡 Q: Khi query thực thi, B+ Tree được traverse như thế nào? 🟡 [Mid]

Ví dụ: `SELECT * FROM users WHERE id = 45`

```
Step 1: Start at Root [30 | 60]
         45 ≥ 30 and 45 < 60 → go to MIDDLE child

Step 2: Internal Node [40 | 50]
         45 ≥ 40 and 45 < 50 → go to MIDDLE child

Step 3: Leaf Node [40, 42, 45, 48]
         Binary search within leaf → found key 45
         Follow row pointer → read actual row from data page

Total: 3 page reads (root usually cached → 2 actual I/O)
```

**Range query:** `SELECT * FROM users WHERE id BETWEEN 20 AND 45`

```
Step 1-2: Traverse tree to find leaf containing key 20
Step 3:   Found leaf [18, 20, 22] → start scanning
Step 4:   Follow linked list → [25, 28, 30] → [32, 35, 38] → [40, 42, 45]
Step 5:   Key 45 found, next key > 45 → stop scanning

          Linked list traversal = sequential I/O (fast!)
```

---

### 🔴 Q: Phân biệt Clustered Index vs Non-Clustered Index? 🔴 [Senior]

Đây là khái niệm **cực kỳ quan trọng**, đặc biệt khi hiểu InnoDB (MySQL).

```
Clustered Index (InnoDB Primary Key):
┌───────────────────────────────────────────┐
│          B+ Tree (Primary Key)            │
│                                           │
│  Internal: [keys only]                    │
│  Leaf:     [key | FULL ROW DATA]          │  ← Leaf IS the table
│                                           │
│  Table data is PHYSICALLY SORTED          │
│  by primary key on disk                   │
└───────────────────────────────────────────┘
  → Mỗi bảng CHỈ CÓ MỘT clustered index
  → InnoDB: Primary Key = Clustered Index (bắt buộc)

Non-Clustered Index (Secondary Index):
┌───────────────────────────────────────────┐
│        B+ Tree (Secondary Key)            │
│                                           │
│  Internal: [keys only]                    │
│  Leaf:     [key | pointer to row]         │  ← Pointer, not data
│                                           │
│  Separate structure, data NOT sorted      │
│  by this index                            │
└───────────────────────────────────────────┘
  → Mỗi bảng có thể có NHIỀU non-clustered indexes
```

**InnoDB chi tiết — secondary index lookup (double lookup):**

```
Query: SELECT * FROM users WHERE email = 'abc@example.com'
Index: INDEX(email)  — secondary index

Step 1: Traverse secondary index B+ Tree
        Leaf node: [email='abc@example.com' | PK=42]
                                              ↑ stores Primary Key

Step 2: Use PK=42 to traverse clustered index (primary key B+ Tree)
        Leaf node: [PK=42 | full row data]
                            ↑ actual row

→ Gọi là "bookmark lookup" hoặc "double lookup"
→ Đây là lý do covering index quan trọng (tránh step 2)
```

| Feature                | Clustered Index                             | Non-Clustered Index                     |
| ---------------------- | ------------------------------------------- | --------------------------------------- |
| **Số lượng / bảng**    | Đúng 1                                      | Nhiều (unlimited)                       |
| **Leaf chứa gì**       | Full row data                               | Pointer tới row (hoặc PK trong InnoDB)  |
| **Physical ordering**  | Data sorted theo index                      | Data KHÔNG sorted theo index            |
| **Range scan**         | Rất nhanh (sequential I/O)                  | Có thể chậm (random I/O nếu nhiều rows) |
| **Insert performance** | Chậm nếu PK không sequential                | Phụ thuộc vào key pattern               |
| **InnoDB**             | Primary Key (auto-created nếu không define) | Mọi index khác                          |
| **PostgreSQL**         | Không có clustered index mặc định           | Tất cả indexes đều non-clustered        |

**PostgreSQL vs InnoDB:**

- PostgreSQL dùng **heap table** — data không sorted. Tất cả indexes là non-clustered, trỏ tới physical location (ctid).
- InnoDB dùng **clustered table** (index-organized table) — data sorted theo PK.
- Hệ quả: PostgreSQL secondary index lookup = 1 step (trỏ thẳng tới heap). InnoDB = 2 steps (qua PK).

---

## 3. Index Types

### 🟡 Q: Có bao nhiêu loại index? Khi nào dùng loại nào? 🟡 [Mid]

#### B+ Tree Index (Default)

**Dùng cho:** Equality (`=`), Range (`>`, `<`, `BETWEEN`), Sorting (`ORDER BY`), Prefix (`LIKE 'abc%'`)

Đây là index mặc định trong hầu hết database. Hỗ trợ đa dạng query patterns nhất.

#### Hash Index

**Dùng cho:** Chỉ equality (`=`). **KHÔNG** hỗ trợ range, sorting, prefix.

```
Hash Index Structure:
  key → hash(key) → bucket → row pointer

  hash('alice') → bucket 3 → row pointer
  hash('bob')   → bucket 7 → row pointer

  Lookup: O(1) average (vs O(log N) cho B+ Tree)
  BUT: hash('alice') < hash('bob') ≠ 'alice' < 'bob'
       → Cannot do range queries or ORDER BY
```

- MySQL Memory engine hỗ trợ. InnoDB tự động tạo **adaptive hash index** khi phát hiện hot pages.
- PostgreSQL hỗ trợ Hash index, nhưng trước version 10 không WAL-logged → không an toàn.

#### GiST Index (Generalized Search Tree) — PostgreSQL

**Dùng cho:** Geometric data (PostGIS), range types, full-text search, nearest-neighbor queries.

Hỗ trợ các operator phức tạp: `@>`, `<@`, `&&`, `<<->>`

#### GIN Index (Generalized Inverted Index) — PostgreSQL

**Dùng cho:** JSONB queries, array containment, full-text search (`tsvector`).

```
GIN for JSONB:
  Document: {"tags": ["go", "postgres", "docker"]}

  Inverted index:
    "go"       → [row1, row5, row12]
    "postgres" → [row1, row3, row8]
    "docker"   → [row1, row7]

  Query: WHERE tags @> '["go"]'
  → Lookup "go" in inverted index → return row1, row5, row12
```

- Nhanh cho **reads**, chậm cho **writes** (phải update inverted list).
- Dùng `gin_pending_list_limit` để batch updates.

#### BRIN Index (Block Range Index) — PostgreSQL

**Dùng cho:** Bảng rất lớn với dữ liệu có **natural ordering** (time-series data, auto-increment IDs).

```
BRIN Index — stores min/max per block range:
  Block range 1 (pages 0-127):   min=2024-01-01, max=2024-01-15
  Block range 2 (pages 128-255): min=2024-01-15, max=2024-01-31
  Block range 3 (pages 256-383): min=2024-02-01, max=2024-02-14

  Query: WHERE created_at = '2024-01-20'
  → Only scan block range 2 (skip range 1 and 3)
```

- **Cực kỳ nhỏ** — index size ~0.01% of table (vs B+ Tree ~10-30%)
- Chỉ hiệu quả khi dữ liệu **physically correlated** với index column.

#### Bitmap Index

**Dùng cho:** Cột có **low cardinality** — status, gender, boolean.

```
Bitmap Index:
  status='active':   1 1 0 1 1 0 0 1 1 1  (bit per row)
  status='inactive': 0 0 1 0 0 1 1 0 0 0

  Query: WHERE status='active' AND gender='female'
  → Bitwise AND between two bitmaps → O(N/word_size)
```

- Oracle hỗ trợ natively. PostgreSQL tạo bitmap **on-the-fly** từ B+ Tree indexes (Bitmap Index Scan).

#### Comparison Table

| Index Type  | Equality   | Range | Sort | Size   | Write Cost | Best For                   |
| ----------- | ---------- | ----- | ---- | ------ | ---------- | -------------------------- |
| **B+ Tree** | Yes        | Yes   | Yes  | Medium | Medium     | General purpose            |
| **Hash**    | Yes (O(1)) | No    | No   | Medium | Low        | Point lookups only         |
| **GIN**     | Yes        | No    | No   | Large  | High       | JSONB, arrays, FTS         |
| **GiST**    | Yes        | Yes   | No   | Medium | Medium     | Geometry, ranges           |
| **BRIN**    | No         | Yes   | No   | Tiny   | Very Low   | Time-series, natural order |
| **Bitmap**  | Yes        | No    | No   | Small  | High       | Low cardinality columns    |

---

## 4. Composite Index (Multi-column)

### 🟡 Q: Leftmost Prefix Rule là gì? Tại sao column ordering quan trọng? 🟡 [Mid]

Composite index là index trên **nhiều cột**. B+ Tree sắp xếp theo thứ tự cột từ trái sang phải — giống phonebook: **last name → first name → middle name**.

```
INDEX(a, b, c) — B+ Tree sorted by (a, then b, then c):

Leaf nodes (sorted):
┌──────────────────────────────────────────────────────┐
│ (1,1,1) (1,1,2) (1,2,1) (1,2,3) (2,1,1) (2,1,4) ...│
└──────────────────────────────────────────────────────┘
     ↑ sorted by a first, then b, then c

Think of it as: a phone book sorted by (City, LastName, FirstName)
```

**Leftmost Prefix Rule — queries mà index có thể phục vụ:**

| Query                             | Uses INDEX(a,b,c)? | Why                                    |
| --------------------------------- | ------------------ | -------------------------------------- |
| `WHERE a = 1`                     | ✅ Yes             | Leftmost prefix (a)                    |
| `WHERE a = 1 AND b = 2`           | ✅ Yes             | Leftmost prefix (a, b)                 |
| `WHERE a = 1 AND b = 2 AND c = 3` | ✅ Yes             | Full index                             |
| `WHERE b = 2`                     | ❌ No              | Missing leftmost column (a)            |
| `WHERE c = 3`                     | ❌ No              | Missing leftmost columns (a, b)        |
| `WHERE b = 2 AND c = 3`           | ❌ No              | Missing leftmost column (a)            |
| `WHERE a = 1 AND c = 3`           | ⚠️ Partial         | Uses (a) only, c cannot use index      |
| `WHERE a > 1 AND b = 2`           | ⚠️ Partial         | Range on (a) stops index usage for (b) |

**Quy tắc quan trọng:** Range condition trên một cột **ngắt** việc sử dụng index cho các cột phía sau nó.

---

### 🔴 Q: Làm sao chọn thứ tự cột trong composite index? 🔴 [Senior]

**Quy tắc ERS (Equality → Range → Sort):**

```
Step 1: Cột dùng cho EQUALITY (=) đặt trước
Step 2: Cột dùng cho RANGE (>, <, BETWEEN) tiếp theo
Step 3: Cột dùng cho SORT (ORDER BY) cuối cùng

Example query:
  SELECT * FROM orders
  WHERE status = 'shipped'        ← Equality
    AND created_at > '2024-01-01' ← Range
  ORDER BY amount DESC            ← Sort

Optimal index: INDEX(status, created_at, amount)
                     Eq.       Range       Sort
```

**Index Selectivity (Cardinality):**

Selectivity = số giá trị distinct / tổng số rows. Selectivity cao = index hiệu quả hơn.

```
Column          | Distinct Values | Selectivity  | Index Value
----------------|----------------|--------------|------------
user_id         | 1,000,000      | 1.0 (unique) | Excellent
email           | 999,500        | ~1.0         | Excellent
created_at      | 365,000        | 0.365        | Good
status          | 5              | 0.000005     | Poor (alone)
gender          | 3              | 0.000003     | Poor (alone)
```

**Nhưng:** Cột low-cardinality vẫn hữu ích trong composite index! `INDEX(status, created_at)` hiệu quả nếu query luôn filter cả status và created_at.

---

## 5. Covering Index

### 🟡 Q: Covering Index là gì? Tại sao nó nhanh? 🟡 [Mid]

Covering index là index **chứa tất cả cột** mà query cần — database không cần truy cập table data (heap/clustered index).

```
Normal Index Lookup (non-covering):
  ┌─────────────┐    ┌──────────────────┐
  │ Index B+Tree │ →  │ Table (heap/CI)  │   2 structure reads
  │ find key     │    │ fetch full row   │   Random I/O to table
  └─────────────┘    └──────────────────┘

Covering Index (Index-Only Scan):
  ┌─────────────────────────┐
  │ Index B+Tree             │   1 structure read
  │ find key + return data   │   NO table access needed!
  └─────────────────────────┘
```

**Ví dụ:**

```sql
-- Query chỉ cần email và name
SELECT email, name FROM users WHERE email = 'abc@example.com';

-- Non-covering index: lookup index → fetch row from table
CREATE INDEX idx_email ON users(email);

-- Covering index: all needed columns in index
CREATE INDEX idx_email_covering ON users(email, name);
-- PostgreSQL INCLUDE syntax (name not part of search key):
CREATE INDEX idx_email_incl ON users(email) INCLUDE (name);
```

**INCLUDE clause (PostgreSQL 11+):**

- Cột trong INCLUDE **không** nằm trong B+ Tree sort order (không dùng cho WHERE/ORDER BY)
- Chỉ **stored in leaf nodes** để phục vụ index-only scan
- Lợi ích: index nhỏ hơn (internal nodes không chứa INCLUDE columns), nhưng vẫn covering

**Khi nào covering index có lợi nhất:**

- Queries trả về **ít cột** (SELECT cụ thể, không SELECT \*)
- Bảng rộng (nhiều cột) nhưng query chỉ cần vài cột
- **Hot queries** chạy rất thường xuyên
- OLTP workload với queries đã biết trước pattern

---

## 6. Partial Index / Filtered Index

### 🟡 Q: Partial Index là gì? Khi nào dùng? 🟡 [Mid]

Partial index chỉ index **một subset rows** thỏa mãn điều kiện — giảm index size đáng kể.

```sql
-- Index ALL rows (10M rows → large index)
CREATE INDEX idx_status ON orders(created_at);

-- Partial index: chỉ index active orders (maybe 500K rows)
CREATE INDEX idx_active_orders ON orders(created_at)
  WHERE status = 'active';
```

```
Full Index:                    Partial Index:
┌─────────────────────┐       ┌───────────────┐
│ 10M entries          │       │ 500K entries  │  95% smaller!
│ active + inactive    │       │ active only   │
│ + cancelled + ...    │       │               │
│ Size: ~500MB         │       │ Size: ~25MB   │
└─────────────────────┘       └───────────────┘
```

**Use cases phổ biến:**

- Index **active users only** — bỏ qua soft-deleted records
- Index **non-null values** — `WHERE column IS NOT NULL`
- Index **recent data** — `WHERE created_at > '2024-01-01'`
- Index **unprocessed items** — `WHERE processed = false` (queue pattern)

**Lợi ích:**

- **Nhỏ hơn** → fit trong memory tốt hơn → cache hit ratio cao hơn
- **Write nhanh hơn** — INSERT/UPDATE chỉ ảnh hưởng index nếu row thỏa mãn WHERE
- **Maintain dễ hơn** — VACUUM/REINDEX nhanh hơn

**Lưu ý:** Query phải match với WHERE condition của partial index để optimizer sử dụng nó.

```sql
-- ✅ Optimizer uses partial index
SELECT * FROM orders WHERE status = 'active' AND created_at > '2024-06-01';

-- ❌ Optimizer CANNOT use partial index (different status)
SELECT * FROM orders WHERE status = 'cancelled' AND created_at > '2024-06-01';
```

---

## 7. EXPLAIN / EXPLAIN ANALYZE

### 🟡 Q: Cách đọc query plan trong PostgreSQL? 🟡 [Mid]

`EXPLAIN` cho estimated plan. `EXPLAIN ANALYZE` thực thi query và cho **actual execution statistics**.

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'alice@example.com';
```

**Các loại Scan quan trọng (từ tệ → tốt):**

```
Seq Scan (Sequential Scan)
│  → Full table scan. Đọc TOÀN BỘ bảng.
│  → Chấp nhận được cho: bảng nhỏ, query trả về >5-10% rows.
│  → Cần fix nếu: bảng lớn + query trả về ít rows.
│
├── Bitmap Index Scan + Bitmap Heap Scan
│   → Scan index → build bitmap → fetch matching pages.
│   → Tốt cho: medium selectivity (trả về 1-10% rows).
│   → Có thể combine nhiều indexes (BitmapAnd, BitmapOr).
│
├── Index Scan
│   → Traverse index → fetch row from table (heap).
│   → Tốt cho: high selectivity (trả về < 1% rows).
│   → Mỗi row = 1 random I/O tới heap.
│
└── Index Only Scan (BEST)
    → Traverse index → return data directly from index.
    → Không cần access table (heap).
    → Requires: covering index + visibility map up-to-date (VACUUM).
```

**Các loại JOIN:**

```
Nested Loop Join
│  → For each row in outer → scan inner table.
│  → Best for: small outer + indexed inner. O(N × M) worst case.
│  → Common with: Index Scan on inner table.
│
├── Hash Join
│   → Build hash table from smaller relation → probe with larger.
│   → Best for: equality joins, no useful index. O(N + M).
│   → Needs: enough work_mem for hash table.
│
└── Merge Join
    → Sort both sides → merge. O(N log N + M log M).
    → Best for: both sides already sorted (index), large datasets.
    → Good for: range joins, already-sorted data.
```

**Đọc cost model:**

```
Index Scan using idx_email on users  (cost=0.42..8.44 rows=1 width=256)
                                      ^^^^    ^^^^  ^^^^   ^^^^^
                                      │       │     │      │
                    startup cost ─────┘       │     │      │
                    total cost ───────────────┘     │      │
                    estimated rows returned ────────┘      │
                    average row width (bytes) ──────────────┘

  (actual time=0.025..0.027 rows=1 loops=1)
   ^^^^^^^^^^^^^^^^^^^^^^   ^^^^   ^^^^^^^
   │                        │      │
   actual execution time ───┘      │      (EXPLAIN ANALYZE only)
   actual rows returned ──────────┘
   number of loop iterations ──────────────┘
```

**Key insight:** Nếu `estimated rows` khác xa `actual rows` → **stale statistics**. Chạy `ANALYZE table_name`.

---

### 🟡 Q: Cách đọc EXPLAIN trong MySQL? 🟡 [Mid]

```sql
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
```

**Cột `type` (access type, từ tệ → tốt):**

```
ALL       → Full table scan. ĐỎ FLAG.
│
├── index → Full index scan (đọc toàn bộ index, tốt hơn ALL).
│
├── range → Index range scan (BETWEEN, >, <, IN). Tốt.
│
├── ref   → Non-unique index lookup (equality). Tốt.
│
├── eq_ref → Unique index lookup in JOIN (1 row per join). Rất tốt.
│
└── const → Primary key / unique lookup (1 row). Tốt nhất.
```

**Cột `Extra` quan trọng:**

| Extra                   | Meaning                                 | Action                               |
| ----------------------- | --------------------------------------- | ------------------------------------ |
| `Using index`           | Covering index (index-only scan)        | Good!                                |
| `Using where`           | Filtering after index lookup            | Normal, check if more can be indexed |
| `Using filesort`        | Extra sort operation needed             | Consider ORDER BY index              |
| `Using temporary`       | Temp table created (GROUP BY, DISTINCT) | Optimize query or add index          |
| `Using index condition` | Index condition pushdown (ICP)          | Good — filter at storage engine      |

---

### 🔴 Q: Cho ví dụ phân tích EXPLAIN output thực tế? 🔴 [Senior]

**Ví dụ 1: Slow query — missing index**

```
EXPLAIN ANALYZE
SELECT * FROM orders WHERE customer_id = 42 AND status = 'pending';

Seq Scan on orders  (cost=0.00..25432.00 rows=15 width=128)
                     (actual time=142.5..312.8 rows=12 loops=1)
  Filter: ((customer_id = 42) AND (status = 'pending'))
  Rows Removed by Filter: 999988
Planning Time: 0.1 ms
Execution Time: 312.9 ms
```

**Phân tích:**

- `Seq Scan` trên bảng 1M rows → đọc toàn bộ
- `Rows Removed by Filter: 999988` → scan 1M, giữ 12 → selectivity cực cao
- **Fix:** `CREATE INDEX idx_orders_cust_status ON orders(customer_id, status);`

**Sau khi thêm index:**

```
Index Scan using idx_orders_cust_status on orders
  (cost=0.42..12.55 rows=15 width=128)
  (actual time=0.028..0.045 rows=12 loops=1)
  Index Cond: ((customer_id = 42) AND (status = 'pending'))
Planning Time: 0.2 ms
Execution Time: 0.06 ms
```

→ **312.9ms → 0.06ms** — improvement 5000x!

**Ví dụ 2: Index không được sử dụng — function on column**

```sql
-- Index on created_at exists, BUT:
EXPLAIN SELECT * FROM orders WHERE YEAR(created_at) = 2024;
-- → Seq Scan! Function phá hủy khả năng sử dụng index.

-- Fix: rewrite to range condition
EXPLAIN SELECT * FROM orders
  WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
-- → Index Scan! Range condition uses B+ Tree.
```

---

## 8. Query Optimization Strategies

### 🟡 Q: Những patterns nào khiến index không được sử dụng? 🟡 [Mid]

**Đây là kiến thức quan trọng nhất cho interview — Employment Hero, Grab hỏi rất nhiều.**

#### 1. Function on Indexed Column

```sql
-- ❌ Index on created_at KHÔNG được dùng
WHERE YEAR(created_at) = 2024
WHERE UPPER(email) = 'ALICE@EXAMPLE.COM'
WHERE created_at + INTERVAL '7 days' > NOW()

-- ✅ Rewrite để index hoạt động
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'
WHERE email = 'alice@example.com'  -- store lowercase, compare lowercase
WHERE created_at > NOW() - INTERVAL '7 days'
```

**Lý do:** B+ Tree sorted theo giá trị gốc của cột. `YEAR(created_at)` tạo giá trị mới → B+ Tree không biết cách navigate.

#### 2. Implicit Type Conversion

```sql
-- ❌ phone_number là VARCHAR, nhưng so sánh với INT
WHERE phone_number = 0912345678    -- implicit cast: CAST(phone_number AS INT)

-- ✅ So sánh đúng kiểu
WHERE phone_number = '0912345678'
```

#### 3. Leading Wildcard in LIKE

```sql
-- ❌ Leading wildcard → full scan
WHERE name LIKE '%nguyen%'

-- ✅ Prefix match → index usable
WHERE name LIKE 'nguyen%'

-- ✅ Full-text search for substring matching
-- PostgreSQL: GIN index with pg_trgm extension
CREATE INDEX idx_name_trgm ON users USING gin(name gin_trgm_ops);
```

#### 4. OR on Different Columns

```sql
-- ❌ Index trên (email) OR index trên (phone) — optimizer khó dùng cả hai
WHERE email = 'alice@example.com' OR phone = '0912345678'

-- ✅ UNION cho phép mỗi query dùng index riêng
SELECT * FROM users WHERE email = 'alice@example.com'
UNION
SELECT * FROM users WHERE phone = '0912345678'
```

#### 5. NOT IN / NOT EXISTS với large list

```sql
-- ❌ NOT IN subquery — có thể dẫn tới full scan
WHERE id NOT IN (SELECT order_id FROM cancelled_orders)

-- ✅ LEFT JOIN + IS NULL (optimizer thường xử lý tốt hơn)
LEFT JOIN cancelled_orders co ON orders.id = co.order_id
WHERE co.order_id IS NULL
```

---

### 🔴 Q: Pagination optimization — tại sao OFFSET chậm? 🔴 [Senior]

**OFFSET problem — một trong những câu hỏi phổ biến nhất:**

```sql
-- Page 1: fast
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 0;

-- Page 1000: SLOW
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 19980;
```

**Tại sao OFFSET chậm?**

```
OFFSET 19980, LIMIT 20:

Database phải:
1. Fetch và sort 20,000 rows (hoặc scan index 20,000 entries)
2. Bỏ 19,980 rows đầu tiên
3. Trả về 20 rows cuối

→ Work tỉ lệ thuận với OFFSET value
→ OFFSET 1,000,000 = scan 1M rows chỉ để lấy 20

Performance:
  OFFSET 0:      ~1ms
  OFFSET 10000:  ~50ms
  OFFSET 100000: ~500ms
  OFFSET 1000000: ~5000ms (hoặc hơn)
```

**Solution 1: Keyset Pagination (Cursor-based)**

```sql
-- Instead of OFFSET, use WHERE clause with last seen value
-- Page 1:
SELECT * FROM products ORDER BY id LIMIT 20;
-- Last id in result: 20

-- Page 2:
SELECT * FROM products WHERE id > 20 ORDER BY id LIMIT 20;
-- Last id in result: 40

-- Page N:
SELECT * FROM products WHERE id > :last_seen_id ORDER BY id LIMIT 20;
```

```
Keyset pagination:
  → Always starts from index position of :last_seen_id
  → O(log N + page_size) regardless of page number
  → Consistent performance whether page 1 or page 100,000

  Limitation: Cannot jump to arbitrary page N
              Only "next page" / "previous page"
```

**Solution 2: Deferred Join Pattern**

```sql
-- ❌ Slow: fetch full rows then discard
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 19980;

-- ✅ Fast: fetch only IDs first (index-only scan), then join
SELECT p.*
FROM products p
INNER JOIN (
  SELECT id FROM products ORDER BY id LIMIT 20 OFFSET 19980
) AS sub ON p.id = sub.id;
```

Subquery chỉ scan index (lightweight), sau đó join 20 rows → fetch 20 full rows.

---

### 🔴 Q: N+1 Query Problem là gì? Cách giải quyết? 🔴 [Senior]

**Problem:** Fetch N parent records, rồi loop N lần để fetch child records → N+1 queries tổng.

```
// N+1 in Go:
users := db.Query("SELECT * FROM users LIMIT 100")       // 1 query
for _, user := range users {
    orders := db.Query("SELECT * FROM orders WHERE user_id = ?", user.ID)
    // ↑ 100 queries (one per user)
}
// Total: 101 queries for 100 users!
```

```
Timeline:
  App → DB: SELECT * FROM users (1 query, ~5ms)
  App → DB: SELECT * FROM orders WHERE user_id=1  (~2ms)
  App → DB: SELECT * FROM orders WHERE user_id=2  (~2ms)
  App → DB: SELECT * FROM orders WHERE user_id=3  (~2ms)
  ... (100 more queries)
  Total: ~205ms (dominated by network round trips)
```

**Solutions:**

```
Solution 1: Eager Loading (JOIN)
  SELECT u.*, o.* FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
  LIMIT 100;
  → 1 query, BUT: data duplication if user has many orders

Solution 2: Batch Loading (IN clause)
  SELECT * FROM users LIMIT 100;                          -- 1 query
  SELECT * FROM orders WHERE user_id IN (1,2,3,...,100);  -- 1 query
  → 2 queries total. Application-level join.

Solution 3: Subquery Preloading (ORMs)
  GORM: db.Preload("Orders").Find(&users)
  → Generates batch loading automatically
```

**Kinh nghiệm:** Hầu hết ORMs (GORM, SQLAlchemy, ActiveRecord) đều có eager loading. **Luôn kiểm tra SQL log** trong development để phát hiện N+1.

---

### 🟡 Q: Subquery vs JOIN — khi nào subquery chậm hơn? 🟡 [Mid]

**Subquery chậm khi:** database thực thi subquery **cho mỗi row** của outer query (correlated subquery).

```sql
-- ❌ Correlated subquery — chạy subquery cho MỖI user
SELECT u.name,
  (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) as order_count
FROM users u;

-- ✅ JOIN + GROUP BY — database optimize tốt hơn
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name;
```

**Tuy nhiên**, modern query optimizers (PostgreSQL 12+, MySQL 8.0+) thường **tự động flatten** subquery thành JOIN. **Luôn kiểm tra EXPLAIN** thay vì assume.

**Subquery tốt hơn khi:**

- `EXISTS` subquery — database dừng ngay khi tìm thấy 1 row
- Subquery trả về tập nhỏ dùng cho `IN`
- Derived tables (subquery trong FROM) — optimizer có thể push conditions xuống

---

## 9. Table Partitioning

### 🔴 Q: Partitioning là gì? Khi nào cần? 🔴 [Senior]

Partitioning chia một bảng logic thành **nhiều bảng vật lý** (partitions), nhưng application vẫn thấy như **một bảng duy nhất**.

```
Logical Table: orders (50M rows)
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │orders    │ │orders    │ │orders    │
  │_2023     │ │_2024_h1  │ │_2024_h2  │   Physical partitions
  │(15M rows)│ │(20M rows)│ │(15M rows)│
  └──────────┘ └──────────┘ └──────────┘

Query: SELECT * FROM orders WHERE created_at = '2024-08-15'
  → Partition pruning: chỉ scan orders_2024_h2
  → Skip 35M rows!
```

**Khi nào cần partitioning:**

- Bảng > **100M rows** hoặc > **100GB**
- Queries **luôn filter** theo partition key (date ranges, regions)
- Cần **xóa dữ liệu cũ** nhanh (DROP partition thay vì DELETE millions of rows)
- Index trên toàn bảng **quá lớn** để fit trong memory
- **Maintenance** khó khăn — VACUUM, REINDEX trên bảng quá lớn

---

### 🔴 Q: Các loại partitioning? 🔴 [Senior]

#### Range Partitioning (phổ biến nhất)

```sql
-- PostgreSQL declarative partitioning
CREATE TABLE orders (
    id         BIGSERIAL,
    customer_id INT,
    amount      DECIMAL,
    created_at  TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
```

**Dùng cho:** Time-series data, log data, data có temporal queries.

#### List Partitioning

```sql
CREATE TABLE customers (
    id      BIGSERIAL,
    region  TEXT,
    name    TEXT
) PARTITION BY LIST (region);

CREATE TABLE customers_apac PARTITION OF customers
    FOR VALUES IN ('VN', 'SG', 'TH', 'ID');
CREATE TABLE customers_eu PARTITION OF customers
    FOR VALUES IN ('DE', 'FR', 'UK', 'NL');
```

**Dùng cho:** Data phân theo category, region, tenant.

#### Hash Partitioning

```sql
CREATE TABLE events (
    id      BIGSERIAL,
    user_id INT,
    data    JSONB
) PARTITION BY HASH (user_id);

CREATE TABLE events_p0 PARTITION OF events
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE events_p1 PARTITION OF events
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);
-- ... p2, p3
```

**Dùng cho:** Phân bố đều data khi không có natural range/list key. Write distribution.

---

### 🔴 Q: Partition Pruning hoạt động như thế nào? 🔴 [Senior]

Partition pruning là quá trình query optimizer **loại bỏ partitions không liên quan** trước khi thực thi.

```
Query: SELECT * FROM orders WHERE created_at = '2024-05-15'

Without pruning (no partitioning):
  Scan all 50M rows

With pruning:
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │ orders_2023  │  │orders_2024  │  │orders_2024  │
  │              │  │  _q1        │  │  _q2  ✓     │
  │  SKIPPED     │  │  SKIPPED    │  │  SCAN THIS  │
  └─────────────┘  └─────────────┘  └─────────────┘

  Only scan ~8M rows in Q2 partition
```

**Điều kiện để pruning hoạt động:**

- WHERE clause phải chứa **partition key**
- Condition phải **compile-time evaluable** hoặc có thể resolve từ parameter
- `WHERE created_at > NOW() - INTERVAL '30 days'` ✅ (runtime pruning PG 11+)
- `WHERE YEAR(created_at) = 2024` ❌ (function on partition key — tùy database)

**Partitioning vs Sharding:**

| Aspect                      | Partitioning                | Sharding                        |
| --------------------------- | --------------------------- | ------------------------------- |
| **Scope**                   | Single database server      | Multiple database servers       |
| **Transparency**            | Application thấy 1 bảng     | Application phải biết shard     |
| **Scale**                   | Vertical (1 server limit)   | Horizontal (unlimited)          |
| **Complexity**              | Low — database handles      | High — application logic needed |
| **Cross-partition queries** | Easy (database handles)     | Hard (distributed queries)      |
| **Use when**                | Table quá lớn trên 1 server | 1 server không đủ capacity      |

---

## 10. Database Performance Monitoring

### 🟡 Q: Những metrics nào quan trọng nhất? 🟡 [Mid]

```
Key Database Metrics Dashboard:

┌─────────────────────────────────────────────────┐
│ QPS (Queries Per Second)                         │
│  → Throughput hiện tại. Baseline vs peak.        │
│  → Alert nếu tăng/giảm đột ngột.                │
│                                                  │
│ Latency: p50, p95, p99                           │
│  → p50 = 2ms (median, bình thường)              │
│  → p95 = 15ms (acceptable)                       │
│  → p99 = 200ms (investigate!)                    │
│  → p99 ≠ p50 quá xa → long-tail problem         │
│                                                  │
│ Active Connections / Connection Pool              │
│  → Max connections vs current usage              │
│  → Connection wait time                          │
│  → Idle connections consuming resources          │
│                                                  │
│ Cache Hit Ratio                                  │
│  → Buffer cache hit > 99% = healthy              │
│  → < 95% = cần thêm RAM hoặc optimize queries   │
│                                                  │
│ Replication Lag                                  │
│  → Lag > seconds = read replicas serving         │
│    stale data                                    │
└─────────────────────────────────────────────────┘
```

---

### 🔴 Q: PostgreSQL monitoring tools? 🔴 [Senior]

**pg_stat_statements** — Top slow queries:

```sql
-- Top 10 queries by total execution time
SELECT query, calls, total_exec_time, mean_exec_time,
       rows, shared_blks_hit, shared_blks_read
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

- `total_exec_time`: Tổng thời gian → ưu tiên optimize query gọi nhiều lần
- `mean_exec_time`: Trung bình mỗi lần gọi → phát hiện slow individual queries
- `shared_blks_hit vs shared_blks_read`: Cache hit ratio per query

**pg_stat_user_indexes** — Index usage:

```sql
-- Find unused indexes (waste of write performance + storage)
SELECT schemaname, relname, indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

**pg_stat_user_tables** — Table stats:

```sql
-- Tables needing VACUUM (high dead tuple ratio)
SELECT relname, n_live_tup, n_dead_tup,
       round(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) as dead_pct,
       last_vacuum, last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_pct DESC;
```

**Bloat detection:** Dead tuples accumulate → table/index bloat → larger scans → slower queries. VACUUM reclaims space. `pg_repack` for online table rebuild without lock.

---

### 🟡 Q: MySQL monitoring? 🟡 [Mid]

**Slow Query Log:**

```ini
# my.cnf
slow_query_log = 1
long_query_time = 1        # queries > 1 second
log_queries_not_using_indexes = 1
```

**performance_schema:**

```sql
-- Top queries by total latency
SELECT DIGEST_TEXT, COUNT_STAR, AVG_TIMER_WAIT/1000000000 as avg_ms,
       SUM_TIMER_WAIT/1000000000 as total_ms
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

**Index usage (MySQL):**

```sql
-- Find unused indexes
SELECT * FROM sys.schema_unused_indexes;

-- Find redundant indexes
SELECT * FROM sys.schema_redundant_indexes;
```

---

## 11. Write Optimization

### 🔴 Q: Làm sao tối ưu write performance? 🔴 [Senior]

#### Batch Inserts

```
Single INSERT (1M rows):
  INSERT INTO t VALUES (1, 'a');   ← 1M network round trips
  INSERT INTO t VALUES (2, 'b');      1M transaction commits
  INSERT INTO t VALUES (3, 'c');      1M WAL flushes
  ...                                 Total: ~minutes to hours

Multi-row INSERT:
  INSERT INTO t VALUES (1,'a'),(2,'b'),(3,'c'),...;
  → Batch 1000 rows per INSERT
  → Fewer round trips, fewer commits
  → Total: ~tens of seconds

COPY (PostgreSQL) / LOAD DATA (MySQL):
  COPY t FROM '/path/to/data.csv';
  → Binary protocol, minimal parsing
  → Bypasses SQL layer overhead
  → Total: ~seconds for 1M rows (10-100x faster than INSERT)
```

#### Disable Indexes During Bulk Load

```
Strategy for bulk loading large datasets:

1. DROP secondary indexes (keep PK)
2. COPY / LOAD DATA
3. CREATE indexes (single B+ Tree build is faster
   than incremental inserts during load)

Why: Building index from scratch = O(N log N) sort + write
     Incremental during load = O(N × log N) individual inserts
     + tree rebalancing after each insert
```

#### Other Write Optimizations

**Unlogged Tables (PostgreSQL):**

- `CREATE UNLOGGED TABLE temp_import (...)` — không ghi WAL
- 2-5x faster writes, nhưng **mất data nếu crash**
- Dùng cho: staging/temp data, data có thể regenerate

**Async Commit:**

- `SET synchronous_commit = off;` — không đợi WAL flush
- Faster commit, nhưng **có thể mất vài transactions gần nhất** nếu crash
- Dùng cho: non-critical writes (logging, analytics events)

**Partitioning for Write Distribution:**

- Writes vào partition nhỏ → index nhỏ hơn → insert nhanh hơn
- Lock contention thấp hơn (lock per partition thay vì per table)

---

## Index Decision Flowchart

```
                    Need to speed up a query?
                           │
                           ▼
                 ┌─── Check EXPLAIN ───┐
                 │                     │
                 ▼                     ▼
           Seq Scan on             Already using
           large table?            index?
                 │                     │
                 ▼                     ▼
          What query type?       Is it Index Scan
                 │               or Index Only Scan?
        ┌────┬───┴───┬────┐          │
        ▼    ▼       ▼    ▼     ┌────┴────┐
     Equal Range  JOIN  Sort    ▼         ▼
        │    │       │    │   Index     Index Only
        ▼    ▼       ▼    ▼   Scan      Scan ✓
   B+Tree B+Tree  Index  Index  │
   Index  Index   on     that   ▼
     │      │    join   matches Consider
     │      │    cols   ORDER   covering index
     │      │     │     BY      to eliminate
     ▼      ▼     ▼     │      heap lookup
   Single  Consider     ▼
   or      composite    Add sort
   composite?  index    cols to index
     │           │
     ▼           ▼
  High         ERS Rule:
  selectivity? Equality → Range → Sort
     │
  ┌──┴──┐
  ▼     ▼
 Yes    No (low cardinality)
  │     │
  ▼     ▼
 Create Composite index with
 index  high-cardinality col first,
        or partial index
```

```
Additional decisions:
  ┌──────────────────────────────────────────┐
  │ Only subset of rows relevant?            │
  │  → Partial index (WHERE clause)          │
  │                                          │
  │ Query returns few columns?               │
  │  → Covering index (INCLUDE)              │
  │                                          │
  │ JSONB / array / full-text?               │
  │  → GIN index                             │
  │                                          │
  │ Time-series, natural ordering?           │
  │  → BRIN index (tiny, effective)          │
  │                                          │
  │ Equality only, no range?                 │
  │  → Consider Hash index                   │
  │                                          │
  │ Table > 100M rows?                       │
  │  → Consider partitioning first           │
  └──────────────────────────────────────────┘
```

---

## Common Indexing Mistakes

### Top 10 Mistakes (ranked by frequency in production)

```
1. ❌ No index on foreign key columns
   → JOINs and ON DELETE CASCADE become full scans
   ✅ Always index FK columns

2. ❌ Indexing every column "just in case"
   → Write performance tanks, storage bloats
   ✅ Index based on actual query patterns

3. ❌ Function on indexed column in WHERE
   → WHERE YEAR(date) = 2024 defeats index
   ✅ Rewrite as range: WHERE date >= '2024-01-01' AND date < '2025-01-01'

4. ❌ Wrong column order in composite index
   → INDEX(status, user_id) when query is WHERE user_id = ? AND status = ?
   → Works, but INDEX(user_id, status) may be more selective
   ✅ Apply ERS rule + selectivity analysis

5. ❌ Missing covering index for hot queries
   → Millions of unnecessary heap lookups per second
   ✅ Add INCLUDE columns for top 5 queries by frequency

6. ❌ Not monitoring unused indexes
   → Indexes that no query uses waste write perf + storage
   ✅ Regularly check pg_stat_user_indexes / sys.schema_unused_indexes

7. ❌ Using OFFSET for deep pagination
   → OFFSET 1000000 scans 1M rows then discards them
   ✅ Keyset (cursor-based) pagination

8. ❌ Not running ANALYZE / UPDATE STATISTICS
   → Query planner uses stale stats → bad plans
   ✅ Ensure autovacuum/auto-analyze is configured properly

9. ❌ SELECT * with index
   → Forces table lookup even when index could cover query
   ✅ Select only needed columns

10. ❌ Ignoring N+1 queries
    → 101 queries instead of 2
    ✅ Use batch loading / JOINs / ORM eager loading
```

---

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Employment Hero / Grab Focus Areas

These companies heavily test database optimization knowledge. Expect scenario-based questions.

---

**🟢 Junior Level:**

**Q1: Khi nào bạn sẽ thêm index cho một bảng?**

Khi có query thường xuyên với WHERE/JOIN/ORDER BY trên cột đó, bảng đủ lớn (>10K rows), và cột có selectivity cao. Cần cân nhắc trade-off: mỗi index thêm sẽ làm chậm writes. Kiểm tra EXPLAIN để confirm index đang được sử dụng.

**Q2: Clustered index vs non-clustered index khác nhau thế nào?**

Clustered index: table data được **physically sorted** theo index key. Mỗi bảng chỉ có 1. Trong InnoDB, Primary Key = clustered index. Leaf nodes chứa **full row data**.

Non-clustered index: cấu trúc riêng biệt chứa **pointers** tới rows. Mỗi bảng có nhiều. Leaf nodes chứa key + pointer (hoặc PK trong InnoDB).

**Q3: Tại sao `WHERE YEAR(created_at) = 2024` không dùng được index?**

B+ Tree sorted theo giá trị gốc của `created_at`. Khi apply function `YEAR()`, database phải tính giá trị mới cho mỗi row → không thể traverse tree. Rewrite thành range condition: `WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01'`.

---

**🟡 Middle Level:**

**Q4: Giải thích leftmost prefix rule. Cho INDEX(a, b, c), query nào sẽ dùng index?**

B+ Tree sorted theo (a, then b, then c). Query phải match prefix từ trái:

- `WHERE a = 1` ✅
- `WHERE a = 1 AND b = 2` ✅
- `WHERE a = 1 AND b = 2 AND c = 3` ✅
- `WHERE b = 2` ❌ (thiếu a)
- `WHERE a = 1 AND c = 3` ⚠️ chỉ dùng (a), skip c vì thiếu b liên tục

Quy tắc: range condition trên 1 cột sẽ ngắt khả năng dùng index cho các cột phía sau.

**Q5: Bạn có một query chậm. Walk me through cách bạn optimize.**

1. **EXPLAIN ANALYZE** để xem execution plan
2. Identify bottleneck: Seq Scan? Nested Loop trên bảng lớn không có index? High `Rows Removed by Filter`?
3. Check nếu index tồn tại nhưng không được dùng — function on column? Type mismatch? Stale stats?
4. Thiết kế index phù hợp — composite index theo ERS rule, covering index nếu cần
5. Test lại với EXPLAIN ANALYZE — so sánh cost/time trước và sau
6. Monitor production — check pg_stat_statements cho query đó

**Q6: Tại sao OFFSET pagination chậm? Giải pháp?**

OFFSET N bắt database fetch N+limit rows rồi bỏ N rows đầu. OFFSET 1M = scan 1M rows chỉ để lấy 20.

Giải pháp: **Keyset pagination** — `WHERE id > :last_id ORDER BY id LIMIT 20`. Luôn bắt đầu từ index position, không phụ thuộc vào page number. O(log N + page_size) constant.

Nếu cần OFFSET (UI yêu cầu page numbers): **deferred join** — subquery lấy IDs (index-only scan), join lại lấy full rows.

---

**🔴 Senior Level:**

**Q7: Thiết kế indexing strategy cho bảng orders (100M rows): columns = id, customer_id, status, amount, created_at. Queries: (1) search by customer + date range, (2) dashboard aggregation by status + date, (3) export by date range.**

```
Query 1: WHERE customer_id = ? AND created_at BETWEEN ? AND ?
  → INDEX(customer_id, created_at)
  → Equality first (customer_id), then range (created_at)

Query 2: WHERE status = ? AND created_at BETWEEN ? AND ? GROUP BY ...
  → INDEX(status, created_at) INCLUDE (amount)
  → Low cardinality status OK as first col because query always filters it
  → INCLUDE amount for covering index (avoid heap lookup for SUM/AVG)

Query 3: WHERE created_at BETWEEN ? AND ?
  → Partition by RANGE(created_at) — monthly/quarterly
  → Partition pruning eliminates irrelevant months
  → BRIN index on created_at within each partition (tiny, effective)

Additional:
  → Partial index: INDEX(status, created_at) WHERE status = 'pending'
    for queue-processing queries
  → Monitor with pg_stat_statements, drop unused indexes
  → Consider table partitioning if table grows beyond 100M
```

**Q8: Giải thích trade-off giữa normalization và denormalization trong context performance.**

**Normalization:** Giảm data redundancy, đảm bảo consistency. Nhưng queries phức tạp cần nhiều JOINs → chậm hơn cho read-heavy workloads.

**Denormalization:** Store computed/duplicated data → fewer JOINs → faster reads. Nhưng: data inconsistency risk, write amplification (phải update nhiều nơi).

**Khi nào denormalize:**

- Read/write ratio rất cao (100:1 hoặc hơn)
- JOINs trên bảng rất lớn quá chậm dù đã optimize index
- Derived/computed values cần thường xuyên (total_amount, item_count)
- Acceptable inconsistency window (eventual consistency OK)

**Patterns:** Materialized views, summary tables (cron update), cache columns (counter cache), JSONB aggregated data.

**Q9: Bảng `events` 500M rows, write-heavy (50K inserts/sec). Queries chủ yếu filter theo `user_id` + `event_type` + `created_at` trong 7 ngày gần nhất. Thiết kế optimization strategy.**

```
1. Partitioning: RANGE by created_at (weekly/daily)
   → Auto-drop old partitions (data retention)
   → Small partitions = small indexes = faster inserts
   → Partition pruning for "last 7 days" queries

2. Minimal indexes per partition:
   → INDEX(user_id, event_type, created_at) — composite, ERS order
   → Avoid over-indexing (write-heavy!)
   → Each partition's index is small → fits in RAM

3. Write optimization:
   → Batch inserts (multi-row INSERT or COPY)
   → Async commit for non-critical events
   → Consider unlogged table for staging → periodic COPY to main

4. Old partition management:
   → DETACH old partitions → archive to cold storage
   → DROP partition = instant delete (vs DELETE 500M rows)

5. Monitoring:
   → pg_stat_statements for slow queries
   → Partition sizes balanced
   → Index bloat per partition (auto-vacuum tuning)
```

**Q10: Bạn phát hiện một production query đột ngột chậm (từ 5ms → 2000ms) dù không có code change. Nguyên nhân có thể là gì?**

**Systematic debugging approach:**

1. **Statistics stale** — autovacuum/analyze bị block hoặc chậm → planner chọn sai plan. Fix: `ANALYZE table_name;`

2. **Plan regression** — PostgreSQL planner thay đổi plan do data distribution thay đổi (ví dụ: cột status từ 90% active → 50% active). Fix: Kiểm tra EXPLAIN, có thể cần index khác.

3. **Table/index bloat** — Dead tuples tích tụ → pages nhiều hơn → scan chậm hơn. Fix: `VACUUM FULL` hoặc `pg_repack`.

4. **Lock contention** — Long transaction giữ lock → query wait. Check: `pg_stat_activity`, `pg_locks`.

5. **Resource saturation** — CPU/Memory/Disk I/O maxed out do traffic spike. Check: system metrics.

6. **Connection pool exhaustion** — All connections busy → query queued. Check: connection pool metrics.

7. **Buffer pool thrashing** — Bảng mới hoặc query mới đẩy hot pages ra khỏi cache. Check: cache hit ratio drop.

---

_Document version: 2024. Focused on PostgreSQL & MySQL/InnoDB. Covers common interview topics at Employment Hero, Grab, and similar companies in Southeast Asia._

---

## Interview Q&A / Câu Hỏi Phỏng Vấn

### Q: What is a database index and how does it work internally? / Database index là gì và hoạt động nội bộ như thế nào? 🟢 Junior

**A:** An index is a separate data structure (B+ Tree by default in PostgreSQL/MySQL) maintained alongside the table to speed up lookups. Without index → full table scan O(n). With B+ Tree index → O(log n) lookup.

```
Without index (10M rows):
SELECT * FROM users WHERE email = 'a@b.com'
→ Scan all 10M rows one by one → slow

With B+ Tree index on email:
Root [m..z]
  /       \
[a..l]  [m..z]     ← find 'a' branch (3 disk reads)
  |
[email='a@b.com', row_ptr=0x123]  → fetch row
→ 3 reads instead of 10M ✓

Index write cost: INSERT/UPDATE/DELETE must update ALL indexes on table
```

Vietnamese explanation: Index không free — write overhead (mỗi write phải update index), space overhead (B+ Tree cần storage). Trade-off: đánh index cho columns hay dùng trong WHERE, JOIN, ORDER BY. Đừng over-index write-heavy tables (events/logs). PostgreSQL: B-tree (default), Hash (equality only), GiST/GIN (full-text, JSON arrays). MySQL InnoDB: clustered index (PK = data storage order) → secondary indexes store PK as pointer.

---

### Q: What is the difference between clustered and non-clustered index? / Clustered vs non-clustered index? 🟡 Mid

**A:** A **clustered index** determines physical row storage order — data rows ARE the index leaf nodes. One per table. In InnoDB, the primary key is always clustered. A **non-clustered index** is separate — leaf nodes store pointers (PK value) back to actual rows.

```
Clustered (InnoDB primary key):
Leaf: [id=1, name=Alice, email=a@b.com, ...]  ← actual row data
      [id=2, name=Bob,   email=b@c.com, ...]

Non-clustered (secondary index on email):
Leaf: [email='a@b.com', pk=1]  ← pointer, not actual row
      [email='b@c.com', pk=2]
→ lookup by email: index scan + PK lookup (2 reads = "double lookup")

Covering index: include all needed columns in index
→ avoid double lookup (Index Only Scan in PostgreSQL)
```

Vietnamese explanation: PostgreSQL không có clustered index như InnoDB — tất cả indexes đều non-clustered (heap table). InnoDB implications: (1) UUID as PK → random page splits (dùng ULID hoặc sequential UUID). (2) Secondary index lookup = 2 B-tree traversals. (3) Covering index = include columns avoid second lookup. Narrow PK (INT vs BIGINT vs UUID) ảnh hưởng secondary index size vì PK stored in every secondary index.

---

### Q: What is an N+1 query problem and how do you fix it? / N+1 query problem là gì và cách fix? 🟡 Mid

**A:** N+1 occurs when you load N records then make a separate query for each — N+1 total queries instead of 1-2. Very common with ORMs using lazy loading.

```
N+1 Problem:
// 1 query for 100 users
users = db.query("SELECT * FROM users LIMIT 100")
// 100 queries for their posts!
for user in users:
    posts = db.query("SELECT * FROM posts WHERE user_id = ?", user.id)
→ 101 queries total!

Fix — Eager loading (single JOIN):
SELECT users.*, posts.*
FROM users
LEFT JOIN posts ON posts.user_id = users.id
WHERE users.id IN (1,2,...,100)
→ 1-2 queries total ✓

Or: DataLoader pattern (batch by IDs, used in GraphQL)
```

Vietnamese explanation: N+1 phổ biến với ORM lazy loading (Rails `has_many`, Django ORM, GORM). Fix: (1) Eager loading — Rails `includes`, Django `prefetch_related`, GORM `Preload`. (2) DataLoader — batch all IDs, single IN query. (3) Denormalization — store frequently needed data together. Detection: enable query logging, count queries per request (> 10 similar queries = N+1 suspect). APM tools (Datadog, NewRelic) visualize N+1 patterns.

---

### Q: How do you use EXPLAIN ANALYZE to diagnose slow queries? / Dùng EXPLAIN ANALYZE để diagnose slow queries như thế nào? 🔴 Senior

**A:** `EXPLAIN` shows execution plan without running. `EXPLAIN ANALYZE` runs the query and shows actual timing. Key nodes to recognize:

```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';

-- Bad:
Seq Scan on orders (cost=0..95000 rows=50000)
  Filter: (user_id = 123 AND status = 'pending')
  Rows Removed by Filter: 4950000
  Actual time: 245ms

-- After INDEX(user_id, status):
Index Scan on orders_user_status_idx (cost=0.43..8.56 rows=5)
  Index Cond: (user_id = 123 AND status = 'pending')
  Actual time: 0.8ms  ← 300x faster!

-- Even better: Index Only Scan (covering index)
-- = no heap fetch needed
```

Key plan nodes: `Seq Scan` = full table scan (bad for large tables). `Index Scan` = using index. `Index Only Scan` = covering index hit (best). `Hash Join` / `Nested Loop` / `Merge Join` = join strategies. `cost=X..Y` = estimated; `actual time=Z` = real.

Vietnamese explanation: `cost` là estimated (planner dùng statistics), `actual time` là real (ANALYZE mode). Nếu actual >> estimated → statistics stale → chạy `ANALYZE table_name`. Red flags: (1) `Seq Scan` trên bảng > 10K rows. (2) `Rows Removed by Filter` lớn → index không selective. (3) Nested Loop với large tables → thiếu index trên join column. PostgreSQL: `pg_stat_statements` track top N slow queries. MySQL: `slow_query_log` + `long_query_time=1`.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                         | Difficulty | Core Concept | Key Signal                                     |
| --- | -------------------------------- | ---------- | ------------ | ---------------------------------------------- |
| 1   | Index là gì? Tại sao nhanh hơn?  | 🟢         | Fundamentals | B+ Tree O(log n), trade-off write cost         |
| 2   | Index trade-off                  | 🟢         | Fundamentals | Read faster, write slower, space cost          |
| 3   | Khi nào nên/không nên index?     | 🟡         | Fundamentals | Selectivity, write ratio, EXPLAIN verify       |
| 4   | B+ Tree structure in DB          | 🟡         | B+ Tree      | Balanced, leaf nodes linked, height 3-4        |
| 5   | Query traverse B+ Tree           | 🟡         | B+ Tree      | Root→internal→leaf, comparison at each level   |
| 6   | Clustered vs Non-Clustered       | 🔴         | B+ Tree      | InnoDB PK=clustered, PG=heap, double lookup    |
| 7   | Index types and when to use      | 🟡         | Index Types  | B-tree/Hash/GIN/GiST/BRIN matching             |
| 8   | Leftmost prefix rule             | 🟡         | Composite    | Phone book analogy, ERS column order           |
| 9   | Composite index column ordering  | 🔴         | Composite    | Equality first, range last, selectivity        |
| 10  | Covering index                   | 🟡         | Covering     | INCLUDE columns, Index Only Scan               |
| 11  | Partial index                    | 🟡         | Partial      | WHERE clause in CREATE INDEX, small+fast       |
| 12  | Read PG query plan               | 🟡         | EXPLAIN      | Seq Scan, Index Scan, cost, rows               |
| 13  | Read MySQL EXPLAIN               | 🟡         | EXPLAIN      | type column, possible_keys, Extra              |
| 14  | Analyze real EXPLAIN output      | 🔴         | EXPLAIN      | Actual vs estimated, stale stats               |
| 15  | Index-killing patterns           | 🟡         | Optimization | Function-on-column, type mismatch, OR          |
| 16  | OFFSET pagination slow           | 🔴         | Optimization | Keyset pagination, deferred join               |
| 17  | N+1 query problem                | 🔴         | Optimization | ORM lazy loading, eager load fix               |
| 18  | Subquery vs JOIN                 | 🟡         | Optimization | Correlated=O(n²), JOIN preferred               |
| 19  | Partitioning when/types          | 🔴         | Partitioning | Range/list/hash, pruning                       |
| 20  | Partition types comparison       | 🔴         | Partitioning | Range=time, List=enum, Hash=even               |
| 21  | Partition pruning                | 🔴         | Partitioning | Optimizer eliminates irrelevant partitions     |
| 22  | DB performance metrics           | 🟡         | Monitoring   | Cache hit, TPS, connections, replication lag   |
| 23  | PG monitoring tools              | 🔴         | Monitoring   | pg_stat_statements, pg_stat_activity           |
| 24  | MySQL monitoring                 | 🟡         | Monitoring   | slow_query_log, SHOW STATUS                    |
| 25  | Write optimization               | 🔴         | Write Opt    | Batch insert, minimal indexes, partitioning    |
| C1  | When to add index?               | 🟢         | Fundamentals | WHERE/JOIN/ORDER + selectivity + size          |
| C2  | Clustered vs non-clustered       | 🟢         | B+ Tree      | Physical sort vs separate structure            |
| C3  | YEAR(created_at) kills index     | 🟢         | Optimization | Function prevents tree traversal               |
| C4  | Leftmost prefix with examples    | 🟡         | Composite    | (a,b,c) → match from left                      |
| C5  | Walk through optimization        | 🟡         | EXPLAIN      | EXPLAIN→bottleneck→index→re-EXPLAIN            |
| C6  | OFFSET slow, keyset fix          | 🟡         | Optimization | Cursor-based O(log N) constant                 |
| C7  | Design index for 100M orders     | 🔴         | Composite    | ERS per query, covering, partial               |
| C8  | Normalization vs denormalization | 🔴         | Optimization | Measure first, materialized views              |
| C9  | 500M write-heavy events table    | 🔴         | Partitioning | Partition+minimal index+batch+async            |
| C10 | Sudden slow query debugging      | 🔴         | Monitoring   | Stats stale→plan regression→bloat→locks        |
| B1  | How indexes work internally      | 🟢         | Fundamentals | B+ Tree, write overhead, WHERE/JOIN cols       |
| B2  | Clustered vs non-clustered       | 🟡         | B+ Tree      | InnoDB PK=clustered, covering avoids double    |
| B3  | N+1 query problem & fix          | 🟡         | Optimization | Eager loading, DataLoader batching             |
| B4  | EXPLAIN ANALYZE diagnosis        | 🔴         | EXPLAIN      | Seq Scan bad, actual vs estimated, stale stats |

**Distribution:** 🟢 5 (13%) | 🟡 17 (44%) | 🔴 17 (44%) — 39 total

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Interviewer:** "Bảng orders 200 triệu rows, query `WHERE customer_id = ? AND created_at BETWEEN ? AND ? ORDER BY amount DESC LIMIT 10` chậm 3 giây. Bạn fix thế nào?"

**30-second answer:**
"Đầu tiên chạy EXPLAIN ANALYZE xem query plan. Khả năng cao đang Seq Scan hoặc chỉ dùng single-column index. Tạo composite index `INDEX(customer_id, created_at, amount DESC)` — equality column first (customer_id), range column second (created_at), sort column third (amount DESC). Nếu chỉ SELECT vài columns, thêm INCLUDE clause → covering index → Index Only Scan, zero heap access. Verify lại bằng EXPLAIN ANALYZE — expect Index Scan hoặc Index Only Scan, cost giảm 100x."

> **Follow-up:** "Nếu có 50 microservices query cùng lúc, còn gì cần optimize?"

"Connection pooling — PgBouncer transaction mode, per-service pool limit, tổng connections ≤ max_connections minus headroom. Nếu table quá lớn: partition by RANGE(created_at) — monthly. Mỗi partition có index riêng, nhỏ hơn, fit in RAM better. Partition pruning tự loại các tháng không cần."

---

## ✅ Self-Check / Tự Kiểm Tra

Trả lời không nhìn tài liệu. Nếu < 5/7 đúng → đọc lại phần tương ứng.

| #   | Question                                                        | Key Points                                                       |
| --- | --------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | B+ Tree tại sao nhanh hơn seq scan?                             | Balanced, height 3-4, O(log n), leaf nodes linked for range scan |
| 2   | Clustered vs non-clustered: cái nào 2 lần lookup?               | Non-clustered: index→PK→clustered data (double lookup)           |
| 3   | Leftmost prefix rule: INDEX(a,b,c), WHERE b=1 dùng index không? | Không — phải match từ trái: a trước, rồi b, rồi c                |
| 4   | Covering index tránh được gì?                                   | Tránh heap/table access — tất cả data từ index → Index Only Scan |
| 5   | EXPLAIN ANALYZE: Seq Scan 10M rows có phải red flag?            | Có — cần index hoặc partition. Check Rows Removed by Filter      |
| 6   | N+1 problem: 100 users + posts → bao nhiêu queries?             | 101 queries (1 + 100). Fix: JOIN hoặc IN query batch             |
| 7   | OFFSET 1M + LIMIT 20: tại sao chậm? Fix?                        | Scan 1M rows rồi bỏ. Fix: keyset pagination WHERE id > last_id   |

### Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When          | Focus                                                       |
| ----- | ------------- | ----------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Self-Check, answer from memory                     |
| 2     | Day 3         | B+ Tree + Composite Index + EXPLAIN — core interview topics |
| 3     | Day 7         | N+1, pagination, query optimization patterns                |
| 4     | Day 14        | Partitioning, monitoring, write optimization                |
| 5     | Day 30        | Full review — Cold Call simulation practice                 |

---

## 🔗 Connections / Liên Kết

### Same Track (Database Advanced)

- → [01-SQL Fundamentals](./01-sql-fundamentals.md) — ACID, isolation, locking prerequisite for understanding index behavior under concurrency
- → [03-NoSQL & Redis](./03-nosql-redis-mongo.md) — NoSQL indexing (LSM tree, skip list) contrasts B+ Tree
- → [04-Caching Patterns](./04-caching-patterns.md) — Cache reduces DB load, but cache invalidation requires understanding index-level changes

### Cross-Track

- → [01-golang/01-Language Fundamentals](../01-golang/01-language-fundamentals.md) — Go map internals = hash table, similar to Hash index concept
- → [02-backend-knowledge/01-API Design](../02-backend-knowledge/01-api-design.md) — Pagination API design depends on keyset vs offset strategy
- → [02-backend-knowledge/03-Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — Sharding = horizontal partitioning across nodes
- → [04-be-system-design/01-Design Framework](../04-be-system-design/01-design-framework.md) — System design requires DB schema + index justification
