---
layout: page
title: "Minimum Cost to Cut a Stick"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick"
---

# Minimum Cost to Cut a Stick / Chi Phí Tối Thiểu Để Cắt Que

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Interval DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Như cắt dây thừng — mỗi lần cắt tốn chi phí bằng độ dài đoạn đang cầm. Bạn muốn cắt theo thứ tự tối ưu, giống như Matrix Chain Multiplication.

**Pattern Recognition:**

- Signal: "cost depends on current length, multiple cuts to make" → Interval DP
- Add endpoints 0 and n to cuts array, then dp[i][j] = min cost to make all cuts between c[i] and c[j]
- Subproblem: `dp[i][j] = min over mid: dp[i][mid] + dp[mid][j] + c[j] - c[i]`

**Visual:**

```
n=7, cuts=[1,3,4,5]  →  c=[0,1,3,4,5,7]
dp[0][5]: try each cut position as last cut
  mid=1: dp[0][1]+dp[1][5]+(7-0) = 0 + dp[1][5] + 7
  mid=2: dp[0][2]+dp[2][5]+(7-0) = dp[0][2]+dp[2][5]+7
  ...choose minimum
```

## Problem Description

Given a stick of length `n` and array `cuts`. Make all cuts; cost of each cut = current stick length. Return minimum total cost.

- Example 1: `n = 7`, `cuts = [1,3,4,5]` → `16`
- Example 2: `n = 9`, `cuts = [5,6,1,4,2]` → `22`
- Constraints: `2 ≤ n ≤ 10^6`, `1 ≤ cuts.length ≤ min(n-1, 100)`

## 📝 Interview Tips

1. **Clarify**: Cuts là vị trí trên que, không phải index / cuts are positions on stick, not indices
2. **Approach**: Interval DP — thêm 0 và n vào mảng cuts rồi sort / add endpoints and sort first
3. **Edge cases**: Single cut → cost = n; cuts at endpoints → not valid
4. **Optimize**: Bottom-up DP by interval length; O(m³) where m = cuts.length + 2
5. **Test**: n=7, cuts=[1,3,4,5] → 16; verify by tracing one order
6. **Follow-up**: What if we must make cuts in left-to-right order?

## Solutions

```typescript
/** Solution 1: Bottom-up Interval DP
 * Time: O(m^3) | Space: O(m^2)  where m = cuts.length + 2
 */
function minCost(n: number, cuts: number[]): number {
  cuts.sort((a, b) => a - b);
  const c = [0, ...cuts, n];
  const m = c.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array(m).fill(0));

  // len = gap between endpoints (minimum 2 means there's 1 cut point between)
  for (let len = 2; len < m; len++) {
    for (let i = 0; i + len < m; i++) {
      const j = i + len;
      dp[i][j] = Infinity;
      for (let mid = i + 1; mid < j; mid++) {
        const cost = dp[i][mid] + dp[mid][j] + c[j] - c[i];
        if (cost < dp[i][j]) dp[i][j] = cost;
      }
    }
  }

  return dp[0][m - 1];
}

/** Solution 2: Memoized Top-down Interval DP
 * Time: O(m^3) | Space: O(m^2)
 */
function minCost2(n: number, cuts: number[]): number {
  cuts.sort((a, b) => a - b);
  const c = [0, ...cuts, n];
  const m = c.length;
  const memo: number[][] = Array.from({ length: m }, () => new Array(m).fill(-1));

  function dp(i: number, j: number): number {
    if (j - i <= 1) return 0; // no cut points between i and j
    if (memo[i][j] !== -1) return memo[i][j];

    let res = Infinity;
    for (let mid = i + 1; mid < j; mid++) {
      const cost = dp(i, mid) + dp(mid, j) + c[j] - c[i];
      if (cost < res) res = cost;
    }

    memo[i][j] = res;
    return res;
  }

  return dp(0, m - 1);
}

// Tests
console.log(minCost(7, [1, 3, 4, 5])); // 16
console.log(minCost(9, [5, 6, 1, 4, 2])); // 22
console.log(minCost(10, [2, 4, 7])); // 20
console.log(minCost2(7, [1, 3, 4, 5])); // 16
console.log(minCost2(9, [5, 6, 1, 4, 2])); // 22
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship             |
| -------------------------------------------------------------------------------------------------- | ------------------------ |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons)                                     | Same interval DP pattern |
| [Strange Printer](https://leetcode.com/problems/strange-printer)                                   | Interval DP variant      |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling) | Sorting + DP             |
