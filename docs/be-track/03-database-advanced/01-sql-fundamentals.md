# SQL & Database Fundamentals — Deep Dive

> **Track**: BE | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Table of Contents](../../00-table-of-contents.md)

> **Phương pháp**: ~85% lý thuyết / 15% SQL ví dụ. Q&A format.
> **Difficulty**: 🟢 Junior | 🟡 Middle | 🔴 Senior
> **Prerequisites**: [Database Theory](../../shared/03-database/database-theory.md)

---

## Real-World Scenario / Tình Huống Thực Tế

**Shopee Flash Sale, 11.11:** `SELECT * FROM orders WHERE user_id = ?` chạy 8 giây vì bảng `orders` có 500 triệu rows và không có index trên `user_id`. DBA thêm index: query xuống 2ms. Nhưng sau đó, INSERT rate giảm 30% vì index cần được cập nhật với mỗi lần insert.

**Bài học:** SQL không phải "write query, it works". Biết khi nào query chậm, tại sao, và cách fix mà không tạo vấn đề mới (index overhead) là kỹ năng phân biệt junior vs senior backend dev.

## What & Why / Cái Gì & Tại Sao

**Analogy:** Database giống **thư viện khổng lồ**. SQL là ngôn ngữ yêu cầu: "Lấy cho tôi tất cả sách của tác giả 'Nguyễn Du'." Không có index = nhân viên phải duyệt từng cuốn sách trong kho (full scan). Có index = nhân viên dùng catalogue theo tên tác giả (O(log n) lookup). ACID = cam kết: mượn sách phải được ghi đầy đủ vào sổ, không mất thông tin.

**Why SQL mastery matters:** JOIN, index, isolation levels, và transactions xuất hiện trong 90% backend interviews. Tiki, Grab, Shopee đều có database problems trong vòng phỏng vấn technical.

## Concept Map / Bản Đồ Khái Niệm

```
[SQL & Relational Databases]
        │
        ├── Relational Model → tables, rows, foreign keys, normalization
        │
        ├── Query Execution → parser → optimizer → executor → result
        │       └── EXPLAIN ANALYZE: see query plan, cost, rows
        │
        ├── Indexing → B-Tree (range), Hash (equality), GIN (full-text)
        │       └── Trade-off: faster reads, slower writes
        │
        ├── Transactions (ACID)
        │       ├── Atomicity — all or nothing
        │       ├── Consistency — constraints always valid
        │       ├── Isolation — concurrent transactions don't interfere
        │       └── Durability — committed data survives crashes
        │
        └── Isolation Levels (weakest → strongest)
                READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE
```

---

## Overview / Tổng Quan

Bài này cover toàn bộ nền tảng SQL & relational database — từ relational model đến production-grade tooling. Các khái niệm liên kết chặt chẽ: **model** quy định cấu trúc, **normalization** tối ưu thiết kế, **query** khai thác dữ liệu, **transaction** đảm bảo correctness, **isolation/locking** kiểm soát concurrency, **DBMS-specific** features quyết định production choice, **pooling/migration/ORM** hoàn thiện operational stack.

| #   | Concept                     | Role                                                     | Interview Weight  |
| --- | --------------------------- | -------------------------------------------------------- | ----------------- |
| 1   | **Relational Model**        | Foundation: tables, keys, algebra — mọi thứ xây trên đây | 🟢 Must-know      |
| 2   | **Normalization**           | Design quality: 1NF→BCNF + denormalization trade-offs    | 🟡 Mid-Senior     |
| 3   | **SQL Query Mastery**       | JOINs, Window Functions, CTEs, subqueries                | 🟡 Coding round   |
| 4   | **Transactions & ACID**     | Correctness guarantee: atomicity→durability              | 🟢🟡 Always asked |
| 5   | **Isolation & Locking**     | Concurrency control: MVCC, gap locks, deadlock           | 🔴 Senior diff    |
| 6   | **PostgreSQL & MySQL**      | DBMS internals: VACUUM, InnoDB, partitioning             | 🟡🔴 Deep dive    |
| 7   | **Pooling, Migration, ORM** | Production ops: PgBouncer, zero-downtime DDL, sqlc       | 🟡 Practical      |

**Mối quan hệ:** Relational Model → Normalization thiết kế → SQL khai thác → ACID+Isolation bảo vệ → DBMS-specific triển khai → Pooling/Migration/ORM vận hành.

---

## Core Concepts — Phase 2 Deep Content

### Concept 1: Relational Model

- **Memory Hook / Móc Nhớ:** "Table = Excel sheet có rules" — PK là mã vạch, FK là hyperlink giữa sheets.
- **Why exists (tại sao tồn tại):**
  - Level 1: Tổ chức dữ liệu thành bảng có cấu trúc thay vì flat files hỗn loạn
  - Level 2: Codd's 12 rules (1970) — mathematical foundation cho data independence, giải quyết hierarchical/network model limitations
  - Level 3: Set theory + first-order logic → declarative querying (nói "what" không phải "how") → optimizer tự chọn execution plan
- **Common Mistakes:**
  - Dùng composite PK quá nhiều cột → JOIN complexity tăng
  - Natural key thay đổi (email) → cascade update nightmare
  - Quên FK constraint → orphan records silently corrupt data
- **Interview Pattern:** "Explain relational model basics" → Signal: mention Codd, distinguish PK/FK/candidate key, explain referential integrity không chỉ liệt kê
- **Knowledge Chain:** Relational Model → Normalization → Query Optimization → Schema Design interviews

### Concept 2: Normalization

- **Memory Hook / Móc Nhớ:** "1NF = atomic, 2NF = no partial, 3NF = no transitive" — nhớ 3 từ khóa là đủ.
- **Why exists:**
  - Level 1: Loại bỏ data redundancy → giảm anomalies (insert/update/delete)
  - Level 2: Functional dependency theory — nếu A→B thì B phụ thuộc A, normalize = tách các dependency vào đúng bảng
  - Level 3: Trade-off: normalize tối đa → nhiều JOINs → denormalize có chủ đích khi read-heavy workload cần materialized view hoặc precomputed columns
- **Common Mistakes:**
  - Over-normalize: 20 bảng cho 1 entity → JOIN hell, query timeout
  - Denormalize quá sớm không có benchmark evidence
  - Quên BCNF khi composite key có overlapping dependencies
- **Interview Pattern:** "When to denormalize?" → Signal: nói rõ "measure first" — show EXPLAIN ANALYZE proof trước khi denormalize
- **Knowledge Chain:** Normalization → Index Design (normalized tables need targeted indexes) → Query Performance

### Concept 3: SQL Query Mastery

- **Memory Hook / Móc Nhớ:** "FROM → WHERE → GROUP → HAVING → SELECT → ORDER → LIMIT" — query execution order, đọc như pipeline.
- **Why exists:**
  - Level 1: Declarative language — nói "lấy gì" thay vì "lặp thế nào" → optimizer quyết định execution plan
  - Level 2: Set-based operations (JOIN, UNION) thay vì row-by-row → O(n) thay vì O(n²) cho nhiều patterns
  - Level 3: Window Functions + CTEs mở rộng expressive power — running totals, ranking, recursive traversal mà không cần application code
- **Common Mistakes:**
  - `SELECT *` production → truyền thừa data, miss covering index opportunity
  - Correlated subquery thay vì JOIN → O(n²)
  - Window function without PARTITION BY → compute trên toàn bộ result set
- **Interview Pattern:** "Write a query for ranking/top-N/running total" → Signal: dùng Window Function, giải thích PARTITION BY vs ORDER BY
- **Knowledge Chain:** SQL Queries → EXPLAIN ANALYZE → Index Optimization → Application Performance

### Concept 4: Transactions & ACID

- **Memory Hook / Móc Nhớ:** "ACID = Bank transfer safety" — A: cả hai debit+credit hoặc rollback, C: tổng tiền không đổi, I: người khác không thấy trạng thái giữa, D: sau commit mất điện vẫn còn.
- **Why exists:**
  - Level 1: Đảm bảo correctness khi multiple operations phải succeed/fail together
  - Level 2: WAL (Write-Ahead Log) + undo log — crash recovery mechanism: ghi log trước data → replay sau crash
  - Level 3: 2PC (Two-Phase Commit) cho distributed transactions, nhưng performance penalty → eventual consistency alternatives (Saga pattern)
- **Common Mistakes:**
  - Long-running transactions → hold locks → block other queries → cascade timeout
  - Quên `defer tx.Rollback()` trong Go → connection leak
  - Assume ACID = no bugs → application logic errors vẫn commit wrong data
- **Interview Pattern:** "Explain ACID with real example" → Signal: bank transfer + mention WAL cho Durability, undo log cho Atomicity
- **Knowledge Chain:** ACID → Isolation Levels → Distributed Transactions (Saga) → System Design consistency choices

### Concept 5: Isolation & Locking

- **Memory Hook / Móc Nhớ:** "Read Committed = đọc đúng nhưng phantom; Serializable = safe nhưng chậm" — isolation ladder.
- **Why exists:**
  - Level 1: Concurrent transactions cần rules — ai thấy gì, khi nào, để tránh dirty/phantom/non-repeatable reads
  - Level 2: MVCC (Multi-Version Concurrency Control) — mỗi transaction thấy snapshot riêng, readers không block writers
  - Level 3: PG SSI vs MySQL gap locks — hai approaches khác nhau cho serializable: PG detect dependency cycles, MySQL prevent phantom via gap+next-key locks
- **Common Mistakes:**
  - Default Read Committed cho financial system → write skew
  - `SELECT FOR UPDATE` quên index → table-level lock
  - Deadlock không có retry logic → user-facing error
- **Interview Pattern:** "MVCC deep dive" → Signal: explain xmin/xmax (PG) hoặc DB_TRX_ID (MySQL), visibility rules, VACUUM necessity
- **Knowledge Chain:** Isolation → MVCC internals → Deadlock detection → Distributed locking (Redis/Consul)

### Concept 6: PostgreSQL & MySQL Internals

- **Memory Hook / Móc Nhớ:** "PG = MVCC + VACUUM, MySQL = InnoDB + undo log chain" — hai triết lý khác nhau cho cùng vấn đề.
- **Why exists:**
  - Level 1: Production database cần hiểu internals để tune performance — không thể chỉ biết SQL syntax
  - Level 2: VACUUM (PG) xoá dead tuples, autovacuum settings critical — InnoDB buffer pool sizing quyết định cache hit ratio
  - Level 3: Partitioning strategies (range/list/hash), materialized views, pg_stat_statements → monitoring → informed optimization
- **Common Mistakes:**
  - VACUUM never tuned → table bloat 10x actual data size
  - InnoDB buffer pool < 70% memory → disk I/O bottleneck
  - Materialized view never refreshed → stale data in reports
