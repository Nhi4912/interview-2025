---
layout: page
title: "Maximize Subarray Sum After Removing All Occurrences of One Element"
difficulty: Hard
category: Dynamic Programming
tags: [Array, Dynamic Programming, Segment Tree]
leetcode_url: "https://leetcode.com/problems/maximize-subarray-sum-after-removing-all-occurrences-of-one-element"
---

# Maximize Subarray Sum After Removing All Occurrences of One Element

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Segment Tree
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) | [Count Number of Teams](https://leetcode.com/problems/count-number-of-teams)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống xóa một loại viên gạch khỏi bức tường rồi tìm đoạn dài nhất — với mỗi giá trị bị xóa, Kadane's algorithm cho phần còn lại. DP hai chiều (bên trái và bên phải mỗi vị trí) giúp tính nhanh subarray sum khi bỏ mọi occurrence của một giá trị.

**Visual — nums=[1,-2,0,3], remove each unique value:**

```
Original:    [ 1, -2,  0,  3]
Remove 1  →  [-2,  0,  3]   max subarray = 3
Remove -2 →  [ 1,  0,  3]   max subarray = 4
Remove 0  →  [ 1, -2,  3]   max subarray = 3
Remove 3  →  [ 1, -2,  0]   max subarray = 1

Answer: max(3, 4, 3, 1) = 4 (remove -2, take [1,0,3])

Efficient approach: For each occurrence of value v at index i,
  best[i] = max subarray ending exactly at a position that "bridges" across all v's
  Use left[i] = max subarray sum ending at i (skipping v's)
      right[i] = max subarray sum starting at i (skipping v's)
```

---

## Problem Description

Given a 0-indexed integer array `nums`, you can choose **one value** to remove **all its occurrences**. Return the **maximum possible subarray sum** after performing this operation. If no removal leads to a better sum, return the max subarray sum of the original array. ([LeetCode](https://leetcode.com/problems/maximize-subarray-sum-after-removing-all-occurrences-of-one-element))

Difficulty: Hard | Acceptance: 19.8%

**Example 1:**

```
Input: nums = [1, 2, -1, -2, 1, 2]
Output: 6
Explanation: Remove -1 and -2: array becomes [1,2,1,2], max subarray = 6
```

**Example 2:**

```
Input: nums = [1, -1, 1, -1]
Output: 1
Explanation: Remove -1: array becomes [1,1], max subarray = 2. Remove 1: array becomes [-1,-1], max subarray = -1. Best = 2.
```

Constraints:

- `1 <= nums.length <= 10^5`
- `-10^6 <= nums[i] <= 10^6`

---

## 📝 Interview Tips

1. **Clarify**: "Xóa một VALUE (mọi occurrence) hay một element đơn lẻ?" / Confirm removing all occurrences of a value, not just one.
2. **Brute force**: "O(n² hoặc n·U): với mỗi giá trị unique, chạy Kadane trên mảng còn lại" / Naive: for each unique value, run Kadane on filtered array.
3. **DP precompute**: "Tính left[i] = max subarray sum kết thúc tại i, right[i] = max subarray sum bắt đầu từ i" / Precompute prefix/suffix Kadane arrays.
4. **Bridging**: "Khi xóa v, subarray có thể bridge qua v's position: left[prev] + right[next]" / Connect subarrays across removed positions.
5. **Edge cases**: "Tất cả âm → phải trả về số lớn nhất (max single element)" / All negative: return max element.
6. **Follow-up**: "Xóa k giá trị khác nhau? Bài toán trở nên NP-hard" / Removing multiple distinct values is much harder.

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — try removing each unique value
 * Time: O(n·U) where U = number of unique values
 * Space: O(n)
 */
function maximizeSubarraySumBrute(nums: number[]): number {
  const unique = new Set(nums);
  let ans = -Infinity;

  // Also try with no removal
  ans = Math.max(ans, kadane(nums));

  for (const val of unique) {
    const filtered = nums.filter((x) => x !== val);
    if (filtered.length > 0) {
      ans = Math.max(ans, kadane(filtered));
    }
  }
  return ans;
}

function kadane(arr: number[]): number {
  let maxSum = -Infinity,
    cur = 0;
  for (const x of arr) {
    cur = Math.max(x, cur + x);
    maxSum = Math.max(maxSum, cur);
  }
  return maxSum;
}

/**
 * Solution 2: DP with left/right arrays
 * Time: O(n·U) worst case but practical for limited unique values
 * Space: O(n)
 *
 * For each unique value v, compute max subarray skipping all occurrences of v.
 * Use prefix Kadane + suffix Kadane, then bridge across removed positions.
 */
function maximizeSubarraySumAfterRemoving(nums: number[]): number {
  const n = nums.length;
  let ans = kadane(nums); // baseline: no removal

  const unique = new Set(nums);

  for (const val of unique) {
    // left[i] = max subarray sum ending at i, excluding positions with value val
    // right[i] = max subarray sum starting at i, excluding positions with value val
    const left = new Array(n).fill(-Infinity);
    const right = new Array(n).fill(-Infinity);

    // Build left array
    let cur = 0;
    for (let i = 0; i < n; i++) {
      if (nums[i] === val) {
        cur = 0; // reset: can't include this position
        left[i] = -Infinity;
      } else {
        cur = Math.max(nums[i], cur + nums[i]);
        left[i] = cur;
      }
    }

    // Build right array
    cur = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (nums[i] === val) {
        cur = 0;
        right[i] = -Infinity;
      } else {
        cur = Math.max(nums[i], cur + nums[i]);
        right[i] = cur;
      }
    }

    // Find max subarray that doesn't use val
    // Case 1: entirely in a segment between val occurrences
    for (let i = 0; i < n; i++) {
      if (nums[i] !== val) ans = Math.max(ans, left[i]);
    }

    // Case 2: bridge across removed positions
    // For each pair of adjacent non-val segments, combine right end of left segment + left end of right segment
    let bestLeft = -Infinity;
    for (let i = 0; i < n; i++) {
      if (nums[i] === val) {
        // After the val block, try bridging
        if (i + 1 < n && right[i + 1] !== -Infinity && bestLeft !== -Infinity) {
          ans = Math.max(ans, bestLeft + right[i + 1]);
        }
        bestLeft = -Infinity; // reset for next segment
      } else {
        bestLeft = Math.max(bestLeft, left[i]);
      }
    }
  }

  return ans;
}

// === Test Cases ===
console.log(maximizeSubarraySumAfterRemoving([1, 2, -1, -2, 1, 2])); // 6
console.log(maximizeSubarraySumAfterRemoving([1, -1, 1, -1])); // 2
console.log(maximizeSubarraySumAfterRemoving([-1, -2, -3])); // -1
console.log(maximizeSubarraySumAfterRemoving([3])); // 3
```

---

## 🔗 Related Problems

- [Maximum Subarray](https://leetcode.com/problems/maximum-subarray) — Kadane's algorithm baseline
- [Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence) — same pattern: Segment Tree
- [Maximum Sum of Subsequence With Non-adjacent Elements](https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements) — same pattern: Segment Tree
- [Delivering Boxes from Storage to Ports](https://leetcode.com/problems/delivering-boxes-from-storage-to-ports) — same pattern: Segment Tree
- [Maximize Subarray Sum After Removing — LeetCode](https://leetcode.com/problems/maximize-subarray-sum-after-removing-all-occurrences-of-one-element) — problem page
