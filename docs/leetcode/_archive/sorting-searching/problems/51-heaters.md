---
layout: page
title: "Heaters"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/heaters"
---

# Heaters / Lò Sưởi

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng đặt các lò sưởi dọc theo phố. Mỗi ngôi nhà cần lò sưởi gần nhất phủ ấm nó. Bán kính tối thiểu chính là **khoảng cách lớn nhất** từ bất kỳ nhà nào đến lò sưởi gần nhất của nó.

**Pattern Recognition:**

- Signal: "sorted array" + "find nearest element" → **Binary Search**
- Sort heaters, với mỗi house tìm vị trí chèn → lò sưởi kề bên là nearest
- Key insight: `minRadius = max(minDist_per_house)` — bottleneck là nhà xa nhất

**Visual — Binary search for nearest heater:**

```
houses  = [1, 2, 3]   heaters = [2] (sorted)

house=1: search [2] → |2-1|=1
house=2: search [2] → |2-2|=0  (exact match)
house=3: search [2] → |2-3|=1

Answer = max(1, 0, 1) = 1  ✅

houses=[1,2,3,4], heaters=[1,4]:
    H   H  H  H
    |   |  |  |
    1   2  3  4
    ↑         ↑
   lo=1      hi=1    each house → dist 0 or 1
Answer = 1  ✅
```

---

## Problem Description

Cho mảng vị trí `houses` và `heaters`, tìm bán kính tối thiểu `r` để mọi nhà đều nằm trong phạm vi ít nhất một lò sưởi. ([LeetCode 475](https://leetcode.com/problems/heaters))

- Example 1: `houses=[1,2,3], heaters=[2]` → `1`
- Example 2: `houses=[1,2,3,4], heaters=[1,4]` → `1`
- Example 3: `houses=[1,5], heaters=[2]` → `3`

Constraints: `1 ≤ houses.length, heaters.length ≤ 3×10⁴`, `1 ≤ values ≤ 10⁹`

---

## 📝 Interview Tips

1. **Clarify**: "Heaters/houses đã sorted chưa? Cần sort không?" / Neither is sorted; sort heaters first
2. **Brute force**: "Mỗi house duyệt hết heaters O(n×m)" / Nested loops check all heater distances
3. **Optimize**: "Sau khi sort heaters, binary search O((n+m)log m)" / Binary search for closest heater
4. **Two Pointers**: "Nếu sort cả hai, dùng two pointers O((n+m)log(n+m))" / Sort both then converge
5. **Edge case**: "Heater trùng nhà → dist=0; mọi nhà cùng 1 heater" / Exact match = 0 distance
6. **Answer form**: "Lấy max của mọi min-distance" / `max(minDist(house))` over all houses

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — check all heaters per house
 * Time: O(n × m) — for each of n houses, scan all m heaters
 * Space: O(1) — no extra space needed
 */
function heatersBruteForce(houses: number[], heaters: number[]): number {
  let minRadius = 0;
  for (const house of houses) {
    let nearest = Infinity;
    for (const heater of heaters) {
      nearest = Math.min(nearest, Math.abs(heater - house));
    }
    minRadius = Math.max(minRadius, nearest);
  }
  return minRadius;
}

/**
 * Solution 2: Binary Search (Optimal)
 * Time: O((n + m) log m) — sort heaters O(m log m), binary search per house O(n log m)
 * Space: O(1) — in-place sort
 */
function heaters(houses: number[], heaters: number[]): number {
  heaters.sort((a, b) => a - b);
  let minRadius = 0;

  for (const house of houses) {
    let lo = 0,
      hi = heaters.length - 1,
      nearest = Infinity;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const dist = Math.abs(heaters[mid] - house);
      nearest = Math.min(nearest, dist);
      if (heaters[mid] === house) {
        nearest = 0;
        break;
      } else if (heaters[mid] < house) lo = mid + 1;
      else hi = mid - 1;
    }
    minRadius = Math.max(minRadius, nearest);
  }

  return minRadius;
}

// === Test Cases ===
console.log(heaters([1, 2, 3], [2])); // 1
console.log(heaters([1, 2, 3, 4], [1, 4])); // 1
console.log(heaters([1, 5], [2])); // 3
console.log(heaters([1], [1, 2, 3])); // 0
```

---

## 🔗 Related Problems

- [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements) — binary search on sorted array for closest window
- [Intersection of Two Arrays](https://leetcode.com/problems/intersection-of-two-arrays) — two pointers on sorted arrays
- [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference) — finding closest pairs in sorted array
- [Maximum Number of Tasks You Can Assign](https://leetcode.com/problems/maximum-number-of-tasks-you-can-assign) — sorted + greedy matching
- [Heaters — LeetCode](https://leetcode.com/problems/heaters) — problem page
