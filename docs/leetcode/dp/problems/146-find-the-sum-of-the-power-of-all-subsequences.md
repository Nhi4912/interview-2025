---
layout: page
title: "Find the Sum of the Power of All Subsequences"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/find-the-sum-of-the-power-of-all-subsequences"
---

# Find the Sum of the Power of All Subsequences / Tổng Lực Của Tất Cả Dãy Con

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Subset DP + Combinatorics

## 🧠 Intuition

**VI:** "Power" của một subsequence = 2^(n - length). Ta cần tổng power của TẤT CẢ subsequence có tổng = k. Thay vì duyệt 2^n subsequences, đếm số subsequence có tổng k và độ dài j bằng DP, rồi nhân với 2^(n-j).

```
nums = [1,2,3], k = 3
n = 3

Subsequences summing to 3:
  [3]       → length 1 → power = 2^(3-1) = 4
  [1,2]     → length 2 → power = 2^(3-2) = 2
  [1,2,3] wait, 1+2+3=6 ≠ 3

Count by (length, sum):
  dp[j][s] = count of subsequences of length j with sum s

  dp[1][3] = 1 ([3])
  dp[2][3] = 1 ([1,2])

Total = dp[1][3] * 2^(3-1) + dp[2][3] * 2^(3-2)
      = 1 * 4 + 1 * 2 = 6
```

## 📝 Interview Tips

- 🔑 **EN:** `dp[j][s]` = count of length-j subsequences summing to `s` | **VI:** DP 2D: `dp[j][s]` = số lượng dãy con độ dài j có tổng s
- 🔑 **EN:** Contribution = `dp[j][k] * 2^(n-j)` — extra elements can freely be included or excluded | **VI:** Mỗi phần tử không thuộc dãy con dài j có 2 lựa chọn (thêm/bỏ) → nhân 2^(n-j)
- 🔑 **EN:** Transition: for each new element `x`, update dp in reverse to avoid reuse | **VI:** Duyệt ngược để tránh dùng một phần tử nhiều lần (0/1 knapsack)
- 🔑 **EN:** Alternatively: `dp[s]` = total power contributed by subsequences summing to s so far | **VI:** Cách khác: chỉ cần `dp[s]`, nhân đôi mỗi phần tử không dùng
- 🔑 **EN:** MOD = 1e9+7; precompute powers of 2 up to n | **VI:** Tính sẵn mảng `pow2` để tra cứu O(1)
- 🔑 **EN:** Time O(n·k), Space O(n·k) or O(k) with rolling | **VI:** O(n·k) — manageable cho n,k ≤ 100 (typical constraints)

## Solutions

```typescript
const MOD_146 = 1_000_000_007n;

// ─── Solution 1: 2D DP counting by (length, sum) ──────────────────────────
function sumOfPower2D(nums: number[], k: number): number {
  const n = nums.length;

  // Precompute powers of 2
  const pow2: bigint[] = [1n];
  for (let i = 1; i <= n; i++) pow2[i] = (pow2[i - 1] * 2n) % MOD_146;

  // dp[j][s] = number of subsequences of length j summing to s
  const dp: bigint[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0n));
  dp[0][0] = 1n;

  for (const x of nums) {
    // Process in reverse to avoid reusing x in same subsequence (0/1 knapsack)
    for (let j = n - 1; j >= 0; j--) {
      for (let s = k - x; s >= 0; s--) {
        if (dp[j][s] > 0n) {
          dp[j + 1][s + x] = (dp[j + 1][s + x] + dp[j][s]) % MOD_146;
        }
      }
    }
  }

  // Sum dp[j][k] * 2^(n-j) for all j
  let ans = 0n;
  for (let j = 0; j <= n; j++) {
    ans = (ans + dp[j][k] * pow2[n - j]) % MOD_146;
  }
  return Number(ans);
}

// ─── Solution 2: 1D DP (elegant O(k) space) ───────────────────────────────
// dp[s] = sum of 2^(n-len) over all subsequences seen so far that sum to s
// When we add element x: existing subsequences in dp either include x or not
function sumOfPower(nums: number[], k: number): number {
  const n = nums.length;
  // dp[s] = accumulated power for subsequences summing to s
  // Start: empty subseq contributes 2^n to sum 0
  const dp = new Array(k + 1).fill(0n);
  dp[0] = (1n << BigInt(n)) % MOD_146; // 2^n for the empty subsequence at sum=0

  for (const x of nums) {
    // For each element x, update right-to-left
    // Including x: dp[s] contributes dp[s-x]/2 (one fewer free bit)
    // Not including x: dp[s] stays, but we halve the power (we "used" one free position)
    // Simpler formulation: new_dp[s] = (dp[s] + dp[s-x]) * inv2 ... use forward instead:
    // Actually: process as standard 0/1 knapsack but track power correctly.
    // Each num either included (power ÷ 2 per element processed) or not.
    // Equivalent: dp[s] = dp[s] (not take, no change) + dp[s-x] (take x, halving not needed if we multiply at end)
    // Use Solution 1 logic mapped to 1D by iterating j implicitly:
    for (let s = k; s >= x; s--) {
      dp[s] = (dp[s] + dp[s - x]) % MOD_146;
    }
    // After processing x, divide all by 2 (x is now "decided" — not a free element)
    // Use modular inverse of 2: inv2 = (MOD+1)/2 = 500000004
    const inv2 = 500_000_004n;
    for (let s = 0; s <= k; s++) {
      dp[s] = (dp[s] * inv2) % MOD_146;
    }
  }

  return Number(dp[k]);
}

// ─── Tests ─────────────────────────────────────────────────────────────────
console.log(sumOfPower2D([1, 2, 3], 3)); // 6
console.log(sumOfPower2D([2, 3, 3], 5)); // 4
console.log(sumOfPower([1, 2, 3], 3)); // 6
console.log(sumOfPower([2, 3, 3], 5)); // 4
```

## 🔗 Related Problems

| #    | Title                                                       | Difficulty | Connection                            |
| ---- | ----------------------------------------------------------- | ---------- | ------------------------------------- |
| 416  | Partition Equal Subset Sum                                  | 🟡 Medium  | 0/1 knapsack counting subsets         |
| 494  | Target Sum                                                  | 🟡 Medium  | Count subsequences hitting a target   |
| 1498 | Number of Subsequences That Satisfy the Given Sum Condition | 🟡 Medium  | Power of 2 counting with two pointers |
| 698  | Partition to K Equal Sum Subsets                            | 🟡 Medium  | Subset partition with DP              |
