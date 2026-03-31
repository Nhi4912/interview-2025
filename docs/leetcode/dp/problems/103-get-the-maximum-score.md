---
layout: page
title: "Get the Maximum Score"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Two Pointers, Dynamic Programming, Greedy]
leetcode_url: "https://leetcode.com/problems/get-the-maximum-score"
---

# Get the Maximum Score / Lấy Điểm Tối Đa

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Two Pointers + DP
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Hai đường ray song song với các cầu nối tại các điểm chung. Bạn đi từ trái sang phải, tại mỗi cầu có thể chuyển ray nếu có lợi hơn. Giữa hai cầu liên tiếp, tích lũy điểm đường ray nào cao hơn.

**Pattern Recognition:**

- Signal: "two sorted arrays, switch at common values, maximize sum" → Two-pointer sync at intersections
- Between common elements: accumulate sum independently on each array
- At common element: sync both to `max(sum1, sum2) + common_value`

**Visual:**

```
nums1 = [2,4,5,8,10]
nums2 = [4,6,8,9]
Common:    4,    8
Segments: [2] [4] [5] [8] [10]
          [ ] [4] [6] [8] [ 9]
At 4: max(2, 0)+4 = 6
At 8: max(6+5, 6+6)+8 = max(11,12)+8 = 20
End:  max(20+10, 20+9) = 30
```

## Problem Description

Two sorted arrays `nums1` and `nums2` (no duplicates each). Start from index 0 of either. Move right, but at common values you may switch arrays. Maximize the sum of visited elements. Return answer mod `10^9 + 7`.

- Example 1: `nums1 = [2,4,5,8,10]`, `nums2 = [4,6,8,9]` → `30`
- Example 2: `nums1 = [1,3,5,7,9]`, `nums2 = [3,5,100]` → `109`
- Constraints: `1 ≤ nums1.length, nums2.length ≤ 10^5`, values ≤ `10^7`

## 📝 Interview Tips

1. **Clarify**: Có thể bắt đầu từ mảng nào cũng được? / Can we start from either array?
2. **Approach**: Two pointers — khi gặp phần tử chung, đồng bộ hóa cả hai tổng / sync at intersections
3. **Edge cases**: No common elements → take max total of each array; all common → merge optimally
4. **Optimize**: O(n+m) one pass without extra space; use BigInt for overflow safety
5. **Test**: Verify with example: [2,4,5,8,10] & [4,6,8,9] → 30
6. **Follow-up**: What if we can switch at most k times?

## Solutions

```typescript
/** Solution 1: Two Pointers — sync sums at common elements
 * Time: O(n + m) | Space: O(1)
 */
function maxSum(nums1: number[], nums2: number[]): number {
  const MOD = 1_000_000_007n;
  let i = 0,
    j = 0;
  let sum1 = 0n,
    sum2 = 0n;

  while (i < nums1.length || j < nums2.length) {
    if (i < nums1.length && (j >= nums2.length || nums1[i] < nums2[j])) {
      sum1 += BigInt(nums1[i++]);
    } else if (j < nums2.length && (i >= nums1.length || nums2[j] < nums1[i])) {
      sum2 += BigInt(nums2[j++]);
    } else {
      // Common element: take the better path and sync
      const best = (sum1 > sum2 ? sum1 : sum2) + BigInt(nums1[i]);
      sum1 = best;
      sum2 = best;
      i++;
      j++;
    }
  }

  return Number((sum1 > sum2 ? sum1 : sum2) % MOD);
}

/** Solution 2: DP with explicit segment accumulation
 * Time: O(n + m) | Space: O(n + m)
 * Build merged list of "intersection" boundaries, compute DP between them
 */
function maxSum2(nums1: number[], nums2: number[]): number {
  const MOD = 1_000_000_007n;

  // Find common elements
  const set2 = new Set(nums2);
  const intersections = new Set(nums1.filter((x) => set2.has(x)));

  // Between intersections, sum each array separately and take max
  function sumSegment(arr: number[], lo: number, hi: number): bigint {
    // sum of arr elements that are in (lo, hi]
    let s = 0n;
    for (const x of arr) {
      if (x > lo && x <= hi) s += BigInt(x);
    }
    return s;
  }

  const points = [0, ...Array.from(intersections).sort((a, b) => a - b), Infinity];
  let best = 0n;

  for (let k = 1; k < points.length; k++) {
    const lo = points[k - 1];
    const hi = points[k];
    const s1 = sumSegment(nums1, lo, hi);
    const s2 = sumSegment(nums2, lo, hi);
    best += s1 > s2 ? s1 : s2;
  }

  return Number(best % MOD);
}

// Tests
console.log(maxSum([2, 4, 5, 8, 10], [4, 6, 8, 9])); // 30
console.log(maxSum([1, 3, 5, 7, 9], [3, 5, 100])); // 109
console.log(maxSum([1, 2, 3, 4, 5], [6, 7, 8, 9, 10])); // 40
console.log(maxSum2([2, 4, 5, 8, 10], [4, 6, 8, 9])); // 30
console.log(maxSum2([1, 3, 5, 7, 9], [3, 5, 100])); // 109
```

## 🔗 Related Problems

| Problem                                                                                                                    | Relationship                   |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii)                                                                 | Path optimization with choices |
| [Longest String Chain](https://leetcode.com/problems/longest-string-chain)                                                 | DP on sorted sequences         |
| [Maximum Sum of Two Non-Overlapping Subarrays](https://leetcode.com/problems/maximum-sum-of-two-non-overlapping-subarrays) | Two-path accumulation          |
