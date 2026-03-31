---
layout: page
title: "Partition Equal Subset Sum"
difficulty: Medium
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/partition-equal-subset-sum"
---

# Partition Equal Subset Sum / Chia Mảng Thành Hai Phần Bằng Nhau

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: 0/1 Knapsack DP
> **Frequency**: 📘 Tier 3 — Gặp ở 9 companies
> **See also**: [Target Sum](https://leetcode.com/problems/target-sum) | [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy tưởng tượng bạn có một túi đồ với tổng trọng lượng chẵn. Câu hỏi: có thể chọn một nửa số đồ vật sao cho tổng trọng lượng đúng bằng một nửa tổng không? Đây là bài toán 0/1 knapsack kinh điển — mỗi vật chỉ dùng một lần, chọn hay không chọn.

**Pattern Recognition:**

- Signal: "partition into equal subsets" → **0/1 Knapsack — can we reach target sum?**
- Target = total_sum / 2; if odd sum → impossible
- Key insight: dp[j] = true nếu có thể chọn các phần tử tạo tổng j

**Visual — nums = [1,5,11,5], target = 11:**

```
Initial dp: [T, F, F, F, F, F, F, F, F, F, F, F]  (size 12)
            [0  1  2  3  4  5  6  7  8  9  10 11]

Add num=1:  [T, T, F, F, F, F, F, F, F, F, F, F]
Add num=5:  [T, T, F, F, F, T, T, F, F, F, F, F]
Add num=11: [T, T, F, F, F, T, T, F, F, F, F, T] ← dp[11]=true ✅
Add num=5:  (already found answer)

dp[11] = true → can partition!
```

---

## Problem Description

Given a non-empty array `nums` of positive integers, determine if it can be partitioned into two subsets with equal sums. ([LeetCode 416](https://leetcode.com/problems/partition-equal-subset-sum))

Difficulty: Medium | Acceptance: 48.4%

- **Example 1**: nums = [1,5,11,5] → **true** (subsets [1,5,5] and [11])
- **Example 2**: nums = [1,2,3,5] → **false** (no way to split equally)

Constraints:

- `1 <= nums.length <= 200`
- `1 <= nums[i] <= 100`

---

## 📝 Interview Tips

1. **Clarify**: "Phần tử có thể dùng lại không? (Không — 0/1 knapsack)" / Each element used at most once
2. **First check**: "Nếu tổng lẻ → impossible ngay" / If total sum is odd, return false immediately
3. **Reduce**: "Bài toán = tìm subset có tổng = total/2" / Reduce to subset sum problem
4. **Iterate**: "Duyệt từ target về 0 để tránh dùng phần tử 2 lần" / Iterate target backwards (0/1 knapsack)
5. **Early exit**: "Nếu phần tử > target → impossible" / Single element exceeds target
6. **Space**: "1D dp array O(target) thay vì 2D O(n×target)" / Optimize to 1D rolling array

---

## Solutions

```typescript
/**
 * Solution 1: Recursive with Memoization
 * Time: O(n × target) — memoized subproblems
 * Space: O(n × target) — memo table
 */
function canPartitionMemo(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;
  const memo = new Map<string, boolean>();

  function dfs(i: number, remaining: number): boolean {
    if (remaining === 0) return true;
    if (i >= nums.length || remaining < 0) return false;
    const key = `${i},${remaining}`;
    if (memo.has(key)) return memo.get(key)!;
    const result = dfs(i + 1, remaining - nums[i]) || dfs(i + 1, remaining);
    memo.set(key, result);
    return result;
  }

  return dfs(0, target);
}

/**
 * Solution 2: Bottom-Up 0/1 Knapsack DP (Optimal)
 * Time: O(n × target) — fill dp array for each num
 * Space: O(target) — 1D boolean array
 */
function canPartition(nums: number[]): boolean {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;
  const target = total / 2;

  // dp[j] = true if subset with sum j is achievable
  const dp = new Array(target + 1).fill(false);
  dp[0] = true; // empty subset = sum 0

  for (const num of nums) {
    // Iterate backwards to avoid using same element twice (0/1 knapsack)
    for (let j = target; j >= num; j--) {
      dp[j] = dp[j] || dp[j - num];
    }
    if (dp[target]) return true; // early exit
  }

  return dp[target];
}

// === Test Cases ===
console.log(canPartition([1, 5, 11, 5])); // true
console.log(canPartition([1, 2, 3, 5])); // false
console.log(canPartition([3, 3, 3, 4, 5])); // true ([3,3,3] = [4,5])
console.log(canPartition([1])); // false
console.log(canPartition([1, 1])); // true
```

---

## 🔗 Related Problems

| Problem                                                                    | Difficulty | Pattern                 |
| -------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Target Sum](https://leetcode.com/problems/target-sum)                     | 🟡 Medium  | 0/1 Knapsack / DFS+Memo |
| [Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii) | 🟡 Medium  | 0/1 Knapsack            |
| [Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum)     | 🟡 Medium  | DP                      |
| [Coin Change](https://leetcode.com/problems/coin-change)                   | 🟡 Medium  | Unbounded Knapsack      |
| [Ones and Zeroes](https://leetcode.com/problems/ones-and-zeroes)           | 🟡 Medium  | 2D Knapsack             |
