# Data Structures Theory / Lý Thuyết Cấu Trúc Dữ Liệu

> **Track**: Shared | **Difficulty**: 🟢 Junior → 🔴 Senior
> **See also**: [Algorithms Theory](./algorithms-theory.md) | [Complexity Analysis](./complexity-analysis.md)

## Overview / Tổng Quan
- Tài liệu dùng heading tiếng Anh và giải thích tiếng Việt để phù hợp luyện phỏng vấn song ngữ.
- Mục tiêu là hiểu bản chất, trade-off và cách chọn cấu trúc dữ liệu theo workload thực tế.
- Aim: understand the nature, trade-offs, and how to choose data structures based on real workload.

## Foundation Notes
### Explanation / Giải thích
- Khi trả lời interview, luôn nêu pattern truy cập: read-heavy, write-heavy, range query, memory limit, latency target.
- Không chỉ đọc thuộc complexity; cần giải thích vì sao complexity đó xuất hiện từ cấu trúc bộ nhớ và invariants.
### Example / Ví dụ
- Nếu bài toán cần tra cứu key rất nhanh và không cần thứ tự: chọn hash table.
- Nếu cần range query và ordered traversal: chọn cây cân bằng hoặc B+Tree.

## Arrays
### Overview / Tổng Quan
- Mảng lưu phần tử liên tiếp trong bộ nhớ, truy cập theo index cực nhanh.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Access by index | O(1) |
| Search unsorted | O(n) |
| Append dynamic | Amortized O(1) |
| Insert/Delete middle | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Arrays trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Arrays trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Linked Lists
### Overview / Tổng Quan
- Danh sách liên kết lưu node rời rạc, tối ưu chèn/xóa khi đã có con trỏ.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Access by index | O(n) |
| Insert at head | O(1) |
| Delete known node | O(1) |
| Search | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Linked Lists trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Linked Lists trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Stacks
### Overview / Tổng Quan
- Ngăn xếp LIFO, phần tử vào sau ra trước.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| Search | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Stacks trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Stacks trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Queues
### Overview / Tổng Quan
- Hàng đợi FIFO, phần tử vào trước ra trước.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Enqueue | O(1) |
| Dequeue | O(1) |
| Front | O(1) |
| Search | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Queues trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Queues trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Hash Tables
### Overview / Tổng Quan
- Bảng băm ánh xạ key -> bucket để tra cứu trung bình O(1).
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Get/Put/Delete avg | O(1) |
| Get/Put/Delete worst | O(n) |
| Rehash | O(n) |
| Space | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Hash Tables trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Hash Tables trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Binary Search Trees (BST)
### Overview / Tổng Quan
- Cây tìm kiếm nhị phân giữ thứ tự key trái < node < phải.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Search avg | O(log n) |
| Search worst | O(n) |
| Insert | O(h) |
| Delete | O(h) |

### Example / Ví dụ
- Use case 1: Áp dụng Binary Search Trees (BST) trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Binary Search Trees (BST) trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## AVL Trees
### Overview / Tổng Quan
- BST tự cân bằng chặt bằng rotation để giữ chiều cao logarit.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Search | O(log n) |
| Insert | O(log n) |
| Delete | O(log n) |
| Rotation | O(1) |

### Example / Ví dụ
- Use case 1: Áp dụng AVL Trees trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng AVL Trees trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Red-Black Trees
### Overview / Tổng Quan
- BST tự cân bằng với luật màu đỏ/đen, cập nhật thực dụng.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Search | O(log n) |
| Insert | O(log n) |
| Delete | O(log n) |
| Fix-up | O(log n) |

### Example / Ví dụ
- Use case 1: Áp dụng Red-Black Trees trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Red-Black Trees trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## B-Trees and B+ Trees
### Overview / Tổng Quan
- Cây nhiều nhánh tối ưu I/O đĩa, dùng rộng rãi trong database index.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Search | O(log_f n) |
| Insert | O(log_f n) |
| Delete | O(log_f n) |
| Range scan B+Tree | O(log_f n + k) |

