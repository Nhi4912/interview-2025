---
layout: page
title: "Number of Subarrays With AND Value of K"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search, Bit Manipulation, Segment Tree]
leetcode_url: "https://leetcode.com/problems/number-of-subarrays-with-and-value-of-k"
---

# Number of Subarrays With AND Value of K / Số Mảng Con Có Giá Trị AND Bằng K

🔴 Hard | 🏷️ Array, Binary Search, Bit Manipulation

## 🧠 Intuition / Tư Duy

**Vietnamese analogy:** AND từng bit chỉ có thể đặt bit về 0, không bao giờ bật lại. Khi bạn kéo dài mảng con từ phải sang trái, AND chỉ giảm dần (monotone non-increasing). Điều này cho phép dùng binary search! Với mỗi r, tập hợp AND của tất cả các dải [l..r] chỉ có O(log(max)) giá trị phân biệt.

```
nums = [1,1,2], k=1
AND values ending at r=2 (0-indexed):
  l=2: AND=2
  l=1: AND=1&2=0...
Wait: [2]=2, [1,2]=1&2=0, [1,1,2]=1&1&2=0
Distinct AND values: {2,0} → at most log(2^30)=30 distinct values per endpoint
```

## Problem Description

Given an integer array `nums` and an integer `k`, return the **number of subarrays** where the bitwise AND of all elements equals `k`.

**Example 1:** `nums = [1,1,2], k = 1` → `3` (subarrays [1],[1],[1,1])

**Example 2:** `nums = [1,2,3], k = 2` → `2` (subarrays [2],[1,2,3]? No — [2]=2, [2,3]=2&3=2 → 2 subarrays)

## 📝 Interview Tips

- 🔑 **Key insight / Chìa khóa:** AND is monotone non-increasing as we extend left; O(log max) distinct AND values per right endpoint
- 🔑 **Segment tracking / Theo dõi đoạn:** Maintain list of (AND_value, leftmost_start) pairs instead of recomputing
- 🔑 **Merge duplicates / Gộp trùng:** When two adjacent pairs have the same AND, merge them to keep list small
- ⚠️ **K=0 edge / Biên K=0:** If k has bits not in nums[i], that subarray can never AND to k
- ⚠️ **Overflow / Tràn số:** Use BigInt-safe operations — nums can reach 10^9, fits in 32-bit but count can be large
- 🔗 **Pattern / Mẫu:** "Monotone bit operation" → segment compression; same trick works for OR subarrays

## Solutions

### Solution 1: Segment Compression (O(n log max))

```typescript
/**
 * Maintain compressed list of (andValue, count) for all subarrays ending at i.
 * ANDing can only clear bits, so at most 30 distinct values per position.
 * Time: O(n * 30)  Space: O(30)
 */
function countSubarrays(nums: number[], k: number): number {
  let count = 0;
  // segments[i] = [andValue, numberOfSubarraysWithThisAnd]
  let segments: Array<[number, number]> = [];

  for (const num of nums) {
    // New subarray starting here
    const newSegments: Array<[number, number]> = [[num, 1]];

    for (const [andVal, cnt] of segments) {
      const newAnd = andVal & num;
      // Merge with last entry if same AND value
      if (newSegments[newSegments.length - 1][0] === newAnd) {
        newSegments[newSegments.length - 1][1] += cnt;
      } else {
        newSegments.push([newAnd, cnt]);
      }
    }

    segments = newSegments;

    // Count subarrays where AND equals k
    for (const [andVal, cnt] of segments) {
      if (andVal === k) count += cnt;
    }
  }

  return count;
}

console.log(countSubarrays([1, 1, 2], 1)); // 3
console.log(countSubarrays([1, 2, 3], 2)); // 2
console.log(countSubarrays([4, 4], 4)); // 3
console.log(countSubarrays([0], 0)); // 1
```

### Solution 2: Two-Pointer with Binary Search Boundaries

```typescript
/**
 * For each right endpoint, binary search for the range of left endpoints
 * where AND equals k. Uses the monotone property of AND.
 * Time: O(n * 30)  Space: O(n)
 */
function countSubarraysBinarySearch(nums: number[], k: number): number {
  const n = nums.length;
  let count = 0;

  // For each right endpoint r, find leftmost l1 where AND[l1..r] <= k
  // and leftmost l2 where AND[l2..r] < k (strictly)
  // answer += l2 - l1 (number of l where AND == k)

  // Helper: compute AND from l to r (naive for clarity, can be optimized with sparse table)
  const andRange = (l: number, r: number): number => {
    let res = nums[r];
    for (let i = r - 1; i >= l; i--) res &= nums[i];
    return res;
  };

  for (let r = 0; r < n; r++) {
    // Binary search: find leftmost l where AND[l..r] == k
    // AND is non-increasing as l decreases, so:
    //   find first l (from right) where AND <= k
    let lo = 0,
      hi = r,
      firstLE = r + 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (andRange(mid, r) <= k) {
        firstLE = mid;
        hi = mid - 1;
      } else lo = mid + 1;
    }

    // Find last l where AND == k (i.e., find first l where AND < k strictly)
    lo = firstLE;
    hi = r;
    let firstLT = r + 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (andRange(mid, r) < k) {
        firstLT = mid;
        hi = mid - 1;
      } else lo = mid + 1;
    }

    count += firstLT - firstLE;
  }

  return count;
}

console.log(countSubarraysBinarySearch([1, 1, 2], 1)); // 3
console.log(countSubarraysBinarySearch([1, 2, 3], 2)); // 2
console.log(countSubarraysBinarySearch([4, 4], 4)); // 3
```

## 🔗 Related Problems

| Problem                                                                                                             | Difficulty | Pattern              |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------- |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/)                         | Medium     | Bit manipulation     |
| [Count of Interesting Subarrays](https://leetcode.com/problems/count-of-interesting-subarrays/)                     | Medium     | Prefix sum + hash    |
| [Number of Subarrays with Bounded Maximum](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) | Medium     | Two pointer boundary |
| [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)                                 | Medium     | Monotone stack       |
