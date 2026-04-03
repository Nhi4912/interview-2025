---
layout: page
title: "Wiggle Sort"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Greedy, Sorting]
leetcode_url: "https://leetcode.com/problems/wiggle-sort"
---

# Wiggle Sort / Sắp Xếp Lắc Lư

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Greedy One-Pass
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống sóng biển:** số chẵn-index là đáy sóng (≤ hàng xóm), số lẻ-index là đỉnh sóng (≥ hàng xóm). Chỉ cần một lần duyệt, mỗi khi vi phạm thì swap — đảm bảo cả hai hàng xóm cùng lúc.

**Pattern Recognition:**

- Signal: "rearrange in-place with alternating inequality" → **Greedy Single-Pass Swap**
- Điều kiện: `nums[0]≤nums[1]≥nums[2]≤nums[3]...` — even index ≤ neighbors, odd index ≥ neighbors
- Swap cục bộ không phá vỡ điều kiện đã đúng trước đó

**Visual:**

```
nums = [3, 5, 2, 1, 6, 4]
i=0(even): nums[0]=3 ≤ nums[1]=5? ✅ no swap
i=1(odd):  nums[1]=5 ≥ nums[2]=2? ✅ no swap
i=2(even): nums[2]=2 ≤ nums[3]=1? ❌ swap → [3,5,1,2,6,4]
i=3(odd):  nums[3]=2 ≥ nums[4]=6? ❌ swap → [3,5,1,6,2,4]
i=4(even): nums[4]=2 ≤ nums[5]=4? ✅ no swap
Result: [3,5,1,6,2,4] → 3≤5≥1≤6≥2≤4 ✅
```

## Problem Description

Given an integer array `nums`, reorder it **in-place** such that `nums[0] ≤ nums[1] ≥ nums[2] ≤ nums[3] ≥ ...`. Multiple valid answers exist.

- Example 1: `[3,5,2,1,6,4]` → `[3,5,1,6,2,4]` (one valid output)
- Example 2: `[6,6,5,6,3,8]` → `[6,6,5,6,3,8]`

## 📝 Interview Tips

1. **Clarify**: In-place hay tạo array mới? / Modify in-place or create new array? In-place
2. **Approach**: Một lần duyệt, swap khi vi phạm điều kiện / Single pass: swap on violation
3. **Edge cases**: Array ≤ 1 phần tử → trivially valid / All equal → already valid
4. **Optimize**: Sort O(n log n) rồi interleave cũng đúng nhưng chậm hơn / O(n) greedy beats O(n log n) sort approach
5. **Follow-up**: Wiggle Sort II (strict inequality nums[0]<nums[1]>nums[2])? / Strict version needs median trick
6. **Complexity**: Time O(n), Space O(1) / Optimal single-pass in-place

## Solutions

```typescript
/** Solution 1: Sort + Interleave
 * Time: O(n log n) | Space: O(n)
 */
function wiggleSortSort(nums: number[]): void {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  const result = new Array(n);
  // Place small values at even indices, large at odd
  let lo = 0,
    hi = Math.floor((n + 1) / 2); // split point
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) result[i] = sorted[lo++];
    else result[i] = sorted[hi++];
  }
  for (let i = 0; i < n; i++) nums[i] = result[i];
}

/** Solution 2: Greedy One-Pass (O(n) in-place)
 * Time: O(n) | Space: O(1)
 */
function wiggleSort(nums: number[]): void {
  for (let i = 0; i < nums.length - 1; i++) {
    // Even index: should be valley (≤ next)
    // Odd index: should be peak (≥ next)
    if ((i % 2 === 0 && nums[i] > nums[i + 1]) || (i % 2 === 1 && nums[i] < nums[i + 1])) {
      [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
    }
  }
}

/** Solution 3: Greedy with explicit conditions
 * Time: O(n) | Space: O(1)
 */
function wiggleSortV2(nums: number[]): void {
  const swap = (i: number, j: number) => ([nums[i], nums[j]] = [nums[j], nums[i]]);
  for (let i = 1; i < nums.length; i++) {
    const shouldBeGreater = i % 2 === 1; // odd index should be peak
    if (shouldBeGreater && nums[i] < nums[i - 1]) swap(i, i - 1);
    if (!shouldBeGreater && nums[i] > nums[i - 1]) swap(i, i - 1);
  }
}

// Helper to validate wiggle property
function isWiggle(nums: number[]): boolean {
  for (let i = 1; i < nums.length; i++) {
    if (i % 2 === 1 && nums[i] < nums[i - 1]) return false;
    if (i % 2 === 0 && nums[i] > nums[i - 1]) return false;
  }
  return true;
}

// Tests
const a1 = [3, 5, 2, 1, 6, 4];
wiggleSort(a1);
console.log(a1, isWiggle(a1)); // wiggle + true

const a2 = [1, 1, 1, 1];
wiggleSort(a2);
console.log(a2, isWiggle(a2)); // [1,1,1,1] + true (equal is ok)

const a3 = [6, 6, 5, 6, 3, 8];
wiggleSortV2(a3);
console.log(a3, isWiggle(a3)); // wiggle + true

const a4 = [1, 3, 2, 2, 3, 1];
wiggleSortSort(a4);
console.log(a4, isWiggle(a4)); // wiggle + true

const a5 = [5];
wiggleSort(a5);
console.log(a5); // [5]
```

## 🔗 Related Problems

| Problem                                                                                            | Relationship                            |
| -------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii)                                     | Strict inequality version, needs median |
| [Sort Colors](https://leetcode.com/problems/sort-colors)                                           | In-place rearrangement                  |
| [Rearrange Array Elements by Sign](https://leetcode.com/problems/rearrange-array-elements-by-sign) | Alternating placement                   |
