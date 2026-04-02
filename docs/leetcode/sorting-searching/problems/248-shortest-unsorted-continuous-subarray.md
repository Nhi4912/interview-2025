---
layout: page
title: "Shortest Unsorted Continuous Subarray"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Stack, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/shortest-unsorted-continuous-subarray"
---

# shortest unsorted continuous subarray

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng một dãy núi bị "xáo trộn" ở giữa. Bạn muốn tìm đoạn ngắn nhất cần san bằng
để cả dãy tạo thành dốc đều tăng. Bí quyết: phần tử nào đang "lạc chỗ" thì nằm trong đoạn
cần sắp xếp. Một phần tử `nums[i]` lạc chỗ nếu nó nhỏ hơn max của bên trái nó (quá thấp
so với vị trí) hoặc lớn hơn min của bên phải nó (quá cao). Quét từ hai phía để tìm biên.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums = [2, 6, 4, 8, 10, 9, 15]

Quét trái→phải (theo dõi max, tìm right):
  i=0: max=2,  nums[0]=2  ≥ max → OK
  i=1: max=6,  nums[1]=6  ≥ max → OK
  i=2: max=6,  nums[2]=4  < max → right=2  ← lạc chỗ!
  i=3: max=6,  nums[3]=8  ≥ max → OK,  max=8
  i=4: max=8,  nums[4]=10 ≥ max → OK,  max=10
  i=5: max=10, nums[5]=9  < max → right=5  ← lạc chỗ!
  i=6: max=10, nums[6]=15 ≥ max → OK
  → right = 5

Quét phải→trái (theo dõi min, tìm left):
  i=6: min=15, nums[6]=15 ≤ min → OK
  i=5: min=15, nums[5]=9  ≤ min → OK,  min=9
  i=4: min=9,  nums[4]=10 > min → left=4  ← lạc chỗ!
  i=3: min=9,  nums[3]=8  ≤ min → OK,  min=8
  ...
  → left = 3

Answer: right - left + 1 = 5 - 3 + 1 = 3  ✓  (đoạn [8,10,9])
```

---

## Problem Description

| Problem                                                                                                                                           | Difficulty | Tags                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)                                                        | Easy       | Two Pointers, Sorting |
| [1574. Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/) | Medium     | Two Pointers, Stack   |
| [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)                                                              | Easy       | Monotonic Stack       |
| [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)                                                                      | Medium     | Monotonic Stack       |

---

## 📝 Interview Tips

1. **Sort-and-compare is clearest** — Clone, sort, find first/last mismatch. O(n log n) but very readable.
   _Sort-và-so-sánh là rõ ràng nhất — Nhân bản, sắp xếp, tìm vị trí khác nhau đầu/cuối. O(n log n) nhưng rất dễ đọc._

2. **Two-pass O(n) saves sorting** — Forward pass tracks running max to find right boundary; backward pass tracks running min for left.
   _Hai lần quét O(n) không cần sort — Quét trước theo dõi max để tìm biên phải; quét sau theo dõi min để tìm biên trái._

3. **Right boundary logic** — `nums[i] < runningMax` means `nums[i]` is out of place; update `right = i`.
   _Logic biên phải — `nums[i] < runningMax` nghĩa là `nums[i]` lạc chỗ; cập nhật `right = i`._

4. **Left boundary logic** — `nums[i] > runningMin` (scanning right-to-left) means `nums[i]` is too large; update `left = i`.
   _Logic biên trái — `nums[i] > runningMin` (quét phải sang trái) nghĩa là `nums[i]` quá lớn; cập nhật `left = i`._

5. **Stack approach** — Monotonic increasing stack finds left; monotonic decreasing stack finds right. Same O(n) time.
   _Cách dùng stack — Stack đơn điệu tăng tìm biên trái; stack đơn điệu giảm tìm biên phải. Cùng O(n)._

6. **Already-sorted edge case** — If `right == -1` after forward pass, array is sorted; return 0 immediately.
   _Trường hợp đã sắp xếp — Nếu `right == -1` sau lần quét đầu, mảng đã sắp xếp; trả về 0 ngay._

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                                                                           | Difficulty | Tags                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------- |
| [977. Squares of a Sorted Array](https://leetcode.com/problems/squares-of-a-sorted-array/)                                                        | Easy       | Two Pointers, Sorting |
| [1574. Shortest Subarray to be Removed to Make Array Sorted](https://leetcode.com/problems/shortest-subarray-to-be-removed-to-make-array-sorted/) | Medium     | Two Pointers, Stack   |
| [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)                                                              | Easy       | Monotonic Stack       |
| [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)                                                                      | Medium     | Monotonic Stack       |
