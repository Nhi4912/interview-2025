---
layout: page
title: "Kth Largest Element in an Array"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Divide and Conquer, Sorting, Heap, Quickselect]
leetcode_url: "https://leetcode.com/problems/kth-largest-element-in-an-array/"
---

# Kth Largest Element in an Array / Phần Tử Lớn Thứ K trong Mảng

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Min Heap / Quick Select
> **Frequency**: ⭐ Tier 2 — Gặp ~60% interviews
> **See also**: [Merge Sorted Array](./01-merge-sorted-array.md) | [Search in Rotated Array](./03-search-in-rotated-sorted-array.md) | [Median of Two Sorted Arrays](./04-median-of-two-sorted-arrays.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn tổ chức giải đấu game với N người và cần tìm người đứng hạng k mà không cần xếp hạng toàn bộ. Cách thông minh: duy trì "phòng chờ top k" (min-heap kích thước k). Ai vào nhưng yếu hơn người dở nhất trong phòng thì bị loại ngay. Cuối cùng, người dở nhất trong top k chính là hạng k.

**Pattern Recognition:**

- Signal: "kth largest", "without full sort" → **Min Heap of size k** (O(n log k)) or **Quick Select** (O(n) avg)
- Min Heap insight: keep k largest seen so far → the minimum in the heap = kth largest overall
- Quick Select: like quicksort but recurse only on ONE side containing target index → O(n) average

**Visual — nums=[3,2,1,5,6,4], k=2 (Min Heap approach):**

```
Maintain min-heap of size k=2:

num=3: heap=[3]           (size 1 ≤ k)
num=2: heap=[2,3]         (size 2 = k)
num=1: 1 < heap.min(2) → skip
num=5: push → heap=[2,3,5] → size>k → pop 2 → heap=[3,5]
num=6: push → heap=[3,5,6] → size>k → pop 3 → heap=[5,6]
num=4: push → heap=[4,5,6] → size>k → pop 4 → heap=[5,6]

heap.min() = 5 ✅  (kth largest = min of top-k heap)
```

---

## Problem Description

Given an integer array `nums` and integer `k`, return the **kth largest** element in sorted order (not kth distinct).

```
Example 1: nums=[3,2,1,5,6,4], k=2         → 5
Example 2: nums=[3,2,3,1,2,4,5,5,6], k=4   → 4
Example 3: nums=[1], k=1                   → 1
```

Constraints:

- 1 <= k <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4

---

## 📝 Interview Tips

1. **Clarify**: kth largest in sorted order, not kth distinct? Can array have duplicates? / Lớn thứ k theo vị trí sắp xếp, không phải k giá trị phân biệt?
2. **Brute force**: Sort descending → `nums[k-1]`. O(n log n), simple to code / Sắp xếp giảm dần, trả index k-1. Đơn giản nhất.
3. **Optimize**: Min Heap size k → O(n log k); Quick Select → O(n) average / Min-heap tốt khi k << n; Quick Select là optimal cho trường hợp chung.
4. **Edge cases**: k=1 (return max), k=n (return min), all duplicates, single element / k=1 là max, k=n là min, mảng toàn số giống nhau.
5. **Follow-up**: "Can you do O(n)?" → Quick Select with random pivot / Hỏi thêm Quick Select; mention Median-of-Medians cho O(n) guaranteed.

---

## Solutions

```typescript
/**
 * Solution 1: Sort Descending (Brute Force)
 * Time: O(n log n) — sort dominates
 * Space: O(1) — in-place sort (note: modifies input array)
 */
function findKthLargestSort(nums: number[], k: number): number {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

/**
 * Solution 2: Min Heap of Size k (Optimal for k << n)
 * Time: O(n log k) — n pushes, each O(log k)
 * Space: O(k) — heap holds at most k elements
 */
function findKthLargest(nums: number[], k: number): number {
  // JS has no built-in heap; simulate with sorted array (acceptable for interviews)
  const heap: number[] = [];

  const heapPush = (val: number) => {
    heap.push(val);
    heap.sort((a, b) => a - b); // min at index 0
  };

  for (const num of nums) {
    heapPush(num);
    if (heap.length > k) heap.shift(); // evict minimum (not in top k)
  }

  return heap[0]; // min of top-k = kth largest overall
}

/**
 * Solution 3: Quick Select (Optimal — O(n) average)
 * Time: O(n) average, O(n²) worst — random pivot avoids worst case in practice
 * Space: O(1) — in-place partitioning, O(log n) recursion stack on average
 */
function findKthLargestQuickSelect(nums: number[], k: number): number {
  const target = nums.length - k; // kth largest = (n-k)th smallest index

  function quickSelect(left: number, right: number): number {
    // Random pivot avoids O(n²) worst case on sorted/reverse-sorted input
    const pivotIdx = left + Math.floor(Math.random() * (right - left + 1));
    [nums[pivotIdx], nums[right]] = [nums[right], nums[pivotIdx]];
    const pivot = nums[right];
    let i = left;

    for (let j = left; j < right; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[right]] = [nums[right], nums[i]]; // pivot to final position

    if (i === target) return nums[i];
    return i < target ? quickSelect(i + 1, right) : quickSelect(left, i - 1);
  }

  return quickSelect(0, nums.length - 1);
}

// === Test Cases ===
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
console.log(findKthLargestQuickSelect([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargestSort([1], 1)); // 1
```

---

## 🔗 Related Problems

- [Merge Sorted Array](./01-merge-sorted-array.md) — sorting fundamentals prerequisite
- [Median of Two Sorted Arrays](./04-median-of-two-sorted-arrays.md) — harder order-statistic problem
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) — same "top k" pattern with heap + frequency map
- [Kth Smallest Element in BST](../tree-graph/problems/10-kth-smallest-element-in-a-bst.md) — same "kth element" concept in BST structure
