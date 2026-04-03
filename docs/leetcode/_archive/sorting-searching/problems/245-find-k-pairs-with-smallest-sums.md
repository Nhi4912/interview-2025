---
layout: page
title: "Find K Pairs with Smallest Sums"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/find-k-pairs-with-smallest-sums"
---

# find k pairs with smallest sums

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hình dung bạn có hai hàng người xếp theo chiều cao tăng dần. Bạn muốn tìm k cặp (người
hàng A, người hàng B) có tổng chiều cao nhỏ nhất. Bạn bắt đầu bằng cách ghép người đầu
hàng A với tất cả vị trí đầu của hàng B — đây là "ứng viên sáng giá nhất". Khi lấy ra
cặp tốt nhất, bạn đẩy vào "người tiếp theo hàng A cùng vị trí B đó" làm ứng viên mới.
Min-heap đảm bảo mỗi lần lấy ra đều là cặp nhỏ nhất chưa được dùng.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums1 = [1, 7, 11],  nums2 = [2, 4, 6],  k = 3

Khởi tạo heap với (nums1[0] + nums2[j], i=0, j=0..2):
  heap = [(3,0,0), (5,0,1), (7,0,2)]

Vòng 1:  pop (3,0,0) → result = [[1,2]]
          push (nums1[1]+nums2[0], 1, 0) = (9,1,0)
          heap = [(5,0,1), (7,0,2), (9,1,0)]

Vòng 2:  pop (5,0,1) → result = [[1,2],[1,4]]
          push (7+4, 1,1) = (11,1,1)
          heap = [(7,0,2), (9,1,0), (11,1,1)]

Vòng 3:  pop (7,0,2) → result = [[1,2],[1,4],[1,6]]  ✓ k=3 xong
```

---

## Problem Description

| Problem                                                                                                                     | Difficulty | Tags                |
| --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)                                             | Hard       | Heap, Linked List   |
| [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)                                                        | Medium     | Heap, DP            |
| [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)      | Medium     | Heap, Binary Search |
| [2040. Kth Smallest Product of Two Sorted Arrays](https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/) | Hard       | Binary Search       |

---

## 📝 Interview Tips

1. **Seed heap with first row only** — Only push `(nums1[0] + nums2[j])` for `j = 0..min(k,n)-1`; avoids O(mn) initialization.
   _Khởi tạo heap chỉ từ hàng đầu — Chỉ đẩy `(nums1[0]+nums2[j])` với `j=0..min(k,n)-1`; tránh khởi tạo O(mn)._

2. **Expand along nums1 dimension** — When popping `(sum, i, j)`, push `(nums1[i+1]+nums2[j], i+1, j)` if `i+1 < m`.
   _Mở rộng theo chiều nums1 — Khi lấy ra `(sum, i, j)`, đẩy vào `(nums1[i+1]+nums2[j], i+1, j)` nếu `i+1 < m`._

3. **Heap size stays ≤ k** — At most k insertions ever → O(k log k) total time.
   _Heap size ≤ k — Tối đa k lần chèn → tổng O(k log k)._

4. **Duplicates handled naturally** — Min-heap manages equal sums without special logic.
   _Trùng lặp được xử lý tự nhiên — Min-heap quản lý tổng bằng nhau mà không cần logic đặc biệt._

5. **Alternative: each i, binary search best j** — For each i in nums1, binary search the best j; but heap is simpler.
   _Thay thế: lặp i, binary search j — Với mỗi i, tìm j tốt nhất bằng binary search; nhưng heap đơn giản hơn._

6. **Brute force check** — Generate all mn pairs, sort, take first k. Use for small inputs to validate.
   _Kiểm tra bằng brute force — Tạo tất cả mn cặp, sắp xếp, lấy k đầu. Dùng để xác nhận kết quả._

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                                                     | Difficulty | Tags                |
| --------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------- |
| [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)                                             | Hard       | Heap, Linked List   |
| [264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)                                                        | Medium     | Heap, DP            |
| [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)      | Medium     | Heap, Binary Search |
| [2040. Kth Smallest Product of Two Sorted Arrays](https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays/) | Hard       | Binary Search       |