- **Interview Pattern:** "How would you tune a production PG?" → Signal: mention autovacuum, pg_stat_statements, connection limits, partitioning for large tables
- **Knowledge Chain:** DBMS Internals → Performance Tuning → Monitoring → Capacity Planning

### Concept 7: Pooling, Migration & ORM

- **Memory Hook / Móc Nhớ:** "Pool = airport security gates, Migration = renovating while shop is open, ORM = Google Translate for SQL."
- **Why exists:**
  - Level 1: Database connections expensive (fork process in PG) → pool reuses connections → reduce overhead
  - Level 2: Schema evolution without downtime: expand→migrate→contract pattern — add nullable first, backfill, add constraint, remove old
  - Level 3: ORM trade-offs: GORM (fast dev, N+1 risk), sqlx (flexible, manual), sqlc (type-safe, compile-time checked) → choose by team size and query complexity
- **Common Mistakes:**
  - No `SetMaxOpenConns` in Go → unlimited connections → PG crashes
  - `ALTER TABLE ADD NOT NULL` on large table → table lock minutes
  - GORM eager loading without limit → load entire related tables
- **Interview Pattern:** "Connection pool sizing" → Signal: `(cores × 2) + spindles` formula, PgBouncer transaction mode, monitor pool_wait
- **Knowledge Chain:** Pooling → Capacity Planning → Migration → CI/CD → ORM → Application Architecture

---

## 1. Relational Model Basics

## Câu Hỏi Phỏng Vấn / Interview Q&A

### Q: What are the core components of the relational model? 🟢 🟢 [Junior]

**Bảng (Table / Relation):** Tập hợp các hàng (rows/tuples) có cùng cấu trúc, mỗi hàng đại diện một thực thể.
**Cột (Column / Attribute):** Mô tả một thuộc tính của thực thể, có kiểu dữ liệu cố định.

```
┌─────────────────────────────────────────────────┐
│                  TABLE: employees                │
├──────┬───────────┬────────────┬─────────────────┤
│  id  │   name    │ dept_id    │   salary        │
│ (PK) │ VARCHAR   │ (FK)       │   DECIMAL       │
├──────┼───────────┼────────────┼─────────────────┤
│  1   │ "Minh"    │    10      │   2000          │
│  2   │ "Lan"     │    20      │   2500          │
│  3   │ "Hùng"    │    10      │   1800          │
└──────┴───────────┴────────────┴─────────────────┘
   ▲                     │
   │ Primary Key         │ Foreign Key → departments.id
   │ (unique, not null)  │
```

**Các loại key:**

| Key Type             | Mô tả                                                          | Ví dụ                                            |
| -------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| **Primary Key (PK)** | Định danh duy nhất cho mỗi row, NOT NULL + UNIQUE              | `employees.id`                                   |
| **Foreign Key (FK)** | Tham chiếu đến PK của bảng khác, đảm bảo referential integrity | `employees.dept_id → departments.id`             |
| **Composite Key**    | PK gồm nhiều cột, khi một cột không đủ unique                  | `(student_id, course_id)` trong bảng enrollments |
| **Candidate Key**    | Tất cả các tập cột có thể làm PK                               | `email`, `phone` đều unique → đều là candidate   |
| **Natural Key**      | Key có ý nghĩa business (email, SSN)                           | Dễ hiểu nhưng có thể thay đổi                    |
| **Surrogate Key**    | Key nhân tạo, không có ý nghĩa business (auto-increment, UUID) | Ổn định, không thay đổi                          |

### Q: What are the fundamental relational algebra operations? 🟡 🟡 [Mid]

Relational algebra là nền tảng toán học đằng sau SQL. Mỗi câu SQL thực chất là tổ hợp các phép toán này.

**Selection (σ) — WHERE clause:**
Lọc hàng theo điều kiện. Tương đương `WHERE salary > 2000`. Chỉ giữ lại các tuple thoả mãn predicate.

**Projection (π) — SELECT columns:**
Chọn cột. Tương đương `SELECT name, salary`. Loại bỏ các attribute không cần thiết.

**Join (⋈) — JOIN clause:**
Kết hợp hai relation dựa trên điều kiện chung. Đây là phép toán quan trọng nhất vì dữ liệu relational phân tán qua nhiều bảng.

**Set operations:**

- **Union (∪):** Gộp kết quả, loại trùng → `UNION`
- **Intersection (∩):** Lấy phần chung → `INTERSECT`
- **Difference (−):** Lấy phần khác biệt → `EXCEPT`

### Q: Explain Entity-Relationship (ER) diagram concepts 🟢 🟢 [Junior]

ER diagram mô hình hoá dữ liệu ở mức logic trước khi thiết kế bảng.

```
  ┌───────────┐       1    N    ┌───────────┐
  │ Department │──────────────│  Employee  │
  │            │              │            │
  │ - id (PK)  │              │ - id (PK)  │
  │ - name     │              │ - name     │
  └───────────┘              │ - dept_id  │
                              └───────────┘

  Cardinality:
    1:1  → Một người - một passport
    1:N  → Một department - nhiều employees
    M:N  → Nhiều students - nhiều courses (cần bảng trung gian)
```

**Ba loại quan hệ chính:**

- **1:1 (One-to-One):** FK ở bảng nào cũng được, thường đặt ở bảng phụ. Ví dụ: `user ↔ user_profile`.
- **1:N (One-to-Many):** FK đặt ở phía "Many". Ví dụ: `department ← employees.dept_id`.
- **M:N (Many-to-Many):** Phải tạo junction table. Ví dụ: `students ↔ enrollments ↔ courses`.

---

## 2. Normalization

### Q: Explain 1NF, 2NF, 3NF, BCNF with examples 🟡 🟡 [Mid]

Normalization là quá trình tổ chức dữ liệu để **giảm redundancy** (dư thừa) và **tránh update anomalies** (bất thường khi cập nhật).

**1NF — First Normal Form:**

- Mỗi cột chỉ chứa **giá trị atomic** (không phải list, set, hay nested object).
- Mỗi row phải unique (có PK).

```
❌ Vi phạm 1NF:
┌────┬───────────────────┐
│ id │ phone_numbers      │
├────┼───────────────────┤
│ 1  │ "0901,0902,0903"  │  ← Nhiều giá trị trong 1 cell
└────┴───────────────────┘

✅ Thoả 1NF:
┌────┬──────────────┐
│ id │ phone_number │
├────┼──────────────┤
│ 1  │ 0901         │
│ 1  │ 0902         │
│ 1  │ 0903         │
└────┴──────────────┘
```

**2NF — Second Normal Form:**

- Đã ở 1NF.
- Mọi non-key column phải phụ thuộc vào **toàn bộ** composite PK, không phải chỉ một phần.
- Chỉ áp dụng khi có composite PK.

```
❌ Vi phạm 2NF (PK = student_id + course_id):
┌────────────┬───────────┬──────────────┬────────────────┐
│ student_id │ course_id │ student_name │ grade          │
├────────────┼───────────┼──────────────┼────────────────┤
│ 1          │ 101       │ "Minh"       │ "A"            │
│ 1          │ 102       │ "Minh"       │ "B"            │
└────────────┴───────────┴──────────────┴────────────────┘
  student_name chỉ phụ thuộc student_id → partial dependency!

✅ Tách bảng:
  students(student_id PK, student_name)
  enrollments(student_id, course_id, grade)  -- composite PK
```

**3NF — Third Normal Form:**

- Đã ở 2NF.
- Không có **transitive dependency**: non-key column không được phụ thuộc vào non-key column khác.

```
❌ Vi phạm 3NF:
┌────┬──────┬─────────┬───────────┐
│ id │ name │ dept_id │ dept_name │
└────┴──────┴─────────┴───────────┘
  dept_name phụ thuộc dept_id (không phải PK) → transitive dependency!

✅ Tách: employees(id, name, dept_id) + departments(dept_id, dept_name)
```

**BCNF — Boyce-Codd Normal Form:**

- Mọi functional dependency X → Y thì X phải là **superkey**.
- Chặt hơn 3NF: xử lý trường hợp candidate key chồng chéo.
- Trong thực tế, hầu hết bảng ở 3NF đã thoả BCNF.

```
Tổng kết progressive normalization:

  Unnormalized → 1NF: Atomic values
                → 2NF: No partial dependency (trên composite key)
                → 3NF: No transitive dependency
                → BCNF: Every determinant is a candidate key
```

### Q: When should you denormalize? 🟡 🟡 [Mid]

Denormalization là **cố tình thêm redundancy** để tăng hiệu suất đọc.

**Decision Matrix:**

| Tiêu chí                     | Normalize                    | Denormalize              |
| ---------------------------- | ---------------------------- | ------------------------ |
| Write-heavy workload         | ✅ Ít redundancy → ít update | ❌ Phải update nhiều nơi |
| Read-heavy workload          | ❌ Nhiều JOIN chậm           | ✅ Đọc nhanh, ít JOIN    |
| Data consistency quan trọng  | ✅ Single source of truth    | ❌ Risk inconsistency    |
| Report/Analytics             | ❌ JOIN phức tạp             | ✅ Pre-computed data     |
| Storage cost là vấn đề       | ✅ Ít dữ liệu trùng          | ❌ Tốn storage           |
| Schema thay đổi thường xuyên | ✅ Dễ thay đổi               | ❌ Phải sync nhiều nơi   |

**Các kỹ thuật denormalization phổ biến:**

1. **Thêm computed column:** `order_total` thay vì SUM mỗi lần query
2. **Duplicate column:** Lưu `customer_name` trong `orders` để tránh JOIN
3. **Summary/aggregate table:** Pre-compute daily/monthly stats
4. **Materialized view:** PostgreSQL hỗ trợ built-in

> **Nguyên tắc:** Normalize trước (3NF), denormalize khi có **proof** về performance bottleneck qua monitoring/profiling.

---

## 3. SQL Query Deep Dive

### Q: Explain all JOIN types with diagrams 🟢 🟢 [Junior]

Giả sử có 2 bảng: `A` (left) và `B` (right).

```
Table A         Table B
┌────┬─────┐   ┌────┬─────┐
│ id │ val │   │ id │ val │
├────┼─────┤   ├────┼─────┤
│ 1  │ a1  │   │ 1  │ b1  │
│ 2  │ a2  │   │ 3  │ b3  │
│ 3  │ a3  │   │ 4  │ b4  │
└────┴─────┘   └────┴─────┘
```

**INNER JOIN** — Chỉ lấy rows match ở **cả hai** bảng:

