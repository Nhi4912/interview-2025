---
layout: page
title: "Binary Search"
difficulty: Easy
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/binary-search"
---

# Binary Search / Tìm Kiếm Nhị Phân

> **Track**: Shared | **Difficulty**: 🟢 Easy | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 7 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Giống như tìm từ trong từ điển — bạn mở ngay trang giữa, nhìn chữ cái, rồi bỏ đi một nửa không cần thiết. Lặp lại cho đến khi tìm ra từ. Mỗi bước giảm phạm vi tìm kiếm đi một nửa → O(log n).

**Pattern Recognition:**

- Signal: "sorted array" + "find target" → **Binary Search**
- Boundary quan trọng: `lo <= hi` (inclusive) vs `lo < hi` (exclusive upper)
- Tránh overflow: dùng `mid = lo + Math.floor((hi - lo) / 2)`

**Visual — Classic Binary Search:**

```
nums = [1, 3, 5, 7, 9, 11, 13],  target = 9
        0  1  2  3  4   5   6
        L              M        R

Step 1: lo=0, hi=6, mid=3 → nums[3]=7  < 9 → lo = mid+1 = 4
                              L   M    R
Step 2: lo=4, hi=6, mid=5 → nums[5]=11 > 9 → hi = mid-1 = 4
                              LR
Step 3: lo=4, hi=4, mid=4 → nums[4]=9 == 9 → return 4 ✅
```

---

## Problem Description

Given a sorted (ascending) integer array `nums` and an integer `target`, return the index of `target` if it exists, otherwise return `-1`. You must write an algorithm with **O(log n)** runtime. ([LeetCode 704](https://leetcode.com/problems/binary-search))

**Example 1:** `nums = [-1,0,3,5,9,12], target = 9` → `4`
**Example 2:** `nums = [-1,0,3,5,9,12], target = 2` → `-1`

**Constraints:** `1 <= nums.length <= 10⁴`, `-10⁴ <= nums[i], target <= 10⁴`, all elements unique, sorted ascending.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Mảng có duplicates không? Trả về index hay value?" / Any duplicates? Return index or value?
2. **Brute force** / Thô: Linear scan O(n) — đề yêu cầu O(log n) nên nói ngay sẽ dùng binary search
3. **Boundary** / Biên: `lo <= hi` (inclusive both ends) — khi `lo > hi` thì không còn phần tử nào
4. **Mid overflow** / Tránh overflow: `mid = lo + Math.floor((hi - lo) / 2)` thay vì `(lo + hi) / 2`
5. **Edge cases** / Biên: Target nhỏ hơn mọi phần tử, lớn hơn mọi phần tử, mảng 1 phần tử
6. **Variant** / Biến thể: "Find first/last occurrence" — vẫn binary search nhưng không dừng khi tìm thấy

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Time: O(n) — scan entire array
 * Space: O(1)
 */
function binarySearchLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}

/**
 * Solution 2: Iterative Binary Search (Optimal)
 * Time: O(log n) — halve search space each step
 * Space: O(1) — no extra memory
 *
 * Template: lo=0, hi=n-1, loop while lo<=hi
 * Move lo = mid+1 when target > mid, hi = mid-1 when target < mid
 */
function binarySearch(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    // Avoid potential overflow vs. (lo + hi) >> 1
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      lo = mid + 1; // target is in right half
    } else {
      hi = mid - 1; // target is in left half
    }
  }

  return -1; // target not found
}

/**
 * Solution 3: Recursive Binary Search
 * Time: O(log n)
 * Space: O(log n) — call stack depth
 */
function binarySearchRecursive(
  nums: number[],
  target: number,
  lo = 0,
  hi = nums.length - 1,
): number {
  if (lo > hi) return -1;
  const mid = lo + Math.floor((hi - lo) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) return binarySearchRecursive(nums, target, mid + 1, hi);
  return binarySearchRecursive(nums, target, lo, mid - 1);
}

// === Test Cases ===
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 9)); // 4
console.log(binarySearch([-1, 0, 3, 5, 9, 12], 2)); // -1
console.log(binarySearch([5], 5)); // 0
console.log(binarySearch([5], 3)); // -1
console.log(binarySearch([1, 2, 3, 4, 5], 1)); // 0  (left boundary)
console.log(binarySearch([1, 2, 3, 4, 5], 5)); // 4  (right boundary)
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Pattern                 | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ---------- |
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | Binary Search           | 🟡 Medium  |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                                                         | Binary Search on Answer | 🟡 Medium  |
| [Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix)                                                                           | Binary Search           | 🟡 Medium  |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                                                             | Binary Search           | 🟡 Medium  |
| [Guess Number Higher or Lower](https://leetcode.com/problems/guess-number-higher-or-lower)                                                       | Binary Search           | 🟢 Easy    |
