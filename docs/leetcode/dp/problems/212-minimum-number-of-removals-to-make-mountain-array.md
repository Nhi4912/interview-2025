---
layout: page
title: "Minimum Number of Removals to Make Mountain Array"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Binary Search, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array"
---

# Minimum Number of Removals to Make Mountain Array / Xóa Ít Nhất Để Tạo Mảng Núi

## Tương tự thực tế (Vietnamese Analogy)

> Bạn có một dãy số, muốn tạo "hình núi" (tăng rồi giảm, đỉnh không ở đầu/cuối).  
> Đếm LIS từ trái vào và LIS từ phải vào, tìm đỉnh tối ưu. Xóa = n - max_mountain_length.

## ASCII Visualization

```
nums = [2, 1, 1, 5, 6, 2, 3, 1]

LIS ending at i:   [1, 1, 1, 2, 3, 2, 3, 2]  (lis)
LIS starting at i: [3, 2, 2, 3, 2, 2, 2, 1]  (lds)

Mountain at peak i=4: lis[4]+lds[4]-1 = 3+2-1 = 4
 (need lis[i]>=2 AND lds[i]>=2 for valid mountain)
Best = 4, removals = 8 - 4 = 4
```

## Problem

Given integer array `nums`, return the **minimum** number of elements to remove so the remaining
array is a **mountain array**: strictly increasing then strictly decreasing, peak not at endpoints.

**Constraints:** `3 <= nums.length <= 1000`, `1 <= nums[i] <= 10^9`

## Interview Tips

1. **Mountain = LIS + LDS at peak** — compute LIS ending at each i, LDS starting at each i.
2. **Valid peak** — must have `lis[i] >= 2` AND `lds[i] >= 2` (at least one element on each side).
3. **Max mountain** — for valid peaks, maximize `lis[i] + lds[i] - 1` (peak counted once).
4. **Answer** — `n - maxMountainLen`.
5. **LIS computation** — O(n²) DP or O(n log n) binary search; O(n²) sufficient here (n≤1000).
6. **Edge case** — if no valid peak exists, impossible (but constraints guarantee one exists).

## Solutions

### Solution 1: LIS + LDS DP — O(n²)

```typescript
function minimumMountainRemovals(nums: number[]): number {
  const n = nums.length;

  // lis[i] = length of LIS ending at index i (strictly increasing)
  const lis = new Array<number>(n).fill(1);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) lis[i] = Math.max(lis[i], lis[j] + 1);
    }
  }

  // lds[i] = length of LIS starting at index i going right (strictly decreasing from i)
  const lds = new Array<number>(n).fill(1);
  for (let i = n - 2; i >= 0; i--) {
    for (let j = i + 1; j < n; j++) {
      if (nums[j] < nums[i]) lds[i] = Math.max(lds[i], lds[j] + 1);
    }
  }

  // Find maximum mountain length (peak must not be at endpoints)
  let maxLen = 0;
  for (let i = 1; i < n - 1; i++) {
    if (lis[i] >= 2 && lds[i] >= 2) {
      maxLen = Math.max(maxLen, lis[i] + lds[i] - 1);
    }
  }

  return n - maxLen;
}

console.log(minimumMountainRemovals([1, 3, 1])); // 0
console.log(minimumMountainRemovals([2, 1, 1, 5, 6, 2, 3, 1])); // 3
console.log(minimumMountainRemovals([4, 3, 2, 1, 1, 2, 3, 1])); // 4
console.log(minimumMountainRemovals([1, 2, 3, 4, 4, 3, 2, 1])); // 1
```

### Solution 2: O(n log n) LIS with Binary Search

```typescript
function minimumMountainRemovalsOpt(nums: number[]): number {
  const n = nums.length;

  function lisLengths(arr: number[]): number[] {
    const dp = new Array<number>(arr.length).fill(1);
    const tails: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      let lo = 0,
        hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < arr[i]) lo = mid + 1;
        else hi = mid;
      }
      tails[lo] = arr[i];
      dp[i] = lo + 1;
    }
    return dp;
  }

  const lis = lisLengths(nums);
  // For LDS, reverse the array to get LIS from right
  const lds = lisLengths([...nums].reverse()).reverse();

  let maxLen = 0;
  for (let i = 1; i < n - 1; i++) {
    if (lis[i] >= 2 && lds[i] >= 2) {
      maxLen = Math.max(maxLen, lis[i] + lds[i] - 1);
    }
  }

  return n - maxLen;
}

console.log(minimumMountainRemovalsOpt([1, 3, 1])); // 0
console.log(minimumMountainRemovalsOpt([2, 1, 1, 5, 6, 2, 3, 1])); // 3
console.log(minimumMountainRemovalsOpt([4, 3, 2, 1, 1, 2, 3, 1])); // 4
```

## Related Problems

| Problem                                                                                         | Difficulty | Key Concept |
| ----------------------------------------------------------------------------------------------- | ---------- | ----------- |
| [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) | Medium     | LIS DP      |
| [Longest Mountain in Array](https://leetcode.com/problems/longest-mountain-in-array/)           | Medium     | Two-pass    |
| [Valid Mountain Array](https://leetcode.com/problems/valid-mountain-array/)                     | Easy       | Linear scan |
