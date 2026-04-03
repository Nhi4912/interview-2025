---
layout: page
title: "Russian Doll Envelopes"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/russian-doll-envelopes"
---

# Russian Doll Envelopes / Búp Bê Matryoshka

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: DP + Binary Search (LIS in 2D)
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence) | [Maximum Width Ramp](https://leetcode.com/problems/maximum-width-ramp)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Như xếp búp bê Matryoshka — mỗi búp bê nhỏ hơn mới vừa vào bên trong búp bê lớn hơn (cả chiều rộng lẫn chiều cao phải nhỏ hơn nghiêm ngặt). Trick: sắp xếp theo chiều rộng tăng dần, chiều cao giảm dần khi cùng rộng → bài toán thu về LIS 1 chiều trên mảng chiều cao.

**Pattern Recognition:**

- Signal: "fit A inside B with both dims strictly larger" → **Sort + LIS in 2D**
- Sắp theo `w ASC`, `h DESC` khi cùng w → tránh dùng 2 phần tử cùng width
- Key insight: LIS trên heights sau sort = LIS bền vững nhất, dùng binary search O(n log n)

**Visual — envelopes = [[5,4],[6,4],[6,7],[2,3]]:**

```
After sort (w ASC, h DESC when equal w):
  [2,3] [5,4] [6,7] [6,4]
Heights: 3    4    7    4

LIS on heights (tails array — patience sorting):
  Add 3: tails=[3]
  Add 4: tails=[3,4]
  Add 7: tails=[3,4,7]
  Add 4: bisect → replace 7: tails=[3,4,4]
Answer: len(tails) = 3
```

---

## Problem Description

You have envelopes `[wi, hi]`. Envelope A fits inside B if `wA < wB` AND `hA < hB`. Return the maximum number of envelopes you can nest (Russian doll style).

- Example 1: `envelopes = [[5,4],[6,4],[6,7],[2,3]]` → `3` (nest [2,3]→[5,4]→[6,7])
- Example 2: `envelopes = [[1,1],[1,1],[1,1]]` → `1`

Constraints: `1 <= envelopes.length <= 10^5`, `1 <= wi, hi <= 10^5`

---

## 📝 Interview Tips

1. **Clarify / Làm rõ**: "Cả width lẫn height phải strictly less than — không được bằng" / Both dims must be strictly smaller
2. **Why sort h DESC for equal w?** Nếu sort h ASC, hai phần tử cùng w có thể lọt vào LIS sai
3. **Brute force**: O(n²) DP — dp[i] = max envelopes ending at i after sort
4. **Optimal**: Sort + Patience sort (binary search LIS) → O(n log n)
5. **Binary search**: `bisect_left` — tìm vị trí đầu tiên >= h để replace trong `tails`
6. **Edge case**: Tất cả cùng width → chỉ chọn được 1 → h DESC đảm bảo LIS = 1

---

## Solutions

```typescript
/**
 * Solution 1: Sort + O(n²) DP
 * Time: O(n² + n log n) = O(n²)
 * Space: O(n)
 */
function maxEnvelopesDP(envelopes: number[][]): number {
  envelopes.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]));
  const n = envelopes.length;
  const dp = new Array(n).fill(1);

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (envelopes[j][0] < envelopes[i][0] && envelopes[j][1] < envelopes[i][1]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}

/**
 * Solution 2: Sort + Patience Sorting (Binary Search LIS) — Optimal
 * Time: O(n log n) — sort O(n log n) + LIS via binary search O(n log n)
 * Space: O(n) — tails array
 */
function maxEnvelopes(envelopes: number[][]): number {
  // Sort by width ASC; for equal width, sort height DESC
  // This ensures we can never pick two envelopes with same width in LIS
  envelopes.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]));

  // Now find LIS on heights only
  const tails: number[] = [];

  for (const [, h] of envelopes) {
    // Binary search: find leftmost position where tails[pos] >= h
    let lo = 0,
      hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = h; // extend or replace
  }

  return tails.length;
}

// === Test Cases ===
console.log(
  maxEnvelopes([
    [5, 4],
    [6, 4],
    [6, 7],
    [2, 3],
  ]),
); // 3
console.log(
  maxEnvelopes([
    [1, 1],
    [1, 1],
    [1, 1],
  ]),
); // 1
console.log(
  maxEnvelopes([
    [1, 2],
    [2, 3],
    [3, 4],
  ]),
); // 3
console.log(
  maxEnvelopes([
    [4, 5],
    [4, 6],
    [6, 7],
    [2, 3],
    [1, 1],
  ]),
); // 4
```

---

## 🔗 Related Problems

- [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence) — exact same O(n log n) technique, 1D version
- [Maximum Height by Stacking Cuboids](https://leetcode.com/problems/maximum-height-by-stacking-cuboids) — 3D version of same idea
- [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons) — sort + greedy on intervals
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — sort + greedy with same sort trick
- [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) — 2D DP with sorting
