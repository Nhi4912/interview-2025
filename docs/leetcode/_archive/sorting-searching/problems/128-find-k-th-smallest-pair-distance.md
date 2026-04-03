---
layout: page
title: "Find K-th Smallest Pair Distance"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Two Pointers, Binary Search, Sorting]
leetcode_url: "https://leetcode.com/problems/find-k-th-smallest-pair-distance"
---

# Find K-th Smallest Pair Distance / Tìm Khoảng Cách Cặp Nhỏ Thứ K

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search + Sliding Window
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống tìm mức lương thứ k trong bảng lương:** thay vì liệt kê mọi cặp, binary search trên giá trị khoảng cách — "có bao nhiêu cặp có khoảng cách ≤ d?" → tìm d nhỏ nhất mà count ≥ k.

**Pattern Recognition:**

- Signal: "k-th smallest among O(n²) values + sorted array" → **Binary Search on Value + Counting**
- Sort mảng → khoảng cách cặp = nums[j]-nums[i] (j>i) luôn ≥ 0
- Counting pairs with distance ≤ d: sliding window trên sorted array

**Visual:**

```
nums = [1,3,1] → sorted: [1,1,3], k=1
All distances: |1-1|=0, |1-3|=2, |1-3|=2
Sorted distances: [0, 2, 2] → k=1 → answer=0

Binary search d in [0, max-min=2]:
d=1: count pairs with dist≤1 = {(1,1)} = 1 ≥ k=1 → try smaller
d=0: count pairs with dist≤0 = {(1,1)} = 1 ≥ k=1 → try smaller
lo=0, hi=0 → answer=0 ✅
```

## Problem Description

Given an integer array `nums` and integer `k`, return the k-th smallest **pair distance** among all pairs `(nums[i], nums[j])` where `i < j`. Distance = `|nums[i] - nums[j]|`.

- Example 1: `nums=[1,3,1], k=1` → `0`
- Example 2: `nums=[1,1,1], k=2` → `0`
- Example 3: `nums=[1,6,1], k=3` → `5`

## 📝 Interview Tips

1. **Clarify**: k là 1-indexed? / Is k 1-indexed? Yes. Are there duplicates? Yes
2. **Approach**: Binary search on distance d, count pairs ≤ d with sliding window / Two-layer approach
3. **Edge cases**: All equal → all distances 0 / nums with duplicates
4. **Optimize**: Brute O(n² log n), optimal O(n log n + n log(max-min)) / Big improvement
5. **Follow-up**: K-th largest pair distance? / K-th largest → binary search from other end
6. **Complexity**: Time O(n log n + n log W) where W=max-min, Space O(1)

## Solutions

```typescript
/** Solution 1: Brute Force – Generate All Pairs, Sort
 * Time: O(n² log n) | Space: O(n²)
 */
function smallestDistancePairBrute(nums: number[], k: number): number {
  const distances: number[] = [];
  for (let i = 0; i < nums.length - 1; i++)
    for (let j = i + 1; j < nums.length; j++) distances.push(Math.abs(nums[i] - nums[j]));
  distances.sort((a, b) => a - b);
  return distances[k - 1];
}

/** Solution 2: Sort + Binary Search + Sliding Window Count
 * Time: O(n log n + n log(max-min)) | Space: O(1)
 */
function smallestDistancePair(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;

  // Count pairs with distance <= d
  const countPairs = (d: number): number => {
    let count = 0,
      left = 0;
    for (let right = 0; right < n; right++) {
      while (nums[right] - nums[left] > d) left++;
      count += right - left; // all pairs (left..right-1, right)
    }
    return count;
  };

  let lo = 0,
    hi = nums[n - 1] - nums[0];
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (countPairs(mid) >= k)
      hi = mid; // mid might be the answer, try smaller
    else lo = mid + 1;
  }
  return lo;
}

/** Solution 3: Binary Search + Bucket Count (for small value range)
 * Time: O(n log n + W + n log W) | Space: O(W) where W = max-min
 */
function smallestDistancePairBucket(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const W = nums[n - 1] - nums[0];

  // Prefix count of values
  const prefix = new Array(W + 2).fill(0);
  for (const x of nums) prefix[x - nums[0] + 1]++;
  for (let i = 1; i <= W + 1; i++) prefix[i] += prefix[i - 1];

  const countAtMost = (d: number): number => {
    let cnt = 0;
    for (let i = 0; i < n; i++) {
      const lo = nums[i] - nums[0],
        hi = nums[i] + d - nums[0];
      const r = Math.min(hi, W);
      cnt += prefix[r + 1] - prefix[lo]; // includes self
    }
    return cnt - n; // remove self-pairs
  };

  let lo = 0,
    hi = W;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (countAtMost(mid) >= k) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// Tests
console.log(smallestDistancePair([1, 3, 1], 1)); // 0
console.log(smallestDistancePair([1, 1, 1], 2)); // 0
console.log(smallestDistancePair([1, 6, 1], 3)); // 5
console.log(smallestDistancePairBrute([1, 3, 1], 1)); // 0
console.log(smallestDistancePairBucket([1, 3, 1], 1)); // 0
console.log(smallestDistancePair([62, 100, 4], 2)); // 58
```

## 🔗 Related Problems

| Problem                                                                                                          | Relationship                      |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| [Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix) | Binary search on value + counting |
| [Minimum Limit of Balls in a Bag](https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag)                 | Binary search on answer           |
| [Find K Closest Elements](https://leetcode.com/problems/find-k-closest-elements)                                 | Sliding window on sorted array    |
