---
layout: page
title: "Sqrt(x)"
difficulty: Easy
category: Math
tags: [Math, Binary Search]
leetcode_url: "https://leetcode.com/problems/sqrtx/"
---

# Sqrt(x) / Căn Bậc Hai của x

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search on answer space
> **Frequency**: ⭐ Tier 2 — Template "binary search on answer" dùng nhiều trong bài Hard
> **See also**: [Pow(x,n)](./02-pow-x-n.md) | [Power of Three](./03-power-of-three.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Đoán số bình phương bằng trò chơi "nóng lạnh": bạn cần tìm số nguyên k sao cho k² ≤ x < (k+1)². Thay vì thử từ 1 lên, bạn thử số giữa khoảng [1, x/2] — nếu mid² quá lớn thì tìm nửa trái, quá nhỏ thì tìm nửa phải. Đây là **binary search trên không gian kết quả**.

**Pattern Recognition:**

- Signal: find largest integer k where `k² ≤ x` → **binary search on answer** `[1, x/2]`
- Upper bound `x/2` valid vì: với x ≥ 4, `sqrt(x) ≤ x/2` (nếu sqrt > x/2 thì x > x²/4 → x < 4)
- Khi loop kết thúc: `right` là đáp án (largest mid where `mid² ≤ x`)
- Newton's method là alternative nhanh hơn trong thực tế nhưng khó explain hơn

**Visual — x=8:**

```
Search space: [1, 4]  (x/2 = 4)

lo=1, hi=4:
  mid=2: 2²=4 ≤ 8 → lo=3
  mid=3: 3²=9 > 8 → hi=2
  lo(3) > hi(2) → stop

Return hi=2  (2² = 4 ≤ 8 < 9 = 3²) ✅
```

---

## Problem Description

Given non-negative integer `x`, return the **integer** part of `sqrt(x)` (floor). Do not use built-in `Math.sqrt`, `x ** 0.5`, or `pow`.

```
Example 1: x=4   → 2   (sqrt(4) = 2 exactly)
Example 2: x=8   → 2   (sqrt(8) ≈ 2.828, floor = 2)
Example 3: x=0   → 0
```

Constraints: `0 <= x <= 2^31 - 1`

---

## 📝 Interview Tips

1. **Edge cases ngay**: x=0 → 0, x=1 → 1 — xử lý trước khi binary search
2. **Upper bound `x/2`**: với x ≥ 4, sqrt(x) ≤ x/2 — tiết kiệm số bước so với dùng x
3. **Trả về `right`** (không phải `left`) khi loop kết thúc — right là giá trị hợp lệ cuối cùng
4. **Overflow**: `mid * mid` có thể overflow 32-bit int — trong JS không vấn đề, nhưng mention trong C++/Java
5. **Newton's Method**: `guess = (guess + x/guess) / 2` — hội tụ nhanh hơn, nhưng giải thích phức tạp hơn
6. **Đây là template**: "tìm max k thỏa f(k) ≤ target" — áp dụng cho Capacity to Ship Packages, Koko Eating Bananas

---

## Solutions

```typescript
/**

- Solution 1: Newton's Method (Babylonian)
- Time O(log x), Space O(1)
- Converges quadratically — very fast in practice.
- Formula: guess_next = floor((guess + x/guess) / 2)
  _/
  function mySqrtNewton(x: number): number {
  if (x < 2) return x;
  let guess = x;
  while (guess _ guess > x) {
  guess = Math.floor((guess + Math.floor(x / guess)) / 2);
  }
  return guess;
  }

/**

- Solution 2: Binary Search on Answer (Optimal / Canonical)
- Time O(log x), Space O(1)
-
- Find the largest integer `mid` such that mid * mid <= x.
- When loop ends, `right` holds that largest valid value.
  */
  function mySqrt(x: number): number {
  if (x < 2) return x;

let lo = 1;
let hi = Math.floor(x / 2); // sqrt(x) <= x/2 for x >= 4

while (lo <= hi) {
const mid = lo + Math.floor((hi - lo) / 2);
const sq = mid * mid;

    if (sq === x)      return mid;        // perfect square
    else if (sq < x)   lo = mid + 1;     // mid too small
    else               hi = mid - 1;     // mid too large

}

return hi; // hi = largest mid where mid² <= x
}

// --- Quick inline tests ---
console.log(mySqrt(4) === 2); // true
console.log(mySqrt(8) === 2); // true
console.log(mySqrt(0) === 0); // true
console.log(mySqrt(1) === 1); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                   | Relationship                                   |
| --------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/)                                                       | This problem                                   |
| [367. Valid Perfect Square](https://leetcode.com/problems/valid-perfect-square/)                          | Same binary search, check exact square         |
| [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)                                                    | Fast exponentiation, inverse operation         |
| [1011. Capacity to Ship Packages](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Binary search on answer space, same template   |
| [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/)                            | Binary search on answer — find min valid value |
