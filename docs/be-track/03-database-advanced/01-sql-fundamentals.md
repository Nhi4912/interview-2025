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

> 🧠 **Memory Hook:** "Table = Excel sheet có rules" — PK là mã vạch, FK là hyperlink giữa sheets.

**Why exists (tại sao tồn tại):**

- Level 1: Tổ chức dữ liệu thành bảng có cấu trúc thay vì flat files hỗn loạn
- Level 2: Codd's 12 rules (1970) — mathematical foundation cho data independence, giải quyết hierarchical/network model limitations
- Level 3: Set theory + first-order logic → declarative querying (nói "what" không phải "how") → optimizer tự chọn execution plan

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **tủ hồ sơ ở trường học**: mỗi ngăn kéo là một bảng (ví dụ: "Học sinh", "Lớp học"). Mỗi tờ hồ sơ trong ngăn kéo là một hàng. Mỗi ô điền thông tin (họ tên, ngày sinh...) là một cột. **Mã số học sinh** (Primary Key) giúp tìm đúng tờ hồ sơ mà không cần lật từng tờ. **Mã lớp** ghi trong hồ sơ học sinh (Foreign Key) liên kết sang ngăn kéo "Lớp học" — chỉ cần mã lớp là tìm ra thông tin lớp ngay.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

1. Bảng (relation) định nghĩa schema: tên cột + kiểu dữ liệu — cấu trúc cố định
2. Primary Key đảm bảo mỗi row có định danh duy nhất (NOT NULL + UNIQUE)
3. Foreign Key lưu PK của bảng kia để tạo liên kết — DB tự enforce referential integrity
4. Query engine dùng set operations để combine bảng (JOIN = phép giao/tích)

```
students ←──────────── enrollments ────────────→ courses
id (PK)                student_id (FK)             id (PK)
name                   course_id  (FK)             name
email                  grade                       credits
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Natural key thay đổi:** Email làm PK → user đổi email → phải UPDATE cascade mọi FK references → dùng surrogate key (auto-increment/UUID)
- **NULL trong FK:** Cho phép "optional relationship" (order chưa có shipper) nhưng làm JOIN logic phức tạp hơn
- **Composite PK:** Tốt cho junction tables nhưng FK ở bảng khác phải bao gồm tất cả cột composite
- **Circular FK:** A references B, B references A → cần `DEFERRABLE INITIALLY DEFERRED` constraint
- **Over-normalization:** Quá nhiều bảng nhỏ → JOIN hell, query timeout ở production scale

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                    | Tại sao sai                                                           | Đúng là                                                                     |
| -------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Dùng email/phone làm PK    | Email có thể thay đổi → phải CASCADE UPDATE khắp nơi, tốn chi phí cao | Dùng surrogate key (auto-increment/UUID), email đặt UNIQUE constraint riêng |
| Quên FK constraint         | Orphan records âm thầm corrupt data, chỉ phát hiện khi query bị sai   | Luôn khai báo FK khi bảng có quan hệ, dùng ON DELETE behavior phù hợp       |
| Composite PK quá nhiều cột | JOIN complexity tăng theo hàm mũ, khó maintain FK ở bảng khác         | Dùng surrogate PK + UNIQUE constraint trên composite để giữ business rule   |

- **Interview Pattern:** "Explain relational model basics" → Signal: mention Codd, distinguish PK/FK/candidate key, explain referential integrity không chỉ liệt kê

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Database Theory](../../shared/03-database/database-theory.md)
- ➡️ Để hiểu tiếp: [Concept 2 — Normalization](#concept-2-normalization)

---

### Concept 2: Normalization

> 🧠 **Memory Hook:** "1NF = atomic, 2NF = no partial, 3NF = no transitive" — nhớ 3 từ khóa là đủ.

**Why exists:**

- Level 1: Loại bỏ data redundancy → giảm anomalies (insert/update/delete)
- Level 2: Functional dependency theory — nếu A→B thì B phụ thuộc A, normalize = tách các dependency vào đúng bảng
- Level 3: Trade-off: normalize tối đa → nhiều JOINs → denormalize có chủ đích khi read-heavy workload cần materialized view hoặc precomputed columns

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **sổ tay ghi chú ở chợ**: nếu bạn ghi "Thịt bò - cửa hàng Minh Béo - 0901234567 - 50.000đ/kg" vào mỗi đơn hàng, khi cửa hàng đổi số điện thoại bạn phải sửa hàng trăm chỗ (**update anomaly**). Normalization giống như **tách riêng sổ danh bạ cửa hàng**: chỉ lưu mã cửa hàng trong đơn, thông tin chi tiết ở sổ riêng — đổi SĐT chỉ sửa 1 chỗ.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Unnormalized (vi phạm nhiều forms):
orders: (order_id, customer, phone, product1, product2, product3)
    ↓ 1NF: tách product thành từng row riêng
(order_id, customer, phone, product)
    ↓ 2NF: tách customer info ra bảng riêng (khi composite PK)
(order_id, product) + (customer_id, customer, phone)
    ↓ 3NF: loại transitive dependency (phone phụ thuộc customer, không phải order)
(order_id, customer_id, product) + (customer_id, customer, phone)
```

