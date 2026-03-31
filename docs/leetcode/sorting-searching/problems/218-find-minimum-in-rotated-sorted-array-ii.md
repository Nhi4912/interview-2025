---
layout: page
title: "Find Minimum in Rotated Sorted Array II"
difficulty: Hard
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii"
---

# Find Minimum in Rotated Sorted Array II / Tìm Giá Trị Nhỏ Nhất Trong Mảng Xoay (Có Trùng Lặp)

> **Track**: Shared | **Difficulty**: 🔴 Hard | **Pattern**: Binary Search
> **Frequency**: ⭐ Tier 1 — Kinh điển về binary search với duplicates
> **See also**: [Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array) | [Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Tìm điểm uốn trong vòng tròn có các số đã sort — nhưng có số trùng lặp. Khi `nums[mid] > nums[hi]` → minimum ở bên phải. Khi `nums[mid] < nums[hi]` → minimum ở bên trái (hoặc tại mid). Khi `nums[mid] == nums[hi]` → không chắc chắn, nhưng có thể thu hẹp an toàn bằng `hi--`.

**Pattern Recognition:**

- Signal: "rotated sorted array" + "duplicates" → **Binary Search with hi-- shrink**
- Phần khó: duplicates phá vỡ khả năng phân biệt half nào chứa minimum
- Safe operation khi equal: `hi--` — nếu nums[hi] là minimum, mid cũng bằng nó nên không mất

**Visual — nums=[3,3,1,3,3]:**

```
lo=0, hi=4
mid=2: nums[2]=1 < nums[4]=3 -> hi=2
mid=1: nums[1]=3 > nums[2]=1 -> lo=2
lo==hi=2 -> return nums[2]=1 ✅

nums=[2,2,2,0,1]:
lo=0, hi=4
mid=2: nums[2]=2 == nums[4]=1? No, 2>1 -> lo=3
mid=3: nums[3]=0 < nums[4]=1 -> hi=3
lo==hi=3 -> return nums[3]=0 ✅
```

---

## Problem Description

Given a rotated sorted array `nums` (may contain duplicates), find and return the minimum element.

```
Example 1: nums=[1,3,5]        -> 1
Example 2: nums=[2,2,2,0,1]    -> 0
Example 3: nums=[3,3,1,3,3]    -> 1
Example 4: nums=[4,5,6,7,0,1,2] -> 0
```

---

## 📝 Interview Tips

1. **Tại sao hi-- khi equal?** Nếu nums[hi] == nums[mid], ta không thể quyết định nửa nào chứa min. Nhưng nếu nums[hi] là min, mid cũng bằng nó → an toàn giảm hi
2. **Phân biệt I và II**: Version I không có duplicates → O(log n) guaranteed. Version II → O(n) worst case (all equal)
3. **Worst case O(n)**: nums=[1,1,1,...,1,0,1] → hi-- nhiều lần
4. **So sánh mid với hi**: Luôn so với `hi` chứ không phải `lo` — tránh edge case khi array không xoay
5. **Hỏi follow-up**: "Nếu có thể tìm index min?" → Track idx = lo khi kết thúc
6. **Complexity**: Time O(log n) average, O(n) worst case; Space O(1)

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Baseline)
 * Time O(n), Space O(1)
 */
function findMinLinear(nums: number[]): number {
  return Math.min(...nums);
}

/**
 * Solution 2: Binary Search with Duplicate Handling (Optimal Average)
 * Time O(log n) average, O(n) worst case (all duplicates)
 * Space O(1)
 *
 * Key rules:
 * - nums[mid] > nums[hi]: rotation point is in right half -> lo = mid+1
 * - nums[mid] < nums[hi]: min is in left half (incl. mid) -> hi = mid
 * - nums[mid] == nums[hi]: can't determine -> safely shrink hi--
 */
function findMin(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;

  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] > nums[hi]) {
      // Rotation point is in the right half
      lo = mid + 1;
    } else if (nums[mid] < nums[hi]) {
      // Minimum is in the left half (mid might be the min)
      hi = mid;
    } else {
      // nums[mid] == nums[hi]: can't determine which side
      // Safe: if nums[hi] is the min, nums[mid] equals it and is preserved
      hi--;
    }
  }

  return nums[lo];
}

/**
 * Solution 3: Binary Search comparing with lo (alternative)
 * Works by comparing nums[mid] to nums[lo] to find pivot.
 * Time O(log n) average, O(n) worst with duplicates.
 */
function findMin3(nums: number[]): number {
  let lo = 0, hi = nums.length - 1;

  while (lo < hi) {
    // Shrink duplicates from both ends first
    while (lo < hi && nums[lo] === nums[hi]) hi--;
    if (lo >= hi) break;

    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}

// --- Quick inline tests ---
console.log(findMin([1, 3, 5]));           // 1
console.log(findMin([2, 2, 2, 0, 1]));     // 0
console.log(findMin([3, 3, 1, 3, 3]));     // 1
console.log(findMin([4, 5, 6, 7, 0, 1, 2])); // 0
console.log(findMin([1]));                  // 1
console.log(findMin([1, 1]));               // 1
console.log(findMin3([2, 2, 2, 0, 1]));    // 0
```

---

## 🔗 Related Problems

| Problem | Relationship |
| ------- | ------------ |
| [154. Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/) | This problem |
| [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Same without duplicates — O(log n) guaranteed |
| [81. Search in Rotated Sorted Array II](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/) | Search target in rotated with duplicates |
| [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Search without duplicates |
| [852. Peak Index in a Mountain Array](https://leetcode.com/problems/peak-index-in-a-mountain-array/) | Binary search on unimodal array |
