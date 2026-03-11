# Indexing and Query Optimization — Đánh chỉ mục và tối ưu truy vấn

> Shared theory for both Frontend and Backend tracks.
> Cross-referenced by: `be-track/03-database-advanced/02-indexing-optimization.md`, `shared/03-database/database-theory.md`, `be-track/01-golang/05-testing-profiling.md`

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

- `docs/interview/shared/03-database/database-theory.md`
- `docs/interview/shared/01-cs-fundamentals/complexity-analysis.md`
- `docs/interview/be-track/03-database-advanced/02-indexing-optimization.md`
- `docs/interview/be-track/03-database-advanced/01-sql-fundamentals.md`
- `docs/interview/be-track/01-golang/05-testing-profiling.md`
- `docs/interview/fe-track/modules/10-cs-fundamentals.md`

### 🟡 Q: Quick check #155: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #159: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #163: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #167: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #171: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #175: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #179: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #183: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #187: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #191: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #195: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #199: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #203: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #207: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #211: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #215: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #219: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #223: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #227: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #231: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #235: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #239: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #243: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #247: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #251: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #255: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #259: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #263: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #267: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #271: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #275: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #279: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #283: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #287: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #291: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #295: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #299: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #303: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #307: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #311: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #315: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #319: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #323: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #327: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #331: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #335: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #339: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #343: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #347: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #351: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #355: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #359: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #363: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #367: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #371: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #375: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #379: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #383: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #387: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #391: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #395: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #399: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #403: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #407: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #411: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #415: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #419: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #423: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #427: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #431: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #435: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #439: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #443: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #447: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #451: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #455: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #459: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #463: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #467: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #471: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #475: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #479: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #483: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #487: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #491: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #495: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #499: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #503: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #507: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #511: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #515: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #519: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #523: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #527: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #531: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #535: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #539: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #543: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #547: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #551: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #555: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #559: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #563: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #567: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #571: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #575: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #579: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #583: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #587: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #591: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #595: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #599: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #603: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #607: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #611: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #615: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #619: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #623: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #627: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #631: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #635: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.

### 🟡 Q: Quick check #639: Why update DB statistics after bulk load? `[Mid]`
**A:** Bulk load làm phân phối dữ liệu thay đổi mạnh; nếu statistics cũ, optimizer dễ chọn sai plan.
Cập nhật statistics giúp execution plan phản ánh dữ liệu mới.
### 🟡 Q: Extra drill on index and query plan #1? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #2? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #3? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #4? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #5? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #6? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #7? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #8? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #9? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #10? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #11? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #12? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #13? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #14? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #15? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #16? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #17? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #18? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #19? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #20? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #21? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #22? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #23? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #24? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #25? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #26? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #27? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #28? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #29? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #30? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #31? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #32? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #33? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #34? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #35? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #36? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #37? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #38? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #39? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #40? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #41? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #42? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #43? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #44? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.

### 🟡 Q: Extra drill on index and query plan #45? `[Mid]`
**A:** Luôn xác thực tối ưu bằng EXPLAIN ANALYZE và số liệu thực tế thay vì chỉ dựa vào trực giác.
Index tốt nhất là index phục vụ query nóng và có chi phí write chấp nhận được.
