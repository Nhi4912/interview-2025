---
layout: page
title: "Top K Frequent Elements"
difficulty: Medium
category: Array
tags: [Array, Hash Table, Heap, Bucket Sort]
leetcode_url: "https://leetcode.com/problems/top-k-frequent-elements/"
---

# Top K Frequent Elements / K Phần Tử Xuất Hiện Nhiều Nhất

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Heap / Bucket Sort
> **Frequency**: 🔥 Tier 1 — Gặp >70% interviews
> **See also**: [Find K Largest](../../sorting-searching/problems/02-find-k-largest-elements.md) | [Sort Colors](../../sorting-searching/problems/03-sort-colors.md)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có danh sách đơn hàng và muốn tìm 3 món bán chạy nhất. Cách 1: đếm từng món → sort theo số lượng → lấy top 3 (O(n log n)). Cách 2: dùng "giỏ" theo tần suất — giỏ #5 chứa các món bán được 5 lần → chỉ cần quét từ giỏ cao nhất xuống (O(n)).

**Pattern Recognition:**
- Signal: "top K" + "frequency" → **Min-Heap size K** (O(n log k)) hoặc **Bucket Sort** (O(n))
- Key: Count frequencies first (HashMap), then find top K
- Heap giữ K phần tử lớn nhất: khi heap.size > K → pop phần tử nhỏ nhất

**Visual — Bucket Sort approach:**
```
nums = [1,1,1,2,2,3], k = 2

Step 1 — Count frequencies:
  freq = {1:3, 2:2, 3:1}

Step 2 — Bucket by frequency (index = frequency):
  bucket[1] = [3]
  bucket[2] = [2]
  bucket[3] = [1]

Step 3 — Scan from high to low, collect until k:
  [1]  ← from bucket[3], count=1
  [1,2] ← from bucket[2], count=2 → done!

Output: [1, 2]
```

---

## Problem Description

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. The answer is guaranteed to be unique.

```
Example 1: nums = [1,1,1,2,2,3], k = 2 → [1,2]
Example 2: nums = [1], k = 1 → [1]
```

---

## 📝 Interview Tips

1. **Clarify**: "Can k equal n?" (yes) "Are there ties?" (guaranteed unique answer)
2. **Mention 3 approaches**: sort O(n log n) → heap O(n log k) → bucket O(n)
3. **Bucket Sort là optimal** nhưng heap thường được accept và dễ implement hơn
4. **Follow-up**: "What if data is streaming?" → Use a min-heap of size K

---

## Solutions

```typescript

/**
 * Solution 1: Sort by Frequency
 * Time: O(n log n), Space: O(n)
 */
function topKFrequent_sort(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}

/**
 * Solution 2: Min-Heap of size K (Optimal for streaming)
 *
 * Maintain a min-heap of size K. When heap > K, remove the minimum.
 * Remaining K elements are the most frequent.
 *
 * Time: O(n log k), Space: O(n + k)
 */
function topKFrequent_heap(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // Min-heap simulation using sorted array (in real interview, use a heap class)
  const heap: [number, number][] = []; // [num, freq]

  for (const [num, count] of freq) {
    heap.push([num, count]);
    heap.sort((a, b) => a[1] - b[1]); // min-heap by frequency
    if (heap.length > k) heap.shift();  // remove min
  }

  return heap.map(([num]) => num);
}

/**
 * Solution 3: Bucket Sort (O(n) — Optimal)
 *
 * Use frequency as bucket index. Max frequency = n.
 * Scan from high frequency to low, collect k elements.
 *
 * Time: O(n), Space: O(n)
 */
function topKFrequent(nums: number[], k: number): number[] {
  const freq = new Map<number, number>();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  // Buckets indexed by frequency (0 to n)
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq) {
    buckets[count].push(num);
  }

  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}

// === Test Cases ===
console.log(topKFrequent([1,1,1,2,2,3], 2)); // [1,2]
console.log(topKFrequent([1], 1));            // [1]
console.log(topKFrequent([4,1,1,1,2,2,3], 2)); // [1,2]

```

---

## 🔗 Related Problems

- [Find K Largest Elements](../../sorting-searching/problems/02-find-k-largest-elements.md) — heap pattern
- [Sort Colors](../../sorting-searching/problems/03-sort-colors.md) — bucket sort idea
- [Kth Largest Element in Array](../../sorting-searching/problems/02-find-k-largest-elements.md)
