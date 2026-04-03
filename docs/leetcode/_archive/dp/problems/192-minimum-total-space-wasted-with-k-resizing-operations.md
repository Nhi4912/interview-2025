---
layout: page
title: "Minimum Total Space Wasted With K Resizing Operations"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/minimum-total-space-wasted-with-k-resizing-operations"
---

# Minimum Total Space Wasted With K Resizing Operations / Tổng Không Gian Lãng Phí Tối Thiểu Với K Lần Thay Đổi Kích Thước

🟡 Medium | 2D DP on Partitions | LeetCode 1959

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Bạn có mảng nums[] đại diện kích thước file. Khi lưu trữ file i-j vào một partition, bạn phải cấp phát `max(nums[i..j]) × (j-i+1)` byte. Lãng phí = max × length - sum. Dùng k+1 partitions (k lần resize). `dp[i][j]` = lãng phí tối thiểu cho j phần tử đầu với i lần resize.

```
nums = [10,20], k=0 (1 partition)
max=20, length=2, sum=30 → waste = 40-30 = 10

nums = [10,20], k=1 (2 partitions)
[10],[20] → waste = 0+0 = 0

dp[0][j] = waste for first j elements with 0 resizes (single partition)
dp[i][j] = min over split point m: dp[i-1][m] + waste(m+1..j)
```

## Problem Description

Given array `nums` (sizes of files) and integer `k`, you can resize storage at most `k` times. In each continuous block, you allocate `max(block) × |block|` space. Wasted space = allocated - actual. Minimize total wasted space.

**Example 1:**

- Input: `nums = [10,20]`, `k = 0`
- Output: `10` — Single block: max=20, waste = 20\*2 - 30 = 10

**Example 2:**

- Input: `nums = [10,20,30]`, `k = 1`
- Output: `10` — Split as [10,20],[30]: waste = (20*2-30) + 0 = 10; or [10],[20,30]: waste = 0+(30*2-50)=10

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** Partition nums into at most k+1 groups; minimize total waste = Σ(max_i × len_i - sum_i)
- 📊 **DP state / Trạng thái DP:** `dp[j][r]` = min waste for first j elements using r resizes; transition tries all split points
- 🔢 **Precompute segment waste / Tính trước lãng phí:** For each (i,j), precompute `waste[i][j] = max(i..j) * (j-i+1) - sum(i..j)` in O(n²)
- ⚡ **Complexity / Độ phức tạp:** O(n² × k) — n² segment costs × k layers
- 🚫 **Edge case / Trường hợp đặc biệt:** k ≥ n-1 means each element in own block → zero waste
- 💡 **Optimize / Tối ưu:** Use rolling array; compute segment waste on-the-fly during DP

## Solutions

```typescript
/**
 * Approach 1: 2D DP with precomputed segment waste
 * Time: O(n² * k)
 * Space: O(n² + n*k)
 */
function minSpaceWastedKResizing(nums: number[], k: number): number {
  const n = nums.length;

  // Precompute waste[i][j] = waste if block is nums[i..j]
  const waste: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    let mx = nums[i],
      sm = nums[i];
    waste[i][i] = 0;
    for (let j = i + 1; j < n; j++) {
      mx = Math.max(mx, nums[j]);
      sm += nums[j];
      waste[i][j] = mx * (j - i + 1) - sm;
    }
  }

  // dp[r][j] = min waste for nums[0..j-1] using exactly r resizes (r+1 blocks)
  const INF = Infinity;
  // dp[j] = min waste for first j elements with current number of resizes
  let dp = new Array(n + 1).fill(INF);
  dp[0] = 0;
  for (let j = 1; j <= n; j++) {
    dp[j] = waste[0][j - 1]; // 0 resizes: single block
  }

  for (let r = 1; r <= k; r++) {
    const ndp = new Array(n + 1).fill(INF);
    ndp[0] = 0;
    for (let j = 1; j <= n; j++) {
      // Last block starts at m+1 (0-indexed: m..j-1)
      for (let m = 0; m < j; m++) {
        if (dp[m] === INF) continue;
        const w = waste[m][j - 1];
        if (dp[m] + w < ndp[j]) ndp[j] = dp[m] + w;
      }
    }
    dp = ndp;
  }

  return dp[n];
}

console.log(minSpaceWastedKResizing([10, 20], 0)); // 10
console.log(minSpaceWastedKResizing([10, 20, 30], 1)); // 10
console.log(minSpaceWastedKResizing([1, 2, 3, 4, 5], 2)); // 0? no, let's see
console.log(minSpaceWastedKResizing([10, 10, 10, 10, 10], 1)); // 0
```

```typescript
/**
 * Approach 2: Space-optimized DP iterating splits on-the-fly
 * Time: O(n² * k)
 * Space: O(n * k) — can reduce to O(n) with rolling arrays
 */
function minSpaceWastedKResizing2(nums: number[], k: number): number {
  const n = nums.length;
  const INF = 1e18;
  const K = k + 1; // number of partitions = k+1

  // dp[i][j] = min waste for first j elements with i partitions
  const dp: number[][] = Array.from({ length: K + 1 }, () => new Array(n + 1).fill(INF));
  dp[0][0] = 0;

  for (let parts = 1; parts <= K; parts++) {
    for (let j = parts; j <= n; j++) {
      let mx = 0,
        sm = 0;
      // Try all possible last block [m..j-1]
      for (let m = j - 1; m >= parts - 1; m--) {
        mx = Math.max(mx, nums[m]);
        sm += nums[m];
        const w = mx * (j - m) - sm;
        if (dp[parts - 1][m] !== INF) {
          dp[parts][j] = Math.min(dp[parts][j], dp[parts - 1][m] + w);
        }
      }
    }
  }

  let ans = INF;
  for (let parts = 1; parts <= K; parts++) {
    ans = Math.min(ans, dp[parts][n]);
  }
  return ans;
}

console.log(minSpaceWastedKResizing2([10, 20], 0)); // 10
console.log(minSpaceWastedKResizing2([10, 20, 30], 1)); // 10
```

## 🔗 Related Problems

| Problem                                                                                   | Difficulty | Key Concept        |
| ----------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Strange Printer](https://leetcode.com/problems/strange-printer/)                         | 🔴 Hard    | Interval DP        |
| [Minimum Cost to Cut a Stick](https://leetcode.com/problems/minimum-cost-to-cut-a-stick/) | 🔴 Hard    | Interval DP        |
| [Burst Balloons](https://leetcode.com/problems/burst-balloons/)                           | 🔴 Hard    | Interval DP        |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)         | 🔴 Hard    | Binary Search + DP |