```
    ┌───────┐ ┌───────┐
    │   A   │ │   B   │      Result: id 1, 3
    │   ┌───┼─┼───┐   │      (phần giao nhau)
    │   │ ▓▓│▓│▓▓ │   │
    │   └───┼─┼───┘   │
    └───────┘ └───────┘

    SELECT * FROM A INNER JOIN B ON A.id = B.id;
    → (1, a1, b1), (3, a3, b3)
```

**LEFT JOIN (LEFT OUTER JOIN)** — Tất cả rows từ A, match B nếu có, NULL nếu không:

```
    ┌───────┐ ┌───────┐
    │ ▓▓▓▓▓ │ │   B   │      Result: id 1, 2, 3
    │ ▓▓┌───┼─┼───┐   │      A.id=2 → B columns = NULL
    │ ▓▓│ ▓▓│▓│▓▓ │   │
    │ ▓▓└───┼─┼───┘   │
    └───────┘ └───────┘

    SELECT * FROM A LEFT JOIN B ON A.id = B.id;
    → (1, a1, b1), (2, a2, NULL), (3, a3, b3)
```

**RIGHT JOIN (RIGHT OUTER JOIN)** — Ngược lại LEFT JOIN, tất cả rows từ B:

```
    ┌───────┐ ┌───────┐
    │   A   │ │ ▓▓▓▓▓ │      Result: id 1, 3, 4
    │   ┌───┼─┼─▓▓┐▓▓ │      B.id=4 → A columns = NULL
    │   │ ▓▓│▓│▓▓ │▓▓ │
    │   └───┼─┼─▓▓┘▓▓ │
    └───────┘ └───────┘

    SELECT * FROM A RIGHT JOIN B ON A.id = B.id;
    → (1, a1, b1), (3, a3, b3), (NULL, NULL, b4)
```

**FULL OUTER JOIN** — Tất cả rows từ cả hai, NULL cho phía không match:

```
    ┌───────┐ ┌───────┐
    │ ▓▓▓▓▓ │ │ ▓▓▓▓▓ │      Result: id 1, 2, 3, 4
    │ ▓▓┌───┼─┼─▓▓┐▓▓ │      Mọi row đều xuất hiện
    │ ▓▓│ ▓▓│▓│▓▓ │▓▓ │
    │ ▓▓└───┼─┼─▓▓┘▓▓ │
    └───────┘ └───────┘
```

**CROSS JOIN** — Tích Descartes: mỗi row A ghép với MỌI row B:

```
    Kết quả: |A| × |B| = 3 × 3 = 9 rows
    Dùng khi: Generate tất cả combinations (calendar × products)
    ⚠️ Cẩn thận: 1000 × 1000 = 1,000,000 rows!
```

**SELF JOIN** — Bảng tự JOIN với chính nó, dùng alias khác nhau:

```sql
-- Tìm nhân viên và manager cùng bảng
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
```

Ứng dụng: hierarchical data (org chart), tìm pairs, so sánh rows trong cùng bảng.

### Q: Subqueries vs JOINs — which is faster? 🟡 🟡 [Mid]

Không có câu trả lời tuyệt đối — phụ thuộc vào query optimizer và data distribution.

| Tiêu chí                   | JOIN                                 | Subquery                              |
| -------------------------- | ------------------------------------ | ------------------------------------- |
| Readability                | Tốt cho quan hệ rõ ràng              | Tốt cho logic lồng nhau               |
| Optimization               | DB có thể chọn join algorithm tối ưu | Correlated subquery có thể chạy N lần |
| Performance (uncorrelated) | Tương đương                          | Tương đương (optimizer rewrite)       |
| Performance (correlated)   | Thường nhanh hơn                     | Có thể chậm (N+1 execution)           |
| Returns multiple columns   | ✅ Dễ dàng                           | ❌ Chỉ trả 1 column/scalar            |

**Correlated subquery** chạy lại cho **mỗi row** ở outer query — đây là trường hợp nguy hiểm nhất:

```sql
-- Correlated: chạy subquery N lần (chậm)
SELECT * FROM orders o
WHERE o.amount > (SELECT AVG(amount) FROM orders WHERE dept_id = o.dept_id);

-- Rewrite với JOIN (optimizer cũng có thể tự làm):
SELECT o.* FROM orders o
JOIN (SELECT dept_id, AVG(amount) avg_amt FROM orders GROUP BY dept_id) d
  ON o.dept_id = d.dept_id AND o.amount > d.avg_amt;
```

> **Thực tế:** Modern query optimizers (PostgreSQL, MySQL 8+) thường rewrite subquery thành JOIN. Kiểm tra bằng `EXPLAIN ANALYZE`.

### Q: Explain GROUP BY, HAVING, and aggregation functions 🟢 🟢 [Junior]

**GROUP BY** gom các row có cùng giá trị vào một nhóm, rồi áp dụng aggregate function lên mỗi nhóm.

**HAVING** lọc nhóm **sau** khi aggregate (WHERE lọc **trước** khi group).

```
Thứ tự thực thi SQL:

  FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
  ───────────────────────────────────────────────────────────────
  1. FROM:     Xác định bảng nguồn
  2. WHERE:    Lọc rows trước khi group
  3. GROUP BY: Gom nhóm
  4. HAVING:   Lọc nhóm sau khi aggregate
  5. SELECT:   Tính toán kết quả, aliases
  6. ORDER BY: Sắp xếp (có thể dùng alias)
  7. LIMIT:    Giới hạn kết quả
```

```sql
-- Tìm department có >5 nhân viên với lương trung bình >3000
SELECT dept_id, COUNT(*) as cnt, AVG(salary) as avg_sal
FROM employees
WHERE status = 'active'       -- lọc row TRƯỚC khi group
GROUP BY dept_id
HAVING COUNT(*) > 5           -- lọc nhóm SAU khi aggregate
   AND AVG(salary) > 3000
ORDER BY avg_sal DESC;
```

### Q: Explain Window Functions in depth 🟡 🟡 [Mid]

Window functions tính toán trên một **"cửa sổ"** (tập rows liên quan) mà **không collapse** rows như GROUP BY. Mỗi row giữ nguyên và thêm giá trị computed.

```
GROUP BY:  100 rows → 5 groups → 5 result rows  (collapsed)
WINDOW:    100 rows → 100 rows + computed column  (preserved)
```

**Cú pháp:** `function() OVER (PARTITION BY ... ORDER BY ...)`

| Function          | Mô tả                                                       |
| ----------------- | ----------------------------------------------------------- |
| `ROW_NUMBER()`    | Đánh số thứ tự 1, 2, 3... trong mỗi partition. Luôn unique. |
| `RANK()`          | Xếp hạng, **bỏ qua** hạng khi có tie. VD: 1, 2, 2, **4**    |
| `DENSE_RANK()`    | Xếp hạng, **không bỏ** hạng. VD: 1, 2, 2, **3**             |
| `LAG(col, n)`     | Lấy giá trị row **trước** n bước (default 1)                |
| `LEAD(col, n)`    | Lấy giá trị row **sau** n bước                              |
| `SUM() OVER(...)` | Running sum / cumulative sum                                |
| `NTILE(n)`        | Chia partition thành n buckets                              |

```sql
-- Top 3 nhân viên lương cao nhất MỖI department
SELECT * FROM (
  SELECT name, dept_id, salary,
         ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rn
  FROM employees
) ranked
WHERE rn <= 3;
```

```
Minh hoạ PARTITION BY:

  Partition: dept_id = 10       Partition: dept_id = 20
  ┌──────┬────────┬────┐       ┌──────┬────────┬────┐
  │ name │ salary │ rn │       │ name │ salary │ rn │
  ├──────┼────────┼────┤       ├──────┼────────┼────┤
  │ Hùng │  5000  │ 1  │       │ Lan  │  4500  │ 1  │
  │ Minh │  4000  │ 2  │       │ Mai  │  3800  │ 2  │
  │ Tuấn │  3500  │ 3  │       │ Nam  │  3200  │ 3  │
  └──────┴────────┴────┘       └──────┴────────┴────┘
  ROW_NUMBER reset mỗi partition
```

### Q: What are CTEs and recursive CTEs? 🟡 🟡 [Mid]

**CTE (Common Table Expression):** Tạo "bảng tạm" có tên trong scope một query. Giúp code dễ đọc, tái sử dụng sub-result.

**Recursive CTE** đặc biệt hữu ích cho **hierarchical/tree data** (org chart, category tree, BOM).

```sql
-- Recursive CTE: tìm tất cả subordinates của manager_id = 1
WITH RECURSIVE subordinates AS (
  -- Base case: anchor member
  SELECT id, name, manager_id, 0 AS level
  FROM employees
  WHERE id = 1

  UNION ALL

  -- Recursive case: tham chiếu lại CTE
  SELECT e.id, e.name, e.manager_id, s.level + 1
  FROM employees e
  JOIN subordinates s ON e.manager_id = s.id
)
SELECT * FROM subordinates;
```

```
Quá trình thực thi:

  Iteration 0 (base): CEO (id=1, level=0)
       │
  Iteration 1: VP1 (level=1), VP2 (level=1)
       │              │
  Iteration 2: Mgr1, Mgr2, Mgr3 (level=2)
       │
  Iteration 3: Staff1, Staff2 (level=3)
       │
  Iteration 4: Không có row mới → STOP
```

⚠️ **Lưu ý:** Luôn thêm `LIMIT` hoặc `max_depth` check để tránh infinite loop khi data có circular reference.

### Q: UNION vs UNION ALL? 🟢 🟢 [Junior]

|                | UNION                              | UNION ALL                                   |
| -------------- | ---------------------------------- | ------------------------------------------- |
| Duplicate rows | Loại bỏ (DISTINCT)                 | Giữ nguyên                                  |
| Performance    | Chậm hơn (phải sort/hash để dedup) | Nhanh hơn                                   |
| Khi nào dùng   | Cần kết quả unique                 | Biết chắc không trùng, hoặc chấp nhận trùng |

> **Mẹo:** Luôn dùng `UNION ALL` trừ khi thực sự cần dedup. Nhiều developer mặc định dùng `UNION` gây overhead không cần thiết.

### Q: EXISTS vs IN — performance difference? 🟡 🟡 [Mid]

|                       | EXISTS                                         | IN                                     |
| --------------------- | ---------------------------------------------- | -------------------------------------- |
| Cách hoạt động        | Dừng ngay khi tìm thấy 1 match (short-circuit) | Evaluate toàn bộ subquery trước        |
| NULL handling         | Hoạt động đúng với NULL                        | `NOT IN` bị sai khi subquery chứa NULL |
| Large subquery result | ✅ Hiệu quả (short-circuit)                    | ❌ Phải load toàn bộ vào memory        |
| Small subquery result | Tương đương                                    | Tương đương                            |
| Correlated            | Thường dùng correlated                         | Thường dùng uncorrelated               |