### Example / Ví dụ
- Use case 1: Áp dụng B-Trees and B+ Trees trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng B-Trees and B+ Trees trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Tries
### Overview / Tổng Quan
- Cây tiền tố tối ưu prefix search và autocomplete.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Insert word | O(L) |
| Search word | O(L) |
| Prefix query | O(P) |
| Delete | O(L) |

### Example / Ví dụ
- Use case 1: Áp dụng Tries trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Tries trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Heaps
### Overview / Tổng Quan
- Cấu trúc ưu tiên với phần tử min/max ở root.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Peek top | O(1) |
| Insert | O(log n) |
| Extract top | O(log n) |
| Build heap | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Heaps trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Heaps trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Graphs
### Overview / Tổng Quan
- Mô hình đỉnh-cạnh biểu diễn quan hệ phức tạp.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| BFS/DFS | O(V+E) |
| Adj matrix space | O(V^2) |
| Adj list space | O(V+E) |
| Topological sort | O(V+E) |

### Example / Ví dụ
- Use case 1: Áp dụng Graphs trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Graphs trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Skip Lists
### Overview / Tổng Quan
- Danh sách nhiều tầng ngẫu nhiên, expected O(log n).
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Search expected | O(log n) |
| Insert expected | O(log n) |
| Delete expected | O(log n) |
| Worst case | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Skip Lists trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Skip Lists trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Bloom Filters
### Overview / Tổng Quan
- Bộ lọc xác suất cho membership, chấp nhận false positive.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Add | O(k) |
| Query | O(k) |
| False positive | Possible |
| False negative | No (without delete) |

### Example / Ví dụ
- Use case 1: Áp dụng Bloom Filters trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Bloom Filters trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Union-Find (Disjoint Set)
### Overview / Tổng Quan
- Cấu trúc quản lý tập rời, rất mạnh cho connectivity query.
- Đây là phần lý thuyết nền dùng cho cả frontend và backend.
### Explanation / Giải thích
- Khi phân tích, nên xem đồng thời độ phức tạp trung bình và worst-case để tránh câu trả lời phiến diện.
- Cần chú ý chi phí hidden cost như cache-miss, pointer overhead, resize cost, và synchronization cost.

| Operation | Complexity |
| --- | --- |
| Find | Amortized O(α(n)) |
| Union | Amortized O(α(n)) |
| Connectivity query | Amortized O(α(n)) |
| Init | O(n) |

### Example / Ví dụ
- Use case 1: Áp dụng Union-Find (Disjoint Set) trong hệ thống production để tối ưu latency.
- Use case 2: Áp dụng Union-Find (Disjoint Set) trong bài toán coding interview để giảm time complexity.
- Cần mô tả vì sao lựa chọn này tốt hơn lựa chọn thay thế trong cùng bối cảnh.
### Interview Notes
- Trả lời theo template: requirement -> candidates -> trade-off -> final pick -> scaling plan.
- Nếu interviewer đổi ràng buộc (memory thấp hơn, traffic cao hơn), cần pivot cấu trúc tương ứng.

## Comparative Analysis
### Overview / Tổng Quan
- Bảng so sánh nhanh giúp chốt cấu trúc trong 30 giây khi phỏng vấn.
### Explanation / Giải thích
- Hãy dùng bảng này như điểm xuất phát, sau đó điều chỉnh theo ràng buộc cụ thể của bài toán.

| Structure | Strength | Weakness | Best Fit |
| --- | --- | --- | --- |
| Array | Cache-friendly, O(1) index | Insert middle O(n) | Dense sequential data |
| Linked List | O(1) insert/delete at known node | Poor locality, O(n) index | Frequent local structural edits |
| Hash Table | Avg O(1) lookup | Collision worst-case | Key-value lookup heavy |
| Balanced Trees | Ordered queries | More complex implementation | Range queries |
| Heap | Fast top priority operations | No fast arbitrary search | Priority scheduling |
| Trie | Strong prefix operations | Memory heavy | Autocomplete/routing |
| Union-Find | Very fast connectivity checks | Not for path retrieval | Dynamic grouping |

## Câu Hỏi Phỏng Vấn / Interview Q&A

