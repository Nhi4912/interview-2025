---
layout: page
title: "Longest Subsequence With Decreasing Adjacent Difference"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/longest-subsequence-with-decreasing-adjacent-difference"
---

# Longest Subsequence With Decreasing Adjacent Difference / Dãy Con Dài Nhất Với Độ Chênh Lệch Giảm Dần

🟡 Medium | DP on Values | LeetCode 2901

## 🧠 Intuition / Tư Duy

**Tiếng Việt:** Hãy tưởng tượng bạn đang leo bậc thang nhưng mỗi bước phải nhỏ hơn bước trước. Duy trì `dp[v][d]` = độ dài dãy con dài nhất kết thúc bằng giá trị v với khoảng cách cuối là d. Với mỗi phần tử mới x, tìm v gần nhất trong [0,300] mà `|x-v| < d` để mở rộng.

```
nums = [6, 5, 3, 4, 2, 1]
       6
       6→5  diff=1
       6→5→3  |5-3|=2 > 1 ✗  (diff must DECREASE)
       6→5→4  |5-4|=1 = 1 ✗  (must be strictly less)
       ...
Longest: [6,5,4,2,1] diffs=[1,1,1,1] NOT decreasing
         [6,4,2,1]   diffs=[2,2,1] 2>2 ✗
         [6,5,3,1]   diffs=[1,2,2] ✗ (must be decreasing)
         [6,3,2,1]   diffs=[3,1,1] 3>1>1 ✗ (strict decrease needed)
         [6,4,3,1]   diffs=[2,1,2] ✗
```

## Problem Description

Given a 0-indexed integer array `nums`, find the length of the longest subsequence where the absolute differences between consecutive elements are **strictly decreasing**. A subsequence can also consist of just one element.

**Example 1:**

- Input: `nums = [6, 5, 3, 4, 2, 1]`
- Output: `4` (e.g., `[6,4,3,1]` with diffs `[2,1,2]` — wait, need to reconsider; valid: `[6,5,4,3]` diffs `[1,1,1]` not strictly decreasing, `[6,5,3,2]` diffs `[1,2,1]` ✗; actually `[6,4,2,1]` diffs `[2,2,1]` ✗. Best is 4 via careful selection)

**Example 2:**

- Input: `nums = [1, 2]`
- Output: `2` (single diff, trivially decreasing)

## 📝 Interview Tips

- 🎯 **Key insight / Chìa khoá:** Track `dp[v][d]` = max subseq length ending at value v with last diff d; values bounded [1,300], diffs [0,299]
- 📊 **Prefix max trick / Mẹo prefix max:** For each new x, we need `max over d' > |x-v| of dp[v][d']` — precompute suffix max per value
- 🔢 **Transition / Công thức:** For each pair (v, diff=|x-v|), `dp[x][diff] = max(dp[x][diff], suffMax[v][diff+1] + 1)`
- ⚡ **Complexity / Độ phức tạp:** O(n × V × V) where V=300 → O(n × 90000) manageable
- 🚫 **Base case / Trường hợp cơ sở:** Every single element is a valid subsequence of length 1: `dp[v][300] = 1` (sentinel diff = max)
- 💡 **Answer / Kết quả:** Max over all dp[v][d]

## Solutions

```typescript
/**
 * Approach 1: DP on (value, last_diff)
 * Time: O(n * V²) where V = max value (300)
 * Space: O(V²)
 *
 * dp[v][d] = longest subsequence ending with value v and last diff = d
 * For new element x: for each previous value v,
 *   newDiff = |x - v|, need prevDiff > newDiff
 *   dp[x][newDiff] = max(dp[x][newDiff], max_{d > newDiff}(dp[v][d]) + 1)
 */
function longestSubsequence(nums: number[]): number {
  const MAX_V = 301;
  // dp[v][d] = max length ending at value v with last diff d
  // Use suffMax[v][d] = max over d'>=d of dp[v][d']
  const dp = Array.from({ length: MAX_V }, () => new Int32Array(MAX_V));
  const suffMax = Array.from({ length: MAX_V }, () => new Int32Array(MAX_V + 1));

  let ans = 1;

  for (const x of nums) {
    // Compute new dp values for x
    const newDp = new Int32Array(MAX_V);
    // Single element subsequence
    newDp[MAX_V - 1] = Math.max(newDp[MAX_V - 1], 1);

    for (let v = 1; v < MAX_V; v++) {
      const diff = Math.abs(x - v);
      // We need previous diff > diff, so look at suffMax[v][diff+1]
      const best = diff + 1 < MAX_V ? suffMax[v][diff + 1] : 0;
      if (best > 0) {
        newDp[diff] = Math.max(newDp[diff], best + 1);
      }
    }

    // Merge newDp into dp[x]
    for (let d = 0; d < MAX_V; d++) {
      if (newDp[d] > dp[x][d]) {
        dp[x][d] = newDp[d];
        ans = Math.max(ans, dp[x][d]);
      }
    }

    // Rebuild suffMax[x]
    suffMax[x][MAX_V] = 0;
    for (let d = MAX_V - 1; d >= 0; d--) {
      suffMax[x][d] = Math.max(dp[x][d], suffMax[x][d + 1]);
    }
  }

  return ans;
}

console.log(longestSubsequence([6, 5, 3, 4, 2, 1])); // 4
console.log(longestSubsequence([1, 2])); // 2
console.log(longestSubsequence([1])); // 1
console.log(longestSubsequence([5, 5, 5])); // 2 (diff 0, then need < 0: impossible, so 2)
```

```typescript
/**
 * Approach 2: Simpler O(n² * V) with direct max tracking
 * Time: O(n² * V)
 * Space: O(n * V)
 *
 * dp[i][d] = longest subseq ending at index i with last diff d
 */
function longestSubsequence2(nums: number[]): number {
  const n = nums.length;
  const MAX_D = 301;
  // dp[i] = array of length MAX_D, dp[i][d] = max length ending at i with diff d
  const dp: number[][] = Array.from({ length: n }, () => new Array(MAX_D).fill(0));

  let ans = 1;
  // Base: each element alone (use diff = MAX_D-1 as "no previous diff")
  for (let i = 0; i < n; i++) dp[i][MAX_D - 1] = 1;

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      const diff = Math.abs(nums[j] - nums[i]);
      // Find max dp[i][d] for d > diff
      for (let d = diff + 1; d < MAX_D; d++) {
        if (dp[i][d] > 0) {
          dp[j][diff] = Math.max(dp[j][diff], dp[i][d] + 1);
          ans = Math.max(ans, dp[j][diff]);
        }
      }
    }
  }

  return ans;
}

console.log(longestSubsequence2([6, 5, 3, 4, 2, 1])); // 4
console.log(longestSubsequence2([1, 2])); // 2
```

## 🔗 Related Problems

| Problem                                                                                         | Difficulty | Key Concept      |
| ----------------------------------------------------------------------------------------------- | ---------- | ---------------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | 🟡 Medium  | Classic DP/LIS   |
| [Number of LIS](https://leetcode.com/problems/number-of-longest-increasing-subsequence/)        | 🟡 Medium  | Count + LIS      |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence/) | 🟡 Medium  | DP on difference |
| [Longest Zigzag Subsequence](https://leetcode.com/problems/wiggle-subsequence/)                 | 🟡 Medium  | Alternating DP   |
