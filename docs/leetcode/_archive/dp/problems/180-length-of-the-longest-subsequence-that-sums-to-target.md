---
layout: page
title: "Length of the Longest Subsequence That Sums to Target"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/length-of-the-longest-subsequence-that-sums-to-target"
---

# Length of the Longest Subsequence That Sums to Target / Độ Dài Dãy Con Dài Nhất Có Tổng Bằng Target

---

## 🧠 Intuition / Tư Duy

**Analogy:** **EN:** Classic **0/1 knapsack** variant: instead of maximizing value, maximize the count of elements used. `dp[t]` = maximum number of elements we can pick that sum exactly to `t`. Process each number backwards (prevent reuse).

**VI:** Biến thể **ba lô 0/1 cổ điển**: thay vì tối đa hóa giá trị, tối đa hóa số phần tử đã dùng. `dp[t]` = số phần tử tối đa có thể chọn sao cho tổng đúng bằng `t`. Duyệt ngược để tránh dùng lại.

**Pattern Recognition:**
- Key insight: see analogy above

**Visual — Length of the Longest Subsequence That Sums to Target example:**

```
nums = [1, 1, 5, 4, 5], target = 3
dp[t] = max elements summing to t, init = -Infinity (impossible)
dp[0] = 0

Process 1: dp[1] = max(dp[1], dp[0]+1) = 1
Process 1: dp[2] = max(dp[2], dp[1]+1) = 2, dp[1] = max(1, dp[0]+1) = 1
Process 5: dp[t>=5] updates...
Process 4: dp[4] = max(dp[4], dp[0]+1) = 1
...
dp[3] = 3 → answer is 3 (using 1,1,... wait target=3, 1+1+... no)
Actually dp[3] = 2 (using both 1s + ... no = 1+1+1 impossible since no third 1)

Return dp[target] if dp[target] > 0 else -1
```

---

---

## Problem Description

| Problem                                                                                 | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 🟡 Medium  | 0/1 Knapsack       |
| [Target Sum](https://leetcode.com/problems/target-sum/)                                 | 🟡 Medium  | 0/1 Knapsack       |
| [Coin Change](https://leetcode.com/problems/coin-change/)                               | 🟡 Medium  | Unbounded Knapsack |

---

## 📝 Interview Tips

- 🔑 **EN:** `dp[t]` = max length of subsequence summing to `t`, initialized to `-Infinity` (impossible). `dp[0] = 0`. **VI:** dp[t] = độ dài tối đa dãy con có tổng t, khởi tạo -Infinity. dp[0] = 0.
- 🔑 **EN:** Transition: `dp[t] = max(dp[t], dp[t - num] + 1)` if `dp[t - num] != -Infinity`. **VI:** Chuyển tiếp: dp[t] = max(dp[t], dp[t-num]+1) nếu dp[t-num] khác -Infinity.
- 🔑 **EN:** Iterate `t` from `target` down to `num` (backwards = 0/1 knapsack, no reuse). **VI:** Duyệt t từ target xuống num (ngược = 0/1 knapsack, không dùng lại).
- 🔑 **EN:** Return `-1` if `dp[target]` remains `-Infinity` (no valid subsequence). **VI:** Trả -1 nếu dp[target] vẫn là -Infinity (không có dãy con hợp lệ).
- 🔑 **EN:** This differs from coin change: each element used at most once. **VI:** Khác với bài đổi xu: mỗi phần tử chỉ dùng tối đa một lần.
- 🔑 **EN:** Space O(target), time O(n _ target). **VI:** Không gian O(target), thời gian O(n _ target).

---

---

## Solutions

```typescript
/**
 * 0/1 Knapsack: maximize element count for exact sum = target
 * Time: O(n * target)  Space: O(target)
 */
function lengthOfLongestSubsequence(nums: number[], target: number): number {
  // dp[t] = max number of elements summing to exactly t
  const dp = new Array(target + 1).fill(-Infinity);
  dp[0] = 0;

  for (const num of nums) {
    // Iterate backwards: 0/1 knapsack (use each element at most once)
    for (let t = target; t >= num; t--) {
      if (dp[t - num] !== -Infinity) {
        dp[t] = Math.max(dp[t], dp[t - num] + 1);
      }
    }
  }

  return dp[target] <= 0 ? -1 : dp[target];
}

/**
 * Top-down memoization version
 * Time: O(n * target)  Space: O(n * target)
 */
function lengthOfLongestSubsequenceMemo(nums: number[], target: number): number {
  const n = nums.length;
  const memo = new Map<string, number>();

  // Returns max length of subsequence using nums[i..] that sums to rem
  function dp(i: number, rem: number): number {
    if (rem === 0) return 0;
    if (i === n || rem < 0) return -Infinity;
    const key = `${i},${rem}`;
    if (memo.has(key)) return memo.get(key)!;

    // Skip nums[i]
    const skip = dp(i + 1, rem);
    // Take nums[i]
    const take = dp(i + 1, rem - nums[i]);
    const res = Math.max(skip, take === -Infinity ? -Infinity : take + 1);
    memo.set(key, res);
    return res;
  }

  const result = dp(0, target);
  return result <= 0 ? -1 : result;
}

/**
 * Space-efficient: same 1D DP, more explicit handling
 * Time: O(n * target)  Space: O(target)
 */
function lengthOfLongestSubsequenceV3(nums: number[], target: number): number {
  // Use -1 for impossible, 0 for "achievable with 0 elements" (only sum=0)
  const dp = new Array(target + 1).fill(-1);
  dp[0] = 0;

  for (const num of nums) {
    for (let t = target; t >= num; t--) {
      if (dp[t - num] !== -1) {
        dp[t] = Math.max(dp[t], dp[t - num] + 1);
      }
    }
  }
  return dp[target];
}

// Tests
console.log(lengthOfLongestSubsequence([1, 1, 5, 4, 5], 3)); // -1  (no subseq sums to 3)
console.log(lengthOfLongestSubsequence([4, 1, 3, 2, 1, 5], 7)); // 4   (1+3+2+1)
console.log(lengthOfLongestSubsequence([1, 2, 3], 6)); // 3   (1+2+3)
console.log(lengthOfLongestSubsequence([1, 1, 1, 1], 3)); // 3   (1+1+1)
console.log(lengthOfLongestSubsequenceV3([4, 1, 3, 2, 1, 5], 7)); // 4  (cross-check)
```

---

## 🔗 Related Problems

| Problem                                                                                 | Difficulty | Pattern            |
| --------------------------------------------------------------------------------------- | ---------- | ------------------ |
| [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) | 🟡 Medium  | 0/1 Knapsack       |
| [Target Sum](https://leetcode.com/problems/target-sum/)                                 | 🟡 Medium  | 0/1 Knapsack       |
| [Coin Change](https://leetcode.com/problems/coin-change/)                               | 🟡 Medium  | Unbounded Knapsack |
