---
layout: page
title: "Subsequence of Size K With the Largest Even Sum"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/subsequence-of-size-k-with-the-largest-even-sum"
---

# Subsequence of Size K With the Largest Even Sum / Dãy Con Kích Thước K Có Tổng Chẵn Lớn Nhất

🟡 Medium | 🏷️ Array, Greedy, Sorting

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** Chọn k phần tử lớn nhất. Nếu tổng đã chẵn → xong. Nếu tổng lẻ, cần điều chỉnh: đổi một phần tử lẻ trong tập đang chọn với phần tử chẵn nhỏ hơn bên ngoài, hoặc đổi một phần tử chẵn trong tập với phần tử lẻ bên ngoài — chọn phương án mất ít nhất.

```
nums = [4,1,2], k=2, sorted desc = [4,2,1]
Top k=2: {4,2}, sum=6 (even) → return 6

nums = [1,2,3], k=2, sorted desc = [3,2,1]
Top k=2: {3,2}, sum=5 (odd)
Fix option A: swap smallest odd in chosen (3) with largest even outside (none → impossible)
Fix option B: swap smallest even in chosen (2) with largest odd outside (1) → {3,1}=4
Best even sum = 4
```

## Problem Description

Given an integer array `nums` and an integer `k`, return the **largest even sum** of a subsequence of size `k`. If no such subsequence exists, return `-1`.

**Example 1:** `nums = [4,1,2], k = 2` → `6`

**Example 2:** `nums = [1,2,3], k = 2` → `4`

**Example 3:** `nums = [1,2,3,4,5], k = 4` → `14` (1+3+4+... wait: pick 5,4,3,2=14 even!)

## 📝 Interview Tips

- 🔑 **Start greedy / Bắt đầu tham lam:** Pick top k elements; if sum is even, done
- 🔑 **Parity fix / Sửa tính chẵn lẻ:** Sum is odd iff odd-count-in-chosen is odd; fix by one swap
- 🔑 **Two swap options / Hai lựa chọn:** (A) swap min-odd-in-chosen ↔ max-even-outside; (B) swap min-even-in-chosen ↔ max-odd-outside
- ⚠️ **Impossible case / Không thể:** Return -1 if both swap options have no valid partner
- ⚠️ **Sort ascending / Sắp tăng dần:** Sort ascending so "inside" = last k, "outside" = first n-k
- 🔗 **Pattern / Mẫu:** Top-k greedy + parity adjustment with one swap

## Solutions

### Solution 1: Sort + Greedy Parity Fix

```typescript
/**
 * Sort ascending, take top k. If odd sum, try two swap options to make it even.
 * Time: O(n log n)  Space: O(1)
 */
function largestEvenSum(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Take top k elements (index n-k to n-1)
  let sum = 0;
  for (let i = n - k; i < n; i++) sum += nums[i];

  if (sum % 2 === 0) return sum;

  // Sum is odd — need to make one swap to change parity
  // "chosen" = nums[n-k..n-1], "outside" = nums[0..n-k-1]

  let best = -1;

  // Option A: swap smallest ODD in chosen with largest EVEN outside chosen
  // Smallest odd in chosen: scan from n-k upward
  let minOddChosen = -1;
  for (let i = n - k; i < n; i++) {
    if (nums[i] % 2 !== 0) {
      minOddChosen = nums[i];
      break;
    }
  }
  // Largest even outside chosen: scan from n-k-1 downward
  let maxEvenOutside = -1;
  for (let i = n - k - 1; i >= 0; i--) {
    if (nums[i] % 2 === 0) {
      maxEvenOutside = nums[i];
      break;
    }
  }
  if (minOddChosen !== -1 && maxEvenOutside !== -1) {
    best = Math.max(best, sum - minOddChosen + maxEvenOutside);
  }

  // Option B: swap smallest EVEN in chosen with largest ODD outside chosen
  let minEvenChosen = -1;
  for (let i = n - k; i < n; i++) {
    if (nums[i] % 2 === 0) {
      minEvenChosen = nums[i];
      break;
    }
  }
  let maxOddOutside = -1;
  for (let i = n - k - 1; i >= 0; i--) {
    if (nums[i] % 2 !== 0) {
      maxOddOutside = nums[i];
      break;
    }
  }
  if (minEvenChosen !== -1 && maxOddOutside !== -1) {
    best = Math.max(best, sum - minEvenChosen + maxOddOutside);
  }

  return best;
}

console.log(largestEvenSum([4, 1, 2], 2)); // 6
console.log(largestEvenSum([1, 2, 3], 2)); // 4
console.log(largestEvenSum([1, 2, 3, 4, 5], 4)); // 14
console.log(largestEvenSum([1, 3, 5], 1)); // -1 (all odd, k=1)
console.log(largestEvenSum([1, 3, 5, 7], 2)); // -1 (only odd numbers)
```

### Solution 2: Explicit Partition into Even/Odd

```typescript
/**
 * Separate evens and odds, sort each, greedily combine.
 * Time: O(n log n)  Space: O(n)
 */
function largestEvenSumPartition(nums: number[], k: number): number {
  const evens = nums.filter((x) => x % 2 === 0).sort((a, b) => b - a);
  const odds = nums.filter((x) => x % 2 !== 0).sort((a, b) => b - a);

  let best = -1;

  // Try taking e evens and (k-e) odds; sum is even when k-e is even → e and k have same parity
  for (let e = 0; e <= Math.min(k, evens.length); e++) {
    const o = k - e;
    if (o > odds.length) continue;
    // Sum is even iff e*even + o*odd → (k-e)*odd parity = (k-e) % 2
    // Total parity = (k-e) % 2 (since even*anything stays even)
    if ((k - e) % 2 !== 0) continue; // odd sum, skip

    let s = 0;
    for (let i = 0; i < e; i++) s += evens[i];
    for (let i = 0; i < o; i++) s += odds[i];
    best = Math.max(best, s);
  }

  return best;
}

console.log(largestEvenSumPartition([4, 1, 2], 2)); // 6
console.log(largestEvenSumPartition([1, 2, 3], 2)); // 4
console.log(largestEvenSumPartition([1, 2, 3, 4, 5], 4)); // 14
console.log(largestEvenSumPartition([1, 3, 5], 1)); // -1
```

## 🔗 Related Problems

| Problem                                                                                                                                               | Difficulty | Pattern                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ----------------------- |
| [Largest Sum After K Negations](https://leetcode.com/problems/largest-sum-after-k-negations/)                                                         | Easy       | Greedy sort + parity    |
| [Maximum Subarray Min-Product](https://leetcode.com/problems/maximum-subarray-min-product/)                                                           | Medium     | Greedy with constraints |
| [Minimum Difference Between Highest and Lowest of K Scores](https://leetcode.com/problems/minimum-difference-between-highest-and-lowest-of-k-scores/) | Easy       | Sort + sliding window   |
| [Find Subsequence of Length K With the Largest Sum](https://leetcode.com/problems/find-subsequence-of-length-k-with-the-largest-sum/)                 | Easy       | Top-k selection         |
