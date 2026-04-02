---
layout: page
title: "Kth Smallest Product of Two Sorted Arrays"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/kth-smallest-product-of-two-sorted-arrays"
---

# kth smallest product of two sorted arrays

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tưởng tượng bạn có hai bảng báo giá hàng hóa: một bảng có thể âm (kho bán lỗ), một bảng
dương. Bạn muốn tìm cặp giao dịch có lợi nhuận nhỏ thứ k. Thay vì liệt kê tất cả m×n cặp,
bạn **đoán một ngưỡng x** rồi đếm: "có bao nhiêu cặp cho tích ≤ x?" Nếu đủ k cặp thì x quá
lớn, thiếu thì x quá nhỏ — binary search thu hẹp đến đáp án. Mấu chốt: khi `a > 0` thì
`a*b ≤ x ↔ b ≤ x/a`; khi `a < 0` chiều đảo ngược; khi `a = 0` tích luôn là 0.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual —  example:**

```
nums1 = [-2, -1, 0, 3],  nums2 = [1, 2, 3],  k = 6

Outer binary search:  lo = -10^10,  hi = 10^10
─────────────────────────────────────────────
mid = 0  →  countPairs(0):
  a=-2  threshold=ceil(0/-2)=0  → b ≥ 0  → [1,2,3] → +3
  a=-1  threshold=ceil(0/-1)=0  → b ≥ 0  → [1,2,3] → +3
  a= 0  0 ≤ 0 → n=3              → +3
  a= 3  threshold=floor(0/3)=0  → b ≤ 0  → [] → +0
  total = 9 ≥ k=6  →  hi = 0

mid = -5000000000  →  count < 6  →  lo 오르다
Converges:  answer = -2

Verify:  all products sorted = [-6,-6,-3,-3,-2,-2,-1,-1,0,0,0,3,6,9]
         6th smallest = -2  ✓
```

---

## Problem Description

| Problem                                                                                                                        | Difficulty | Tags                |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)                         | Medium     | Heap                |
| [668. Kth Smallest Number in Multiplication Table](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/) | Hard       | Binary Search       |
| [786. K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)                               | Medium     | Binary Search, Heap |
| [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)         | Medium     | Binary Search, Heap |

---

## 📝 Interview Tips

1. **Binary search on value, not index** — The answer is some actual product; search `[-10^10, 10^10]`.
   _Binary search trên giá trị, không phải chỉ số — Đáp án là một tích thực tế; tìm trong `[-10^10, 10^10]`._

2. **Count-then-decide pattern** — For candidate `x`, count pairs with product ≤ x in O(m log n). Find smallest x with count ≥ k.
   _Mẫu đếm-rồi-quyết định — Với x cho trước, đếm cặp tích ≤ x trong O(m log n). Tìm x nhỏ nhất thỏa count ≥ k._

3. **Sign flips inequality** — When dividing by a negative number, comparison direction reverses.
   _Dấu âm đảo chiều bất đẳng thức — Khi chia cho số âm, chiều so sánh đảo ngược._

4. **Use integer thresholds** — `Math.floor(x/a)` for `a > 0`, `Math.ceil(x/a)` for `a < 0` avoids float precision bugs.
   _Dùng ngưỡng nguyên — `Math.floor(x/a)` khi `a > 0`, `Math.ceil(x/a)` khi `a < 0` để tránh lỗi dấu phẩy động._

5. **Zero is a special case** — `0 * anything = 0`; never divide by zero.
   _Số 0 là trường hợp đặc biệt — `0 _ anything = 0`; không bao giờ chia cho 0.\*

6. **Answer is always a real product** — Binary search converges to an actual product value, not an interpolated one.
   _Đáp án luôn là tích thực — Binary search hội tụ về giá trị tích thực tế, không phải giá trị nội suy._

---

## Solutions


---

## 🔗 Related Problems

| Problem                                                                                                                        | Difficulty | Tags                |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------- |
| [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)                         | Medium     | Heap                |
| [668. Kth Smallest Number in Multiplication Table](https://leetcode.com/problems/kth-smallest-number-in-multiplication-table/) | Hard       | Binary Search       |
| [786. K-th Smallest Prime Fraction](https://leetcode.com/problems/k-th-smallest-prime-fraction/)                               | Medium     | Binary Search, Heap |
| [378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/)         | Medium     | Binary Search, Heap |
