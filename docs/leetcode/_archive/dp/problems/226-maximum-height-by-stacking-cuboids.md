---
layout: page
title: "Maximum Height by Stacking Cuboids"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/maximum-height-by-stacking-cuboids"
---

# Maximum Height by Stacking Cuboids / Maximum Height by Stacking Cuboids

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | [Longest String Chain](https://leetcode.com/problems/longest-string-chain)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xếp chồng hộp quà — mỗi hộp có thể xoay theo hướng nào cũng được, nhưng hộp trên phải vừa khít trong hộp dưới. Mẹo then chốt: sắp xếp các chiều của mỗi cuboid theo thứ tự tăng dần trước, rồi bài toán trở thành LIS (Longest Increasing Subsequence) 3 chiều.

**Visual — cuboids=[[50,45,20],[95,37,53],[45,23,12]]:**

```
Step 1: Sort each cuboid's dims → [l≤w≤h]:
  [50,45,20] → [20,45,50]
  [95,37,53] → [37,53,95]
  [45,23,12] → [12,23,45]

Step 2: Sort cuboids lexicographically:
  [12,23,45], [20,45,50], [37,53,95]

Step 3: LIS-style DP where cuboid A "fits into" cuboid B
  if A[0]<=B[0] && A[1]<=B[1] && A[2]<=B[2]
  Height contribution = top dim (index 2)

dp[0] = 45  (just [12,23,45])
dp[1] = 45+50=95? No: [12,23,45] fits in [20,45,50]? 12≤20,23≤45,45≤50 ✓
         dp[1] = 45 + 50 = 95
dp[2] = max(95, 45+95, 50+95) = 140
Answer = 190
```

---

## Problem Description

Given `n` cuboids where `cuboids[i] = [widthi, lengthi, heighti]`, you may **rotate** each cuboid any way. Stack cuboids such that each bottom cuboid's dimensions are all `>=` the top cuboid's dimensions. Return the **maximum height** of the stack. ([LeetCode](https://leetcode.com/problems/maximum-height-by-stacking-cuboids))

Difficulty: Hard | Acceptance: 60.1%

**Example 1:**

```
Input: cuboids = [[50,45,20],[95,37,53],[45,23,12]]
Output: 190
Explanation: Rotate all cuboids. Stack [12,23,45] on [20,45,50] on [37,53,95].
```

**Example 2:**

```
Input: cuboids = [[38,25,45],[76,35,3]]
Output: 76
Explanation: Can't stack, take tallest single.
```

Constraints:

- `n == cuboids.length`
- `1 <= n <= 100`
- `1 <= widthi, lengthi, heighti <= 500`

---

## 📝 Interview Tips

1. **Rotation key insight**: "Sắp xếp mỗi cuboid để l≤w≤h — chiều cao tối đa luôn là chiều lớn nhất" / Sort each cuboid's dims: optimal rotation always has max dim as height.
2. **Sort cuboids**: "Sau khi normalize, sắp xếp theo thứ tự lexicographic để LIS hoạt động" / Lexicographic sort enables forward DP without backward checking.
3. **DP = LIS variant**: "dp[i] = max height của stack kết thúc tại cuboid i" / LIS where 'length' = height, 'increasing' = all 3 dims.
4. **Transition**: "dp[i] = max(dp[j] + h[i]) với mọi j<i thỏa mãn cuboid[j] fits in cuboid[i]" / Standard LIS transition.
5. **Edge cases**: "Một cuboid → trả về chiều lớn nhất của nó" / Single cuboid: return max dimension.
6. **Proof of normalization**: "Nếu xếp chồng tối ưu tồn tại, tồn tại cách xếp với mọi cuboid đều normalize" / Mathematical proof: optimal always has sorted dims.

---

## Solutions

```typescript
/**
 * Solution 1: DP with O(n²) — sort + LIS-style
 * Time: O(n² + n log n) — sort + DP
 * Space: O(n) — dp array
 */
function maxHeight(cuboids: number[][]): number {
  // Step 1: Normalize — sort each cuboid's dimensions
  for (const c of cuboids) c.sort((a, b) => a - b);

  // Step 2: Sort cuboids lexicographically
  cuboids.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] !== b[1] ? a[1] - b[1] : a[2] - b[2]));

  const n = cuboids.length;
  // dp[i] = max stack height with cuboid i on top
  const dp = cuboids.map((c) => c[2]); // at minimum, just the cuboid itself

  let ans = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      // Check if cuboid j can go below cuboid i
      if (
        cuboids[j][0] <= cuboids[i][0] &&
        cuboids[j][1] <= cuboids[i][1] &&
        cuboids[j][2] <= cuboids[i][2]
      ) {
        dp[i] = Math.max(dp[i], dp[j] + cuboids[i][2]);
      }
    }
    ans = Math.max(ans, dp[i]);
  }

  return ans;
}

// === Test Cases ===
console.log(
  maxHeight([
    [50, 45, 20],
    [95, 37, 53],
    [45, 23, 12],
  ]),
); // 190
console.log(
  maxHeight([
    [38, 25, 45],
    [76, 35, 3],
  ]),
); // 76
console.log(
  maxHeight([
    [7, 11, 17],
    [7, 17, 11],
    [11, 7, 17],
    [11, 17, 7],
    [17, 7, 11],
    [17, 11, 7],
  ]),
); // 102
console.log(maxHeight([[1, 1, 1]])); // 1
```
