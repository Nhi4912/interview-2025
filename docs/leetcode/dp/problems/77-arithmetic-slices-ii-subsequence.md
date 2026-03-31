---
layout: page
title: "Arithmetic Slices II - Subsequence"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming]
leetcode_url: "https://leetcode.com/problems/arithmetic-slices-ii-subsequence"
---

# Arithmetic Slices II - Subsequence / Đoạn Cấp Số Cộng II — Dãy Con

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Dynamic Programming
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies
> **See also**: [Jump Game II](https://leetcode.com/problems/jump-game-ii) | [Maximal Square](https://leetcode.com/problems/maximal-square)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như tìm các "làn sóng" trong âm nhạc — mỗi cặp (j, i) tạo ra một "giai điệu" với bước nhảy `diff`. Nếu đã có nhiều nốt trước đó với cùng `diff`, thêm nốt mới tạo ra tất cả các dãy dài hơn 1.

**Pattern Recognition:**

- Signal: "count arithmetic subsequences of length ≥ 3" → **DP with HashMap per index**
- `dp[i][diff]` = số dãy con cấp số cộng độ dài ≥ 2 kết thúc tại `i` với hiệu chung `diff`
- Mỗi cặp (j, i) đóng góp `dp[j][diff]` vào đáp án (tạo dãy dài ≥ 3) và thêm 1 vào `dp[i][diff]`

**Visual — nums = [2, 4, 6, 8, 10], diff = 2:**

```
i=1(4): dp[1][2] += dp[0][2]+1 = 1     (pair [2,4])
i=2(6): dp[2][2] += dp[1][2]+1 = 2     (pairs [4,6],[2,4,6])  ans += dp[1][2]=1
i=3(8): dp[3][2] += dp[2][2]+1 = 3     ans += dp[2][2]=2
i=4(10):dp[4][2] += dp[3][2]+1 = 4     ans += dp[3][2]=3
Total answer = 0+1+2+3 = 6  ([2,4,6],[4,6,8],[6,8,10],[2,4,6,8],[4,6,8,10],[2,4,6,8,10])
```

---

## Problem Description

Given an integer array `nums`, return the number of all the **arithmetic subsequences** of `nums` with length ≥ 3. A subsequence is arithmetic if consecutive differences are equal. ([LeetCode 446](https://leetcode.com/problems/arithmetic-slices-ii-subsequence))

**Example 1:** `[1,2,3,4]` → `3` ([1,2,3], [2,3,4], [1,2,3,4])

**Example 2:** `[1,2,3,4,5]` → `7`

Constraints: `1 <= nums.length <= 1000`, `-2^31 <= nums[i] <= 2^31 - 1`

---

## 📝 Interview Tips

1. **Clarify**: "Subsequence (không nhất thiết liên tiếp) với ít nhất 3 phần tử" / Non-contiguous subsequence, length ≥ 3
2. **State design**: "dp[i] là Map<diff, count> — số dãy dài ≥ 2 kết thúc tại i với hiệu diff" / Map per index keyed by common difference
3. **Transition**: "Với mỗi j < i: dp[i][diff] += dp[j][diff] + 1; ans += dp[j][diff]" / +1 for new pair, existing count extends to length ≥ 3
4. **Why +1**: "Cặp (j,i) luôn là dãy dài 2 — chưa đủ điều kiện nhưng có thể mở rộng sau" / A pair of length 2 is tracked but not counted yet
5. **Overflow**: "diff = nums[i] - nums[j] có thể tràn Int32 — dùng BigInt hoặc Number (JS float)" / Difference may overflow 32-bit int; use Number or BigInt in JS
6. **Complexity**: "O(n²) time và space — Map per index lưu tối đa n-1 diff values" / n² states in worst case

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — enumerate all triples
 * Time: O(n^3) — check all (i,j,k) triplets
 * Space: O(1)
 */
function numberOfArithmeticSlicesBrute(nums: number[]): number {
  const n = nums.length;
  let ans = 0;
  for (let i = 0; i < n - 2; i++)
    for (let j = i + 1; j < n - 1; j++)
      for (let k = j + 1; k < n; k++) if (nums[j] - nums[i] === nums[k] - nums[j]) ans++;
  // Note: only counts length-3; misses longer ones — brute force is incomplete
  return ans;
}

/**
 * Solution 2: DP with HashMap — counts all arithmetic subsequences of length ≥ 3
 * Time: O(n^2) — n^2 pairs, each O(1) Map operation
 * Space: O(n^2) — each dp[i] Map holds up to i entries
 */
function numberOfArithmeticSlices(nums: number[]): number {
  const n = nums.length;
  const dp: Map<number, number>[] = Array.from({ length: n }, () => new Map());
  let ans = 0;

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const diff = nums[i] - nums[j];
      const prev = dp[j].get(diff) ?? 0;

      // prev = # of arithmetic subsequences length ≥ 2 ending at j with this diff
      // Adding nums[i] turns each into length ≥ 3 → contribute to answer
      ans += prev;

      // Also record the new pair (j,i) + all extensions as length-≥-2 subsequences at i
      dp[i].set(diff, (dp[i].get(diff) ?? 0) + prev + 1);
    }
  }

  return ans;
}

// === Test Cases ===
console.log(numberOfArithmeticSlices([1, 2, 3, 4])); // 3
console.log(numberOfArithmeticSlices([1, 2, 3, 4, 5])); // 7
console.log(numberOfArithmeticSlices([2, 4, 6, 8, 10])); // 6
console.log(numberOfArithmeticSlices([1])); // 0
```

---

## 🔗 Related Problems

| Problem                                                                                                                                | Difficulty | Pattern         |
| -------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------- |
| [Arithmetic Slices](https://leetcode.com/problems/arithmetic-slices)                                                                   | 🟡 Medium  | DP (contiguous) |
| [Longest Arithmetic Subsequence](https://leetcode.com/problems/longest-arithmetic-subsequence)                                         | 🟡 Medium  | DP + HashMap    |
| [Longest Arithmetic Subsequence of Given Difference](https://leetcode.com/problems/longest-arithmetic-subsequence-of-given-difference) | 🟡 Medium  | DP + HashMap    |
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling)                                     | 🔴 Hard    | DP              |
| [Unique Paths II](https://leetcode.com/problems/unique-paths-ii)                                                                       | 🟡 Medium  | DP              |
