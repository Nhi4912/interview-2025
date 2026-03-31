---
layout: page
title: "Minimum Replacements to Sort the Array"
difficulty: Hard
category: Array
tags: [Array, Math, Greedy]
leetcode_url: "https://leetcode.com/problems/minimum-replacements-to-sort-the-array"
---

# Minimum Replacements to Sort the Array / Số Lần Thay Thế Tối Thiểu Để Sắp Xếp Mảng

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Greedy (Right-to-Left)
> **Frequency**: 📘 Tier 3 — Gặp ở 2 companies

## 🧠 Intuition / Tư Duy

> **Analogy:** Tưởng tượng bạn cần cắt các thanh gỗ từ phải sang trái sao cho mỗi thanh ≤ thanh tiếp theo. Thanh cuối cùng là "neo" — không thay đổi. Với mỗi thanh, cắt thành `ceil(a[i] / a[i+1])` mảnh bằng nhau, mỗi mảnh ≤ a[i+1]. Cập nhật giới hạn mới là `floor(a[i] / numPieces)`.

**Pattern Recognition:**

- Xử lý từ phải sang trái với phần tử cuối làm chuẩn
- Mỗi phần tử cần `pieces = ceil(a[i] / bound)` lần chia → tốn `pieces - 1` operations
- Bound mới = `floor(a[i] / pieces)` (phần tử nhỏ nhất sau khi chia đều)

**Visual:**

```
nums = [3,9,3], answer = 2

Start from right: bound = nums[2] = 3
i=1: nums[1]=9, pieces=ceil(9/3)=3, ops+=2, bound=floor(9/3)=3
i=0: nums[0]=3, pieces=ceil(3/3)=1, ops+=0, bound=floor(3/1)=3
→ ops = 2

nums = [1,2,3,4,5]  already sorted
i=3: pieces=ceil(4/5)=1, ops+=0, bound=4
i=2: pieces=ceil(3/4)=1, ops+=0, bound=3
... → ops = 0
```

## Problem Description

You can replace any element in `nums` with two elements that sum to it. Return the minimum number of replacements to make the array non-decreasing (sorted).

**Example 1:** `nums = [3,9,3]` → `2` (replace 9 → [3,6] giving [3,3,6,3]... or 9→[3,3,3]: [3,3,3,3] = 3 ops? Actually [3,9,3]: 9→[3,6]→[3,3,6,3] not sorted. Best: 9→[3,3,3] costs 2 → [3,3,3,3] ✓)

**Example 2:** `nums = [1,2,3,4,5]` → `0` (already sorted)

**Constraints:** `1 <= nums.length <= 10^5`, `1 <= nums[i] <= 10^9`.

## 📝 Interview Tips

1. **Clarify**: Thay thế 1 phần tử bằng 2 số có tổng bằng nó — confirm replace means split into exactly 2 parts summing to original.
2. **Approach**: Greedy từ phải sang trái — last element is anchor; work backwards maintaining upper bound.
3. **Edge cases**: Array already sorted → 0; single element → 0; all same → 0.
4. **Optimize**: O(n) one pass from right — no need to actually split, just count operations mathematically.
5. **Test**: `[100,1]` → 99 replacements (100 must be split into 100 pieces of 1 each → 99 ops).
6. **Follow-up**: What if we can also merge? — Different problem; greedy direction changes.

## Solutions

```typescript
/** Solution 1: Greedy Right-to-Left — minimize splits mathematically
 * Time: O(n) | Space: O(1)
 */
function minimumReplacement(nums: number[]): number {
  const n = nums.length;
  let ops = 0;
  let bound = nums[n - 1]; // Last element is fixed

  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] <= bound) {
      // Already ≤ next element, no split needed
      bound = nums[i];
      continue;
    }
    // Need to split nums[i] into pieces, each ≤ bound
    const pieces = Math.ceil(nums[i] / bound);
    ops += pieces - 1; // Each split costs 1 operation
    // The smallest piece becomes the new bound for element to the left
    bound = Math.floor(nums[i] / pieces);
  }
  return ops;
}

/** Solution 2: Same logic with explicit formula — easier to explain
 * Time: O(n) | Space: O(1)
 */
function minimumReplacement2(nums: number[]): number {
  let result = 0;
  let maxAllowed = nums[nums.length - 1];

  for (let i = nums.length - 2; i >= 0; i--) {
    const cur = nums[i];
    if (cur <= maxAllowed) {
      maxAllowed = cur;
    } else {
      // Split cur into k pieces where k = ceil(cur / maxAllowed)
      const k = Math.ceil(cur / maxAllowed);
      result += k - 1;
      // After splitting cur into k equal parts, min part = floor(cur/k)
      // This becomes the new upper bound for the previous element
      maxAllowed = Math.floor(cur / k);
    }
  }
  return result;
}

// Test cases
console.log(minimumReplacement([3, 9, 3])); // 2
console.log(minimumReplacement([1, 2, 3, 4, 5])); // 0
console.log(minimumReplacement([100, 1])); // 99
console.log(minimumReplacement([12, 9, 7, 6, 17, 19, 21])); // 2
console.log(minimumReplacement2([3, 9, 3])); // 2
console.log(minimumReplacement2([5, 5, 5])); // 0
```

## 🔗 Related Problems

| Problem                                                                                                                                      | Relationship                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous) | Greedy with array modification                |
| [Minimum Operations to Reduce X to Zero](https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero)                               | Greedy / sliding window on array operations   |
| [Divide Array in Sets of K Consecutive Numbers](https://leetcode.com/problems/divide-array-in-sets-of-k-consecutive-numbers)                 | Greedy grouping with mathematical constraints |
