---
layout: page
title: "Sort an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Divide and Conquer, Sorting, Heap (Priority Queue), Merge Sort]
leetcode_url: "https://leetcode.com/problems/sort-an-array"
---

# Sort an Array / Sắp Xếp Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Sorting Algorithms
> **Frequency**: 📘 Tier 3 | **Company tags**: various

## 🧠 Intuition / Tư Duy

**Giống thi đấu loại trực tiếp:** Merge Sort chia đôi liên tục rồi gộp có thứ tự — đảm bảo O(n log n) ổn định. Heap Sort dùng heap để luôn lấy nhỏ nhất/lớn nhất — O(n log n) in-place không ổn định.

**Pattern Recognition:**

- Signal: "sort without built-in + must be O(n log n)" → **Merge Sort / Heap Sort / Quick Sort**
- Merge Sort: stable, guaranteed O(n log n), O(n) extra space
- Heap Sort: in-place O(1) extra, not stable, O(n log n) always

**Visual (Merge Sort):**

```
[5,2,3,1] → split → [5,2] [3,1]
[5,2] → [5][2] → merge → [2,5]
[3,1] → [3][1] → merge → [1,3]
[2,5] + [1,3] → merge → [1,2,3,5] ✅

Merge step:
[2,5] [1,3]
 L↑    R↑   → pick 1 → [1]
 L↑     R↑  → pick 2 → [1,2]
  L↑    R↑  → pick 3 → [1,2,3]
   L↑      → pick 5 → [1,2,3,5]
```

## Problem Description

Given an array `nums`, sort it in ascending order **without using built-in sort**. Must run in O(n log n) time.

- Example 1: `[5,2,3,1]` → `[1,2,3,5]`
- Example 2: `[5,1,1,2,0,0]` → `[0,0,1,1,2,5]`

## 📝 Interview Tips

1. **Clarify**: Có duplicate không? Cần stable sort không? / Are there duplicates? Is stability required?
2. **Approach**: Merge Sort (stable) vs Heap Sort (in-place) vs Quicksort (avg best, worst O(n²)) / Know tradeoffs
3. **Edge cases**: Mảng rỗng, 1 phần tử, tất cả giống nhau / Empty, single element, all duplicates
4. **Optimize**: Quicksort với random pivot tránh worst case / Randomized pivot → expected O(n log n)
5. **Follow-up**: Sort linked list? Sort with limited memory? / Merge sort works for linked lists
6. **Complexity**: Merge/Heap: O(n log n) always; Quick: O(n log n) avg / Space: Merge O(n), Heap O(1)

## Solutions

```typescript
/** Solution 1: Merge Sort (stable, O(n log n) guaranteed)
 * Time: O(n log n) | Space: O(n)
 */
function sortArrayMerge(nums: number[]): number[] {
  if (nums.length <= 1) return nums;

  const merge = (left: number[], right: number[]): number[] => {
    const result: number[] = [];
    let i = 0,
      j = 0;
    while (i < left.length && j < right.length)
      result.push(left[i] <= right[j] ? left[i++] : right[j++]);
    return result.concat(left.slice(i), right.slice(j));
  };

  const mergeSort = (arr: number[]): number[] => {
    if (arr.length <= 1) return arr;
    const mid = arr.length >> 1;
    return merge(mergeSort(arr.slice(0, mid)), mergeSort(arr.slice(mid)));
  };

  const result = mergeSort(nums);
  for (let i = 0; i < nums.length; i++) nums[i] = result[i];
  return nums;
}

/** Solution 2: Heap Sort (in-place, O(n log n) always)
 * Time: O(n log n) | Space: O(1)
 */
function sortArray(nums: number[]): number[] {
  const n = nums.length;

  // Build max-heap
  const heapify = (n: number, i: number) => {
    let largest = i,
      l = 2 * i + 1,
      r = 2 * i + 2;
    if (l < n && nums[l] > nums[largest]) largest = l;
    if (r < n && nums[r] > nums[largest]) largest = r;
    if (largest !== i) {
      [nums[i], nums[largest]] = [nums[largest], nums[i]];
      heapify(n, largest);
    }
  };

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

  // Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    [nums[0], nums[i]] = [nums[i], nums[0]];
    heapify(i, 0);
  }
  return nums;
}

/** Solution 3: Randomized Quick Sort (O(n log n) expected)
 * Time: O(n log n) avg, O(n²) worst | Space: O(log n)
 */
function sortArrayQuick(nums: number[]): number[] {
  const quickSort = (lo: number, hi: number) => {
    if (lo >= hi) return;
    // Random pivot to avoid worst case
    const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[pivotIdx], nums[hi]] = [nums[hi], nums[pivotIdx]];
    const pivot = nums[hi];
    let p = lo;
    for (let i = lo; i < hi; i++) {
      if (nums[i] <= pivot) {
        [nums[i], nums[p]] = [nums[p], nums[i]];
        p++;
      }
    }
    [nums[p], nums[hi]] = [nums[hi], nums[p]];
    quickSort(lo, p - 1);
    quickSort(p + 1, hi);
  };
  quickSort(0, nums.length - 1);
  return nums;
}

// Tests
console.log(sortArrayMerge([5, 2, 3, 1])); // [1,2,3,5]
console.log(sortArray([5, 1, 1, 2, 0, 0])); // [0,0,1,1,2,5]
console.log(sortArrayQuick([3, 3, 3, 3])); // [3,3,3,3]
console.log(sortArray([])); // []
console.log(sortArrayMerge([1])); // [1]
console.log(sortArrayQuick([-5, 3, 2, -1, 0])); // [-5,-1,0,2,3]
```

## 🔗 Related Problems

| Problem                                                                                          | Relationship                    |
| ------------------------------------------------------------------------------------------------ | ------------------------------- |
| [Sort List](https://leetcode.com/problems/sort-list)                                             | Merge sort on linked list       |
| [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array) | Quickselect / Heap partial sort |
| [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists)                       | Merge sort merge step           |
