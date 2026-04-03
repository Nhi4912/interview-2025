---
layout: page
title: "Search in Rotated Sorted Array II"
difficulty: Medium
category: Sorting-Searching
tags: [Array, Binary Search]
leetcode_url: "https://leetcode.com/problems/search-in-rotated-sorted-array-ii"
---

# Search in Rotated Sorted Array II / Tìm Kiếm trong Mảng Xoay có Trùng Lặp

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search
> **Frequency**: 📘 Tier 3 — Gặp ở 8 companies
> **See also**: [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)

---

## 🧠 Intuition / Tư Duy

**Analogy:** Hãy nghĩ đến một đĩa nhạc vinyl bị đặt lệch vòng — dãy số vẫn tăng dần nhưng bắt đầu từ giữa chừng. Bí quyết là luôn xác định được "nửa nào còn thẳng hàng" để bỏ đi nửa còn lại. Khi có trùng lặp, đôi khi không xác định được — ta thu hẹp dần bằng cách tăng `lo` và giảm `hi`.

**Pattern Recognition:**

- Signal: "rotated sorted array" + "find target" + "duplicates allowed" → **Modified Binary Search**
- Trick: khi `nums[lo] == nums[mid] == nums[hi]` → không xác định được nửa sorted → `lo++, hi--`
- Worst case O(n) với tất cả phần tử giống nhau như `[1,1,1,1,1]`

**Visual — Rotated Array with Duplicates:**

```
nums = [2, 5, 6, 0, 0, 1, 2],  target = 0
        L        M           R

Step 1: mid=3 → nums[3]=0 == target → return true ✅

Trickier case: nums = [1,0,1,1,1], target = 0
                       L     M   R
Step 1: nums[lo]=1 == nums[mid]=1 == nums[hi]=1 → lo++, hi--
               L  M  R
Step 2: nums[lo]=0 <= nums[mid]=1 (left sorted)
        target=0 in [0,1) → hi = mid-1
               LR
Step 3: lo=hi=1 → nums[1]=0 == target → return true ✅
```

---

## Problem Description

Given an integer array `nums` rotated at an unknown pivot (may contain **duplicates**) and an integer `target`, return `true` if `target` is in `nums`, otherwise `false`. ([LeetCode 81](https://leetcode.com/problems/search-in-rotated-sorted-array-ii))

**Example 1:** `nums = [2,5,6,0,0,1,2], target = 0` → `true`
**Example 2:** `nums = [2,5,6,0,0,1,2], target = 3` → `false`

**Constraints:** `1 <= nums.length <= 5000`, `-10⁴ <= nums[i], target <= 10⁴`.

---

## 📝 Interview Tips

1. **Clarify** / Làm rõ: "Có duplicate không? Trả về index hay boolean?" / Duplicates present? Return bool or index?
2. **Brute force** / Thô: `nums.includes(target)` O(n) — trivial, nêu ngay rồi đề xuất binary search
3. **Key challenge** / Thách thức: Duplicates khiến ta không thể biết nửa nào sorted khi `nums[lo]==nums[mid]`
4. **Handle dup** / Xử lý trùng: Khi `nums[lo] == nums[mid] == nums[hi]` → `lo++; hi--` để thu hẹp
5. **Sorted half** / Nửa sorted: Nếu left sorted và target nằm trong đó → search left, ngược lại → search right
6. **Complexity** / Độ phức tạp: O(log n) trung bình, O(n) worst case (mảng toàn giá trị giống nhau)

---

## Solutions

```typescript
/**
 * Solution 1: Brute Force — Linear Scan
 * Time: O(n)
 * Space: O(1)
 */
function searchRotatedIIBrute(nums: number[], target: number): boolean {
  return nums.includes(target);
}

/**
 * Solution 2: Modified Binary Search
 * Time: O(log n) average, O(n) worst case (all duplicates)
 * Space: O(1)
 *
 * Three cases at each step:
 *  1. nums[lo]==nums[mid]==nums[hi]: can't determine sorted half → shrink both ends
 *  2. Left half sorted (nums[lo] <= nums[mid]): check if target ∈ [lo, mid)
 *  3. Right half sorted (nums[mid] <= nums[hi]): check if target ∈ (mid, hi]
 */
function search(nums: number[], target: number): boolean {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);

    if (nums[mid] === target) return true;

    // Can't determine which half is sorted — shrink both ends
    if (nums[lo] === nums[mid] && nums[mid] === nums[hi]) {
      lo++;
      hi--;
    } else if (nums[lo] <= nums[mid]) {
      // Left half [lo..mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1; // target in left half
      } else {
        lo = mid + 1; // target in right half
      }
    } else {
      // Right half [mid..hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1; // target in right half
      } else {
        hi = mid - 1; // target in left half
      }
    }
  }

  return false;
}

// === Test Cases ===
console.log(search([2, 5, 6, 0, 0, 1, 2], 0)); // true
console.log(search([2, 5, 6, 0, 0, 1, 2], 3)); // false
console.log(search([1, 0, 1, 1, 1], 0)); // true
console.log(search([1, 1, 1, 1, 1], 0)); // false (worst case O(n))
console.log(search([3, 1, 1], 3)); // true
```

---

## 🔗 Related Problems

| Problem                                                                                                                                          | Pattern                 | Difficulty |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | ---------- |
| [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array)                                                   | Binary Search           | 🟡 Medium  |
| [Find Minimum in Rotated Sorted Array II](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii)                                 | Binary Search           | 🔴 Hard    |
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array) | Binary Search           | 🟡 Medium  |
| [Find Peak Element](https://leetcode.com/problems/find-peak-element)                                                                             | Binary Search           | 🟡 Medium  |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas)                                                                         | Binary Search on Answer | 🟡 Medium  |
