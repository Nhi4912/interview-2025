---
layout: page
title: "Find Minimum Time to Finish All Jobs"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Backtracking, Bit Manipulation, Bitmask]
leetcode_url: "https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs"
---

# Find Minimum Time to Finish All Jobs / Tìm Thời Gian Tối Thiểu Để Hoàn Thành Tất Cả Công Việc

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Bitmask DP
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) | [Fair Distribution of Cookies](https://leetcode.com/problems/fair-distribution-of-cookies)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Phân công công việc cho k nhân viên — bạn muốn người làm nhiều nhất phải làm ít nhất. Với n công việc nhỏ (n ≤ 12), dùng **bitmask DP**: mỗi tập con công việc là một trạng thái, tính tổng thời gian tối ưu khi phân cho i nhân viên.

**Pattern Recognition:**

- n ≤ 12 → Bitmask DP khả thi: 2^12 = 4096 states
- `subsetSum[mask]` = tổng thời gian của tập công việc `mask`
- `dp[k][mask]` = makespan nhỏ nhất khi k nhân viên làm tập `mask`
- Transition: thử tất cả subset của mask làm phần công việc cho nhân viên thứ k

**Visual — Bitmask DP:**

```
jobs = [3,2,3], k = 3
subsetSum: 000=0, 001=3, 010=2, 011=5, 100=3, 101=6, 110=5, 111=8

dp[1][mask] = subsetSum[mask]  (1 worker takes all)
dp[2][111] = min over all submasks sub of 111:
  max(subsetSum[sub], dp[1][111^sub])
  → sub=011: max(5,3)=5, sub=101: max(6,2)=6, sub=110: max(5,3)=5 ...
dp[3][111] = min = 3 ✓
```

---

## Problem Description

Given a list of `n` jobs with integer times and `k` identical workers, assign all jobs such that the maximum work time among all workers is minimized. Return this minimum maximum. ([LeetCode #1723](https://leetcode.com/problems/find-minimum-time-to-finish-all-jobs))

**Example 1:** `jobs = [3,2,3], k = 3` → `3` (one job per worker)
**Example 2:** `jobs = [1,2,4,7,8], k = 2` → `11` (worker1: 8+2+1=11, worker2: 7+4=11)

Constraints: `1 <= k <= jobs.length <= 12`, `1 <= jobs[i] <= 10^7`

---

## 📝 Interview Tips

1. **Clarify**: "n ≤ 12 là hint mạnh cho Bitmask DP / Small n is a strong signal for bitmask DP"
2. **Precompute**: "Tính subsetSum[] trước để dùng O(1) trong DP / Precompute all subset sums"
3. **DP order**: "dp[i][mask] dựa trên dp[i-1][...] — tính từng worker / Process one worker at a time"
4. **Submask enum**: "Duyệt submask của mask: for(sub=mask; sub>0; sub=(sub-1)&mask) / Standard submask iteration"
5. **Optimization**: "Sort jobs giảm dần + prune: nếu dp >= ans hiện tại thì bỏ qua / Pruning speeds up backtracking"
6. **Backtracking alt**: "Backtracking với pruning cũng pass n≤12, sort desc + skip duplicate sums / Both approaches work"

---

## Solutions

```typescript
/**
 * Solution 1: Bitmask DP
 * Time: O(k * 3^n) — submask enumeration per worker
 * Space: O(k * 2^n) — dp table
 */
function minimumTimeRequired(jobs: number[], k: number): number {
  const n = jobs.length;
  const total = 1 << n;

  // Precompute sum for each subset of jobs
  const subsetSum = new Array(total).fill(0);
  for (let mask = 1; mask < total; mask++) {
    const lowest = mask & -mask;
    const bit = Math.log2(lowest);
    subsetSum[mask] = subsetSum[mask ^ lowest] + jobs[bit];
  }

  // dp[i][mask] = min makespan using i workers for job subset mask
  const INF = Number.MAX_SAFE_INTEGER;
  const dp: number[][] = Array.from({ length: k + 1 }, () => new Array(total).fill(INF));
  for (let mask = 0; mask < total; mask++) dp[1][mask] = subsetSum[mask];

  for (let i = 2; i <= k; i++) {
    for (let mask = 0; mask < total; mask++) {
      // Enumerate all non-empty subsets of mask for current worker
      for (let sub = mask; sub > 0; sub = (sub - 1) & mask) {
        if (dp[i - 1][mask ^ sub] < INF) {
          dp[i][mask] = Math.min(dp[i][mask], Math.max(subsetSum[sub], dp[i - 1][mask ^ sub]));
        }
      }
    }
  }
  return dp[k][total - 1];
}

/**
 * Solution 2: Binary Search + Backtracking
 * Time: O(n log(sum) * k^n) with pruning typically much faster
 * Space: O(k + n) — worker load array + recursion stack
 */
function minimumTimeRequiredBS(jobs: number[], k: number): number {
  jobs.sort((a, b) => b - a); // sort descending for better pruning
  const workers = new Array(k).fill(0);
  let ans = jobs.reduce((s, v) => s + v, 0);

  function dfs(idx: number): void {
    if (idx === jobs.length) {
      ans = Math.min(ans, Math.max(...workers));
      return;
    }
    const seen = new Set<number>();
    for (let i = 0; i < k; i++) {
      if (workers[i] + jobs[idx] >= ans) continue; // prune
      if (seen.has(workers[i])) continue; // skip duplicate states
      seen.add(workers[i]);
      workers[i] += jobs[idx];
      dfs(idx + 1);
      workers[i] -= jobs[idx];
    }
  }

  dfs(0);
  return ans;
}

// === Test Cases ===
console.log(minimumTimeRequired([3, 2, 3], 3)); // 3
console.log(minimumTimeRequired([1, 2, 4, 7, 8], 2)); // 11
console.log(minimumTimeRequired([5, 5, 4, 4, 4], 2)); // 12
```

---

## 🔗 Related Problems

| Problem                                                                                            | Pattern                | Difficulty |
| -------------------------------------------------------------------------------------------------- | ---------------------- | ---------- |
| [Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets) | Backtracking / Bitmask | Medium     |
| [Fair Distribution of Cookies](https://leetcode.com/problems/fair-distribution-of-cookies)         | Backtracking / Bitmask | Medium     |
| [Beautiful Arrangement](https://leetcode.com/problems/beautiful-arrangement)                       | Bitmask DP             | Medium     |
| [Shopping Offers](https://leetcode.com/problems/shopping-offers)                                   | Backtracking           | Medium     |
