---
layout: page
title: "Target Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking]
leetcode_url: "https://leetcode.com/problems/target-sum"
---

# Target Sum / Tổng Mục Tiêu

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: DP (0/1 Knapsack Count) / Backtracking
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum) | [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống bài toán cân bằng — chia mảng thành 2 nhóm: nhóm P (dấu +) và nhóm N (dấu -). Ta cần P - N = target và P + N = totalSum. Suy ra P = (totalSum + target) / 2. Bài toán trở thành: **đếm số cách chọn tập con có tổng bằng P**.

**Pattern Recognition:**

- P + N = sum, P - N = target → P = (sum + target) / 2
- Nếu (sum + target) lẻ hoặc P < 0 → không có cách nào
- Dùng 0/1 knapsack để đếm số cách đạt tổng P

**Visual — DP Knapsack:**

```
nums = [1,1,1,1,1], target = 3
sum = 5, P = (5+3)/2 = 4

dp[j] = number of subsets summing to j
dp[0]=1 (empty subset)

After each num (all 1s):
dp: [1,0,0,0,0]
    [1,1,0,0,0]
    [1,2,1,0,0]
    [1,3,3,1,0]
    [1,4,6,4,1]
    [1,5,10,10,5] ← dp[4] = 5 ✓
```

---

## Problem Description

Given an integer array `nums` and an integer `target`, assign a `+` or `-` sign to each number, then calculate the total sum. Return the number of different expressions that evaluate to `target`. ([LeetCode #494](https://leetcode.com/problems/target-sum))

**Example 1:** `nums = [1,1,1,1,1], target = 3` → `5`
**Example 2:** `nums = [1], target = 1` → `1`

Constraints: `1 <= nums.length <= 20`, `0 <= nums[i] <= 1000`, `-1000 <= target <= 1000`

---

## 📝 Interview Tips

1. **Clarify**: "Mỗi phần tử đúng một lần, dấu + hoặc - / Each element used exactly once with + or -"
2. **Math insight**: "Biến đổi về bài toán subset sum count / Reduce to: count subsets summing to P"
3. **Check feasibility**: "(sum+target) phải chẵn và P ≥ 0, không thì trả về 0 / Validate parity before DP"
4. **Backtracking**: "Brute force O(2^n) — đơn giản và đúng, dùng cho n ≤ 20 / DFS also works for small n"
5. **DP optimization**: "Dùng 1D dp[j] duyệt ngược để tránh dùng phần tử 2 lần / 1D dp with reverse loop"
6. **Edge cases**: "target > sum hoặc target < -sum → 0, nums chứa 0 nhân đôi cách / nums with zeros double the count"

---

## Solutions

```typescript
/**
 * Solution 1: Backtracking (DFS)
 * Time: O(2^n) — try + and - for each element
 * Space: O(n) — recursion depth
 */
function findTargetSumWaysDFS(nums: number[], target: number): number {
  let count = 0;

  function dfs(idx: number, current: number): void {
    if (idx === nums.length) {
      if (current === target) count++;
      return;
    }
    dfs(idx + 1, current + nums[idx]);
    dfs(idx + 1, current - nums[idx]);
  }

  dfs(0, 0);
  return count;
}

/**
 * Solution 2: 0/1 Knapsack DP (Optimal)
 * Time: O(n * P) where P = (sum + target) / 2
 * Space: O(P) — 1D dp array
 *
 * Key math: assign + to subset P, - to rest.
 * P - (sum - P) = target → P = (sum + target) / 2
 * Count subsets with sum exactly P.
 */
function findTargetSumWays(nums: number[], target: number): number {
  const sum = nums.reduce((a, b) => a + b, 0);
  const need = sum + target;

  if (need < 0 || need % 2 !== 0) return 0;
  const P = need / 2;

  // dp[j] = number of subsets with sum j
  const dp = new Array(P + 1).fill(0);
  dp[0] = 1;

  for (const num of nums) {
    // Traverse backwards to avoid using same element twice
    for (let j = P; j >= num; j--) {
      dp[j] += dp[j - num];
    }
  }
  return dp[P];
}

// === Test Cases ===
console.log(findTargetSumWays([1, 1, 1, 1, 1], 3)); // 5
console.log(findTargetSumWays([1], 1)); // 1
console.log(findTargetSumWays([1], 2)); // 0
console.log(findTargetSumWays([0, 0, 0], 0)); // 8 (each 0 can be + or -)
```

---

## 🔗 Related Problems

| Problem                                                                                                    | Pattern            | Difficulty |
| ---------------------------------------------------------------------------------------------------------- | ------------------ | ---------- |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)                     | 0/1 Knapsack       | Medium     |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)                                 | 0/1 Knapsack       | Medium     |
| [Count of Subset Sum](https://leetcode.com/problems/combination-sum-iv)                                    | Unbounded Knapsack | Medium     |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                               | Backtracking       | Medium     |
| [Find Minimum Time to Finish All Jobs](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs) | Bitmask DP         | Hard       |