```
EXISTS với large outer, small inner:
  Outer: 1M rows, Inner: 100 rows
  → EXISTS check 1M lần, mỗi lần scan 100 rows (có index → fast)

IN với small subquery:
  → Subquery chạy 1 lần, trả list → hash lookup O(1) mỗi row
  → Cũng nhanh

Kết luận: Modern optimizer thường transform lẫn nhau.
Luôn kiểm tra EXPLAIN ANALYZE.
```

---

## 4. Transactions (ACID)

### Q: Explain ACID properties in depth 🟢 🟢 [Junior]

ACID là bốn tính chất đảm bảo transaction đáng tin cậy trong database.

```
┌──────────────────────────────────────────────────────────┐
│                     ACID Properties                      │
├──────────────┬───────────────────────────────────────────┤
│  Atomicity   │ All or nothing — toàn bộ hoặc không gì   │
│  Consistency │ DB luôn chuyển từ valid state → valid state│
│  Isolation   │ Transactions không ảnh hưởng lẫn nhau     │
│  Durability  │ Committed data không bao giờ mất          │
└──────────────┴───────────────────────────────────────────┘
```

### Q: How does Atomicity work internally? 🟡 🟡 [Mid]

**Atomicity** đảm bảo một transaction hoặc **thực hiện toàn bộ** hoặc **rollback toàn bộ**.

**Cơ chế: Undo Log (Rollback Log)**

- Trước khi sửa data, DB ghi **giá trị cũ** vào undo log.
- Nếu transaction COMMIT → undo log được giải phóng (sau khi không còn cần cho MVCC).
- Nếu transaction ROLLBACK hoặc crash giữa chừng → dùng undo log để **khôi phục giá trị cũ**.

```
Transaction: Transfer 100$ from A to B

  Step 1: BEGIN
  Step 2: Undo log ← (A.balance = 1000)      -- ghi giá trị cũ
  Step 3: UPDATE A SET balance = 900
  Step 4: Undo log ← (B.balance = 500)        -- ghi giá trị cũ
  Step 5: UPDATE B SET balance = 600
  Step 6: COMMIT ← undo log đánh dấu "done"

  Nếu crash ở Step 4:
    → Recovery process đọc undo log
    → Phục hồi A.balance = 1000
    → Transaction coi như chưa xảy ra
```

### Q: What is Consistency in ACID? 🟢 🟢 [Junior]

**Consistency** đảm bảo database luôn ở trạng thái **hợp lệ** (valid state) — tất cả constraints, triggers, cascades được thoả mãn.

Bao gồm:

- **Constraints:** NOT NULL, UNIQUE, CHECK, FK
- **Business invariants:** Tổng tiền trong hệ thống không đổi sau transfer
- **Triggers:** Các side-effect rules

> **Lưu ý:** Consistency ở đây khác với consistency trong CAP theorem. ACID consistency = database invariants. CAP consistency = mọi node thấy cùng data.

### Q: How does Durability work? Explain WAL. 🔴 🔴 [Senior]

**Durability** đảm bảo data đã COMMIT sẽ **tồn tại vĩnh viễn**, kể cả khi server crash, mất điện.

**Cơ chế: WAL (Write-Ahead Logging)**

Nguyên tắc WAL: **Ghi log TRƯỚC khi ghi data page thực tế vào disk.**

```
                        ┌──────────────┐
  Client                │   Shared     │
  COMMIT ──────────────▶│   Buffers    │  (data pages in memory)
       │                │   (dirty)    │
       │                └──────┬───────┘
       │                       │ checkpoint/background writer
       │                       ▼
       │                ┌──────────────┐
       │                │  Data Files  │  (on disk, eventually)
       │                └──────────────┘
       │
       │   ┌────────────────────────┐
       └──▶│  WAL (write-ahead log) │  (sequential write, fsync)
            │  LSN: 100 → INSERT ... │
            │  LSN: 101 → UPDATE ... │
            │  LSN: 102 → COMMIT     │
            └────────────────────────┘
                    │
                    ▼ fsync to disk
              COMMIT returns to client
```

**Tại sao WAL nhanh hơn ghi trực tiếp data page?**

1. WAL ghi **sequential** (tuần tự) → nhanh hơn nhiều so với random write vào data pages.
2. Data pages ghi **random** (vì rows nằm rải rác trên disk).
3. WAL chỉ cần fsync 1 file nhỏ, data pages cần fsync nhiều files.

**Recovery process (PostgreSQL):**

1. Khi crash, DB đọc WAL từ last checkpoint.
2. **Redo:** Replay tất cả WAL entries chưa được ghi vào data pages.
3. **Undo:** Rollback các transactions chưa COMMIT (dùng undo info).
4. DB trở lại consistent state.

---

## 5. Isolation Levels — DEEP DIVE

### Q: What are the read phenomena in concurrent transactions? 🟡 🟡 [Mid]

```
┌─────────────────────────────────────────────────────────────┐
│              Concurrent Transaction Problems                │
├────────────────────┬────────────────────────────────────────┤
│ Dirty Read         │ Đọc data chưa COMMIT của TX khác.     │
│                    │ TX kia ROLLBACK → data đọc được sai.   │
├────────────────────┼────────────────────────────────────────┤
│ Non-Repeatable     │ Đọc cùng row 2 lần trong 1 TX,       │
│ Read               │ kết quả khác nhau (bị UPDATE bởi TX   │
│                    │ khác đã COMMIT).                       │
├────────────────────┼────────────────────────────────────────┤
│ Phantom Read       │ Query cùng điều kiện 2 lần, lần sau   │
│                    │ có thêm/mất rows (bị INSERT/DELETE     │
│                    │ bởi TX khác đã COMMIT).                │
├────────────────────┼────────────────────────────────────────┤
│ Write Skew         │ 2 TX đọc cùng data, mỗi TX quyết     │
│ (🔴 Senior)       │ định dựa trên data đọc được, cả 2     │
│                    │ COMMIT → violate business constraint.  │
└────────────────────┴────────────────────────────────────────┘
```

**Write Skew Example:**

```
Constraint: Phòng khám luôn có ít nhất 1 bác sĩ trực.
Hiện tại: Dr.A và Dr.B đang trực.

  TX1 (Dr.A):                      TX2 (Dr.B):
  ─────────────                    ─────────────
  SELECT count(*) → 2 (ok)
                                   SELECT count(*) → 2 (ok)
  UPDATE SET on_call=false
  WHERE doctor='A'
                                   UPDATE SET on_call=false
                                   WHERE doctor='B'
  COMMIT ✓                         COMMIT ✓

  Kết quả: Không ai trực! → Constraint bị vi phạm
  (Mỗi TX thấy 2 bác sĩ nên nghĩ mình rút được)
```

### Q: Explain the four isolation levels 🟡 🟡 [Mid]

```
Isolation Level     │ Dirty Read │ Non-Repeatable │ Phantom │ Write Skew
════════════════════╪════════════╪════════════════╪═════════╪══════════
Read Uncommitted    │ Possible   │ Possible       │ Possible│ Possible
Read Committed      │ Prevented  │ Possible       │ Possible│ Possible
  (PG default)      │            │                │         │
Repeatable Read     │ Prevented  │ Prevented      │ Possible│ Possible
  (MySQL default)   │            │                │ (*)     │ (**)
Serializable        │ Prevented  │ Prevented      │Prevented│ Prevented

(*) MySQL InnoDB Repeatable Read dùng gap lock → ngăn phantom trong nhiều case
(**) PostgreSQL Repeatable Read phát hiện được một số write skew
```

**Chi tiết từng level:**

**Read Uncommitted:** Hầu như không dùng trong production. PostgreSQL thậm chí treat nó như Read Committed.

**Read Committed (PG default):** Mỗi statement trong TX thấy snapshot **tại thời điểm statement bắt đầu**. An toàn cho hầu hết OLTP workloads. Nhược điểm: cùng SELECT chạy 2 lần trong 1 TX có thể ra kết quả khác.

**Repeatable Read (MySQL InnoDB default):** TX thấy snapshot **tại thời điểm TX bắt đầu** (first query). Mọi read trong TX nhất quán. MySQL dùng gap lock để ngăn phantom ở level này.

**Serializable:** Kết quả tương đương chạy từng TX tuần tự. An toàn nhất nhưng chậm nhất. PostgreSQL dùng SSI (Serializable Snapshot Isolation) — không lock mà detect conflicts rồi abort.

### Q: How does MVCC work? 🔴 🔴 [Senior]

**MVCC (Multi-Version Concurrency Control)** cho phép readers không block writers và ngược lại bằng cách giữ **nhiều version** của mỗi row.

**PostgreSQL MVCC:**

```
Mỗi row có hidden columns:
  xmin = TX ID đã INSERT row này
  xmax = TX ID đã DELETE/UPDATE row này (0 nếu chưa)

┌──────────────────────────────────────────────────┐
│                   Row Versions                    │
│                                                  │
│  Version 1: xmin=100, xmax=105, data="old"      │
│  Version 2: xmin=105, xmax=0,   data="new"      │
│                                                  │
│  TX 103 đang chạy → thấy Version 1              │
│  (vì 105 chưa COMMIT tại snapshot của TX 103)   │
│  TX 110 chạy sau → thấy Version 2               │
└──────────────────────────────────────────────────┘
```

**Visibility rules (đơn giản hoá):**

1. Row visible nếu `xmin` đã COMMITTED **trước** snapshot của TX hiện tại.
2. Row invisible nếu `xmax` đã COMMITTED **trước** snapshot.
3. Tức là: row được tạo trước snapshot VÀ chưa bị xoá trước snapshot.

**MySQL InnoDB MVCC:**

- Dùng **undo log** để tái tạo version cũ (không lưu nhiều version trực tiếp như PG).
- Mỗi row có `DB_TRX_ID` (TX tạo) và `DB_ROLL_PTR` (pointer vào undo log).
- Khi cần version cũ, InnoDB đi theo undo log chain để reconstruct.

**PostgreSQL VACUUM:**

```
Vấn đề: PG giữ old versions trong cùng table → "dead tuples" tích luỹ

  Table page:
  ┌──────────────────────────────────┐
  │ [Live] [Dead] [Live] [Dead] [Dead] │  ← Bloat!
  └──────────────────────────────────┘

  VACUUM:
  ┌──────────────────────────────────┐
  │ [Live] [Free] [Live] [Free] [Free] │  ← Space reclaimable
  └──────────────────────────────────┘

  VACUUM FULL (⚠️ locks table):
  ┌────────────────────┐
  │ [Live] [Live]       │  ← Compact, nhưng exclusive lock
  └────────────────────┘
```

- **autovacuum** chạy background, cấu hình qua `autovacuum_vacuum_threshold` và `autovacuum_vacuum_scale_factor`.
- Nếu autovacuum không kịp → table bloat → performance giảm.
- `pg_stat_user_tables.n_dead_tup` để monitor.

