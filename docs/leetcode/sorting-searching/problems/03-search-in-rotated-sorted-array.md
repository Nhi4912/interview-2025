---
layout: page
title: "Search in Rotated Sorted Array"
difficulty: Medium
category: Sorting/Searching
tags: [Array, Binary Search, Divide and Conquer]
leetcode_url: "https://leetcode.com/problems/search-in-rotated-sorted-array/"
---

# Search in Rotated Sorted Array / Tìm Kiếm Trong Mảng Đã Xoay

> **Track**: Shared | **Difficulty**: 🟡 Medium | **Pattern**: Binary Search (Modified)
> **Frequency**: 🔥 Tier 1 — câu hỏi binary search phổ biến nhất, xuất hiện ở mọi công ty
> **See also**: [First Bad Version](./02-first-bad-version.md) | Find Minimum in Rotated Sorted Array

---

## 🧠 Intuition / Tư Duy

**Analogy:** Bạn có danh bạ điện thoại bị xáo từ trang giữa: nửa đầu và nửa sau vẫn có thứ tự riêng, nhưng trang cuối có thể đứng trước trang đầu. Mấu chốt: **ít nhất một nửa luôn được sắp xếp đúng** — ta dùng nửa đó để quyết định tìm ở đâu.

**Pattern Recognition:**

- Signal: "rotated sorted array", "O(log n)" → **Modified binary search, xác định nửa nào sorted**
- So sánh `nums[left]` với `nums[mid]` để biết nửa nào có thứ tự liên tục
- Sau đó kiểm tra target có nằm trong nửa sorted đó không

**Visual — Tìm target=0 trong [4,5,6,7,0,1,2]:**

```
left=0, right=6, mid=3 → nums[3]=7
nums[left]=4 <= nums[mid]=7 → left half [4,5,6,7] sorted
target=0: không nằm trong [4..7) → search right: left=4

left=4, right=6, mid=5 → nums[5]=1
nums[left]=0 <= nums[mid]=1 → left half [0,1] sorted
target=0: nằm trong [0..1) → search left: right=4

left=4, right=4, mid=4 → nums[4]=0 == target → return 4 ✓
```

---

## Problem Description

An ascending array `nums` was rotated at some pivot. Given `nums` and a `target`, return the index of `target` or `-1` if not found. Must run in **O(log n)**.

```
Example 1: nums = [4,5,6,7,0,1,2], target = 0 → 4
Example 2: nums = [4,5,6,7,0,1,2], target = 3 → -1
Example 3: nums = [1],             target = 0 → -1
```

Constraints:

- 1 <= nums.length <= 5000; all values unique
- -10⁴ <= nums[i], target <= 10⁴

---

## 📝 Interview Tips

1. **Clarify**: "Mảng có thể không bị xoay không?" / "Can array be non-rotated?" (yes, handle it — left half always sorted)
2. **Brute force**: Linear scan O(n) — quá đơn giản, chỉ để baseline
3. **Optimize**: Modified binary search O(log n) — xác định nửa sorted, kiểm tra target range
4. **Edge cases**: mảng 1 phần tử; không bị xoay (đã sorted); target ở điểm xoay
5. **Follow-up**: "Mảng có duplicate?" → Search in Rotated Sorted Array II (LeetCode 81), worst case O(n)

---

## Solutions

```typescript
/**
 * Solution 1: Linear Scan (Brute Force)
 * Time: O(n) — scan every element
 * Space: O(1)
 */
function searchLinear(nums: number[], target: number): number {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}

/**
 * Solution 2: Modified Binary Search (Optimal)
 * Time: O(log n) — halve search space each iteration
 * Space: O(1)
 *
 * Key insight: one half is ALWAYS sorted after a rotation.
 * Use the sorted half to decide which side to search.
 */
function search(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) return mid;

    // Determine which half is sorted
    if (nums[left] <= nums[mid]) {
      // Left half [left..mid] is sorted
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1; // target is in sorted left half
      } else {
        left = mid + 1; // target must be in right half
      }
    } else {
      // Right half [mid..right] is sorted
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1; // target is in sorted right half
      } else {
        right = mid - 1; // target must be in left half
      }
    }
  }

  return -1;
}

// === Test Cases ===
console.log(search([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(search([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(search([1], 0)); // -1
console.log(search([1], 1)); // 0
console.log(search([3, 1], 1)); // 1
console.log(search([1, 2, 3, 4, 5], 3)); // 2 (no rotation case)
```

---

## 🔗 Related Problems

- [First Bad Version](./02-first-bad-version.md) — binary search với predicate condition
- Find Minimum in Rotated Sorted Array — tìm điểm xoay bằng binary search tương tự
