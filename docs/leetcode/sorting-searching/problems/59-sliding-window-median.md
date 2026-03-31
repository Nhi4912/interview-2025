---
layout: page
title: "Sliding Window Median"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Hash Table, Sliding Window, Heap (Priority Queue)]
leetcode_url: "https://leetcode.com/problems/sliding-window-median"
---

# Sliding Window Median / Trung Vị Cửa Sổ Trượt

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Sliding Window + Sorted Insertion
> **Frequency**: 📘 Tier 3 — Gặp ở 5 companies

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có cửa sổ k phần tử trượt qua mảng. Mỗi bước thêm 1 phần tử vào và bỏ 1 ra, cần tính trung vị nhanh. Cách đơn giản: duy trì **mảng đã sort** — chèn vào đúng vị trí (O(k)), xóa phần tử cũ (O(k)), đọc median O(1).

**Pattern Recognition:**

- Signal: "median of sliding window" → **Sorted structure + O(k) insertion/deletion**
- Optimal (interview-ready): sorted array with binary-search insertion O(nk)
- True optimal O(n log k): two heaps (max-heap lower half + min-heap upper half) with lazy deletion

**Visual — Sorted window slides forward:**

```
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k = 3

Window [1,3,-1] → sorted [-1,1,3]  → median = 1
Window [3,-1,-3] → sorted [-3,-1,3] → median = -1
Window [-1,-3,5] → sorted [-3,-1,5] → median = -1
Window [-3,5,3]  → sorted [-3,3,5]  → median = 3
Window [5,3,6]   → sorted [3,5,6]   → median = 5
Window [3,6,7]   → sorted [3,6,7]   → median = 6

Result: [1,-1,-1,3,5,6]  ✅
```

---

## Problem Description

Cho mảng số `nums` và số nguyên `k`, trả về mảng trung vị của mọi cửa sổ kích thước k khi trượt từ trái sang phải. Trung vị của k phần tử sorted: phần tử giữa nếu k lẻ, hoặc trung bình hai phần tử giữa nếu k chẵn. ([LeetCode 480](https://leetcode.com/problems/sliding-window-median))

- Example 1: `nums=[1,3,-1,-3,5,3,6,7], k=3` → `[1,-1,-1,3,5,6]`
- Example 2: `nums=[1,2,3,4,2,3,1,4,2], k=5` → `[2,3,3,3,2]`
- Example 3: `nums=[1], k=1` → `[1]`

Constraints: `1 ≤ k ≤ nums.length ≤ 10⁵`, `−2³¹ ≤ nums[i] ≤ 2³¹ − 1`

---

## 📝 Interview Tips

1. **Clarify**: "k chẵn → trung bình 2 phần tử giữa, float? k lẻ → phần tử giữa" / Confirm median definition for even/odd k
2. **Brute force**: "Sort lại window mỗi bước O(k log k) → O(nk log k) total" / Re-sort each window
3. **Sorted insertion**: "Binary search tìm vị trí chèn O(log k), splice O(k) → O(nk)" / Clear O(nk) approach for interviews
4. **True optimal**: "Two heaps (max-heap dưới + min-heap trên) + lazy deletion → O(n log k)" / Mention but complex to implement
5. **Deletion**: "Khi xóa phần tử cũ, dùng binary search để tìm chính xác vị trí" / Binary search for deletion too
6. **Overflow**: "Trung bình 2 số int có thể overflow → chia 2.0 không phải /2" / (a + b) may overflow; use (a/2.0 + b/2.0) or BigInt

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — sort each window
 * Time: O(n × k log k) — sort k elements for each of n windows
 * Space: O(k) — sorted window copy
 */
function slidingWindowMedianBruteForce(nums: number[], k: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= nums.length - k; i++) {
    const window = nums.slice(i, i + k).sort((a, b) => a - b);
    const median = k % 2 === 1 ? window[k >> 1] : (window[k / 2 - 1] + window[k / 2]) / 2;
    result.push(median);
  }
  return result;
}

/**
 * Solution 2: Sorted Array with Binary-Search Insertion (Interview-Ready)
 * Time: O(n × k) — binary search O(log k) + splice O(k) per element
 * Space: O(k) — the sorted window
 * Note: True O(n log k) uses two heaps with lazy deletion (complex; mentioned below)
 */
function slidingWindowMedian(nums: number[], k: number): number[] {
  const result: number[] = [];
  const win: number[] = []; // Maintained in sorted order

  // Binary search: first index where win[i] >= val
  function loBound(val: number): number {
    let lo = 0,
      hi = win.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (win[m] < val) lo = m + 1;
      else hi = m;
    }
    return lo;
  }

  for (let i = 0; i < nums.length; i++) {
    // Insert nums[i] into sorted window
    win.splice(loBound(nums[i]), 0, nums[i]);

    // Remove expired element (left edge of previous window)
    if (i >= k) {
      win.splice(loBound(nums[i - k]), 1);
    }

    // Compute median once window is full
    if (i >= k - 1) {
      result.push(k % 2 === 1 ? win[k >> 1] : (win[k / 2 - 1] + win[k / 2]) / 2);
    }
  }
  return result;
}

/*
 * Solution 3 (concept): Two Heaps with Lazy Deletion — O(n log k)
 * lo: max-heap (lower half), hi: min-heap (upper half)
 * Invariant: lo.size() === hi.size() (k even) or lo.size() === hi.size() + 1 (k odd)
 * On add: push to lo, move lo.peek() to hi, rebalance
 * On remove: mark in a "delayed" map, rebalance after evicting stale tops
 * Median: lo.peek() (k odd) or (lo.peek() + hi.peek()) / 2 (k even)
 */

// === Test Cases ===
console.log(slidingWindowMedian([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [1,-1,-1,3,5,6]
console.log(slidingWindowMedian([1, 2, 3, 4, 2, 3, 1, 4, 2], 5)); // [2,3,3,3,2]
console.log(slidingWindowMedian([1], 1)); // [1]
console.log(slidingWindowMedian([2, 1], 2)); // [1.5]
```

---

## 🔗 Related Problems

- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream) — two-heap approach without deletion
- [Divide an Array Into Subarrays With Minimum Cost II](https://leetcode.com/problems/divide-an-array-into-subarrays-with-minimum-cost-ii) — sorted window with heap
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum) — sliding window for max (simpler than median)
- [Task Scheduler](https://leetcode.com/problems/task-scheduler) — heap-based frequency management
- [Sliding Window Median — LeetCode](https://leetcode.com/problems/sliding-window-median) — problem page