---

## 6. Locking

### Q: Explain Shared vs Exclusive locks 🟡 🟡 [Mid]

```
Lock Compatibility Matrix:

              │ Shared (S)  │ Exclusive (X)
──────────────┼─────────────┼──────────────
Shared (S)    │ ✅ Compatible│ ❌ Conflict
Exclusive (X) │ ❌ Conflict  │ ❌ Conflict

  S lock: Nhiều TX có thể giữ cùng lúc (concurrent reads).
  X lock: Chỉ 1 TX giữ, block mọi lock khác (writes).
```

**Row-level vs Table-level:**

|               | Row-level                       | Table-level                |
| ------------- | ------------------------------- | -------------------------- |
| Granularity   | Lock từng row                   | Lock toàn bảng             |
| Concurrency   | Cao                             | Thấp                       |
| Overhead      | Nhiều lock objects trong memory | Ít lock objects            |
| Use case      | OLTP (InnoDB default)           | DDL operations, bulk loads |
| Deadlock risk | Cao hơn                         | Thấp hơn                   |

### Q: Optimistic vs Pessimistic locking? 🟡 🟡 [Mid]

**Pessimistic Locking — "Assume conflict will happen":**
Lock row ngay khi đọc, giữ lock cho đến khi COMMIT.

```sql
-- SELECT FOR UPDATE: lấy exclusive lock trên row
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;
-- Row bị lock, TX khác phải đợi
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
-- Lock được giải phóng
```

**Optimistic Locking — "Assume no conflict, check at write time":**
Không lock khi đọc. Khi update, kiểm tra data có bị thay đổi không (via version column).

```sql
-- Đọc kèm version
SELECT id, balance, version FROM accounts WHERE id = 1;
-- → balance=1000, version=5

-- Update với version check (Compare-And-Swap)
UPDATE accounts
SET balance = 900, version = 6
WHERE id = 1 AND version = 5;

-- Nếu affected_rows = 0 → conflict → retry
-- Nếu affected_rows = 1 → success
```

```
So sánh:

               Pessimistic              Optimistic
  ┌─────────────────────────┬─────────────────────────┐
  │ Lock ngay khi đọc       │ Không lock khi đọc      │
  │ Đảm bảo không conflict  │ Detect conflict khi ghi │
  │ Giảm throughput (wait)  │ Tăng throughput          │
  │ Risk deadlock           │ Risk retry storms        │
  │ Tốt cho: high contention│ Tốt cho: low contention │
  │ VD: Bank transfer       │ VD: Edit profile         │
  └─────────────────────────┴─────────────────────────┘
```

### Q: How does deadlock detection work? 🔴 🔴 [Senior]

**Deadlock** xảy ra khi 2+ TX chờ lẫn nhau tạo thành **cycle**.

```
  TX1: holds lock on Row A, waiting for Row B
  TX2: holds lock on Row B, waiting for Row A

         TX1 ──waits──▶ Row B
          ▲               │
          │            held by
       held by            │
          │               ▼
         Row A ◀──waits── TX2

  → Circular wait → Deadlock!
```

**Detection strategies:**

1. **Wait-for graph:** DB duy trì graph TX → TX (ai đợi ai). Khi phát hiện cycle → chọn 1 TX để abort (victim).
2. **Timeout:** Nếu TX đợi lock quá thời gian → abort. Đơn giản nhưng có false positives.

**Prevention strategies:**

- **Lock ordering:** Luôn lock resources theo thứ tự cố định (VD: lock theo ID tăng dần).
- **Giảm thời gian hold lock:** Transaction ngắn gọn.
- **Retry logic trong application:** Khi bị abort do deadlock → retry.

### Q: What are Gap Locks and Next-Key Locks? 🔴 🔴 [Senior]

**MySQL InnoDB specific** — Dùng để ngăn **phantom reads** ở Repeatable Read.

```
Index:  10    20    30    40    50

Gap Lock: Lock khoảng GIỮA các index values
  ├──gap──┤
  10  gap  20  gap  30  gap  40  gap  50

  Gap lock (20, 30) ngăn INSERT row có key trong khoảng (20, 30).

Next-Key Lock = Record Lock + Gap Lock (trước record đó)
  ├─next-key─┤
  Khóa: (previous_value, current_value]  (half-open interval)

  VD: Next-key lock on 30 = gap lock (20, 30) + record lock on 30
      → Ngăn INSERT key 21-29, và ngăn modify/delete key 30.
```

**Advisory Locks (PostgreSQL):**
Application-level locks, DB chỉ quản lý lock state, không tự động acquire/release.

```sql
-- Dùng khi cần coordinate giữa các processes
SELECT pg_advisory_lock(12345);   -- acquire (blocking)
-- ... do exclusive work ...
SELECT pg_advisory_unlock(12345); -- release

-- Try variant (non-blocking):
SELECT pg_try_advisory_lock(12345); -- returns true/false
```

Ứng dụng: cron job dedup, singleton process, distributed locking đơn giản.

---

## 7. PostgreSQL-Specific

### Q: When to use JSONB vs separate tables? 🟡 🟡 [Mid]

```
┌──────────────────────┬───────────────────────┐
│       JSONB          │   Separate Tables     │
├──────────────────────┼───────────────────────┤
│ Schema linh hoạt     │ Schema cố định        │
│ Ít JOIN              │ Cần JOIN              │
│ Khó enforce FK/check │ Constraint mạnh       │
│ GIN index cho query  │ B-tree index chuẩn    │
│ Tốt cho metadata,   │ Tốt cho core business │
│ config, attributes   │ data, reporting       │
│ Schemaless evolution │ Migration required    │
└──────────────────────┴───────────────────────┘
```

**Khi nào dùng JSONB:**

- Attributes thay đổi thường xuyên (product attributes, user preferences).
- Data không cần JOIN hoặc aggregation phức tạp.
- Schema varies per row (EAV pattern replacement).

**JSONB indexing (GIN):**

```sql
CREATE INDEX idx_data_gin ON products USING GIN (metadata);
-- Hỗ trợ: @>, ?, ?|, ?&, jsonpath operators
-- Tăng tốc: WHERE metadata @> '{"color": "red"}'
```

### Q: Explain Materialized Views 🟡 🟡 [Mid]

Materialized View = **pre-computed query result stored on disk.** Giống view thường nhưng data được lưu trữ vật lý.

```
Regular View:     Query chạy lại mỗi lần SELECT
Materialized View: Query chạy khi REFRESH, SELECT đọc cached result

  CREATE MATERIALIZED VIEW monthly_stats AS
  SELECT date_trunc('month', created_at) AS month,
         count(*), sum(amount)
  FROM orders
  GROUP BY 1;

  -- Refresh strategies:
  REFRESH MATERIALIZED VIEW monthly_stats;                -- full refresh, locks reads
  REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_stats;   -- no lock, cần unique index
```

**Refresh strategies:**

1. **Manual:** Trigger REFRESH sau ETL/batch job.
2. **Scheduled:** Cron job / pg_cron extension.
3. **On-demand:** Application trigger khi data thay đổi.
4. **Concurrent:** Không block SELECT nhưng chậm hơn (phải diff old vs new).

### Q: How does Table Partitioning work? 🔴 🔴 [Senior]

Chia table lớn thành nhiều **physical sub-tables** nhưng application thấy như 1 table. Cải thiện query performance và maintenance.

```
┌────────────────────────────────────┐
│          orders (parent)           │
│          (logical table)           │
├───────────┬───────────┬────────────┤
│ orders    │ orders    │ orders     │
│ _2024_q1  │ _2024_q2  │ _2024_q3   │  ← Physical partitions
│ Jan-Mar   │ Apr-Jun   │ Jul-Sep    │
└───────────┴───────────┴────────────┘
```

| Strategy  | Mô tả                               | Use case                                     |
| --------- | ----------------------------------- | -------------------------------------------- |
| **Range** | Phân theo khoảng giá trị (date, id) | Time-series, logs, orders by date            |
| **List**  | Phân theo danh sách giá trị cụ thể  | Region, status, category                     |
| **Hash**  | Phân theo hash value                | Even distribution khi không có natural range |

**Lợi ích:**

- **Partition pruning:** Query chỉ scan partitions liên quan.
- **Parallel scan:** Mỗi partition scan song song.
- **Easy archival:** DROP partition thay vì DELETE millions of rows.
- **Per-partition VACUUM:** Nhỏ hơn, nhanh hơn.

### Q: Explain LISTEN/NOTIFY and pg_stat_statements 🟡 🟡 [Mid]

**LISTEN/NOTIFY:** Pub/sub pattern built-in PostgreSQL. Lightweight, không persist messages.

```
Session A:  LISTEN order_created;
Session B:  NOTIFY order_created, '{"id": 123}';
Session A:  → Receives notification with payload

Ứng dụng: Cache invalidation, real-time updates, trigger Go goroutine.
Hạn chế: payload max 8000 bytes, không persist, không queue.
```

**pg_stat_statements:** Extension để track query performance statistics.

```sql
SELECT query, calls, mean_exec_time, rows
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
-- → Tìm slow queries để optimize
```

### Q: Explain VACUUM in depth 🔴 🔴 [Senior]

```
Tại sao cần VACUUM:

  PostgreSQL MVCC giữ old row versions (dead tuples)
  → Table phình to (bloat) → Index cũng bloat
  → Performance giảm dần

  VACUUM làm gì:
  1. Đánh dấu dead tuples là reusable space
  2. Update visibility map (cho index-only scans)
  3. Update free space map
  4. Freeze old transaction IDs (tránh wraparound)

  autovacuum triggers khi:
    dead_tuples > autovacuum_vacuum_threshold +
                  autovacuum_vacuum_scale_factor × n_live_tup
    Mặc định: 50 + 0.2 × n_live_tup

  ⚠️ Transaction ID Wraparound:
    PostgreSQL dùng 32-bit TX IDs (≈4 billion).
    VACUUM FREEZE chuyển old xmin thành "frozen" để tái sử dụng TX IDs.
    Nếu autovacuum bị block quá lâu → wraparound risk → DB tự shutdown để protect.
```

---

## 8. MySQL-Specific

### Q: InnoDB vs MyISAM comparison? 🟡 🟡 [Mid]

| Feature           | InnoDB          | MyISAM               |
| ----------------- | --------------- | -------------------- |
| Transactions      | ✅ Full ACID    | ❌ Không             |
| Locking           | Row-level       | Table-level          |
| Foreign Keys      | ✅              | ❌                   |
| Crash Recovery    | ✅ (redo log)   | ❌ (corrupt risk)    |
| MVCC              | ✅              | ❌                   |
| Full-text Search  | ✅ (MySQL 5.6+) | ✅                   |
| Storage           | Clustered index | Heap                 |
| Count(\*)         | Slow (scan)     | Fast (stored count)  |
| Concurrent writes | ✅ Cao          | ❌ Thấp (table lock) |

