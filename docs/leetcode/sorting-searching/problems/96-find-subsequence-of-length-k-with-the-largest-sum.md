---
layout: page
title: "Find Subsequence of Length K With the Largest Sum"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Hash Table, Sorting, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/find-subsequence-of-length-k-with-the-largest-sum"
---

# Find Subsequence of Length K With the Largest Sum / Tìm Dãy Con Độ Dài K Có Tổng Lớn Nhất

> **Difficulty**: 🟢 Easy | **Category**: Sorting-Searching | **Pattern**: Sort by Value + Preserve Order

## 🧠 Intuition / Tư Duy

**Vietnamese analogy**: Như chọn k học sinh xuất sắc nhất để thi đội tuyển — chọn người điểm cao nhất, nhưng thứ tự ngồi trong đội phải giữ nguyên theo số thứ tự học sinh trong lớp.

**Pattern Recognition:**

- Select k largest values → sort by value descending, take top k → **Partial Sort**
- But output must maintain original order → sort selection by original index
- Two-pass: select indices, then emit in original order

**Visual:**

```
nums=[2,1,3,3], k=2
Sort by value desc: [(3,idx=2),(3,idx=3),(2,idx=0),(1,idx=1)]
Take top k=2: indices {2, 3}
Sort selected by index: [2, 3]
Result: [nums[2], nums[3]] = [3, 3]

nums=[-1,-2,3,4], k=3
Top 3 by value: idx=3(4), idx=2(3), idx=0(-1)
Sort by index: [0,2,3] → [-1,3,4]
```

## Problem Description

Given integer array `nums` and integer `k`, return a **subsequence** of `nums` having length `k` and the largest possible sum. A subsequence maintains relative order from the original array. If multiple valid answers exist, return any.

**Example:**

- nums=[2,1,3,3], k=2 → [3,3]
- nums=[-1,-2,3,4], k=3 → [-1,3,4]
- nums=[3,4,3,3], k=2 → [4,3] or [3,4] or [3,3]

**Constraints:** 1 ≤ k ≤ nums.length ≤ 1000, -10⁵ ≤ nums[i] ≤ 10⁵

## 📝 Interview Tips

1. **Clarify**: Can there be duplicate values? (Yes, pick any k of the top ones)
2. **Approach**: Get top-k indices by value, then sort those indices ascending, emit values
3. **Edge cases**: k=nums.length (return all), all elements equal, k=1 (return max)
4. **Optimize**: Use partial sort / heap for O(n log k) instead of O(n log n)
5. **Follow-up**: What if you need to return the actual subsequence indices?
6. **Complexity**: Time O(n log n), Space O(n)

## Solutions

```typescript
// Solution 1: Sort indices by value, take top-k, restore order — Time: O(n log n) | Space: O(n)
function maxSubsequence(nums: number[], k: number): number[] {
  // Create [value, originalIndex] pairs, sort by value descending
  const indexed = nums.map((v, i) => [v, i] as [number, number]);
  indexed.sort((a, b) => b[0] - a[0]);

  // Take top k indices, sort them back to original order
  const topK = indexed.slice(0, k).sort((a, b) => a[1] - b[1]);

  return topK.map(([v]) => v);
}

// Solution 2: Partial Sort with Min-Heap — Time: O(n log k) | Space: O(k)
function maxSubsequence2(nums: number[], k: number): number[] {
  // Min-heap of size k: keep the k largest elements
  // Simple simulation using array + sort (JS doesn't have built-in heap)
  const heap: [number, number][] = []; // [value, index]

  for (let i = 0; i < nums.length; i++) {
    heap.push([nums[i], i]);
    heap.sort((a, b) => a[0] - b[0]); // min at front
    if (heap.length > k) heap.shift(); // remove smallest
  }

  // Sort selected by original index
  heap.sort((a, b) => a[1] - b[1]);
  return heap.map(([v]) => v);
}

// Solution 3: Set of top-k indices — Time: O(n log n) | Space: O(n)
function maxSubsequence3(nums: number[], k: number): number[] {
  const order = [...nums.keys()].sort((a, b) => nums[b] - nums[a]);
  const selected = new Set(order.slice(0, k));

  const result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (selected.has(i)) result.push(nums[i]);
  }
  return result;
}

// Tests
console.log(maxSubsequence([2, 1, 3, 3], 2)); // [3,3]
console.log(maxSubsequence([-1, -2, 3, 4], 3)); // [-1,3,4]
console.log(maxSubsequence([3, 4, 3, 3], 2)); // [4,3]
console.log(maxSubsequence([1], 1)); // [1]
console.log(maxSubsequence([5, 4, 3, 2, 1], 3)); // [5,4,3]
```

## 🔗 Related Problems

| Problem                                                                                | Relationship                            |
| -------------------------------------------------------------------------------------- | --------------------------------------- |
| [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin) | Select k elements by metric, return all |
| [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)       | Select k by frequency                   |
| [Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array)   | Select single element by rank           |
