---
layout: page
title: "Koko Eating Bananas"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/koko-eating-bananas"
---

# Koko Eating Bananas / Koko Ăn Chuối

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search on Answer
> **Frequency**: ⭐ Tier 2 — Gặp ở 23+ companies

---

## 🧠 Intuition / Tư Duy

**Analogy (Vietnamese):** Giống bạn đặt tốc độ chạy marathon — chạy nhanh quá tốn sức, chạy chậm không kịp về đích. Có một tốc độ tối thiểu để về đúng giờ. Không cần thử từng tốc độ từ 1 đến max — dùng binary search để tìm ngưỡng đó trong O(log n) lần thử.

**Pattern Recognition:**

- Signal: "find minimum/maximum X such that condition(X) is true" → **Binary Search on Answer**
- Condition: `canFinish(k, h)` monotonic — nếu speed=k đủ, speed=k+1 cũng đủ
- Search space: `[1, max(piles)]`

**Visual — piles = [3, 6, 7, 11], h = 8:**

```
Search space: [1 ................ 11]
               L                   R

mid = 6: hours = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
                = 1+1+2+2 = 6 ≤ 8 ✅ → ans=6, R=mid-1=5

mid = 3: hours = 1+2+3+4 = 10 > 8 ❌ → L=mid+1=4

mid = 4: hours = 1+2+2+3 = 8 ≤ 8 ✅ → ans=4, R=mid-1=3

L > R → stop. Answer = 4 ✅
```

---

## Problem Description

Koko có `n` đống chuối `piles[i]`. Mỗi giờ ăn tối đa `k` quả từ 1 đống. Trong `h` giờ, tìm tốc độ `k` tối thiểu để ăn hết tất cả. ([LeetCode 875](https://leetcode.com/problems/koko-eating-bananas))

Difficulty: Medium | Acceptance: 49.1%

```
Example 1: piles = [3,6,7,11], h = 8  → 4
Example 2: piles = [30,11,23,4,20], h = 5  → 30
Example 3: piles = [1,1,1,999999999], h = 10 → 142857143
```

Constraints:

- `1 <= piles.length <= 10^4`
- `piles.length <= h <= 10^9`
- `1 <= piles[i] <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "h >= piles.length đảm bảo luôn có giải pháp" / h >= piles.length guarantees a solution always exists
2. **Search space**: "Lo=1 (ăn 1 quả/giờ), Hi=max(piles) (ăn hết đống to nhất trong 1 giờ)" / lo=1, hi=max(piles)
3. **Ceil trick**: "ceil(a/b) = Math.floor((a + b - 1) / b) — tránh floating point" / Use integer ceiling to avoid float issues
4. **Monotonic**: "Tốc độ lớn hơn → giờ cần ít hơn hoặc bằng → binary search được" / Higher speed → fewer/equal hours → monotonic condition
5. **Template**: "Lo=1, Hi=max, ans=Hi. Khi feasible → ans=mid, Hi=mid-1; ngược lại → Lo=mid+1" / Standard lower-bound binary search template
6. **Overflow**: "Tổng hours có thể lớn — dùng số nguyên, không float" / Total hours can be large — keep integer math

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan
 * Name: Try Every Speed from 1 to Max
 * Time: O(n * max(piles)) — too slow for large inputs
 * Space: O(1)
 */
function minEatingSpeedLinear(piles: number[], h: number): number {
  const maxPile = Math.max(...piles);
  for (let k = 1; k <= maxPile; k++) {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) return k;
  }
  return maxPile;
}

/**
 * Solution 2: Binary Search on Answer  ← OPTIMAL
 * Name: Binary Search on Eating Speed
 * Time: O(n log(max(piles))) — log(max) iterations, each O(n)
 * Space: O(1)
 */
function minEatingSpeed(piles: number[], h: number): number {
  let lo = 1;
  let hi = Math.max(...piles);
  let ans = hi;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    // Calculate hours needed with speed=mid
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / mid);

    if (hours <= h) {
      ans = mid; // feasible — try slower
      hi = mid - 1;
    } else {
      lo = mid + 1; // too slow — need faster
    }
  }

  return ans;
}

// === Test Cases ===
console.log(minEatingSpeed([3, 6, 7, 11], 8)); // 4
console.log(minEatingSpeed([30, 11, 23, 4, 20], 5)); // 30
console.log(minEatingSpeed([1, 1, 1, 999999999], 10)); // 142857143
console.log(minEatingSpeed([312884470], 312884469)); // 2
console.log(minEatingSpeed([1], 1)); // 1
```

---

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                      |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Minimum Speed to Arrive on Time](https://leetcode.com/problems/minimum-speed-to-arrive-on-time)                 | Same binary search on answer      |
| [Capacity to Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days) | Same pattern, different condition |
| [Minimize Maximum of Array](https://leetcode.com/problems/minimize-maximum-of-array)                             | Binary search on answer           |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                             | Binary search variant             |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)                                           | Binary search fundamentals        |