> **Kết luận:** InnoDB là default từ MySQL 5.5. Hầu như không có lý do dùng MyISAM nữa.

### Q: Explain InnoDB architecture 🔴 🔴 [Senior]

```
┌────────────────────────────────────────────────┐
│              InnoDB Architecture               │
│                                                │
│  ┌──────────────────────────────────┐          │
│  │        Buffer Pool (RAM)         │          │
│  │  ┌─────────┐ ┌─────────┐        │          │
│  │  │ Data    │ │ Index   │        │          │
│  │  │ Pages   │ │ Pages   │        │          │
│  │  └─────────┘ └─────────┘        │          │
│  │  ┌─────────┐ ┌─────────┐        │          │
│  │  │ Undo    │ │ Change  │        │          │
│  │  │ Log Buf │ │ Buffer  │        │          │
│  │  └─────────┘ └─────────┘        │          │
│  └──────────────────────────────────┘          │
│                    │                            │
│           ┌───────┴───────┐                    │
│           ▼               ▼                    │
│  ┌─────────────┐ ┌────────────────┐            │
│  │  Redo Log   │ │  Doublewrite   │            │
│  │  (WAL)      │ │  Buffer        │            │
│  └──────┬──────┘ └───────┬────────┘            │
│         │                │                     │
│         ▼                ▼                     │
│  ┌─────────────────────────────────┐           │
│  │         Tablespace Files        │           │
│  │     (.ibd / ibdata1)            │           │
│  └─────────────────────────────────┘           │
└────────────────────────────────────────────────┘
```

**Key components:**

- **Buffer Pool:** Cache data + index pages in RAM. Hit ratio nên > 99%.
- **Redo Log:** WAL cho durability. Sequential write → nhanh.
- **Undo Log:** Lưu old versions cho MVCC + rollback.
- **Doublewrite Buffer:** Ghi page 2 lần để tránh **partial page write** (torn page). Page 16KB, OS write 4KB → crash giữa chừng → corrupt. Doublewrite đảm bảo recovery.
- **Change Buffer:** Cache secondary index changes cho non-unique indexes. Merge lazy khi page đọc vào buffer pool.

### Q: Auto_increment with replication issues? 🟡 🟡 [Mid]

Vấn đề: Với master-master replication, 2 nodes có thể generate cùng auto_increment value.

**Giải pháp:**

- `auto_increment_increment = 2`, `auto_increment_offset = 1 (node1) / 2 (node2)`
- Node 1: 1, 3, 5, 7... Node 2: 2, 4, 6, 8...
- Hoặc dùng UUID/ULID thay auto_increment.

### Q: Character sets and collation? 🟢 🟢 [Junior]

- **Character set:** Bộ ký tự được support (utf8mb4 = full Unicode including emoji).
- **Collation:** Quy tắc so sánh và sắp xếp (utf8mb4_unicode_ci = case-insensitive).
- ⚠️ `utf8` trong MySQL chỉ hỗ trợ 3 bytes (BMP only). Luôn dùng `utf8mb4` cho full Unicode.

---

## 9. Connection Pooling

### Q: Why is connection pooling critical? 🟡 🟡 [Mid]

```
Không có pool:
  Client request → TCP handshake → TLS → Auth → Fork process → Query → Close
  Mỗi request: ~5-50ms overhead, 1 connection ≈ 5-10MB RAM (PostgreSQL)
  100 concurrent requests = 100 connections = 500MB-1GB RAM chỉ cho connections

  max_connections mặc định PostgreSQL: 100
  → 101st request bị reject!

Có pool:
  Startup: Tạo sẵn N connections
  Client request → Lấy connection từ pool → Query → Trả lại pool
  100 concurrent requests có thể share 20 connections (nếu query nhanh)
```

```
┌──────────────────────────────────────────────┐
│           Connection Pool Architecture       │
│                                              │
│  App Instances         Pool        Database  │
│  ┌─────┐           ┌────────┐    ┌────────┐ │
│  │Go 1 │──────────▶│        │    │        │ │
│  └─────┘           │ Pool   │───▶│  PG    │ │
│  ┌─────┐           │ (idle  │───▶│        │ │
│  │Go 2 │──────────▶│  conns)│───▶│        │ │
│  └─────┘           │        │    │        │ │
│  ┌─────┐           │ 20     │    │ max:   │ │
│  │Go 3 │──────────▶│ conns  │    │ 100    │ │
│  └─────┘           └────────┘    └────────┘ │
│  (300 goroutines)  (share 20)    (20 used)  │
└──────────────────────────────────────────────┘
```

### Q: How does Go's database/sql pool work? 🟡 🟡 [Mid]

Go `database/sql` package có built-in connection pool. Quan trọng: **phải configure** vì defaults có thể không phù hợp.

```go
db, _ := sql.Open("postgres", connStr)

// Pool configuration
db.SetMaxOpenConns(25)          // Max connections to DB (open + in-use)
db.SetMaxIdleConns(10)          // Max idle connections kept in pool
db.SetConnMaxLifetime(5 * time.Minute)  // Max time a conn can be reused
db.SetConnMaxIdleTime(1 * time.Minute)  // Max time a conn can be idle
```

| Parameter         | Mặc định       | Khuyến nghị   | Giải thích                                            |
| ----------------- | -------------- | ------------- | ----------------------------------------------------- |
| `MaxOpenConns`    | 0 (unlimited!) | 20-50         | ⚠️ Phải set! Unlimited → exhausts DB                  |
| `MaxIdleConns`    | 2              | ~MaxOpenConns | Tránh tạo/huỷ conn liên tục                           |
| `ConnMaxLifetime` | 0 (forever)    | 5-30 min      | Rotate conns, tránh stale TCP, load balancer affinity |
| `ConnMaxIdleTime` | 0 (forever)    | 1-5 min       | Giải phóng idle conns khi traffic thấp                |

### Q: Explain PgBouncer pooling modes 🔴 🔴 [Senior]

PgBouncer là external connection pooler, đứng giữa app và PostgreSQL.

```
┌──────────────────────────────────────────────────┐
│            PgBouncer Pooling Modes                │
├────────────────┬─────────────────────────────────┤
│ Session        │ Conn gắn với client session.    │
│ Pooling        │ Giống không có pooler.           │
│                │ Dùng khi cần LISTEN/NOTIFY,      │
│                │ prepared statements.             │
├────────────────┼─────────────────────────────────┤
│ Transaction    │ Conn gắn trong 1 transaction.   │
│ Pooling        │ Giữa các TX, conn trả về pool.  │
│ (recommended)  │ Hiệu quả nhất cho web apps.     │
│                │ ⚠️ Không dùng SET, temp tables.  │
├────────────────┼─────────────────────────────────┤
│ Statement      │ Conn gắn trong 1 statement.     │
│ Pooling        │ Rất hiệu quả nhưng rất hạn chế.│
│                │ Chỉ cho simple queries, no TX.   │
└────────────────┴─────────────────────────────────┘
```

### Q: Connection pool sizing formula? 🔴 🔴 [Senior]

**Quy tắc chung (từ PostgreSQL wiki):**

```
optimal_pool_size = (core_count * 2) + effective_spindle_count

  core_count: CPU cores của DB server
  effective_spindle_count: Số disk spindles (SSD ≈ 1 vì no seek)

  VD: 4-core server + SSD:
      pool_size = (4 * 2) + 1 = 9 connections

  Lưu ý: Đây chỉ là starting point. Cần benchmark với actual workload.
```

**Considerations:**

- Multiple app instances: tổng connections = pool_size × instances ≤ max_connections
- Để headroom cho admin connections, monitoring, migrations.
- Nếu có PgBouncer: app → PgBouncer (nhiều conns) → PostgreSQL (ít conns).

---

## 10. Schema Migration

### Q: Why do schema migrations matter? 🟢 🟢 [Junior]

Schema migrations = **version control cho database schema**. Giống git cho code, migration files track mọi thay đổi schema theo thứ tự.

```
migrations/
├── 001_create_users.up.sql
├── 001_create_users.down.sql
├── 002_add_email_to_users.up.sql
├── 002_add_email_to_users.down.sql
├── 003_create_orders.up.sql
└── 003_create_orders.down.sql

Mỗi migration có:
  - UP: Thay đổi schema (thêm bảng, cột, index...)
  - DOWN: Rollback thay đổi (drop bảng, cột...)
  - Version/sequence number: Đảm bảo thứ tự
```

**Tại sao quan trọng:**

- **Reproducibility:** Mọi environment (dev, staging, prod) có cùng schema.
- **Collaboration:** Team biết ai đã thay đổi gì, khi nào.
- **Rollback:** Có thể revert nếu migration gây lỗi.
- **CI/CD:** Tự động apply migration khi deploy.

### Q: golang-migrate vs goose? 🟡 🟡 [Mid]

| Feature                   | golang-migrate            | goose                    |
| ------------------------- | ------------------------- | ------------------------ |
| Language                  | Go library + CLI          | Go library + CLI         |
| Migration format          | SQL or Go                 | SQL or Go                |
| Naming                    | `{version}_{name}.up.sql` | `{timestamp}_{name}.sql` |
| Version tracking          | `schema_migrations` table | `goose_db_version` table |
| Go embed                  | ✅ `embed.FS`             | ✅ `embed.FS`            |
| Popularity                | Nhiều stars hơn           | Đang tăng                |
| Transaction per migration | Tuỳ config                | Mặc định có              |

### Q: How to do zero-downtime migrations? 🔴 🔴 [Senior]

Nguyên tắc: **Không bao giờ break running application.** Application version N và N+1 phải cùng hoạt động được với schema trong quá trình migration.

**Expand-Contract Pattern:**

```
Phase 1: EXPAND — Thêm mới, không xoá cũ
  ┌─────────────────────────────────────┐
  │ App v1 đọc/ghi column "name"       │
  │ Migration: ADD COLUMN "full_name"   │
  │ App v1 vẫn hoạt động (ignore new)  │
  └─────────────────────────────────────┘

Phase 2: MIGRATE — Deploy app đọc/ghi cả hai, backfill data
  ┌─────────────────────────────────────┐
  │ App v2: write cả "name" và         │
  │         "full_name", read "full_name"│
  │ Backfill: UPDATE SET full_name=name │
  │           WHERE full_name IS NULL   │
  │           (in batches!)             │
  └─────────────────────────────────────┘

Phase 3: CONTRACT — Xoá cũ khi không còn cần
  ┌─────────────────────────────────────┐
  │ App v3: chỉ dùng "full_name"       │
  │ Migration: DROP COLUMN "name"       │
  │ (hoặc thêm NOT NULL constraint)    │
  └─────────────────────────────────────┘
```