### 🟢 [Junior] Array random access là gì và vì sao O(1)?
- **Trả lời:** Vì địa chỉ phần tử được tính trực tiếp từ base address và offset, không cần duyệt tuần tự.
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟢 [Junior] Khác nhau giữa stack và queue?
- **Trả lời:** Stack là LIFO còn queue là FIFO; chọn cấu trúc theo thứ tự xử lý của bài toán.
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟢 [Junior] Khi nào nên dùng hash set?
- **Trả lời:** Khi cần kiểm tra phần tử đã xuất hiện chưa với tốc độ trung bình O(1).
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟡 [Mid] Amortized O(1) append của dynamic array nghĩa là gì?
- **Trả lời:** Một số lần resize tốn O(n), nhưng trung bình trên chuỗi thao tác append thì chi phí mỗi lần gần O(1).
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟡 [Mid] Vì sao BST có thể rơi về O(n)?
- **Trả lời:** Nếu cây bị lệch hoàn toàn, chiều cao h gần n nên thao tác theo h trở thành O(n).
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟡 [Mid] B+Tree mạnh hơn BST ở disk workload như thế nào?
- **Trả lời:** B+Tree có fanout lớn nên chiều cao thấp, giảm số lần I/O page và tối ưu range scan.
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🔴 [Senior] Trade-off giữa AVL và Red-Black tree?
- **Trả lời:** AVL cân bằng chặt nên lookup ổn định hơn; Red-Black update thực dụng hơn và thường ít rotation hơn.
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🔴 [Senior] Thiết kế LRU cache O(1) bằng cấu trúc nào?
- **Trả lời:** Kết hợp hash map (lookup key) và doubly linked list (move/evict) để mọi thao tác chính đều O(1).
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🔴 [Senior] Bloom filter phù hợp tình huống nào và rủi ro gì?
- **Trả lời:** Phù hợp pre-check membership ở scale lớn; rủi ro là false positive nên cần tầng xác minh sau đó.
- **Giải thích thêm:** Trong interview nên nêu thêm một ví dụ thực tế bạn đã gặp hoặc có thể thiết kế.

### 🟢 [Junior] Practice question 1: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 2: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 3: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 4: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 5: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 6: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 7: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 8: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 9: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 10: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 11: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 12: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 13: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 14: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 15: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 16: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 17: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 18: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 19: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 20: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 21: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 22: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 23: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 24: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 25: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 26: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 27: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 28: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 29: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 30: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 31: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 32: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 33: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 34: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 35: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 36: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 37: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 38: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 39: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 40: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 41: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 42: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 43: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 44: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟢 [Junior] Practice question 45: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 46: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 47: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 48: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 49: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 50: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 51: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 52: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 53: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 54: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 55: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 56: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 57: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 58: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 59: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 60: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 61: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 62: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 63: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 64: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 65: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 66: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 67: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 68: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 69: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 70: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 71: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 72: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 73: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 74: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 75: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 76: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 77: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 78: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 79: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 80: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 81: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 82: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 83: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 84: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 85: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 86: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 87: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 88: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 89: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 90: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 91: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 92: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 93: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 94: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🟡 [Mid] Practice question 95: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 96: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 97: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 98: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 99: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 100: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 101: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 102: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 103: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 104: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 105: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 106: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 107: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 108: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 109: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 110: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 111: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 112: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 113: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 114: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 115: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 116: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 117: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 118: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 119: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 120: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 121: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 122: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 123: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 124: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 125: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 126: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 127: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 128: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 129: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 130: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 131: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 132: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 133: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 134: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 135: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 136: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 137: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 138: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 139: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

### 🔴 [Senior] Practice question 140: How would you choose between two data structures under changing constraints?
- **Trả lời:** Bắt đầu từ pattern truy cập chính, sau đó so memory footprint, worst-case latency, và độ phức tạp triển khai.
- **Giải thích:** Nếu requirement thay đổi (ví dụ thêm range query), cần chứng minh lý do chuyển từ hash structure sang tree structure.
- **Ví dụ:** Ban đầu dùng hash map cho lookup nhanh; khi cần order by time và window scan thì chuyển sang balanced tree hoặc indexed storage.

## Cross-References
- Algorithms theory: `./algorithms-theory.md`
- Complexity analysis: `./complexity-analysis.md`

