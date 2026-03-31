---
layout: page
title: "Sqrt(x)"
difficulty: Easy
category: Sorting-Searching
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/sqrtx"
---

# Sqrt(x) / Căn Bậc Hai Nguyên Của x

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search / Newton's Method
> **Frequency**: 📘 Tier 3 — Gặp ở 17 companies
> **See also**: [Pow(x, n)](https://leetcode.com/problems/powx-n) | [Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm căn bậc hai nguyên giống như tìm số trang trong từ điển — bạn mở giữa, kiểm tra mid², rồi loại nửa không thể chứa đáp án. Newton cải thiện thêm bằng cách "tiệm cận" từ trên xuống.

**Pattern Recognition:**

- Signal: "tìm giá trị k sao cho f(k) <= x < f(k+1)" → **Binary Search on answer space**
- Không có mảng — search space là [1, x/2], mid² so sánh với x
- Newton's Method: x\_{n+1} = (x_n + N/x_n) / 2 hội tụ siêu nhanh

**Visual — mySqrt(8), binary search:**

```
Search space: [1, 4]  (hi = x/2 = 4)
  lo=1, hi=4: mid=2, 2²=4 ≤ 8 → lo=3
  lo=3, hi=4: mid=3, 3²=9 > 8 → hi=2
  lo=3 > hi=2 → stop, return hi=2 ✅

Newton trace (start r=8):
  r=8:  8²=64>8 → r = ⌊(8+⌊8/8⌋)/2⌋ = ⌊9/2⌋ = 4
  r=4:  4²=16>8 → r = ⌊(4+2)/2⌋ = 3
  r=3:  3²=9>8  → r = ⌊(3+2)/2⌋ = 2
  r=2:  2²=4≤8  → stop, return 2 ✅
```

---

## Problem Description

Given a non-negative integer `x`, return the integer square root of `x` (i.e., the largest integer `r` such that `r² <= x`). Do not use built-in `Math.sqrt`.

```
Example 1: x=4  → 2   (2² = 4)
Example 2: x=8  → 2   (2² = 4 ≤ 8, 3² = 9 > 8, so floor is 2)
Example 3: x=0  → 0
```

Constraints: `0 <= x <= 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "Trả về phần nguyên hay chính xác?" / Return integer floor, not exact float.
2. **Brute force**: Linear scan i=1,2,... until i²>x → O(√n); good starting point.
3. **Binary search**: Search in [1, x/2] since sqrt(x) <= x/2 for x>=4 → O(log n).
4. **Newton**: Quadratically convergent, ~O(log log n) iterations; impressive to mention.
5. **Overflow**: `mid * mid` có thể overflow int32 với x lớn; trong JS number an toàn đến 2^53.
6. **Edge cases**: x=0 → 0, x=1 → 1, perfect squares (x=4,9,16) vs non-perfect (x=8).

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan
 * Time: O(√x) — iterate i until i² > x
 * Space: O(1)
 */
function mySqrt1(x: number): number {
  if (x < 2) return x;
  let i = 1;
  while (i * i <= x) i++;
  return i - 1;
}

/**
 * Solution 2: Binary Search
 * Time: O(log x) — halve search space each step
 * Space: O(1)
 *
 * Invariant: answer lives in [lo, hi].
 * When lo > hi, answer = hi (last valid mid where mid² <= x).
 */
function mySqrt2(x: number): number {
  if (x < 2) return x;
  let lo = 1,
    hi = Math.floor(x / 2);
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (mid * mid === x) return mid;
    else if (mid * mid < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi; // hi = largest mid where mid² <= x
}

/**
 * Solution 3: Newton's Method (Integer)
 * Time: O(log log x) — quadratic convergence; in practice very few iterations
 * Space: O(1)
 *
 * Start with r = x (overestimate), repeatedly apply:
 *   r = floor((r + floor(x / r)) / 2)
 * until r² <= x (i.e., r stops decreasing).
 */
function mySqrt(x: number): number {
  if (x < 2) return x;
  let r = x;
  while (r * r > x) {
    r = Math.floor((r + Math.floor(x / r)) / 2);
  }
  return r;
}

// === Test Cases ===
console.log(mySqrt(0)); // 0
console.log(mySqrt(1)); // 1
console.log(mySqrt(4)); // 2
console.log(mySqrt(8)); // 2
console.log(mySqrt(9)); // 3
console.log(mySqrt(2147395600)); // 46340
console.log(mySqrt2(8)); // 2
console.log(mySqrt1(9)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                            | Relationship                                 |
| ---------------------------------------------------------------------------------- | -------------------------------------------- |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)                                | This problem                                 |
| [367. Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)   | Same idea — return bool instead of value     |
| [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)                             | Binary exponentiation — same O(log n) family |
| [633. Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/) | Uses integer sqrt as subroutine              |
| [1201. Ugly Number III](https://leetcode.com/problems/ugly-number-iii/)            | Binary search on answer space                |
