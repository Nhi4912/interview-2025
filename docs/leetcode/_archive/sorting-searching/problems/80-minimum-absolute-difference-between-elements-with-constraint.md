---
layout: page
title: "Minimum Absolute Difference Between Elements With Constraint"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search, Ordered Set]
leetcode_url: "https://leetcode.com/problems/minimum-absolute-difference-between-elements-with-constraint"
---

# Minimum Absolute Difference Between Elements With Constraint / Hiệu Tuyệt Đối Nhỏ Nhất Với Ràng Buộc

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search + Ordered Set
> **Frequency**: 📘 Tier 3 — Gặp ở 3 companies
> **See also**: [Partition Array Into Two Arrays to Minimize Sum Difference](https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference) | [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom)

---

## 🧠 Intuition / Tư Duy

**Analogy (VN):** Với mỗi `nums[i]`, bạn cần tìm giá trị gần nhất trong số các `nums[j]` đã xử lý trước đó (với `j <= i - x`). Đây là bài toán "predecessor/successor" — dùng sorted structure để tìm giá trị sàn (floor) hoặc trần (ceiling) của `nums[i]`.

```
nums = [4, 3, 2, 4], x = 2
                ↑ i=2: look at nums[j] where j <= 0 → {4}
                  floor(2)=4, ceil(2)=4 → |2-4|=2

i=3: look at nums[j] where j <= 1 → {4,3}
  floor(4)=4 → |4-4|=0  ✅ answer = 0
```

---

## Problem Description

Given an array `nums` and integer `x`, find the **minimum absolute difference** between `nums[i]` and `nums[j]` where `|i - j| >= x`.

- **Example 1:** `nums = [4,3,2,4], x = 2` → `0` (nums[0]=4 and nums[3]=4)
- **Example 2:** `nums = [5,3,2,10,15], x = 1` → `1` (nums[1]=3 and nums[2]=2)

---

## 📝 Interview Tips

- 🗂️ **Ordered Set:** JS không có built-in SortedSet — dùng sorted array + binary search, hoặc simulate với array
- 🔍 **Floor/Ceiling search:** Với mỗi `nums[i]`, tìm giá trị ≤ và ≥ `nums[i]` trong cửa sổ `[0..i-x]`
- 📅 **Sliding window insert:** Chèn `nums[i-x]` vào sorted array mỗi bước → O(n) insert, O(log n) search
- 📊 **Complexity:** O(n log n) overall với binary search; O(n²) nếu dùng naive insert
- ⚠️ **Edge:** `x = 0` → compare any pair; `x >= n` → impossible (no valid pair)
- 💡 **Optimization:** Dùng balanced BST (TreeSet) trong Java/C++; trong JS dùng sorted array là đủ

---

## Solutions

### Solution 1: Sorted array + binary search (O(n²) insert, O(n log n) search)

```typescript
/**
 * Maintain sorted array of elements at distance >= x
 * Insert new elements with binary search, find closest value
 * Time: O(n²)  Space: O(n)
 */
function minAbsoluteDifference(nums: number[], x: number): number {
  const sorted: number[] = [];
  let ans = Infinity;

  const insertSorted = (val: number) => {
    let lo = 0,
      hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, val);
  };

  const findClosest = (val: number): number => {
    if (sorted.length === 0) return Infinity;
    let lo = 0,
      hi = sorted.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    let best = Math.abs(sorted[lo] - val);
    if (lo > 0) best = Math.min(best, Math.abs(sorted[lo - 1] - val));
    return best;
  };

  for (let i = 0; i < nums.length; i++) {
    if (i >= x) {
      insertSorted(nums[i - x]);
      ans = Math.min(ans, findClosest(nums[i]));
    }
  }
  return ans === Infinity ? 0 : ans;
}

console.log(minAbsoluteDifference([4, 3, 2, 4], 2)); // 0
console.log(minAbsoluteDifference([5, 3, 2, 10, 15], 1)); // 1
```

### Solution 2: Optimized with upper_bound helper

```typescript
/**
 * Clean binary search for floor and ceiling in sorted window
 * Time: O(n²) insert + O(n log n) search  Space: O(n)
 */
function minAbsoluteDifference2(nums: number[], x: number): number {
  const sorted: number[] = [];
  let ans = Infinity;

  const lowerBound = (val: number): number => {
    let lo = 0,
      hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  for (let i = x; i < nums.length; i++) {
    // Add nums[i - x] into sorted structure
    const insertPos = lowerBound(nums[i - x]);
    sorted.splice(insertPos, 0, nums[i - x]);

    // Find closest to nums[i]
    const pos = lowerBound(nums[i]);
    if (pos < sorted.length) ans = Math.min(ans, Math.abs(sorted[pos] - nums[i]));
    if (pos > 0) ans = Math.min(ans, Math.abs(sorted[pos - 1] - nums[i]));
    if (ans === 0) return 0;
  }
  return ans === Infinity ? 0 : ans;
}

console.log(minAbsoluteDifference2([4, 3, 2, 4], 2)); // 0
console.log(minAbsoluteDifference2([1, 2, 3, 4], 3)); // 3
```

---

## 🔗 Related Problems

| Problem                                                                                                           | Difficulty | Connection                               |
| ----------------------------------------------------------------------------------------------------------------- | ---------- | ---------------------------------------- |
| [Minimum Absolute Difference](https://leetcode.com/problems/minimum-absolute-difference/)                         | 🟢 Easy    | Same concept without distance constraint |
| [Find Target Indices After Sorting Array](https://leetcode.com/problems/find-target-indices-after-sorting-array/) | 🟢 Easy    | Binary search on sorted array            |
| [132 Pattern](https://leetcode.com/problems/132-pattern/)                                                         | 🟡 Medium  | Ordered set for predecessor/successor    |
| [Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)         | 🔴 Hard    | Sorted structure + binary search         |
| [Number of Flowers in Full Bloom](https://leetcode.com/problems/number-of-flowers-in-full-bloom/)                 | 🔴 Hard    | Binary search on events                  |
