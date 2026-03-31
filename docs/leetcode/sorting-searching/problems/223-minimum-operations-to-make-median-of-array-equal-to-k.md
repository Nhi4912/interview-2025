---
layout: page
title: "Minimum Operations to Make Median of Array Equal to K"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/minimum-operations-to-make-median-of-array-equal-to-k"
---

# Minimum Operations to Make Median of Array Equal to K / Số Thao Tác Tối Thiểu Để Trung Vị Bằng K

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy
> **Frequency**: 📘 Tier 3 — Gặp ở 1 companies
> **See also**: [Largest Number](https://leetcode.com/problems/largest-number) | [Task Scheduler](https://leetcode.com/problems/task-scheduler)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Như cân bằng một chiếc cân đĩa — ta chỉ cần điều chỉnh đĩa ở giữa (trung vị). Phần tử bên trái trung vị chỉ cần tăng nếu > k; phần tử bên phải chỉ cần giảm nếu < k. Tham lam: chỉ chỉnh những gì cần thiết.

**Pattern Recognition:**

- Signal: "median" + "minimum ops" → sort, identify median index, greedy fix violations
- Key insight: Sau khi sort, median = nums[n/2]. Ta cần nums[n/2]=k. Phần tử trái median nếu >k phải giảm; phần tử phải nếu <k phải tăng.

**Visual — Minimum Operations to Make Median example:**

```
nums = [2,5,6,8,5], k = 4
n=5, median index = 2

Sort: [2,5,5,6,8]
median = nums[2] = 5

5 > k=4 → need to decrease median to 4 → ops += 5-4 = 1
Also fix left side (idx < 2) that are > k:
  [2,5]: 2<=4 ok, 5>4 → ops += 5-4 = 1
Fix right side (idx > 2) that are < k:
  [6,8]: both > 4, no ops needed
Total ops = 2

Wait, let me recheck: after making nums[2]=4, left=[2,5] still has 5>4
but 5 is at idx=1 (left of median). If we set idx=1 to 4, sorted order maintained.
Actually greedy: fix median first, then fix violations on each side.
```

---

## Problem Description

Given a **0-indexed** integer array `nums` of **odd** length and an integer `k`, in one operation you can increase or decrease any element by 1. Return the **minimum** number of operations to make the **median** of `nums` equal to `k`. The median is the middle element after sorting.

Difficulty: Medium | Acceptance: 46.7%

```
Example 1:
  Input:  nums = [2,5,6,8,5], k = 4
  Output: 2

Example 2:
  Input:  nums = [2,5,6,8,5], k = 7
  Output: 3

Example 3:
  Input:  nums = [1,2,3,4,5,6,7], k = 4
  Output: 0
```

Constraints:

- `1 <= nums.length <= 2 * 10^5`
- `nums.length` is odd
- `1 <= nums[i] <= 10^9`
- `1 <= k <= 10^9`

---

## 📝 Interview Tips

1. **Clarify**: "Mảng luôn có độ dài lẻ? Trung vị là phần tử giữa sau khi sắp xếp?" / Confirm odd length; median is the exact middle element.
2. **Sort first**: "Sắp xếp để xác định trung vị và các vi phạm" / Sort to locate median and violations.
3. **Greedy logic**: "Bên trái median: nếu >k thì giảm xuống k; bên phải: nếu <k thì tăng lên k" / Left of median: shrink if >k; right: grow if <k.
4. **No need to fix already-correct**: "Bên trái <=k và bên phải >=k → không cần thay đổi" / Elements already on correct side of k need no ops.
5. **Edge cases**: "k đã là trung vị → 0 ops; tất cả phần tử bằng nhau" / If median already equals k, 0 ops.
6. **Follow-up**: "Nếu n chẵn? Median là trung bình 2 phần tử giữa — bài khác" / Even n changes median definition entirely.

---

## Solutions

```typescript
/**
 * Solution 1: Sort + Greedy Scan
 * Time: O(n log n) — sorting
 * Space: O(1) — in-place sort
 */
function minOperationsToMedian(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const mid = Math.floor(n / 2);
  let ops = 0;

  // Fix the median itself
  if (nums[mid] !== k) {
    ops += Math.abs(nums[mid] - k);
    nums[mid] = k;
  }

  // Fix left side: any element > k must be reduced to k
  for (let i = mid - 1; i >= 0; i--) {
    if (nums[i] > k) {
      ops += nums[i] - k;
    } else {
      break; // sorted: if this is <= k, all to the left are too
    }
  }

  // Fix right side: any element < k must be raised to k
  for (let i = mid + 1; i < n; i++) {
    if (nums[i] < k) {
      ops += k - nums[i];
    } else {
      break; // sorted: if this is >= k, all to the right are too
    }
  }

  return ops;
}

/**
 * Solution 2: Sort + Single-Pass (equivalent, slightly cleaner)
 * Time: O(n log n)
 * Space: O(1)
 */
function minOperationsToMedianV2(nums: number[], k: number): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const mid = Math.floor(n / 2);
  let ops = 0;

  for (let i = 0; i < n; i++) {
    if (i < mid && nums[i] > k) {
      // Left of median, too large
      ops += nums[i] - k;
    } else if (i === mid) {
      // Median must equal k
      ops += Math.abs(nums[i] - k);
    } else if (i > mid && nums[i] < k) {
      // Right of median, too small
      ops += k - nums[i];
    }
  }

  return ops;
}

// === Test Cases ===
console.log(minOperationsToMedian([2, 5, 6, 8, 5], 4)); // 2
console.log(minOperationsToMedian([2, 5, 6, 8, 5], 7)); // 3
console.log(minOperationsToMedian([1, 2, 3, 4, 5, 6, 7], 4)); // 0
console.log(minOperationsToMedianV2([2, 5, 6, 8, 5], 4)); // 2
console.log(minOperationsToMedianV2([5, 5, 5], 3)); // 6 (median=5, need 3, ops=2; left has 5>3, ops+=2)
```

---

## 🔗 Related Problems

- [Minimum Moves to Equal Array Elements](https://leetcode.com/problems/minimum-moves-to-equal-array-elements) — minimize ops to equalize
- [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals) — greedy with sorting
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — greedy scheduling
- [Largest Number](https://leetcode.com/problems/largest-number) — greedy comparator
- [Minimum Operations to Make Median of Array Equal to K — LeetCode](https://leetcode.com/problems/minimum-operations-to-make-median-of-array-equal-to-k) — problem page
