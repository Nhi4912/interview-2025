---
layout: page
title: "Paint House"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/paint-house"
---

# Paint House / Sơn Nhà

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Linear DP (State Machine)
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies
> **See also**: [House Robber](https://leetcode.com/problems/house-robber) | [Paint House II](https://leetcode.com/problems/paint-house-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như chọn trang phục mỗi ngày — hôm nay không được mặc màu giống hôm qua. Với mỗi ngôi nhà, chi phí tối thiểu phụ thuộc vào màu nhà kế trước.

**Pattern Recognition:**

- Signal: "min cost" + "adjacent constraint" + "fixed choices per step" → **State Machine DP**
- `dp[i][c]` = chi phí tối thiểu sơn nhà 0..i với nhà i màu c
- Key insight: `dp[i][c] = costs[i][c] + min(dp[i-1][c'])` với c' ≠ c

**Visual — costs=[[17,2,17],[16,16,5],[14,3,19]]:**

```
House 0:  R=17   G=2    B=17   (base case)
House 1:  R=16+min(2,17)=18
          G=16+min(17,17)=33
          B= 5+min(17,2) = 7
House 2:  R=14+min(33,7) =21
          G= 3+min(18,7) =10
          B=19+min(18,33)=37
Answer: min(21, 10, 37) = 10 ✓
```

---

## Problem Description

There are `n` houses in a row, each painted with one of 3 colors (Red, Green, Blue). Adjacent houses must have different colors. Given `costs[i][j]` = cost to paint house `i` with color `j`, return the minimum total painting cost. ([LeetCode 256](https://leetcode.com/problems/paint-house))

- Example 1: `costs=[[17,2,17],[16,16,5],[14,3,19]]` → `10`
- Example 2: `costs=[[7,6,2]]` → `2`

Constraints: `1 ≤ n ≤ 100`, `1 ≤ costs[i][j] ≤ 20`

---

## 📝 Interview Tips

1. **Clarify**: "Luôn có 3 màu? Có thể extend sang k màu?" / Always 3 colors? Can generalize to k
2. **Brute force**: "Thử mọi combination — O(3^n)" / All color combinations exponential
3. **State**: "`dp[i][c]` = min cost ending house i with color c" / Track cost per color per house
4. **Transition**: "Nhà i màu c → phải chọn màu khác c cho nhà i-1" / 2 choices from previous house
5. **Space opt**: "Chỉ cần dp[c] của bước trước — dùng 2 mảng size-3 hoặc 6 biến" / O(1) space possible
6. **Extension**: "Paint House II (k colors): dùng min1/min2 để O(n*k) thay vì O(n*k²)" / Know the k-color variant

---

## Solutions

```typescript
/**
 * Solution 1: Bottom-Up DP (2D)
 * Time: O(n)  — n houses, 3 colors = constant factor
 * Space: O(n) — store all dp rows
 */
function minCostDP(costs: number[][]): number {
  const n = costs.length;
  if (n === 0) return 0;

  const dp: number[][] = Array.from({ length: n }, () => [0, 0, 0]);
  dp[0] = [...costs[0]];

  for (let i = 1; i < n; i++) {
    dp[i][0] = costs[i][0] + Math.min(dp[i - 1][1], dp[i - 1][2]);
    dp[i][1] = costs[i][1] + Math.min(dp[i - 1][0], dp[i - 1][2]);
    dp[i][2] = costs[i][2] + Math.min(dp[i - 1][0], dp[i - 1][1]);
  }

  return Math.min(...dp[n - 1]);
}

/**
 * Solution 2: Space-Optimized DP (rolling variables)
 * Time: O(n)
 * Space: O(1)
 */
function minCost(costs: number[][]): number {
  if (costs.length === 0) return 0;

  let [r, g, b] = costs[0]; // previous house costs

  for (let i = 1; i < costs.length; i++) {
    const [cr, cg, cb] = costs[i];
    const nr = cr + Math.min(g, b);
    const ng = cg + Math.min(r, b);
    const nb = cb + Math.min(r, g);
    [r, g, b] = [nr, ng, nb];
  }

  return Math.min(r, g, b);
}

// === Test Cases ===
console.log(
  minCost([
    [17, 2, 17],
    [16, 16, 5],
    [14, 3, 19],
  ]),
); // 10
console.log(minCost([[7, 6, 2]])); // 2
console.log(minCost([[1, 1, 1]])); // 1
console.log(
  minCost([
    [1, 2, 3],
    [3, 2, 1],
  ]),
); // 2
```

---

## 🔗 Related Problems

- [Paint House II](https://leetcode.com/problems/paint-house-ii) — k màu, O(n\*k) với min1/min2 trick
- [House Robber](https://leetcode.com/problems/house-robber) — adjacent constraint DP
- [Paint Fence](https://leetcode.com/problems/paint-fence) — k colors, adjacency rule
- [Non-Adjacent Sum](https://leetcode.com/problems/house-robber) — cùng pattern không chọn liền kề
- [Student Attendance Record II](https://leetcode.com/problems/student-attendance-record-ii) — state machine DP