Quy tắc nhanh để nhớ:

1. **1NF:** Mỗi ô chỉ 1 giá trị — không list, không array
2. **2NF:** Mọi non-PK column phụ thuộc **cả** composite PK, không phải chỉ 1 phần
3. **3NF:** Non-PK column chỉ phụ thuộc PK, không phụ thuộc non-PK column khác

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **BCNF khác 3NF:** Khi có nhiều candidate keys chồng chéo → 3NF không đủ, cần BCNF — hiếm gặp trong thực tế
- **Denormalization có chủ đích:** Analytics tables thường denormalized — nhiều JOINs giết performance trên 100M+ rows
- **Overfitting normalize:** Tách quá mịn → 20 bảng cho 1 entity → developer không hiểu schema → bug nhiều hơn
- **4NF/5NF:** Tồn tại nhưng hiếm cần trong OLTP — chủ yếu học thuật
- **Normalize trước, đo sau:** Đừng denormalize nếu chưa có benchmark evidence — tối ưu sớm là gốc của mọi tội lỗi

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                        | Tại sao sai                                                   | Đúng là                                                               |
| ---------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| Over-normalize: 20 bảng cho 1 entity           | JOIN hell, query timeout, developer khó hiểu schema           | Normalize đến 3NF, chỉ tách tiếp khi có functional dependency rõ ràng |
| Denormalize sớm không có bằng chứng            | Tạo inconsistency risk mà không biết chắc có performance gain | Chạy EXPLAIN ANALYZE để chứng minh bottleneck trước khi denormalize   |
| Quên xử lý BCNF với overlapping candidate keys | Data anomaly vẫn xảy ra dù đã ở 3NF                           | Kiểm tra BCNF khi bảng có nhiều candidate key chồng chéo              |

