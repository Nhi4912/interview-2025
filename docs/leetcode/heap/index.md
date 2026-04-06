---
layout: page
title: "Heap Problems"
category: Heap
description: "Curated Heap / Priority Queue problems for interview preparation"
total_problems: 10
---

# Heap / Priority Queue Problems / Bài Toán Heap và Hàng Đợi Ưu Tiên

> **Track**: Interview Prep | **Problems**: 10 curated
> **See also**: [Master Tracker](../00-master-tracker.md) | [Study Guide](../00-study-guide.md)

## 📋 Problem List / Danh Sách Bài Toán

| #   | Problem                                                                                                                          | Difficulty | Pattern                  | Target | v2.0 |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------ | ------ | ---- |
| 1   | [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) — Viên đá cuối cùng                                  | 🟢 Easy    | Max Heap Simulation      | 10 min | ⬜   |
| 2   | [703. Kth Largest in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/) — Phần tử lớn thứ K trong luồng   | 🟢 Easy    | Min Heap (size k)        | 15 min | ⬜   |
| 3   | [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) — Phần tử lớn thứ K       | 🟡 Medium  | Min Heap / QuickSelect   | 20 min | ⬜   |
| 4   | [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) — K phần tử xuất hiện nhiều nhất          | 🟡 Medium  | Heap + Freq Count        | 20 min | ⬜   |
| 5   | [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/) — Số xấu thứ N (thừa số 2,3,5)                              | 🟡 Medium  | Min Heap / 3-Pointer DP  | 20 min | ⬜   |
| 6   | [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) — K cặp tổng nhỏ nhất     | 🟡 Medium  | Min Heap (multi-source)  | 25 min | ⬜   |
| 7   | [378. Kth Smallest in Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) — Phần tử nhỏ thứ K | 🟡 Medium  | Min Heap / Binary Search | 25 min | ⬜   |
| 8   | [355. Design Twitter](https://leetcode.com/problems/design-twitter/) — Thiết kế Twitter (news feed)                              | 🟡 Medium  | Max Heap + OOP Design    | 30 min | ⬜   |
| 9   | [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) — Gộp K danh sách đã sắp xếp                     | 🔴 Hard    | Min Heap (k-way Merge)   | 30 min | ⬜   |
| 10  | [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) — Trung vị từ luồng dữ liệu     | 🔴 Hard    | Two Heaps (max + min)    | 35 min | ⬜   |

### Legend / Chú thích

- ✅ v2.0 migrated (Tier 1) | ⬜ v1.0 format (pending upgrade)
- 🟢 Easy | 🟡 Medium | 🔴 Hard

---

## 📊 Patterns Covered / Các Kỹ Thuật

- **Max Heap Simulation** _(Mô Phỏng Max Heap)_: Last Stone Weight — dùng max heap để lặp đi lặp lại
- **Min Heap size-k** _(Min Heap kích thước k)_: Kth Largest Stream, Kth Largest Array — heap k phần tử, top = phần tử lớn thứ k
- **Heap + Frequency** _(Heap + Đếm Tần Suất)_: Top K Frequent — đếm tần suất rồi heap theo tần suất
- **Multi-source Min Heap** _(Heap Đa Nguồn)_: Merge K Sorted, Find K Pairs — heap lưu con trỏ vào nhiều dãy
- **Two Heaps** _(Hai Heap)_: Find Median from Stream — max-heap trái + min-heap phải, cân bằng kích thước
- **Heap + Binary Search** _(Heap + Tìm Kiếm Nhị Phân)_: Kth Smallest in Matrix — hai chiến lược, binary search thường tối ưu hơn
- **3-Pointer DP** _(DP 3 Con Trỏ)_: Ugly Number II — DP không cần heap, 3 con trỏ cho nhân tử 2, 3, 5

---

## 🗺️ Study Order / Thứ Tự Học

**Tuần 1 — Heap cơ bản (Basic Heap):**

1. #1046 Last Stone Weight → làm quen max heap API
2. #703 Kth Largest in a Stream → min heap kích thước cố định
3. #215 Kth Largest in Array → heap vs QuickSelect, so sánh 2 cách

**Tuần 2 — Top-K và Kết Hợp (Top-K & Combined):**

4. #347 Top K Frequent Elements → heap + frequency map
5. #264 Ugly Number II → DP hoặc heap, luyện 2 cách
6. #373 Find K Pairs with Smallest Sums → heap đa nguồn

**Tuần 3 — Nâng Cao và Thiết Kế (Advanced & Design):**

7. #378 Kth Smallest in Sorted Matrix → so sánh heap vs binary search
8. #355 Design Twitter → heap trong thiết kế hệ thống
9. #23 Merge K Sorted Lists → k-way merge kinh điển
10. #295 Find Median from Data Stream → two-heap, bài khó nhất nhóm

---

## 💡 Key Insights / Điểm Mấu Chốt

| Pattern         | When to Use / Khi Nào Dùng                                                     |
| --------------- | ------------------------------------------------------------------------------ |
| Min Heap size-k | Tìm **K phần tử lớn nhất** → giữ heap kích thước k, gốc là nhỏ nhất trong nhóm |
| Max Heap        | Tìm **phần tử nhỏ nhất liên tục** → luôn lấy gốc heap                          |
| Two Heaps       | Tìm **trung vị động** → max-heap (nửa nhỏ) + min-heap (nửa lớn)                |
| k-way Merge     | **Gộp K dãy đã sort** → heap lưu `(value, list_idx, elem_idx)`                 |
| Heap + Map      | **Top K theo tiêu chí** → đếm/tính trước rồi heap theo score                   |

> **Độ phức tạp cần nhớ**: Push/Pop heap O(log n) · Build heap từ mảng O(n) · Top K from N elements O(N log K)