**Adding a NOT NULL column safely:**

```sql
-- ❌ Dangerous: Locks table, fails if rows exist
ALTER TABLE users ADD COLUMN email VARCHAR NOT NULL;

-- ✅ Safe: 3-step process
-- Step 1: Add nullable column (instant in PG 11+)
ALTER TABLE users ADD COLUMN email VARCHAR;

-- Step 2: Backfill in batches (avoid long lock)
UPDATE users SET email = 'unknown@example.com'
WHERE email IS NULL AND id BETWEEN 1 AND 10000;
-- ... repeat for batches ...

-- Step 3: Add constraint (validated non-blocking in PG 12+)
ALTER TABLE users ADD CONSTRAINT users_email_not_null
  CHECK (email IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT users_email_not_null;
```

**MySQL Online DDL:**

- MySQL 5.6+ có online DDL cho nhiều operations (ADD COLUMN, ADD INDEX).
- `pt-online-schema-change` (Percona): Tạo table copy, sync qua triggers, atomic rename. Dùng cho operations không hỗ trợ online DDL.
- `gh-ost` (GitHub): Tương tự pt-osc nhưng dùng binlog thay vì triggers.

---

## 11. ORM vs Raw SQL

### Q: Compare GORM, sqlx, and sqlc 🟡 🟡 [Mid]

| Feature             | GORM                   | sqlx                | sqlc              |
| ------------------- | ---------------------- | ------------------- | ----------------- |
| **Type**            | Full ORM               | Query library       | Code generator    |
| **SQL control**     | Abstracted             | Full control        | Full control      |
| **Type safety**     | Runtime                | Runtime             | **Compile-time**  |
| **Performance**     | Chậm nhất (reflection) | Nhanh               | Nhanh nhất        |
| **Learning curve**  | Thấp ban đầu           | Trung bình          | Trung bình        |
| **N+1 problem**     | Dễ mắc phải            | Không (tự viết SQL) | Không             |
| **Migration**       | Built-in AutoMigrate   | Không có            | Không có          |
| **Complex queries** | Khó, phải dùng Raw()   | Tự nhiên            | Tự nhiên          |
| **Struct scanning** | Auto                   | Auto (`StructScan`) | Auto (generated)  |
| **DB support**      | Multi-DB               | Multi-DB            | PG, MySQL, SQLite |

### Q: What is the N+1 problem in GORM? 🟡 🟡 [Mid]

**N+1 problem:** Load 1 query cho parent + N queries cho mỗi child.

```
// ❌ N+1 problem:
var users []User
db.Find(&users)                          // 1 query: SELECT * FROM users
for _, u := range users {
    db.Model(&u).Association("Orders").Find(&u.Orders)
    // N queries: SELECT * FROM orders WHERE user_id = ?
}
// Tổng: 1 + N queries!

// ✅ Eager loading (Preload):
var users []User
db.Preload("Orders").Find(&users)
// 2 queries:
//   SELECT * FROM users
//   SELECT * FROM orders WHERE user_id IN (1, 2, 3, ...)
```

### Q: How does sqlc work? 🟡 🟡 [Mid]

sqlc đọc SQL files, generate type-safe Go code tại **compile time**.

```
Workflow:

  1. Viết SQL queries trong .sql file
  2. Chạy `sqlc generate`
  3. sqlc parse SQL → generate Go structs + functions
  4. Dùng generated code trong application

  ┌──────────────┐     sqlc generate    ┌────────────────────┐
  │ query.sql    │ ──────────────────▶ │ query.sql.go       │
  │              │                     │ (generated)        │
  │ -- name: Get │                     │ func (q *Queries)  │
  │ SELECT ...   │                     │   Get(ctx, id)     │
  └──────────────┘                     │   (User, error)    │
                                       └────────────────────┘
```

**Lợi ích:** Nếu SQL sai cú pháp hoặc column không tồn tại → lỗi khi generate, không phải khi runtime.

### Q: When to use which? Decision guide 🟡 🟡 [Mid]

```
Flowchart:

  Dự án mới, team quen SQL?
  ├─ YES → sqlc (type-safe, performant, PG-centric)
  └─ NO
      ├─ Cần rapid prototyping? → GORM (fast development)
      ├─ Complex queries, multi-DB? → sqlx (flexible)
      └─ Microservice, simple CRUD? → sqlc hoặc sqlx

  Chuyển từ GORM sang:
  ├─ Performance issues? → sqlx hoặc sqlc
  ├─ Complex reporting queries? → sqlx (raw SQL)
  └─ Type safety quan trọng? → sqlc
```

**Tổng kết thực tế cho Go backend:**

- **Startup/MVP:** GORM cho tốc độ phát triển, chấp nhận trade-off performance.
- **Production service (PG-focused):** sqlc — type safety + performance.
- **Polyglot DB / complex queries:** sqlx — flexibility.
- **Có thể mix:** sqlc cho CRUD chuẩn + sqlx cho queries đặc biệt.

---

## Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│               SQL & DATABASE CHEAT SHEET                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NORMALIZATION:                                                 │
│    1NF: Atomic values │ 2NF: No partial dep │ 3NF: No transitive│
│    Rule: Normalize first, denormalize with proof                │
│                                                                 │
│  JOINS:                                                         │
│    INNER: Both match │ LEFT: All left + match right             │
│    RIGHT: All right + match left │ FULL: All from both          │
│    CROSS: Cartesian product │ SELF: Table joins itself          │
│                                                                 │
│  QUERY EXECUTION ORDER:                                         │
│    FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT│
│                                                                 │
│  ACID:                                                          │
│    Atomicity: undo log │ Consistency: constraints                │
│    Isolation: MVCC + locks │ Durability: WAL + fsync            │
│                                                                 │
│  ISOLATION LEVELS (low → high):                                 │
│    Read Uncommitted → Read Committed (PG) → Repeatable Read     │
│    (MySQL) → Serializable                                       │
│                                                                 │
│  LOCKING:                                                       │
│    Optimistic: version column, CAS, low contention              │
│    Pessimistic: SELECT FOR UPDATE, high contention              │
│                                                                 │
│  MVCC:                                                          │
│    PG: Multiple row versions, xmin/xmax, VACUUM needed          │
│    MySQL: Undo log chain, DB_TRX_ID, DB_ROLL_PTR               │
│                                                                 │
│  CONNECTION POOL (Go):                                          │
│    MUST set MaxOpenConns │ Lifetime 5-30min                     │
│    Formula: (cores × 2) + spindles                              │
│                                                                 │
│  MIGRATION: Expand → Migrate → Contract                         │
│    Never: DROP column directly, ADD NOT NULL without backfill   │
│                                                                 │
│  Go SQL Libraries:                                              │
│    GORM: ORM, fast dev │ sqlx: flexible │ sqlc: type-safe, fast │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Interview Questions by Level

### 🟢 Junior

1. **Q: What is the difference between PRIMARY KEY and UNIQUE KEY?**
   PK = NOT NULL + UNIQUE, mỗi bảng chỉ có 1 PK. UNIQUE cho phép NULL (1 NULL), có thể nhiều UNIQUE constraints.

2. **Q: What is the difference between WHERE and HAVING?**
   WHERE lọc rows trước GROUP BY. HAVING lọc groups sau aggregation.

3. **Q: When would you use LEFT JOIN vs INNER JOIN?**
   LEFT JOIN khi muốn giữ tất cả rows bên trái kể cả không match. INNER JOIN chỉ giữ rows match cả hai bên.

4. **Q: What is a foreign key and why is it important?**
   FK tham chiếu PK bảng khác, đảm bảo referential integrity — không thể INSERT orphan record.

5. **Q: Explain the difference between UNION and UNION ALL.**
   UNION loại trùng (chậm hơn), UNION ALL giữ tất cả rows (nhanh hơn).

### 🟡 Middle

6. **Q: Explain ACID properties with a real-world example (bank transfer).**
   Trình bày A: cả 2 update hoặc không gì, C: tổng tiền không đổi, I: TX khác không thấy trạng thái trung gian, D: sau commit không mất data.

7. **Q: What isolation level would you choose for a financial application and why?**
   Serializable hoặc Repeatable Read + application-level checks. Giải thích trade-off performance vs safety.

8. **Q: How would you handle the N+1 problem in Go?**
   Preload/eager loading trong GORM, hoặc viết JOIN query thủ công trong sqlx/sqlc.

9. **Q: Explain optimistic vs pessimistic locking with Go code examples.**
   Optimistic: version column + check affected rows. Pessimistic: `SELECT FOR UPDATE` trong transaction.

10. **Q: How do you do zero-downtime schema migrations?**
    Expand-contract pattern: add nullable → backfill → add constraint → remove old.

### 🔴 Senior

11. **Q: How does MVCC work in PostgreSQL? What problems can occur without proper VACUUM?**
    Giải thích xmin/xmax, visibility rules, dead tuples, table bloat, TX ID wraparound.

12. **Q: Design a connection pooling strategy for 50 microservices connecting to one PostgreSQL instance.**
    PgBouncer (transaction mode), per-service pool limits, tổng ≤ max_connections − headroom. Monitor pool wait times.

13. **Q: How would you handle write skew in PostgreSQL?**
    Serializable isolation level, hoặc explicit locking (`SELECT FOR UPDATE`), hoặc materializing conflicts.

14. **Q: Compare InnoDB's locking mechanism with PostgreSQL's MVCC approach for phantom read prevention.**
    InnoDB: gap locks + next-key locks. PG: SSI (Serializable Snapshot Isolation) detects dependency cycles and aborts.

15. **Q: You have a 500GB table with 10M writes/day. How do you design partitioning, vacuuming, and connection strategy?**
    Range partition by date, per-partition autovacuum tuning, PgBouncer, read replicas, materialized views for reporting.

---

## Interview Q&A Summary / Tóm Tắt Q&A Phỏng Vấn

