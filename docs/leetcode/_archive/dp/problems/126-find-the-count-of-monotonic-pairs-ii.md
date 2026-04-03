---
layout: page
title: "Find the Count of Monotonic Pairs II"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Math, Dynamic Programming, Combinatorics, Prefix Sum]
leetcode_url: "https://leetcode.com/problems/find-the-count-of-monotonic-pairs-ii"
---

# Find the Count of Monotonic Pairs II / Đếm Cặp Đơn Điệu II

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Prefix Sum
> **Frequency**: 📘 Tier 3 | **Company tags**: Google

## 🧠 Intuition / Tư Duy

**Analogy:** Như điền hai hàng bảng lớp — hàng trên chỉ được tăng, hàng dưới chỉ được giảm, tổng mỗi cột phải bằng nums[i]. Mỗi lựa chọn ở cột i giới hạn tập lựa chọn hợp lệ ở cột i+1, và prefix sum giúp tính nhanh tổng các lựa chọn hợp lệ.

**Pattern Recognition:**

- "Count arrays with element-wise sum constraint + monotone constraints" → DP over indices
- dp[j] = ways ending with arr1[i] = j; transition requires arr1 non-decreasing, arr2 non-increasing
- Transition is a prefix sum over valid previous values → O(1) per cell with prefix array

**Visual:**

```
nums=[2,3,2], arr1 non-decreasing, arr2[i]=nums[i]-arr1[i] non-increasing

Index 0: arr1[0] ∈ {0,1,2} → dp = [1,1,1,0,...]
Index 1: arr1[1] ∈ {0..3}, need arr1[1]>=arr1[0] AND arr2[1]<=arr2[0]
         i.e. arr1[1] - arr1[0] >= nums[1]-nums[0] = 1  →  arr1[1] >= arr1[0]+1
         prefix sum to get # valid arr1[0] values quickly
Index 2: similarly → total = 4
```

## Problem Description

Given an integer array `nums`, count pairs `(arr1, arr2)` where `arr1` is non-decreasing, `arr2` is non-increasing, and `arr1[i] + arr2[i] = nums[i]` for all `i`. Return the count modulo 10⁹+7.

Examples: [2,3,2] → 4; [5,5,5,5] → 126.

## 📝 Interview Tips

1. **Clarify**: Xác nhận arr2[i] = nums[i] - arr1[i] ≥ 0, nên arr1[i] ∈ [0, nums[i]] / arr1[i] in range [0, nums[i]].
2. **Approach**: dp[j] = số cách với arr1[i]=j; dùng prefix sum để transition trong O(1) thay vì O(maxVal).
3. **Edge cases**: Nếu nums[i] < nums[i-1] thì max hợp lệ của j có thể < 0 → không có trạng thái hợp lệ.
4. **Optimize**: Từ O(n × maxVal²) xuống O(n × maxVal) với prefix sum — critical khi maxVal=1000.
5. **Follow-up**: Monotonic Pairs I là bài nhỏ hơn (n ≤ 50) cùng pattern — brute force O(n × maxVal²) OK.
6. **Complexity**: Time O(n × max(nums)), Space O(max(nums)).

## Solutions

```typescript
/** Solution 1: DP + Prefix Sum (optimal)
 * Time: O(n * M) | Space: O(M)  M = max(nums)
 */
function countOfPairs(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  const M = Math.max(...nums);
  // dp[j] = number of valid pairs where arr1[i] = j
  let dp = new Array<number>(M + 1).fill(0);
  for (let j = 0; j <= nums[0]; j++) dp[j] = 1;

  for (let i = 1; i < n; i++) {
    // Build prefix sum of dp for fast range-sum queries
    const prefix = new Array<number>(M + 2).fill(0);
    for (let j = 0; j <= M; j++) prefix[j + 1] = (prefix[j] + dp[j]) % MOD;

    const next = new Array<number>(M + 1).fill(0);
    for (let j = 0; j <= nums[i]; j++) {
      // arr1 non-decreasing:  arr1[i-1] <= j
      // arr2 non-increasing:  nums[i-1]-arr1[i-1] >= nums[i]-j
      //   → arr1[i-1] <= j - (nums[i] - nums[i-1])
      const maxPrev = j - (nums[i] - nums[i - 1]);
      if (maxPrev < 0) continue;
      const cap = Math.min(maxPrev, nums[i - 1]);
      next[j] = prefix[cap + 1]; // sum of dp[0..cap]
    }
    dp = next;
  }

  let ans = 0;
  for (const v of dp) ans = (ans + v) % MOD;
  return ans;
}

/** Solution 2: Brute force DP O(n * M²) — illustrative only
 * Time: O(n * M²) | Space: O(M)
 */
function countOfPairsBrute(nums: number[]): number {
  const MOD = 1_000_000_007;
  const n = nums.length;
  const M = Math.max(...nums);
  let dp = new Array<number>(M + 1).fill(0);
  for (let j = 0; j <= nums[0]; j++) dp[j] = 1;

  for (let i = 1; i < n; i++) {
    const next = new Array<number>(M + 1).fill(0);
    for (let j = 0; j <= nums[i]; j++) {
      for (let prev = 0; prev <= nums[i - 1]; prev++) {
        if (prev > j) continue;
        if (nums[i - 1] - prev < nums[i] - j) continue;
        next[j] = (next[j] + dp[prev]) % MOD;
      }
    }
    dp = next;
  }

  let ans = 0;
  for (const v of dp) ans = (ans + v) % MOD;
  return ans;
}

// Tests
console.log(countOfPairs([2, 3, 2])); // 4
console.log(countOfPairs([5, 5, 5, 5])); // 126
console.log(countOfPairsBrute([2, 3, 2])); // 4
console.log(countOfPairsBrute([5, 5, 5, 5])); // 126
console.log(countOfPairs([1])); // 2
console.log(countOfPairs([0, 0])); // 1
```

## 🔗 Related Problems

| Problem                                                                                                  | Relationship                                   |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [Find the Count of Monotonic Pairs I](https://leetcode.com/problems/find-the-count-of-monotonic-pairs-i) | Same problem, smaller n — no prefix sum needed |
| [Number of Sub-arrays With Odd Sum](https://leetcode.com/problems/number-of-sub-arrays-with-odd-sum)     | Prefix-sum DP counting                         |
| [Count Sorted Vowel Strings](https://leetcode.com/problems/count-sorted-vowel-strings)                   | Counting with monotone constraints             |