- **Interview Pattern:** "When to denormalize?" → Signal: nói rõ "measure first" — show EXPLAIN ANALYZE proof trước khi denormalize

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 1 — Relational Model](#concept-1-relational-model)
- ➡️ Để hiểu tiếp: [02-Indexing & Optimization](./02-indexing-optimization.md)

---

### Concept 3: SQL Query Mastery

> 🧠 **Memory Hook:** "FROM → WHERE → GROUP → HAVING → SELECT → ORDER → LIMIT" — query execution order, đọc như pipeline.

**Why exists:**

- Level 1: Declarative language — nói "lấy gì" thay vì "lặp thế nào" → optimizer quyết định execution plan
- Level 2: Set-based operations (JOIN, UNION) thay vì row-by-row → O(n) thay vì O(n²) cho nhiều patterns
- Level 3: Window Functions + CTEs mở rộng expressive power — running totals, ranking, recursive traversal mà không cần application code

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

SQL giống như **đặt đơn ở bưu điện**: bạn viết phiếu yêu cầu ("lấy tất cả bưu kiện của khách hàng Minh, sắp xếp theo ngày gửi, chỉ lấy 10 kiện mới nhất") thay vì tự mình leo lên kho tìm từng kiện. **Nhân viên bưu điện** (query optimizer) tự tìm cách lấy nhanh nhất — dùng catalogue (index) hay tìm thủ công (full scan) là việc của họ. Bạn chỉ cần biết **muốn gì**, không cần biết **lấy thế nào**.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
SQL Execution Pipeline (thứ tự thực thi thực sự):

  1. FROM / JOIN  → Xác định data source, materialize joins
  2. WHERE        → Lọc rows (trước khi group) — dùng index ở đây
  3. GROUP BY     → Gom nhóm các rows
  4. HAVING       → Lọc nhóm theo aggregate condition
  5. SELECT       → Tính toán columns, apply window functions
  6. DISTINCT     → Loại duplicate (nếu có)
  7. ORDER BY     → Sắp xếp kết quả
  8. LIMIT/OFFSET → Cắt kết quả
```

Window function là thành phần đặc biệt: chạy ở bước SELECT nhưng thấy toàn bộ partition — không collapse rows như GROUP BY.

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **`SELECT *` trong production:** Fetch thừa data, miss covering index, gây network overhead — luôn chỉ định cột cần thiết
- **Correlated subquery trong vòng lặp:** Chạy N lần cho N rows outer — O(n²), rewrite thành JOIN hoặc CTE
- **Window function không có PARTITION BY:** Compute trên toàn bộ result set — có thể là ý định đúng (global rank) hoặc bug
- **Recursive CTE không có depth limit:** Infinite loop nếu data có circular reference — luôn thêm `WHERE level < 100`
- **OFFSET pagination:** Chậm tuyến tính khi offset lớn (vẫn scan offset rows) — dùng keyset/cursor pagination cho large datasets

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                            | Tại sao sai                                                                    | Đúng là                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `SELECT *` trong production code   | Truyền dư data qua network, bỏ lỡ covering index, dễ break khi schema thay đổi | Liệt kê cụ thể các cột cần dùng                                    |
| Correlated subquery thay vì JOIN   | Subquery chạy lại N lần cho mỗi row outer → O(n²), rất chậm khi N lớn          | Rewrite thành JOIN hoặc CTE để optimizer chọn plan tốt hơn         |
| Window function thiếu PARTITION BY | Compute trên toàn bộ result set thay vì từng nhóm → kết quả sai logic          | Xác định partition rõ ràng, nếu muốn global thì document rõ ý định |

- **Interview Pattern:** "Write a query for ranking/top-N/running total" → Signal: dùng Window Function, giải thích PARTITION BY vs ORDER BY

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 1 — Relational Model](#concept-1-relational-model)
- ➡️ Để hiểu tiếp: [02-Indexing & Optimization](./02-indexing-optimization.md)

---

### Concept 4: Transactions & ACID

> 🧠 **Memory Hook:** "ACID = Bank transfer safety" — A: cả hai debit+credit hoặc rollback, C: tổng tiền không đổi, I: người khác không thấy trạng thái giữa, D: sau commit mất điện vẫn còn.

**Why exists:**

- Level 1: Đảm bảo correctness khi multiple operations phải succeed/fail together
- Level 2: WAL (Write-Ahead Log) + undo log — crash recovery mechanism: ghi log trước data → replay sau crash
- Level 3: 2PC (Two-Phase Commit) cho distributed transactions, nhưng performance penalty → eventual consistency alternatives (Saga pattern)

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **chuyển tiền ngân hàng**: bạn chuyển 1 triệu từ tài khoản A sang B. Có 2 bước: trừ tiền A (-1tr) và cộng tiền B (+1tr). Nếu sau khi trừ tiền A xong thì **mất điện** — tiền mất luôn hay được hoàn lại? **ACID đảm bảo**: hoặc cả 2 bước thành công, hoặc cả 2 bị hoàn lại — **không bao giờ** chỉ 1 bước thành công. Đây là lý do ngân hàng dùng database transaction, không phải ghi file Excel.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Atomicity (A) — Undo Log:
  BEGIN TX → ghi giá trị CŨ vào undo log → sửa data
  COMMIT   → undo log marked done, data pages persisted
  CRASH    → Recovery đọc undo log → phục hồi giá trị cũ

Durability (D) — WAL (Write-Ahead Log):
  COMMIT → ghi log entry vào WAL (sequential write) → fsync
         → return success to client
         → data pages flushed later (async)
  CRASH  → Redo WAL entries chưa apply → DB consistent

Isolation (I) — MVCC:
  TX A reads → thấy snapshot tại thời điểm bắt đầu TX
  TX B writes → tạo row version mới, không ghi đè version cũ
  → Readers không block writers, writers không block readers

Consistency (C) — Database Constraints:
  COMMIT → Engine kiểm tra tất cả constraints (FK, UNIQUE, CHECK)
         → Vi phạm → tự động ROLLBACK
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **Long transaction giữ lock:** Transaction mở nhiều giây → block tất cả UPDATE trên rows liên quan → cascade timeout
- **Savepoints:** Rollback về điểm giữa trong transaction — ít dùng nhưng hữu ích cho retry logic phức tạp
- **Distributed ACID:** 2PC đảm bảo ACID trên nhiều DB nhưng blocking protocol — nếu coordinator crash, participants chờ mãi
- **ACID ≠ correctness:** Application logic bug vẫn commit wrong data — ví dụ tính sai số tiền nhưng COMMIT thành công
- **Read-only transaction:** Vẫn nên dùng transaction để đảm bảo snapshot consistent khi đọc nhiều bảng liên quan

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                               | Tại sao sai                                                              | Đúng là                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Transaction mở quá lâu (long-running) | Giữ lock → block các query khác → cascade timeout, user thấy lỗi         | Giữ transaction ngắn nhất có thể, tách business logic ra ngoài BEGIN/COMMIT |
| Quên `defer tx.Rollback()` trong Go   | Connection bị leak nếu hàm return sớm trước COMMIT/ROLLBACK              | Luôn `defer tx.Rollback()` ngay sau `Begin()` — safe no-op nếu đã COMMIT    |
| Assume ACID = không có bug            | ACID chỉ đảm bảo database constraints, không đảm bảo logic ứng dụng đúng | Validate business rules trong code trước khi commit                         |

- **Interview Pattern:** "Explain ACID with real example" → Signal: bank transfer + mention WAL cho Durability, undo log cho Atomicity

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 1 — Relational Model](#concept-1-relational-model)
- ➡️ Để hiểu tiếp: [Concept 5 — Isolation & Locking](#concept-5-isolation--locking)

---

### Concept 5: Isolation & Locking

> 🧠 **Memory Hook:** "Read Committed = đọc đúng nhưng phantom; Serializable = safe nhưng chậm" — isolation ladder.

**Why exists:**

- Level 1: Concurrent transactions cần rules — ai thấy gì, khi nào, để tránh dirty/phantom/non-repeatable reads
- Level 2: MVCC (Multi-Version Concurrency Control) — mỗi transaction thấy snapshot riêng, readers không block writers
- Level 3: PG SSI vs MySQL gap locks — hai approaches khác nhau cho serializable: PG detect dependency cycles, MySQL prevent phantom via gap+next-key locks

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **phòng khám có 2 bác sĩ** đang xem danh sách trực. Cả hai thấy "còn 2 bác sĩ trực" và cùng quyết định "mình nghỉ được". Kết quả: không ai trực! Đây là **write skew** — mỗi người quyết định dựa trên thông tin đúng tại thời điểm đọc, nhưng khi cả hai commit thì constraint bị vi phạm. **Isolation levels** quy định: transaction được thấy những thay đổi nào của transaction khác — càng cao thì an toàn hơn nhưng chậm hơn.

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Isolation Ladder (tăng dần safety, giảm dần performance):

Level              │ Dirty  │ Non-Rep│ Phantom│ Write  │ Cơ chế
                   │ Read   │ Read   │ Read   │ Skew   │
───────────────────┼────────┼────────┼────────┼────────┼──────────────────
Read Uncommitted   │  ❌    │  ❌   │  ❌   │  ❌   │ No lock
Read Committed     │  ✅    │  ❌   │  ❌   │  ❌   │ Statement snapshot
(PG default)       │        │        │        │        │
Repeatable Read    │  ✅    │  ✅   │  ⚠️   │  ⚠️   │ TX snapshot
(MySQL default)    │        │        │(gap lk) │        │
Serializable       │  ✅    │  ✅   │  ✅   │  ✅   │ SSI / 2PL
```

MVCC: mỗi row lưu xmin (TX tạo) + xmax (TX xóa), transaction chỉ thấy rows có xmin committed trước snapshot của mình.

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **PostgreSQL Repeatable Read ≠ MySQL Repeatable Read:** PG dùng TX snapshot từ đầu, MySQL thêm gap locks — behavior khác nhau với phantom reads
- **Serializable abort:** PG SSI có thể abort transaction khi phát hiện conflict → cần retry logic trong application
- **SELECT FOR UPDATE không có index:** Escalate thành table-level lock → block toàn bảng thay vì chỉ 1 row
- **Advisory lock:** Useful cho distributed locking nhưng không tự release khi crash (cần session-level management)
- **SKIP LOCKED:** Dùng cho job queue pattern — lấy rows chưa bị lock mà không chờ

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                  | Tại sao sai                                                        | Đúng là                                                              |
| ---------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Dùng Read Committed cho financial system | Write skew vẫn xảy ra (ví dụ double-spend, over-booking)           | Dùng Serializable hoặc Repeatable Read + explicit SELECT FOR UPDATE  |
| `SELECT FOR UPDATE` quên index           | Lock escalate lên table-level → block toàn bảng, throughput sụp đổ | Đảm bảo WHERE clause dùng indexed column trước khi SELECT FOR UPDATE |
| Không có retry logic khi deadlock        | User thấy error 40001 / deadlock detected, không tự recover        | Implement retry với exponential backoff cho serialization failures   |

- **Interview Pattern:** "MVCC deep dive" → Signal: explain xmin/xmax (PG) hoặc DB_TRX_ID (MySQL), visibility rules, VACUUM necessity

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 4 — Transactions & ACID](#concept-4-transactions--acid)
- ➡️ Để hiểu tiếp: [Distributed Systems Consistency](../02-backend-knowledge/03-distributed-systems.md)

---

### Concept 6: PostgreSQL & MySQL Internals

> 🧠 **Memory Hook:** "PG = MVCC + VACUUM, MySQL = InnoDB + undo log chain" — hai triết lý khác nhau cho cùng vấn đề.

**Why exists:**

- Level 1: Production database cần hiểu internals để tune performance — không thể chỉ biết SQL syntax
- Level 2: VACUUM (PG) xoá dead tuples, autovacuum settings critical — InnoDB buffer pool sizing quyết định cache hit ratio
- Level 3: Partitioning strategies (range/list/hash), materialized views, pg_stat_statements → monitoring → informed optimization

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

Hình dung **thư viện với sách cũ không bao giờ xóa**: mỗi lần cập nhật thông tin sách (PostgreSQL MVCC), thư viện tạo **tờ mới** thay vì sửa tờ cũ — tờ cũ vẫn còn đó chiếm không gian. **VACUUM** là bác bảo vệ đi thu dọn tờ cũ định kỳ. Nếu bác bảo vệ không làm việc (**autovacuum bị disable**), tủ sách đầy tờ rác → tìm sách ngày càng chậm (**table bloat**). MySQL InnoDB dùng chiến lược khác: sửa tờ gốc nhưng lưu lịch sử chỉnh sửa vào **sổ lưu trữ riêng** (undo log).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
PostgreSQL MVCC lifecycle:

  INSERT row  → xmin=TX_ID, xmax=0,        data=value  (live)
  UPDATE row  → old row: xmax=NEW_TX_ID               (dead)
              → new row: xmin=NEW_TX_ID, xmax=0        (live)
  DELETE row  → old row: xmax=TX_ID                   (dead)

  Table page (bloat accumulates):
  [LIVE:xmin=100] [DEAD:xmax=101] [LIVE:xmin=102] [DEAD:xmax=103]

  After VACUUM:
  [LIVE:xmin=100] [FREE SPACE    ] [LIVE:xmin=102] [FREE SPACE   ]

InnoDB MVCC (undo log chain):
  Current row → DB_TRX_ID=105, data="new"
      ↓ DB_ROLL_PTR
  Undo entry  → original data="old", TX_ID=100
  (follow chain để reconstruct version cũ khi cần)
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **TX ID Wraparound (PG):** 32-bit TX ID = ~4 billion. Nếu autovacuum không chạy kịp, IDs wrap around → rows cũ thành "future" → DB tự shutdown để protect data
- **InnoDB buffer pool < 70% RAM:** Cache hit rate thấp → mọi query đều hit disk → performance thảm họa
- **Autovacuum bị throttle quá mạnh:** `autovacuum_vacuum_cost_limit` thấp → VACUUM chậm hơn tốc độ write → bloat tăng dần
- **VACUUM FULL cần exclusive lock:** Compacts table nhưng lock toàn bảng — tránh production, dùng `pg_repack` thay thế
- **Materialized view stale:** Không REFRESH → report lấy data cũ — cần schedule REFRESH CONCURRENTLY định kỳ

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                 | Tại sao sai                                                                | Đúng là                                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Không tune autovacuum                   | Table bloat tăng 10x actual data size → slow sequential scans, index bloat | Monitor `n_dead_tup` trong `pg_stat_user_tables`, tune `autovacuum_vacuum_scale_factor` |
| InnoDB buffer pool mặc định (128MB)     | Cache hit rate < 50% → disk I/O bottleneck, mọi query đều chậm             | Set `innodb_buffer_pool_size = 70-80%` tổng RAM cho dedicated DB server                 |
| Materialized view không có lịch refresh | Report trả data cũ hàng giờ, user không biết                               | Setup `pg_cron` hoặc application trigger REFRESH CONCURRENTLY sau ETL job               |

- **Interview Pattern:** "How would you tune a production PG?" → Signal: mention autovacuum, pg_stat_statements, connection limits, partitioning for large tables

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 5 — Isolation & Locking](#concept-5-isolation--locking)
- ➡️ Để hiểu tiếp: [02-Indexing & Optimization](./02-indexing-optimization.md)

---

### Concept 7: Pooling, Migration & ORM

> 🧠 **Memory Hook:** "Pool = airport security gates, Migration = renovating while shop is open, ORM = Google Translate for SQL."

**Why exists:**

- Level 1: Database connections expensive (fork process in PG) → pool reuses connections → reduce overhead
- Level 2: Schema evolution without downtime: expand→migrate→contract pattern — add nullable first, backfill, add constraint, remove old
- Level 3: ORM trade-offs: GORM (fast dev, N+1 risk), sqlx (flexible, manual), sqlc (type-safe, compile-time checked) → choose by team size and query complexity

**Layer 1 — Simple Analogy / Liên Tưởng Đơn Giản:**

**Connection pool** giống **cổng an ninh sân bay**: không tạo cổng mới cho mỗi hành khách — 10 cổng phục vụ 1000 hành khách luân phiên. **Migration** giống **sửa tiệm café đang mở cửa**: không đóng cửa mà sắp xếp từng bàn, khu vực mới trong khi khách vẫn uống cà phê — khách cũ dùng khu cũ, khách mới dùng khu mới, sau đó dọn khu cũ. **ORM** giống **Google Translate**: bạn nói tiếng Go, nó dịch sang SQL — tiện nhưng đôi khi dịch sai (N+1 problem).

**Layer 2 — How It Works / Cơ Chế Hoạt Động:**

```
Connection Pool lifecycle:
  App start → create N connections (min_pool_size)
  Request   → acquire connection from pool (or wait if full)
  Query     → execute on acquired connection
  Done      → return connection to pool (NOT close)
  Idle      → pool keeps connections alive, pings periodically
  Timeout   → close idle connections > ConnMaxIdleTime

Expand-Contract Migration (zero-downtime):
  Step 1 EXPAND:   ADD COLUMN new_col (nullable) ← App v1 unaffected
  Step 2 MIGRATE:  backfill new_col WHERE NULL   ← App v2 writes both
  Step 3 CONTRACT: DROP COLUMN old_col           ← App v3 uses new only

ORM performance spectrum:
  GORM (reflection) → sqlx (manual scan) → sqlc (generated code)
  [slowest, easiest]                        [fastest, most explicit]
```

**Layer 3 — Edge Cases & Trade-offs / Trường Hợp Đặc Biệt:**

- **MaxOpenConns = 0 (unlimited):** Go mặc định unlimited → app có thể tạo 10,000 connections → PostgreSQL crash (max 100 mặc định)
- **PgBouncer transaction mode + prepared statements:** Transaction pooling không support prepared statements per-connection — dùng `prefer` không phải `require`
- **Migration lock contention:** `ALTER TABLE ADD COLUMN NOT NULL` trên 500M row table → lock minutes → downtime. Dùng ADD nullable + backfill + ADD CONSTRAINT
- **GORM AutoMigrate trong production:** AutoMigrate có thể drop columns nếu không cẩn thận — **không bao giờ** dùng AutoMigrate ở production
- **ORM N+1 trong loop:** GORM lazy load related records khi truy cập `.Orders` → 1 query/user → 1000 queries cho 1000 users

**❌ Sai lầm thường gặp / Common Mistakes:**

| Sai lầm                                               | Tại sao sai                                                                                      | Đúng là                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| Không set `SetMaxOpenConns` trong Go                  | `database/sql` mặc định unlimited connections → exhausts PostgreSQL (default max 100) → DB crash | Set `db.SetMaxOpenConns(25)` và `db.SetMaxIdleConns(10)` khi init                   |
| `ALTER TABLE ADD NOT NULL` trực tiếp trên large table | Acquire ACCESS EXCLUSIVE lock, có thể lock bảng nhiều phút → downtime                            | Dùng expand-contract: ADD nullable → backfill → ADD CONSTRAINT NOT VALID → VALIDATE |
| GORM eager loading không có limit                     | `Preload("Orders")` load toàn bộ orders của user, không phân trang → OOM nếu user có 100K orders | Thêm điều kiện Preload hoặc viết JOIN query với LIMIT                               |

- **Interview Pattern:** "Connection pool sizing" → Signal: `(cores × 2) + spindles` formula, PgBouncer transaction mode, monitor pool_wait

**🔑 Knowledge Chain / Chuỗi Kiến Thức:**

- 📚 Cần biết trước: [Concept 6 — PostgreSQL & MySQL Internals](#concept-6-postgresql--mysql-internals)
- ➡️ Để hiểu tiếp: [API Design & Pagination](../02-backend-knowledge/01-api-design.md)

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

Trả lời không nhìn tài liệu. Nếu < 4/5 đúng → đọc lại phần tương ứng.

| #   | Loại           | Câu hỏi                                                                                                                            |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 🔍 Retrieval   | PK, FK, candidate key khác nhau thế nào? Liệt kê đặc điểm của từng loại.                                                           |
| 2   | 🎨 Visual      | Vẽ sơ đồ pipeline thực thi SQL: từ FROM đến LIMIT. Thứ tự nào chạy trước GROUP BY? Thứ tự nào chạy sau SELECT?                     |
| 3   | 🛠️ Application | Viết query lấy top-3 nhân viên lương cao nhất trong từng phòng ban bằng Window Function.                                           |
| 4   | 🐛 Debug       | Transaction A thực hiện chuyển khoản, crash sau khi trừ tiền A nhưng chưa cộng tiền B. Điều gì xảy ra? Cơ chế nào đảm bảo điều đó? |
| 5   | 🎓 Teach       | Giải thích MVCC cho junior: "Tại sao đọc không chặn ghi trong PostgreSQL?" — dùng ngôn ngữ không chuyên.                           |

💬 **Feynman Prompt:** Giải thích cho một người chưa biết lập trình nghe: "Tại sao chúng ta cần transaction trong database? Điều gì xảy ra nếu không có nó?" — dùng ví dụ chuyển tiền ngân hàng, không dùng từ kỹ thuật.

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

---

## Quick Recap / Tóm Tắt Nhanh

### Key Takeaways / Điểm Chính

- **ACID = Atomicity, Consistency, Isolation, Durability** — the 4 guarantees of a reliable transaction / **ACID = Atomicity, Consistency, Isolation, Durability** — 4 đảm bảo của transaction đáng tin cậy.
- **Normalization reduces redundancy**: 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency) — denormalize only for read performance / **Chuẩn hóa giảm dư thừa**: 1NF (giá trị nguyên tử), 2NF (không phụ thuộc bộ phận), 3NF (không phụ thuộc bắc cầu) — denormalize chỉ khi cần hiệu suất đọc.
- **Isolation levels trade consistency for performance**: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE (increasing isolation, decreasing concurrency) / **Mức isolation đánh đổi nhất quán lấy hiệu suất**: READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE (tăng isolation, giảm concurrency).
- **JOIN types**: INNER (matching rows only), LEFT (all left + matching right), RIGHT, FULL OUTER — know the difference for NULL handling / **Các loại JOIN**: INNER (chỉ hàng khớp), LEFT (tất cả bên trái + khớp bên phải), RIGHT, FULL OUTER — hiểu rõ sự khác biệt khi xử lý NULL.
- **Window functions vs GROUP BY**: window functions retain individual rows while computing aggregates (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`) / **Window function vs GROUP BY**: window function giữ từng hàng trong khi tính toán tổng hợp (`ROW_NUMBER`, `RANK`, `LAG`, `LEAD`).
- **`EXPLAIN ANALYZE` reveals the query plan** — look for Seq Scan on large tables, Hash Join vs Nested Loop, high row estimates mismatch / **`EXPLAIN ANALYZE` hiển thị query plan** — chú ý Seq Scan trên bảng lớn, Hash Join vs Nested Loop, ước tính số hàng sai lệch.
- **Foreign keys enforce referential integrity** but add write overhead — sometimes dropped in high-throughput systems and enforced at application layer / **Foreign key đảm bảo tính toàn vẹn tham chiếu** nhưng tốn chi phí ghi — đôi khi bỏ ở hệ thống throughput cao và enforce ở application.
- **NULL is not a value** — use `IS NULL` / `IS NOT NULL`; NULL in aggregate functions is ignored; NULL comparisons always return UNKNOWN / **NULL không phải giá trị** — dùng `IS NULL` / `IS NOT NULL`; NULL trong aggregate bị bỏ qua; so sánh với NULL luôn trả về UNKNOWN.

### Interview Tips / Mẹo Phỏng Vấn

- **"Explain ACID"** — Give a real example (bank transfer): atomicity=both debit+credit or neither; isolation=concurrent transfers don't interfere; durability=survives crash / **"Giải thích ACID"** — Dùng ví dụ thực (chuyển khoản): atomicity=cả hai thao tác hoặc không cái nào; isolation=các transfer đồng thời không ảnh hưởng nhau; durability=sống sót sau crash.
- **"What is a dirty read / phantom read?"** — Dirty read: reading uncommitted data; phantom read: re-running a query returns different rows due to concurrent insert/delete / **"Dirty read / phantom read là gì?"** — Dirty read: đọc dữ liệu chưa commit; phantom read: chạy lại query ra kết quả khác do insert/delete đồng thời.
- **"When to use a CTE vs subquery?"** — CTE for readability and recursive queries; subquery for simple inline filters; CTE may be materialised (depends on DB) / **"Khi nào dùng CTE vs subquery?"** — CTE cho dễ đọc và query đệ quy; subquery cho filter đơn giản inline; CTE có thể được materialise (tuỳ DB).
- **"PostgreSQL vs MySQL key differences?"** — PG: MVCC full ACID, advanced types (JSONB, arrays), better standards compliance; MySQL: simpler ops, InnoDB MVCC, wider hosting support / **"Khác biệt chính PostgreSQL vs MySQL?"** — PG: MVCC ACID đầy đủ, kiểu dữ liệu nâng cao (JSONB, array), tuân thủ chuẩn tốt hơn; MySQL: vận hành đơn giản, InnoDB MVCC, hỗ trợ hosting rộng hơn.
- **"How do you optimize a slow query?"** — Check `EXPLAIN ANALYZE`, add appropriate index, rewrite correlated subqueries, avoid `SELECT *`, use connection pooling / **"Tối ưu query chậm thế nào?"** — Kiểm tra `EXPLAIN ANALYZE`, thêm index phù hợp, viết lại correlated subquery, tránh `SELECT *`, dùng connection pooling.