| #   | Question                                  | Difficulty | Core Concept     | Key Signal                                 |
| --- | ----------------------------------------- | ---------- | ---------------- | ------------------------------------------ |
| 1   | Core components of relational model       | 🟢         | Relational Model | PK/FK/candidate key, referential integrity |
| 2   | Fundamental relational algebra operations | 🟡         | Relational Model | σ=WHERE, π=SELECT, ⋈=JOIN, set ops         |
| 3   | ER diagram concepts                       | 🟢         | Relational Model | Entity, relationship, cardinality          |
| 4   | 1NF, 2NF, 3NF, BCNF with examples         | 🟡         | Normalization    | Atomic→partial→transitive dependency       |
| 5   | When to denormalize?                      | 🟡         | Normalization    | Measure first, EXPLAIN proof               |
| 6   | All JOIN types with diagrams              | 🟢         | SQL Query        | INNER/LEFT/RIGHT/FULL/CROSS/SELF           |
| 7   | Subqueries vs JOINs performance           | 🟡         | SQL Query        | Correlated=O(n²), JOIN preferred           |
| 8   | GROUP BY, HAVING, aggregation             | 🟢         | SQL Query        | WHERE before GROUP, HAVING after           |
| 9   | Window Functions in depth                 | 🟡         | SQL Query        | PARTITION BY + ORDER BY, ROW_NUMBER/RANK   |
| 10  | CTEs and recursive CTEs                   | 🟡         | SQL Query        | WITH clause, tree traversal                |
| 11  | UNION vs UNION ALL                        | 🟢         | SQL Query        | UNION dedup=slow, ALL=fast                 |
| 12  | EXISTS vs IN performance                  | 🟡         | SQL Query        | EXISTS short-circuits, IN materializes     |
| 13  | ACID properties in depth                  | 🟢         | Transactions     | Bank transfer, WAL, undo log               |
| 14  | Atomicity internal mechanism              | 🟡         | Transactions     | Undo log, rollback segment                 |
| 15  | Consistency in ACID                       | 🟢         | Transactions     | Constraints always valid                   |
| 16  | Durability and WAL                        | 🔴         | Transactions     | WAL + fsync, checkpoint                    |
| 17  | Read phenomena in concurrent TX           | 🟡         | Isolation        | Dirty/non-repeatable/phantom reads         |
| 18  | Four isolation levels                     | 🟡         | Isolation        | RU→RC→RR→S trade-offs                      |
| 19  | How MVCC works                            | 🔴         | Isolation        | xmin/xmax, visibility, VACUUM              |
| 20  | Shared vs Exclusive locks                 | 🟡         | Locking          | S=read concurrent, X=write exclusive       |
| 21  | Optimistic vs Pessimistic locking         | 🟡         | Locking          | Version column vs SELECT FOR UPDATE        |
| 22  | Deadlock detection                        | 🔴         | Locking          | Wait-for graph, timeout                    |
| 23  | Gap Locks and Next-Key Locks              | 🔴         | Locking          | InnoDB phantom prevention                  |
| 24  | JSONB vs separate tables                  | 🟡         | PostgreSQL       | Schema flexibility vs query performance    |
| 25  | Materialized Views                        | 🟡         | PostgreSQL       | Precomputed, REFRESH needed                |
| 26  | Table Partitioning                        | 🔴         | PostgreSQL       | Range/list/hash, partition pruning         |
| 27  | LISTEN/NOTIFY, pg_stat_statements         | 🟡         | PostgreSQL       | Real-time events, query stats              |
| 28  | VACUUM in depth                           | 🔴         | PostgreSQL       | Dead tuples, bloat, autovacuum             |
| 29  | InnoDB vs MyISAM                          | 🟡         | MySQL            | ACID vs speed, row vs table lock           |
| 30  | InnoDB architecture                       | 🔴         | MySQL            | Buffer pool, redo/undo, doublewrite        |
| 31  | Auto_increment replication                | 🟡         | MySQL            | Gaps, multi-source conflicts               |
| 32  | Character sets and collation              | 🟢         | MySQL            | utf8mb4, ci vs bin                         |
| 33  | Why connection pooling critical           | 🟡         | Pooling          | Fork cost, MaxOpenConns                    |
| 34  | Go database/sql pool                      | 🟡         | Pooling          | SetMaxOpenConns, ConnMaxLifetime           |
| 35  | PgBouncer pooling modes                   | 🔴         | Pooling          | Session/transaction/statement mode         |
| 36  | Connection pool sizing formula            | 🔴         | Pooling          | (cores×2)+spindles                         |
| 37  | Why schema migrations matter              | 🟢         | Migration        | Version control for DB schema              |
| 38  | golang-migrate vs goose                   | 🟡         | Migration        | Up/Down, embed support                     |
| 39  | Zero-downtime migrations                  | 🔴         | Migration        | Expand→migrate→contract                    |
| 40  | Compare GORM, sqlx, sqlc                  | 🟡         | ORM              | Type-safety, N+1, dev speed                |
| 41  | N+1 problem in GORM                       | 🟡         | ORM              | Preload vs manual JOIN                     |
| 42  | How sqlc works                            | 🟡         | ORM              | SQL→Go code generation                     |
| 43  | When to use which ORM                     | 🟡         | ORM              | Team size, query complexity                |
| L1  | PK vs UNIQUE KEY                          | 🟢         | Relational Model | PK=NOT NULL+UNIQUE, 1 per table            |
| L2  | WHERE vs HAVING                           | 🟢         | SQL Query        | Before vs after GROUP BY                   |
| L3  | LEFT JOIN vs INNER JOIN                   | 🟢         | SQL Query        | Keep all left vs match only                |
| L4  | Foreign key importance                    | 🟢         | Relational Model | Referential integrity                      |
| L5  | UNION vs UNION ALL                        | 🟢         | SQL Query        | Dedup vs keep all                          |
| L6  | ACID with bank transfer                   | 🟡         | Transactions     | A+C+I+D real example                       |
| L7  | Isolation for financial app               | 🟡         | Isolation        | Serializable + trade-off                   |
| L8  | N+1 problem in Go                         | 🟡         | ORM              | Preload, JOIN query                        |
| L9  | Optimistic vs pessimistic Go code         | 🟡         | Locking          | Version check vs FOR UPDATE                |
| L10 | Zero-downtime migration                   | 🟡         | Migration        | Expand-contract pattern                    |
| L11 | MVCC + VACUUM problems                    | 🔴         | PostgreSQL       | xmin/xmax, bloat, wraparound               |
| L12 | Pool strategy 50 microservices            | 🔴         | Pooling          | PgBouncer, per-service limits              |
| L13 | Write skew in PG                          | 🔴         | Isolation        | Serializable or explicit lock              |
| L14 | InnoDB vs PG phantom prevention           | 🔴         | Locking          | Gap locks vs SSI                           |
| L15 | 500GB table design                        | 🔴         | PostgreSQL       | Partition+vacuum+pool+replicas             |

**Distribution:** 🟢 14 (24%) | 🟡 27 (47%) | 🔴 17 (29%) — 58 total

---

## ⚡ Cold Call Simulation / Mô Phỏng Hỏi Bất Chợt

> **Interviewer:** "Production database đang có slow queries, p99 latency 5 giây. Bạn debug thế nào?"

**30-second answer:**
"Bắt đầu từ `pg_stat_statements` để identify top slow queries by total time. Chạy `EXPLAIN ANALYZE` trên top offenders — check sequential scans trên large tables, missing indexes, và lock waits. Check `pg_stat_activity` cho long-running transactions holding locks. Kiểm tra connection pool metrics — pool_wait cao nghĩa là thiếu connections. Nếu specific query slow, xem query plan: Seq Scan → cần index, Nested Loop trên large table → cần Hash Join hint hoặc restructure query."

> **Follow-up:** "Query đã có index nhưng vẫn slow — tại sao?"

"Có thể: (1) Index bloat — REINDEX hoặc tune autovacuum, (2) Low selectivity — index trên boolean column chỉ có 2 values → optimizer chọn seq scan vì faster, (3) Stale statistics — `ANALYZE` chưa chạy → optimizer estimate sai → bad plan choice, (4) Too many columns fetched → covering index opportunity, (5) Lock contention — `SELECT FOR UPDATE` đang hold row locks."

---

## ✅ Self-Check / Tự Kiểm Tra

Trả lời không nhìn tài liệu. Nếu < 5/7 đúng → đọc lại phần tương ứng.

| #   | Question                                          | Key Points                                                                                    |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | PK, FK, candidate key khác nhau thế nào?          | PK=unique+not null (1/table), FK=reference PK khác, candidate=any column set that could be PK |
| 2   | Normalization 1NF→3NF: mỗi level loại bỏ gì?      | 1NF: repeating groups, 2NF: partial dependency, 3NF: transitive dependency                    |
| 3   | SQL execution order — viết 7 bước?                | FROM→WHERE→GROUP BY→HAVING→SELECT→ORDER BY→LIMIT                                              |
| 4   | ACID — mỗi chữ cái đảm bảo gì, mechanism nào?     | A: undo log, C: constraints, I: MVCC/locks, D: WAL+fsync                                      |
| 5   | MVCC hoạt động thế nào trong PG?                  | Multiple row versions, xmin/xmax visibility, snapshot per TX, VACUUM clean dead tuples        |
| 6   | Optimistic vs Pessimistic locking — khi nào dùng? | Optimistic: version column, low contention. Pessimistic: FOR UPDATE, high contention          |
| 7   | Connection pool sizing formula?                   | (cores × 2) + spindles, PgBouncer transaction mode, monitor pool_wait                         |

### Spaced Repetition / Lặp Lại Ngắt Quãng

| Round | When          | Focus                                                    |
| ----- | ------------- | -------------------------------------------------------- |
| 1     | Day 1 (today) | Read all Self-Check, answer from memory                  |
| 2     | Day 3         | ACID + Isolation levels + locking — most interview-heavy |
| 3     | Day 7         | SQL execution order, JOINs, Window Functions             |
| 4     | Day 14        | MVCC deep dive, PG vs MySQL internals                    |
| 5     | Day 30        | Full review — Cold Call simulation practice              |

---

## 🔗 Connections / Liên Kết

### Same Track (Database Advanced)

- → [02-Indexing & Optimization](./02-indexing-optimization.md) — B-tree, GIN, EXPLAIN ANALYZE builds on query knowledge here
- → [03-NoSQL & Redis](./03-nosql-redis-mongo.md) — When SQL isn't enough: CAP trade-offs
- → [04-Caching Patterns](./04-caching-patterns.md) — Cache-aside, write-through complement DB optimization

### Cross-Track

- → [01-golang/01-Language Fundamentals](../01-golang/01-language-fundamentals.md) — Go's type system maps to DB schema design
- → [02-backend-knowledge/01-API Design](../02-backend-knowledge/01-api-design.md) — Pagination, idempotency require DB transaction awareness
- → [02-backend-knowledge/03-Distributed Systems](../02-backend-knowledge/03-distributed-systems.md) — CAP, distributed transactions extend ACID concepts
- → [04-be-system-design/01-Design Framework](../04-be-system-design/01-design-framework.md) — System design interviews require DB choice justification

---

> **Tiếp theo:** [02-indexing-and-query-optimization.md](./02-indexing-optimization.md) — B-tree, Hash, GIN, GiST, EXPLAIN ANALYZE, query plan optimization.
